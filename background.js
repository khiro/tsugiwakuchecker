var req = new XMLHttpRequest();
var timer = null;
var currentwatchurl = null;
var cachewatchurl = null;

function xhr(comurl, callback) {
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
        if (r) {
            var nextwatchurl = r[0].childNodes[0].href;
            if (currentwatchurl.match('co[0-9]+')) {
                if (cachewatchurl == null) {
                    cachewatchurl = nextwatchurl;
                } else if (nextwatchurl != cachewatchurl) {
                    callback(nextwatchurl);
                    currentwatchurl = nextwatchurl;
                }
            }
            else if (nextwatchurl != currentwatchurl) {
                callback(nextwatchurl);
                currentwatchurl = nextwatchurl;
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
            timer = setInterval(function() {
                xhr(request.comurl, function(nextwatchurl) {
                    chrome.windows.getCurrent(function(w) {
                        chrome.tabs.getSelected(w.id, function(t) {
                            chrome.tabs.update(t.id, {url: nextwatchurl});
                        });
                    });
                });
            }, 60000);
        }
        else {
            sendResponse({});
        }
  });