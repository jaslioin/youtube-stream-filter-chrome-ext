import React, { useEffect, useState } from 'react';
import { isNullOrUndef } from '../../../utils/helper';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  const [filterInput,setFilter] = useState('')

  function requestFilter(){
    console.log("[popup] filter input: ",filterInput);
    if(isNullOrUndef(filterInput)){
      return
    }
    chrome.runtime.sendMessage({
			type : "query-chat",
			sender:"popup",
			filter:filterInput
		});
  }
  function updateFilterInput(e){
    e.persist()
    setFilter(e.target.value)
  }
  useEffect(()=>{
    // notify bg about the click on icon
    let unSubscribeOnMessage=()=>{}
    try{
      chrome.runtime.sendMessage({clicked : true});
      unSubscribeOnMessage = chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
        console.log("[popup] received msg from [background] ",sender);
        console.log(msg);
        if(msg.type==="init"){
          document.body.style.backgroundColor="cyan";
        }
        if(msg.type==="query-chat"){
          console.log(msg.result);
        }
      });
    }catch(e){
      console.warn('[popup] ',e);
    }
    

  return()=>{
    unSubscribeOnMessage();
  }
  },[])
  return (
    <div className="App">
      <div id="ytb-stream-filter">
        <input type="text" id="filter" defaultValue={filterInput} onChange={updateFilterInput}/>
        <button id="action-button" onClick={requestFilter}>start</button>
        <div id="result"></div>
      </div>
    </div>
  );
};

export default Popup;
