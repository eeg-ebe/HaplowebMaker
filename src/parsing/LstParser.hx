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
    public static function isValidColor(s:String):Bool {
        if (s == null || s == "") {
            return false;
        }
        s = s.toUpperCase();
        if (s.charAt(0) == "#") {
            if (s.length != 4 && s.length != 7) {
                return false;
            }
            for (i in 1...s.length) {
                var character:String = s.charAt(i);
                if (character != "0" && character != "1" && character != "2" && character != "3" && character != "4"
                        && character != "5" && character != "6" && character != "7" && character != "8" && character != "9"
                        && character != "A" && character != "B" && character != "C" && character != "D" && character != "E"
                        && character != "F") {
                    return false;
                }
            }
            return true;
        } else {
            if (s == "ALICEBLUE") { return true; }
            if (s == "ANTIQUEWHITE") { return true; }
            if (s == "AQUA") { return true; }
            if (s == "AQUAMARINE") { return true; }
            if (s == "AZURE") { return true; }
            if (s == "BEIGE") { return true; }
            if (s == "BISQUE") { return true; }
            if (s == "BLACK") { return true; }
            if (s == "BLANCHEDALMOND") { return true; }
            if (s == "BLUE") { return true; }
            if (s == "BLUEVIOLET") { return true; }
            if (s == "BROWN") { return true; }
            if (s == "BURLYWOOD") { return true; }
            if (s == "CADETBLUE") { return true; }
            if (s == "CHARTREUSE") { return true; }
            if (s == "CHOCOLATE") { return true; }
            if (s == "CORAL") { return true; }
            if (s == "CORNFLOWERBLUE") { return true; }
            if (s == "CORNSILK") { return true; }
            if (s == "CRIMSON") { return true; }
            if (s == "CYAN") { return true; }
            if (s == "DARKBLUE") { return true; }
            if (s == "DARKCYAN") { return true; }
            if (s == "DARKGOLDENROD") { return true; }
            if (s == "DARKGRAY") { return true; }
            if (s == "DARKGREY") { return true; }
            if (s == "DARKGREEN") { return true; }
            if (s == "DARKKHAKI") { return true; }
            if (s == "DARKMAGENTA") { return true; }
            if (s == "DARKOLIVEGREEN") { return true; }
            if (s == "DARKORANGE") { return true; }
            if (s == "DARKORCHID") { return true; }
            if (s == "DARKRED") { return true; }
            if (s == "DARKSALMON") { return true; }
            if (s == "DARKSEAGREEN") { return true; }
            if (s == "DARKSLATEBLUE") { return true; }
            if (s == "DARKSLATEGRAY") { return true; }
            if (s == "DARKSLATEGREY") { return true; }
            if (s == "DARKTURQUOISE") { return true; }
            if (s == "DARKVIOLET") { return true; }
            if (s == "DEEPPINK") { return true; }
            if (s == "DEEPSKYBLUE") { return true; }
            if (s == "DIMGRAY") { return true; }
            if (s == "DIMGREY") { return true; }
            if (s == "DODGERBLUE") { return true; }
            if (s == "FIREBRICK") { return true; }
            if (s == "FLORALWHITE") { return true; }
            if (s == "FORESTGREEN") { return true; }
            if (s == "FUCHSIA") { return true; }
            if (s == "GAINSBORO") { return true; }
            if (s == "GHOSTWHITE") { return true; }
            if (s == "GOLD") { return true; }
            if (s == "GOLDENROD") { return true; }
            if (s == "GRAY") { return true; }
            if (s == "GREY") { return true; }
            if (s == "GREEN") { return true; }
            if (s == "GREENYELLOW") { return true; }
            if (s == "HONEYDEW") { return true; }
            if (s == "HOTPINK") { return true; }
            if (s == "INDIANRED") { return true; }
            if (s == "INDIGO") { return true; }
            if (s == "IVORY") { return true; }
            if (s == "KHAKI") { return true; }
            if (s == "LAVENDER") { return true; }
            if (s == "LAVENDERBLUSH") { return true; }
            if (s == "LAWNGREEN") { return true; }
            if (s == "LEMONCHIFFON") { return true; }
            if (s == "LIGHTBLUE") { return true; }
            if (s == "LIGHTCORAL") { return true; }
            if (s == "LIGHTCYAN") { return true; }
            if (s == "LIGHTGOLDENRODYELLOW") { return true; }
            if (s == "LIGHTGRAY") { return true; }
            if (s == "LIGHTGREY") { return true; }
            if (s == "LIGHTGREEN") { return true; }
            if (s == "LIGHTPINK") { return true; }
            if (s == "LIGHTSALMON") { return true; }
            if (s == "LIGHTSEAGREEN") { return true; }
            if (s == "LIGHTSKYBLUE") { return true; }
            if (s == "LIGHTSLATEGRAY") { return true; }
            if (s == "LIGHTSLATEGREY") { return true; }
            if (s == "LIGHTSTEELBLUE") { return true; }
            if (s == "LIGHTYELLOW") { return true; }
            if (s == "LIME") { return true; }
            if (s == "LIMEGREEN") { return true; }
            if (s == "LINEN") { return true; }
            if (s == "MAGENTA") { return true; }
            if (s == "MAROON") { return true; }
            if (s == "MEDIUMAQUAMARINE") { return true; }
            if (s == "MEDIUMBLUE") { return true; }
            if (s == "MEDIUMORCHID") { return true; }
            if (s == "MEDIUMPURPLE") { return true; }
            if (s == "MEDIUMSEAGREEN") { return true; }
            if (s == "MEDIUMSLATEBLUE") { return true; }
            if (s == "MEDIUMSPRINGGREEN") { return true; }
            if (s == "MEDIUMTURQUOISE") { return true; }
            if (s == "MEDIUMVIOLETRED") { return true; }
            if (s == "MIDNIGHTBLUE") { return true; }
            if (s == "MINTCREAM") { return true; }
            if (s == "MISTYROSE") { return true; }
            if (s == "MOCCASIN") { return true; }
            if (s == "NAVAJOWHITE") { return true; }
            if (s == "NAVY") { return true; }
            if (s == "OLDLACE") { return true; }
            if (s == "OLIVE") { return true; }
            if (s == "OLIVEDRAB") { return true; }
            if (s == "ORANGE") { return true; }
            if (s == "ORANGERED") { return true; }
            if (s == "ORCHID") { return true; }
            if (s == "PALEGOLDENROD") { return true; }
            if (s == "PALEGREEN") { return true; }
            if (s == "PALETURQUOISE") { return true; }
            if (s == "PALEVIOLETRED") { return true; }
            if (s == "PAPAYAWHIP") { return true; }
            if (s == "PEACHPUFF") { return true; }
            if (s == "PERU") { return true; }
            if (s == "PINK") { return true; }
            if (s == "PLUM") { return true; }
            if (s == "POWDERBLUE") { return true; }
            if (s == "PURPLE") { return true; }
            if (s == "REBECCAPURPLE") { return true; }
            if (s == "RED") { return true; }
            if (s == "ROSYBROWN") { return true; }
            if (s == "ROYALBLUE") { return true; }
            if (s == "SADDLEBROWN") { return true; }
            if (s == "SALMON") { return true; }
            if (s == "SANDYBROWN") { return true; }
            if (s == "SEAGREEN") { return true; }
            if (s == "SEASHELL") { return true; }
            if (s == "SIENNA") { return true; }
            if (s == "SILVER") { return true; }
            if (s == "SKYBLUE") { return true; }
            if (s == "SLATEBLUE") { return true; }
            if (s == "SLATEGRAY") { return true; }
            if (s == "SLATEGREY") { return true; }
            if (s == "SNOW") { return true; }
            if (s == "SPRINGGREEN") { return true; }
            if (s == "STEELBLUE") { return true; }
            if (s == "TAN") { return true; }
            if (s == "TEAL") { return true; }
            if (s == "THISTLE") { return true; }
            if (s == "TOMATO") { return true; }
            if (s == "TURQUOISE") { return true; }
            if (s == "VIOLET") { return true; }
            if (s == "WHEAT") { return true; }
            if (s == "WHITE") { return true; }
            if (s == "WHITESMOKE") { return true; }
            if (s == "YELLOW") { return true; }
            if (s == "YELLOWGREEN") { return true; }
        }
        return false;
    }
    public static function parseColorList(fileContent:String):List<Pair<String, String>> {
        var result:List<Pair<String, String>> = parseLst(fileContent);
        for(pair in result) {
            pair.second = StringTools.trim(pair.second);
            if (!isValidColor(pair.second)) {
                throw "Invalid color " + pair.second;
            }
        }
        return result;
    }
}
