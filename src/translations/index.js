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
import * as messages_pl from "./pl.js";
import * as messages_ar from "./ar.js";
import * as messages_uk from "./uk.js";
import * as messages_ro from "./ro.js";
import * as messages_vi from "./vi.js";
import * as messages_ka from "./ka.js";
import * as messages_no from "./no.js";
import * as messages_cs from "./cs.js";
import * as messages_th from "./th.js";
import * as messages_ru from "./ru.js";

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
import plLocaleData from 'react-intl/locale-data/pl';
import arLocaleData from 'react-intl/locale-data/ar';
import ukLocaleData from 'react-intl/locale-data/uk';
import roLocaleData from 'react-intl/locale-data/ro';
import viLocaleData from 'react-intl/locale-data/vi';
import kaLocaleData from 'react-intl/locale-data/ka';
import noLocaleData from 'react-intl/locale-data/no';
import csLocaleData from 'react-intl/locale-data/cs';
import thLocaleData from 'react-intl/locale-data/th';
import ruLocaleData from 'react-intl/locale-data/ru';

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
  ...plLocaleData,
  ...arLocaleData,
  ...ukLocaleData,
  ...roLocaleData,
  ...viLocaleData,
  ...kaLocaleData,
  ...csLocaleData,
  ...noLocaleData,
  ...thLocaleData,
  ...ruLocaleData,
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
  'pl': messages_pl.messages,
  'ar': messages_ar.messages,
  'uk': messages_uk.messages,
  'ro': messages_ro.messages,
  'vi': messages_vi.messages,
  'ka': messages_ka.messages,
  'no': messages_no.messages,
  'cs': messages_cs.messages,
  'th': messages_th.messages,
  'ru': messages_ru.messages,
};
