package draw;

import parsing.Node;

class Link {
    public var n1:NodePos;
    public var n2:NodePos;
    public var w:Float;

    public var xPos:Float;
    public var yPos:Float;

    public inline function new(n1:NodePos,n2:NodePos,w:Float) {
        this.n1 = n1;
        this.n2 = n2;
        this.w = w;
    }
}
