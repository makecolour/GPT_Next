var o = {}
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
        chrome.storage.sync.set({'STREAM': o})
        chrome.storage.sync.set({'TIMES': 0})
    } else if (details.reason == "update") {
      // This logic executes when the extension is updated
    }
  });
  