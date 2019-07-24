import loadable from "@/utils/loadable";

export const AddSignatureModalAsync = 
  loadable(() => import(/* webpackChunkName: "AddSignatureModal" */ './AddSignatureModal'))
