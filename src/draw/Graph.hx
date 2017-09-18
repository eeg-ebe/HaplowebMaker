package draw;

import parsing.Node;
import util.Pair;

class Graph {
    public var nodes:List<NodePos>;
    public var cons:List<Connection>;
    public var links:List<Link>;

    public var drawCircles:Bool=true;
    public var drawCons:Bool=true;
    public var drawCurves:Bool=true;
    public var drawBezierPoints:Bool=false;
    public var drawCenter:Bool=false;
    public var drawAngles:Bool=false;

    public var lastStretchFact:Float;

    public inline function new(l:List<Node>) {
        // assign default drawing
        drawCircles=true;
        drawCons=true;
        drawCurves=true; 
        drawBezierPoints=false;
        drawCenter=false;
        drawAngles=false;
        // create objects
        nodes = new List<NodePos>();
        cons = new List<Connection>();
        links = new List<Link>();
        // fill out nodes
        for(e in l) {
            nodes.add(new NodePos(e));
        }
        // fill out connections/links
        var nextConId:Int = 0;
        for(node1 in nodes) {
            for(node2 in nodes) {
                if(node1.node.id > node2.node.id) {
                    // check if in cons
                    for(con in node2.node.cons) {
                        if(con.first == node1.node.id) {
                            cons.add(new Connection(nextConId++, node1, node2, con.second));
                            break;
                        }
                    }
                    // check if in links
                    for(con in node2.node.links) {
                        if(con.first == node1.node.id) {
                            links.add(new Link(node1, node2, con.second));
                            break;
                        }
                    }
                }
            }
        }
    }

    public inline function assignMutsLines(drawMutsByLine:Bool, drawMutsLineStrokeColor:String, drawMutsLineWidth:Float, drawMutsLineLen:Float, drawMutsLineDashedArray:Array<Float>):Void {
        var drawMutsLineDashedArray_:List<Float> = new List<Float>();
        for(e in drawMutsLineDashedArray) {
            drawMutsLineDashedArray_.add(e);
        }
        for(con in cons) {
            con.drawMutsByLine = drawMutsByLine;
            con.drawMutsLineStrokeColor = drawMutsLineStrokeColor;
            con.drawMutsLineWidth = drawMutsLineWidth;
            con.drawMutsLineLen = drawMutsLineLen;
            con.drawMutsLineDashedArray = drawMutsLineDashedArray_;
        }
    }
    public inline function assignMutsText(drawMutsByText:Bool, drawMutsTextFont:String, drawMutsTextSize:Float, drawMutsTextColor:String, drawMutsTextPX:Float, drawMutsTextPY:Float) {
        for(con in cons) {
            con.drawMutsByText = drawMutsByText;
            con.drawMutsTextFont = drawMutsTextFont;
            con.drawMutsTextSize = drawMutsTextSize;
            con.drawMutsTextColor = drawMutsTextColor;
            con.drawMutsTextPX = drawMutsTextPX;
            con.drawMutsTextPY = drawMutsTextPY;
        }
    }
    public inline function assignButsByDots(drawMutsByDots:Bool, drawMutsDotsSize:Float, drawMutsDotsColor:String, drawMutsDotsDashedArray:Array<Float>) {
        var drawMutsDotsDashedArray_:List<Float> = new List<Float>();
        for(e in drawMutsDotsDashedArray) {
            drawMutsDotsDashedArray_.add(e);
        }
        for(con in cons) {
            con.drawMutsByDots = drawMutsByDots;
            con.drawMutsDotsSize = drawMutsDotsSize;
            con.drawMutsDotsColor = drawMutsDotsColor;
            con.drawMutsDotsDashedArray = drawMutsDotsDashedArray_;
        }
    }

