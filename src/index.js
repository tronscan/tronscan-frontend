import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './styles/main.scss';
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css'
import "./scripts.js";
import AppCmp from './components/AppCmp';
import {IS_DESKTOP} from "./constants";
import "./app";

// eslint-disable-next-line
const consoleError = console.error.bind(console);

// eslint-disable-next-line
console.error = (message, ...args) => {
  if (
      typeof message === 'string' && (
      message.startsWith('[React Intl] Missing message:') ||
      message.startsWith('[React Intl] Cannot format message'))
  ) {
    return;
  }
  consoleError(message, ...args);
};

ReactDOM.render(<AppCmp/>, document.getElementById('root'));

if (IS_DESKTOP) {
  require("./desktop/bootstrap");
}

