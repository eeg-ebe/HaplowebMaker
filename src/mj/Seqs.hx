package mj;

import haxe.ds.Vector;
import interfaces.Printer;

/**
 * This class is representing the set of all sequences.
 */
class Seqs {
    // the first sequence in this set of sequences.
    public var first:Seq;
    // the first non-sampled (median vector/steiner node) sequence in this set of sequences.
    public var firstMed:Seq;
    // the last sequence in this set of sequences.
    public var last:Seq;

    // the number of sequences in this set
    public var size:Int;

    // for faster finding the sequences
    public var hashTable:Vector<Seq>;

    // the next sequence id
    public var nextSeqId:Int;
    // the length of the original sequences
    public var origSeqLen:Int;
    // the interesting positions in the original sequence
    public var ipos:List<Int>;

    // allow the creation of a new Seq dataset
    public inline function new() {
        #if asserts
        hashTable = new Vector(1);
        #else
        hashTable = new Vector(100);
        #end
        nextSeqId = 1;
        origSeqLen = -1;
        ipos = new List<Int>();
        size = 0;
    }

    // helper function
    private inline function hashCodeToIndex(hc:Int):Int {
        return ((hc >= 0) ? (hc % hashTable.length) : ((-hc) % hashTable.length));
    }
    // reallocate the hashtable and rehash all elements in the table
    private inline function rehash(newSize:Int):Void {
        #if asserts
        if(newSize < 1) throw "Assertation Error - newSize should be bigger than 1 but is " + newSize;
        #end
        hashTable = new Vector(newSize);
        var c:Seq = first;
        while(c != null) {
            // add again
            addSeqToHashtable(c);
            c = c.next;
        }
    }
    // add the sequence to the hashtable
    private inline function addSeqToHashtable(s:Seq):Void {
        // remove maybe present old links (in case this sequence was already added somewhere in an old hashtable
        s.nextWithHash = null;
        s.prevWithHash = null;
        // now add this sequence
        var index:Int = hashCodeToIndex(s.hashCode);
        if(hashTable[index] == null) {
            hashTable[index] = s;
        } else {
            s.nextWithHash = hashTable[index];
            hashTable[index].prevWithHash = s;
            hashTable[index] = s;
        }
    }
    private inline function addSeq(s:Seq):Void {
        // before calling this function - check if the element is already present in the set ...
        // since we need an element - add one to size
        size++;
        // check if we have about enough elements in the hashtable
        if((hashTable.length >> 1) < size) {
            // if not, resize the hashtable and rehash elements
            rehash(hashTable.length << 1);
        }
        // add the sequence
        addSeqToHashtable(s);
        // add the sequence to the list
        if(first == null) { // no element in list
            first = s;
        } else {  // at least one element in list - so last is also != null
            s.prev = last;
            last.next = s;
        }
        last = s;
        if(firstMed == null && !s.isSample) {
            firstMed = s;
        }
    }
    // Add a sample to this collection of sequences
    public function addSample(name:String, seq:String):Void {
        // check sequence length
        if(origSeqLen != -1 && origSeqLen != seq.length) {
            throw "Sequence differentiate in length! Please align sequences first!";
        } else if(seq.length == 0) {
            throw "Cannot add empty string!";
        }
        origSeqLen = seq.length;
        // ok, is this sequence already in this collection?
        var hc:Int = hashCodeToIndex(Seq.calcHash(seq));
        var s:Seq = hashTable[hc];
        while(s != null) {
            if(s.origSeq == seq) { // found! There's already a sequence object with this original sequence in the list
                s.addName(name);
                return;
            }
            s = s.nextWithHash;
        }
        // not in collection? Add a new sequence object with this sequence
        addSeq(Seq.createSample(nextSeqId++, name, seq));

    }
    public inline function containsMed(seq:String):Bool {
        var result:Bool = false;
        var hc:Int = hashCodeToIndex(Seq.calcHash(seq));
        var s:Seq = hashTable[hc];
        while(s != null) {
            #if asserts
            if(hc != hashCodeToIndex(s.hashCode)) throw "Element does not have the right hashcode! (" + s.hashCode + "!=" + hc + "@" + hashTable.length + ")";
            #end
            if(s.redSeq == seq) {
                result = true;
                break;
            }
            s = s.nextWithHash;
        }
        return result;
    }
    public inline function addMedian(seq:String):Void {
        #if asserts
        if(seq == null || seq.length != ipos.length) {
            throw "Maliscious median vector sequence \"" + seq + "\"!";
        }
        #end
        // is the median vector already present? Then do nothing
        if(!containsMed(seq)) {
            // ok, add a new sequence
            addSeq(Seq.createMedian(nextSeqId++, seq));
        }
    }
    public inline function removeMed(s:Seq):Void {
        #if asserts
        if(!s.isSample) throw "Cannot remove sampled sequence!";
        #end
        // destroy the sequence
        // don't need to destroy linkedTo - a median vector does not have links
        s.linkedTo.clear(); // don't need to destroy connectedTo in other sequence objects - will be done by step2 afterwards
/*
        // destroy deltas
        s.destroyDeltaList();
*/
        // a median vector can never be on first!
        #if asserts
        if(s == first) throw "How can a median vector become first in list?";
        #end
        if(firstMed == s) {
            firstMed = s.next;
        }
        if(last == s) {
            last = s.prev;
        }
        var index:Int = hashCodeToIndex(s.hashCode);
        #if asserts
        if(hashTable[index] == null) throw "How can hashTable[index] here be null?";
        #end
        if(hashTable[index] == s) {
            hashTable[index] = s.nextWithHash;
        }
        if(s.next != null) {
            s.next.prev = s.prev;
        }
        if(s.prev != null) {
            s.prev.next = s.next;
        }
        if(s.nextWithHash != null) {
            s.nextWithHash.prevWithHash = s.prevWithHash;
        }
        if(s.prevWithHash != null) {
            s.prevWithHash.nextWithHash = s.nextWithHash;
        }
        size--;
        // speedup for gc
        s.next = null;
        s.prev = null;
        s.nextWithHash = null;
        s.prevWithHash = null;
    }

