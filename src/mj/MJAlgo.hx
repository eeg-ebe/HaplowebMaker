package mj;

import haxe.ds.Vector;
import haxe.ds.ListSort;
import util.StdOutPrinter;

/**
 * This class implements the MJ algorithm.
 */
class MJAlgo {
    public static var version(default, null):String = "1.0.2";

    private var seqs:Seqs;

    public var weights:Vector<Float>;
    public var rweights:Vector<Float>;

    private var rdeltas:List<List<Delta>>;

    private var seqCount:Int;
    private var nextSpId:Int;

    public inline function new() {
        seqs = new Seqs();
        rdeltas = new List<List<Delta>>();
        seqCount = 0;
        nextSpId = 0;
    }

    public inline function distStr(s1:String,s2:String):Float {
        var result:Float = 0.0;
        for(pos in 0...s1.length) {
            if(s1.charAt(pos) != s2.charAt(pos)) {
                result += rweights[pos];
            }
        }
        #if asserts
        if(result < 0) throw "WTF? negative distance?";
        #end
        return result;
    }

    public inline function addSequence(name:String,seq:String):Void {
        seqs.addSample(name, seq);
        seqCount++;
    }

    public inline function finishedAddingSequences():Void {
        if(seqs.size == 0) throw "Need at least one sequence to run the mj algorithm on ...";
        seqs.finishedAddingSamples();
        // calculate reduced weights
        if(weights == null) {
            rweights = new Vector<Float>(seqs.ipos.length);
            for(i in 0...seqs.ipos.length) {
                rweights[i] = 1;
            }
        } else {
            if(this.weights.length != seqs.first.origSeq.length) {
                throw "Expected " + seqs.first.origSeq.length + " weights but got " + this.weights.length + " weights!";
            }
            this.rweights = new Vector(seqs.ipos.length);
            var iii:Int = 0;
            for(e in seqs.ipos) {
                this.rweights[iii++] = weights[e];
            }
        }
        #if debug
        trace("finishedAddingSequences()->result:");
        trace("  Reduced no. of sequences: " + seqs.size);
        trace("  Reduced no. of positions: " + seqs.first.origSeq.length);
        #end
    }

    public inline function runMJ(epsilon:Float):Void {
        if(seqs.size > 1) { // need at least one sequence
            var i:Int;
            do {
                step1();
                step2(epsilon);
                i = step3();
                if(i != 0) {
                    continue;
                }
                i = step4(epsilon);
        } while(i != 0);
        step5();
        }
    }

