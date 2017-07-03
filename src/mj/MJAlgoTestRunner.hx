package mj;

import haxe.unit.TestRunner;

/**
 * This class only purpose is to run all available tests ...
 */
class MJAlgoTestRunner {
    public static function main():Void {
        var tr = new TestRunner();
        tr.add(new MJAlgoTests());
        tr.add(new SeqsTests());
        tr.add(new SeqTests());
        tr.run();
    }
}
