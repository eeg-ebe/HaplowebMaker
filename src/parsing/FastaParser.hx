package parsing;

import util.Pair;

class FastaParser {
    // allow the creating of such an object
    public static function parseFasta(fileContent:String):List<Pair<String,String>> {
        var faSeqs:List<Pair<String,String>> = new List<Pair<String,String>>();
        var lines:Array<String> = fileContent.split("\n");
        var header:String = null;
        var content:String = null;
        var lineNo:Int = 0;
        for(line in lines) {
            lineNo++;
            line = Parse.stripString(line);
            if(line == null || line == "" || line.charAt(0) == ";" || line.charAt(0) == "#") {
                continue;
            }
            if(line.charAt(0) == ">") {
                if(header != null) {
                    if(content == null) {
                        throw "Missing content for sequence \"" + header + "\" in line " + lineNo;
                    }
                    faSeqs.add(new Pair(header, content));
                } else {
                    if(content != null) {
                        throw "Missing header for content previous to line " + lineNo;
                    }
                }
                header = Parse.stripStringBegin(line.substr(1));
                content = null;
            } else {
                if(content == null) {
                    content = line;
                } else {
                    content = content + line;
                }
            }
        }
        if(header != null) {
            if(content == null) {
                throw "Missing content for sequence \"" + header + "\" in line " + lineNo;
            }
            faSeqs.add(new Pair(header, content));
        }
        return faSeqs;
    }
    public static function main():Void {}
}
