import React, { Component } from "react";
import { Button, Form, Slider } from "antd";
import { withRouter } from "react-router";
import { Client20 } from "../../../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { tu } from "../../../../../utils/i18n";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { TW } from "../../TW";
import { setUpdateTran } from "../../../../../actions/exchange";

import NumericInput from "./NumericInput";
import {
  getDecimalsNum,
  onlyInputNumAndPoint
} from "../../../../../utils/number";
import { withTronWeb } from "../../../../../utils/tronWeb";

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
class Buy extends Component {
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
      offlineToken: [30]
    };

    this.slideChange = this.slideChange.bind(this);
  }

  componentDidMount() {
    this.setBalance();
    this.getCurrentPrice();
  }

  componentDidUpdate(prevProps) {
    let { price, firstBalance, amount, balanceTimer } = this.state;
    let { exchangeData, quickSelect, account, is_update_tran } = this.props;

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
      this.setBalance();
      this.getCurrentPrice();
    }

    if (quickSelect && quickSelect != prevProps.quickSelect && quickSelect.b) {
      let n = quickSelect.b;
      let newPrice = 0;
      let newAmount = 0;
      if (quickSelect.type != "buy") {
        return;
      }

      if (
        !prevProps.quickSelect.price ||
        prevProps.quickSelect.price != n.price
      ) {
        newPrice = n.price;
        if (n.amount * n.price <= firstBalance) {
          newAmount = n.amount;
        } else {
          newAmount = parseInt(firstBalance / n.price);
        }

        firstBalance && this.setSlider() && this.transTotal();
        this.setState(
          {
            secondError: "",
            firstError: "",
            price: newPrice,
            amount: newAmount
          },
          () => {
            firstBalance && (this.setSlider() || this.transTotal());
          }
        );

        this.props.form.setFieldsValue({
          first_quant_buy: newPrice,
          second_quant_buy: newAmount
        });
      } else {
        if (n.amount != amount) {
          newPrice = n.price;

          if (n.amount * n.price <= firstBalance) {
            newAmount = n.amount;
          } else {
            newAmount = parseInt(firstBalance / n.price);
          }

          this.setState(
            {
              secondError: "",
              firstError: "",
              price: newPrice,
              amount: newAmount
            },
            () => {
              firstBalance && (this.setSlider() || this.transTotal());
            }
          );

          this.props.form.setFieldsValue({
            first_quant_buy: newPrice,
            second_quant_buy: newAmount
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

    return (
      <div className="exchange__transaction__item mr-2 p-3">
        {modal}
        <h5 className="mr-3">
          {exchangeData.fShortName}/{exchangeData.sShortName} ≈{" "}
          {exchangeData.price && (
            <span>{Number(exchangeData.price).toFixed(6)}</span>
          )}
          {/* { (secondBalance&& secondBalance.name)&&<span className=" text-sm d-block">{tu("TxAvailable")} {secondBalance.balance+' '+secondBalance.name}</span>} */}
        </h5>
        <hr />
        <Form layout="vertical">
          <FormItem className="no-padding">
            {getFieldDecorator("first_quant_buy")(
              <NumericInput
                addonBefore={intl.formatMessage({ id: "trc20_price" })}
                addonAfter={exchangeData.sShortName}
                placeholder={intl.formatMessage({
                  id: "trc20_enter_the_trading_price"
                })}
                size="large"
                type="text"
                maxLength="10"
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
            {getFieldDecorator("second_quant_buy")(
              <NumericInput
                addonBefore={intl.formatMessage({ id: "trc20_amount" })}
                addonAfter={exchangeData.fShortName}
                placeholder={intl.formatMessage({
                  id: "trc20_enter_the_trading_amount"
                })}
                size="large"
                type="text"
                maxLength="20"
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
                  {account.address ? firstBalance : 0} {exchangeData.sShortName}
                </span>
              </span>
            }
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
            className="success mb-1"
            size="large"
            htmlType="button"
            disabled={
              !account.address || offlineToken.includes(exchangeData.id)
            }
            onClick={this.handleSubmit}
            loading={buttonLoading}
          >
            {tu("BUY")} &nbsp;{exchangeData.fShortName}
          </Button>
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
      buttonLoading
    } = this.state;
    let { intl, exchangeData } = this.props;
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
    if (price * amount > this.balance) {
      this.setState({
        secondError: intl.formatMessage({ id: "trc20_balance_tip" })
      });
      return;
    }
    if (!amount) {
      this.setState({
        secondError: intl.formatMessage({
          id: "trc20_enter_the_trading_amount"
        })
      });
      return;
    }
    //   this.isOrder = true
    this.setState({
      buttonLoading: true
    });
    this.orderSubmit();
  };

  async orderSubmit() {
    let { exchangeData, account } = this.props;
    let { amount, price, balanceTimer } = this.state;
    let tokenA = exchangeData.fTokenAddr;
    let tokenB = exchangeData.sTokenAddr;
    let pairType = exchangeData.pairType;
    let tronWeb;
    if (this.props.walletType.type === "ACCOUNT_LEDGER") {
      tronWeb = this.props.tronWeb();
    } else if (
      this.props.walletType.type === "ACCOUNT_TRONLINK" ||
      this.props.walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWeb = account.tronWeb;
    }
    const firstPrecision = Math.pow(10, exchangeData.fPrecision || 8);
    const secondPrecision = Math.pow(10, exchangeData.sPrecision || 8);

    const data = {
      _user: account.address,
      _tokenA: tokenA,
      _amountA: amount * firstPrecision,
      _tokenB: tokenB,
      _price: price * secondPrecision,
      _amountB: amount * price * secondPrecision,
      _pairType: pairType,
      tronWeb: tronWeb
    };

    let id;
    try {
      id = await TW.buyByContract(data);
 
      if (id) {
        this.setState({
          modal: (
            <SweetAlert
              success
              title={tu("trc20_order_success")}
              onConfirm={this.hideModal}
            >
              {/*{tu("trc20_order_success")}*/}
            </SweetAlert>
          )
        });

        this.setBalance();
        this.setState({
          buttonLoading: false
        });

        let timer = setInterval(() => {
          this.setBalance();
        }, 1000);
        this.setState({
          balanceTimer: timer
        });
        let _times = 0;

        let { account } = this.props;
        let tronWeb;
        if (this.props.walletType.type === "ACCOUNT_LEDGER") {
          tronWeb = this.props.tronWeb();
        } else if (
          this.props.walletType.type === "ACCOUNT_TRONLINK" ||
          this.props.walletType.type === "ACCOUNT_PRIVATE_KEY"
        ) {
          tronWeb = account.tronWeb;
        }
        const timer2 = setInterval(async () => {
          const info = await tronWeb.trx.getTransactionInfo(id);
          _times += 1;
          if (info.log && info.log[0].data) {
            const c_id = parseInt(
              info.log[0].data.toString().substring(0, 64),
              16
            );
            clearInterval(timer2);
            if (c_id) {
              Client20.addChannelId(
                {
                  hash: id,
                  orderId: c_id.toString(),
                  channelId: "10000"
                },
                {
                  Key: "Tron@123456"
                }
              ).then(res => {});
            }
          } else {
            if (_times > 6) {
              clearInterval(timer2);
            }
          }
        }, 20000);
      }
    } catch (error) {
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
    let { account, exchangeData } = this.props;
    let { firstBalance, balanceTimer } = this.state;
    let tronWeb;
    if (this.props.walletType.type === "ACCOUNT_LEDGER") {
      tronWeb = this.props.tronWeb();
    } else if (
      this.props.walletType.type === "ACCOUNT_TRONLINK" ||
      this.props.walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWeb = account.tronWeb;
    }

    let _b = 0;
    if (account.address && exchangeData.sTokenAddr) {
      if (exchangeData.sTokenAddr === "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb") {
        _b =
          (await tronWeb.trx.getUnconfirmedBalance(account.address)) /
          Math.pow(10, exchangeData.sPrecision);
      } else {
        _b = await TW.getBalance({
          _tokenA: exchangeData.sTokenAddr,
          _uToken: account.address,
          _precision: exchangeData.sPrecision,
          tronWeb: tronWeb
        });
      }
    }
    if (_b != firstBalance) {
      clearInterval(balanceTimer);
      this.setState({
        balanceTimer: null
      });
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

    let precision = exchangeData.sPrecision;
    if (amount) {
      const _p = getDecimalsNum(+amount);
      precision = precision - _p;
    }
    let value1 = onlyInputNumAndPoint(value, precision);

    this.setState(
      {
        price: value1
      },
      () => {
        this.props.form.setFieldsValue({
          first_quant_buy: value1
        });
        firstBalance && this.setSlider();
        this.transTotal();
      }
    );
  };

  handleValueBuy1 = value => {
    let { exchangeData } = this.props;
    let { price, firstBalance, amount } = this.state;
    let precision = exchangeData.sPrecision;
    if (price) {
      const _p = getDecimalsNum(+price);

      precision = precision - _p;
    }
    let value1 = onlyInputNumAndPoint(value, precision);
    // this.setMaxLen(value, precision)
    this.setState(
      {
        amount: value1
      },
      () => {
        this.props.form.setFieldsValue({
          second_quant_buy: value1
        });
        firstBalance && this.setSlider();
        this.transTotal();
      }
    );
  };

  setSlider() {
    let { price, amount, firstBalance } = this.state;
    let trs_proportion = (price * amount * 100) / firstBalance;

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
      if (price * amount > firstBalance) {
        secondError = intl.formatMessage({ id: "trc20_balance_tip" });
        this.setState({ secondError: secondError });
      }
      if (
        type === 1 &&
        price >
          (exchangeData.price * 1.1) / Math.pow(10, exchangeData.sPrecision)
      ) {
        clearTimeout(t);
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
    let precision = exchangeData.sPrecision;
    if (price) {
      const _s = price.toString().split(".")[1];
      const _p = (_s && _s.length) || 0;
      precision = precision - _p;
    }
    let _a = (firstBalance * value) / (100 * price);
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
      second_quant_buy: _a
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
        if (res.data.sellLowPrice) {
          price = res.data.sellLowPrice / secondPrecision;
        } else {
          price = exchangeData.price;
        }
        this.setState(
          {
            price: parseFloat(price)
          },
          () => {
            this.props.form.setFieldsValue({
              first_quant_buy: parseFloat(price)
            });
          }
        );
      }
    });
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
    walletType: state.app.wallet
  };
}

const mapDispatchToProps = {
  setUpdateTran
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Form.create()(withRouter(Buy))));
