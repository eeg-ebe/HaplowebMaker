package mj;

/**
 * This class represent a link between two Sequences.
 */
class Link {
    public var to:Seq;
    public var names:List<String>;

    public inline function new() {}
    public inline function countInd():Int {
        return names.length;
    }
}
