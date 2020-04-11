package draw;

import parsing.Node;
import util.Pair;

class Link {
    public var n1:NodePos;
    public var n2:NodePos;
    public var w:Float;

    public var strokeColor:String;
    public var strokeColorList:List<Pair<String,Int>> = null;
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

    public var setByUser:Bool;

    public inline function set_xPos(n:Float):Void {
        xPos = n;
    }
    public inline function set_yPos(n:Float):Void {
        yPos = n;
    }

    public inline function new(n1:NodePos,n2:NodePos,w:Float) {
        this.n1 = n1;
        this.n2 = n2;
        if(NodePos.areaShouldBePropTo == NodePos.SIZE_TO_RADIUS.CONST) {
            // = 1 may not be "that" visible (after all each circle has a radius of 15)
            // and the user can inc/dec the radius ... so use = 5
            this.w = 5;
            this.strokeWidth = 5;
        } else {
            this.w = w;
            this.strokeWidth = w;
        }
        this.strokeColor = "#000";
        this.dashedArray = new List<Float>();
        this.setByUser = false;
    }

    public inline function calcCurve(a:Float, b:Float, c:Float, t:Float):Float {
        return (1-t) * ((1-t) * a + t * b) + t * ((1-t) * b + t * c);
    }
    public inline function calcCPoint(a:Float, b:Float, c:Float):Float {
        return 2 * b - (a + c) / 2;
    }

    public inline function getLinkSvg():String {
        var result:List<String> = new List<String>();
        if(strokeColorList == null || strokeColorList.isEmpty()) {
            result.add("<path d='M");
            result.add(n1.xPos + " ");
            result.add(n1.yPos + " Q");
            result.add(" " + calcCPoint(n1.xPos, xPos, n2.xPos));
            result.add(" " + calcCPoint(n1.yPos, yPos, n2.yPos));
            result.add(" " + n2.xPos);
            result.add(" " + n2.yPos);
            result.add("' stroke='");
            if(strokeColor == null) {
                trace("WRN: Use black instead of null as strokecolor");
                result.add("black");
            } else {
                result.add(strokeColor);
            }
            result.add("' stroke-width='");
            result.add(strokeWidth + "' ");
            if(!this.dashedArray.isEmpty()) {
                result.add("stroke-dasharray='");
                result.add(this.dashedArray.join(","));
                result.add("' ");
            }   
            result.add("/>");
        } else {
            var b00X:Float = -2 * (xPos - n1.xPos);
            var b00Y:Float = -2 * (yPos - n1.yPos);
            var b10X:Float = -2 * (n2.xPos - xPos);
            var b10Y:Float = -2 * (n2.yPos - yPos);
            var b05X:Float = b00X + b10X;
            var b05Y:Float = b00Y + b10Y;
            var v00X:Float = b00Y;
            var v00Y:Float = -b00X;
            var l00:Float = Math.sqrt(v00X * v00X + v00Y * v00Y);
            v00X = v00X / l00;
            v00Y = v00Y / l00;
            var v10X:Float = b10Y;
            var v10Y:Float = -b10X;
            var l10:Float = Math.sqrt(v10X * v10X + v10Y * v10Y);
            v10X = v10X / l10;
            v10Y = v10Y / l10;
            var v05X:Float = b05Y;
            var v05Y:Float = -b05X;
            var l05:Float = Math.sqrt(v05X * v05X + v05Y * v05Y);
            v05X = v05X / l05;
            v05Y = v05Y / l05;
            // thickness
            var sum:Int = 0;
            for(p in strokeColorList) {
                sum += p.second;
            }
            // draw
            var dSum:Int = 0;
            var factor:Float = (strokeWidth / sum);
            for(p in strokeColorList) {
                var c:String = p.first;
                var d:Int = p.second;
                var l:Float = ((sum - d) / 2 - dSum) * factor;
                dSum += d;
                result.add("<path d='M");
                result.add((n1.xPos + v00X * l) + " ");
                result.add((n1.yPos + v00Y * l) + " Q");
                result.add(" " + calcCPoint((n1.xPos + v00X * l), (xPos + v05X * l), (n2.xPos + v10X * l)));
                result.add(" " + calcCPoint((n1.yPos + v00Y * l), (yPos + v05Y * l), (n2.yPos + v10Y * l)));
                result.add(" " + (n2.xPos + v10X * l));
                result.add(" " + (n2.yPos + v10Y * l));
                result.add("' stroke='");
                if(c == null) {
                    trace("WRN: Use black instead of null as strokecolor");
                    result.add("black");
                } else {
                    result.add(c);
                }
                result.add("' stroke-width='");
                result.add((d * factor) + "' ");
                if(!this.dashedArray.isEmpty()) {
                    result.add("stroke-dasharray='");
                    result.add(this.dashedArray.join(","));
                    result.add("' ");
                }
                result.add("/>");
            }
        }
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
