import React from "react";
import {asyncComponent} from "react-async-component";
import {PropagateLoader} from "../../common/loaders";

export default asyncComponent({
  LoadingComponent: () => (
    <div className="col-sm-12 col-md-8 d-flex justify-content-center p-5">
      <PropagateLoader />
    </div>
  ),
  resolve: () => new Promise(resolve =>
    // Webpack's code splitting API w/naming
    require.ensure(
      [],
      (require) => {
        resolve(require('./NodeMap'));
      },
      'NodeMap'
    )
  )
});
