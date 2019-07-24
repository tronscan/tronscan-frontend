import React from "react";
import loadable from "@/utils/loadable"
const $script = require("scriptjs");
;


export const RecaptchaAsync = new Promise(resolve => {
  $script("https://www.google.com/recaptcha/api.js", () => {
    resolve(loadable(import(/* webpackChunkName: "Recaptcha" */ './Recaptcha'), () => <span></span>))
  });
})
