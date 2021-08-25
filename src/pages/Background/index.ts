import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import { MessageType } from '../../constant/message-type';

let lastTabId;
console.log("[background] js loaded");
// msg to content
function sendMessageToTab (msg) {
	// find active tab
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if(!tabs || tabs.length===0){
			console.warn("[background] active tab not found");
			return;
		}
		lastTabId = tabs[0].id;
		// send msg to current active tab
		if(lastTabId!==null && lastTabId!==undefined){
			chrome.tabs.sendMessage(lastTabId, msg,{});
			console.log("[background] sent to [content] in tab",lastTabId);
		}else{
			console.error("[background] no active tab found");
		}

	});
}

chrome.runtime.onInstalled.addListener(function () {
	console.log("[background] Extension Installed.");
});
chrome.browserAction.onClicked.addListener(function () {
// can only triggered if popup is disabled
	console.log("[background] browserAction clicked");
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	console.log("[background] msg received from ",sender);
	console.log(msg);
	if(!msg || !msg.type){
		console.warn("[background] type missing");
		return;
	}
	switch (msg.type) {
		case MessageType.clickIcon:
			/* Do the usual onClicked stuff */
			console.log("[background] popup icon tapped");
			chrome.runtime.sendMessage({
				type:MessageType.init
			});
			sendMessageToTab({
				type:MessageType.init
			});
			break;
		case MessageType.queryChat:
			if(msg.sender==="content"){
				chrome.runtime.sendMessage({
					type:MessageType.queryChat,
					sender:"background",
					result:msg.result
				});
			}else if(msg.sender==='popup'){
				sendMessageToTab({
					type:MessageType.queryChat,
					filter:msg.filter
				},);
			}
			break
		case MessageType.stopInterval:
			sendMessageToTab({
				type:MessageType.stopInterval
			});
			break;
		case MessageType.validateOrigin:
			if(!sender.origin.match(/https?:\/\/www.youtube.com\/?.*/)){
				console.log("[background] not in youtube, disable extention");
				chrome.browserAction.disable()
			}
			break;
		default:
			break;
	}
});

