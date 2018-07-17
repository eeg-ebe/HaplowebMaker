package parsing;

import util.Pair;

class LstParser {
    public static function parseLst(fileContent:String):List<Pair<String, String>> {
        var result:List<Pair<String, String>> = new List<Pair<String, String>>();
        var lines:Array<String> = fileContent.split("\n");
        var lineNo:Int = 0;
        for(line in lines) {
            lineNo++;
            if(line == null || Parse.stripString(line) == "" || line.charAt(0) == "#") {
                continue;
            }
            var pos:Int = line.lastIndexOf("\t");
            if(pos == -1) {
                throw "Missing tab character in line " + lineNo;
            }
            var name:String = line.substring(0, pos);
            name = Parse.stripString(name);
            var chr:String = line.substring(pos + 1);
            chr = Parse.stripString(chr);
            if(name == null || name == "" || chr == null || chr == "") {
                throw "Error in line " + lineNo;
            }
            result.add(new Pair(name, chr));
        }
        return result;
    }
}