    private inline function step1():Void {
        #if (debug || debugMJ || debugMJStep1)
        trace("{MJ}.step1()");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        #if asserts
        var count:Int = 0;
        #end
        var deltas:List<Delta> = new List<Delta>();
        var current:Seq = seqs.first;
        while(current != null) {
            #if asserts
            count++;
            if(current == seqs.first && current.prev != null) throw "Reference first is not fine!";
            if(current == seqs.last && current.next != null) throw "Reference first is not fine!";
            if(current == seqs.firstMed && (current.isSample || !current.prev.isSample)) throw "Reference first is not fine!";
            #end
            var current2:Seq = current.next;
            while(current2 != null) {
                #if asserts
                if(current.id == current2.id) throw "How can two Seq objects have the same id?";
                if(current.redSeq == current2.redSeq) throw "How can two Seq objects have the same reduced sequence?";
                if(current.origSeq == current2.origSeq && current.origSeq != null) throw "How can two Seq objects have the same non-null original sequence?";
                if(!current.isSample && current2.isSample) throw "How can a median vector follow a sample?";
                #end
                var d:Delta = new Delta(current, current2, distStr(current.redSeq, current2.redSeq));
                deltas.add(d);
                current2 = current2.next;
            }
            current = current.next;
        }
        #if asserts
        if(count != seqs.size) throw "seqs.size and count differ! (" + seqs.size + ", " + count + ")";
        if(deltas.length != (seqs.size * (seqs.size - 1) / 2)) throw "Number of deltas " + deltas.length + " differ in comparison to nr of sequences " + seqs.size;
        #end
        #if (debug || debugMJ || debugMJStep1)
        trace("{MJ}.step1()->matrix:");
        for(d in deltas) {
            trace(d.s1.redSeq,d.s2.redSeq,d.dist);
        }
        #end
        // sort the delta list (this is in principal the idea of merge sort ... iteratively implemented)
        var sortedLists:List<List<Delta>> = new List<List<Delta>>();
        for(delta in deltas) {
            // if last element in last list is lower or equal -> add to this list
            if(sortedLists.last() != null && sortedLists.last().last() != null && sortedLists.last().last().dist <= delta.dist) {
                sortedLists.last().add(delta);
            }
            // else create new list and add element
            else {
                var newL:List<Delta> = new List<Delta>();
                newL.add(delta);
                sortedLists.add(newL);
            }
        }
        #if asserts
        for(l in sortedLists) {
            if(l == null || l.isEmpty()) throw "Empty or null list in sorted lists detected!";
        }
        #end
        #if (debug || debugMJ || debugMJStep1)
        trace("{MJ}.step1()->sortedLists:");
        for(l in sortedLists) {
            if(l == null) {
                trace("NULL!!!");
            } else {
                for(e in l) {
                    trace(e.s1.redSeq,e.s2.redSeq,e.dist);
                }
            }
            trace("+++");
        }
        #end
        while(sortedLists.length > 1) {
            var l1:List<Delta> = sortedLists.pop();
            var l2:List<Delta> = sortedLists.pop();
            var nL:List<Delta> = new List<Delta>();
            while(!l1.isEmpty() && !l2.isEmpty()) {
                if(l1.first().dist <= l2.first().dist) {
                    nL.add(l1.pop());
                } else {
                    nL.add(l2.pop());
                }
            }
            while(!l1.isEmpty()) {
                nL.add(l1.pop());
            }
            while(!l2.isEmpty()) {
                 nL.add(l2.pop());
            }
            sortedLists.add(nL);
        }
        deltas = sortedLists.first();
        #if asserts
        var prev:Float = -1;
        for(e in deltas) {
            if(e.dist < prev) throw "Later distance should not be lower than previous!";
            prev = e.dist;
        }
        #end
        #if (debug || debugMJ || debugMJStep1)
        trace("{MJ}.step1()->pre sorted deltas:");
        for(d in deltas) {
            trace(d.s1.redSeq,d.s2.redSeq,d.dist);
        }
        #end
        // create delta list
        rdeltas.clear();
        var lastDeltaValue:Float = -1.0;
        var c:List<Delta> = null;
        for(delta in deltas) {
            if(lastDeltaValue != delta.dist) {
                lastDeltaValue = delta.dist;
                if(c != null) {
                    rdeltas.add(c);
                }
                c = new List<Delta>();
            }
            c.add(delta);
        }
        if(c != null) {
            rdeltas.add(c);
        }
        #if (debug || debugMJ || debugMJStep1)
        trace("{MJ}.step1()->result:");
        for(deltas in rdeltas) {
            if(deltas == null) {
                trace("NULL!!!");
            } else if(deltas.isEmpty()) {
                trace("EMPTY!!!");
            } else {
                for(delta in deltas) {
                    trace(delta.s1.redSeq,delta.s1.id,delta.s2.redSeq,delta.s2.id,delta.dist);
                }
            }
            trace("---");
        }
        #end
        #if asserts
        var count:Int = 0;
        var lastV:Float = -1.0;
        for(deltas in rdeltas) {
            if(lastV >= deltas.first().dist) {
                throw "Prev delta list >= Current delta list";
            }
            lastV = deltas.first().dist;
            for(delta in deltas) {
                if(delta.dist != deltas.first().dist) {
                    throw "Current delta list should only contain deltas of same value!";
                }
                count++;
            }
        }
        if(count != (seqs.size * (seqs.size - 1) / 2))
            throw "Counted deltas " + deltas.length + " differ in comparison to nr of sequences " + seqs.size;
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of step1:",(Sys.time() - timestamp));
        #end
    }

    private inline function step2(epsilon:Float):Void {
        #if (debug || debugMJ || debugMJStep2)
        trace("{MJ}.step2(" + epsilon + ")");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        // remove maybe previous existing connections
        var current:Seq = seqs.first;
        while(current != null) {
            current.clearConnections();
            current.visitedId = 0; // for next part of the step - set not visited
            current = current.next;
        }
        // add new
        var nextVisitedId:Int = 1;
        for(deltas in rdeltas) {
            #if (debug || debugMJ || debugMJStep2)
            trace("Processing dists for delta: " + deltas.first().dist);
            #end
            // check which ones to add
            for(delta in deltas) {
                var isConnected:Bool = false;
                // check if s1 and s2 are connected
                var l:List<Seq> = new List<Seq>();
                l.add(delta.s1);
                delta.s1.visitedId = nextVisitedId;
                while(!l.isEmpty()) {
                    var c:Seq = l.pop();
                    if(c == delta.s2) {
                        isConnected = true;
                    }
                    var p:Connection = c.connectedTo;
                    while(p != null) {
                        if(p.connectedTo.visitedId != nextVisitedId && p.dist < delta.dist - epsilon) {
                            l.add(p.connectedTo);
                            p.connectedTo.visitedId = nextVisitedId;
                        }
                        p = p.next;
                    }
                }
                nextVisitedId++;
                #if (debug || debugMJ || debugMJStep2)
                trace(delta.s1.redSeq,delta.s2.redSeq,isConnected);
                #end
                // if yes, get the lowest edge in the graph
                if(!isConnected) {
                    // add the feasable links
                    delta.s1.addConnection(new Connection(delta.s2, delta.dist));
                    delta.s2.addConnection(new Connection(delta.s1, delta.dist));
                    #if (debug || debugMJ || debugMJStep2)
                    trace("Added con:",delta.s1.redSeq,delta.s2.redSeq,delta.dist);
                    #end
                }
            }
        }
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of step2:",(Sys.time() - timestamp));
        #end
    }

