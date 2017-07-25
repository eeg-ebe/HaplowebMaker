package;

import mj.Seq;
import parsing.MJNetParser;
import parsing.Node;
import interfaces.Printer;
import util.Pair;
import util.StdOutPrinter;
import haxe.ds.ListSort;

class LEle {
        var l:List<Pair<String,Int>> = new List<Pair<String,Int>>();
    public var name:String;
    public var spId:Int;
    public var next:LEle;
    public inline function new(name:String,spId:Int,next:LEle) {
        this.name = name;
        this.spId = spId;
        this.next = next;
    }
}

class LstExtractor {
    public static inline function extract(p:Printer, s:String, onlyInd:Bool, sort:Bool, sortAlpha:Bool, outputSet:Bool) {
        // parse the whole string
        var net:List<Node> = MJNetParser.parseNet(s);
        // ok, now read names and spIds from the parsed object
        var f:LEle = null;
        for(e in net) {
            for(n in e.names) {
                var name:String = (onlyInd) ? Seq.getIndIdentifier(n) : n;
                var alreadyIn:Bool = false;
                var current = f;
                while(current != null) {
                    if(current.name == name) {
                        alreadyIn = true;
                        break;
                    }
                    current = current.next;
                }
                if(!alreadyIn) {
                    f = new LEle(name, e.spId, f);
                }
            }
        }
        // need to sort?
        if(sort || outputSet) {
            if(sortAlpha && !outputSet) {
                // sort pairs alphabetically
                f = ListSort.sortSingleLinked(f, function(e1:LEle, e2:LEle) {
                    if(e1.name == e2.name) return 0;
                    return (e1.name > e2.name) ? 1 : -1;
                });
            } else {
                // sort pairs by spId (then alphabetically)
                f = ListSort.sortSingleLinked(f, function(e1:LEle, e2:LEle) {
                    if(e1.spId == e2.spId) {
                        if(e1.name == e2.name) return 0;
                        return (e1.name > e2.name) ? 1 : -1;
                    }
                    return e1.spId - e2.spId;
                });
            }
        }
        // now output
        var current:LEle = f;
        if(outputSet) {
            var needNewLine:Bool = false;
            var lastSpId:Int = -1; // spid cannot be -1 -> check in the beginning will be false
            while(current != null) {
                if(current.spId == lastSpId) {
                    p.printString("\t" + current.name);
                } else {
                    lastSpId = current.spId;
                    if(needNewLine) {
                        p.printString(p.newline);
                    }
                    p.printString(current.name);
                }
                current = current.next;
                needNewLine = true;
            }
            p.printString(p.newline);
        } else {
            while(current != null) {
                p.printString(current.name);
                p.printString("\t"+current.spId);
                p.printString(p.newline);
                current = current.next;
            }
        }
        // close the printer
        p.close();
    }

    public static inline function main():Void {
        #if (cpp || cs || java || macro || neko || php || python)
        var myArgs:Array<String> = Sys.args();
        extract(new StdOutPrinter(), sys.io.File.getContent(myArgs[0]), true, true, true, false);
        #end
    }
}
