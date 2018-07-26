import React from "react";
import {asyncComponent} from "react-async-component";
import {TronLoader} from "./common/loaders";


const $script = require("scriptjs");

export const StatisticsAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./blockchain/Statistics/index.js"));
            });
          },
          'Stats',
      )
  )
});

export const SingleChartAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./blockchain/Statistics/SingleChart.js"));
            });
          },
          'SingleStats',
      )
  )
});

export const MarketsAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./markets"));
            });
          },
          'Markets',
      )
  )
});


export const WalletWizardAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./wallet/Wizard"));
            });
          },
          'WalletWizard',
      )
  )
});


export const TransactionViewerAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tools/TransactionViewer"));
            });
          },
          'TransactionViewer',
      )
  )
});


export const VoteOverviewAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./voting/VoteOverview"));
            });
          },
          'VoteOverview',
      )
  )
});


export const VoteLiveAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./voting/VoteLive"));
            });
          },
          'VoteLive',
      )
  )
});


export const RepresentativesAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./representatives/Representatives"));
            });
          },
          'Representatives',
      )
  )
});

export const AccountAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./account/Account"));
            });
          },
          'Account',
      )
  )
});

export const NodeTesterAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tools/NodeTester/index"));
            });
          },
          'NodeTester',
      )
  )
});

export const SystemAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tools/System"));
            });
          },
          'System',
      )
  )
});

export const DemoAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./Demo"));
            });
          },
          'DemoAsync',
      )
  )
});

export const FaqAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./Pages/Faq"));
            });
          },
          'FaqAsync',
      )
  )
});

export const LedgerHelpAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./Pages/LedgerHelp"));
            });
          },
          'LedgerHelp',
      )
  )
});

export const NewsAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./Pages/News"));
            });
          },
          'News',
      )
  )
});

export const TokenOverviewAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tokens/Overview/index"));
            });
          },
          'TokenOverview',
      )
  )
});

export const TokenListAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tokens/Overview/TokenList"));
            });
          },
          'TokenList',
      )
  )
});

export const TokensCreateAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tokens/TokenCreate"));
            });
          },
          'TokensCreate',
      )
  )
});



export const AccountsAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./Accounts"));
            });
          },
          'Accounts',
      )
  )
});

export const NodesAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./network/Nodes"));
            });
          },
          'Nodes',
      )
  )
});

export const LiveAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./blockchain/Live"));
            });
          },
          'Live',
      )
  )
});

export const TokenDetailAsync = asyncComponent({
  LoadingComponent: () => (
      <TronLoader/>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("", () => {
              resolve(require("./tokens/TokenDetail/index"));
            });
          },
          'TokenDetail',
      )
  )
});