    public inline function getNearestO(x:Float, y:Float):Dynamic {
        // calculate view box
        var maxX:Float = Math.NEGATIVE_INFINITY;
        var maxY:Float = Math.NEGATIVE_INFINITY;
        var minX:Float = Math.POSITIVE_INFINITY;
        var minY:Float = Math.POSITIVE_INFINITY;
        for(node in nodes) {
            maxX = Math.max(maxX, node.maxX());
            maxY = Math.max(maxY, node.maxY());
            minX = Math.min(minX, node.minX());
            minY = Math.min(minY, node.minY());
        }
        for(link in links) {
            var x:Float = link.getMMX(); var y:Float = link.getMMY();
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        }
        // now transform
        x = x + minX - 15;
        y = y + minY - 15;
        // search
        var result:Dynamic = null;
        var best:Float = Math.POSITIVE_INFINITY;
        var d:Float = 0;
        if(drawCircles) {
            for(o in nodes) {
                d = dist(x, y, o.xPos, o.yPos);
                if(d < best) {
                    best = d;
                    result = o;
                }
            }
        }
        if(drawBezierPoints) {
            for(o in links) {
                d = dist(x, y, o.xPos, o.yPos);
                if(d < best) {
                    best = d;
                    result = o;
                }
            }
        }
        return result;
    }

    private inline function pieToTxt(pie:List<Pair<String,Int>>):String {
        var result:List<String> = new List<String>();
        for(p in pie) {
            result.add(p.first + "\x01" + p.second);
        }
        return result.join("\x03");
    }
    public inline function saveStyle():String {
        var result:List<String> = new List<String>();
        // defaults
        var n:List<String> = new List<String>();
        n.add((drawCircles) ? "1" : "0");
        n.add((drawCons) ? "1" : "0");
        n.add((drawCurves) ? "1" : "0");
        n.add((drawBezierPoints) ? "1" : "0");
        n.add((drawCenter) ? "1" : "0");
        n.add((drawAngles) ? "1" : "0");
        result.add(n.join("\x02"));
        // all nodes
        for(node in nodes) {
            var n:List<String> = new List<String>();
            // save node attributes
            n.add("" + node.xPos);
            n.add("" + node.yPos);
            n.add("" + node.radius);
            n.add(pieToTxt(node.pie));
            n.add(node.strokeColor);
            n.add("" + node.strokeWidth);
            n.add(node.dashedArray.join("|"));
            // now add to list
            result.add(n.join("\x02"));
        }
        // all connections
        for(con in cons) {
            var n:List<String> = new List<String>();
            // save connections attributes
            n.add(con.strokeColor);
            n.add("" + con.strokeWidth);
            n.add(con.dashedArray.join("|"));
            n.add((con.drawMutsByLine) ? "1" : "0");
            n.add(con.drawMutsLineStrokeColor);
            n.add("" + con.drawMutsLineWidth);
            n.add("" + con.drawMutsLineLen);
            n.add("" + con.drawMutsLineDashedArray.join("|"));
            n.add((con.drawMutsByText) ? "1" : "0");
            n.add(con.drawMutsTextFont);
            n.add("" + con.drawMutsTextSize);
            n.add(con.drawMutsTextColor);
            n.add("" + con.drawMutsTextPX);
            n.add("" + con.drawMutsTextPY);
            n.add((con.drawMutsByDots) ? "1" : "0");
            n.add("" + con.drawMutsDotsSize);
            n.add(con.drawMutsDotsColor);
            n.add(con.drawMutsDotsDashedArray.join("|"));
            // now add to list
            result.add(n.join("\x02"));
        }
        // all links
        for(link in links) {
            var n:List<String> = new List<String>();
            // save link attributes
            n.add("" + link.w);
            n.add(link.strokeColor);
            n.add("" + link.strokeWidth);
            n.add(link.dashedArray.join("|"));
            n.add("" + link.xPos);
            n.add("" + link.yPos);
            // now add to list
            result.add(n.join("\x02"));
        }
        return result.join("\n");
    }
    public inline function parsePie(s:String):List<Pair<String,Int>> {
        var result:List<Pair<String,Int>> = new List<Pair<String,Int>>();
        for(p in s.split("\x03")) {
            var d:Array<String> = p.split("\x01");
            result.add(new Pair<String,Int>(d[0], Std.parseInt(d[1])));
        }
        return result;
    }
    public inline function loadStyle(style:String):Void {
        var lines:List<String> = new List<String>();
        for(line in style.split("\n")) {
            lines.add(line);
        }
        // restore drawings
        var attrs:Array<String> = lines.pop().split("\x02");
        drawCircles = (attrs[0] == "1");
        drawCons = (attrs[1] == "1");
        drawCurves = (attrs[2] == "1");
        drawBezierPoints = (attrs[3] == "1");
        drawCenter = (attrs[4] == "1");
        drawAngles = (attrs[5] == "1");
        // restore node style
        for(node in nodes) {
            var attrs:Array<String> = lines.pop().split("\x02");
            node.set_xPos(Std.parseFloat(attrs[0]));
            node.set_yPos(Std.parseFloat(attrs[1]));
            node.set_radius(Std.parseFloat(attrs[2]));
            node.set_pie(parsePie(attrs[3]));
            node.set_strokeColor(attrs[4]);
            node.set_strokeWidth(Std.parseFloat(attrs[5]));
            var l:List<Float> = new List<Float>();
            for(f in attrs[6].split("|")) {
                l.add(Std.parseFloat(f));
            }
            node.set_dashedArray(l);
        }
        // restore connections
        for(con in cons) {
            var attrs:Array<String> = lines.pop().split("\x02");
            con.strokeColor = attrs[0];
            con.strokeWidth = Std.parseFloat(attrs[1]);
            con.dashedArray = new List<Float>();
            for(f in attrs[2].split("|")) {
                con.dashedArray.add(Std.parseFloat(f));
            }
            con.drawMutsByLine = (attrs[3] == "1");
            con.drawMutsLineStrokeColor = attrs[4];
            con.drawMutsLineWidth = Std.parseFloat(attrs[5]);
            con.drawMutsLineLen = Std.parseFloat(attrs[6]);
            con.drawMutsLineDashedArray = new List<Float>();
            for(f in attrs[7].split("|")) {
                con.drawMutsLineDashedArray.add(Std.parseFloat(f));
            }
            con.drawMutsByText = (attrs[8] == "1");
            con.drawMutsTextFont = attrs[9];
            con.drawMutsTextSize = Std.parseFloat(attrs[10]);
            con.drawMutsTextColor = attrs[11];
            con.drawMutsTextPX = Std.parseFloat(attrs[12]);
            con.drawMutsTextPY = Std.parseFloat(attrs[13]);
            con.drawMutsByDots = (attrs[14] == "1");
            con.drawMutsDotsSize = Std.parseFloat(attrs[15]);
            con.drawMutsDotsColor = attrs[16];
            con.drawMutsDotsDashedArray = new List<Float>();
            for(f in attrs[17].split("|")) {
                con.drawMutsDotsDashedArray.add(Std.parseFloat(f));
            }
        }
        // restore links
        for(link in links) {
            var attrs:Array<String> = lines.pop().split("\x02");
            link.w = Std.parseFloat(attrs[0]);
            link.strokeColor = attrs[1];
            link.strokeWidth = Std.parseFloat(attrs[2]);
            link.dashedArray = new List<Float>();
            for(f in attrs[3].split("|")) {
                link.dashedArray.add(Std.parseFloat(f));
            }
            link.xPos = Std.parseFloat(attrs[4]);
            link.yPos = Std.parseFloat(attrs[5]);
        }
    }

