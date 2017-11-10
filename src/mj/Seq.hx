package mj;

import haxe.ds.Vector;

/**
 * This class is representing a sequence.
 */
class Seq {
    // === Methods and Attributes for saving the Sequence into the Seqs-Set ...
    // reference to the next sequence
    public var next:Seq;
    // reference to the previous sequence
    public var prev:Seq;

    // the precalculated hashcode of this object
    public var hashCode:Int;
    // the next sequence with this hashCode
    public var nextWithHash:Seq;
    // the previous sequence with this hashCode
    public var prevWithHash:Seq;

    // Issue #10: Allow users to choose between different delimiters
    public static var delimiter = "_";

    // calculate the hashcode for a string ...
    public static inline function calcHash(s:String):Int {
        #if asserts
        if(s == null) throw "Cannot calculate hash code for null string!";
        #end
        var result:Int = 7;
        for(pos in 0...s.length) {
            result = 31 * result + s.charCodeAt(pos);
        }
        return result;
    }
    public inline function calcHashForOrig():Void {
        this.hashCode = Seq.calcHash(this.origSeq);
    }
    public inline function calcHashForRed():Void {
        this.hashCode = Seq.calcHash(this.redSeq);
    }
    // === End of methods and Attributes for saving the sequence into the Seqs-Set ...

    // === Names of the sequence
    // possible names for this sequence.
    public var names:List<String>;
    // names of sampled individues having this sequence.
    public var indNames:List<String>;

    // check whether an "individual identifier" can be found in the names of "individual identifiers" connected to this sequence.
    public static inline function getIndIdentifier(s:String):String {
        var result:String = s;
        if(s != null) {
            var pos:Int = s.lastIndexOf(delimiter);
            if(pos != -1) {
                result = s.substr(0, pos);
            }
        }
        return result;
    }
    // add a name to this sequence.
    public inline function addName(s:String):Void {
        if(s != null && s != "") {
            // add this name
            this.names.add(s);
            // get the name of the individual
            var indId:String = Seq.getIndIdentifier(s);
            // if the individual name already in the list
            if(!hasIndIdentifier(indId)) {
                // no it is not - so add
                this.indNames.add(indId);
            }
        }
    }
    // check whether an "individual identifier" is present in the current list of "individual identifier"
    // that are connected to this sequence.
    public inline function hasIndIdentifier(s:String):Bool {
        var result:Bool = false;
        for(indName in this.indNames) {
            if(indName == s) {
                result = true;
                break;
            }
        }
        return result;
    }
    // get the list of individual present in the list and also connected to this sequence.
    public inline function cmpIndIdentifiers(o:List<String>):List<String> {
        var result:List<String> = new List<String>();
        for(e in o) {
            if(this.hasIndIdentifier(e)) {
                result.add(e);
            }
        }
        return result;
    }
    // === End of sequence names

    // === Sequence information
    // The non-reduced version of this sequence. May be null if this sequence is not among the sampled sequences
    // and the original sequence did not get calculated yet!
    public var origSeq:String;
    // The reduced version of this sequence. May be null if this is a sampled sequence and the reduced version
    // was not calculated yet!
    public var redSeq:String;

    public inline function reduceSequence(ipos:List<Int>):Void {
        var l:List<String> = new List<String>();
        for(e in ipos) {
            l.add(this.origSeq.charAt(e));
        }
        redSeq = l.join("");
    }
    public inline function constructSeq(s:Vector<String>,ipos:List<Int>):Void {
        var i:Int = 0;
        for(pos in ipos) {
            s[pos] = this.redSeq.charAt(i++);
        }
        this.origSeq = s.join("");
    }
    // === End of sequence informations 

    // === Sequence type
    // whether sequence is among the sampled sequences or not
    public var isSample:Bool;
    // === End of sequence type

