import {
    IS_MAINNET
} from "../constants";
import {
    TokenOverviewAsync,
    TokenAllAsync,
    TokensCreateAsync,
    TokensMarketsAddListAsync,
    TokensMarketsCreateAsync,
} from "../components/async";


export const TokensRoutes = [

    {
        path: "/tokens",
        label: "tokens",
        icon: "fas fa-coins",
        component: TokenOverviewAsync,
        routes: [
            // {
            //   label: "overview_TRC20",
            //   path: "/tokens/trc20",
            //   icon: "fas fa-table",
            //   component: TokenTRC20ListAsync
            // },
            // "-",
            // {
            //   label: "overview_TRC10",
            //   path: "/tokens/list",
            //   icon: "fa fa-list",
            //   component: TokenListAsync
            // },
            {
                label: "overview",
                path: "/tokens/list",
                icon: "fa fa-list",
                component: TokenAllAsync
            },
            // {
            //   label: "participate",
            //   path: "/tokens/view",
            //   icon: "fas fa-coins",
            //   component: TokenOverviewAsync,
            //   showInMenu: IS_MAINNET ? true : false
            // },
            {
                label: "token_input",
                path: "/tokens/create",
                icon: "fa fa-plus-square",
                component: TokensCreateAsync,
                showInMenu: IS_MAINNET ? true : false
            },
            {
                path: "/tokens/create/:step",
                component: TokensCreateAsync,
                showInMenu: false
            },
            {
                label: "update_token",
                path: "/tokens/update/:id",
                icon: "fa fa-plus-square",
                component: TokensCreateAsync,
                showInMenu: false
            },
            {
                label: "token_markets_input",
                path: "/tokens/markets/add/:page/:tokenId/:id",
                icon: "fa fa-plus-square",
                component: TokensMarketsAddListAsync,
                showInMenu: false
            },
            {
                label: "token_markets_input",
                path: "/tokens/markets/create/:type/:id",
                icon: "fa fa-plus-square",
                component: TokensMarketsCreateAsync,
                showInMenu: false
            },
            {
                /* Write two is to solve the updated copy */
                label: "token_markets_update",
                path: "/tokens/markets/:page/:type/:id",
                icon: "fa fa-plus-square",
                component: TokensMarketsCreateAsync,
                showInMenu: false
            }
        ]
    },
]