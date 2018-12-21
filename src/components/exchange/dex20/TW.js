import { connect } from "react-redux";
import { injectIntl } from "react-intl";
// const contranctAddress = "TGq7uRgKED5G8kYpEoQybR9p9xtcVa5GTD"; //'TFFzJbnqNuochqPQtLrJgtJ695aRakfKiW' //'TPXkfbV6tdvbWt5vA261yNC3NCR6QHsrQe'
// /**
//  * 获取合约
//  */
// export async function getContract() {
//   return await window.tronWeb.contract().at(contranctAddress);
//   // return await tronWeb.contract().at(contranctAddress)
// }

// /**
//  * 撤单
//  */
// export async function cancelOrder(_id) {
//   const contract = await getContract();

//   const transactionID = contract
//     .cancelOrder(_id)
//     .send()
//     .catch(e => {});
//   return transactionID;
// }

/**
 * 获取token余额
 */

// export async function getBalance({ _tokenA, _uToken, _precision }) {
//   const contractInstance = await window.tronWeb.contract().at(_tokenA);

//   const _b = await contractInstance
//     .balanceOf(_uToken)
//     .call()
//     .catch(e => {});
//   let balance = 0;
//   if (_b.balance) {
//     balance = _b.balance.toString();
//   } else {
//     balance = _b.toString();
//   }
//   return balance / Math.pow(10, _precision) || 0;
// }

/**
 * 买单
 */
// export async function buyByContract({ _user, _tokenA, _amountA, _tokenB, _price, _amountB, tronweb }) {
//          let allowAmount = false;
//          let callValue = 0;
//          if (_tokenB === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
//            // _tokenB = '410000000000000000000000000000000000000000'
//            allowAmount = true;
//            callValue = Math.round(_amountB);
//          } else {
//            allowAmount = await authorization(_user, _tokenB, Math.round(_amountB));
//          }
//          if (!allowAmount) return;
//          const _c = await getContract(tronweb);
//          const transactionID = _c
//            .buyOrder(
//              _tokenA,
//              Math.round(_amountA).toString(),
//              _tokenB,
//              Math.round(_amountB),
//              Math.round(_price)
//            )
//            .send({
//              callValue: callValue,
//              shouldPollResponse: false
//            });
//          return transactionID;
//        }
// /**
//  * 卖单
//  */
// export async function sellByContract({
//   _user,
//   _tokenA,
//   _amountA,
//   _tokenB,
//   _price,
//   _amountB
// }) {
//   let allowAmount = await authorization(_user, _tokenA, Math.round(_amountA));
//   if (!allowAmount) return;
//   const transactionID = (await getContract())
//     .sellOrder(
//       _tokenA,
//       Math.round(_amountA).toString(),
//       _tokenB,
//       Math.round(_amountB),
//       Math.round(_price)
//     )
//     .send();
//   // const transactionID = (await getContract()).sellOrder
//   return transactionID;
// }

// /**
//  * 授权
//  */
// export async function authorization(_user, _tokenA, _amountA) {
//   const newContract = await window.tronWeb.contract().at(_tokenA);
//   // const newContract = await tronWeb.contract().at(_tokenA)

//   const transactionID = await newContract
//     .approve(contranctAddress, _amountA.toString())
//     .send();

//   if (transactionID) {
//     let allowAmount = await newContract
//       .allowance(_user, contranctAddress)
//       .call();
//     if (allowAmount.remaining) {
//       allowAmount = allowAmount.remaining.toString();
//     } else {
//       allowAmount = allowAmount.toString();
//     }
//     return allowAmount;
//   }
// }

class ApiTW {
  constructor() {
    this.contranctAddress = "TGq7uRgKED5G8kYpEoQybR9p9xtcVa5GTD";
  }

  /**
   * 获取合约
   */
  async getContract(tronWeb) {
    return await tronWeb.contract().at(this.contranctAddress);
    // return await tronWeb.contract().at(contranctAddress)
  }

  /**
   * 撤单
   */
  async cancelOrder(_id, tronWeb) {
    const contract = await this.getContract(tronWeb);

    const transactionID = contract
      .cancelOrder(_id)
      .send()
      .catch(e => {});
    return transactionID;
  }

  /**
   * 获取token余额
   */

  async getBalance({ _tokenA, _uToken, _precision, tronWeb }) {
    const contractInstance = await tronWeb.contract().at(_tokenA);

    const _b = await contractInstance
      .balanceOf(_uToken)
      .call()
      .catch(e => {});
    let balance = 0;
    if (_b.balance) {
      balance = _b.balance.toString();
    } else {
      balance = _b.toString();
    }
    return balance / Math.pow(10, _precision) || 0;
  }

  /**
   * 买单
   */
  async buyByContract({
    _user,
    _tokenA,
    _amountA,
    _tokenB,
    _price,
    _amountB,
    tronWeb
  }) {
    let allowAmount = false;
    let callValue = 0;

    if (_tokenB === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
      // _tokenB = '410000000000000000000000000000000000000000'
      allowAmount = true;
      callValue = Math.round(_amountB);
    } else {
      allowAmount = await this.authorization(
        _user,
        _tokenB,
        Math.round(_amountB),
        tronWeb,
        tronWeb
      );
    }
    if (!allowAmount) return;
    const _c = await this.getContract(tronWeb);
    const transactionID = _c
      .buyOrder(
        _tokenA,
        Math.round(_amountA).toString(),
        _tokenB,
        Math.round(_amountB),
        Math.round(_price)
      )
      .send({
        callValue: callValue,
        shouldPollResponse: false
      });

    return transactionID;
  }
  /**
   * 卖单
   */
  async sellByContract({
    _user,
    _tokenA,
    _amountA,
    _tokenB,
    _price,
    _amountB,
    tronWeb
  }) {
    let allowAmount = await this.authorization(
      _user,
      _tokenA,
      Math.round(_amountA),
      tronWeb
    );
    if (!allowAmount) return;
    const transactionID = (await this.getContract(tronWeb))
      .sellOrder(
        _tokenA,
        Math.round(_amountA).toString(),
        _tokenB,
        Math.round(_amountB),
        Math.round(_price)
      )
      .send();
    // const transactionID = (await getContract()).sellOrder
    return transactionID;
  }

  /**
   * 授权
   */
  async authorization(_user, _tokenA, _amountA, tronWeb) {
    const newContract = await tronWeb.contract().at(_tokenA);
    // const newContract = await tronWeb.contract().at(_tokenA)

    const transactionID = await newContract
      .approve(this.contranctAddress, _amountA.toString())
      .send();

    if (transactionID) {
      let allowAmount = await newContract
        .allowance(_user, this.contranctAddress)
        .call();
      if (allowAmount.remaining) {
        allowAmount = allowAmount.remaining.toString();
      } else {
        allowAmount = allowAmount.toString();
      }
      return allowAmount;
    }
  }
}

export const TW = new ApiTW();
