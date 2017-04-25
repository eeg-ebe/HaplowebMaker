#include <cmath>
#include <iostream>
#include <sstream>
#include <vector>
#include <stdlib.h>
#include <time.h>
#include <cstdlib>

// data structure
struct EDGE {
    size_t from;   // edge from
    size_t to;     // edge to
    std::vector< size_t > muts; // the mutations represented by this edge (can also be used to get the number of muts in the graph)
    unsigned long long dist;    // the distance of this edge in the plotted graph
    unsigned long long weight;  // the weight associated to this edge of the graph
    bool link = false;
};

struct NODE {
    size_t nodeId; // the node id
    size_t size;   // size of the node in the graph to draw
    std::vector <EDGE> edges; // the edges connected to this node.
    std::vector <std::string> names; // names of this node
    std::string seq;  // the sequence of this node
    std::vector <double> pos; // the position where to draw the node
    bool draw = true;
};

// read in the structure from stdin
static bool cmpNodes ( NODE n1, NODE n2 ) {
    return n1.nodeId < n2.nodeId;
}
void readStdin (std::vector < NODE > * network) {
    // TODO: this is a not optimal but working parser
    // it will not work, if nodeIds not starting from 0 etc.
    // comment # and ;
    // error/warning messages
    // fix this
    std::string line;
    while ( std::getline(std::cin, line) ) {
        if ( line[0] == '+' ) {
            std::stringstream ss(line);
            std::string objDesc;
            ss >> objDesc;
            // ok, interesting line
            if ( objDesc == "+NODE" ) {
                // parse line
                size_t nodeId, nodeSize;
                ss >> nodeId;
                ss >> nodeSize;
                // add node
                NODE n;
                n.nodeId = nodeId;
                n.size = nodeSize;
                network->push_back(n);
            } else if ( objDesc == "+CON" ) {
                size_t from, to, weight, nr;
                ss >> from;
                ss >> to;
                ss >> weight;
                ss >> nr;
                EDGE e;
                e.from = from;
                e.to = to;
                e.dist = nr * 100;
                e.weight = weight;
                network->at( from ).edges.push_back( e );
                EDGE f;
                f.from = to;
                f.to = from;
                f.dist = nr * 100;
                f.weight = weight;
                network->at( to ).edges.push_back( f );
            } else if ( objDesc == "+LINK" ) {
                // read line content
                size_t from, to, nrCon, w, nrPos;
                ss >> from;
                ss >> to;
                ss >> nrCon;
                ss >> w;
                ss >> nrPos;
                // calculate drawing dist
                double l = nrPos * nrPos;
                l = sqrt((l * l) / 4 + (l * l) / 16);
                nrPos = (int) (l * 100);
                // ok, add a "link edge"
                // for the later optimisation add an invisible node
                NODE n;
                n.nodeId = network->size();
                n.size = 0;
                n.draw = false;
                network->push_back(n);
                // connect from and to over n
                EDGE a;
                a.from = from;
                a.to = n.nodeId;
                a.dist = nrPos;
                a.weight = w;
                network->at( from ).edges.push_back( a );
                EDGE b;
                b.from = to;
                b.to = n.nodeId;
                b.dist = nrPos;
                b.weight = w;
                network->at( to ).edges.push_back( b );
                EDGE c;
                c.from = n.nodeId;
                c.to = from;
                c.dist = nrPos;
                c.weight = w;
                network->at( n.nodeId ).edges.push_back( c );
                EDGE d;
                d.from = n.nodeId;
                d.to = to;
                d.dist = nrPos;
                d.weight = w;
                network->at( n.nodeId ).edges.push_back( d );
            }
        }
    }
}

