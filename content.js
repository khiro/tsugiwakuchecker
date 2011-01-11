function sendRequest() {
    var shosai = document.getElementsByClassName("shosai");    
    var url = shosai[0].childNodes[4].href || shosai[0].childNodes[6].href;
    var url = url.split('?')[0];
    
    chrome.extension.sendRequest({action: 'nico', comurl: url,
                                  watchurl: location.href},
                                 function(response) {
                                      alert(response.result);
                                  });
}

sendRequest();
