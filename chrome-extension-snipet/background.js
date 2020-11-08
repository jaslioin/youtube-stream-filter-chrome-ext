/**
 * notification api
 * "notifications"
 */

chrome.notifications.onButtonClicked.addListener(function () {});
chrome.notifications.create({
	type: "basic",
	iconUrl: "icon.png",
	title: "Time to Hydrate",
	message: "Everyday I'm Guzzlin'!",
	buttons: [{ title: "OK" }],
	priority: 0,
});

/**
 * browser action api
 */
chrome.browserAction.setBadgeText({ text: "ON" });
chrome.browserAction.onClicked.addListener(function(){});//only work when no popup enabled

/**
 * Alarm api
 * "alarms"
 */

chrome.alarms.create("notify_date", {
	when: Date.now() + 60000,
});
chrome.alarms.onAlarm.addListener(function () {});

/**
 * communication
 */
// send message to popup or others
chrome.runtime.sendMessage();
// send message to tabs content script
let lastTabId;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	lastTabId = tabs[0].id;
	// send msg to current active tab
	if(lastTabId!==null && lastTabId!==undefined){
		chrome.tabs.sendMessage(lastTabId, msg,{},cb);
		console.log("[background] sent to [content] in tab",lastTabId);
	}else{
		console.error("[background] no active tab found");
	}
});
// listen to message from popup/content/ others
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {});