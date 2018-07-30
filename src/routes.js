import React from "react";
import {filter, flatten} from "lodash";
import Block from "./components/blockchain/Block";
import Transaction from "./components/blockchain/Transaction";
import Address from "./components/addresses/Address";
import Home from "./components/Home";
import {
  MarketsAsync,
  StatisticsAsync,
  SingleChartAsync,
  TransactionViewerAsync,
  VoteLiveAsync,
  VoteOverviewAsync,
  WalletWizardAsync,
  RepresentativesAsync,
  AccountAsync,
  NodeTesterAsync,
  SystemAsync,
  DemoAsync,
  FaqAsync,
  LedgerHelpAsync,
  NewsAsync,
  TokenOverviewAsync,
  TokenListAsync,
  TokensCreateAsync,
  AccountsAsync,
  NodesAsync,
  LiveAsync,
  TokenDetailAsync
} from "./components/async";
import Blocks from "./components/blockchain/Blocks";
import Transactions from "./components/blockchain/Transactions";
import Transfers from "./components/blockchain/Transfers";
import InterTnxl from "./components/blockchain/Contractinter";
import Representative from "./components/representatives/representative";
import {Redirect} from "react-router-dom";

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
        component: Transactions
      },
      {
        icon: 'fas fa-handshake',
        path: "/blockchain/transactions/:date",
        label: "daily_transactions",
        component: Transactions,
        showInMenu: false
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
        component: AccountsAsync,
      },
      {
        label: "statistics",
        icon: `fa fa-chart-pie`,
        path: "/blockchain/stats",
        component: StatisticsAsync
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
        component: LiveAsync
      },
      {
        label: "inter_tnxl",
        icon: `fa fa-random`,
        path: "/blockchain/Contractinter",
        component: InterTnxl
      }

    ]
  },
  {
    label: "nodes",
    icon: 'fa fa-server',
    path: "/nodes",
    component: NodesAsync,
  },
  {
    label: "representatives",
    path: "/representatives",
    icon: "fa fa-rocket",
    component: RepresentativesAsync
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
    component: TokenOverviewAsync,
    routes: [
      {
        label: "overview",
        path: "/tokens/list",
        icon: 'fa fa-list',
        component: TokenListAsync
      },{
        label: "participate",
        path: "/tokens/view",
        icon: 'fas fa-coins',
        component: TokenOverviewAsync
      },{
        label: "create",
        path: "/tokens/create",
        icon: 'fa fa-plus-square',
        component: TokensCreateAsync
      },
    ]
  },
  {
    path: "/token/:name",
    label: "token",
    component: TokenDetailAsync,
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
    component: AccountAsync,
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
        component: NodeTesterAsync,
      },
      {
        path: "/tools/system",
        icon: "fa fa-database",
        label: "system",
        component: SystemAsync
      },
      {
        url: "https://github.com/tronscan/tronscan-desktop/releases",
        icon: "fa fa-download",
        label: "desktop_explorer"
      },
      {
        url: "https://test.tronscan.org/#/",
        icon: "fa fa-link",
        label: "link_test_server"
      }
    ]
  },
  {
    path: "/news",
    label: "news",
    icon: "fa fa-newspaper",
    component: NewsAsync
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
        component: FaqAsync,
        path: "/help/faq",
      },
      {
        label: "Ledger",
        component: LedgerHelpAsync,
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
    path: "/demo",
    label: "demo",
    showInMenu: false,
    showSubMenu: false,
    showSubHeader: false,
    component: DemoAsync,
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
