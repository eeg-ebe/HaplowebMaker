//#include "algo.cpp"
#include <algorithm>
#include <cctype>
#include <fstream>
#include <functional>
#include <iostream>
#include <locale>
#include <sstream>
#include <unordered_map>
#include <vector>

/**
Function to read an alignment in fasta form.
*/

// tks to stackoverflow (http://stackoverflow.com/questions/216823/whats-the-best-way-to-trim-stdstring) for the trim functions
// trim from start
// trim from start (in place)
static void ltrim(std::string &s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(),
            std::not1(std::ptr_fun<int, int>(std::isspace))));
}

// trim from end (in place)
static void rtrim(std::string &s) {
    s.erase(std::find_if(s.rbegin(), s.rend(),
            std::not1(std::ptr_fun<int, int>(std::isspace))).base(), s.end());
}

// trim from both ends (in place)
static void trim(std::string &s) {
    ltrim(s);
    rtrim(s);
}
// end tks

static void throwExc ( size_t lineNo, std::string errorMsg ) {
    std::stringstream ss;
    ss << "ERROR (line: " << lineNo << "): " << errorMsg;
    throw ss.str();
}

static void addSequence (
        size_t lineNo,
        std::vector<CSEQUENCES> &result,
        std::unordered_map<std::string,size_t> &mymap,
        size_t &sequenceLength,
        std::string &seqName,                           // the name of the sequence to add
        std::string &seqSequence) {                     // the sequence to add
    // sequence to add is not given at the very beginning - just continue if this is the case ...
    if ( seqName.empty() ) {
        return;
    }
    if ( seqSequence.empty() ) {
        throwExc ( lineNo, "Missing sequence for sequence name '" + seqName + "'" );
    }
    // check the sequence length
    if ( sequenceLength != 0 && seqSequence.length() != sequenceLength ) {
        throwExc ( lineNo, "Sequences differ in length! Please align them first!" );
    }
    sequenceLength = seqSequence.length();
    // actually add the sequence
    if ( mymap.count( seqSequence ) > 0 ) { // if the exact sequence has already been seen previously
        // add name to element
        result[mymap[seqSequence]].names.push_back(seqName);
    } else {
        // create new CSEQUENCES
        CSEQUENCES ele;
        ele.names.push_back(seqName),
        ele.originalSequence = seqSequence;
        // add new sequence to map
        mymap[seqSequence] = result.size();
        // add sequence to result vector
        result.push_back(ele);
    }
}

static bool cmpFastaByFreq ( CSEQUENCES d1, CSEQUENCES d2 ) {
    return d1.names.size() > d2.names.size();
}
static std::vector<CSEQUENCES> readFastAlignment (std::string filename) {
    /*
        Read an alignment from a fasta file.

        @param filename A string describing the file(path) of the file to open.
        @return A vector of CSEQUENCES describing the sequences read from the file.
        @exception an exception will be thrown when the file cannot be open / read
        or the file format is broken.
    */
    // the result to fill out
    std::vector<CSEQUENCES> result;
    // the size of each sequence
    size_t sequenceLength = 0;
    // a map to determine which sequences have already be read in
    std::unordered_map<std::string,size_t> mymap;
    // open file and read in ...
    std::fstream myfile;
    try {
        std::string line;
        std::fstream myfile(filename);
        if ( myfile.is_open() ) {
            std::string seqName = std::string();
            std::string seqSequence = std::string();
            size_t lineNo = 0;
            while ( std::getline(myfile, line) ) {
                lineNo++;
                trim(line);
                if ( line.empty() || line[0] == '#' || line[0] == ';' ) {
                    // skip maybe occuring empty lines in fasta file
                    // otherwise line[0] will throw errors in code later on ...
                    // as well as lines starting with '#'/';' sign (little extra)
                    continue;
                }
                if ( line[0] == '>' ) {
                    // save old sequence (if existent)
                    addSequence(lineNo, result, mymap, sequenceLength, seqName, seqSequence);
                    // initialize for next readin
                    seqName = line.substr(1); // chop of first ">" character
                    ltrim(seqName);           // remove possible spaces at the beginning
                    if ( seqName.empty() ) {
                        throwExc ( lineNo, "Missing sequence name!" );
                    }
                    seqSequence = std::string();
                    seqSequence.reserve( sequenceLength );
                } else {
                    if ( seqName.empty() ) {
                        throwExc ( lineNo, "No name for sequence given!" );
                    }
                    seqSequence += line;
                }
            }
            // save last sequence of file (if existence)
            addSequence(lineNo, result, mymap, sequenceLength, seqName, seqSequence);
        } else {
            throw std::string("ERROR: Unable to read file '" + filename + "'. Please check file spelling, existence and permissions!");
        }
        myfile.close();
    } catch(...) {
        myfile.close();
        throw; // retrow occured exception
    }
    // check if we have read in at least one sequence (otherwise next code will fail)
    if ( result.size() == 0 ) {
        return result;
    }
    // sequence have been read in ... Now determine positions where the sequence differ
    std::vector<size_t> interestingPositions;
    size_t seqLength = result[0].originalSequence.length();
    interestingPositions.reserve(seqLength); // worst case, all positions are interesting
    for (size_t currentPosition = 0; currentPosition < seqLength; currentPosition++) {
        char myChar = result[0].originalSequence[currentPosition];
        for (std::vector<CSEQUENCES>::iterator it = result.begin(); it != result.end(); ++it) {
            if ( (*it).originalSequence[currentPosition] != myChar ) {
                interestingPositions.push_back(currentPosition);
                break; // next position
            }
        }
    }
    // compact sequences
    for (std::vector<CSEQUENCES>::iterator it = result.begin(); it != result.end(); ++it) {
        std::string ss;
        ss.reserve( interestingPositions.size() );
        size_t i = 0;
        for (std::vector<size_t>::iterator it2 = interestingPositions.begin(); it2 != interestingPositions.end(); ++it2) {
            ss.append(1, (*it).originalSequence[*it2]);
        }
        (*it).reducedSequence = ss;
        (*it).pos = interestingPositions;
    }
    // sort the sequences by frequence
    std::sort( result.begin(), result.end(), cmpFastaByFreq );
    // return everything
    return result;
}
