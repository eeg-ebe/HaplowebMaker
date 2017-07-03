package mj;

import haxe.unit.TestCase;

class SeqsTests extends TestCase {
//addSample
//containsMed
//addMedian
//removeMed
//finishedAddingSamples
    public function testBasic() {
        var s:Seqs = new Seqs();
        // addSample
        s.addSample("FOO", "ACTGACTGACTGACTG");
        s.addSample("BAR", "ACTGACTGACTGACTG");
        s.addSample("FOOBAR", "ACTGACTGACTGACTG");
        assertEquals(1, s.size);
        try {
            s.addSample("FOOBAR", "ACTGG"); // differentiate in length
            assertFalse(true);
        } catch(e:Dynamic) {}
        s.addSample("XXX", "GGGGGGGGGGGGGGGG");
        s.addSample("YYY", "TTTTTTTTTTTTTTTT");
        s.finishedAddingSamples();
        assertTrue(s.containsMed("ACTGACTGACTGACTG"));
        assertFalse(s.containsMed("AAAAAAAAAAAAAAAA"));
        s.addMedian("AAAAAAAAAAAAAAAA");
        assertTrue(s.containsMed("AAAAAAAAAAAAAAAA"));
    }
}
