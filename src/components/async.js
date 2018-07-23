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
              resolve(require("./blockchain/Statistics"));
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
