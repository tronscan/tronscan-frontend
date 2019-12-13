import xhr from "axios";
import config from '../config/main.config.js'

export async function postMutiSignTransaction(address,transaction,functionSelector){
    let netType='shasta';
    console.log('config.curEnv',config.curEnv);
    if(config.curEnv==='production'){
        netType='main_net'
    }else if(config.curEnv==='development'){
        netType='shasta'
    }else{
        netType='shasta'
    }
    let postData = {address,transaction,netType};
    if(functionSelector){
        postData = {...postData,functionSelector};
    }
    let { data } = await xhr.post(config.api.mutiSign.apiPostMutiSignedTansaction, postData);
     return data;            
}