// spring layout
double getRandDouble () { // random double between 10000 and -10000
    double f = (double)rand() / RAND_MAX;  // I know that rand() is not the perfect random generator
    return 20000 * f - 10000;              // but it is good enough for a random layout (and nothing more)
}
std::vector< double > getRandVect ( unsigned int dim ) {
    std::vector< double > result;
    for ( unsigned int i = 0; i < dim; i++ ) {
        result.push_back( getRandDouble() );
    }
    return result;
}
double calcDist ( std::vector<double> p1, std::vector<double> p2 ) {
    double s = 0;
    for ( size_t i = 0; i < p1.size(); i++ ) {
        double x = (p1[i] - p2[i]);
        s += x * x;
    }
    return sqrt(s);
}
void springLayout (
    std::vector < NODE > * myNet, // the network
    unsigned int dim,             // dimension
    unsigned int iterations,
    double t ) {  // the number of iterations
    // ok, randomly intialize dimension (if needed)
    std::vector<double> v0; // first node = is fixed at 0,0
    for ( size_t i = 0; i < dim; i++) {
        v0.push_back(0);
    }
    myNet->at(0).pos = v0;
    for ( size_t i = 1; i < myNet->size(); i++ ) {
        if ( dim != myNet->at(i).pos.size() ) {
            myNet->at(i).pos = getRandVect ( dim );
        }
    }
    // precalculate and initalize things
    std::vector < std::vector<double> > force; // the force to apply on each node
    double dt = t / (double) (iterations + 1);
    // actually do spring layout
    for ( unsigned int timestep = 0; timestep < t; timestep++ ) {
        // reset force vector
        force.empty();
        force.resize( myNet->size() );
        // calculate force on nodes
        // fix first node at 0,0 => start with nodeId = 1
        for ( size_t nodeId = 1; nodeId < myNet->size(); nodeId++ ) {
            // create a new starting empty force vector
            std::vector<double> f;
            for ( unsigned int i = 0; i < dim; i++ ) {
                f.push_back( 0.0 );
            }
            // for each other node
            for ( size_t oNodeId = 0; oNodeId < myNet->size(); oNodeId++ ) {
                // min distance of 0.1
                double distance = calcDist( myNet->at(nodeId).pos, myNet->at(oNodeId).pos );
                if ( distance < 0.1 ) {
                    continue;
                }
                // ok, add pos
                double w_ = 1 / (distance * distance);
                for ( unsigned int i = 0; i < dim; i++ ) { // -c * k * k / d (k=optimal length)
                    f[i] -= w_ * myNet->at(oNodeId).pos[i];
                }
            }
            // for each edge
            for ( size_t edgeId = 0; edgeId < myNet->at(nodeId).edges.size(); edgeId++ ) {
                size_t oNodeId = myNet->at(nodeId).edges[edgeId].to;
                unsigned long long w = myNet->at(nodeId).edges[edgeId].weight;
                double distance = calcDist( myNet->at(nodeId).pos, myNet->at(oNodeId).pos );
std::cerr << ";" << distance << " ";
                double w_ = (w - distance);
                for ( unsigned int i = 0; i < dim; i++ ) { // c * d * d / k
                    f[i] += w_ * myNet->at(oNodeId).pos[i];
                }
            }
            // add force
            force[nodeId] = f;
        }
        // actually change positions
        for ( size_t nodeId = 1; nodeId < myNet->size(); nodeId++ ) {
            std::cerr << timestep << " " << nodeId;
            for ( unsigned int i = 0; i < dim; i++ ) {
                myNet->at(nodeId).pos[i] += (force[nodeId][i] * t);
std::cerr << " " << myNet->at(nodeId).pos[i] << "(" << force[nodeId][i] << "," << t << ")";
            }
            std::cerr << "\n";
        }
        // cool down
        t -= dt;
    }
}

// main
int main(int argc, char * argv[]) {
    // initalize random
    srand (time(NULL));
    // read in the network from stdin
    std::vector < NODE > myNet;
    readStdin( &myNet );
    // do spring layout in 20 dimensions
    std::cerr << "=== SPRING LAYOUTING ===" << std::endl;
    springLayout( &myNet, 2, 5, 2000 );
    std::cerr << "=== END SPRING LAYOUTING ===" << std::endl;
    // reduce dimension to two

    // reoptimise spring layout in two dimensions
//    std::cerr << "=== SPRING LAYOUTING ===" << std::endl;
//    springLayout( &myNet, 2, 100, 20 );
//    std::cerr << "=== END SPRING LAYOUTING ===" << std::endl;
    // ok, now we have to plot it
    for ( size_t i = 0; i < myNet.size(); i++ ) {
        std::cout << i;
        for ( size_t j = 0; j < myNet[i].pos.size(); j++ ) {
            std::cout << " " << myNet[i].pos[j];
        }
        std::cout << std::endl;
    }
    // everything went well
    return 0;
}
