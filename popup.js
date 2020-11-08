// notify bg about the click on icon
chrome.runtime.sendMessage({clicked : true});
chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
	console.log("[popup] received msg from [background] ",sender);
	console.log(msg);
	if(msg.type==="init"){
		document.body.style.backgroundColor="cyan";
	}
	if(msg.type==="query-chat"){
		console.log(msg.result);
	}
});
document.addEventListener("DOMContentLoaded", function () {
	document.querySelector("#action-button").addEventListener("click",()=>{
		const filter = document.querySelector("#filter").nodeValue;
		if(!filter){
			return;
		}
		chrome.runtime.sendMessage({
			type : "query-chat",
			sender:"popup",
			filter:filter
		});
	});
});
