import React from "react";
import {asyncComponent} from "react-async-component";
import {TronLoader} from "../../common/loaders";

const $script = require("scriptjs");


export const NodeMapAsync = asyncComponent({
  LoadingComponent: () => (
    <div className="card">
      <TronLoader>
        Loading Map
      </TronLoader>
    </div>
  ),
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        $script("https://maps.googleapis.com/maps/api/js?key=AIzaSyBzZaa22a_zmiWZA-TBjf2Jsr3zqx_GYpI", () => {
          resolve(require('./NodeMap'));
        });
      },
      'NodeMap'
    )
  )
});

export const GlobeMapAsync = asyncComponent({
  LoadingComponent: () => (
    <div className="card">
      <TronLoader>
        Loading Map
      </TronLoader>
    </div>
  ),
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        resolve(require('./GlobeMap'));
      },
      'GlobeMap'
    )
  )
});
