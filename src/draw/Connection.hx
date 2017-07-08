package draw;

import parsing.Node;

class Connection {
    public var n1:NodePos;
    public var n2:NodePos;
    public var l:List<Int>;

    public inline function new(n1:NodePos,n2:NodePos,l:List<Int>) {
        this.n1 = n1;
        this.n2 = n2;
        this.l = l;
    }
}
