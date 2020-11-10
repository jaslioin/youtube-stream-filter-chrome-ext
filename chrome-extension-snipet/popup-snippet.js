/* eslint-disable no-undef */

/**
 * communication
 */
// send message to background js
chrome.runtime.sendMessage();
// listen to message from background js
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
	console.log("[popup] received msg from [background] ",sender);
	console.log(msg);
});

// dom on load
document.addEventListener("DOMContentLoaded", function () {
});
