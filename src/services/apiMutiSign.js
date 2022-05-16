import xhr from "axios";
import config from '../config/main.config.js'

export async function postMutiSignTransaction(address,transaction){
    let netType='shasta';
    if(config.curEnv==='production'){
        netType='shasta'
    }else if(config.curEnv==='development'){
        netType='shasta'
    }else{
        netType='shasta'
    }
    let { data } = await xhr.post(config.api.mutiSign.apiPostMutiSignedTansaction, {
                    "address": address,
                    "transaction": transaction,
                    "netType":netType
                });
     return data;            
}