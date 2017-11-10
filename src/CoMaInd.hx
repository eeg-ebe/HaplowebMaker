import haxe.ds.Vector;

class CoMaInd {

    public var indName(default, null):String;
    public var vals(default, null):Vector<Int>;

    public function new(s:String, l:Int) {
        indName = s;
        vals = new haxe.ds.Vector(l);
        for(index in 0...l) {
            vals[index] = -1;
        }
    }

    public function setSpResultOf(i:Int, sp:Int):Void {
        vals[i] = sp;
    }

    public function compare(other:CoMaInd):Float {
        var result:Float = 0;
        for(i in 0...vals.length) {
            if(vals[i] == -1 || other.vals[i] == -1) {
                continue;
            }
            if(vals[i] == other.vals[i]) {
                result++;
            } else {
                result--;
            }
        }
        return result;
    }
}
