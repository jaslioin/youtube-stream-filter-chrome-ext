import { printLine } from './modules/print';

let t;
console.log("[content] js loaded");
// chrome.runtime.sendMessage("HIHIHIHIH from content");
chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
	console.log("[content] received msg from [background]");
	console.log(msg);
	if(msg.type==="init-content-script"){
		sendResponse({
			type:"init-content-script-done"
		});
	}
	if(msg.type==="query-chat"){
		try{
			const msgEleList = document.querySelector("#chat #chatframe")
				.contentWindow.document
				.querySelectorAll("span#message");
			chrome.runtime.sendMessage({
				type:"query-chat",
				sender:"content",
				result:msgEleList
			});
            
			// .forEach((e)=>{
			// 	if(e.textContent.match(/\[EN/)){
			// 		console.log(e.textContent);
			// 	}
			// });
		}catch(e){
			chrome.runtime.sendMessage({
				type:"query-chat",
				sender:"content",
				result:[]
			});
		}
	}
	// clearInterval(t);
    
	// t=setInterval(()=>{
	// 	console.clear();
	// 	try{
	// 		const msgEleList = document.querySelector("#chat #chatframe")
	// 			.contentWindow.document
	// 			.querySelectorAll("span#message");
	// 		sendResponse({
	// 			type:"get-chat",
	// 			body:msgEleList
	// 		});
	// 		// .forEach((e)=>{
	// 		// 	if(e.textContent.match(/\[EN/)){
	// 		// 		console.log(e.textContent);
	// 		// 	}
	// 		// });
	// 	}catch(e){

	// 	}
    
	// },1000);
  
    
});

