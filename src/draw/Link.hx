package draw;

import parsing.Node;
import util.Pair;

class Link {
    public var n1:NodePos;
    public var n2:NodePos;
    public var w:Float;

    public var strokeColor:String;
    public var strokeWidth:Float;
    public var dashedArray:List<Float>;

    public var xPos:Float;
    public var yPos:Float;

    public var x1:Float;
    public var y1:Float;
    public var x2:Float;
    public var y2:Float;
    public var e1:Float;
    public var e2:Float;

    public inline function set_xPos(n:Float):Void {
        xPos = n;
    }
    public inline function set_yPos(n:Float):Void {
        yPos = n;
    }

    public inline function new(n1:NodePos,n2:NodePos,w:Float) {
        this.n1 = n1;
        this.n2 = n2;
        this.w = w;
        this.strokeColor = "blue";
        this.strokeWidth = w;
        this.dashedArray = new List<Float>();
    }

    public inline function calcCurve(a:Float, b:Float, c:Float, t:Float):Float {
        return (1-t) * ((1-t) * a + t * b) + t * ((1-t) * b + t * c);
    }
    public inline function calcCPoint(a:Float, b:Float, c:Float):Float {
        return 2 * b - (a + c) / 2;
    }

    public inline function getLinkSvg():String {
        var result:List<String> = new List<String>();
        result.add("<path d='M");
        result.add(n1.xPos + " ");
        result.add(n1.yPos + " Q");
        result.add(" " + calcCPoint(n1.xPos, xPos, n2.xPos));
        result.add(" " + calcCPoint(n1.yPos, yPos, n2.yPos));
        result.add(" " + n2.xPos);
        result.add(" " + n2.yPos);
        result.add("' stroke='");
        result.add(strokeColor);
        result.add("' stroke-width='");
        result.add(strokeWidth + "' ");
        if(!this.dashedArray.isEmpty()) {
            result.add("stroke-dasharray='");
            result.add(this.dashedArray.join(","));
            result.add("' ");
        }
        result.add("/>");
        return result.join("");
    }

    public inline function getMMX():Float {
        var tMax:Float = 0;
        var bX:Float = calcCPoint(n1.xPos, xPos, n2.xPos);
        if(2 * bX - n1.xPos - n2.xPos != 0) {
            tMax = (bX - n1.xPos) / (2 * bX - n1.xPos - n2.xPos);
        }
        tMax = (0 <= tMax && tMax <= 1) ? tMax : 0;
        return calcCurve(n1.xPos, bX, n2.xPos, tMax);
    }
    public inline function getMMY():Float {
        var tMax:Float = 0;
        var bY:Float = calcCPoint(n1.yPos, yPos, n2.yPos);
        if(2 * bY - n1.yPos - n2.yPos != 0) {
            tMax = (bY - n1.yPos) / (2 * bY - n1.yPos - n2.yPos);
        }
        tMax = (0 <= tMax && tMax <= 1) ? tMax : 0;
        return calcCurve(n1.yPos, bY, n2.yPos, tMax);
    }
}
