import Lockr from "lockr";

import {
  DISABLE_FLAG,
  ENABLE_FLAG,
  LOGIN, LOGIN_ADDRESS,
  LOGIN_PK,
  LOGOUT,
  SET_ACCOUNTS,
  SET_CURRENCY,
  SET_LANGUAGE,
  SET_PRICE, SET_SYNC_STATUS,
  SET_THEME
} from "../actions/app";
import {passwordToAddress, pkToAddress} from "@tronscan/client/src/utils/crypto";
import {base64DecodeFromString} from "@tronscan/client/src/lib/code";
import {IS_DESKTOP} from "../constants";

const initialState = {
  theme: Lockr.get("theme", "light"),
  accounts: [],
  syncStatus: null,
  price: {
    usd: 0,
    percentage: 0,
  },
  availableLanguages: {
    en: "English",
    nl: "Nederlands",
    de: "Deutsch",
    sv: "Svenska",
    no: "Norsk",
    ru: "Pусский",
    pl: "Polski",
    cs: "Ceský",
    zh: "简体中文",
    fa: "فارسی",
    ar: "العربية",
    ko: "한국어",
    th: "ภาษาไทย",
    vi: "Tiếng Việt",
    uk: "українська",
    ka: "ქართული",
    br: "Português Brasil",
    it: "Italiano",
    fr: "Français",
    es: "Español",
    tr: "Türkçe",
    ro: "Română",
  },
  activeLanguage: 'en',
  account: {
    key: undefined,
    address: undefined,
    isLoggedIn: false,
  },
  activeCurrency: Lockr.get("currency", 'TRX'),
  currencyConversions: [
    {
      name: 'TRX',
      id: 'trx',
      fractions: 6,
    },
    {
      name: 'BTC',
      id: 'btc',
      fractions: 12,
    },
    {
      name: 'USD',
      id: 'usd',
    },
    {
      name: 'EUR',
      id: 'eur',
    },
    {
      name: 'ETH',
      id: 'eth',
      fractions: 12,
    },
  ],
  flags: {
    mobileLogin: false,
    showSr: false,
    scanTransactionQr: false,
  }
};

export function appReducer(state = initialState, action) {

  switch (action.type) {
    case SET_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts,
      };
    }

    case SET_PRICE: {
      return {
        ...state,
        price: {
          usd: action.price,
          percentage: action.percentage,
        }
      }
    }

    case SET_LANGUAGE: {
      let language = action.language;

      if (typeof state.availableLanguages[action.language] === 'undefined') {
        language = 'en';
      }

      Lockr.set("language", language);

      return {
        ...state,
        activeLanguage: language,
      };
    }

    case SET_CURRENCY: {

      Lockr.set("currency", action.currency);

      return {
        ...state,
        activeCurrency: action.currency,
      };
    }

    case LOGIN: {

      Lockr.set("account_key", base64DecodeFromString(action.password));

      return {
        ...state,
        account: {
          key: base64DecodeFromString(action.password),
          isLoggedIn: true,
          address: passwordToAddress(action.password)
        }
      };
    }

    case LOGIN_PK: {

      if (IS_DESKTOP) {
        Lockr.set("account_key", action.privateKey);
        Lockr.rm("account_address");
      }

      return {
        ...state,
        account: {
          key: action.privateKey,
          isLoggedIn: true,
          address: pkToAddress(action.privateKey),
        }
      };
    }

    case LOGIN_ADDRESS: {

      if (IS_DESKTOP) {
        Lockr.rm("account_key");
        // Lockr.set("account_address", action.address);
      }

      return {
        ...state,
        account: {
          key: false,
          isLoggedIn: true,
          address: action.address
        }
      };
    }

    case LOGOUT: {
      Lockr.rm("account_key");
      Lockr.rm("account_address");
      return {
        ...state,
        account: {
          key: undefined,
          isLoggedIn: false,
        }
      }
    }

    case SET_THEME: {
      //Lockr.set("theme", action.theme);
      return {
        ...state,
        theme: action.theme,
      };
    }

    case ENABLE_FLAG: {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: true,
        }
      };
    }

    case DISABLE_FLAG: {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: false,
        }
      };
    }

    case SET_SYNC_STATUS: {
      return {
        ...state,
        syncStatus: action.status,
      };
    }

    default:
      return state;
  }
}
