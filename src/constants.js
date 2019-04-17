/**
 * 1000000 sun = 1 TRX
 */
export const ONE_TRX = 1000000;

export const IS_MAINNET = process.env.NET !== 'testnet';
export const IS_TESTNET = process.env.NET === 'testnet';
export const IS_DESKTOP = process.env.DESKTOP === 'true';

export const BLOCK_REWARD = 32;
export const SR_MAX_COUNT = 27;
export const WITNESS_CREATE_COST = 9999;
export const CIRCULATING_SUPPLY = 100000000000;
export const ASSET_ISSUE_COST = 1024 * ONE_TRX;

export const PUBLIC_URL = process.env.PUBLIC_URL || window.location.origin;
export const API_URL = process.env.API_URL;

export const ACCOUNT_PRIVATE_KEY = 'ACCOUNT_PRIVATE_KEY';
export const ACCOUNT_ADDRESS = 'ACCOUNT_ADDRESS';
export const ACCOUNT_LEDGER = 'ACCOUNT_LEDGER';
export const ACCOUNT_TRONLINK = 'ACCOUNT_TRONLINK';

export const CONTRACT_ADDRESS_USDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
