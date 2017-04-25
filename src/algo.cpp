#include <algorithm>
#include <igraph/igraph.h>
#include <iostream>
#include <set>
#include <string>
#include <vector>

struct CSEQUENCES {                   // A structure to store sequences in.
    std::vector<std::string> names;   // The names of the sequence. Different names can be used for the same sequence.
    std::string originalSequence;     // The original sequence.
    std::string reducedSequence;      // A reduced sequence of the original sequence. It only contains those positions that are ""interesting"".
    std::vector<size_t> pos;          // The positions in the original sequence that have been considered in order to build the reduced Sequence.
    unsigned long long costs;
};

struct DELTA {                        // A delta is a specific distance distinguishing the distance between (multiple) sequence pairs
    size_t i;                         // Index of the first sequence.
    size_t j;                         // Index of the second sequence.
    unsigned long long distance;      // The distance differencing the sequences.
};

struct SEQ_PAIR_IDS {                 // A sequence pair.
    size_t i;                         // Index of the first sequence.
    size_t j;                         // Index of the second sequence.
};

struct DELTAS {                       // A combined delta struct.
    std::vector<SEQ_PAIR_IDS> pairs;  // A list of sequence pairs.
    unsigned long long distance;      // The distance differencing the sequences.
};

struct OUTPUT_CONNECTION {
    SEQ_PAIR_IDS ids;
    unsigned long long weight;
    std::vector<size_t> pos;
};

// === STEP 1 ===
static unsigned long long compareSequences (CSEQUENCES s1, CSEQUENCES s2, unsigned long long * weights) {
    unsigned long result = 0;
    for (size_t i = 0; i < s1.pos.size(); i++) { // size_t is guaranteed to be able to represent the length of a string
        if (s1.reducedSequence[i] != s2.reducedSequence[i]) {
            result += weights[i];
        }
    }
    return result;
}

static bool cmpDeltas ( DELTA d1, DELTA d2 ) {
    return d1.distance < d2.distance;
}

static std::vector<DELTAS> step1 ( std::vector<CSEQUENCES> seqs, unsigned long long * weights ) {
    // Step 1 of the algorithm
    // Steps to do (see Paper "Median-Joining Networks for Interferring Intraspecific Phylogenies", Bandelt et al.
    // - determine the distance matrix d for the current sequence types
    // - pool identical sequence types (already done during reading in (see fastaAlignmentReader.cpp))
    // - order different distance values as d1 < d2 < ... < dn

    // assure objects
    std::vector<DELTA> deltas;
    deltas.reserve((seqs.size() * (seqs.size() - 1)) >> 1);
    std::vector<DELTAS> uniqueDeltas;
    uniqueDeltas.reserve((seqs.size() * (seqs.size() - 1)) >> 1);
    // fill out the matrix
    for(std::vector<CSEQUENCES>::size_type i = 0; i != seqs.size(); i++) {
//        matrix[i+seqs.size()*i] = 0; // distance from own sequence to own sequence always 0
        for(std::vector<CSEQUENCES>::size_type j = i+1; j != seqs.size(); j++) {
            unsigned long long sequencesDistance = compareSequences (seqs[i], seqs[j], weights);
//            matrix[i + seqs.size() * j] = sequencesDistance;
//            matrix[j + seqs.size() * i] = sequencesDistance;
            // add delta to delta objects
            DELTA d;
            d.i = i;
            d.j = j;
            d.distance = sequencesDistance;
            deltas.push_back(d);
//            std::cout << "    " << d.i << " " << d.j << " " << d.distance << std::endl;
        }
    }

    // sort delta distances
    std::sort( deltas.begin(), deltas.end(), cmpDeltas );

    // create uniqueDeltas
    unsigned long long lastDelta = 0; // there can't be a "0" distance - otherwise the two sequences should have been pooled
    for (std::vector<DELTA>::iterator it = deltas.begin(); it != deltas.end(); ++it) {
        SEQ_PAIR_IDS pair;
        pair.i = (*it).i;
        pair.j = (*it).j;
        if (lastDelta != (*it).distance) {
            lastDelta = (*it).distance;
            DELTAS ds;
            ds.distance = lastDelta;
            uniqueDeltas.push_back(ds);
        }
        uniqueDeltas.back().pairs.push_back(pair);
    }
    // return
    return uniqueDeltas;
}
// === END STEP 1 ===

