import util.Pair;
import haxe.ds.StringMap;

class FilterSingletons {
    public static inline function getIndIdentifier(s:String, delimiter:String):String {
        var result:String = s;
        if(s != null) {
            var pos:Int = s.lastIndexOf(delimiter);
            if(pos != -1) {
                result = s.substr(0, pos);
            }
        }
        return result;
    }
    public static inline function checkMaybeMissing(faFile:List<Pair<String, String>>, delimiter:String):String {
        var map:StringMap<Int> = new StringMap<Int>();
        for (seq in faFile) {
            var header:String = seq.first;
            var indName:String = getIndIdentifier(seq.first, delimiter);
            if (map.exists(indName)) {
                var count:Int = map.get(indName);
                ++count;
                map.set(indName, count);
            } else {
                map.set(indName, 1);
            }
        }
        var result:List<String> = new List<String>();
        for (key in map.keys()) {
            if (map.get(key) <= 1) {
                result.add(key);
            }
        }
        return result.join(", ");
    }
    public static inline function assumeAtLeastDiploid(faFile:List<Pair<String, String>>, delimiter:String):List<Pair<String, String>> {
        var map:StringMap<List<Pair<String, String>>> = new StringMap<List<Pair<String, String>>>();
        for(seq in faFile) {
            var identifier:String = getIndIdentifier(seq.first, delimiter);
            if(map.exists(identifier)) {
                map.get(identifier).add(
                    new Pair<String, String>(seq.first, seq.second)
                );
            } else {
                var lst:List<Pair<String, String>> = new List<Pair<String, String>>();
                lst.add(seq);
                map.set(identifier, lst);
            }
        }
        var newLst:List<Pair<String, String>> = new List<Pair<String, String>>();
        for(key in map.keys()) {
            var l:List<Pair<String, String>> = map.get(key);
            if(l.length <= 1) {
                newLst.add(l.first());
                newLst.add(l.first());
            } else {
                for(e in l) {
                    newLst.add(e);
                }
            }
        }
        return newLst;
    }
    public static inline function removeDuplicates(faFile:List<Pair<String, String>>, delimiter:String):List<Pair<String, String>> {
        var map:StringMap<List<Pair<String, String>>> = new StringMap<List<Pair<String, String>>>();
        for(seq in faFile) {
            var identifier:String = getIndIdentifier(seq.first, delimiter);
            if(map.exists(identifier)) {
                map.get(identifier).add(
                    new Pair<String, String>(seq.first, seq.second)
                );
            } else {
                var lst:List<Pair<String, String>> = new List<Pair<String, String>>();
                lst.add(seq);
                map.set(identifier, lst);
            }
        }
        var newLst:List<Pair<String, String>> = new List<Pair<String, String>>();
        for(key in map.keys()) {
            var l:List<Pair<String, String>> = map.get(key);
            var outputted:StringMap<Int> = new StringMap<Int>();
            for(e in l) {
                if(!outputted.exists(e.second)) {
                    newLst.add(e);
                    outputted.set(e.second, 0);
                }
            }
        }
        return newLst;
    }
    public static inline function filterSingletons(faFile:List<Pair<String, String>>):List<Pair<String, String>> {
        var map:StringMap<List<String>> = new StringMap<List<String>>();
        for(seq in faFile) {
            if(map.exists(seq.second)) {
                map.get(seq.second).add(seq.first);
            } else {
                var lst:List<String> = new List<String>();
                lst.add(seq.first);
                map.set(seq.second, lst);
            }
        }
        var newLst:List<Pair<String, String>> = new List<Pair<String, String>>();
        for(key in map.keys()) {
            var lst:List<String> = map.get(key);
            if(lst.length > 1) {
                for(name in lst) {
                    newLst.add(new Pair<String, String>(name, key));
                }
            }
        }
        return newLst;
    }

    public static function main():Void {}
}
