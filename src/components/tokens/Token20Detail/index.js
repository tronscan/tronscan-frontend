import React, { Fragment } from "react";
import { Client } from "../../../services/api";
import { t, tu } from "../../../utils/i18n";
import { trim } from "lodash";
import {
  //FormattedDate,
  //FormattedNumber,
  //FormattedRelative,
  //FormattedTime,
  injectIntl
} from "react-intl";
import TokenHolders from "./TokenHolders";
import { Icon } from "antd";
import { NavLink, Route, Switch } from "react-router-dom";
//import { AddressLink, ExternalLink } from "../../common/Links";
import { TronLoader } from "../../common/loaders";
import Transfers from "./Transfers.js";
//import TokenInfo from "./TokenInfo.js";
import { Information } from "./Information.js";
//import qs from "qs";
import { toastr } from "react-redux-toastr";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";
import {
  API_URL,
  ONE_TRX,
  CONTRACT_ADDRESS_USDT,
  CONTRACT_ADDRESS_WIN,
  CONTRACT_ADDRESS_GGC,
  IS_MAINNET,
  uuidv4,
  CONTRACT_ADDRESS_USDJ,
  CONTRACT_ADDRESS_USDJ_TESTNET
} from "../../../constants";
import { login } from "../../../actions/app";
import { reloadWallet } from "../../../actions/wallet";
import { updateTokenInfo } from "../../../actions/tokenInfo";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { pkToAddress } from "@tronscan/client/src/utils/crypto";
import { Link } from "react-router-dom";
import { some, toLower } from "lodash";
import xhr from "axios/index";
import _ from "lodash";
import WinkSupply from "./winkSupply.js";
import JstSupply from "./jstSupply.js";
import { CsvExport } from "../../common/CsvExport";
import { loadUsdPrice } from "../../../actions/blockchain";
import Code from "../../blockchain/Contract/Code";
import ExchangeQuotes from "../ExchangeQuotes";
import ApiClientToken from "../../../services/tokenApi";
import BigNumber from "bignumber.js";
import {
  getPerformanceTiming,
  getPerformanceTimingEntry
} from "../../../utils/DateTime";
import isMobile from "../../../utils/isMobile";
import ApiClientMonitor from '../../../services/monitor'
import { HrefLink } from "../../common/Links";

class Token20Detail extends React.Component {
  constructor() {
    window.performance.mark("start2");
    super();
    this.state = {
      privateKey: "",
      loading: true,
      token: {},
      tabs: [],
      buyAmount: 0,
      alert: null,
      csvurl: "",
      searchAddress: "",
      searchAddressClose: false
    };
  }

  async componentWillMount() {
    window.performance.mark("start2");

    //console.log('Component WILL MOUNT!')
    var measure5  =-1;
    if (performance.navigation.type == 1) {
      performance.measure(
        "mySetTimeout5",
        "start",
        "start2"
      );
      var measures5 = window.performance.getEntriesByName("mySetTimeout5");
      measure5 = measures5[0].duration;
      this.MonitoringParameters3(measure5);
    } 

}

  async componentDidMount() {
    let { match, priceUSD } = this.props;
    !priceUSD && (await this.props.loadUsdPrice());
    this.loadToken(decodeURI(match.params.address));
    this.MonitoringParameters();

  }

  componentDidUpdate(prevProps, nextProps) {
    let { match } = this.props;
    if (match.params.address !== prevProps.match.params.address) {
      this.loadToken(decodeURI(match.params.address));
    }
    if (this.props.location !== prevProps.location) {
      // 路由变化
      if (this.state.searchAddress != "") {
        this.setState({
          searchAddress: "",
          searchAddressClose: false
        });
        this.props.updateTokenInfo({
          searchAddress: ""
        });
      }
    }
  }

  async getWinkFund() {
    let winkSupply = await ApiClientToken.getWinkFund();
    return winkSupply;
  }
  async getJstFund() {
    const {data: funds} = await xhr.get(`${API_URL}/api/jst/fund`);
    return funds;
  }

