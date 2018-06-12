import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import "./scripts.js";
import App from './components/App';
// import registerServiceWorker from './registerServiceWorker';
import {unregister} from './registerServiceWorker';


// eslint-disable-next-line
const consoleError = console.error.bind(console);
// eslint-disable-next-line
console.error = (message, ...args) => {
  if (
    typeof message === 'string' && (
    message.startsWith('[React Intl] Missing message:') ||
    message.startsWith('[React Intl] Cannot format message') )
  ) {
    return;
  }
  consoleError(message, ...args);
};

ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
unregister();

