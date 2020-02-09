import xhr from "axios";
import config from '../config/main.config.js'

export async function postMutiSignTransaction(address,transaction){
    let netType='shasta';
    if(config.curEnv==='production'){
        netType='main_net'
    }else if(config.curEnv==='development'){
        netType='main_net'
    }else{
        netType='main_net'
    }
    let { data } = await xhr.post(config.api.mutiSign.apiPostMutiSignedTansaction, {
                    "address": address,
                    "transaction": transaction,
                    "netType":netType
                });
     return data;            
}