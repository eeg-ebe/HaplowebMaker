package mj;

import haxe.ds.Vector;

/**
 * Class to represent a median vector (Steiner tree).
 */
class Median {
    public var s1:String;
    public var s2:String;
    public var s3:String;

    public var dist:Float;
    public var diffPos:Int;
    public var meds:Int;

    public var makesSense:Bool;

    public inline function new(s1:String,s2:String,s3:String,w:Vector<Float>, cDist:Float) {
        #if asserts
        if(s1.length != s2.length || s2.length != s3.length) throw "Sequences differ in length!";
        #end
        makesSense = false;
        // save for later
        this.s1 = s1;
        this.s2 = s2;
        this.s3 = s3;
        // calculate the dist
        dist = 0;
        diffPos = 0;
        meds = 1;
        for(pos in 0...s1.length) {
            if(s1.charAt(pos) == s2.charAt(pos) && s2.charAt(pos) == s3.charAt(pos)) {
                continue; // all the same
            }
            diffPos++;
            if(s1.charAt(pos) != s2.charAt(pos) && s2.charAt(pos) != s3.charAt(pos) && s1.charAt(pos) != s3.charAt(pos)) { // all different
                dist += 2 * w[pos];
                meds *= 3;
                continue;
            }
            dist += w[pos];
        }
        makesSense = true; //dist < cDist;
    }

    private inline function continueMedians(l:List<Vector<String>>,c:String,pos:Int):Void {
        for(e in l) {
            e[pos] = c;
        }
    }
    public inline function constructMediansOld():List<String> {
        // pre result calculations
        var presult:List<Vector<String>> = new List<Vector<String>>();
        presult.add(new Vector<String>(s1.length));
        for(pos in 0...s1.length) {
            // majority
            if(s1.charAt(pos) == s2.charAt(pos)) {
                continueMedians(presult, s1.charAt(pos), pos);
                continue;
            }
            if(s1.charAt(pos) == s3.charAt(pos)) {
                continueMedians(presult, s1.charAt(pos), pos);
                continue;
            }
            if(s2.charAt(pos) == s3.charAt(pos)) {
                continueMedians(presult, s2.charAt(pos), pos);
                continue;
            }
            // everything possible
            // ok, tripple the vector
            var limit:Int = presult.length;
            for(zzzzz in 0...2) {
                var i:Int = 0;
                for(ele in presult) {
                    if(i < limit) {
                        i++;
                    } else {
                        break;
                    }
                    presult.add(ele.copy());
                }
            }
            var pp:Int = 0;
            for(ele in presult) {
                var c:String = (pp < limit) ? s1.charAt(pos) :
                    ((pp < (limit << 1)) ? s2.charAt(pos) : s3.charAt(pos));
                ele[pos] = c;
                pp++;
            }
        }
        // join vectors to string
        var result:List<String> = new List<String>();
        for(s in presult) {
            result.add(s.join(""));
        }
        #if (debug || debugMJ || debugMJConstructMedians)
        trace("Constructed Medians for ",s1,s2,s3);
        for(r in result) {
            trace(r);
        }
        #end
        return result;
    }
    public function constructMedians():List<String> {
        if(meds <= 3) {
            return constructMediansOld();
        }
        // only construct median vectors that "make sense"
        // like Network
        var s1v:Vector<String> = new Vector<String>(s1.length);
        var s2v:Vector<String> = new Vector<String>(s1.length);
        var s3v:Vector<String> = new Vector<String>(s1.length);
        for(pos in 0...s1.length) {
            if((s1.charAt(pos) == s2.charAt(pos) && s2.charAt(pos) == s3.charAt(pos)) || s1.charAt(pos) != s2.charAt(pos) && s2.charAt(pos) != s3.charAt(pos) && s1.charAt(pos) != s3.charAt(pos)) {
                // all the same or all different
                s1v[pos] = s1.charAt(pos);
                s2v[pos] = s2.charAt(pos);
                s3v[pos] = s3.charAt(pos);
                continue;
            }
            // find majority
            var c:String = "";
            if(s1.charAt(pos) == s2.charAt(pos)) {
                c = s1.charAt(pos);
            } else if(s2.charAt(pos) == s3.charAt(pos)) {
                c = s2.charAt(pos);
            } else {
                c = s3.charAt(pos);
            }
            // add
            s1v[pos] = c;
            s2v[pos] = c;
            s3v[pos] = c;
        }
        var result:List<String> = new List<String>();
        result.add(s1v.join(""));
        result.add(s2v.join(""));
        result.add(s3v.join(""));
        return result;
    }
}
