#include <fstream>
#include <stdlib.h>

static std::vector<unsigned long long> readWeights (std::string filename) {
    /*
        Read weights from a file.

        @param filename A string describing the file(path) of the file to open.
        @return A vector of unsigned long ints describing the weights read from the file.
        @exception an exception will be thrown when the file cannot be open / read
        or the file format is broken.
    */
    // the result to fill out
    std::vector<unsigned long long> result;
    // open file and read in ...
    std::fstream myfile;
    try {
        std::string line;
        std::fstream myfile(filename);
        if ( myfile.is_open() ) {
            size_t lineNo = 0;
            while ( std::getline(myfile, line) ) {
                lineNo++;
                trim(line);
                if ( line[0] == '#' || line[0] == ';' || line.empty() ) {
                    continue;
                }
//                std::cerr << "XXX '" << line << "'" << std::endl; 
                result.push_back( atoi( line.c_str() ) );
            }
        }  else {
            throw std::string("ERROR: Unable to read file '" + filename + "'. Please check file spelling, existence and permissions!");
        }
        myfile.close();
    } catch (...) {
        myfile.close();
        throw;
    }
    return result;
}