    // === Ids
    // a possible id for this sequence.
    public var id:Int;
    // a possible species id for this sequence.
    public var spId:Int;
    // a visited id!
    public var visitedId:Int;
    // === End of ids

/*
    // === Deltas
    // the deltas connected to this sequence.
    public var firstDelta:Delta;

    public inline function addDelta(d:Delta):Void {
        // check in which list we have to add the delta
        if(this == d.s1) {
            d.s1Next = firstDelta;
            if(firstDelta != null) {
                firstDelta.s1Prev = d;
            }
        } else if(this == d.s2) {
            d.s2Next = firstDelta;
            if(firstDelta != null) {
                firstDelta.s2Prev = d;
            }
        } else {
            throw "AssertError - WTF? Don't know in which list to add the delta!";
        }
        firstDelta = d;
    }
    public inline function removeDelta(d:Delta):Void {
        if(this == d.s1) {
            // change the previous element
            if(d.s1Prev != null) {
                // there is a previous element - so we need to say to the previous element that the next element is somewhere else (since the next element get's removed ...)
                if(this == d.s1Prev.s1) {
                    d.s1Prev.s1Next = d.s1Next;
                } else if(this == d.s1Prev.s2) {
                    d.s1Prev.s2Next = d.s1Next;
                } else {
                    throw "AssertError - WTF? From which sublist do I need to remove the element? (Case 1)";
                }
            } else {
                // there is no previous element - so we need to set firstDelta
                firstDelta = d.s1Next;
            }
            // change the next element
            if(d.s1Next != null) {
                if(this == d.s1Next.s1) {
                    d.s1Next.s1Prev = d.s1Prev;
                } else if(this == d.s1Next.s2) {
                    d.s1Next.s2Prev = d.s1Prev;
                } else {
                    throw "AssertError - WTF? From which sublist do I need to remove the element? (Case 2)";
                }
            }
        } else if(this == d.s2) {
            // change the previous element
            if(d.s2Prev != null) {
                // there is a previous element - so we need to say to the previous element that the next element is somewhere else (since the next element get's removed ...)
                if(this == d.s2Prev.s1) {
                    d.s2Prev.s1Next = d.s2Next;
                } else if(this == d.s2Prev.s2) {
                    d.s2Prev.s2Next = d.s2Next;
                } else {
                    throw "AssertError - WTF? From which sublist do I need to remove the element? (Case 3)";
                }
            } else {
                // there is no previous element - so we need to set firstDelta
                firstDelta = d.s2Next;
            }
            // change the next element
            if(d.s2Next != null) {
                if(this == d.s2Next.s1) {
                    d.s2Next.s1Prev = d.s2Prev;
                } else if(this == d.s1Next.s2) {
                    d.s2Next.s2Prev = d.s2Prev;
                } else {
                    throw "AssertError - WTF? From which sublist do I need to remove the element? (Case 4)";
                }
            }
        } else {
            throw "AssertError - WTF? Don't know from which list to remove the delta!";
        }
    }
    public inline function destroyDeltaList():Void {
        var cDelta:Delta = firstDelta;
        while(cDelta != null) {
            if(cDelta.s1 == this) {
                cDelta.s2.removeDelta(cDelta);
                cDelta = cDelta.s1Next;
            } else if(cDelta.s2 == this) {
                cDelta.s1.removeDelta(cDelta);
                cDelta = cDelta.s2Next;
            } else {
                throw "AssertError - WTF? Delta list of other sequence not found!";
            }
        }
        firstDelta = null;
    }
    // == End of deltas
*/

    // === graph connections to other components
    // connections
    public var connectedTo:Connection;
    public var nrConnections:Int;
    // links
    public var linkedTo:List<Link>;

    public inline function addConnection(c:Connection):Void {
        c.next = connectedTo;
        connectedTo = c;
        nrConnections++;
    }
    public inline function clearConnections():Void {
        nrConnections = 0;
        connectedTo = null;
    }
    public inline function addLinkTo(o:Seq,names:List<String>):Void {
        if(names != null && !names.isEmpty()) {
           var l:Link = new Link();
           l.to = o;
           l.names = names;
           #if asserts
           for(e in this.linkedTo) {
               if(e.to == o) throw "Assertation Error - link object already in list! Why should we re-add it?";
           }
           #end
           this.linkedTo.add(l);
        }
    }
    public inline function addLinkBySeq(os:Seq):Void {
        var l:List<String> = cmpIndIdentifiers(os.indNames);
        this.addLinkTo(os, l);
        os.addLinkTo(this, l);
    }
    // end of graph connections

    // === constructor and constructor like functions
    public inline function new() {
        this.names = new List<String>();
        this.indNames = new List<String>();
        this.linkedTo = new List<Link>();
        this.spId = 0; // 0 means not assigned
    }

    public static inline function createSample(id:Int,name:String,seq:String):Seq {
        var result:Seq = new Seq();
        result.id = id;
        result.addName(name);
        result.origSeq = seq;
        result.calcHashForOrig();
        result.isSample = true;
        return result;
    }
    public static inline function createMedian(id:Int,seq:String):Seq {
        var result:Seq = new Seq();
        result.id = id;
        result.redSeq = seq;
        result.calcHashForRed();
        result.isSample = false;
        return result;
    }
    // === End of constructor and constructor like functions
}
