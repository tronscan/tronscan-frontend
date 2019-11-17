import React, { Component } from "react";
import { Form, Input, Button, Radio, Icon, Popover } from "antd";
import { QuestionMark } from "../../../../common/QuestionMark";
import { withRouter } from "react-router";
import { Client, Client20 } from "../../../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { tu } from "../../../../../utils/i18n";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { ONE_TRX } from "../../../../../constants";
import { find } from "lodash";
import { TW } from "../../TW";
import { Slider } from "antd";
import {
  setUpdateTran,
  setUnConfirmOrderObj
} from "../../../../../actions/exchange";

import NumericInput from "./NumericInput";
import {
  getDecimalsNum,
  onlyInputNumAndPoint
} from "../../../../../utils/number";
import { withTronWeb } from "../../../../../utils/tronWeb";
import { fixed } from "../../TokenPre";

const marks = {
  0: "",
  25: "",
  50: "",
  75: "",
  100: ""
};

function formatter(value) {
  return `${value}%`;
}

const FormItem = Form.Item;

@withTronWeb
class Sell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      firstBalance: null,
      secondBalance: null,
      price: 0,
      amount: 0,
      total: 0,
      transTip: false,
      firstError: false,
      secondError: false,
      limitError: "",
      trs_proportion: 0,
      balanceTimer: null,
      buttonLoading: false,
      offlineToken: [30],
      empty: "--"
    };

    this.slideChange = this.slideChange.bind(this);
  }

  componentDidMount() {
    this.setBalance();
    this.getCurrentPrice();
  }

  componentDidUpdate(prevProps) {
    let { price, firstBalance, amount } = this.state;
    let {
      exchangeData,
      quickSelect,
      account,
      is_update_tran,
      currentWallet
    } = this.props;

    if (prevProps.is_update_tran != is_update_tran) {
      let timer = setInterval(() => {
        this.setBalance();
      }, 1000);
      this.setState({
        balanceTimer: timer
      });
      setUpdateTran(!is_update_tran);
    }

    if (
      prevProps.exchangeData != exchangeData &&
      prevProps.exchangeData.id != exchangeData.id
    ) {
      this.setBalance();
      this.getCurrentPrice();
    }

    if (prevProps.account.address != account.address) {
      setInterval(() => {
        this.setBalance();
      }, 1000);

      this.getCurrentPrice();
    }

    if (quickSelect && quickSelect != prevProps.quickSelect && quickSelect.b) {
      let n = quickSelect.b;
      let newPrice = 0;
      let newAmount = "";
      const a_precision = exchangeData.fPrecision
        ? exchangeData.sPrecision - exchangeData.fix_precision
        : 0;
      if (quickSelect.type != "sell") {
        return;
      }

      if (
        !prevProps.quickSelect.price ||
        prevProps.quickSelect.price != n.price
      ) {
        newPrice = fixed(n.price, exchangeData.fix_precision);
        
        if (n.amount <= firstBalance) {
          newAmount = fixed(n.amount, a_precision);
        } else {
          newAmount = fixed(firstBalance, a_precision);
        }

        firstBalance && this.setSlider() && this.transTotal();

        this.setState(
          {
            secondError: "",
            firstError: "",
            price: newPrice,
            amount: n.amount ? newAmount : ""
          },
          () => {
            firstBalance && (this.setSlider() || this.transTotal());
          }
        );

        this.props.form.setFieldsValue({
          first_quant_sell: newPrice,
          second_quant_sell: n.amount ? newAmount : ""
        });
      } else {

        if (n.amount != amount) {
          newPrice = fixed(n.price, exchangeData.fix_precision);

          if (n.amount <= firstBalance) {
            newAmount = fixed(n.amount, a_precision);
          } else {
            newAmount = fixed(firstBalance, a_precision);
          }

          this.setState(
            {
              secondError: "",
              firstError: "",
              price: newPrice,
              amount: n.amount ? newAmount : ""
            },
            () => {
              firstBalance && (this.setSlider() || this.transTotal());
            }
          );

          this.props.form.setFieldsValue({
            first_quant_sell: newPrice,
            second_quant_sell: n.amount ? newAmount : ""
          });
        }
      }
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let {
      exchangeData,
      account,
      intl,
      onSubmit,
      onChange,
      exchangeTransaction
    } = this.props;
    let {
      modal,
      firstBalance,
      total,
      secondError,
      firstError,
      limitError,
      trs_proportion,
      buttonLoading,
      offlineToken
    } = this.state;

    const content = (
      <div style={{ width: 200 }}>
        {intl.formatMessage({
          id: "trc20_vena_tip"
        })}
      </div>
    );

    return (
      <div className="exchange__transaction__item p-3">
        {modal}
        <h5 className="mr-3 exchange__transaction__header">
          <span>{exchangeData.fShortName}</span>
          <span> / {exchangeData.sShortName}</span> ≈{" "}
          {exchangeData.price && (
            <span>{Number(exchangeData.price).toFixed(6)}</span>
          )}
          {/* { (secondBalance&& secondBalance.name)&&<span className=" text-sm d-block">{tu("TxAvailable")} {secondBalance.balance+' '+secondBalance.name}</span>} */}
        </h5>
        <hr />
        <Form layout="vertical">
          <FormItem className="no-padding">
            {getFieldDecorator("first_quant_sell")(
              <NumericInput
                addonBefore={intl.formatMessage({ id: "trc20_price" })}
                addonAfter={exchangeData.sShortName}
                placeholder={intl.formatMessage({
                  id: "trc20_enter_the_trading_price"
                })}
                size="large"
                type="text"
                disabled={!account.address}
                onKeyPress={e => this.onpress(e)}
                onChange={this.handleValueBuy0}
                onFocus={e => this.onfocus(e, 1)}
                onBlur={e => this.onblur(e, 1)}
              />
            )}
            <div className="col-red height24">
              {firstError ? firstError : limitError}
            </div>
          </FormItem>

          <FormItem className="no-padding">
            {getFieldDecorator("second_quant_sell")(
              <NumericInput
                addonBefore={intl.formatMessage({ id: "trc20_amount" })}
                addonAfter={exchangeData.fShortName}
                placeholder={intl.formatMessage({
                  id: "trc20_enter_the_trading_amount"
                })}
                size="large"
                type="text"
                disabled={!account.address}
                onKeyPress={this.onpress}
                onChange={this.handleValueBuy1}
                onFocus={e => this.onfocus(e, 2)}
                onBlur={e => this.onblur(e, 2)}
              />
            )}
            <div className="col-red height24">{secondError}</div>
          </FormItem>
          <div className="mb-3">
            {
              <span>
                {tu("trc20_available_balance")}{" "}
                <span className="tx-question-mark">
                  {firstBalance} {exchangeData.fShortName}
                </span>
              </span>
            }
            {exchangeData.id === 61 && (
              <span style={{ float: "right" }}>
                <Popover content={content} title="">
                  <Icon type="question-circle" />
                </Popover>
              </span>
            )}
          </div>

          <div className="mb-3">
            <Slider
              marks={marks}
              value={trs_proportion}
              defaultValue={0}
              disabled={!account.address}
              tipFormatter={formatter}
              onChange={this.slideChange}
            />
          </div>

          <div className="d-flex justify-content-between tran-amount mb-3">
            <p className="text">
              {tu("trc20_volume")}：{total}
            </p>
            <b className="text-lg">{exchangeData.sShortName}</b>
          </div>

          {/* <FormItem> */}
          <Button
            type="primary"
            className="warning mb-1"
            size="large"
            htmlType="button"
            disabled={
              !account.address || offlineToken.includes(exchangeData.id)
            }
            onClick={this.handleSubmit}
            loading={buttonLoading}
          >
            {tu("trc20_SELL")}&nbsp; {exchangeData.fShortName}
          </Button>
          <div className="txt-center">{tu("trc20_free_orders")}</div>
          {/* </FormItem> */}
        </Form>
      </div>
    );
  }

  handleSubmit = e => {
    let {
      price,
      amount,
      secondError,
      firstError,
      limitError,
      firstBalance
    } = this.state;

    let { intl, exchangeData } = this.props;
    let secondTokenName = exchangeData.sShortName;
    let pairType = exchangeData.pairType;

    if (pairType == 1 || pairType == 2) {
      if (price * amount < 10) {
        this.setState({
          secondError: intl.formatMessage({ id: "trc20_enter_10" })
        });
        return;
      }
    } else {
      if (price * amount < 1) {
        this.setState({
          secondError: intl.formatMessage({ id: "trc20_enter_1" })
        });
        return;
      }
    }

    if (!price || !amount || firstError || secondError || limitError) {
      return;
    }
    if (amount > +firstBalance) {
      this.setState({
        secondError: intl.formatMessage({ id: "trc20_balance_tip" })
      });
      return;
    }
    // if (price * amount < 10) {
    //   this.setState({
    //     limitError: "≥10" + secondTokenName
    //   });
    //   return;
    // }

    //   this.isOrder = true
    this.setState({
      buttonLoading: true
    });
    this.orderSubmit();
  };

  async orderSubmit() {
    let { exchangeData, account } = this.props;
    let { amount, price } = this.state;
    let tokenA = exchangeData.fTokenAddr;
    let tokenB = exchangeData.sTokenAddr;
    let pairType = exchangeData.pairType;

    const firstPrecision = Math.pow(10, exchangeData.fPrecision || 0);
    const secondPrecision = Math.pow(10, exchangeData.sPrecision || 0);
    let amountA = Math.round(amount * firstPrecision);
    // await authorization(this.account.address, tokenA, 0)
    this.transFun(
      amountA,
      tokenA,
      tokenB,
      firstPrecision,
      secondPrecision,
      pairType
    );
  }

  async transFun(
    amountA,
    tokenA,
    tokenB,
    firstPrecision,
    secondPrecision,
    pairType
  ) {
    let { exchangeData, account, walletType } = this.props;
    let { amount, price } = this.state;

    let tronWebOBJ;
    if (walletType.type === "ACCOUNT_LEDGER") {
      tronWebOBJ = this.props.tronWeb();
    } else if (
      walletType.type === "ACCOUNT_TRONLINK" ||
      walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWebOBJ = account.tronWeb;
    }

    const amountB = (amountA * price * secondPrecision) / firstPrecision;
    const data = {
      _user: account.address,
      _tokenA: tokenA,
      _amountA: amountA,
      _price: price * secondPrecision,
      _tokenB: tokenB,
      _amountB: amountB,
      _pairType: pairType,
      tronWeb: tronWebOBJ
    };

    try {
      const id = await TW.sellByContract(data);
      if (id) {
        this.setState({
          modal: (
            <SweetAlert
              success
              title={tu("trc20_order_success")}
              onConfirm={this.hideModal}
            >
              {/* {tu("trc20_trade_win_content")} */}
            </SweetAlert>
          ),
          buttonLoading: false
        });

        this.orderQuickShow(id, data);
      }
      // if (id) {
      //   let _times = 0;
      //   const timer = setInterval(async () => {
      //     const event = await tronWebOBJ
      //       .getEventByTransactionID(id)
      //       .catch(e => {
      //         if (_times > 20) {
      //           clearInterval(timer);
      //           // this.$alert(this.$t("exchange.trade_win.content"), "", {
      //           //   confirmButtonText: this.$t("exchange.trade_win.confirm")
      //           // });
      //           this.setState({
      //             modal: (
      //               <SweetAlert
      //                 error
      //                 title={tu("trc20_trade_win_content")}
      //                 onConfirm={this.hideModal}
      //               >
      //                 {/* {tu("trc20_trade_win_content")} */}
      //               </SweetAlert>
      //             )
      //           });
      //           this.setState({
      //             buttonLoading: false
      //           });
      //         }
      //       });
      //     _times += 1;
      //     if (event.length > 0) {
      //       for (var i = 0; i < event.length; i++) {
      //         const k = event[i];
      //         if (k.name.indexOf("Order") > -1) {
      //           this.setState({
      //             modal: (
      //               <SweetAlert
      //                 success
      //                 title={tu("trc20_order_success")}
      //                 onConfirm={this.hideModal}
      //               >
      //                 {/*{tu("trc20_order_success")}*/}
      //               </SweetAlert>
      //             )
      //           });
      //           this.setBalance();
      //           this.setState({
      //             buttonLoading: false
      //           });

      //           if (k.result && k.result.orderID) {
      //             Client20.addChannelId(
      //               {
      //                 hash: id,
      //                 orderId: k.result.orderID,
      //                 channelId: "10000"
      //               },
      //               {
      //                 Key: "Tron@123456"
      //               }
      //             ).then(res => {});
      //           }
      //           clearInterval(timer);
      //           break;
      //         }
      //       }
      //     } else {
      //       if (_times > 20) {
      //         clearInterval(timer);

      //         this.setState({
      //           modal: (
      //             <SweetAlert
      //               error
      //               title={tu("trc20_trade_win_content")}
      //               onConfirm={this.hideModal}
      //             >
      //               {/* {tu("trc20_trade_win_content")} */}
      //             </SweetAlert>
      //           )
      //         });
      //         this.setState({
      //           buttonLoading: false
      //         });
      //       }
      //     }
      //   }, 1000);
      //   // this.setState({
      //   //   modal: (
      //   //     <SweetAlert
      //   //       success
      //   //       title={tu("trc20_order_success")}
      //   //       onConfirm={this.hideModal}
      //   //     >
      //   //       {/*{tu("trc20_order_success")}*/}
      //   //     </SweetAlert>
      //   //   )
      //   // });
      //   // this.setState({
      //   //   buttonLoading: false
      //   // });
      //   // this.setBalance();

      //   // let timer = setInterval(() => {
      //   //   this.setBalance();
      //   // }, 1000);
      //   // this.setState({
      //   //   balanceTimer: timer
      //   // });
      //   // let tronWeb;
      //   // if (this.props.walletType.type === "ACCOUNT_LEDGER") {
      //   //   tronWeb = this.props.tronWeb();
      //   // } else if (
      //   //   this.props.walletType.type === "ACCOUNT_TRONLINK" ||
      //   //   this.props.walletType.type === "ACCOUNT_PRIVATE_KEY"
      //   // ) {
      //   //   tronWeb = account.tronWeb;
      //   // }

      //   // let _times = 0;
      //   // const timer2 = setInterval(async () => {
      //   //   const info = await tronWeb.trx.getTransactionInfo(id);
      //   //   _times += 1;
      //   //   if (info.log && info.log.length > 0) {
      //   //     let c_id;
      //   //     for (let i = 0; i < info.log.length; i++) {
      //   //       const _addr = tronWeb.address.fromHex("41" + info.log[i].address);
      //   //       if (
      //   //         _addr === "TSMbPm5mUsaTDSEjHCd55ZJaib3Ysvjyc5" ||
      //   //         _addr === "THnCkTX1GfDArAuyzzv2nGpDt4vChm8t2e"
      //   //       ) {
      //   //         c_id = parseInt(
      //   //           info.log[i].data.toString().substring(0, 64),
      //   //           16
      //   //         );
      //   //         clearInterval(timer2);
      //   //         if (c_id) {
      //   //           Client20.addChannelId(
      //   //             {
      //   //               hash: id,
      //   //               orderId: c_id.toString(),
      //   //               channelId: "10000"
      //   //             },
      //   //             {
      //   //               Key: "Tron@123456"
      //   //             }
      //   //           ).then(res => {});
      //   //         }
      //   //         break;
      //   //       }
      //   //     }
      //   //   } else {
      //   //     if (_times > 6) {
      //   //       clearInterval(timer2);
      //   //     }
      //   //   }
      //   // }, 20000);
      // }
    } catch (error) {
      console.log(error);
      //   this.isOrder = false
      this.setState({
        buttonLoading: false
      });

      this.setState({
        modal: (
          <SweetAlert
            error
            title={tu("transaction_error")}
            onConfirm={this.hideModal}
          >
            {tu("trc20_order_fail")}
          </SweetAlert>
        )
      });
    }
  }

  hideModal = () => {
    this.setState({ modal: null });
  };

  async setBalance() {
    let { account, exchangeData, walletType, currentWallet } = this.props;
    let { firstBalance, balanceTimer, empty } = this.state;

    let tronWebOBJ;
    if (walletType.type === "ACCOUNT_LEDGER") {
      tronWebOBJ = this.props.tronWeb();
    } else if (
      walletType.type === "ACCOUNT_TRONLINK" ||
      walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWebOBJ = account.tronWeb;
    }

    // let _b = 0;

    // if (account.address && exchangeData.fTokenAddr) {
    //   if (exchangeData.fTokenAddr === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
    //     _b =
    //       (await tronWebOBJ.trx.getUnconfirmedBalance(this.address)) /
    //       Math.pow(10, exchangeData.fPrecision);
    //   } else {
    //     if (exchangeData.pairType === 1 || exchangeData.pairType === 4) {
    //       if (account.address && exchangeData.fTokenAddr) {
    //         _b = await TW.getV10Balance({
    //           _tokenA: exchangeData.fTokenAddr,
    //           _uToken: account.address,
    //           _precision: exchangeData.fPrecision,
    //           tronWeb: tronWebOBJ
    //         });
    //       }
    //     } else {
    //       if (account.address && exchangeData.fTokenAddr) {
    //         _b = await TW.getBalance({
    //           _tokenA: exchangeData.fTokenAddr,
    //           _uToken: account.address,
    //           _precision: exchangeData.fPrecision,
    //           tronWeb: tronWebOBJ
    //         });
    //       }
    //     }
    //   }
    // }

    // if (_b !== firstBalance) {
    //   clearInterval(balanceTimer);
    //   this.setState({
    //     balanceTimer: null
    //   });
    // }

    let _b = 0;
    if (account.address && exchangeData.fTokenAddr) {
      if (exchangeData.fTokenAddr === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
        _b =
          (await tronWebOBJ.trx.getUnconfirmedBalance(account.address)) /
          Math.pow(10, exchangeData.fPrecision);
        if (exchangeData.fTokenAddr !== "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
          _b = empty;
          return;
        }
      } else {
        if (exchangeData.pairType === 1 || exchangeData.pairType === 4) {
          _b = await TW.getV10Balance({
            _tokenA: exchangeData.fTokenAddr,
            _uToken: account.address,
            _precision: exchangeData.fPrecision,
            tronWeb: tronWebOBJ
          });
        } else {
          _b = await TW.getBalance({
            _tokenA: exchangeData.fTokenAddr,
            _uToken: account.address,
            _precision: exchangeData.fPrecision,
            tronWeb: tronWebOBJ
          });
        }

        if (exchangeData.fTokenAddr === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
          _b = empty;
          return;
        }
      }
    }

    this.setState({
      firstBalance: _b
    });

    // this.setTokenBalance({ b: _b })
  }

  transTotal() {
    let { price, amount } = this.state;
    let { exchangeData } = this.props;
    let total = 0;
    if (!isNaN(+price) && !isNaN(+amount)) {
      total = +price * +amount;
    }
    if (getDecimalsNum(total) > exchangeData.sPrecision) {
      total = total.toFixed(exchangeData.sPrecision);
    }
    this.setState({
      total: total
    });

    return total;
  }

  handleValueBuy0 = value => {
    let { exchangeData } = this.props;
    let { price, firstBalance, amount } = this.state;

    let precision = exchangeData.fix_precision;
    // if (amount) {
    //   const _p = getDecimalsNum(+amount);
    //   precision = precision - _p;
    // }
    let value1 = onlyInputNumAndPoint(value, precision);

    this.setState(
      {
        price: value1
      },
      () => {
        this.props.form.setFieldsValue({
          first_quant_sell: value1
        });
        firstBalance && this.setSlider();
        this.transTotal();
      }
    );
  };

  handleValueBuy1 = value => {
    let { exchangeData } = this.props;
    let { price, firstBalance, amount } = this.state;
    let precision = exchangeData.sPrecision - exchangeData.fix_precision;
    // if (price) {
    //   const _p = getDecimalsNum(+price);

    //   precision = precision - _p;
    // }
    precision =
      precision <= exchangeData.fPrecision
        ? precision
        : exchangeData.fPrecision;

    let value1 = onlyInputNumAndPoint(value, precision);
    if (precision == 0 && value1) {
      value1 = Number(value1);
    }
    // this.setMaxLen(value, precision)
    this.setState(
      {
        amount: value1
      },
      () => {
        this.props.form.setFieldsValue({
          second_quant_sell: value1
        });
        firstBalance && this.setSlider();
        this.transTotal();
      }
    );
  };

  setSlider() {
    let { price, amount, firstBalance } = this.state;
    let trs_proportion = (amount * 100) / firstBalance;

    this.setState({
      trs_proportion: trs_proportion
    });
  }

  onblur(e, type) {
    let { intl, exchangeData } = this.props;
    let { price, amount, firstBalance, transTip } = this.state;
    let firstError, secondError;
    if (!e.target.value) {
      type === 1
        ? (firstError = intl.formatMessage({
            id: "trc20_enter_the_trading_price"
          })) && this.setState({ firstError: firstError })
        : (secondError = intl.formatMessage({
            id: "trc20_enter_the_trading_amount"
          })) && this.setState({ secondError: secondError });
    } else {
      if (amount > firstBalance) {
        secondError = intl.formatMessage({ id: "trc20_balance_tip" });
        this.setState({ secondError: secondError });
      }
      if (
        type === 1 &&
        price >
          (exchangeData.price * 1.1) / Math.pow(10, exchangeData.sPrecision)
      ) {
        // clearTimeout(t);
        let transTip = true;
        const t = setTimeout(() => {
          transTip = false;
          this.setState({
            transTip: transTip
          });
          clearTimeout(t);
        }, 3000);
      }
    }
  }

  onfocus(e, type) {
    type === 1
      ? this.setState({ firstError: "" })
      : this.setState({ secondError: "" });
    this.setState({ limitError: "" });
  }

  onpress(e) {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      e.preventDefault();
    } else {
      return true;
    }
  }

  slideChange(value) {
    let { exchangeData } = this.props;
    let { price, firstBalance } = this.state;
    if (!price) {
      return;
    }

    let precision = exchangeData.sPrecision - exchangeData.fix_precision;
    // if (price) {
    //   const _s = price.toString().split(".")[1];
    //   const _p = (_s && _s.length) || 0;
    //   precision = precision - _p;
    // }
    if (price) {
      precision =
        precision <= exchangeData.fPrecision
          ? precision
          : exchangeData.fPrecision;
    }
    let _a = (firstBalance * value) / 100;
    const _l = getDecimalsNum(_a);
    if (_l <= precision) {
    } else {
      _a = _a.toString();
      _a = Number(_a.substring(0, _a.lastIndexOf(".") + precision + 1));
    }

    this.setState(
      {
        amount: _a,
        secondError: false,
        trs_proportion: value
      },
      () => {
        this.transTotal();
      }
    );

    this.props.form.setFieldsValue({
      second_quant_sell: _a
    });
  }

  getCurrentPrice() {
    let { exchangeData } = this.props;

    if (!exchangeData.id) {
      return;
    }

    let id = exchangeData.id;

    const secondPrecision = Math.pow(10, exchangeData.sPrecision || 8);
    let price = 0;
    Client20.getCurrentPrice(id).then(res => {
      if (res.code === 0 && res.data) {
        if (res.data.buyHighPrice) {
          price = fixed(
            res.data.buyHighPrice / secondPrecision,
            exchangeData.fix_precision
          );
        } else {
          price = fixed(
            exchangeData.price / secondPrecision,
            exchangeData.fix_precision
          );
        }
        this.setState(
          {
            price: price
          },
          () => {
            this.props.form.setFieldsValue({
              first_quant_sell: price
            });
          }
        );
      }
    });
  }
  orderQuickShow(hash, data) {
    const { setUnConfirmOrderObj, exchangeData, account } = this.props;
    const { amount, price } = this.state;
    let confirmObj = {
      fShortName: exchangeData.fShortName,
      sShortName: exchangeData.sShortName,
      orderTime: new Date().getTime(),
      pairType: exchangeData.pairType,
      volume: amount,
      curTurnover: 0,
      price: price,
      hash: hash,
      user: account.address,
      orderStatus: -1,
      transactionType: 1,
      parisId: exchangeData.id,
      created_by: new Date().getTime(),

      transaction_id: hash,
      secondToken: exchangeData.sTokenAddr,
      orderType: 1,
      firstToken: exchangeData.fTokenAddr,
      secondAmount: data._amountB,
      _price: data._price,
      firstAmount: data._amountA,
      transType: 1, // 1限价 0市价
      exchangeId: exchangeData.id,
      parisIdStr: exchangeData.fShortName + "-" + exchangeData.sShortName,
      status: -1,
      schedule: 0
    };

    setUnConfirmOrderObj(confirmObj);
  }
}

function mapStateToProps(state) {
  return {
    exchangeData: state.exchange.data,
    selectStatus: state.exchange.status,
    account: state.app.account,
    currentWallet: state.wallet.current,
    activeLanguage: state.app.activeLanguage,
    quickSelect: state.exchange.quick_select ? state.exchange.quick_select : {},
    is_update_tran: state.exchange.is_update_tran
      ? state.exchange.is_update_tran
      : false,
    walletType: state.app.wallet,
    unConfirmOrderList: state.exchange.unConfirmOrderList
  };
}

const mapDispatchToProps = {
  setUpdateTran,
  setUnConfirmOrderObj
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Form.create()(withRouter(Sell))));
