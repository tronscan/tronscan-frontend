import {App} from "../app";
const {shell} = window.require('electron');

App.setExternalLinkHandler(url => shell.openExternal(url));