    public inline function getSvgCode(?ow:Float=-1, ?oh:Float=-1) {
        // calculate view box
        var maxX:Float = Math.NEGATIVE_INFINITY;
        var maxY:Float = Math.NEGATIVE_INFINITY;
        var minX:Float = Math.POSITIVE_INFINITY;
        var minY:Float = Math.POSITIVE_INFINITY;
        for(node in nodes) {
            maxX = Math.max(maxX, node.maxX());
            maxY = Math.max(maxY, node.maxY());
            minX = Math.min(minX, node.minX());
            minY = Math.min(minY, node.minY());
        }
        for(link in links) {
            var x:Float = link.getMMX(); var y:Float = link.getMMY();
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
        }
        var width:Float = maxX - minX + 30;
        var height:Float = maxY - minY + 30;
        // w/h
        var f1:Float = ow / width;
        if(ow == -1) {
            f1 = 1;
        }
        var f2:Float = oh / height;
        if(oh == -1) {
            f2 = 1;
        }
        lastStretchFact = Math.min(f1, f2);
        ow = width * lastStretchFact;
        oh = height * lastStretchFact;
        // draw
        var result:List<String> = new List<String>();
        result.add("<svg version='1.1' baseProfile='full' width='" + ow);
        result.add("' height='" + oh);
        result.add("' viewBox='" + (minX - 15) + "," + (minY - 15) + "," + width + "," + height + "' xmlns='http://www.w3.org/2000/svg'>");
        if(drawCons) {
            for(con in cons) {
                result.add(con.getNodeSvg());
            }
        }
        if(drawCurves) {
            result.add("<g fill='none'>");
            for(link in links) {
                result.add(link.getLinkSvg());
            }
            result.add("</g>");
        }
        if(drawCircles) {
            for(node in nodes) {
                result.add(node.getNodeSvg());
            }
        }
        if(drawAngles) {
            for(c1 in cons) {
                for(c2 in cons) {
                    if(c1.id > c2.id) {
                        // get the node
                        var nA:NodePos = null;
                        var nB:NodePos = null;
                        var nC:NodePos = null;
                        if(c1.n1 == c2.n1) {
                            nA = c1.n2;
                            nB = c2.n2;
                            nC = c1.n1;
                        } else if(c1.n1 == c2.n2) { 
                            nA = c1.n2;
                            nB = c2.n1;
                            nC = c1.n1;
                        } else if(c1.n2 == c2.n1) {
                            nA = c1.n1;
                            nB = c2.n2;
                            nC = c1.n2;
                        } else if(c1.n2 == c2.n2) {
                            nA = c1.n1;
                            nB = c2.n1;
                            nC = c1.n2;
                        }
                        // is there a nodepos?
                        if(nC != null) {
                            var v1X:Float = nA.xPos - nC.xPos;
                            var v1Y:Float = nA.yPos - nC.yPos;
                            var v2X:Float = nB.xPos - nC.xPos;
                            var v2Y:Float = nB.yPos - nC.yPos;
                            var l1:Float = Math.sqrt(v1X * v1X + v1Y * v1Y);
                            var l2:Float = Math.sqrt(v2X * v2X + v2Y * v2Y);
                            var c:Float = v1X * v2X + v1Y * v2Y;
                            var wXV:Float = (v1X / l1) + (v2X / l2);
                            var wYV:Float = (v1Y / l1) + (v2Y / l2);
                            var wL:Float = Math.sqrt(wXV * wXV + wYV * wYV);
                            var xx:Float = nC.xPos + (wXV / wL) * (nC.radius + 20);
                            var yy:Float = nC.yPos + (wYV / wL) * (nC.radius + 20);
                            var txt:String = ("" + (Math.acos(c / (l1 * l2)) * 360 / (2 * Math.PI))).substr(0, 6);
                            result.add("<text x='" + xx + "' y='" + yy + "' text-anchor='middle'>" + txt + "</text>");
                        }
                    }
                }
            }
        }
        if(drawBezierPoints) {
            for(link in links) {
                result.add("<circle cx='" + link.xPos + "' cy='" + link.yPos + "' r='5' fill='" + link.strokeColor + "' />");
            }
        }
        if(drawCenter) {
            var x:Float = calcCenterX();
            var y:Float = calcCenterY();
            result.add("<line x1='" + x + "' y1='" + minY + "' x2='" + x + "' y2='" + maxY + "' stroke='green' stroke-dasharray='3 3' />");
            result.add("<line x1='" + minX + "' y1='" + y + "' x2='" + maxX + "' y2='" + y + "' stroke='green' stroke-dasharray='3 3' />");
            result.add("<circle cx='" + calcCenterX() + "' cy='" + calcCenterY() + "' r='5' fill='green' />");
        }
//result.add("<text x='" + minX + "' y='" + minY + "'>" + calculateEnergy() + "</text>");
        result.add("</svg>");
        return result.join("");
    }

