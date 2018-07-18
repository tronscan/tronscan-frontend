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
import News from "./components/Pages/News";
import NodeTester from "./components/tools/NodeTester";
import System from "./components/tools/System";
import Transfers from "./components/blockchain/Transfers";
import {Redirect} from "react-router-dom";
import OpenWallet from "./components/wallet/Access/index";
import Faq from "./components/Pages/Faq";
import {IS_DESKTOP} from "./constants";
import LedgerHelp from "./components/Pages/LedgerHelp";

export const routes = [
  {
    path: "/blockchain",
    label: "blockchain",
    icon: 'fa fa-link',
    component: () => <Redirect to="/blockchain/blocks" />,
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
        label: "transaction_viewer",
        path: "/tools/transaction-viewer",
        icon: "fa fa-eye",
        component: TransactionViewerAsync,
      },
      {
        label: "node_tester",
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
    path: "/help",
    label: "help",
    icon: "fa fa-question",
    component: null,
    routes: [
      'TRON',
      {
        url: "https://dn-peiwo-web.qbox.me/What_is_TRON1.4.pdf",
        label: "what_is_tron",
      },
      '-',
      'Tronscan',
      {
        label: "frequently_asked_questions",
        component: Faq,
        path: "/help/faq",
      },
      {
        label: "Ledger",
        component: LedgerHelp,
        path: "/help/ledger",
      },
      {
        url: "https://t.me/tronscan",
        label: "telegram_updates",
      },
      '-',
      "Community",
      {
        url: "https://www.reddit.com/r/tronix",
        label: "reddit",
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
    path: "/wallet/open",
    label: "open wallet",
    showInMenu: false,
    component: OpenWallet,
  },
];

if (!IS_DESKTOP) {
  routes.push({
    path: "/representative/:id",
    label: "representative",
    component: Representative,
    showInMenu: false,
  });

  routes.push({
    path: "/news",
    label: "news",
    icon: "fa fa-newspaper",
    component: News
  });
}

routes.push({
  path: "/",
  label: "home",
  showInMenu: false,
  showSubMenu: false,
  showSubHeader: false,
  component: Home,
});

export const flatRoutes = flatten(routes.map(route => [...(route.routes || []), route]));
