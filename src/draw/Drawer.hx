package draw;

import parsing.MJNetParser;
import parsing.Node;
import util.StdOutPrinter;

/**
 * Main entry point for the drawing program.
 */
class Drawer {
    public static function main():Void {
#if sys
        var myArgs:Array<String> = Sys.args();
        var net:List<Node> = MJNetParser.parseNet(sys.io.File.getContent(myArgs[0]));
        var g:Graph = new Graph(net);
        g.forceDirectedMethod(true, 0.6, 0.5, 500.0, 0.1, 0.1, 10000);
        g.centerPos();
        g.assignLinkPos();
        new StdOutPrinter().printString(g.getSvgCode());
#else
        var net:List<Node> = MJNetParser.parseNet("");
        var g:Graph = new Graph(net);
        g.forceDirectedMethod(true, 0.6, 0.5, 500.0, 0.1, 0.1, 10000);
        g.centerPos();
        g.assignLinkPos();
        new StdOutPrinter().printString(g.getSvgCode());
#end
    }
}
