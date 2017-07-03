package util;

import interfaces.Printer;

class StdOutPrinter implements Printer {
    public var countingOffset:Int = 1;  // setting
    public var newline:String = "\n"; // setting
    public var indent:String = "  "; // setting

    public inline function new() {}
    public inline function printString(s:String):Void {
        #if (cpp || cs || java || macro || neko || php || python)
        Sys.stdout().writeString(s);
        #else
        trace(s);
        #end
    }
    public inline function close():Void {}
}
