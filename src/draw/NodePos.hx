package draw;

import parsing.Node;
import util.Pair;
import mj.Seq;

class NodePos {
    public static var areaShouldBePropToNrInd:Bool = false;

    public var node(default,null):Node;

    public var xPos(default,null):Float;
    public var yPos(default,null):Float;

    public var radius(default,null):Float;
    public var pie(default,null):List<Pair<String,Int>>;

    public var strokeColor(default,null):String;
    public var strokeWidth(default,null):Float;
    public var dashedArray(default,null):List<Float>;

    public var velocityX:Float;
    public var velocityY:Float;
    public var forceX:Float;
    public var forceY:Float;

    public var isProcessed:Bool;

    private var valid:Bool;
    private var svg:String;
    public inline function set_xPos(n:Float):Void {
        valid = false;
        xPos = n;
    }
    public inline function set_yPos(n:Float):Void {
        valid = false;
        yPos = n;
    }
    public inline function mult_radius(v:Float):Void {
        set_radius(v * radius);
    }
    public inline function set_radius(n:Float):Void {
        valid = false;
        radius = n;
    }
    public inline function set_pie(n:List<Pair<String,Int>>):Void {
        valid = false;
        pie = n;
    }
    public inline function set_pieByArrays(n1:Array<String>, n2:Array<Int>):Void {
        if(n1.length != n2.length) {
            throw "n1 and n2 differ in size!";
        }
        var l:List<Pair<String,Int>> = new List<Pair<String,Int>>();
        for(i in 0...n1.length) {
            l.add(new Pair<String, Int>(n1[i], n2[i]));
        }
        this.set_pie(l);
    }
    public inline function set_color(s:String) {
        var l:List<Pair<String,Int>> = new List<Pair<String,Int>>();
        l.add(new Pair<String,Int>(s, 1));
        this.set_pie(l);
    }
    public inline function set_pieByLst(l:List<Pair<String,String>>, ignoreCase:Bool, byIndNameOnly:Bool):Void {
        var l_:List<Pair<String,Int>> = new List<Pair<String,Int>>();
        for(name in node.names) {
            if(byIndNameOnly) {
                name = Seq.getIndIdentifier(name);
            }
            var colorName:String = null;
            for(p in l) {
                if(ignoreCase) {
                    if(p.first.toUpperCase() == name.toUpperCase()) {
                        colorName = p.second.toLowerCase();
                        break;
                    }
                } else {
                    if(p.first == name) {
                        colorName = p.second.toLowerCase();
                        break;
                    }
                }
            }
if(colorName == null) {
    trace("WARN: No colorname found/given for '" + name + "'!");
}
            var found:Bool = false;
            for(p in l_) {
                if(p.first == colorName) {
                    p.second++;
                    found = true;
                    break;
                }
            }
            if(!found) {
                l_.add(new Pair<String,Int>(colorName, 1));
            }
        }
        this.set_pie(l_);
    }
    public inline function set_strokeColor(n:String):Void {
        valid = false;
        strokeColor = n;
    }
    public inline function set_strokeWidth(n:Float):Void {
        valid = false;
        strokeWidth = n;
    }
    public inline function set_dashedArray(n:List<Float>):Void {
        valid = false;
        dashedArray = n;
    }

    public inline function new(n:Node) {
        valid = false;
        pie = new List<Pair<String,Int>>();
        this.node = n;
        if(areaShouldBePropToNrInd) {
            this.radius = 3 + Math.sqrt(node.names.length);
        } else {
            this.radius = 3 + node.names.length;
        }
        if(this.node.type == MEDIAN_VECTOR) {
            this.strokeColor = "grey";
            this.strokeWidth = 1;
        } else {
            this.strokeColor = "black";
            this.strokeWidth = 1;
        }
        dashedArray = new List<Float>();
    }

    public inline function getNodeSvg():String {
        if(valid) {
            return svg;
        }
        // preperation
        var result:List<String> = new List<String>();
        this.pie = this.pie.filter(function(t:Pair<String,Int>):Bool {
            return t.first != null && t.first != "" && t.second > 0;
        });
        var needArcs:Bool = false;
        // output circle
        result.add("<circle id='");
        result.add("n" + node.id);
        result.add("' ");
        result.add("stroke='");
        result.add(this.strokeColor);
        result.add("' ");
        result.add("stroke-width='");
        result.add("" + this.strokeWidth);
        result.add("' ");
        if(!this.dashedArray.isEmpty()) {
            result.add("stroke-dasharray='");
            result.add(this.dashedArray.join(","));
            result.add("' ");
        }
        result.add("cx='");
        result.add("" + this.xPos);
        result.add("' ");
        result.add("cy='");
        result.add("" + this.yPos);
        result.add("' ");
        result.add("r='");
        result.add("" + this.radius);
        result.add("' ");
        // pie
        if(this.pie.isEmpty()) {
            result.add("fill='blue'");
        } else if(this.pie.length == 1) {
            result.add("fill='");
            result.add(pie.first().first);
            result.add("' ");
        } else {
            needArcs = true;
        }
        result.add("/>");
        // arcs
        if(needArcs) {
            var summe:Float = 0;
            for(p in this.pie) {
                summe += p.second;
            }
            var cs:Float = 0;
            for(p in this.pie) {
                var color:String = p.first;
                var perc:Float = p.second / summe;
                var pX1:Float = Math.sin(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
                var pY1:Float = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.yPos;
                cs += p.second;
                var pX2:Float = Math.sin(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
                var pY2:Float = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.yPos;
                var arcFlag:Int = (perc < 0.5) ? 0 : 1;
                result.add("<path fill='" + color + "' d='M" + this.xPos + "," + this.yPos + "L" + pX1 + "," + pY1 + "A" + this.radius + "," + this.radius + " 1 " + arcFlag + ",1 " + pX2 + ", " + pY2 + " z'/>");
            }
        }
        // result
        svg = result.join("");
        valid = true;
        return svg;
    }

    public inline function minX():Float {
        return xPos - radius;
    }
    public inline function maxX():Float {
        return xPos + radius;
    }
    public inline function minY():Float {
        return yPos - radius;
    }
    public inline function maxY():Float {
        return yPos + radius;
    }

    // Issue #1: Haplotype identification in the network
    public function getDivContent():String {
        var result:String = "<table style='width:100%'>";
        result += "<tr><td>Id</td><td>" + this.node.id + "</td></tr>";
        result += "<tr><td>SpId</td><td>" + this.node.spId + "</td></tr>";
        result += "<tr><td>Seq</td><td>" + this.node.seq + "</td></tr>";
        result += "<tr><td>Names</td><td>" + this.node.names.join(";") + "</td></tr>";
        result += "<tr><td>xPos</td><td>" + this.xPos + "</td></tr>";
        result += "<tr><td>yPos</td><td>" + this.yPos + "</td></tr>";
        result += "<tr><td>radius</td><td>" + this.radius + "</td></tr>";
        result += "</table>";
        return result;
    }
}
