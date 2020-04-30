import Lockr from "lockr";
import TronWeb from "tronweb";
import SunWeb from "sunweb";
import TronStationSDK from "tronstation";
import {
  DISABLE_FLAG,
  ENABLE_FLAG,
  LOGIN,
  LOGIN_ADDRESS,
  LOGIN_TRONLINK,
  LOGIN_LEDGER,
  LOGIN_PK,
  LOGOUT,
  SET_ACCOUNTS,
  SET_CURRENCY,
  SET_LANGUAGE,
  SET_PRICE,
  SET_SYNC_STATUS,
  SET_THEME,
  SET_SIDECHAINS,
  SET_FEES
} from "../actions/app";
import {
  passwordToAddress,
  pkToAddress
} from "@tronscan/client/src/utils/crypto";
import { base64DecodeFromString } from "@tronscan/client/src/lib/code";
import {
  ACCOUNT_ADDRESS,
  ACCOUNT_LEDGER,
  ACCOUNT_PRIVATE_KEY,
  IS_DESKTOP,
  ACCOUNT_TRONLINK,
  IS_MAINNET,
  SUNWEBCONFIG,
  MAPPINGFEE,
  WITHDRAWFEE,
  DEPOSITFEE,
  RETRYFEE,
  TRXDEPOSITMIN,
  TRXWITHDRAWMIN,
  TRCDEPOSITMIN,
  TRCWITHDRAWMIN
} from "../constants";





