/**
 * Utility functions!
 */

function parseUrl() {
    // get the query string (without the "?")
    var query = location.search.substr(1);
    var result = {};
    query.split("&").forEach(function(part) {
        var item = part.split("=");
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
}

String.prototype.format = function(args) {
    var pattern = /\{\d+\}/g;
    var result = [];
    var p = 0;
    while (match = pattern.exec(this)) {
        // copy before
        result.push(this.substring(p, match.index));
        // add replacement
        result.push(args[parseInt(this.substring(match.index+1, pattern.lastIndex-1))]);
        // set last position
        p = pattern.lastIndex;
    }
    // add rest
    result.push(this.substr(p));
    return result.join("");
}
String.prototype.escape = function() {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return this.replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}
String.prototype.escapeZip = function() {
    var entityMap = {
        '/': '(x47)',
        '\\': '(x92)',
        "?": '(x63)',
        "%": '(x37)',
        "*": '(x42)',
        ":": '(x58)',
        '|': '(x124)',
        '<': '(x60)',
        ">": '(x62)',
        '`': '(x96)',
        '#': '(x35)',
        '&': '(x38)',
        '{': '(x123)',
        '}': '(x125)',
        '$': '(x36)',
        '!': '(x33)',
        '@': '(x64)'
    };
    return this.replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

function loadLanguage(name, uri) {
    $.getJSON("languages/" + uri, function(data) {
        languageDicts[name] = data;
    });
}
function loadLanguages() {
    $.ajaxSetup({
        async: false
    });
    languageDicts = {}; // create the global language dictionary
    $.getJSON("languages/langs.json", function(data) {
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            loadLanguage(key, value);
        });
    });
    $.ajaxSetup({
        async: true
    });
}

function setLanguage(lang) {
    // check if this is a supported language
    language = lang; // change the language
    $(".label").each(function(){
        setTxt(this, true);
    });
    $(".tooltip").each(function() {
        setTxt(this, false);
    });
    if(isEmptyDict(project)) {
        document.title = "HaplowebMaker";
    } else {
        document.title = ((typeof project["projectName"] === "undefined" || project["projectName"] == null || project["projectName"] == "") ?
            languageDicts[language]["dict"]["emptyProjectName"] : project["projectName"]) + " - HaplowebMaker";
    }
}

function setTxt(obj, lbl) {
    // set the text of an object
    // the object should be of class "label" and have lid and possible la0,..laN attributes
    var obj = $(obj);
    if((lbl && obj.hasClass('label')) || (!lbl && obj.hasClass('tooltip'))) {
        // get the lid of the object
        var lid = (lbl) ? obj.attr("lid") : obj.attr("tid");
        if (typeof lid === typeof undefined || lid === false) {
            console.log("WARNING: obj: " + obj + " is of type label/tooltip but does not contain an attribute 'lid'/'tid'!");
        } else {
            // get all la0,...,laN attributes
            var i = 0, args = [];
            while(true) {
                var arg = (lbl) ? obj.attr("la" + i) : obj.attr("ta" + i);
                if (typeof arg === typeof undefined || arg === false) {
                    break;
                }
                args.push(arg);
                i++;
            }
            var txt = "???";
            if(typeof languageDicts[language]['dict'][lid] != "undefined") {
                txt = languageDicts[language]['dict'][lid].format(args);
            } else {
                console.log("WARNING: lid: '" + lid + "' not found for language '" + language + "'!");
            }
            if(lbl) {
                obj.text(txt);
            } else {
                obj.attr("title", txt);
            }
        }
    } else {
        console.log("WARNING: obj: " + obj + " does not have class label and/or tooltip!");
    }
}

function handleEvent(eventName) {
    $(".shortcut").each(function () {
        if($(this).attr("shortcut") == eventName && !$(this).hasClass("ui-state-disabled")) {
            this.click();
            return false;
        }
    });
}

function jump(anchor) {
    var url = location.href;
    location.href = "#" + anchor;
    history.replaceState(null, null, url);
}

function download(mime, filename, filecontent) {
    var b64 = window.btoa(filecontent);
    $("body").append($("<a id='downloadLink' href-lang='" + mime + "' href='data:" + mime + ";base64,\n"+b64+"' title='" + filename + "' style='display:none' download='" + filename + "'>Download</a>"));
    document.getElementById('downloadLink').click();
    $("#downloadLink").remove();
}

function isEmptyDict(obj) {
  return Object.keys(obj).length === 0;
}

function generateNotification(ui, icon, labelid) {
    return "<div class='ui-widget'><div class='ui-state-" + ui + " ui-corner-all' style='margin-top: 5px; padding: 0 .7em;'><p style='margin: 7px'><span class='ui-icon ui-icon-" + icon + "' style='float: left; margin-right: .3em;'></span><strong id='notificationText'>" + labelid + "</strong></p></div></div>";
}

function missing(val) {
    return val == undefined || val == null;
}

function view(mime, data) {
    var b64 = window.btoa(data);
    var win = window.open();
    var base64URL = "data:" + mime + ";base64,"+b64;
    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
    win.document.close();
    /*
    var b64 = window.btoa(data);
    $("body").append($("<a target='_blank' id='viewLink' href-lang='" + mime + "' href='data:" + mime + ";base64,\n"+b64+"' title='visualization' style='display:none'>View/a>"));
    document.getElementById('viewLink').click();
    $("#viewLink").remove();
    */
}

function showVizualization(data) {
    /*
    var b64 = window.btoa(data);
    $("body").append($("<a target='_blank' id='vizualizationLink' href-lang='image/svg+xml' href='data:image/svg+xml;base64,\n"+b64+"' title='visualization' style='display:none'>Show vizualization</a>"));
    document.getElementById('vizualizationLink').click();
    $("#vizualizationLink").remove();
    */
    view('image/svg+xml', data);
}
