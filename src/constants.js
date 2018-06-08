/**
 * 1000000 drops = 1 TRX
 * @type {number}
 */
export const ONE_TRX = 1000000;

export const IS_MAINNET = process.env.NET !== 'testnet';
export const IS_TESTNET = process.env.NET === 'testnet';

export const BLOCK_REWARD = 32;

/**
 *
 * @type {number}
 */
export const SR_MAX_COUNT = 27;

export const WITNESS_CREATE_COST = 9999;

export const CIRCULATING_SUPPLY = 100000000000;

export const ASSET_ISSUE_COST = 1024 * ONE_TRX;


export const IS_DESKTOP = process.env.DESKTOP === 'true';
