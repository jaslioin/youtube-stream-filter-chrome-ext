import { MESSAGE_TYPE } from '../../constant/message-type';
import { printLine } from './modules/print';

let t;
console.log("[content] js loaded");
chrome.runtime.sendMessage({
	type:MESSAGE_TYPE.validateOrigin,
	sender:"content",
});
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
	console.log("[content] received msg from [background]");
	console.log(msg);
	if(msg.type===MESSAGE_TYPE.init){
		// placeholder
	}
	if(msg.type===MESSAGE_TYPE.queryChat){
		try{
			const msgEleList = document.querySelector("#chat #chatframe")
				.contentWindow.document
				.querySelectorAll("span#message");
			// chrome.runtime.sendMessage({
			// 	type:MESSAGE_TYPE.queryChat,
			// 	sender:"content",
			// 	result:msgEleList
			// });
			clearInterval(t)
			t=setInterval(()=>{
				console.clear();
				// filterChat(msg.filter)

				try{
					const msgEleList = document.querySelector("#chat #chatframe")
						.contentWindow.document
						.querySelectorAll("span#message");
					sendResponse({
						type:"get-chat",
						body:msgEleList
					});
					if(!msgEleList || msgEleList.length===0){
						console.warn("[content] chat list empty");
						return
					}
					const filteredList=[]

					msgEleList.forEach((e)=>{
						if(e.textContent.match(new RegExp(msg.filter))){
							console.log(e.textContent);
							filteredList.push(e.textContent)
						}
					});
					chrome.runtime.sendMessage({
						type:MESSAGE_TYPE.queryChat,
						sender:"content",
						result:filteredList
					});
				}catch(e){
				}    
			},1000);
		}catch(e){
			chrome.runtime.sendMessage({
				type:MESSAGE_TYPE.queryChat,
				sender:"content",
				result:[]
			});
		}
	}
	if(msg.type===MESSAGE_TYPE.stopInterval){
		clearInterval(t)
	}
	// clearInterval(t);
    

  
    
});

document.addEventListener("DOMContentLoaded",function(){

});
function filterChat(filterRegex='[a-zA-Z]'){
	const chatIframeDocument =document.querySelector("#chat #chatframe").contentWindow.document;
	const chatRendererNodes = chatIframeDocument.querySelectorAll("yt-live-chat-text-message-renderer.yt-live-chat-item-list-renderer");
	chatRendererNodes.forEach((node,idx)=>{
		const msgNode=node.querySelector("#message");
		if(!msgNode){return;}
		if(msgNode.textContent.match(new RegExp(filterRegex))){return}	
		node.remove();
	});
}