    private inline function step3():Int {
        #if (debug || debugMJ || debugMJStep3)
        trace("{MJ}.step3()");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        var nrRem:Int = 0;
        var current:Seq = seqs.firstMed;
        var markDel:List<Seq> = new List<Seq>();
        while(current != null) {
            if(current.nrConnections <= 2) {
                #if (debug || debugMJ || debugMJStep3)
                trace("{MJ}.step3()->marked for deletion:");
                trace(current.redSeq);
                #end
                markDel.add(current);
                nrRem++;
            }
            current = current.next;
        }
        // actually delete
        for(current in markDel) {
            seqs.removeMed(current);
        }
        // return the number of deletions
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of step3:",(Sys.time() - timestamp));
        #end
        return nrRem;
    }

    private inline function step4(epsilon:Float):Int {
        #if (debug || debugMJ || debugMJStep4)
        trace("{MJ}.step4(" + epsilon + ")");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        // create the list of median vectors
        var medLst:List<Median> = new List<Median>();
        var s1:Seq = seqs.first;
        while(s1 != null) {
            var s2_:Connection = s1.connectedTo;
            while(s2_ != null) {
                var s3_:Connection = s2_.next;
                while(s3_ != null) {
                    medLst.add(new Median(s1.redSeq, s2_.connectedTo.redSeq, s3_.connectedTo.redSeq, rweights));
                    s3_ = s3_.next;
                }
                s2_ = s2_.next;
            }
            s1 = s1.next;
        }
        #if (debug || debugMJ || debugMJStep4)
        trace("Nr med vector objs: ",medLst.length);
        var i:Int = 0;
        for(m in medLst) {
            trace("  ",i++,m.s1,m.s2,m.s3,m.dist);
        }
        #end
        // sort vectors by distance (lowest distances first)
        var sortedMeds:List<List<Median>> = new List<List<Median>>();
        for(med in medLst) {
            if(sortedMeds.last() != null && sortedMeds.last().last() != null && sortedMeds.last().last().dist <= med.dist) {
                sortedMeds.last().add(med);
            } else {
                var l:List<Median> = new List<Median>();
                l.add(med);
                sortedMeds.add(l);
            }
        }
        while(sortedMeds.length > 1) {
            var l1:List<Median> = sortedMeds.pop();
            var l2:List<Median> = sortedMeds.pop();
            var nL:List<Median> = new List<Median>();
            while(!l1.isEmpty() && !l2.isEmpty()) {
                if(l1.first().dist <= l2.first().dist) nL.add(l1.pop());
                else nL.add(l2.pop());
            }
            while(!l1.isEmpty()) nL.add(l1.pop());
            while(!l2.isEmpty()) nL.add(l2.pop());
            sortedMeds.add(nL);
        }
        medLst = sortedMeds.pop();
        if(medLst == null) medLst = new List<Median>(); // prevent nullpointer exceptions
        #if asserts
        var prevDist:Float = -1;
        for(med in medLst) {
            if(prevDist > med.dist) throw "Greater median distance at later position in ascending ordered list detected ...";
            prevDist = med.dist;
        }
        #end
        // check median vectors and add them ...
        var nrSeqsAdded:Int = 0;
        var lambda:Float = Math.POSITIVE_INFINITY;
        for(med in medLst) {
            #if asserts
            if(med.diffPos == 0) throw "WTF? No differntiating position found!";
            #end
            if(med.diffPos >= 1 && med.dist <= lambda + epsilon) { // connection does not exceed lambda + epsilon (even if lambda not set ...)
                for(medV in med.constructMedians()) {
                    if(seqs.containsMed(medV)) continue; // do nothing if sequence is already in the set of sequences
                    lambda = Math.min(lambda, med.dist); // we found a sequence - so set new lamdba value
                    seqs.addMedian(medV);                // and add the median sequence ...
                    nrSeqsAdded++;
                    #if (debug || debugMJ || debugMJStep4)
                    trace("Added median vector: ", medV);
                    #end
                }
            } else {
                break; // since list is sorted, med.dist will only increase -> we can break here!
            }
        }
        // return number of sequences added
        #if (debug || debugMJ || debugMJStep4)
        trace("SEQS:");
        var current:Seq = seqs.first;
        var iiiii:Int = 0;
        while(current != null) {
            trace(iiiii++,current.id,current.redSeq);
            current = current.next;
        }
        trace("LENGHT:", seqs.size);
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of step4:",(Sys.time() - timestamp));
        #end
        return nrSeqsAdded;
    }

