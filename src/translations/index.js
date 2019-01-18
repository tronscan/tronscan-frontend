import * as messages_en from "./en.js";
import * as messages_zh from "./zh.js";


import {addLocaleData} from 'react-intl';
import zhLocaleData from 'react-intl/locale-data/zh';


addLocaleData([
  ...zhLocaleData,
]);

export const languages = {
  'en': messages_en.messages,
  'zh': messages_zh.messages,
};