    public inline function finishedAddingSamples():Void {
        if(this.origSeqLen <= 1) throw "Need at least two sampled sequences!";
        // create interesting positions (ipos) list
        for(pos in 0...this.origSeqLen) {
            var current:Seq = first.next;
            while(current != null) {
                if(first.origSeq.charAt(pos) != current.origSeq.charAt(pos)) {
                    ipos.add(pos);
                    break;
                }
                current = current.next;
            }
        }
        // for each sequence
        var current:Seq = first;
        while(current != null) {
            // create reduced sequences
            current.reduceSequence(ipos);
            // change hashing function
            current.calcHashForRed();
            current = current.next;
        }
        // rehash
        rehash(hashTable.length << 1);
    }

    public inline function printTxt(printer:Printer):Void {
        // print out all nodes
        printer.printString("#Calculated via HaplowebMaker version ");
        printer.printString(MJAlgo.version);
        printer.printString(printer.newline);
        var c:Seq = first;
        while(c != null) {
            // output what this is
            printer.printString(((c.isSample) ? "SAMPLED_SEQUENCE" : "MEDIAN_VECTOR"));
            printer.printString(printer.newline);
            // node id
            printer.printString(printer.indent);
            printer.printString("ID ");
            printer.printString("" + c.id);
            printer.printString(printer.newline);
            // species id
            if(c.isSample) {
                printer.printString(printer.indent);
                printer.printString("SPECIES_ID ");
                printer.printString("" + c.spId);
                printer.printString(printer.newline);
            }
            // seq
            printer.printString(printer.indent);
            printer.printString("SEQUENCE ");
            printer.printString("" + c.origSeq);
            printer.printString(printer.newline);
            if(c.names != null && c.names.length > 0) {
                // length of names
                printer.printString(printer.indent);
                printer.printString("NB_NAMES ");
                printer.printString("" + c.names.length);
                printer.printString(printer.newline);
                // names
                printer.printString(printer.indent);
                printer.printString("NAMES");
                printer.printString(printer.newline);
                for(name in c.names) {
                    printer.printString(printer.indent);
                    printer.printString(printer.indent);
                    printer.printString(name);
                    printer.printString(printer.newline);
                }
            }
            // connections
            if(c.connectedTo != null && c.nrConnections > 0) {
                printer.printString(printer.indent);
                printer.printString("CONNECTED_TO ");
                printer.printString(printer.newline);
                var con:Connection = c.connectedTo;
                while(con != null) {
                    printer.printString(printer.indent);
                    printer.printString(printer.indent);
                    printer.printString("ID " + con.connectedTo.id);
                    printer.printString(" COSTS " + con.dist + " @");
                    for(pos in 0...c.origSeq.length) {
                        if(c.origSeq.charAt(pos) != con.connectedTo.origSeq.charAt(pos)) {
                            printer.printString(" " + (pos + printer.countingOffset));
                        }
                    }
                    printer.printString(printer.newline);
                    con = con.next;
                }
            }
            // links
            if(c.linkedTo != null && c.linkedTo.length > 0) {
                printer.printString(printer.indent);
                printer.printString("LINKED_TO ");
                printer.printString(printer.newline);
                for(link in c.linkedTo) {
                    printer.printString(printer.indent);
                    printer.printString(printer.indent);
                    printer.printString("ID " + link.to.id + " COUNT " + link.names.length);
                    printer.printString(printer.newline);
                }
            }
            // next c
            c = c.next;
        }
        printer.close();
    }
}
