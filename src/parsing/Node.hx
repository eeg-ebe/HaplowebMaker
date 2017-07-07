package parsing;

import util.Pair;

enum SEQ_TYPE {
    SAMPLED_SEQUENCE;
    MEDIAN_VECTOR;
}

class Node {
    // whether this node represents a sampled sequence or a median vector.
    public var type:SEQ_TYPE;
    // the id of this node.
    public var id:Int;
    // the sp. id this node is representing.
    public var spId:Int;
    // the sequence connected to this node
    public var seq:String;
    // the names of this node
    public var names:List<String>;
    // the connections
    public var cons:List<Pair<Int,List<Int>>>;
    // the links
    public var links:List<Pair<Int,Int>>;

    public inline function new() {
        this.names = new List<String>();
        this.cons = new List<Pair<Int,List<Int>>>();
        this.links = new List<Pair<Int,Int>>();
    }
}
