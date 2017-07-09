package draw;

import parsing.Node;
import util.Pair;

class NodePos {
    public var node:Node;

    public var xPos:Float;
    public var yPos:Float;

    public var radius:Float;
    public var pie:List<Pair<String,Int>>;

    public var strokeColor:String;
    public var strokeWidth:Float;
    public var dashedArray:List<Float>;

    public inline function new(n:Node) {
        pie = new List<Pair<String,Int>>();
        dashedArray = new List<Float>();
        this.node = n;
    }

    public inline function getNodeSvg():String {
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
            result.add("fill='");
            result.add("blue");
        } else if(this.pie.length == 1) {
            result.add("fill='");
            result.add(pie.first().first);
        } else {
            needArcs = true;
        }
        result.add("' ");
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
                var pY1:Float = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
                cs += p.second;
                var pX2:Float = Math.sin(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
                var pY2:Float = -Math.cos(cs / summe * 2 * Math.PI) * this.radius + this.xPos;
                var arcFlag:Int = (perc < 0.5) ? 0 : 1;
                result.add("<path fill='" + color + "' d='M" + this.xPos + "," + this.yPos + " L" + pX1 + "," + pY1 + " A" + this.radius + "," + this.radius + " 1 " + arcFlag + ",1 " + pX2 + ", " + pY2 + " z'/>");
            }
        }
        // result
        return result.join("");
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

}
