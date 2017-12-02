package mj;

import haxe.ds.Vector;
import util.Pair;
import util.StdOutPrinter;
import parsing.FastaParser;

#if cpp
import cpp.link.StaticStd;
#end

/**
 * This class is serving as an entry point for the program.
 */
class MJ {
    public static function main():Void {
        var myArgs:Array<String> = Sys.args();
        var fr:List<Pair<String,String>> = FastaParser.parseFasta(sys.io.File.getContent(myArgs[0]).toUpperCase());
        var m:MJAlgo = new MJAlgo();
        for(e in fr) {
            m.addSequence(e.first, e.second);
        }
        if(myArgs[1] != "-") {
            var r:Array<String> = myArgs[1].split(";");
            var v:Vector<Float> = new Vector<Float>(r.length);
            for(i in 0...r.length) {
                v[i] = Std.parseFloat(r[i]);
            }
            m.weights = v;
        }
        m.finishedAddingSequences();
        m.runMJ(Std.parseFloat(myArgs[2]));
        m.finalizeNetwork().printTxt(new StdOutPrinter());
    }
}
