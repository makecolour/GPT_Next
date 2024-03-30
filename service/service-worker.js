var o = {}
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      if(chrome.i18n.getUILanguage()=="vi"){
        chrome.storage.sync.set({'LANG': "/_locales/vi/messages.json'"})}
        else{
        chrome.storage.sync.set({'LANG': "/_locales/en/messages.json'"})}
    } else if (details.reason == "update") {
      // This logic executes when the extension is updated
    }
  });
  