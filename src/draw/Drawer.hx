package draw;

import parsing.MJNetParser;
import parsing.Node;
import util.StdOutPrinter;

/**
 * Main entry point for the drawing program.
 */
class Drawer {
    public static function main():Void {
        var myArgs:Array<String> = Sys.args();
        var net:List<Node> = MJNetParser.parseNet(sys.io.File.getContent(myArgs[0]));
        var g:Graph = new Graph(net);
        g.forceDirectedMethod(true, 0.6, 0.5);
        g.assignLinkPos();
        new StdOutPrinter().printString(g.getSvgCode());
    }
}
