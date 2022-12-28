import React from "react";
import {TronLoader} from "../../common/loaders";
import {tu} from "../../../utils/i18n";
import loadable from "@/utils/loadable"


export const NodeMapAsync = 
  loadable(() => import(/* webpackChunkName: "NodeMap" */ './NodeMap'), () =>{
    return (<div className="card">
    <TronLoader>
      {tu("loading_map")}
    </TronLoader>
  </div>)
  })
