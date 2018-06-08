import React from "react";
import {filter, flatten} from "lodash";

import Accounts from "./components/Accounts";
import Nodes from "./components/network/Nodes";
import Representatives from "./components/network/Representatives";
import TokensCreate from "./components/tokens/TokenCreate";
import TokenOverview from "./components/tokens/Overview";
import Account from "./components/account/Account";
import Blocks from "./components/blockchain/Blocks";
import Block from "./components/blockchain/Block";
import Transaction from "./components/blockchain/Transaction";
import Address from "./components/addresses/Address";
import Transactions from "./components/blockchain/Transactions";
import TokenDetail from "./components/tokens/TokenDetail";
import Home from "./components/Home";
import Live from "./components/blockchain/Live";
import {
  MarketsAsync,
  StatisticsAsync,
  TransactionViewerAsync,
  VoteLiveAsync,
  VoteOverviewAsync,
  WalletWizardAsync
} from "./components/async";
import TokenList from "./components/tokens/Overview/TokenList";
import Representative from "./components/Representative";
import News from "./components/News";
import NodeTester from "./components/tools/NodeTester";
import System from "./components/tools/System";
import Transfers from "./components/blockchain/Transfers";

export const routes = [
  {
    path: "/blockchain",
    label: "blockchain",
    icon: 'fa fa-link',
    routes: [
      {
        path: "/blockchain/blocks",
        label: "blocks",
        icon: 'fa fa-cubes',
        component: Blocks,
      },
      {
        icon: 'fas fa-handshake',
        path: "/blockchain/transactions",
        label: "transactions",
        component: Transactions,
      },
      {
        icon: 'fa fa-exchange-alt',
        path: "/blockchain/transfers",
        label: "transfers",
        component: Transfers,
      },
      {
        path: "/blockchain/accounts",
        label: "accounts",
        icon: "fa fa-users",
        component: Accounts,
      },
      {
        label: "statistics",
        icon: `fa fa-chart-pie`,
        path: "/blockchain/stats",
        component: StatisticsAsync
      },
      {
        label: "live",
        icon: `fa fa-bolt`,
        path: "/blockchain/live",
        component: Live
      },
    ]
  },
  {
    label: "nodes",
    icon: 'fa fa-server',
    path: "/nodes",
    component: Nodes,
  },
  {
    label: "representatives",
    path: "/representatives",
    icon: "fa fa-rocket",
    component: Representatives
  },
  {
    path: "/block/:id",
    label: "block",
    component: Block,
    showInMenu: false,
  },
  {
    path: "/transaction/:hash",
    label: "transaction",
    component: Transaction,
    showInMenu: false,
  },
  {
    path: "/address/:id",
    label: "address",
    component: Address,
    showInMenu: false,
  },
  {
    path: "/representative/:id",
    label: "representative",
    component: Representative,
    showInMenu: false,
  },
  {
    path: "/tokens",
    label: "tokens",
    icon: "fas fa-coins",
    component: TokenOverview,
    routes: [
      {
        label: "overview",
        path: "/tokens/list",
        icon: 'fa fa-list',
        component: TokenList
      },{
        label: "participate",
        path: "/tokens/view",
        icon: 'fas fa-coins',
        component: TokenOverview
      },{
        label: "create",
        path: "/tokens/create",
        icon: 'fa fa-plus-square',
        component: TokensCreate
      },
    ]
  },
  {
    path: "/token/:name",
    label: "token",
    component: TokenDetail,
    showInMenu: false,
  },
  // {
  //   path: "/accounts",
  //   label: "accounts",
  //   icon: "fa fa-users",
  //   component: Accounts,
  //   routes: [
  //     {
  //       label: "accounts",
  //       path: "/accounts/overview",
  //       component: Accounts
  //     },
  //     {
  //       label: "statistics",
  //       path: "/accounts/stats",
  //       component: Statistics
  //     },
  //   ]
  // },
  // {
  //   path: "/receive",
  //   label: "receive",
  //   component: Receive
  // },
  {
    path: "/markets",
    label: "markets",
    icon: "fa fa-chart-line",
    component: MarketsAsync
  },
  {
    path: "/votes",
    label: "votes",
    icon: 'fas fa-comment',
    component: VoteOverviewAsync
  },
  {
    path: "/votes-live",
    label: "live",
    icon: 'fas fa-comment',
    component: VoteLiveAsync,
    showInMenu: false,
  },
  {
    path: "/account",
    label: "account",
    showInMenu: false,
    component: Account,
  },
  {
    path: "/tools",
    label: "tools",
    icon: "fa fa-wrench",
    routes: [
      {
        label: "transaction viewer",
        path: "/tools/transaction-viewer",
        icon: "fa fa-eye",
        component: TransactionViewerAsync,
      },
      {
        label: "node tester",
        path: "/tools/node-tester",
        icon: "fa fa-server",
        component: NodeTester,
      },
      {
        path: "/tools/system",
        icon: "fa fa-database",
        label: "system",
        component: System
      },
    ]
  },
  {
    path: "/news",
    label: "news",
    icon: "fa fa-newspaper",
    component: News
  },
  {
    path: "/help",
    label: "help",
    icon: "fa fa-question",
    component: null,
    routes: [
      'Tron',
      {
        url: "https://dn-peiwo-web.qbox.me/What_is_TRON1.4.pdf",
        label: "what_is_tron",
      },
      '-',
      "Development",
      {
        url: "https://api.tronscan.org",
        label: "tron_explorer_api"
      },
      {
        url: "https://dn-peiwo-web.qbox.me/Design_Book_of_TRON_Architecture1.4.pdf",
        label: "tron_architechure",
      },
      {
        url: "https://dn-peiwo-web.qbox.me/TRON%20Protobuf%20Protocol%20Document.pdf",
        label: "tron_protobuf_doc",
      },
      '-',
      "Feedback",
      {
        url: "https://github.com/tronscan/tronscan-frontend/issues/new",
        label: "report_an_error",
      },
    ]
  },
  {
    path: "/wallet/new",
    label: "wallet",
    showInMenu: false,
    component: WalletWizardAsync,
  },
  {
    path: "/",
    label: "home",
    showInMenu: false,
    showSubMenu: false,
    showSubHeader: false,
    component: Home,
  },
];

export const flatRoutes = flatten(routes.map(route => [...(route.routes || []), route]));
