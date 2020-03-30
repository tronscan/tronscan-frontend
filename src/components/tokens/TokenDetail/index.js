import React from "react";
import { Client } from "../../../services/api";
import { t, tu } from "../../../utils/i18n";
import { Icon } from "antd";
import { injectIntl } from "react-intl";
import TokenHolders from "./TokenHolders";
import { NavLink, Route, Switch } from "react-router-dom";
import { TronLoader } from "../../common/loaders";
import Transfers from "./Transfers.js";
import TokenInfo from "./TokenInfo.js";
import BTTSupply from "./BTTSupply.js";
import { Information } from "./Information.js";
import { ONE_TRX, API_URL, IS_MAINNET,uuidv4 } from "../../../constants";
import { login } from "../../../actions/app";
import { reloadWallet } from "../../../actions/wallet";
import { updateTokenInfo } from "../../../actions/tokenInfo";
import { trim } from "lodash";
import moment from "moment";
import { toastr } from "react-redux-toastr";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { pkToAddress } from "@tronscan/client/src/utils/crypto";
import { transactionResultManager } from "../../../utils/tron";
import xhr from "axios/index";
import Lockr from "lockr";
import BigNumber from "bignumber.js";
import { withTronWeb } from "../../../utils/tronWeb";
import { CsvExport } from "../../common/CsvExport";
import { loadUsdPrice } from "../../../actions/blockchain";
import ExchangeQuotes from "../ExchangeQuotes";
import ApiClientToken from "../../../services/tokenApi";
import rebuildList from "../../../utils/rebuildList";
import {
  getPerformanceTiming,
  getPerformanceTimingEntry
} from "../../../utils/DateTime";
import isMobile from "../../../utils/isMobile";
import ApiClientMonitor from '../../../services/monitor'

@withTronWeb
class TokenDetail extends React.Component {
  constructor() {
    window.performance.mark("start2");

    super();
    this.start = moment([2018, 5, 25])
      .startOf("day")
      .valueOf();
    this.end = moment().valueOf();
    this.state = {
      privateKey: "",
      loading: true,
      token: {},
      tabs: [],
      buyAmount: 0,
      alert: null,
      currentTotalSupply: "",
      csvurl: "",
      BttSupplyClient: "",
      searchAddress: "",
      searchAddressClose: false
    };
  }

  async componentWillMount() {
    window.performance.mark("start2");

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

    if (isNaN(Number(match.params.id))) {
      this.props.history.push("/tokens/list");
    } else {
      this.loadToken(decodeURI(match.params.id));
    }
    this.MonitoringParameters()
    console.log('t1 uuidv4 :',uuidv4);

  }

