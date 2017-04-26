# MJ
Implementation of the Median Joining algorithm for Haploweb creation.

# Installation

// TODO

# Usage

|Command line option|Short commandline option|Description|
|---|---|---|
|--writeSummary|-s|file|Write a summary of the calculations to that file. (Default=None)|
|--readFastaAlign|-f|file|Specify the path where to find the fasta file to parse. (Required)|
|--epsilon|-e|signed int|The epsilon parameter of the MJ algorithm. See Bandelt et al. (Default=0)|
|--readWeights|-w|A files indicating the weights of each position. If no such file is given, each position will be equally weighted with a weight of 1.|
|--outputFile|-o|Path to the output file. (If this file is not given stdout will be used.)|
|--debug|-d|Output debug messages. (Messages will be printed to stderr.)|
|--help|-h|Output a help message describing the commandline parameters of the program.|
|--speciesListFile|-l|Filepath to write the species list file to.|

# Relevant papers

Flot, Jean-François, Arnaud Couloux, and Simon Tillier. "Haplowebs as a graphical tool for delimiting species: a revival of Doyle's" field for recombination" approach and its application to the coral genus Pocillopora in Clipperton." BMC Evolutionary Biology 10.1 (2010): 372.

Bandelt, Hans-Jurgen, Peter Forster, and Arne Röhl. "Median-joining networks for inferring intraspecific phylogenies." Molecular biology and evolution 16.1 (1999): 37-48.
