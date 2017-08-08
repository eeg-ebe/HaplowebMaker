package draw;

import parsing.Node;
import util.Pair;

class Graph {
    public var nodes:List<NodePos>;
    public var cons:List<Connection>;
    public var links:List<Link>;

    public inline function new(l:List<Node>) {
        // create objects
        nodes = new List<NodePos>();
        cons = new List<Connection>();
        links = new List<Link>();
        // fill out nodes
        for(e in l) {
            nodes.add(new NodePos(e));
        }
        // fill out connections/links
        for(node1 in nodes) {
            for(node2 in nodes) {
                if(node1.node.id > node2.node.id) {
                    // check if in cons
                    for(con in node2.node.cons) {
                        if(con.first == node1.node.id) {
                            cons.add(new Connection(node1, node2, con.second));
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

    public inline function getSvgCode():String {
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
        // draw
        var result:List<String> = new List<String>();
        result.add("<svg version='1.1' baseProfile='full' width='" + width);
        result.add("' height='" + height);
        result.add("' viewBox='" + (minX - 15) + "," + (minY - 15) + "," + width + "," + height + "' xmlns='http://www.w3.org/2000/svg'>");
        for(con in cons) {
            result.add(con.getNodeSvg());
        }
        result.add("<g fill='none'>");
        for(link in links) {
            result.add(link.getLinkSvg());
        }
        result.add("</g>");
        for(node in nodes) {
            result.add(node.getNodeSvg());
        }
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
                if(eDiff > bestEDiff) {
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
            node.xPos = ((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random();
            node.yPos = ((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random();
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
                        node1.xPos = ((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random();
                        node1.yPos = ((Math.random() > 0.5) ? -1 : 1) * 1000 * Math.random();
                        needCheck = true;
                        break;
                    }
                }
            }
        }
    }

    public inline function forceDirectedMethod(setRandomInitial:Bool, damping:Float, smE:Float):Void {
        // parameters
        var kn:Float = 1.0;
        var ks:Float = 1.0;
        var kc:Float = 1.0;
        // set random initial if needed
        if(setRandomInitial) {
            assignRandomNodePos();
        } else {
            checkNoNodeAtSamePoint();
        }
        // set the initial node velocity
        for(node in nodes) {
            node.velocityX = 0;
            node.velocityY = 0;
        }
        // some main loop parameters
        var tE:Float = 0;
        var xDif:Float;
        var yDif:Float;
        var r:Float;
var step:Int = 0;
        // the main loop
        do {
step++;
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
                        r = Math.sqrt(xDif * xDif + yDif * yDif) + 0.01; // 0.01 is to prevent division by 0 at small r distances
                        node.forceX += kn * xDif / (r * r);
                        node.forceY += kn * yDif / (r * r);
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
                    node.forceX -= ks * displacement * xDif;
                    node.forceY -= ks * displacement * yDif;
                }
                // calculate the influence of the center
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
                node.xPos += node.velocityX;
                node.yPos += node.velocityY;
                var l:Float = Math.sqrt(node.velocityX * node.velocityX + node.velocityY * node.velocityY);
                tE += l * l; // all nodes have mass 1
            }
        } while(tE > smE && step < 0);
    }

// TODO:
//   - force directed method
//   - approx
//   - pca
//   - dot output and graphviz txt output parsing

    public inline function slsSearch():Void {
for(i in 0...1) sls1Step();
//        while(sls1Step()) {}
    }

    public inline function sls1Step():Bool {
        var result:Bool = false;
        var minEnergy:Float = calculateEnergy();
        for(node in nodes) {
            // save the original positions
            var xPos:Float = node.xPos;
            var yPos:Float = node.yPos;
            // change positions
            var better:Bool = true;
            while(better) {
                better = false;
                for(dx in -1...2) { // -1, 0, 1
                    for(dy in -1...2) { // -1, 0, 1
                        node.xPos = xPos + dx;
                        node.yPos = yPos + dy;
                        var newEn:Float = calculateEnergy();
                        if(newEn < minEnergy) {
                            better = true;
                            result = true;
                            minEnergy = newEn;
                            xPos = node.xPos;
                            yPos = node.yPos;
                        }
                    }
                }
            }
            // if there is no current better position for this node => restore!
            node.xPos = xPos;
            node.yPos = yPos;
        }
        return result;
    }

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
}
