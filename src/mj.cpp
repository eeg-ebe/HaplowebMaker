#include "algo.cpp"
#include "fastaAlignmentReader.cpp"
#include "weightsReader.cpp"
#include <ctime>
#include <iostream>
#include <stdlib.h>
#include <string>
#include <unordered_map>

time_t starttime, endtime;

// === DEBUG FUNCTIONS ===
void printCSEQUENCES (CSEQUENCES seq) {
    std::cout << "CSEQUENCES:\n";
    std::cout << " names: ";
    for (std::vector<std::string>::iterator it = seq.names.begin(); it != seq.names.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << '\n';
    std::cout << " originalSequence: " << seq.originalSequence << "\n";
    std::cout << " reducedSequence: " << seq.reducedSequence << "\n";
    std::cout << " pos (" << &seq.pos << "): ";
    for (std::vector<size_t>::iterator it = seq.pos.begin(); it != seq.pos.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << '\n';
}

void printCSEQUENCES_VECT (std::vector<CSEQUENCES> v) {
    for (std::vector<CSEQUENCES>::iterator it = v.begin(); it != v.end(); ++it) {
        printCSEQUENCES(*it);
    }
}

void printMatrix (unsigned long long * matrix, size_t l) {
    std::cout << "MATRIX:\n";
    for (size_t i = 0; i < l; i++) {
        for (size_t j = 0; j < l; j++) {
            std::cout << " " << matrix[i * l + j];
        }
        std::cout << "\n";
    }
}

void printDelta (DELTA d) {
    std::cout << "DELTA: (i: " << d.i << ", j: " << d.j << ", d: " << d.distance << ")\n";
}

void printDeltas (std::vector<DELTA> v) {
    for (std::vector<DELTA>::iterator it = v.begin(); it != v.end(); ++it) {
        printDelta(*it);
    }
}

void printULLVector (std::vector<unsigned long long> v) {
    for (std::vector<unsigned long long>::iterator it = v.begin(); it != v.end(); ++it) {
        std::cout << " " << *it;
    }
    std::cout << "\n";
}

// === OUTPUT RESULTS FUNCTIONS ===
std::string getOrigSeq ( CSEQUENCES s, CSEQUENCES lookup ) {
    std::string result = s.originalSequence;
    if ( result.empty() ) {
        // need to reconstruct sequence via lookup
        result += lookup.originalSequence;
        for ( size_t i = 0; i < s.pos.size(); i++ ) {
            result[s.pos[i]] = s.reducedSequence[i];
        }
    }
    return result;
}
void outputSeqs ( std::vector<CSEQUENCES> * mySeqs ) {
    size_t i = 0;
    for ( std::vector<CSEQUENCES>::iterator it = mySeqs->begin(); it != mySeqs->end(); ++it ) {
        std::cout << "+NODE " << i << " " << (*it).names.size() << std::endl;
        std::vector<std::string> names = (*it).names;
        for ( std::vector<std::string>::iterator it2 = names.begin(); it2 != names.end(); ++it2 ) {
            std::cout << "NAME " << (*it2) << std::endl;
        }
        std::cout << "SEQ " << getOrigSeq(*it, mySeqs->at(0)) << std::endl;
        i++;
    }
}

void outputConnections ( std::vector<OUTPUT_CONNECTION> * connects ) {
    for ( std::vector<OUTPUT_CONNECTION>::iterator it = connects->begin(); it != connects->end(); ++it ) {
        std::cout << "+CON " << (*it).ids.i << " " << (*it).ids.j << " " << (*it).weight << " " << (*it).pos.size() << std::endl;
        std::cout << "POS";
        for (std::vector<size_t>::iterator it2 = (*it).pos.begin(); it2 != (*it).pos.end(); ++it2) {
            std::cout << " " << *it2;
        }
        std::cout << std::endl;
    }
}

static std::string getSeqNameIdentifier ( std::string s ) {
    size_t pos = s.find_last_of('_');
    if ( pos == std::string::npos ) {
        return s;
    }
    return std::string(s, 0, pos);
}
void outputLinks ( std::vector<CSEQUENCES> * mySeqs, unsigned long long * weights ) {
    // ok, we iterate over all nodes and see which pairs have the same id followed by _XXX
    // pairs of nodes
    for ( std::vector<CSEQUENCES>::size_type seq1id = 0; seq1id != mySeqs->size(); seq1id++ ) {
        // fast skip (non sampled sequences)
        if ( (mySeqs->at(seq1id)).names.size() == 0 ) {
            continue;
        }
        for ( std::vector<CSEQUENCES>::size_type seq2id = seq1id+1; seq2id != mySeqs->size(); seq2id++ ) {
            // fast skip (non sampled sequences)
            if ( (mySeqs->at(seq2id)).names.size() == 0 ) {
                continue;
            }
            // count links between the two sequences
            size_t counter = 0, icounter = 0, diff = 0;
            std::stringstream ss;
            // for names
            for ( std::vector<std::string>::iterator name1it = (mySeqs->at(seq1id)).names.begin(); name1it != (mySeqs->at(seq1id)).names.end(); ++name1it ) {
                std::string name1 = getSeqNameIdentifier(*name1it);
                for ( std::vector<std::string>::iterator name2it = (mySeqs->at(seq2id)).names.begin(); name2it != (mySeqs->at(seq2id)).names.end(); ++name2it) {
                    std::string name2 = getSeqNameIdentifier(*name2it);
                    if ( name1 == name2 ) {
                        icounter++;
                    }
                }
                if ( icounter > 0 ) {
                    counter += icounter;
                    ss << "NAME " << name1 << " " << icounter << std::endl;
                    icounter = 0;
                }
            }
            // output
            if ( counter > 0 ) {
                std::cout << "+LINK " << seq1id << " " << seq2id << " " << counter << " " << compareSequences(mySeqs->at(seq1id), mySeqs->at(seq2id), weights) << " " << seqsDiffer(mySeqs->at(seq1id), mySeqs->at(seq2id)).size() <<  std::endl;
                std::cout << ss.str();
            }
        }
    }
}

// === MJ METHODS FUNCTIONS ===
void mj ( std::string fastaInputFile, unsigned long long epsilon, std::string ws ) {
    std::vector<CSEQUENCES> mySeqs;

    std::cerr << "=== READING IN FASTA ALIGNMENT FILE '" << fastaInputFile << "' ===" << std::endl;
    time(&starttime);
    mySeqs = readFastAlignment ( fastaInputFile );
    time(&endtime);
    std::cerr << "=== END READING IN FASTA ALIGNMENT FILE (" << endtime-starttime << "s used) ===" << std::endl;

    // trivial cases
    if ( mySeqs.size() == 0 ) {
        std::cerr << "No sequences given ... Quitting!" << std::endl;
        return; // nothing to do
    }

    // create weights
    std::cerr << "=== INIT WEIGHTS '" << fastaInputFile << "' ===" << std::endl;
    time(&starttime);
    unsigned long long weights[mySeqs[0].reducedSequence.length()];
    if ( ws.empty() || ws == "-" ) {
        for (size_t i = 0; i < mySeqs[0].reducedSequence.length(); i++) {
            weights[i] = 1;
        }
    } else { // read from file
        const std::vector<unsigned long long> wsv = readWeights( ws );
        if ( wsv.size() != mySeqs[0].originalSequence.length() ) {
            std::stringstream ss;
            ss << "Size of weights and sequence length differ ... (" << wsv.size() << " vs. " << mySeqs[0].originalSequence.length() << ")";
            throw ss.str();
        }
        for (size_t i = 0; i < mySeqs[0].pos.size(); i++) {
            weights[i] = wsv[mySeqs[0].pos.at(i)];
        }
    }
//    unsigned long long weights[5] = {1,3,2,1,2};
    time(&endtime);
    std::cerr << "=== END INIT WEIGHTS (" << endtime-starttime << "s used) ===" << std::endl;

    // output diff pos
    std::cout << "+";
    for ( size_t iii = 0; iii < mySeqs[0].pos.size(); iii++ ) {
        std::cout << " " << mySeqs[0].pos[iii];
    }
    std::cout << std::endl;

    // another trivial case
    if ( mySeqs.size() == 1 ) {
        std::cerr << "WARNING: Only one sequence given!" << std::endl;
        outputSeqs(&mySeqs);
        outputLinks(&mySeqs, weights);
        return;
    } else if ( mySeqs.size() == 2 ) {
        std::cerr << "WARNING: Only two sequence given!" << std::endl;
        outputSeqs(&mySeqs);
        SEQ_PAIR_IDS ids { .i = 0, .j = 1 };
        OUTPUT_CONNECTION p { .ids = ids, .weight = compareSequences(mySeqs[0], mySeqs[1], weights), .pos = mySeqs[0].pos };
        std::vector<OUTPUT_CONNECTION> connects;
        connects.push_back(p);
        outputConnections( &connects );
        outputLinks(&mySeqs, weights);
        return;
    }

    // ok, we need the actual algo
    std::cerr << "=== MJ ALGO ===" << std::endl;
    time(&starttime);

    size_t newlyFound = 1; // run loop at least once
    while ( newlyFound != 0 ) {
        // fills out the unique deltas vector
        std::vector<DELTAS> uniqueDeltas = step1 ( mySeqs, weights );
        // create an epsilon relaxed spanning tree with this sequences
        igraph_t g = step2 ( &mySeqs, &uniqueDeltas, epsilon );
        // remove obsolets
        size_t obsoletes = step3 ( &mySeqs, &g );
        if ( obsoletes > 0 ) { // in the paper it is written go back to step2
            igraph_destroy(&g); // destroy graph for next round
            continue; // but actually redo step 1 too (that does not change anything in the results - but it is easier since elsewise we would have to filter out certain distances from &uniqueDeltas ...)
        }
        // median vector construction
        newlyFound = step4 ( &mySeqs, &g, epsilon, weights );
        // destroy graph for next round
        igraph_destroy(&g);
    }
    std::vector<OUTPUT_CONNECTION> connects = step5 ( &mySeqs, weights );

    time(&endtime);
    std::cerr << "=== END MJ ALGO (" << endtime-starttime << "s used) ===" << std::endl;

    // output results
    outputSeqs(&mySeqs);
    outputConnections( &connects );
    outputLinks(&mySeqs, weights);
}

int main (int argc, char* argv[]) {
    std::cerr << "MJ version 1.0.0" << std::endl;
    if (argc >= 4) {
        try {
            mj ( std::string(argv[1]), atoi(argv[2]), std::string(argv[3]) );
        } catch (std::string exc) {
            std::cerr << exc << "\n";
            return 1;
        }
    } else {
        std::cerr << "MISSING ARGUMENTS" << std::endl;
        std::cerr << std::endl;
        std::cerr << "USAGE:" << std::endl;
        std::cerr << argv[0] << " fastaAlignment epsilon weights" << std::endl;
        std::cerr << std::endl;
        std::cerr << "where:" << std::endl;
        std::cerr << "  fastaAlignment The alignment in fasta form to read in.\n" << std::endl;
        std::cerr << "  epsilon        The epsilon parameter of the mj algorithm.\n" << std::endl;
        std::cerr << "  weights        The weights file to read in.\n" << std::endl;
        return 2;
    }
    return 0;
}
