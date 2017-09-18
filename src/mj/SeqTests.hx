package mj;

import haxe.unit.TestRunner;
import haxe.unit.TestCase;

class SeqTests extends TestCase {
    public function testBasic() {
        var s:Seq = new Seq();
        // calcHash
        assertEquals(Seq.calcHash("ACTG"), Seq.calcHash("ACTG")); // the hashing function should always result in the same result
        assertFalse(Seq.calcHash("ACTG") == Seq.calcHash("ACGT"));
        // getIndIdentifier
        assertEquals("AAAB", Seq.getIndIdentifier("AAAB_"));
        assertEquals("AAAB", Seq.getIndIdentifier("AAAB_1"));
        assertEquals("AAAB", Seq.getIndIdentifier("AAAB_Ag7uw8h8erg"));
        assertEquals("AAAB_CCC", Seq.getIndIdentifier("AAAB_CCC_DEE"));
        assertEquals("", Seq.getIndIdentifier("_A"));
        // addName
        s.addName("FOO_1");
        s.addName("FOO_2");
        s.addName("FOO_3");
        assertEquals(3, s.names.length);
        assertEquals("FOO_1", s.names.first());
        assertEquals("FOO_3", s.names.last());
        assertEquals(1, s.indNames.length);
        assertEquals("FOO", s.indNames.first());
        // hasIndIdentifier
        assertTrue(s.hasIndIdentifier("FOO"));
        assertFalse(s.hasIndIdentifier("BAR"));
        // cmpIndIdentifiers
        var l:List<String> = new List<String>();
        l.add("FOO");
        l.add("BAR");
        assertEquals(1, s.cmpIndIdentifiers(l).length);
        assertEquals("FOO", s.cmpIndIdentifiers(l).first());
        l.clear();
        l.add("BAR");
        assertEquals(0, s.cmpIndIdentifiers(l).length);
        // reduceSequence
        var l:List<Int> = new List<Int>();
        l.add(0); l.add(5); l.add(7); l.add(8); l.add(13);
        s.origSeq = "GCACGGGCCGATGTTACAGGGATGAATAAAACGTTGGATTACGAGCTACTGGAGTCGCCGGATTCAGTAGACCATCGAAC";
        s.reduceSequence(l);
        assertEquals("GGCCT", s.redSeq);
        // 
// addDelta, removeDelta, destroyDeltaList, addConnection, clearConnections
// addLinkTo, addLinkBySeq
// createSample, createMedian
assertEquals(1,1);
    }

    public static function main():Void {
        var tr = new TestRunner();
        tr.add(new SeqTests());
        tr.run();
    }
}