    public static inline function dist(x1:Float,y1:Float,x2:Float,y2:Float):Float {
        var dX:Float = x1 - x2;
        var dY:Float = y1 - y2;
        return Math.sqrt(dX*dX + dY*dY);
    }

    public inline function assignLinkPos():Void {
        // create a list with all the links that we need to assign
        var l:List<Link> = new List<Link>();
        for(link in links) {
            // remove maybe present older position data
            link.xPos = Math.NaN;
            link.yPos = Math.NaN;
            // calculate the two positions
            var vX:Float = link.n1.xPos - link.n2.xPos;
            var vY:Float = link.n1.yPos - link.n2.yPos;
            var vrX:Float = -vY / 8;
            var vrY:Float = vX / 8;
            var mX:Float = link.n2.xPos + vX / 2;
            var mY:Float = link.n2.yPos + vY / 2;
            link.x1 = mX - vrX;
            link.y1 = mY - vrY;
            link.x2 = mX + vrX;
            link.y2 = mY + vrY;
            // calculate the "energy" of the two positions
            link.e1 = 0;
            link.e2 = 0;
            for(node in nodes) {
                link.e1 += 1 / dist(node.xPos, node.yPos, link.x1, link.y1);
                link.e2 += 1 / dist(node.xPos, node.yPos, link.x2, link.y2);
            }
            // save
            l.add(link);
        }
        // assign positions
        while(!l.isEmpty()) {
            // get the best energy difference
            var bestEDiff:Float = -1.0;
            var bestLink:Link = null;
            for(link in l) {
                // calculate energy difference
                var eDiff:Float = Math.abs(link.e1 - link.e2);
                if(eDiff > bestEDiff || bestEDiff == -1) {
                    bestEDiff = eDiff;
                    bestLink = link;
                }
            }
            // assign best position
            bestLink.xPos = (bestLink.e1 < bestLink.e2) ? bestLink.x1 : bestLink.x2;
            bestLink.yPos = (bestLink.e1 < bestLink.e2) ? bestLink.y1 : bestLink.y2;
            // ok, create next list
            l.remove(bestLink);
        }
    }

