import React from 'react';
import Loadable from 'react-loadable';
import { TronLoader } from "components/common/loaders";

export default (loader,loading = TronLoader)=>{
    return Loadable({
        loader: loader,
        loading
    });
}