import React from "react";
import {
    Redirect
} from "react-router-dom";
import {
    Contracts,
    ContractTrans,
    ContractCompilerAsync,
    ContractSourceCode,
    ContractUseServiceTerms,
    ContractLicense
} from "../components/async";
import {
    IS_MAINNET
} from "../constants";
export const ContractRoutes = [{
    path: "/contracts",
    label: "contracts",
    icon: "fa fa-file-contract",
    component: () => < Redirect to = "/contracts/contracts" / > ,
    routes: [{
            label: "contracts",
            icon: "fa fa-file",
            path: "/contracts/contracts",
            component: Contracts
        },
        {
            path: "/contracts/contract-triggers",
            label: "trigger",
            icon: "fa fa-users-cog",
            component: ContractTrans
        },
        {
            path: "/contracts/contract-compiler",
            label: "contract_deployment",
            icon: "fas fa-file-signature",
            component: ContractCompilerAsync,
            showInMenu: IS_MAINNET ? true : false
        },
        {
            path: "/contracts/contract-compiler/:type",
            label: "contract_verification",
            icon: "fas fa-file-signature",
            component: ContractCompilerAsync,
            showInMenu: false
        },
        {
            label: "contracts_source-code-usage-terms",
            icon: "fa fa-file",
            path: "/contracts/source-code-usage-terms",
            component: ContractSourceCode,
            showInMenu: false
        },
        {
            label: "contracts_terms",
            icon: "fa fa-file",
            path: "/contracts/terms",
            component: ContractUseServiceTerms,
            showInMenu: false
        },
        {
            label: "contracts_license",
            icon: "fa fa-file",
            path: "/contracts/license",
            component: ContractLicense,
            showInMenu: false
        }
    ]
}, ]