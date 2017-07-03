package mj;

/**
 * This class is saving distances between two sequences. Like this distances do not
 * need to get recalculated multiple times.
 */
class Delta {
    // the first of the two sequences that this delta represents.
    public var s1:Seq;
    // the second of the two sequences that this delta represents.
    public var s2:Seq;

    // The distance between this two sequences.
    public var dist:Float;

/*
    // the next delta object representing a delta for sequence s1.
    public var s1Next:Delta;
    // the previous delta object representing a delta for sequence s1.
    public var s1Prev:Delta;
    // the next delta object representing a delta for sequence s2.
    public var s2Next:Delta;
    // the previous delta object representing a delta for sequence s2.
    public var s2Prev:Delta;
*/
    public inline function new(s1:Seq, s2:Seq, dist:Float) {
        this.s1 = s1;
        this.s2 = s2;
        this.dist = dist;
/*
        s1.addDelta(this);
        s2.addDelta(this);
*/
    }
}
