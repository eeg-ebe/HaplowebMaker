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

    public function compare(other:CoMaInd, weights:Null<Array<Int>>, compStrategy:Int):Float {
        var result:Float = 0;
        for(i in 0...vals.length) {
            //trace(vals.length + " " + weights.length);
            if(vals[i] == -1 || other.vals[i] == -1) {
                continue;
            }
            if(vals[i] == other.vals[i]) {
                if(weights == null) {
                    result++;
                } else {
                    result += weights[i];
                }
            } else {
                if(compStrategy == 0) {
                    if(weights == null) {
                        result--;
                    } else {
                        result -= weights[i];
                    }
                }
            }
        }
        return result;
    }
}
