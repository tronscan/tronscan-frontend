import React from "react";
import {
    flatten
} from "lodash";
import {
    Redirect
} from "react-router-dom";
import {
    IS_MAINNET,
    NETURL
} from "./constants";

import {
    HomeAsync,
    AboutAsync,
    AccountAsync,
    AccountsAsync,
    CopyrightAsync,
    DemoAsync,
    FaqAsync,
    ErrorAsync,
    FoundationAsync,
    LedgerHelpAsync,
    LiveAsync,
    MyTokenAsync,
    NodesAsync,
    NodeTesterAsync,
    ProposalDetailAsync,
    RepresentativesAsync,
    SingleChartAsync,
    StatisticsAsync,
    SystemAsync,
    Token20DetailAsync,
    TokenDetailAsync,
    TokenOverviewAsync,
    TokensCreateAsync,
    TokenAllAsync,
    TransactionViewerAsync,
    TronConvertToolAsync,
    TRONRatingAsync,
    VoteLiveAsync,
    VoteOverviewAsync,
    WalletWizardAsync,
    ContractCompilerAsync,
    Exchangetrc,
    SmartContract,
    Representative,
    BTTSupplyTemp,
    Blocks,
    Transactions,
    Transfers,
    Contracts,
    Notice,
    ContractTrans,
    Committee,
    Proposals,
    Block,
    Transaction,
    Address,
    DevelopersRewardAsync,
    TokensMarketsCreateAsync,
    TokensMarketsAddListAsync,
    Exchange20,
    ContractSourceCode,
    ContractUseServiceTerms,
    ContractLicense
} from "./components/async";
import {
    BlockChainRoutes
} from './routerManage/BlockChain'
import {
    ContractRoutes
} from './routerManage/ContractsRoute'
import {
    TokensRoutes
} from './routerManage/TokensRoute'
import {
    NetworkRoutes
} from './routerManage/NetworkRoute'
import {
    ToolsRoutes
} from './routerManage/ToolsRoute'
import {
    MoreRoutes
} from './routerManage/MoreRoute'
import {
    HelpRoutes
} from './routerManage/HelpRoute'

export const routes = [

    {
        path: "/",
        label: "home_page",
        icon: "fas fa-home",

        showInMenu: true,
        showSubMenu: false,
        showSubHeader: false,
        isExact: true,
        component: HomeAsync,
        strict: true
    },
    ...BlockChainRoutes,
    ...ContractRoutes,
    {
        path: "/block/:id",
        label: "block",
        component: Block,
        showInMenu: false
    },
    {
        path: "/transaction/:hash",
        label: "transaction",
        component: Transaction,
        showInMenu: false
    },
    {
        path: "/address/:id",
        label: "address",
        component: Address,
        showInMenu: false
    },
    {
        path: "/representative/:id",
        label: "representative",
        component: Representative,
        showInMenu: false
    },
    {
        path: "/contract/:id",
        label: "contract",
        component: SmartContract,
        showInMenu: false
    },
    ...TokensRoutes,
    {
        path: "/token/:id",
        label: "token",
        component: TokenDetailAsync,
        showInMenu: false
    },
    {
        path: "/token20/:address",
        label: "token",
        component: Token20DetailAsync,
        showInMenu: false
    },
    {
        label: "update_token",
        component: MyTokenAsync,
        path: "/myToken",
        showInMenu: false
    },
    {
        label: "TRONRating",
        component: TRONRatingAsync,
        path: "/rating",
        showInMenu: false
    },
    // {
    //   path: "/Poloni DEX",
    //   label: "Poloni DEX",
    //   icon: "fas fa-rocket",
    //   enurl: "https://poloniex.org",
    //   zhurl: "https://poloniex.org",
    //   linkHref: true
    // },
    // {
    //   label: "DEX10",
    //   path: "/exchange",
    //   icon: "fas fa-exchange-alt",
    //   component: Exchange,
    //   showInMenu: false,
    //   none: true
    // },
    ...NetworkRoutes,
    {
        label: "Poloni DEX",
        path: "/exchange/trc20",
        icon: "fas fa-exchange-alt",
        component: Exchange20,
        isExact: true,
        none: true,
        showInMenu: IS_MAINNET ? true : false
    },
    // {
    //   label: "Poloni DEX",
    //   path: "/exchange/:type",
    //   redirect: "/exchange/trc20",
    //   icon: "fas fa-exchange-alt",
    //   component: Exchangetrc,
    //   none: true
    // },
    {
        label: "DAPP",
        path: "/dapp",
        icon: "fas fa-gamepad",
        component: null,
        showInMenu: IS_MAINNET ? true : false,
        routes: [
            // {
            //     url: "https://www.tronace.com/?utm_source=TS",
            //     icon: "fas fa-dollar-sign",
            //     label: "TRONAce"
            // },
            // {
            //     url: "https://www.tronbet.io/#/?utm_source=TS",
            //     icon: "fas fa-dice-six",
            //     label: "TRONbet"
            // },
            {
                url: "https://tronlending.org/?utm_source=TS",
                icon: "fas fa-hand-holding-usd",
                label: "TronLending"
            },
            {
                url: "https://dapp.review/explore/tron?gclid=EAIaIQobChMIx-fB8KH04QIVlHZgCh0ybA1hEAAYASAAEgIad_D_BwE",
                icon: "fas fa-ellipsis-h",
                label: "nav_more"
            }
        ]
    },
    {
        label: "notice",
        path: "/notice/:id",
        //icon: "fas fa-exchange-alt",
        component: Notice,
        showInMenu: false
    },
    {
        label: "TRONSR",
        path: "/sr",
        icon: "fas fa-chess-queen",
        component: RepresentativesAsync,
        routes: [{
                label: "representatives",
                path: "/sr/representatives",
                icon: "fa fa-rocket",
                component: RepresentativesAsync
            },
            {
                label: "votes",
                path: "/sr/votes",
                icon: "fas fa-comment",
                component: VoteOverviewAsync,
                showInMenu: IS_MAINNET ? true : false
            },
            {
                label: "committee",
                path: "/sr/committee",
                icon: "fas fa-users",
                component: Committee
            }
        ]
    },
    {
        path: "/votes-live",
        label: "live",
        icon: "fas fa-comment",
        component: VoteLiveAsync,
        showInMenu: false
    },
    {
        path: "/account",
        label: "account",
        showInMenu: false,
        component: AccountAsync
    },
    {
        path: "/proposals",
        label: "commission_proposed",
        component: Proposals,
        showInMenu: false
    },
    {
        path: "/proposal/:id",
        label: "commission_proposed",
        component: ProposalDetailAsync,
        showInMenu: false
    },
    ...ToolsRoutes,
    ...HelpRoutes,
    ...MoreRoutes,
    {
        path: "/wallet/new",
        label: "wallet",
        showInMenu: false,
        component: WalletWizardAsync
    },
    {
        path: "/demo",
        label: "demo",
        showInMenu: false,
        showSubMenu: false,
        showSubHeader: false,
        component: DemoAsync
    },
    {
        path: "/test/btt/supply",
        label: "supply",
        showInMenu: false,
        showSubMenu: false,
        showSubHeader: false,
        component: BTTSupplyTemp
    },
    {
        path: "/error",
        showInMenu: false,
        showSubMenu: false,
        showSubHeader: false,
        component: ErrorAsync
    },
    {
        path: "/developersReward",
        label: "developers_scored_users",
        icon: "fa fa-users",
        showInMenu: false,
        component: DevelopersRewardAsync
    }
];

export const flatRoutes = flatten(
    routes.map(route => [...(route.routes || []), route])
);