// === STEP 2 ===
static void addEdges( igraph_t * g, igraph_vector_t *weights, DELTAS ds, unsigned long long epsilon ) {
    igraph_bool_t alreadyConnected;
    igraph_vector_t epath, vpath;
    int nedges, eindex; // number of edges
    std::vector<std::vector<SEQ_PAIR_IDS>::iterator> toAdd;
    for (std::vector<SEQ_PAIR_IDS>::iterator it = ds.pairs.begin(); it != ds.pairs.end(); ++it) {
        igraph_are_connected( g, (*it).i, (*it).j, &alreadyConnected );
        if ( !alreadyConnected ) {
            // check whether we are allowed to add the edge
            igraph_st_edge_connectivity(g, &nedges, (*it).i, (*it).j);
            if (nedges > 0) {
                // need some extra checks
                bool haveToContinue = false;
                igraph_vector_init(&vpath, 0);
                igraph_vector_init(&epath, 0);

                igraph_get_shortest_path_dijkstra(g, &vpath, &epath, (*it).i, (*it).j, weights, IGRAPH_ALL);

                for (int i = 0; i < igraph_vector_size(&epath); i++) {
                    eindex = VECTOR(epath)[i];
                    if ( VECTOR(*weights)[eindex] + epsilon < ds.distance ) {
                        haveToContinue = true;
                        break;
                    }
                }

                igraph_vector_destroy(&epath);
                igraph_vector_destroy(&vpath);

                if ( haveToContinue ) {
                    continue;
                }
            }
            // we are allowed
            toAdd.push_back(it);
        }
    }
    for ( size_t i = 0; i < toAdd.size(); i++ ) {
        std::vector<SEQ_PAIR_IDS>::iterator it = toAdd[i];
        std::cerr << " CONNECT " << (*it).i << " and " << (*it).j << " (" << ds.distance << ")" << std::endl;
        igraph_add_edge(g, (*it).i, (*it).j);
        igraph_vector_push_back(weights, ds.distance);
    }
}
static igraph_t step2 ( std::vector<CSEQUENCES> * seqs, std::vector<DELTAS> * uniqueDeltas, unsigned long long epsilon ) {
    // Step 2
    // Steps to do (see Paper "Median-Joining Networks for Interferring Intraspecific Phylogenies", Bandelt et al.
    // determine epsilon-relaxed spanning tree

    // create the graph object
    igraph_t g;
    igraph_empty( &g, seqs->size(), IGRAPH_UNDIRECTED );
    igraph_vector_t weights;
    igraph_vector_init(&weights, 0);

    std::cerr << "Created network with " << seqs->size() << " nodes" << std::endl;

    // add nodes till spanning network
    igraph_bool_t isConnected;
    std::vector<DELTAS>::iterator it = uniqueDeltas->begin();
    for (; it != uniqueDeltas->end(); ++it) {
        addEdges( &g, &weights, *it, epsilon );

        // break if connected
        igraph_is_connected( &g, &isConnected, IGRAPH_WEAK );
        if (isConnected) {
            std::cerr << "CONSTRUCED MINIMAL SPANNING NETWORK" << std::endl;
            break;
        }
    }

    // do epsilon relaxion
    if (epsilon > 0) { // epsilon != 0
        const unsigned long long delta_j = (*it).distance + epsilon; // save delta_j so that we can get the next iterator etc.
        if (it != uniqueDeltas->end()) {  // get next iterator
            ++it;
        }
        for (; it != uniqueDeltas->end(); ++it) { // go on with search for connections
            if ( (*it).distance <= delta_j ) {
                addEdges( &g, &weights, *it, epsilon );
            } else {
                // speedup, once delta_j + epsilon > distance we will not find
                // lower elements in the list anymore ...
                break;
            }
        }
        std::cerr << "EPSILON RELAXION DONE" << std::endl;
    }

    igraph_vector_destroy(&weights);
    return g;
}
// === END STEP 2 ===

