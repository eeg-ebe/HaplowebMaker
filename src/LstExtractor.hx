package;

import parsing.MJNetParser;
import parsing.Node;
import util.StdOutPrinter;

class LstExtractor {
    public static inline function main():Void {
        var myArgs:Array<String> = Sys.args();
        var net:List<Node> = MJNetParser.parseNet(sys.io.File.getContent(myArgs[0]));
        var p:StdOutPrinter = new StdOutPrinter();
        for(e in net) {
            for(n in e.names) {
                p.printString(n + "\t" + e.spId + "\n");
            }
        }
    }
}
