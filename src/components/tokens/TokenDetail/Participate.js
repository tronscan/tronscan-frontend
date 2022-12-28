import React from "react";
import {
  FormattedDate,
  FormattedNumber,
  FormattedRelative,
  FormattedTime,
  injectIntl
} from "react-intl";
import { ONE_TRX } from "../../../constants";
import { tu, t } from "../../../utils/i18n";
import { Client } from "../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux";
import { transactionResultManager } from "../../../utils/tron";
import Lockr from "lockr";
import { withTronWeb } from "../../../utils/tronWeb";
import { reloadWallet } from "../../../actions/wallet";

@connect(
  state => {
    return {
      wallet: state.wallet,
      currentWallet: state.wallet.current,
      walletType: state.app.wallet,
      activeLanguage: state.app.activeLanguage
    };
  },
  {
    reloadWallet
  }
)
@injectIntl
// @withTimers
@withTronWeb
class Participate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      buyAmount: 0
    };
  }

  componentDidMount() {}

  render() {
    let { token, intl } = this.props;
    let { alert } = this.state;
    return (
      <span className="token-sweet-alert">
        {alert}
        <button
          className="btn btn-default btn-xs d-inline-block ml-3"
          onClick={() => this.preBuyTokens(token)}
        >
          {tu("participate")}
        </button>
      </span>
    );
  }

  preBuyTokens = token => {
    let { buyAmount } = this.state;
    let { currentWallet, wallet, intl } = this.props;
    let price =
      ((token.trxNum / token.num) * Math.pow(10, token.precision)) / ONE_TRX;
    if (!wallet.isOpen) {
      this.setState({
        alert: (
          <SweetAlert
            info
            showConfirm={false}
            title={intl.formatMessage({
              id: "token_par_issu"
            })}
            // style={{ width: '30rem', height: '18.75rem',left:'50%',marginLeft:'-15rem'}}
          >
            <div className="token-sweet-alert">
              <a
                className="close"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <span>{tu("login_first")}</span>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                {tu("OK")}
              </button>
            </div>
          </SweetAlert>
        )
      });
      return;
    } else {
      this.setState({
        alert: (
          <SweetAlert
            showConfirm={false}
            title={intl.formatMessage({
              id: "token_par_issu"
            })}
            showClose={true}
            // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div className="token-sweet-alert" style={{ textAlign: "left" }}>
              <a
                style={{ float: "right", marginTop: "-45px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <p className="token-price mt-2">
                1{token.name} ≈ {price} TRX
              </p>
              <p className="token-number">{tu("token_enter_number")}</p>
              {token.remaining === 0 && <span> {tu("no_token_to_buy")}</span>}
              <div className="input-group mt-1">
                <input
                  type="number"
                  ref={ref => (this.buyAmount = ref)}
                  className="form-control"
                  max={token.remaining}
                  min={1}
                  onKeyUp={e => {
                    e.target.value = e.target.value.replace(/^0|[^\d*]/g, "");
                  }}
                  onChange={e => {
                    this.onBuyInputChange(
                      e.target.value,
                      ((token.trxNum / token.num) *
                        Math.pow(10, token.precision)) /
                        ONE_TRX,
                      token.remaining
                    );
                  }}
                />
              </div>
              <div className="mt-2">
                <b>
                 {tu('token_estimated_cost')}  <span className="token-estminated" ref={ref => (this.priceTRX = ref)}>0</span> TRX
                </b>
              </div>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.buyTokens(token);
                }}
              >
                {tu("participate")}
              </button>
            </div>
          </SweetAlert>
        )
      });
    }
  };

  buyTokens = token => {
    let price = (token.trxNum / token.num) * Math.pow(10, token.precision);
    let { buyAmount } = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let { currentWallet, wallet } = this.props;
    let tokenCosts = buyAmount * (price / ONE_TRX);

    if (currentWallet.balance / ONE_TRX < tokenCosts) {
      this.setState({
        alert: (
          <SweetAlert
            warning
            showConfirm={false}
            // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <span>{tu("not_enough_trx_message")}</span>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                {tu("confirm")}
              </button>
            </div>
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            warning
            showConfirm={false}
            // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <p className="ml-auto buy_confirm_message">
                {tu("buy_confirm_message_1")}
              </p>
              <span>
                {buyAmount} {token.name} {t("for")}{" "}
                {parseFloat((buyAmount * (price / ONE_TRX)).toFixed(6))} TRX?
              </span>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.confirmTransaction(token);
                }}
              >
                {tu("confirm")}
              </button>
            </div>
          </SweetAlert>
        )
      });
    }
  };
  onBuyInputChange = (value, price, max) => {
    let { intl } = this.props;
    if (value > max) {
      value = max;
    }
    value = value.replace(/^0|[^\d*]/g, "");
    this.setState({ buyAmount: value });
    this.buyAmount.value = value;
    let priceTRX = value * price;
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX, {
      maximumFractionDigits: 6
    });
  };

  confirmTransaction = async token => {
    let { account, intl } = this.props;
    let { buyAmount } = this.state;

    this.setState({
      alert: (
        <SweetAlert
          showConfirm={false}
          showCancel={false}
          cancelBtnBsStyle="default"
          title={intl.formatMessage({ id: "transferring" })}
          // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
        ></SweetAlert>
      )
    });

    if (await this.submit(token)) {
      this.setState({
        alert: (
          <SweetAlert
            success
            showConfirm={false}
            // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </a>
              <h5 style={{ color: "black" }}>
                {tu("transaction")} {tu("confirm")}
              </h5>
              <span>
                {tu("success_receive")} {token.name} {tu("tokens")}
              </span>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                {tu("OK")}
              </button>
            </div>
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        alert: (
          <SweetAlert
            danger
            title="Error"
            onConfirm={() => this.setState({ alert: null })}
          >
            {tu("fail_transaction")}
          </SweetAlert>
        )
      });
    }
  };
  submit = async token => {
    let price = (token.trxNum / token.num) * Math.pow(10, token.precision);
    let { account, currentWallet } = this.props;
    let { buyAmount, privateKey } = this.state;

    let res;
    if (
      Lockr.get("islogin") ||
      this.props.walletType.type === "ACCOUNT_LEDGER" ||
      this.props.walletType.type === "ACCOUNT_TRONLINK"
    ) {
      const tronWebLedger = this.props.tronWeb();
      const { tronWeb } = this.props.account;
      try {
        if (this.props.walletType.type === "ACCOUNT_LEDGER") {
          const unSignTransaction = await tronWebLedger.transactionBuilder
            .purchaseToken(
              token.ownerAddress,
              token.id + "",
              parseInt((buyAmount * price).toFixed(0)),
              this.props.walletType.address
            )
            .catch(e => false);
          const { result } = await transactionResultManager(
            unSignTransaction,
            tronWebLedger
          );
          res = result;
        }
        if (this.props.walletType.type === "ACCOUNT_TRONLINK") {
          const unSignTransaction = await tronWeb.transactionBuilder
            .purchaseToken(
              token.ownerAddress,
              token.id + "",
              parseInt((buyAmount * price).toFixed(0)),
              tronWeb.defaultAddress.hex
            )
            .catch(e => false);
          const { result } = await transactionResultManager(
            unSignTransaction,
            tronWeb
          );
          res = result;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      let isSuccess = await Client.participateAsset(
        currentWallet.address,
        token.ownerAddress,
        token.id + "",
        parseInt((buyAmount * price).toFixed(0))
      )(account.key);
      res = isSuccess.success;
    }

    if (res) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: res,
        buyAmount: 0
      });
      this.props.reloadWallet();
      return true;
    } else {
      return false;
    }
  };
}

export default Participate;
