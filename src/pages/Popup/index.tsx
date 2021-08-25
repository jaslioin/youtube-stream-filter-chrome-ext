import React from 'react';
import { render } from 'react-dom';

import Popup from './Popup';
import './index.css';
import { ErrorBoundary } from 'react-error-boundary';

render(
  //   <ErrorBoundary fallbackRender={props => <div>!!</div>}>
  <Popup />,
  //   </ErrorBoundary>
  window.document.querySelector('#app-container')
);
