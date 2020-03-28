var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?facebook\.com/;
var calledByClick = false;

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
      if (calledByClick) {
          console.log("User has requested to download a media: " + request.url);
          chrome.downloads.download({
              url: request.url
          })
          calledByClick = false; //prevent accidental download
      }
      return Promise.resolve(request.url); //just a dummy response
  });


chrome.browserAction.onClicked.addListener(function (tab) {

    calledByClick = true;
    if (urlRegex.test(tab.url)) {
        chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {

            var currUrl = tabs[0].url;

            var re = new RegExp("^(https)://www", "i");
            if (re.test(currUrl)) {
                var mobileUrl = currUrl.replace("www", "m");
                chrome.tabs.create({ url: mobileUrl }, function (tab) {
                });
                //focus on original tab
                var updateProperties = { 'active': true };
                chrome.tabs.update(tab.id, updateProperties, (tab) => { });

                chrome.tabs.onUpdated.addListener(function download(tabId, changeInfo, tab) {
                    // make sure the status is 'complete' and it's the right tab
                    if (tab.url.indexOf(mobileUrl) != -1) {

                        if (changeInfo.status == 'complete') {
                            chrome.tabs.executeScript({ file: "content.js" }, function () {
                            });

                            chrome.tabs.onUpdated.removeListener(download);
                            chrome.tabs.remove(tabId, function () { });
                            chrome.tabs.remove(tabId, function () { });
                        }

                    }
                });
            } else {
                chrome.tabs.executeScript({ file: "content.js" }, function () {
                });
            }
        });

    }
});