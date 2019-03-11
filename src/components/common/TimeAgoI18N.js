import React from "react";
import moment from 'moment';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import time_nl from 'react-timeago/lib/language-strings/nl';
import time_en from 'react-timeago/lib/language-strings/en';
import time_zh from 'react-timeago/lib/language-strings/zh-CN';
import time_fa from 'react-timeago/lib/language-strings/fa';
import time_ko from 'react-timeago/lib/language-strings/ko';
import time_br from 'react-timeago/lib/language-strings/pt-br';
import time_fr from 'react-timeago/lib/language-strings/fr';
import time_es from 'react-timeago/lib/language-strings/es';
import time_de from 'react-timeago/lib/language-strings/de';
import time_sv from 'react-timeago/lib/language-strings/sv';
import time_tr from 'react-timeago/lib/language-strings/tr';
import time_it from 'react-timeago/lib/language-strings/it';
import time_pl from 'react-timeago/lib/language-strings/pl';
import time_ar from 'react-timeago/lib/language-strings/ar';
import time_uk from 'react-timeago/lib/language-strings/uk';
import time_ro from 'react-timeago/lib/language-strings/ro';
import time_vi from 'react-timeago/lib/language-strings/vi';
import time_ka from 'react-timeago/lib/language-strings/en';
import time_no from 'react-timeago/lib/language-strings/no';
import time_cs from 'react-timeago/lib/language-strings/cs';
import time_th from 'react-timeago/lib/language-strings/th';
import time_ru from 'react-timeago/lib/language-strings/ru';
import time_ja from 'react-timeago/lib/language-strings/ja';

const timeLanguages = {
   'nl': time_nl,
   'en': time_en,
   'zh': time_zh,
   'fa': time_fa,
   'ko': time_ko,
   'br': time_br,
   'fr': time_fr,
   'es': time_es,
   'de': time_de,
   'sv': time_sv,
   'tr': time_tr,
   'it': time_it,
   'pl': time_pl,
   'ar': time_ar,
   'uk': time_uk,
   'ro': time_ro,
   'vi': time_vi,
   'ka': time_ka,
   'no': time_no,
   'cs': time_cs,
   'th': time_th,
   'ru': time_ru,
   'ja': time_ja,
};

const TimeAgoI18N = ({date, activeLanguage}) => {
    const formatter = buildFormatter(timeLanguages[activeLanguage]);
    return <TimeAgo date={date} formatter={formatter} title={moment(date).format("MMM-DD-YYYY HH:mm:ss A")}/>;
};

export default TimeAgoI18N;