// === STEP 3 ===
static void swapElementsOfVect ( std::vector<CSEQUENCES> * seqs, size_t i, size_t j ) {
    if ( i == j ) {
        return; // nothing to do
    }
    CSEQUENCES c = seqs->at(i);
    seqs->at(i) = seqs->at(j);
    seqs->at(j) = c;
}
static size_t step3 ( std::vector<CSEQUENCES> * seqs, igraph_t * g ) {
    // get the indexes in the vector to remove
    size_t toRemove = 0;
    igraph_vector_t tmp;
    igraph_vector_init(&tmp, 0);
    size_t i = seqs->size();                      // not sampled sequences should be at end of the vector seqs
    while ( seqs->at(--i).names.size() == 0 ) {   // while not among sampled sequences (not sampled sequences do not have a name)
        igraph_neighbors( g, &tmp, i, IGRAPH_ALL );
        if ( igraph_vector_size( &tmp ) <= 2 ) { // at most two edges
            std::cerr << " Obsolete node " << i << " detected" << std::endl;
            toRemove++;
            swapElementsOfVect ( seqs, i, seqs->size() - toRemove );
        }
    }

    // throw away [toRemove] elements from end of vector
    seqs->erase(seqs->end()-toRemove, seqs->end());

    // return the number of removed indexes
    return toRemove;
}
// === END STEP 3 ===

// === STEP 4 ===
static void continueMedians ( std::vector<CSEQUENCES> * result, char c ) {
    for ( size_t i = 0; i < result->size(); i++ ) {
        result->at(i).reducedSequence = result->at(i).reducedSequence + c;
    }
}
static std::vector<CSEQUENCES> constructMedians ( CSEQUENCES u, CSEQUENCES v, CSEQUENCES w ) {
    std::vector<CSEQUENCES> result;
    CSEQUENCES m;
    m.originalSequence = "";
    m.reducedSequence = "";
    m.pos = u.pos;
    result.push_back(m);
    for ( size_t pos = 0; pos < u.reducedSequence.length(); pos ++ ) {
        // majority
        if ( u.reducedSequence[pos] == v.reducedSequence[pos] ) {
            continueMedians(&result, u.reducedSequence[pos]);
            continue;
        } else if ( u.reducedSequence[pos] == w.reducedSequence[pos] ) {
            continueMedians(&result, u.reducedSequence[pos]);
            continue;
        } else if ( v.reducedSequence[pos] == w.reducedSequence[pos] ) {
            continueMedians(&result, w.reducedSequence[pos]);
            continue;
        }
        // everything possible
        // ok, tripple the vector
        const size_t limit = result.size();
        for ( int zzzzz = 0; zzzzz < 2; zzzzz++ ) { // the original + 2 copies of the original = 3
            for ( size_t i = 0; i < limit; i++ ) {
                CSEQUENCES m;
                m.originalSequence = "";
                m.reducedSequence = result[i].reducedSequence + "";
                m.pos = u.pos;
                result.push_back(m);
            }
        }
        // append u.reducedSequence[pos] to first 1/3, v.reducedSequence[pos] to second 1/3 and w.reducedSequence[pos] to end 1/3 of vector
        char c;
        for ( size_t pp = 0; pp < result.size(); pp++ ) {
            c = (pp < limit) ? u.reducedSequence[pos] : (((pp << 1) < limit) ? v.reducedSequence[pos] : w.reducedSequence[pos]);
            result[pp].reducedSequence = result[pp].reducedSequence + c;
        }
    }
    return result;
}

static unsigned long long calcMedianCosts ( CSEQUENCES m, CSEQUENCES u, CSEQUENCES v, CSEQUENCES w, unsigned long long * weights ) {
    return compareSequences (u, m, weights) +
           compareSequences (v, m, weights) +
           compareSequences (w, m, weights);
}