    private inline function step5():Void {
        #if (debug || debugMJ || debugMJStep5)
        trace("{MJ}.step5()");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        var i:Int;
        do {
            step1();
            step2(0);
            i = step3();
        } while(i != 0);
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of step5:",(Sys.time() - timestamp));
        #end
    }

    public inline function finalizeNetwork():Seqs {
        // links, sorting, ids
        #if (debug || debugMJ || debugMJStep5)
        trace("{MJ}.finalizeNetwork()");
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        var timestamp:Float = Sys.time();
        #end
        // sort sequences
        seqs.first = ListSort.sort(seqs.first, function(a, b):Int {
            return b.names.length - a.names.length;
        });
        // set ids and links
        var count:Int = 0;
        var current = seqs.first;
        var v:Vector<String> = new Vector<String>(current.origSeq.length);
        for(i in 0...current.origSeq.length) {
            v[i] = current.origSeq.charAt(i);
        }
        while(current != null) {
            current.id = ++count;
            if(!current.isSample) {
                // construct original sequence for non-samples
                current.constructSeq(v,seqs.ipos);
            }
            var current2 = current.next;
            while(current2 != null && current2.isSample) {
                // add links
                current.addLinkBySeq(current2);
                // next
                current2 = current2.next;
            }
            current = current.next;
        }
        // assign species ids
        var l:List<Seq> = new List<Seq>();
        current = seqs.first;
        while(current != null && current.isSample) {
            if(current.spId == 0) {
                // set next sp. id.
                nextSpId++;
                current.spId = nextSpId;
                // set all species connected by link the species id.
                l.clear();
                l.add(current);
                while(!l.isEmpty()) {
                    var c:Seq = l.pop();
                    for(n in c.linkedTo) {
                        var n:Seq = n.to;
                        if(n.spId == 0) {
                            n.spId = nextSpId;
                            l.add(n);
                        } else if(n.spId != nextSpId) {
                            throw "Something somewhere went terribly wrong (#1)!";
                        }
                    }
                }
            }
            current = current.next;
        }
        #if asserts
        if(seqs.size != count) throw "Sequence size and count differ in finalization!";
        #end
        #if (timeInfo && (cpp || cs || java || macro || neko || php || python))
        trace("Time usage of finalization:",(Sys.time() - timestamp));
        #end
        return this.seqs;
    }

    public inline function getNrSeqs():Int {
        return seqCount;
    }
    public inline function getNrDifSeqs():Int {
        return this.seqs.size;
    }
    public inline function getSeqLength():Int {
        return this.seqs.origSeqLen;
    }
    public inline function getNrInterestingPositions():List<Int> {
        return this.seqs.ipos;
    }
    public inline function getNrFFRs():Int {
        return this.nextSpId;
    }
    public inline function countIndiv():Int {
        var l:List<String> = new List<String>();
        var current:Seq = seqs.first;
        var inLst:Bool = false;
        while(current != null && current.isSample) {
            for(indName in current.indNames) {
                inLst = false;
                for(name in l) {
                    if(name == indName) {
                        inLst = true;
                        break;
                    }
                }
                if(!inLst) {
                    l.add(indName);
                }
            }
            current = current.next;
        }
        return l.length;
    }

    public static function main():Void {
/*
        var m:MJAlgo = new MJAlgo();
        m.addSequence("A_6", "11000");
        m.addSequence("A_7", "10110");
        m.addSequence("A_9", "10110");
        m.addSequence("A_8", "01101");
        m.addSequence("A_1", "00000");
        m.addSequence("A_2", "00000");
        m.addSequence("A_3", "00000");
        m.addSequence("A_4", "00000");
        m.addSequence("A_5", "00000");
        m.weights = new Vector<Float>(5);
        m.weights[0] = 1;
        m.weights[1] = 3;
        m.weights[2] = 2;
        m.weights[3] = 1;
        m.weights[4] = 2;
        m.finishedAddingSequences();
        m.runMJ(2);
        m.finalizeNetwork().printTxt(new StdOutPrinter());
*/
    }
}
