import xhr from "axios/index";

class ApiClient {
    constructor(){
        super()
    }

    async getRegisterList(id) {
        let {data}  = await xhr.get(`https://trx.market/dex/exchange/common/orderList/${id}`);

        return data;
    }

}


export default ApiClient