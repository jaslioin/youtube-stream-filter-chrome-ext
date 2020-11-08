/**
 * communication
 */
// send message to background js
chrome.runtime.sendMessage();
// listen to message from background
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    
});

