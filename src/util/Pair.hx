package util;

class Pair<U,V> {
    public var first(default, default):U = null;
    public var second(default, default):V = null;

    public function new(u:U, v:V) {
        this.first = u;
        this.second = v;
    }

    public function swapFirst(p:Pair<U,V>) {
        var tmp:U = this.first;
        this.first = p.first;
        p.first = tmp;
    }
    public function swapSecond(p:Pair<U,V>) {
        var tmp:V = this.second;
        this.second = p.second;
        p.second = tmp;
    }
    public function swap(p:Pair<U,V>) {
        swapFirst(p);
        swapSecond(p);
    }
}

