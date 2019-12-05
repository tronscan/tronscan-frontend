import React from "react";
import {
    Redirect
} from "react-router-dom";
import {
    IS_MAINNET,
    NETURL
} from "../constants";
import {
    NodesAsync,
    Blocks,
    Transactions,
    Transfers,
    AccountsAsync,
    StatisticsAsync,
    SingleChartAsync,
    LiveAsync,
    FoundationAsync
} from "../components/async";

export const BlockChainRoutes = [

    {
        path: "/blockchain",
        label: "blockchain",
        icon: "fa fa-link",
        component: () => < Redirect to = "/blockchain/blocks" / > ,
        routes: [{
                label: "nodes",
                icon: "fa fa-server",
                path: "/blockchain/nodes",
                component: NodesAsync,
                showInMenu: true
                    // showInMenu: IS_MAINNET?true:false,
            },
            {
                path: "/blockchain/blocks",
                label: "blocks",
                icon: "fa fa-cubes",
                component: Blocks
            },
            {
                icon: "fas fa-handshake",
                path: "/blockchain/transactions",
                label: "transactions",
                component: Transactions
            },
            {
                icon: "fas fa-handshake",
                path: "/blockchain/transactions/:date",
                label: "daily_transactions",
                component: Transactions,
                showInMenu: false
            },
            {
                icon: "fa fa-exchange-alt",
                path: "/blockchain/transfers",
                label: "transfers",
                component: Transfers
            },
            {
                path: "/blockchain/accounts",
                label: "accounts",
                icon: "fa fa-users",
                component: AccountsAsync
            },

            // {
            //   path: "/blockchain/contracts",
            //   label: "Verified_contracts",
            //   icon: "fa fa-file",
            //   component: Contracts,
            // },
            {
                label: "statistics",
                icon: `fa fa-chart-pie`,
                path: "/blockchain/stats",
                component: StatisticsAsync,
                showInMenu: IS_MAINNET ? true : false
            },
            {
                label: "statistics",
                icon: `fa fa-chart-pie`,
                path: "/blockchain/stats/:chartName",
                component: SingleChartAsync,
                showInMenu: false
            },
            {
                label: "live",
                icon: `fa fa-bolt`,
                path: "/blockchain/live",
                component: LiveAsync,
                showInMenu: false
            }, // {
            //   label: "inter_tnxl",
            //   icon: `fa fa-random`,
            //   path: "/blockchain/ContractInter",
            //   component: ContractInter,
            //   showInMenu: false
            // },
            {
                path: "/blockchain/foundation",
                label: "foundation",
                icon: "fa fa-address-book",
                showInMenu: IS_MAINNET ? true : false,
                component: FoundationAsync
            }
        ]
    },
]