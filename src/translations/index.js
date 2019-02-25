import * as messages_en from "./en.js";
import * as messages_ja from "./ja.js";
import * as messages_zh from "./zh.js";
import * as messages_ko from "./ko.js";
import * as messages_ru from "./ru.js";
// import * as messages_ar from "./ar.js";

import {addLocaleData} from 'react-intl';
import zhLocaleData from 'react-intl/locale-data/zh';
import jaLocaleData from 'react-intl/locale-data/ja';
import koLocaleData from 'react-intl/locale-data/ko';
import ruLocaleData from 'react-intl/locale-data/ru';
// import arLocaleData from 'react-intl/locale-data/ar';

addLocaleData([
  ...zhLocaleData,
  ...jaLocaleData,
  ...koLocaleData,
  ...ruLocaleData,
  // ...arLocaleData
]);

export const languages = {
  'en': messages_en.messages,
  'ja': messages_ja.messages,
  'zh': messages_zh.messages,
  'ko': messages_ko.messages,
  'ru': messages_ru.messages,
  // 'ar': messages_ar.messages,
};
