import React from "react";
import {asyncComponent} from "react-async-component";
import {TronLoader} from "../common/loaders";

export const LedgerAsync = asyncComponent({
  LoadingComponent: () => (
    <TronLoader />
  ),
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        resolve(require("./index"));
      },
      'LedgerAsync',
    )
  )
});
