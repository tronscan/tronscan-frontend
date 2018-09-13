import React from "react";
import {asyncComponent} from "react-async-component";

export const AddSignatureModalAsync = asyncComponent({
  LoadingComponent: () => (
      null
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            resolve(require("./AddSignatureModal"));
          },
          'AddSignatureModal',
      )
  )
});
