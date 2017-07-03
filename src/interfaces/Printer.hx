package interfaces;

interface Printer {
    public var countingOffset:Int = 1;  // setting
    public var newline:String = "\n"; // setting
    public var indent:String = "  "; // setting

    public function printString(s:String):Void;
    public function close():Void;
}
