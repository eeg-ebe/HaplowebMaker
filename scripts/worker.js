self.importScripts("FastaParsing.js", "MJAlgo.js", "Drawing.js", "coma.js", "LstExtractor.js", "filterSingl.js");

Printer = function () {
    this.indent = "  ";
    this.newline = "\n";
    this.countingOffset = 1;
    this.l = [];
    this.printString = function (s) {
        this.l.push(s);
    };
    this.close = function () {};
    this.toText = function () {
        return this.l.join("");
    }
}

function setProgress(stepsDone, stepsToDo) {
    var progress = Math.floor(stepsDone / stepsToDo * 100);
    progress = Math.min(99, progress);
    self.postMessage([
        {
            "key" : ["progress"],
            "val" : progress
        }
    ]);
}
function setFileVal(i, key, val) {
    self.postMessage([
        {
            "key" : ["faFiles", i, key],
            "val" : val
        }
    ]);
}
function replace(s, i, c) {
    return s.substring(0, i) + c + s.substring(i+1);
}
function calculateFaFile(project, i) {
    try {
        // ok, set that we are processing this file
        setFileVal(i, "start", Date.now());
        setFileVal(i, "status", "running.label");
        // read the file content to a fasta file
        var fc = parsing_FastaParser.parseFasta(project["faFiles"][i]["data"]);
        setProgress(++stepsDone, stepsToDO);
        setFileVal(i, "endParsing", Date.now());
        // end parsing - now run mj algo
        if(typeof project["delimiter"] !== "undefined") {
            mj_Seq.delimiter = project["delimiter"];
        }
        var m = new mj_MJAlgo();
        // check sequence
        var toRem = []
        var current = fc.h;
        while(current != null && current != undefined) {
            var seqName = current.item.first, seq = current.item.second;
            for(var chIndex = 0; chIndex < seq.length; chIndex++) { // XXX: for loop should change place with while loop (or even better whole thing should get implemented in HaXe)
                var c = seq.charAt(chIndex).toUpperCase();
                if(!(c == 'A' || c == 'T' || c == 'G' || c == 'C' || c == '-')) {
                    if(project["ambigStrat"] == "error") {
                        if (c == 'R' || c == 'Y' || c == 'K' || c == 'M' || c == 'S' || c == 'W' || c == 'B' || c == 'D' || c == 'H' || c == 'V' || c == 'N' || c == '?') {
                            throw new js__$Boot_HaxeError("Your input FASTA file contains one or several ambiguities (" + c + "). Please make sure that all your sequences are properly phased and do not contain any ambiguities before running HaplowebMaker. (Or enable an option for treating ambiguities ...)");
                        }
                        throw new js__$Boot_HaxeError("Your input FASTA file contains one or several unauthorized characters (" + c + ")!");
                    } else {
                        toRem.push(chIndex);
                    }
                }
                if(c == '-' && !!project["replaceIndelPositions"] && project["ambigStrat"] == "error") {
                    throw new js__$Boot_HaxeError("Your input FASTA file contains indels that are treated as ambigious character, thereby triggering this error message. Please check the Advanced Settings for other options.");
                }
                if(c == '-' && !!project["replaceIndelPositions"]) {
                    toRem.push(chIndex);
                }
            }
            current = current.next;
        }
        for (var ixy = 0; ixy < toRem.length; ixy++) {
            var ppii = toRem[ixy];
            var current = fc.h;
            while(current != null && current != undefined) {
                var seqName = current.item.first, seq = current.item.second;
                seq = replace(seq, ppii, "#");
//                seq = seq.substring(0, ppii) + "#" + seq.substring(ppii + 1);
                current.item.second = seq;
                current = current.next;
            }
        }
        // filter for singletons if needed
        if(!!project["removeSingletons"]) {
            fc = FilterSingletons.filterSingletons(fc);
        }
        // warning?
        var result = FilterSingletons.checkMaybeMissing(fc, project["delimiter"]);
        if (result) {
            project["notifications"].push({ "ui" : "highlight", "icon" : "info", "text" : project["faFiles"][i]["filename"] + ": file contains only one sequence given for the following individual(s): " + result });
            self.postMessage([{ "key" : ["notifications"], "val" : project["notifications"] }]);
        }
        // change frequency?
        if(project["frequency"] == "assumeAtLeastDiploid") {
            fc = FilterSingletons.assumeAtLeastDiploid(fc, project["delimiter"]);
        } else if(project["frequency"] == "numberOfIndividuals") {
            fc = FilterSingletons.removeDuplicates(fc, project["delimiter"]);
        }
        // add sequences
        var current = fc.h;
        while(current != null && current != undefined) {
            var seqName = current.item.first, seq = current.item.second;
            // check whether to add warning
            if(seq.charAt(0) == "-" || seq.charAt(seq.length - 1) == "-") {
                if(!self.addedIndelIs5thStateWarning) {
                    project["notifications"].push({ "ui" : "highlight", "icon" : "info", "text" : "indelIs5State.text" });
                    self.postMessage([{ "key" : ["notifications"], "val" : project["notifications"] }]);
                }
                self.addedIndelIs5thStateWarning = true;
            }
            // go on
            if(project["upperLowerCaseN"] && project["upperLowerCaseS"]) {
                m.addSequence(seqName.toUpperCase(), seq.toUpperCase());
            } else if(project["upperLowerCaseN"]) {
                m.addSequence(seqName.toUpperCase(), seq);
            } else if(project["upperLowerCaseS"]) {
                m.addSequence(seqName, seq.toUpperCase());
            } else {
                m.addSequence(seqName, seq);
            }
            current = current.next;
        }
        m.finishedAddingSequences();
        if(!project["onlyComa"]) {
            m.runMJ(project["epsilon"], !!project["onlyMinimumSpanningNetwork"]);
        }
        var p = new Printer();
        m.finalizeNetwork().printTxt(p);
        var netTxt = p.toText();
        project["faFiles"][i]["mj"] = p.toText();
        setFileVal(i, "mj", project["faFiles"][i]["mj"]);
        setFileVal(i, "nrSeqs", m.getNrSeqs());
        setFileVal(i, "nrDifSeqs", m.getNrDifSeqs());
        setFileVal(i, "seqLen", m.getSeqLength());
        setFileVal(i, "intPos", m.getNrInterestingPositions());
        setFileVal(i, "ffrs", m.getNrFFRs());
        setFileVal(i, "inds", m.countIndiv());
        setFileVal(i, "hinds", m.countHeterozygousIndiv());
        setProgress(++stepsDone, stepsToDO);
        setFileVal(i, "endMJ", Date.now());
        // end of mj - now draw
        if(typeof project["areaShouldBePropToNrInd"] !== "undefined") {
            draw_NodePos.set_areaShouldBePropTo(project["areaShouldBePropToNrInd"]);
        }
        if(!project["onlyComa"]) {
            var g = new draw_Graph(parsing_MJNetParser.parseNet(netTxt));
            g.forceDirectedMethod(true, 0.6, 0.5, 500.0, 0.1, 0.1, 10000);
            g.centerPos();
//            g.stretch(0.1);
            g.assignLinkPos();
            // assign pie charts if needed
            if(typeof project["pieChart"] !== "undefined") {
                var txt = g.assingPiesByTxt(project["pieChart"], project["upperLowerCaseN"], project["pieByIndNameOnly"]);
                g.initStrokeColorListByStr(project['pieChart'], project["upperLowerCaseN"]);
                if (txt != "") {
                    self.postMessage([
                        {
                            "key" : "warning",
                            "val" : "Missing colors for individual(s) " + txt
                        }
                    ]);
                }
                // TODO handle txt
            } else if(typeof project["assignRandomColoresToFFRs"] !== "undefined" && !!project["assignRandomColoresToFFRs"]) {
                g.colorNetwork();
            }
            // multicolor?
            /*
            if(typeof project["multiColorLinks"] !== "undefined" && project["multiColorLinks"] && typeof project["pieChart"] !== "undefined") {
                g.initStrokeColorListByStr(project["pieChart"], project["upperLowerCaseN"]);
            }
            */
            // resize nodes / lines / curves if needed
            g.normalizeGraph();
            // return result
            setFileVal(i, "graphstyle", g.saveStyle());
            setFileVal(i, "svg", g.getSvgCode());
        }
        setFileVal(i, "endDraw", Date.now());
        // end of drawing - end of this file
        setFileVal(i, "status", "okstatus.label");
    } catch(e) {
console.log("XXX " + e);
        setFileVal(i, "status", "failed.label");
        setFileVal(i, "statusDescription", e.message);
        stepsDone = (i+1) * 3;
        setProgress(stepsDone, stepsToDO);
    }
}

