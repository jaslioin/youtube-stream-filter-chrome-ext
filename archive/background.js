// chrome.alarms.create("notify_date", {
//   when: Date.now() + 60000,
// });
// chrome.alarms.onAlarm.addListener(function () {
//   chrome.notifications.create({
//     type: "basic",
//     iconUrl: "icon.png",
//     title: "Time to Hydrate",
//     message: "Everyday I'm Guzzlin'!",
//     buttons: [{ title: "Notify again in 1 minute" }],
//     priority: 0,
//   });
//   chrome.notifications.onButtonClicked.addListener(function () {
//     chrome.alarms.create("notify_date", {
//       when: Date.now() + 60000,
//     });
//   });



// });
let lastTabId;
console.log("[background] js loaded");
// msg to content
function sendMessage (msg) {
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
	console.log("[background] msg received from ",sender.id);
	console.log(msg);

	if (msg.clicked) {
		/* Do the usual onClicked stuff */
		console.log("[background] popup icon tapped");
		chrome.runtime.sendMessage({
			type:"init"
		});
		sendMessage({
			type:"init-content-script"
		});
	}
	if(msg.type==="query-chat"){
		if(msg.sender==="content"){
			chrome.runtime.sendMessage({
				type:"query-chat",
				sender:"background",
				result:msg.result
			});
		}else{
			sendMessage({
				type:"query-chat",
				filter:msg.filter
			},);
		}
		
	}

});

function contentResponseHandler(res){
	if(!res.type){
		return;
	}
	console.log("[background] received response from [content]");
	console.log("------------------------------------");
	switch(res.type){
	    case "send-chat-list":
        
	}
	console.log("------------------------------------");

}