const initialState = {
  theme: Lockr.get("theme", "light"),
  accounts: [],
  syncStatus: null,
  price: {
    usd: 0,
    percentage: 0
  },
  availableLanguages: {
    en: "English",
    zh: "简体中文",
    ja: "日本語",
    ko: "한국어",
    ar: "العربية",
    ru: "Pусский",
    fa: "فارسی",
    es: "Español"
  },
  activeLanguage: 'en',
  account: {
    key: undefined,
    address: undefined,
    isLoggedIn: false
  },
  wallet: {
    type: undefined,
    isOpen: false,
    address: undefined
  },
  activeCurrency: Lockr.get("currency", "TRX"),
  currencyConversions: [
    {
      name: "TRX",
      id: "trx",
      fractions: 6
    },
    {
      name: "BTC",
      id: "btc",
      fractions: 12
    },
    {
      name: "USD",
      id: "usd",
      fractions: 3
    },
    {
      name: "EUR",
      id: "eur"
    },
    {
      name: "ETH",
      id: "eth",
      fractions: 12
    }
  ],
  flags: {
    mobileLogin: false,
    showSr: false,
    scanTransactionQr: false
  },
  isRightText: false,
  sideChains: [],
  fees: {
    retryFee: RETRYFEE,
    mappingFee: MAPPINGFEE,
    trxDepositMinValue: TRXDEPOSITMIN,
    depositFee: DEPOSITFEE,
    withdrawFee: WITHDRAWFEE,
    trxWithdrawMinValue: TRXWITHDRAWMIN
  }
};

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACCOUNTS: {
      return {
        ...state,
        accounts: action.accounts
      };
    }

    case SET_PRICE: {
      return {
        ...state,
        price: {
          usd: action.price,
          percentage: action.percentage
        }
      };
    }

    case SET_LANGUAGE: {
      let language = action.language;

      if (typeof state.availableLanguages[action.language] === "undefined") {
        language = "en";
      }

      Lockr.set("language", language);

      let isright = false;
      if (language === "ar" || language === "fa") {
        isright = true;
      }

      return {
        ...state,
        activeLanguage: language,
        isRightText: isright
      };
    }

    case SET_CURRENCY: {
      Lockr.set("currency", action.currency);

      return {
        ...state,
        activeCurrency: action.currency
      };
    }

    case LOGIN: {
      Lockr.set("account_key", base64DecodeFromString(action.password));

      return {
        ...state,
        account: {
          type: ACCOUNT_PRIVATE_KEY,
          key: base64DecodeFromString(action.password),
          isLoggedIn: true,
          address: passwordToAddress(action.password)
        },
        wallet: {
          type: ACCOUNT_PRIVATE_KEY,
          address: passwordToAddress(action.password),
          isOpen: true
        }
      };
    }

    case LOGIN_PK: {
      Lockr.set("islogin", 0);
      const ServerNode = SUNWEBCONFIG.MAINFULLNODE;
      const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
      const fullNode = new HttpProvider(ServerNode); // Full node http endpoint
      const solidityNode = new HttpProvider(ServerNode); // Solidity node http endpoint
      const eventServer = ServerNode; // Contract events http endpoint
      const privateKey = action.privateKey;
      const tronWeb = new TronWeb({
        fullNode,
        solidityNode,
        eventServer,
        privateKey
      });
    const mainchain = new TronWeb( {
        fullNode: ServerNode,
        solidityNode: ServerNode,
        eventServer: ServerNode,
        privateKey
    });
    const sidechain = new TronWeb({
        fullNode: SUNWEBCONFIG.SUNFULLNODE,
        solidityNode: SUNWEBCONFIG.SUNSOLIDITYNODE,
        eventServer: SUNWEBCONFIG.SUNEVENTSERVER,
        privateKey
    })
    const sunWeb = new SunWeb(
      mainchain,
      sidechain,
      SUNWEBCONFIG.MAINNET,
      SUNWEBCONFIG.SIDECHAIN,
      SUNWEBCONFIG.SIDEID,
    );
      //window.sunWeb = sunWeb
      return {
        ...state,
        account: {
          type: ACCOUNT_PRIVATE_KEY,
          key: action.privateKey,
          isLoggedIn: true,
          address: pkToAddress(action.privateKey),
          tronWeb: tronWeb,
          sunWeb: sunWeb,
          tronStationSDK: IS_MAINNET
            ? new TronStationSDK(tronWeb)
            : new TronStationSDK(sunWeb.sidechain)
        },
        wallet: {
          type: ACCOUNT_PRIVATE_KEY,
          address: pkToAddress(action.privateKey),
          isOpen: true
        }
      };
    }

    case LOGIN_ADDRESS: {
      return {
        ...state,
        account: {
          type: ACCOUNT_ADDRESS,
          key: false,
          isLoggedIn: true,
          address: action.address
        },
        wallet: {
          type: ACCOUNT_ADDRESS,
          address: action.address,
          isOpen: true
        }
      };
    }

    case LOGIN_TRONLINK: {
      if (IS_DESKTOP) {
        Lockr.rm("account_key");
        // Lockr.set("account_address", action.address);
      }
      return {
        ...state,
        account: {
          key: false,
          isLoggedIn: true,
          address: action.address,
          tronWeb: action.tronWeb,
          sunWeb: action.sunWeb,
          tronStationSDK: IS_MAINNET
            ? new TronStationSDK(action.tronWeb, true)
            : new TronStationSDK(action.sunWeb.sidechain, true)
        },
        wallet: {
          type: ACCOUNT_TRONLINK,
          address: action.address,
          isOpen: true
        }
      };
    }

    case SET_SIDECHAINS: {
      return {
        ...state,
        sideChains: action.sideChains
      };
    }

    case SET_FEES: {
      return {
        ...state,
        fees: action.fees
      };
    }

    case LOGIN_LEDGER: {
      return {
        ...state,
        account: {
          type: ACCOUNT_LEDGER,
          key: false,
          isLoggedIn: true,
          address: action.address,
          tronWeb: action.tronWeb,
          sunWeb: action.sunWeb,
          pathIndex: action.pathIndex,
          tronStationSDK: new TronStationSDK(action.tronWeb, true)
        },
        wallet: {
          type: ACCOUNT_LEDGER,
          address: action.address,
          isOpen: true
        }
      };
    }

    case LOGOUT: {
      Lockr.rm("account_key");
      Lockr.rm("account_address");
      Lockr.set("islogin", 0);
      //  compileCode
      Lockr.rm("CompileCode");
      // compile status
      Lockr.rm("CompileStatus");
      // contractNameList
      Lockr.rm("contractNameList");
      // compileInfo
      Lockr.rm("compileInfo");
      // compile files
      Lockr.rm("compileFiles");
      return {
        ...state,
        account: {
          key: undefined,
          isLoggedIn: false
        },
        wallet: {
          type: undefined,
          address: undefined,
          isOpen: false
        }
      };
    }

    case SET_THEME: {
      //Lockr.set("theme", action.theme);
      return {
        ...state,
        theme: action.theme
      };
    }

    case ENABLE_FLAG: {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: true
        }
      };
    }

    case DISABLE_FLAG: {
      return {
        ...state,
        flags: {
          ...state.flags,
          [action.flag]: false
        }
      };
    }

    case SET_SYNC_STATUS: {
      return {
        ...state,
        syncStatus: action.status
      };
    }

    default:
      return state;
  }
}