static size_t step4 ( std::vector<CSEQUENCES> * seqs, igraph_t * g, unsigned long long epsilon, unsigned long long * weights ) {
    size_t addedMedians = 0;    // the result
    igraph_bool_t connected;    // var to check whether two nodes are connected
    // create a set for the sequences (in order to faster lookup whether a sequence already exists)
    std::set<std::string> mySeqs;
    for ( size_t i = 0; i < seqs->size(); i++ ) {
        mySeqs.insert( seqs->at(i).reducedSequence );
    }
    // new vectors
    unsigned long long minimalVectCost = 0;
    std::vector<CSEQUENCES> possibleNewSequences;
    // for each triplet
    for ( size_t i = 0; i < seqs->size(); i++ ) {
        for ( size_t j = i + 1; j < seqs->size(); j++ ) {
            for ( size_t k = j + 1; k < seqs->size(); k++ ) {
                // check whether at least two pairs of nodes are connected ...
                igraph_are_connected( g, i, j, &connected );
                if ( !connected ) { // i,j are not connected, now i,k and j,k need to be connected
                    igraph_are_connected( g, i, k, &connected );
                    if ( !connected ) { // i,j and i,k not connected => continue
                        continue;
                    } else {  // i,j not connected, but i,k -> i,j need to be connected
                        igraph_are_connected( g, j, k, &connected );
                        if ( !connected ) {
                            continue; // nope, nodes are not connected
                        }
                    }
                } else {  // i, j are connected
                    igraph_are_connected( g, i, k, &connected );
                    if ( !connected ) { // i,j are connected, but not i,k
                        igraph_are_connected( g, j, k, &connected );
                        if ( !connected ) { // i,j are connected, but not i,k and j,k
                            continue;
                        }
                    }
                }
                // get median vector
                std::cerr << "CONSTR. MEDS FOR " << seqs->at(i).reducedSequence << " " << seqs->at(j).reducedSequence << " " << seqs->at(k).reducedSequence << std::endl;
                std::vector<CSEQUENCES> meds = constructMedians( seqs->at(i), seqs->at(j), seqs->at(k) );
                for ( size_t z = 0; z < meds.size(); z++ ) {
                    CSEQUENCES med = meds[z];
                    // median vector already in list?
                    if ( mySeqs.find(med.reducedSequence) != mySeqs.end() ) {
                        continue; // already in - do nothing
                    }
                    // calculate costs for median vector
                    med.costs = calcMedianCosts( med, seqs->at(i), seqs->at(j), seqs->at(k), weights );
                    std::cerr << " CANDIDATE " << med.reducedSequence << "(" << med.costs << ")" << std::endl;
                    // add median vector
                    possibleNewSequences.push_back(med);
                    if ( minimalVectCost == 0 || med.costs < minimalVectCost ) {
                        minimalVectCost = med.costs;
                    }
                }
            }
        }
    }
    // add sequences
    for ( size_t pos = 0; pos < possibleNewSequences.size(); pos++ ) {
        CSEQUENCES med = possibleNewSequences[pos];
        if ( mySeqs.find(med.reducedSequence) != mySeqs.end() ) {
            continue; // already in - do nothing
        }
        if ( med.costs <= minimalVectCost + epsilon ) {
            std::cerr << "added: " << med.reducedSequence << "(" << med.costs << ")" << std::endl;
            seqs->push_back(med);
            mySeqs.insert( med.reducedSequence );
            addedMedians++;
        }
    }

    // return
    return addedMedians;
}
// === END STEP 4 ===

// === STEP 5 ===
static std::vector<size_t> seqsDiffer ( CSEQUENCES s1, CSEQUENCES s2 ) {
    std::vector<size_t> ints;
    for (size_t i = 0; i < s1.reducedSequence.length(); i++) {
        if (s1.reducedSequence[i] != s2.reducedSequence[i]) {
            ints.push_back(s1.pos[i]);
        }
    }
    return ints;
}
static OUTPUT_CONNECTION constructOutputConnection ( std::vector<CSEQUENCES> * mySeqs, unsigned long long * weights, size_t i, size_t j ) {
    SEQ_PAIR_IDS ids { .i = i, .j = j };
    OUTPUT_CONNECTION p { .ids = ids, .weight = compareSequences(mySeqs->at(i), mySeqs->at(j), weights), .pos = seqsDiffer(mySeqs->at(i), mySeqs->at(j)) };
    return p;
}
static std::vector<OUTPUT_CONNECTION> step5 ( std::vector<CSEQUENCES> * mySeqs, unsigned long long * weights ) {
    // go through network creation till step 3
    igraph_t g;
    while ( 1 ) {
        std::vector<DELTAS> uniqueDeltas = step1 ( *mySeqs, weights );
        igraph_t g = step2 ( mySeqs, &uniqueDeltas, 0 );
        size_t obsoletes = step3 ( mySeqs, &g );
        if ( obsoletes > 0 ) {
            igraph_destroy(&g);
        } else {
            break;
        }
    }
    // construct result
    std::vector<OUTPUT_CONNECTION> result;
    igraph_vector_t v;
    igraph_vector_init(&v, 8);
    igraph_get_edgelist(&g, &v, 0);
    for (size_t i = 0; i<igraph_vector_size(&v); i+=2) {
        OUTPUT_CONNECTION oc = constructOutputConnection( mySeqs, weights, VECTOR(v)[i], VECTOR(v)[i+1] );
        result.push_back(oc);
    }
    // return
    igraph_vector_destroy(&v);
    igraph_destroy(&g);
    return result;
}

// === END STEP 5 ===
