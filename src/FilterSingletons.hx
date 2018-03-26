import util.Pair;
import haxe.ds.StringMap;

class FilterSingletons {
    public static inline function filterSingletons(faFile:List<Pair<String, String>>):List<Pair<String, String>> {
        var map:StringMap<List<String>> = new StringMap<List<String>>();
        for(seq in faFile) {
            if(map.exists(seq.second)) {
                map.get(seq.second).add(seq.first);
            } else {
                var lst:List<String> = new List<String>();
                lst.add(seq.second);
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