    public inline function assignRandomNodePos():Void {
        for(node in nodes) {
            node.set_xPos(((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random());
            node.set_yPos(((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random());
        }
        checkNoNodeAtSamePoint();
    }

    public inline function checkNoNodeAtSamePoint():Void {
        for(node1 in nodes) {
            var needCheck:Bool = true;
            while(needCheck) {
                needCheck = false;
                for(node2 in nodes) {
                    if(node1.node.id > node2.node.id && node1.xPos == node2.xPos && node2.yPos == node2.yPos) {
                        node1.set_xPos(((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random());
                        node1.set_yPos(((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random());
                        needCheck = true;
                        break;
                    }
                }
            }
        }
    }

    public inline function calcCenterX():Float {
        var rx:Float = 0;
        for(node in nodes) {
            rx += node.xPos;
        }
        return rx / nodes.length;
    }
    public inline function calcCenterY():Float {
        var ry:Float = 0;
        for(node in nodes) {
            ry += node.yPos;
        }
        return ry / nodes.length;
    }
    public inline function centerPos():Void {
        var cx:Float = calcCenterX();
        var cy:Float = calcCenterY();
        for(node in nodes) {
            node.set_xPos(node.xPos - cx);
            node.set_yPos(node.yPos - cy);
        }
    }
    public inline function stretch(fact:Float):Void {
        centerPos();
        var cx:Float = calcCenterX();
        var cy:Float = calcCenterY();
        for(node in nodes) {
            // vect v from center to point
            var vX:Float = node.xPos - cx;
            var vY:Float = node.yPos - cy;
            // stretch vector by fact
            vX *= fact;
            vY *= fact;
            // assign new pos
            node.set_xPos(cx + vX);
            node.set_yPos(cy + vY);
        }
    }
    public inline function rotate(angle:Float):Void {
        centerPos();
        var cx:Float = calcCenterX();
        var cy:Float = calcCenterY();
        for(node in nodes) {
            // vect v from center to point
            var vX:Float = node.xPos - cx;
            var vY:Float = node.yPos - cy;
            // stretch vector by fact
            vX = vX * Math.cos(angle) - vY * Math.sin(angle);
            vY = vX * Math.sin(angle) + vY * Math.cos(angle);
            // assign new pos
            node.set_xPos(cx + vX);
            node.set_yPos(cy + vY);
        }
        for(link in links) {
            // vect v from center to point
            var vX:Float = link.xPos - cx;
            var vY:Float = link.yPos - cy;
            // stretch vector by fact
            vX = vX * Math.cos(angle) - vY * Math.sin(angle);
            vY = vX * Math.sin(angle) + vY * Math.cos(angle);
            // assign new pos
            link.set_xPos(cx + vX);
            link.set_yPos(cy + vY);
        }
        centerPos();
    }

    public inline function fluct():Float {
        return 10 * Math.random() * ((Math.random() > 0.5) ? 1 : -1);
    }

    public inline function forceDirectedMethod(setRandomInitial:Bool, damping:Float, smE:Float, ?kn:Float=1.0, ?ks:Float=0.2, ?kc:Float=5.0, ?steps:Int=1000, ?remVelocity:Bool=true):Float {
        // set random initial if needed
        if(setRandomInitial) {
            assignRandomNodePos();
        } else {
            checkNoNodeAtSamePoint();
        }
        // set the initial node velocity
        if(remVelocity) {
            for(node in nodes) {
                node.velocityX = 0;
                node.velocityY = 0;
            }
        }
        // some main loop parameters
        var tE:Float = 0;
        var xDif:Float;
        var yDif:Float;
        var r:Float;
        var stepCount:Int = 0;
        var stopCritSteps:Bool;
        // the main loop
        do {
            stepCount++;
            stopCritSteps = false;
            tE = 0;
            for(node in nodes) {
                // reset old force value
                node.forceX = 0;
                node.forceY = 0;
                // calculate the effect of the coulomb repulsion on the node
                for(oNode in nodes) {
                    if(node != oNode) {
                        //F=k_e*q_1*q_2/r**2
                        xDif = node.xPos - oNode.xPos;
                        yDif = node.yPos - oNode.yPos;
                        r = Math.sqrt(xDif * xDif + yDif * yDif);
                        if(r > 1) { // prevent division by 0 at small r distances
                            node.forceX += kn * xDif / (r * r);
                            node.forceY += kn * yDif / (r * r);
                        } else {
                            r += 0.1; // prevent division by 0
                            node.forceX += kn * (xDif + fluct()) / (r * r); // at that distance xDif, yDif is not reliable
                            node.forceY += kn * (yDif + fluct()) / (r * r); // better add some fluctuations
                        }
                    }
                }
                // calculate the effect of the spring attraction on the node
                for(con in cons) {
                    //F=k*X (k=constant; here 1, X=displacement)
                    if(con.n1 == node) {
                        xDif = con.n2.xPos - con.n1.xPos;
                        yDif = con.n2.yPos - con.n1.yPos;
                    } else if(con.n2 == node) {
                        xDif = con.n1.xPos - con.n2.xPos;
                        yDif = con.n1.yPos - con.n2.yPos;
                    } else {
                        continue;
                    } // now xDif, yDif represent a vector to brings node towards it's connected node
                    r = Math.sqrt(xDif * xDif + yDif * yDif);   // length of the vector (or how much the two nodes are away from each other)
                    var displacement:Float = r - con.expLength; // ok, the displacement (positive if node should get moved towards other node else negative)
                    // ok, calculate the vector towards spring the normalised point
                    xDif = xDif / r; // normalization
                    yDif = yDif / r;
                    node.forceX += ks * displacement * xDif;
                    node.forceY += ks * displacement * yDif;
                }
                // calculate the influence of the center
                // the center is defined by the position of all nodes "belonging" to the same FFR
                // like this all nodes belonging to the same FFR tend to be in the same position
                // TODO (test if this approach increase plotting quality)
/*
                var centerX:Float = 0;
                var centerY:Float = 0;
                var nodeCounter:Float = 0;
                for
*/
            }
            // apply the force
            for(node in nodes) {
                node.velocityX = (node.velocityX + node.forceX) * damping;
                node.velocityY = (node.velocityY + node.forceY) * damping;
                node.set_xPos(node.xPos + node.velocityX);
                node.set_yPos(node.yPos + node.velocityY);
                var l:Float = Math.sqrt(node.velocityX * node.velocityX + node.velocityY * node.velocityY);
                tE += l * l; // all nodes have mass 1
            }
            if(stepCount > steps && steps > -1) {
                stopCritSteps = true;
            }
        } while(tE > smE && !stopCritSteps);
        return tE;
    }

// TODO:
//   - pca
//   - dot output and graphviz txt output parsing
    public inline function calculateEnergy():Float {
        var result:Float = 0;
        // energy of nodes
        for(node1 in nodes) {
            for(node2 in nodes) {
                if(node1.node.id > node2.node.id) {
                    result += 1.0 / dist(node1.xPos, node1.yPos, node2.xPos, node2.yPos);
                }
            }
        }
        // energy of connections
        for(con in cons) {
            var expDist:Float = con.expLength;
            var rDist:Float = dist(con.n1.xPos, con.n1.yPos, con.n2.xPos, con.n2.yPos);
            var diff:Float = expDist - rDist;
            result += diff * diff;
        }
        return result;
    }

public static inline function main():Void {}
}