  async getTransferNum(address) {
    let params = {
      contract_address: address,
      limit: 0
    };
    let transferNumber = await ApiClientToken.getTransferNumber(params);
    return transferNumber;
  }

  loadToken = async address => {
    let { priceUSD } = this.props;

    xhr
      .get(API_URL + "/api/token_trc20?contract=" + address + "&showAll=1")
      .then(async res => {
        let token = res.data.trc20_tokens[0];
        this.props.updateTokenInfo({
          tokenDetail: token
        });
        let tabs = [
          // {
          //   id: "tokenInfo",
          //   icon: "",
          //   path: "",
          //   label: <span>{tu("token_issuance_info")}</span>,
          //   cmp: () => <TokenInfo token={token} />
          // },
          {
            id: "transfers",
            icon: "",
            path: "",
            label: <span>{tu("token_transfers")}</span>,
            cmp: () => (
              <Transfers
                filter={{ token: address }}
                getCsvUrl={csvurl => this.setState({ csvurl })}
                token={token}
              />
            )
          },
          {
            id: "holders",
            icon: "",
            path: "/holders",
            label: (
              <span>
                {IS_MAINNET ? tu("token_holders") : tu("DAppChain_holders")}
              </span>
            ),
            cmp: () => (
              <TokenHolders
                filter={{ token: address }}
                getCsvUrl={csvurl => this.setState({ csvurl })}
                token={token}
              />
            )
          }
        ];

        if (IS_MAINNET) {
          tabs = [
            ...tabs,
            {
              id: "quotes",
              icon: "",
              path: "/quotes",
              label: <span>{tu("token_market")}</span>,
              cmp: () => <ExchangeQuotes address={address} />
            },
            {
              id: "code",
              icon: "",
              path: "/code",
              label: <span>{tu("contract_title")}</span>,
              cmp: () => (
                <div style={{ background: "#fff", padding: "0 2.6%" }}>
                  <Code filter={{ address: address }} />
                </div>
              )
            }
          ];
        }
        let winkTotalSupply = {};
        if (address === "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7") {
          tabs.push({
            id: "WinkSupply",
            icon: "",
            path: "/supply",
            label: <span>{tu("WIN_supply")}</span>,
            cmp: () => <WinkSupply token={token} />
          });
          winkTotalSupply = await this.getWinkFund();
        }

        let jstTotalSupply = {};
        if (address === "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9") {
          tabs.push({
            id: "JstSupply",
            icon: "",
            path: "/supply",
            label: <span>{tu("JST_supply")}</span>,
            cmp: () => <JstSupply token={token} />
          });
          jstTotalSupply = await this.getJstFund();
        }

        let transferNumber = await this.getTransferNum(address);

        this.setState({ loading: true });
        token.priceToUsd =
          token && token["market_info"]
            ? token["market_info"].priceInTrx * priceUSD
            : 0;

        token.winkTotalSupply = winkTotalSupply;
        token.jstTotalSupply = jstTotalSupply;
        token.transferNumber = transferNumber.rangeTotal || 0;
        this.setState({
          loading: false,
          token,
          tabs
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  submit = async token => {
    let { account, currentWallet } = this.props;
    let { buyAmount, privateKey } = this.state;

    let isSuccess = await Client.participateAsset(
      currentWallet.address,
      token.ownerAddress,
      token.id,
      buyAmount * token.price
    )(account.key);

    if (isSuccess.success) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: isSuccess.success,
        buyAmount: 0
      });
      this.props.reloadWallet();
      return true;
    } else {
      return false;
    }
  };

  onInputChange = value => {
    let { account } = this.props;
    if (value && value.length === 64) {
      this.privateKey.className = "form-control";
      if (pkToAddress(value) !== account.address)
        this.privateKey.className = "form-control is-invalid";
    } else {
      this.privateKey.className = "form-control is-invalid";
    }
    this.setState({ privateKey: value });
    this.privateKey.value = value;
  };

  confirmPrivateKey = param => {
    let { privateKey, token } = this.state;
    let { account } = this.props;

    let reConfirm = () => {
      if (this.privateKey.value && this.privateKey.value.length === 64) {
        if (pkToAddress(this.privateKey.value) === account.address)
          this.buyTokens(token);
      }
    };

    this.setState({
      alert: (
        <SweetAlert
          info
          showCancel
          cancelBtnText={tu("cancel")}
          confirmBtnText={tu("confirm")}
          confirmBtnBsStyle="success"
          cancelBtnBsStyle="default"
          title={tu("confirm_private_key")}
          onConfirm={reConfirm}
          onCancel={() => this.setState({ alert: null })}
          style={{ marginLeft: "-240px", marginTop: "-195px" }}
        >
          <div className="form-group">
            <div className="input-group mb-3">
              <input
                type="text"
                ref={ref => (this.privateKey = ref)}
                onChange={ev => {
                  this.onInputChange(ev.target.value);
                }}
                className="form-control is-invalid"
              />
              <div className="invalid-feedback">
                {tu("fill_a_valid_private_key")}
              </div>
            </div>
          </div>
        </SweetAlert>
      )
    });
  };

  isBuyValid = () => {
    return this.state.buyAmount > 0;
  };

  onBuyInputChange = (value, price, max) => {
    let { intl } = this.props;
    if (value > max) {
      value = max;
    }
    this.setState({ buyAmount: value });
    this.buyAmount.value = value;
    let priceTRX = value * (price / ONE_TRX);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX);
  };

  preBuyTokens = token => {
    let { buyAmount } = this.state;
    let { currentWallet, wallet, intl } = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
          <SweetAlert
            info
            showConfirm={false}
            style={{
              width: "30rem",
              height: "18.75rem",
              left: "50%",
              marginLeft: "-15rem"
            }}
          >
            <div className="token-sweet-alert">
              <a
                className="close"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
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
            style={{
              marginLeft: "-240px",
              marginTop: "-195px",
              width: "450px",
              height: "300px"
            }}
          >
            <div
              className="mt-5 token-sweet-alert"
              style={{ textAlign: "left" }}
            >
              <a
                style={{ float: "right", marginTop: "-45px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
              </a>
              <h5 style={{ color: "black" }}>{tu("buy_token_info")}</h5>
              {token.remaining === 0 && <span> {tu("no_token_to_buy")}</span>}
              <div className="input-group mt-5">
                <input
                  type="number"
                  ref={ref => (this.buyAmount = ref)}
                  className="form-control"
                  max={token.remaining}
                  min={1}
                  onChange={e => {
                    this.onBuyInputChange(
                      e.target.value,
                      token.price,
                      token.remaining
                    );
                  }}
                />
              </div>
              <div className="text-center mt-3 text-muted">
                <b>
                  = <span ref={ref => (this.priceTRX = ref)}>0</span> TRX
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
    let { buyAmount } = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let { currentWallet, wallet } = this.props;
    let tokenCosts = buyAmount * (token.price / ONE_TRX);

    if (currentWallet.balance / ONE_TRX < tokenCosts) {
      this.setState({
        alert: (
          <SweetAlert
            warning
            showConfirm={false}
            style={{
              marginLeft: "-240px",
              marginTop: "-195px",
              width: "450px",
              height: "300px"
            }}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
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
            style={{
              marginLeft: "-240px",
              marginTop: "-195px",
              width: "450px",
              height: "300px"
            }}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
              </a>
              <p className="ml-auto buy_confirm_message">
                {tu("buy_confirm_message_1")}
              </p>
              <span>
                {buyAmount} {token.name} {t("for")}{" "}
                {buyAmount * (token.price / ONE_TRX)} TRX?
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
          style={{
            marginLeft: "-240px",
            marginTop: "-195px",
            width: "450px",
            height: "300px"
          }}
        ></SweetAlert>
      )
    });

    if (await this.submit(token)) {
      this.setState({
        alert: (
          <SweetAlert
            success
            showConfirm={false}
            style={{
              marginLeft: "-240px",
              marginTop: "-195px",
              width: "450px",
              height: "300px"
            }}
          >
            <div className="mt-5 token-sweet-alert">
              <a
                style={{ float: "right", marginTop: "-155px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
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

  tokensTransferSearchFun = async () => {
    let serchInputVal = this.searchAddress.value;
    if (serchInputVal === "") {
      return false;
    }
    let { intl } = this.props;
    if (!isAddressValid(serchInputVal)) {
      toastr.warning(
        intl.formatMessage({
          id: "warning"
        }),
        intl.formatMessage({
          id: "search_TRC20_error"
        })
      );
      this.setState({
        searchAddress: ""
      });
      return;
    }

    const {
      contract_address,
      total_supply_with_decimals
    } = this.props.tokensInfo.tokenDetail;
    await xhr
      .get(
        `${API_URL}/api/token_trc20/holders?uuid=${uuidv4}&holder_address=${serchInputVal}&contract_address=${contract_address}`
      )
      .then(res => {
        if (res.data) {
          let trc20Token = res.data.trc20_tokens;
          let balance = 0;
          if (trc20Token.length > 0) {
            let newBalance = trc20Token[0].balance;
            let accountedFor =
              new BigNumber(newBalance)
                .dividedBy(new BigNumber(total_supply_with_decimals))
                .toNumber(8) || 0;
            let trc20TokenObj = {
              srTag: false,
              srName: null,
              addressTag: null,
              holder_address: serchInputVal,
              foundationTag: false,
              balance: newBalance,
              accountedFor
            };

            this.props.updateTokenInfo({
              transferSearchStatus: true,
              transfer: {
                ...trc20TokenObj
              }
            });
          } else {
            this.props.updateTokenInfo({
              transfer: {
                srTag: false,
                srName: null,
                balance: 0,
                addressTag: null,
                holder_address: serchInputVal,
                foundationTag: false,
                accountedFor: 0
              },
              transferSearchStatus: true
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });

    let { match, tokensInfo } = this.props;
    const params = {
      contract_address: decodeURI(match.params.address),
      relatedAddress: serchInputVal,
      start_timestamp: tokensInfo.start_timestamp,
      end_timestamp: tokensInfo.end_timestamp
    };

    const allData = await Promise.all([
      Client.getTokenTRC20Transfers({
        limit: 20,
        ...params
      }),
      Client.getCountByType({
        type: "trc20",
        contract: decodeURI(match.params.address),
        address: serchInputVal
      })
    ]).catch(e => {
      console.log("error:" + e);
    });

    const [{ list, rangeTotal }, { count }] = allData;
    let transfers = list || [];

    for (let index in transfers) {
      transfers[index].index = parseInt(index) + 1;
    }
    if (serchInputVal !== "") {
      transfers.forEach(result => {
        if (result.to_address === serchInputVal) {
          result.transfersTag = "in";
        } else if (result.from_address === serchInputVal) {
          result.transfersTag = "out";
        }
      });
    }

    this.props.updateTokenInfo({
      searchAddress: serchInputVal,
      transfers20ListObj: {
        transfers,
        total: count,
        rangeTotal
      }
    });
  };

  resetSearch = async () => {
    this.setState({
      searchAddress: "",
      searchAddressClose: false
    });
    this.props.updateTokenInfo({
      searchAddress: ""
    });
    let { match, tokensInfo } = this.props;
    const params = {
      contract_address: decodeURI(match.params.address),
      start_timestamp: tokensInfo.start_timestamp,
      end_timestamp: tokensInfo.end_timestamp
    };

    const allData = await Promise.all([
      Client.getTokenTRC20Transfers({
        limit: 20,
        ...params
      }),
      Client.getCountByType({
        type: "trc20",
        contract: decodeURI(match.params.address)
      })
    ]).catch(e => {
      this.props.updateTokenInfo({
        transferSearchStatus: false
      });
      console.log("error:" + e);
    });

    const [{ list, rangeTotal }, { count }] = allData;
    let transfers = list || [];

    for (let index in transfers) {
      transfers[index].index = parseInt(index) + 1;
    }
    this.props.updateTokenInfo({
      transfers20ListObj: {
        transfers,
        total: count,
        rangeTotal
      },
      transferSearchStatus: false
    });
  };

  onSearchKeyDown = ev => {
    if (ev.keyCode === 13) {
      this.tokensTransferSearchFun();
      // $('#_searchBox').css({display: 'none'});
    }
  };

  render() {
    let { match, wallet, priceUSD, intl, tokensInfo } = this.props;

    let tokenTransferTotal = tokensInfo.transfers20ListObj.rangeTotal || 0;
    let tokensHoldersTotal = tokensInfo.holders20ListObj.rangeTotal || 0;
    let {
      token,
      tabs,
      loading,
      buyAmount,
      alert,
      csvurl,
      searchAddress,
      searchAddressClose
    } = this.state;
    let pathname = this.props.location.pathname;

    let tabName = "";

    let rex = /[a-zA-Z0-9]{34}\/?([a-zA-Z\\-]+)$/;
    pathname.replace(rex, function(a, b) {
      tabName = b;
    });
    const defaultImg = require("../../../images/logo_default.png");
    return (
      <main className="container header-overlap token_black mc-donalds-coin tonken20DetailMain">
        {alert}
        {loading ? (
          <div className="card">
            <TronLoader>
              {tu("loading_token")} {token.name}
            </TronLoader>
          </div>
        ) : (
          <div className="row">
            {token && (
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body mt-2">
                    <div className="d-flex">
                      {token && token.icon_url ? (
                        <div>
                          {token.contract_address == CONTRACT_ADDRESS_USDT ||
                          token.contract_address == CONTRACT_ADDRESS_WIN ||
                          token.contract_address == CONTRACT_ADDRESS_GGC ? (
                            <div className="token-img-top">
                              <img
                                className="token-logo"
                                src={token.icon_url}
                                onError={e => {
                                  e.target.onerr = null;
                                  e.target.src = defaultImg;
                                }}
                              />
                              <i></i>
                            </div>
                          ) : (
                            <img
                              className="token-logo"
                              src={token.icon_url}
                              onError={e => {
                                e.target.onerr = null;
                                e.target.src = defaultImg;
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <img className="token-logo" src={defaultImg} />
                      )}
                      <div className="token-description">
                        <h5 className="card-title">
                          {token.name} ({token.symbol})
                          { (token.contract_address == CONTRACT_ADDRESS_USDJ || token.contract_address == CONTRACT_ADDRESS_USDJ_TESTNET) && <section className="to-USDj"><HrefLink href="https://www.just.network"><i className="fas fa-coins ml-2 mr-1"></i>{intl.formatMessage({id:'get_usdj'})}</HrefLink></section>}
                        </h5>
                        <p className="card-text" style={{marginBottom: 0}}>{token.token_desc}</p>
                        { token.contract_address == CONTRACT_ADDRESS_USDJ && <div className="to-USDj" style={{marginTop: '.5rem'}}><HrefLink href="https://tronscanorg.zendesk.com/hc/en-us/articles/360041737852-Step-by-step-instructions-on-how-to-generate-USDJ-on-JUST-CDP"><i className="fas fa-book mx-1"></i>{intl.formatMessage({id:'get_usdj_guide'})}</HrefLink></div>}
                      </div>
                      <div className="token-sign">TRC20</div>
                      {/*<div className="ml-auto">*/}
                      {/*{(!(token.endTime < new Date() || token.issuedPercentage === 100 || token.startTime > new Date() || token.isBlack) && !token.isBlack) &&*/}
                      {/*<button className="btn btn-default btn-xs d-inline-block"*/}
                      {/*onClick={() => this.preBuyTokens(token)}>{tu("participate")}</button>*/}
                      {/*}*/}
                      {/*<a href={"#/myToken?address="+ token.ownerAddress} className="btn btn-danger btn-xs d-inline-block token-detail-btn">{tu("update_token")}</a>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                  <Information token={token} priceUSD={priceUSD} intl={intl}></Information>
                </div>

                <div
                  className="card mt-3"
                  style={{
                    borderTop: "1px solid #d8d8d8"
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      borderLeft: "1px solid #d8d8d8",
                      borderRight: "1px solid #d8d8d8",
                      position: "relative"
                    }}
                  >
                    <ul
                      className="nav nav-tabs card-header-tabs"
                      style={{ marginTop: "-12px", marginLeft: "-20px" }}
                    >
                      {tabs.map(tab => (
                        <li key={tab.id} className="nav-item">
                          <NavLink
                            exact
                            to={match.url + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} />
                            {tab.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                    {pathname.length === 43 ? (
                      <div
                        className="tokenTransferSearch"
                        style={{
                          position: "absolute",
                          right: "1rem",
                          top: 6,
                          height: 26
                        }}
                      >
                        <div
                          className="input-group-append"
                          style={{ marginLeft: 0, position: "relative" }}
                        >
                          <input
                            type="text"
                            ref={ref => (this.searchAddress = ref)}
                            style={{
                              border: "none",
                              minWidth: 240,
                              padding: "0 1.4rem 0 0.7rem"
                            }}
                            placeholder={intl.formatMessage({
                              id: "search_TRC20"
                            })}
                            value={searchAddress}
                            onKeyDown={this.onSearchKeyDown}
                            onChange={event => {
                              if (event.target.value !== "") {
                                this.setState({
                                  searchAddress: trim(event.target.value),
                                  searchAddressClose: true
                                });
                              } else {
                                this.setState({
                                  searchAddressClose: false
                                });
                              }
                            }}
                          />
                          {searchAddressClose ? (
                            <Icon
                              onClick={() => {
                                this.resetSearch();
                              }}
                              type="close-circle"
                              style={{
                                position: "absolute",
                                top: "0.6rem",
                                right: 40
                              }}
                            />
                          ) : null}

                          <button
                            className="btn box-shadow-none"
                            style={{
                              height: "35px",
                              width: "35px",
                              background: "#C23631",
                              borderRadius: "0 2px 2px 0",
                              color: "#fff"
                            }}
                            onClick={() => this.tokensTransferSearchFun()}
                          >
                            <i className="fa fa-search" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="card-body p-0">
                    <Switch>
                      {tabs.map(tab => (
                        <Route
                          key={tab.id}
                          exact
                          path={match.url + tab.path}
                          render={() => <tab.cmp />}
                        />
                      ))}
                    </Switch>
                    <div
                      className="downCsvExport"
                      style={{
                        position: "absolute",
                        left: "20px",
                        bottom: "28px"
                      }}
                    >
                      {tabName === "" && tokenTransferTotal !== 0 ? (
                        <CsvExport downloadURL={csvurl} />
                      ) : null}
                      {tabName === "holders" && tokensHoldersTotal !== 0 ? (
                        <CsvExport downloadURL={csvurl} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    );
  }

  MonitoringParameters(){
      if (window.performance || window.webkitPerformance) {
          var perf = window.performance || window.webkitPerformance;
          var timing = perf.timing;
          var navi = perf.navigation;
          window.performance.mark("mySetTimeout-end2");

          window.performance.measure(
            "mySetTimeout",
            "start2",
            "mySetTimeout-end2"
          );
          var measure5  =-1;
          if (performance.navigation.type == 1 ) {
            performance.measure(
              "mySetTimeout5",
              "start",
              "start2"
            );
            var measures5 = window.performance.getEntriesByName("mySetTimeout5");
            measure5 = measures5[0].duration;
          }
          
          var measures = window.performance.getEntriesByName("mySetTimeout");
          var measure = measures[0];

          // var measures6 = window.performance.getEntriesByName("mySetTimeout6");
          // var measure6 = measures6[0];

          var timer = setInterval(function() {
              if (0 !== timing.loadEventEnd) {
                  timing = perf.timing;
                  let {loadPage,domReady,redirect,lookupDomain,ttfb,request,loadEvent,unloadEvent,connect} = getPerformanceTiming()
                  clearInterval(timer);
                  var time = performance.timing;
                  if (measure5 == -1) {
                    measure5 = domReady;
                  }
                  var data = {
                      url: window.location.href,
                      timezone: new Date().getTimezoneOffset()/60,
                      browser:window.navigator.userAgent,
                      pageLoadTime:loadPage,
                      contentLoadTime:request,
                      dnsSearchTime:lookupDomain,
                      domAnalyzeTime:domReady,
                      ttfbReadTime:ttfb,
                      tcpBuildTime:connect,
                      redirectTime:redirect,
                      onloadCallbackTime:loadEvent,
                      uninstallPageTime: unloadEvent,
                      isMobile:isMobile && isMobile[0],
                      navigationtype:performance.navigation.type,
                      measure:parseInt(measure.duration),
                      dompreload: time.responseEnd - time.navigationStart,
                      domloadend:time.domComplete - time.domLoading,
                      domative:time.domInteractive - time.domLoading,
                      shelllod:time.domContentLoadedEventEnd - time.domContentLoadedEventStart,
                      measure5:parseInt(measure5),
                      blankTime:time.domLoading - time.fetchStart,
                      v:'v4',
                      entryList:getPerformanceTimingEntry(),
                      udid:uuidv4
                      
                  };
                  window.performance.clearMarks();
                  window.performance.clearMeasures();
                 

                  ApiClientMonitor.setMonitor(data)
                  return data;
                }
              })
            }
         
      }

      MonitoringParameters3(measure5){
        let _this = this;
          if (window.performance || window.webkitPerformance) {
              var perf = window.performance || window.webkitPerformance;
              var timing = perf.timing;
              var navi = perf.navigation;
    
              window.performance.mark("mySetTimeout-end2");
    
              performance.measure(
                "mySetTimeout",
                "start2",
                "mySetTimeout-end2"
              ); 
  
              var measures = window.performance.getEntriesByName("mySetTimeout");
              var measure = measures[0];

              var timer = setInterval(function() {
                   {
                      timing = perf.timing;
                      let {loadPage,domReady,redirect,lookupDomain,ttfb,request,loadEvent,unloadEvent,connect} = getPerformanceTiming()
                      clearInterval(timer);
                      var time = performance.timing;
                      var data = {
                          url: window.location.href,
                          timezone: new Date().getTimezoneOffset()/60,
                          browser:window.navigator.userAgent,
                          pageLoadTime:loadPage,
                          contentLoadTime:request,
                          dnsSearchTime:lookupDomain,
                          domAnalyzeTime:domReady,
                          ttfbReadTime:ttfb,
                          tcpBuildTime:connect,
                          redirectTime:redirect,
                          onloadCallbackTime:loadEvent,
                          uninstallPageTime: unloadEvent,
                          isMobile:isMobile && isMobile[0],
                          navigationtype:performance.navigation.type,
                          measure:parseInt(measure.duration),
                          dompreload: time.responseEnd - time.navigationStart,
                          domloadend:time.domComplete - time.domLoading,
                          domative:time.domInteractive - time.domLoading,
                          shelllod:time.domContentLoadedEventEnd - time.domContentLoadedEventStart,
                          measure5:parseInt(measure5),
                          blankTime:time.domLoading - time.fetchStart,
                          v:'v3'
                      };
    
                    // window.performance.clearMarks();
                    // window.performance.clearMeasures();

                    ApiClientMonitor.setMonitor(data)
                      return data;
                    }
                  })
                }         
          }      

}

function mapStateToProps(state) {
  return {
    tokens: state.tokens.tokens,
    tokensInfo: state.tokensInfo,
    wallet: state.wallet,
    currentWallet: state.wallet.current,
    account: state.app.account,
    priceUSD: state.blockchain.usdPrice
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
  loadUsdPrice,
  updateTokenInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(Token20Detail));
