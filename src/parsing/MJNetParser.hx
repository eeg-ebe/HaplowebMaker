package parsing;

import util.Pair;

/**
 * Parser for the output format of the specification ...
 */
class MJNetParser {
    public static inline function countIndents(s:String):Int {
        var result:Int = 0;
        while(Parse.isWhitespace(s, result)) {
            result++;
        }
        return result;
    }
    public static inline function parseNet(fileContent:String):List<Node> {
        var lines:Array<String> = fileContent.split("\n");
        var result:List<Node> = new List<Node>();
        var lineNo:Int = 0;
        var currentNode:Node = null;
        var readNames:Bool = false;
        var readCons:Bool = false;
        var readLinks:Bool = false;
        for(line in lines) {
            lineNo++;
            // check whether we need to skip the line
            var line_:String = Parse.stripString(line);
            if(line_ == null || line_ == "" || line_.charAt(0) == "#") {
                continue;
            }
            // count the number of indents
            var indents:Int = countIndents(line);
            // is it needed to create a new object?
            if(indents == 0 && (line_ == "SAMPLED_SEQUENCE" || line_ == "MEDIAN_VECTOR")) {
                // save maybe old present node object ...
                if(currentNode != null) {
                    result.add(currentNode);
                }
                currentNode = new Node();
                currentNode.type = (line_ == "SAMPLED_SEQUENCE") ? SAMPLED_SEQUENCE : MEDIAN_VECTOR;
                readNames = false;
                readCons = false;
                readLinks = false;
                continue;
            }
            // no currentNode and try to read in?
            if(currentNode == null) {
                throw "Expected SAMPLED_SEQUENCE or MEDIAN_VECTOR in line " + lineNo + "!";
            }
            // read in the content of the line
            if(indents == 2 && Parse.startsWith(line_, "ID")) {
                currentNode.id = Std.parseInt(line_.split(" ")[1]);
            } else if(indents == 2 && Parse.startsWith(line_, "SPECIES_ID")) {
                currentNode.spId = Std.parseInt(line_.split(" ")[1]);
            } else if(indents == 2 && Parse.startsWith(line_, "SEQUENCE")) {
                currentNode.seq = line_.split(" ")[1];
            } else if(indents == 2 && Parse.startsWith(line_, "NB_NAMES")) { // do nothing
            } else if(indents == 2 && Parse.startsWith(line_, "NAMES")) {
                readNames = true;
                readCons = false;
                readLinks = false;
            } else if(indents == 2 && Parse.startsWith(line_, "CONNECTED_TO")) {
                readNames = false;
                readCons = true;
                readLinks = false;
            } else if(indents == 2 && Parse.startsWith(line_, "LINKED_TO")) {
                readNames = false;
                readCons = false;
                readLinks = true;
            } else if(indents == 4 && (readNames || readCons || readLinks)) {
                if(readNames) {
                    currentNode.names.add(line_);
                } else if(readCons) {
                    var d:Array<String> = line_.split(" ");
                    var l:List<Int> = new List<Int>();
                    for(i in 5...d.length) {
                        l.add(Std.parseInt(d[i]));
                    }
                    currentNode.cons.add(new Pair(Std.parseInt(d[1]), l));
                } else if(readLinks) {
                    var d:Array<String> = line_.split(" ");
                    currentNode.links.add(new Pair(Std.parseInt(d[1]), Std.parseInt(d[3])));
                }
            } else {
                throw "Unexpected expression in line " + lineNo + "!";
            }
        }
        if(currentNode != null) {
            result.add(currentNode);
        }
        return result;
    }
//SAMPLED_SEQUENCE
//  ID 30
//  SPECIES_ID 7
//  SEQUENCE CGTCTCTTCAACG
//  NB_NAMES 1
//  NAMES
//    42.2D5_B
//  CONNECTED_TO 
//    ID 14 COSTS 1 @ 30
//  LINKED_TO 
//    ID 14 COUNT 1

public static function main():Void {}
}
