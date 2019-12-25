import {
    appReducer
} from "./app";
import {
    blockchainReducer
} from "./blockchain";
import {
    networkReducer
} from "./network";
import {
    tokensReducer
} from "./tokens";
import {
    tokensInfo
} from "./tokenInfo";

import {
    accountReducer
} from "./account";
import {
    marketsReducer
} from "./markets";
import {
    walletReducer
} from "./wallet";
import {
    votesReducer
} from "./votes";
import {
    exchangeReducer
} from "./exchange";

import {
    reducer as toastrReducer
} from 'react-redux-toastr'

export default {
    app: appReducer,
    blockchain: blockchainReducer,
    network: networkReducer,
    tokens: tokensReducer,
    tokensInfo: tokensInfo,
    account: accountReducer,
    markets: marketsReducer,
    wallet: walletReducer,
    voting: votesReducer,
    toastr: toastrReducer,
    exchange: exchangeReducer
};