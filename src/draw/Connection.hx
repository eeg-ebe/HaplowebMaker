package draw;

import parsing.Node;

class Connection {
    public var n1:NodePos;
    public var n2:NodePos;
    public var l:List<Int>;
    public var expLength:Float;

    public var strokeColor:String;
    public var strokeWidth:Float;
    public var dashedArray:List<Float>;

    public var drawMutsByLine:Bool;
    public var drawMutsLineStrokeColor:String;
    public var drawMutsLineWidth:Float;
    public var drawMutsLineLen:Float;
    public var drawMutsLineDashedArray:List<Float>;

    public var drawMutsByText:Bool;
    public var drawMutsTextFont:String;
    public var drawMutsTextSize:Float;
    public var drawMutsTextColor:String;
    public var drawMutsTextPX:Float;
    public var drawMutsTextPY:Float;

    public var drawMutsByDots:Bool;
    public var drawMutsDotsSize:Float;
    public var drawMutsDotsColor:String;
    public var drawMutsDotsDashedArray:List<Float>;

    public inline function new(n1:NodePos,n2:NodePos,l:List<Int>) {
        this.n1 = n1;
        this.n2 = n2;
        this.l = l;
        this.expLength = this.n1.radius + this.n2.radius + this.l.length * 100;
        this.strokeColor = "grey";
        this.strokeWidth = 3;
        this.dashedArray = new List<Float>();
        drawMutsByLine = false;
        drawMutsByText = false;
        drawMutsByDots = false;
        this.drawMutsLineDashedArray = new List<Float>();
        this.drawMutsDotsDashedArray = new List<Float>();
    }

    public inline function getNodeSvg():String {
        var result:List<String> = new List<String>();
        result.add("<line x1='");
        result.add(n1.xPos + "' y1='");
        result.add(n1.yPos + "' x2='");
        result.add(n2.xPos + "' y2='");
        result.add(n2.yPos + "' stroke='");
        result.add(strokeColor + "' stroke-width='");
        result.add(strokeWidth + "' ");
        if(!this.dashedArray.isEmpty()) {
            result.add("stroke-dasharray='");
            result.add(this.dashedArray.join(","));
            result.add("' ");
        }
        result.add("/>");
        if(drawMutsByLine || drawMutsByText || drawMutsByDots) {
            var vX:Float = n1.xPos - n2.xPos;
            var vY:Float = n1.yPos - n2.yPos;
            var vL:Float = Math.sqrt(vX * vX + vY * vY);
            var eVX:Float = vX / vL;
            var eVY:Float = vY / vL;
            var startX:Float = n2.xPos + eVX * n2.radius;
            var startY:Float = n2.yPos + eVY * n2.radius;
            var endX:Float = n2.xPos + vX - eVX * n1.radius;
            var endY:Float = n2.yPos + vY - eVY * n1.radius;
            vX = (endX - startX) / (this.l.length + 1);
            vY = (endY - startY) / (this.l.length + 1);
            var iii:Int = 0;
            for(text in this.l) {
                iii++;
                var x:Float = startX + vX * iii;
                var y:Float = startY + vY * iii;
                if(drawMutsByDots) {
                    result.add("<circle cx='");
                    result.add(x + "' cy='");
                    result.add(y + "' r='");
                    result.add(drawMutsDotsSize + " fill='");
                    result.add(drawMutsDotsColor);
                    if(!this.drawMutsDotsDashedArray.isEmpty()) {
                        result.add(" stroke-dasharray='");
                        result.add(this.drawMutsDotsDashedArray.join(","));
                        result.add("'");
                    }
                    result.add("/>");
                }
                if(drawMutsByLine) {
                    var x1:Float = x - eVY * drawMutsLineLen;
                    var y1:Float = y + eVX * drawMutsLineLen;
                    var x2:Float = x + eVY * drawMutsLineLen;
                    var y2:Float = y - eVX * drawMutsLineLen;
                    result.add("<line x1='");
                    result.add(x1 + "' y1='");
                    result.add(y1 + "' x2='");
                    result.add(x2 + "' y2='");
                    result.add(y2 + "' stroke='");
                    result.add(drawMutsLineStrokeColor + "' stroke-width='");
                    result.add(drawMutsLineWidth + "'");
                    if(!this.drawMutsLineDashedArray.isEmpty()) {
                        result.add(" stroke-dasharray='");
                        result.add(this.drawMutsLineDashedArray.join(","));
                        result.add("'");
                    }
                    result.add("/>");
                }
                if(drawMutsByText) {
                    result.add("<text x='");
                    result.add((x + drawMutsTextPX) + "' y='");
                    result.add((y + drawMutsTextSize / 2 + drawMutsTextPY) + "' fill='");
                    result.add(drawMutsTextColor + "' font-family='");
                    result.add(drawMutsTextFont + "' font-size='");
                    result.add(drawMutsTextSize + "'");
                    result.add(">" + text + "</text>");
                }
            }
        }
        return result.join("");
    }
}
