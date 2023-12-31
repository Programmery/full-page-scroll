import React from 'react';
import {render} from 'react-dom';
import {App} from './components/App';

import './index.scss';

// mobx configure
import './scripts/mobx.configure';

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
// import reportWebVitals from './reportWebVitals';
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
