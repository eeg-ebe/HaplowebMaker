package draw;

import parsing.Node;

class Connection {
    public var n1:NodePos;
    public var n2:NodePos;
    public var l:List<Int>;

    public var strokeColor:String;
    public var strokeWidth:Float;
    public var dashedArray:List<Float>;

    public var drawMutsByLine:Bool;
    public var drawMutsByText:Bool;
    public var drawMutsByDots:Bool;

    public inline function new(n1:NodePos,n2:NodePos,l:List<Int>) {
        this.n1 = n1;
        this.n2 = n2;
        this.l = l;
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
        if(drawMutsByLine) {
            
        }
/*      if (drawMutsByLine || drawMutsByText || drawMutsByDots) { // TODO
        var mutations = new Array();
        for(var i = 0; i < network["nodes"][fr]["seq"].length; i++) {
          if (network["nodes"][fr]["seq"][i] != network["nodes"][to]["seq"][i]) {
            mutations.push(i + 1);
          }
        }
        var vect = new Array(x1-x2, y1-y2);
        var vectLength = Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1]);
        var eVect = new Array(vect[0] / vectLength, vect[1] / vectLength);
        var startingPosX = x2 + eVect[0] * network["nodes"][to]["drawSize"], startingPosY = y2 + eVect[1] * network["nodes"][to]["drawSize"];
        var endingPosX = x2 + vect[0] - eVect[0] * network["nodes"][fr]["drawSize"], endingPosY = y2 + vect[1] - eVect[1] * network["nodes"][fr]["drawSize"];
        vect = new Array((endingPosX-startingPosX) / (mutations.length + 1), (endingPosY-startingPosY) / (mutations.length + 1));
        for (var iii = 1; iii <= mutations.length; iii++) {
          var x = startingPosX + vect[0] * iii, y = startingPosY + vect[1] * iii;
          if (drawMutsByDots) {
            newHtml += "<circle cx='" + x + "' cy='" + y + "' r='" + $( "#spinner4" ).spinner( "value" ) + "' fill='" + document.getElementById('myColor4').value + "' />";
          }
          if (drawMutsByLine) {
            var l = $( "#spinner2" ).spinner( "value" );
            x1 = x - eVect[1] * l;
            y1 = y + eVect[0] * l;
            x2 = x + eVect[1] * l;
            y2 = y - eVect[0] * l;
            newHtml += "<line x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' stroke='" + document.getElementById('myColor3').value + "' stroke-width='" + $( "#spinner3" ).spinner( "value" ) + "' />";
          }
          if (drawMutsByText) {
            var text = mutations[iii-1];
            newHtml += "<text x='" + (x) + "' y='" + (y + textfontsize / 2) + "' fill='" + textfontcolor + "'>" + text + "</text>";
          }
        }
*/
        return result.join("");
    }
}
