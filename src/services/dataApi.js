import { API_URL_SUNNET, API_URL, IS_MAINNET } from "../constants.js";
import xhr from "axios/index";
class ApiClientData {
  constructor() {
    this.apiUrl = {
      url: IS_MAINNET ? API_URL : API_URL_SUNNET
    };
  }

  // type说明：
  // 1：发送trx总数
  // 2: 发送trx总笔数
  // 3: 接收trx总额
  // 4: 接收trx总笔数
  // 5：冻结trx总额
  // 6: 投票数
  // 7: token持有账户数
  // 8: token交易账户数
  // 9: token交易总笔数
  // 10:token交易总额
  // 11:合约trx总余额
  // 12:合约调用账户数
  // 13:合约调用次数
  // time说明：
  // 0: 没有时间范围
  // 1: 小时
  // 2：天
  // 3：周
  async getTop10Data(params) {
    let { data } = await xhr.get(`${this.apiUrl.url}/api/top10`, {
      params: params
    });
    return data;
  }
}

export default new ApiClientData();
