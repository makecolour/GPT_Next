var o = {};
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == "install") {
      if(chrome.i18n.getUILanguage()=="vi"){
        chrome.storage.sync.set({'LANG': "/_locales/vi/messages.json'"})}
        else{
        chrome.storage.sync.set({'LANG': "/_locales/en/messages.json'"})}

        chrome.storage.sync.set({'THEME': "light"})
        chrome.storage.sync.set({'TEMP': 0.8})
    } else if (details.reason == "update") {
      // This logic executes when the extension is updated
    }
  });
  