self.addEventListener('message', function(e) {
    var project = e.data;
    self.addedIndelIs5thStateWarning = false;
    // for processbar
    stepsToDO = project["faFiles"].length * 3 + 1; // for each file - parsing, create haploweb, assing svg drawing positions & run coma
    stepsDone = 0;
    // do every file
    for(var i = 0; i < project["faFiles"].length; i++) {
        calculateFaFile(project, i);
    }
    // do coma
//    try {
        var a = new Array(project["faFiles"]);
        var fileNames = new Array(project["faFiles"]);
        for(var i = 0; i < project["faFiles"].length; i++) {
            var p = new Printer();
            LstExtractor.extract(p, project["faFiles"][i]["mj"], true, false, false, false, project["delimiter"]);
            a[i] = p.toText();
            fileNames[i] = project["faFiles"][i]["filename"];
        }
        var p = new Printer();
        var p2 = new Printer();
        var p3 = new Printer();
        CoMa.runComaJS(a, p, p2, p3, fileNames, 0);
        var comaTxt = p.toText();
        var comaLstTxt = p2.toText();
        var partitionsLstTxt = p3.toText();
        self.postMessage([
            {
                "key" : ["coma"],
                "val" : comaTxt
            }
        ]);
        self.postMessage([
            {
                "key" : ["comaLst"],
                "val" : comaLstTxt
            }
        ]);
        self.postMessage([
            {
                "key" : ["partitionsLst"],
                "val" : partitionsLstTxt
            }
        ]);
/*
    } catch(e) {
console.log("XXX " + e);
    }
*/
    // safe end time
    self.postMessage([{ "key" : ["calculationEndDate"], "val" : Date.now() }]);
    self.postMessage([
        {
            "key" : ["progress"],
            "val" : 100
        }
    ]);
}, false);
