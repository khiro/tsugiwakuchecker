var currentwatchurl = null;
var cachewatchurl = null;
var timer = null;
var currentwindow = null;
var currenttab = null;

function xhr(comurl, callback) {
    var req = new XMLHttpRequest();
    req.onerror = function(error) {
        console.dir(error);
    }
    req.open(
        "GET",
        comurl,
        false);
    req.onload = function() {
        var div = document.createElement("div");
        div.innerHTML = req.responseText;
        var r = div.getElementsByClassName("r");
        if (r.length != 0) {
            var nextwatchurl = r[0].childNodes[0].href;
            if (nextwatchurl == undefined)
                return
            if (currentwatchurl.match('co[0-9]+')) {
                if (cachewatchurl == null) {
                    cachewatchurl = nextwatchurl;
                } 
                else if (nextwatchurl != cachewatchurl) {
                    callback(nextwatchurl);
                }
            }
            else if (nextwatchurl != currentwatchurl) {
                callback(nextwatchurl);
            }
        }
    };

    req.send(null);
}

chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "nico") {
            clearInterval(timer);
            cachewatchurl = null;
            currentwatchurl = request.watchurl;
            chrome.windows.getCurrent(function(w) {
                currentwindow = w;
                chrome.tabs.getSelected(currentwindow.id, function(t) {
                    currenttab = t;
                });
            });
            xhr(request.comurl, function() {} );
            timer = setInterval(function() {
                xhr(request.comurl, function(nextwatchurl) {
                    chrome.tabs.update(currenttab.id, {url: nextwatchurl});
                    currentwatchurl = nextwatchurl;
                });
            }, 60000);
        }
        else {
            sendResponse({});
        }
  });