  componentDidUpdate(prevProps) {
    let { match, intl } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      if (isNaN(Number(match.params.id))) {
        this.props.history.push("/tokens/list");
      } else {
        this.loadToken(decodeURI(match.params.id));
      }
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

  loadTotalTRXSupply = async () => {
    const { funds } = await Client.getBttFundsSupply();
    this.setState({
      currentTotalSupply: parseInt(funds.totalTurnOver),
      BttSupplyClient: funds
    });
  };

  loadToken = async id => {
    let { priceUSD } = this.props;
    let { currentTotalSupply } = this.state;

    this.setState({
      loading: true
    });

    //let token = await Client.getToken(name);
    let result = await xhr.get(API_URL + "/api/token?id=" + id + "&showAll=1");
    let token = result.data.data[0];
    this.props.updateTokenInfo({
      tokenDetail: token
    });

    token.priceToUsd =
      token && token["market_info"]
        ? token["market_info"].priceInTrx * priceUSD
        : 0;

    if (!token) {
      this.setState({
        loading: false,
        token: null
      });
      this.props.history.push("/tokens/list");
      return;
    }
    let tabs = [
      {
        id: "tokenInfo",
        icon: "",
        path: "",
        label: <span> {tu("token_issuance_info")} </span>,
        cmp: () => <TokenInfo token={token} />
      },
      {
        id: "transfers",
        icon: "",
        path: "/transfers",
        label: <span> {tu("token_transfers")} </span>,
        cmp: () => (
          <Transfers
            getCsvUrl={csvurl =>
              this.setState({
                csvurl
              })
            }
            filter={{
              token: token.name,
              address: token.ownerAddress
            }}
          />
        )
      },
      {
        id: "holders",
        icon: "",
        path: "/holders",
        label: (
          <span>
            {" "}
            {IS_MAINNET ? tu("token_holders") : tu("DAppChain_holders")}{" "}
          </span>
        ),
        cmp: () => (
          <TokenHolders
            filter={{
              token: token.name,
              address: token.ownerAddress,
              tokenId: token.id
            }}
            token={{
              totalSupply: token.totalSupply
            }}
            tokenPrecision={{
              precision: token.precision
            }}
            getCsvUrl={csvurl =>
              this.setState({
                csvurl
              })
            }
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
          label: <span> {tu("token_market")} </span>,
          cmp: () => <ExchangeQuotes address={token.tokenID} />
        }
      ];
    }
    this.setState({
      loading: false,
      token
    });
    if (token.tokenID == 1002000) {
      let BttSupply = {
        id: "BTTSupply",
        icon: "",
        path: "/supply",
        label: <span> {tu("BTT_supply")} </span>,
        cmp: () => <BTTSupply token={token} />
      };
      tabs.push(BttSupply);
      await this.loadTotalTRXSupply();
    }
    this.setState({
      tabs: tabs
    });
  };

  isBuyValid = () => {
    return this.state.buyAmount > 0;
  };

  tokensTransferSearchFun = async () => {
    let serchInputVal = this.searchAddress.value;
    let { intl } = this.props;
    if (serchInputVal === "") {
      return false;
    }
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

    this.setState({
      searchAddress: serchInputVal
    });

    const {
      tokenID,
      totalSupply,
      ownerAddress
    } = this.props.tokensInfo.tokenDetail;
    await xhr
      .get(
        `${API_URL}/api/tokenholders?uuid=${uuidv4}&address=${ownerAddress}&holder_address=${serchInputVal}&id=${tokenID}`
      )
      .then(res => {
        if (res.data) {
          let trc10Token = res.data.data;
          let balance = 0;
          if (trc10Token.length > 0) {
            trc10Token.forEach(res => {
              balance += res.balance;
            });
            let accountedFor =
              new BigNumber(balance)
                .dividedBy(new BigNumber(totalSupply))
                .toNumber(8) || 0;
            let trc10TokenObj = {
              srTag: false,
              srName: null,
              addressTag: null,
              holder_address: serchInputVal,
              foundationTag: false,
              balance,
              name: trc10Token[0].name,
              accountedFor
            };

            this.props.updateTokenInfo({
              transferSearchStatus: true,
              transfer: {
                ...trc10TokenObj
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
    let { tokensInfo } = this.props;
    const params = {
      issueAddress: ownerAddress,
      relatedAddress: serchInputVal,
      start_timestamp: tokensInfo.start_timestamp,
      end_timestamp: tokensInfo.end_timestamp
    };

    try {
      const allData = await Promise.all([
        Client.getAssetTransfers({
          limit: 20,
          ...params
        }),
        Client.getCountByType({
          type: "asset",
          issueName: ownerAddress,
          address: serchInputVal
        })
      ]).catch(e => {
        console.log("error:" + e);
      });
      const [{ list, total, rangeTotal }, { count }] = allData;

      let transfers = rebuildList(list, "tokenName", "amount");

      for (let index in transfers) {
        transfers[index].index = parseInt(index) + 1;
      }
      if (serchInputVal !== "") {
        transfers.forEach(result => {
          if (result.transferToAddress === serchInputVal) {
            result.transfersTag = "in";
          } else if (result.transferFromAddress === serchInputVal) {
            result.transfersTag = "out";
          }
        });
      }

      this.props.updateTokenInfo({
        searchAddress: serchInputVal,
        transfersListObj: {
          transfers,
          total: count,
          rangeTotal
        }
      });
    } catch {}
  };

  resetSearch = async () => {
    this.setState({
      searchAddress: "",
      searchAddressClose: false
    });
    this.props.updateTokenInfo({
      searchAddress: ""
    });
    let { tokensInfo } = this.props;
    const { ownerAddress } = this.props.tokensInfo.tokenDetail;
    const params = {
      name: tokensInfo.tokenDetail.name,
      issueAddress: ownerAddress,
      start_timestamp: tokensInfo.start_timestamp,
      end_timestamp: tokensInfo.end_timestamp
    };
    try {
      const allData = await Promise.all([
        Client.getAssetTransfers({
          limit: 20,
          ...params
        }),
        Client.getCountByType({
          type: "asset",
          issueName: ownerAddress
        })
      ]).catch(e => {
        console.log("error:" + e);
      });
      const [{ list, total, rangeTotal }, { count }] = allData;

      let transfers = rebuildList(list, "tokenName", "amount");

      for (let index in transfers) {
        transfers[index].index = parseInt(index) + 1;
      }

      this.props.updateTokenInfo({
        transfersListObj: {
          transfers: transfers,
          total: count,
          rangeTotal
        },
        transferSearchStatus: false
      });
      this.props.updateTokenInfo({
        searchAddress: "",
        transfersListObj: {
          transfers,
          total: count,
          rangeTotal
        }
      });
    } catch {}
  };

  onSearchKeyDown = ev => {
    if (ev.keyCode === 13) {
      this.tokensTransferSearchFun();
    }
  };

  render() {
    let { match, wallet, intl, priceUSD, tokensInfo } = this.props;

    let tokenTransferTotal = tokensInfo.transfersListObj.rangeTotal;
    let tokensHoldersTotal = tokensInfo.holders10ListObj.rangeTotal;
    let {
      token,
      tabs,
      loading,
      buyAmount,
      alert,
      currentTotalSupply,
      csvurl,
      BttSupplyClient,
      searchAddress,
      searchAddressClose
    } = this.state;

    let uploadURL =
      API_URL + "/api/v2/node/info_upload?address=" + match.params.id;
    let pathname = this.props.location.pathname;
    let tabName = "";
    let rex = /[a-zA-Z0-9]{7}\/?([a-zA-Z\\-]+)$/;
    pathname.replace(rex, function(a, b) {
      tabName = b;
    });

    return (
      <main className="container header-overlap token_black mc-donalds-coin tonken10DetailMain">
        {" "}
        {alert}{" "}
        {loading ? (
          <div className="card">
            <TronLoader>
              {" "}
              {tu("loading_token")} {token.name}{" "}
            </TronLoader>{" "}
          </div>
        ) : (
          <div className="row">
            {" "}
            {token && (
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body mt-2">
                    <div className="d-flex">
                      {" "}
                      {token && token.imgUrl && token.tokenID ? (
                        <div>
                          {" "}
                          {token.tokenID == 1002000 ? (
                            <div className="token-img-top">
                              <img className="token-logo" src={token.imgUrl} />{" "}
                              <i> </i>{" "}
                            </div>
                          ) : (
                            <img className="token-logo" src={token.imgUrl} />
                          )}{" "}
                        </div>
                      ) : (
                        <img
                          className="token-logo"
                          src={require("../../../images/logo_default.png")}
                        />
                      )}{" "}
                      <div className="token-description">
                        <h5 className="card-title">
                          {" "}
                          {token.name}({token.abbr}){" "}
                        </h5>{" "}
                        <p className="card-text"> {token.description} </p>{" "}
                      </div>
                      <div className="token-sign"> TRC10 </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  {token && (
                    <Information
                      token={token}
                      currentTotalSupply={currentTotalSupply}
                      priceUSD={priceUSD}
                      BttSupplyClient={BttSupplyClient}
                    ></Information>
                  )}{" "}
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
                      style={{
                        marginTop: "-12px",
                        marginLeft: "-20px"
                      }}
                    >
                      {tabs.map((tab, tabInd) => (
                        <li key={tabInd} className="nav-item">
                          <NavLink
                            exact
                            to={match.url + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} /> {tab.label}{" "}
                          </NavLink>{" "}
                        </li>
                      ))}{" "}
                    </ul>{" "}
                    {pathname.slice(-9) === "transfers" ? (
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
                          style={{
                            marginLeft: 7,
                            position: "relative"
                          }}
                        >
                          <input
                            type="text"
                            ref={ref => (this.searchAddress = ref)}
                            value={searchAddress}
                            placeholder={intl.formatMessage({
                              id: "search_TRC20"
                            })}
                            style={{
                              border: "none",
                              minWidth: 240,
                              padding: "0 1.4rem 0 0.7rem"
                            }}
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
                            onKeyDown={this.onSearchKeyDown}
                            onBlur={() => {
                              if (searchAddress !== "") {
                                this.setState({
                                  searchAddressClose: true
                                });
                              } else {
                                this.setState({
                                  searchAddressClose: false
                                });
                              }
                            }}
                          />{" "}
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
                          ) : null}{" "}
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
                          </button>{" "}
                        </div>{" "}
                      </div>
                    ) : null}{" "}
                  </div>{" "}
                  <div className="card-body p-0">
                    <Switch>
                      {" "}
                      {tabs.map((tab, tabInd) => (
                        <Route
                          key={tabInd}
                          exact
                          path={match.url + tab.path}
                          render={() => <tab.cmp />}
                        />
                      ))}{" "}
                    </Switch>
                    <div
                      className="downCsvExport"
                      style={{
                        position: "absolute",
                        left: "20px",
                        bottom: "28px"
                      }}
                    >
                      {tabName === "transfers" && tokenTransferTotal !== 0 ? (
                        <CsvExport downloadURL={csvurl} />
                      ) : null}{" "}
                      {tabName === "holders" && tokensHoldersTotal !== 0 ? (
                        <CsvExport downloadURL={csvurl} />
                      ) : null}{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </div>
        )}{" "}
      </main>
    );
  }
  MonitoringParameters(){
    let _this = this;
      if (window.performance || window.webkitPerformance) {
          var perf = window.performance || window.webkitPerformance;
          var timing = perf.timing;
          //var navi = perf.navigation;

          window.performance.mark("mySetTimeout-end3");

          performance.measure(
            "mySetTimeout",
            "start2",
            "mySetTimeout-end3"
          );
          var measures = window.performance.getEntriesByName("mySetTimeout");
          var measure = measures[0];

          var measure5  =-1;
          if (performance.navigation.type == 1) {
            performance.measure(
              "mySetTimeout5",
              "start",
              "start2"
            );
            var measures5 = window.performance.getEntriesByName("mySetTimeout5");
            measure5 = measures5[0].duration;
          }

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
)(injectIntl(TokenDetail));
