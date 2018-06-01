import React from "react";
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

import time_nl from 'react-timeago/lib/language-strings/nl';
import time_en from 'react-timeago/lib/language-strings/en';
import time_zh from 'react-timeago/lib/language-strings/zh-TW';
import time_fa from 'react-timeago/lib/language-strings/fa';
import time_ko from 'react-timeago/lib/language-strings/ko';
import time_br from 'react-timeago/lib/language-strings/pt-br';
import time_fr from 'react-timeago/lib/language-strings/fr';
import time_es from 'react-timeago/lib/language-strings/es';

const timeLanguages = {
    'nl': time_nl,
    'en': time_en,
    'zh': time_zh,
    'fa': time_fa,
    'ko': time_ko,
    'br': time_br,
    'fr': time_fr,
    'es': time_es 
};

const TimeAgoI18N = ({date, activeLanguage}) => {
    const formatter = buildFormatter(timeLanguages[activeLanguage]);
    return <TimeAgo date={date} formatter={formatter}/>;
};

export default TimeAgoI18N;