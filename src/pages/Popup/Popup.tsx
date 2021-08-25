import React, { useEffect, useMemo, useState } from 'react';
import { debounce, isNullOrUndef } from '@/helpers';
import { MessageType } from '@/constant/message-type';
import './Popup.css';
import styled from 'styled-components';
import { ActiveIndicator, Error } from '@/components';
import { ChangeEvent } from 'react';
enum LiveState {
  Live = 'LIVE',
  OFFLINE = 'OFFLINE',
}
const Popup = () => {
  const [filterInput, setFilter] = useState('');
  const [resultList, setResult] = useState<string[]>([]);
  const [isReceivingMsg, setIsReceiving] = useState(false);
  const [error, setError] = useState('');
  function requestFilter() {
    console.log('[popup] filter input: ', filterInput);
    if (isNullOrUndef(filterInput)) {
      setError('filterInput invalid!');
      return;
    }
    chrome.runtime.sendMessage({
      type: MessageType.queryChat,
      sender: 'popup',
      filter: filterInput,
    });
  }
  function updateFilterInput(e: ChangeEvent<HTMLInputElement>) {
    e.persist();
    setFilter(e.target.value);
  }
  function stopInterval() {
    try {
      chrome.runtime.sendMessage({
        type: MessageType.stopInterval,
        sender: 'popup',
      });
    } catch (e) {
      console.warn(e);
      setError(String(e));
    }
  }
  function onMessage(
    msg: Message,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    setError('');
    console.log('[popup] received msg from [background] ', sender);
    console.log(msg);
    setIsReceiving(true);
    setInActive();
    switch (msg.type) {
      case MessageType.init:
        console.log('[popup] init');
        break;
      case MessageType.queryChat:
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
        type: MessageType.clickIcon,
      });
      chrome.runtime.onMessage.addListener(onMessage);
    } catch (e) {
      console.warn('[popup] ', e);
      setError(String(e));
    }
    return () => {
      try {
        chrome.runtime.onMessage.removeListener(onMessage);
        stopInterval();
      } catch (e) {
        console.log(e);
        setError(String(e));
      }
    };
  }, []);
  return (
    <div>
      <ActiveIndicator
        isActive={isReceivingMsg}
        text={isReceivingMsg ? LiveState.Live : LiveState.OFFLINE}
      />
      <div id="ytb-stream-filter">
        <form onSubmit={e => e.preventDefault()}>
          <input
            type="text"
            id="filter"
            defaultValue={filterInput}
            onChange={updateFilterInput}
          />
          <button id="action-button" type="submit" onClick={requestFilter}>
            start
          </button>
          <button id="stop-button" type="button" onClick={stopInterval}>
            stop
          </button>
        </form>
      </div>
      {error ? <Error message={error} /> : ''}
      <ChatScroll textList={resultList} />
      {/* <ChatScroll
        textList={Array.from(
          { length: 100 },
          (_, k) =>
            'test'
        )}
      /> */}
    </div>
  );
};

function ChatScroll({ textList }: { textList: string[] }) {
  const renderedItem = textList.map((text, id) => {
    return (
      <ChatScroll.Row key={id}>
        <ChatScroll.Icon />
        <ChatScroll.Message>{text}</ChatScroll.Message>
      </ChatScroll.Row>
    );
  });
  return <div id="result">{renderedItem}</div>;
}

ChatScroll.Message = styled.div`
  overflow: hidden;
  text-overflow: clip;
  word-break: break-all;
`;
ChatScroll.Icon = styled.div`
  border: 1px solid green;
  width: 32px;
  height: 32px;
  background: green;
  border-radius: 50%;
  flex-shrink: 0;
`;
ChatScroll.Row = styled.div`
  display: flex;
  gap:4px;
  margin:4px;
  border:1px dashed orange;
`;
export default Popup;
