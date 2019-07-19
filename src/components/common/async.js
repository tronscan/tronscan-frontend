import React from "react";
import {asyncComponent} from "react-async-component";

const $script = require("scriptjs");


export const RecaptchaAsync = asyncComponent({
  LoadingComponent: () => (
      <span></span>
  ),
  resolve: () => new Promise(resolve =>
      // Webpack's code splitting API w/naming
      require.ensure(
          [],
          (require) => {
            $script("https://www.google.com/recaptcha/api.js", () => {
              resolve(require("./Recaptcha"));
            });

          },
          'Recaptcha',
      )
  )
});
