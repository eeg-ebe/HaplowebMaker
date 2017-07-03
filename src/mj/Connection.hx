package mj;

/**
 * This class represents a connection / edge between two objects of class Seq
 * calculated via the MJ algorithmus. 
 */
class Connection {
    public var next:Connection;
    public var connectedTo:Seq;
    public var dist:Float;

    public inline function new(conT:Seq,dist:Float) {
        this.connectedTo = conT;
        this.dist = dist;
    }
}
