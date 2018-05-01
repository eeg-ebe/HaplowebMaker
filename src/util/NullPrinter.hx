package util;

import interfaces.Printer;

class NullPrinter implements Printer {
    public var countingOffset:Int = 1;  // setting
    public var newline:String = "\n"; // setting
    public var indent:String = "  "; // setting
    
    public inline function new() {}
    public inline function printString(s:String):Void {}
    public inline function close():Void {}
}
