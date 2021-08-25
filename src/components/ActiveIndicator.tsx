import React from 'react';
import styled from 'styled-components';
interface Props {
  isActive:boolean,
  text:string,
}
export function ActiveIndicator({ isActive, text }:Props) {
  return (
    <ActiveIndicator.Wrapper>
      <ActiveIndicator.Light isActive={isActive}></ActiveIndicator.Light>
      <ActiveIndicator.Label>{text}</ActiveIndicator.Label>
    </ActiveIndicator.Wrapper>
  );
}
ActiveIndicator.Wrapper = styled.div`
  display: flex;
  gap: 8px;
`;
ActiveIndicator.Light = styled.div<{ isActive: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  align-self: center;
  background-color: ${({ isActive }) => (isActive ? 'green' : 'red')};
`;
ActiveIndicator.Label = styled.span`
  font-size: 2rem;
`;
