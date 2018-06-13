import * as messages_en from "./en.js";
import * as messages_de from "./de.js";
import * as messages_nl from "./nl.js";
import * as messages_zh from "./zh.js";
import * as messages_fa from "./fa.js";
import * as messages_ko from "./ko.js";
import * as messages_br from "./br.js";
import * as messages_fr from "./fr.js";
import * as messages_es from "./es.js";
import * as messages_sv from "./sv.js";
import * as messages_tr from "./tr.js";
import * as messages_it from "./it.js";

import {addLocaleData} from 'react-intl';
import nlLocaleData from 'react-intl/locale-data/nl';
import zhLocaleData from 'react-intl/locale-data/zh';
import faLocaleData from 'react-intl/locale-data/fa';
import koLocaleData from 'react-intl/locale-data/ko';
import brLocaleData from 'react-intl/locale-data/br';
import frLocaleData from 'react-intl/locale-data/fr';
import esLocaleData from 'react-intl/locale-data/es';
import deLocaleData from 'react-intl/locale-data/de';
import svLocaleData from 'react-intl/locale-data/sv';
import trLocaleData from 'react-intl/locale-data/tr';
import itLocaleData from 'react-intl/locale-data/it';

addLocaleData([
  ...nlLocaleData,
  ...zhLocaleData,
  ...faLocaleData,
  ...koLocaleData,
  ...brLocaleData,
  ...frLocaleData,
  ...esLocaleData,
  ...deLocaleData,
  ...svLocaleData,
  ...trLocaleData,
  ...itLocaleData,
]);

export const languages = {
    'nl': messages_nl.messages,
    'en': messages_en.messages,
    'zh': messages_zh.messages,
    'fa': messages_fa.messages,
    'ko': messages_ko.messages,
    'br': messages_br.messages,
    'fr': messages_fr.messages,
    'es': messages_es.messages,
    'de': messages_de.messages,
    'sv': messages_sv.messages,
    'tr': messages_tr.messages,
    'it': messages_it.messages,
};
