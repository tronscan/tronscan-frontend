import Lockr from "lockr";
/**
 * 1000000 sun = 1 TRX
 */
export const ONE_TRX = 1000000;

export const IS_TESTNET = process.env.NET === "testnet";
export const IS_DESKTOP = process.env.DESKTOP === "true";
export const IS_MAINNET = Lockr.get("NET") === "mainnet" || !Lockr.get("NET");
export const IS_SUNNET = Lockr.get("NET") === "sunnet";
export const NETURL = {
  MAINNET: "https://tronscan.org",
  SUNNET: "https://dappchain.tronscan.org"
};
//export const IS_MAINNET = window.location.origin === NETURL.MAINNET;
//export const IS_SUNNET = window.location.origin === NETURL.SUNNET;

export const BLOCK_REWARD = 32;
export const SR_MAX_COUNT = 27;
export const WITNESS_CREATE_COST = 9999;
export const CIRCULATING_SUPPLY = 100000000000;
export const ASSET_ISSUE_COST = 1024 * ONE_TRX;

export const PUBLIC_URL = process.env.PUBLIC_URL || window.location.origin;
//export const API_URL = process.env.API_URL;

export const API_URL_SUNNET = 'https://dappchainapi.tronscan.org';
// export const API_URL_MAINNET = 'https://apilist.tronscan.org';
export const API_URL = IS_SUNNET?API_URL_SUNNET:process.env.API_URL;
export const CONTRACT_MAINNET_API_URL = process.env.API_URL; 
//export const MARKET_API_URL = 'http://172.16.21.165:7001';
//test
export const MARKET_API_URL = 'http://3.15.229.178:7001';
export const MARKET_HTTP_URL = 'http://18.222.178.103:83';


export const ACCOUNT_PRIVATE_KEY = "ACCOUNT_PRIVATE_KEY";
export const ACCOUNT_ADDRESS = "ACCOUNT_ADDRESS";
export const ACCOUNT_LEDGER = "ACCOUNT_LEDGER";
export const ACCOUNT_TRONLINK = "ACCOUNT_TRONLINK";

export const TOKEN_ID_BTT = "1002000";
export const CONTRACT_ADDRESS_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
export const CONTRACT_ADDRESS_WIN = "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7";
export const CONTRACT_ADDRESS_GGC = "TB95FFYRJMLY6mWZqv4JUMqAqsHF4JCXga";

// Deployment to compile
export const FILE_MAX_SIZE = 5 * 1024 * 1024;
export const FILE_MAX_NUM = 10;

// currency type
export const CURRENCYTYPE = {
  TRX: "TRX",
  TRX10: "TRX10",
  TRX20: "TRX20"
};

// mapping energy
export const MAPPINGFEE = 1000;
// feeLimit
export const FEELIMIT = 10000000;
// withdrawFee
export const WITHDRAWFEE = 10;
// depositFee
export const DEPOSITFEE = 0;
// retryFee
export const RETRYFEE = 0;
// deposi min trx
export const TRXDEPOSITMIN = 10;
// withdraw min trx
export const TRXWITHDRAWMIN = 10;
// deposi min trc
export const TRCDEPOSITMIN = 1;
// withdraw min trc
export const TRCWITHDRAWMIN = 1;

// trading type
export const TRADINGMAP = {
  MAPPING: "mapping",
  WITHDRAW: "withdraw",
  DEPOSIT: "deposit",
  APPROVE: "approve"
};

// SunWeb config
export const SUNWEBCONFIG = {
  MAINFULLNODE: "https://api.trongrid.io",
  MAINSOLIDITYNODE: "https://api.trongrid.io",
  MAINEVENTSERVER: "https://api.trongrid.io",
  SUNFULLNODE: "https://sun.tronex.io",
  SUNSOLIDITYNODE: "https://sun.tronex.io",
  SUNEVENTSERVER: "https://sun.tronex.io",
  MAINNET: "TWaPZru6PR5VjgT4sJrrZ481Zgp3iJ8Rfo",
  SIDECHAIN: "TGKotco6YoULzbYisTBuP6DWXDjEgJSpYz",
  SIDEID: "41E209E4DE650F0150788E8EC5CAFA240A23EB8EB7"
};

// Socket config
export const TORNSOCKET = {
  WSSURLMAIN: "wss://apilist.tronscan.org/api/tronsocket",
  WSSURLSUN: "wss://dappchainapi.tronscan.org/api/tronsocket"
};

// token type
export const TOKENTYPE = {
    TOKEN10: 'trc10',
    TOKEN20: 'trc20',
};

// market basic page
export const MARKETPAGE = {
    CREATE: 'create',
    UPDATE: 'update',
};

// market token verify status
export const VERIFYSTATUS = {
    HASBEENSUBMITTEDTHREE:-3,
    NOTRECORDED: -2, // No recorded
    HASBEENRECORDED: -1, // Has been recorded
    HASBEENSUBMITTED: 0, // Has been submitted
    NOTRECOMMENDED: 1, // not recommended
    TOAUDIT: 2, // to audit
    APPROVED: 3, // reviewed for recommendation
    RECOMMENDED: 4, // reviewed and recommended
    REJECTED: 5, // rejected
    SHELVES: 6, // Has been off the shelves
    CONFIRMED: 7, // Have been confirmed
    RECOMMENDEDFAILED: 8, // Review recommendation failed
};

// JSEncrypt key
export const JSENCRYPTKEY = `-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCezlJJy/F7LO5+fmIcUjWq0APOILbzUEAcMyK/1VK7d5G0vb58thDtG0rK72uzFA1e0SByI2Hdqy0JbE8a2+cSIBN1y9iKw4WW5MJLBZXrMZmUjcgHYCbH7yjbDOOGCXtmINaNeLOcieLVvf7fDQaRAJniNuDgNtqjqtMuOFfApQIDAQAB-----END PUBLIC KEY-----`;

// market token entry fromId
export const FROMID = 1;

// url regexp
export const URLREGEXP = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\\/~+#]*[\w\-@?^=%&\\/~+#])?$/;
