import React, { useEffect, useMemo, useState } from 'react';
import { debounce, isNullOrUndef } from '../../../utils/helper';
import { MESSAGE_TYPE } from '../../constant/message-type';
import './Popup.css';
enum LiveState {
  Live = 'LIVE',
  OFFLINE = 'OFFLINE',
}
const Popup = () => {
  const [filterInput, setFilter] = useState('');
  const [resultList, setResult] = useState([]);
  const [isReceivingMsg, setIsReceiving] = useState(false);
  function requestFilter() {
    console.log('[popup] filter input: ', filterInput);
    if (isNullOrUndef(filterInput)) {
      return;
    }
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPE.queryChat,
      sender: 'popup',
      filter: filterInput,
    });
  }
  function updateFilterInput(e) {
    e.persist();
    setFilter(e.target.value);
  }
  function stopInterval() {
    try {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.stopInterval,
        sender: 'popup',
      });
    } catch (e) {
      console.warn(e);
    }
  }
  function onMessage(msg, sender, sendResponse) {
    console.log('[popup] received msg from [background] ', sender);
    console.log(msg);
    setIsReceiving(true);
    setInActive();
    switch (msg.type) {
      case MESSAGE_TYPE.init:
        console.log('[popup] init');
        break;
      case MESSAGE_TYPE.queryChat:
        console.log(msg.result);
        if (!msg.result || msg.result.length === 0) {
          return;
        }
        setResult(msg.result.reverse());
        break;
      default:
        break;
    }
  }
  const setInActive = debounce(() => {
    setIsReceiving(false);
  }, 2000);
  useEffect(() => {
    // notify bg about the click on icon
    try {
      chrome.runtime.sendMessage({
        type: MESSAGE_TYPE.clickIcon,
      });
      chrome.runtime.onMessage.addListener(onMessage);
    } catch (e) {
      console.warn('[popup] ', e);
    }
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
      stopInterval();
    };
  }, []);
  return (
    <div className="App">
      <ActiveIndicator
        isActive={isReceivingMsg}
        text={isReceivingMsg ? LiveState.Live : LiveState.OFFLINE}
      />
      <div id="ytb-stream-filter">
        <input
          type="text"
          id="filter"
          defaultValue={filterInput}
          onChange={updateFilterInput}
        />
        <button id="action-button" onClick={requestFilter}>
          start
        </button>
        <button id="stop-button" onClick={stopInterval}>
          stop
        </button>
      </div>
      <ChatDisplay textList={resultList} />
      {/* <ChatDisplay textList={Array.from({length:100},(_,i)=>`placeholder_${i}`)}/> */}
    </div>
  );
};
function ChatDisplay({ textList }) {
  console.log('RENDER>>>>>>>>>');
  const renderedItem = textList.map((text, id) => {
    return <div key={id}>{text}</div>;
  });
  return <div id="result">{renderedItem}</div>;
}
function ActiveIndicator({ isActive, text }) {
  const style = {
    backgroundColor: isActive ? 'green' : 'red',
  };

  return (
    <div id="activity-indicator-wrap">
      <div id="activity-indicator" style={style}></div>
      <span id="activity-indicator-text">{text}</span>
    </div>
  );
}
export default Popup;
