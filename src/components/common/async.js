import React from "react";
import loadable from "@/utils/loadable"
const $script = require("scriptjs");
;


export const RecaptchaAsync = loadable(() => import(/* webpackChunkName: "Recaptcha" */ './Recaptcha'), () => <span></span>)
