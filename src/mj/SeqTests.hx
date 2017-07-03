package mj;

import haxe.unit.TestCase;

class SeqTests extends TestCase {
    public function testBasic() {
        var s:Seq = new Seq();
        // calcHash
        assertEquals(Seq.calcHash("ACTG"), Seq.calcHash("ACTG")); // the hashing function should always result in the same result
        assertFalse(Seq.calcHash("ACTG") == Seq.calcHash("ACGT"));
        // getIndIdentifier
        assertEquals("AAAB_", Seq.getIndIdentifier("AAAB_"));
        assertEquals("AAAB_", Seq.getIndIdentifier("AAAB_1"));
        assertEquals("AAAB_", Seq.getIndIdentifier("AAAB_Ag7uw8h8erg"));
        assertEquals("AAAB_CCC_", Seq.getIndIdentifier("AAAB_CCC_DEE"));
        assertEquals("_", Seq.getIndIdentifier("_A"));
        // addName
        s.addName("FOO_1");
        s.addName("FOO_2");
        s.addName("FOO_3");
        assertEquals(3, s.names.length);
        assertEquals("FOO_1", s.names.first());
        assertEquals("FOO_3", s.names.last());
        assertEquals(1, s.indNames.length);
        assertEquals("FOO_", s.indNames.first());
        // hasIndIdentifier
        assertTrue(s.hasIndIdentifier("FOO_"));
        assertFalse(s.hasIndIdentifier("BAR_"));
        // cmpIndIdentifiers
        var l:List<String> = new List<String>();
        l.add("FOO_");
        l.add("BAR_");
        assertEquals(1, s.cmpIndIdentifiers(l).length);
        assertEquals("FOO_", s.cmpIndIdentifiers(l).first());
        l.clear();
        l.add("BAR_");
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
}
