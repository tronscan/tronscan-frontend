import React, { Component } from "react";
import { connect } from "react-redux";
import xhr from "axios/index";
import { injectIntl } from "react-intl";
import { doSearch, getSearchType } from "../../services/search";
import CountUp from "react-countup";
import { Client, Client20 } from "../../services/api";
import { Link } from "react-router-dom";
import { TRXPrice } from "../common/Price";
import RecentBlocks from "./RecentBlocks";
import { KEY_ENTER } from "../../utils/constants";
import { withTimers } from "../../utils/timing";
import isMobile from "../../utils/isMobile";
import RecentTransfers from "./RecentTransfers";
import { tu } from "../../utils/i18n";
import { toastr } from "react-redux-toastr";
import { HrefLink } from "../common/Links";
import { TronLoader } from "../common/loaders";
import {
  LineReactHighChartAdd,
  LineReactHighChartTx,
  LineReactHighChartHomeAddress,
  LineReactHighChartHomeTx
} from "../common/LineCharts";
import { API_URL, IS_MAINNET } from "../../constants";
import { setWebsocket } from "../../actions/account";
import Lockr from "lockr";
import PaneGroup from "./PaneGroup";

@connect(
  state => {
    return {
      blocks: state.blockchain.blocks,
      account: state.app.account,
      theme: state.app.theme,
      activeLanguage: state.app.activeLanguage,
      wsdata: state.account.wsdata,
      websocket: state.account.websocket
    };
  },
  {
    setWebsocket
  }
)
@withTimers
@injectIntl
export default class Home extends Component {
  constructor() {
    super();
    this.listener = null;
    this.state = {
      search: "",
      isShaking: false,
      hasFound: false,
      totalAccounts: 0,
      startblockHeight: 0,
      onlineNodes: 0,
      blockHeight: 0,
      transactionPerDay: 0,
      txOverviewStats: null,
      addressesStats: null,
      SunAddressesStats: null,
      maxTps: 0,
      tps: 0,
      startTps: 0,
      notice: [],
      noticezhIEO: {
        id: 1,
        html_url: "https://trx.market/zh/launchBase?utm_source=TS1",
        name: "TRXMarket LaunchBase 瞩目呈现 ACE重磅登陆",
        created_at: "2019-04-09T12:00:00Z"
      },
      noticeenIEO: {
        id: 1,
        html_url: "https://trx.market/launchBase?utm_source=TS1",
        name: "TRXMarket LaunchBase grand open ACE is waiting for you",
        created_at: "2019-04-09T12:00:00Z"
      },
      newNotice: [" ", " ", " "]
    };
  }

  async loadNodes() {
    // let {total} = await Client.getNodeLocations();
    let { data } = await xhr.get(`${API_URL}/api/node`);
    this.setState({
      onlineNodes: data.total
    });
  }

  async loadHomepageBundle() {
    let { data } = await xhr.get(`${API_URL}/api/system/homepage-bundle`);
    Lockr.set("dataEth", data.priceETH);
    Lockr.set("dataEur", data.priceEUR);
    this.setState({
      onlineNodes: data.node.total,
      maxTps: data.tps.data.maxTps ? data.tps.data.maxTps : 0,
      tps: data.tps.data.currentTps ? data.tps.data.currentTps : 0,
      blockHeight: data.tps.data.blockHeight ? data.tps.data.blockHeight : 0,
      transactionPerDay: data.yesterdayStat.data[0].newTransactionSeen
    });
  }

  async loadAccounts() {
    let { rangeTotal } = await Client.getAccounts({
      limit: 1
    });
    this.setState({
      totalAccounts: rangeTotal
    });
  }

  async load() {
    // let {blocks} = await Client.getBlocks({
    //   limit: 1,
    //   sort: '-number',
    // });

    let { txOverviewStats } = await Client.getTxOverviewStats();
    // this.setState({
    //     transactionPerDay: txOverviewStats[txOverviewStats.length - 2].newTransactionSeen,
    // });
    let temp = [];
    let addressesTemp = [];
    for (let txs in txOverviewStats) {
      let tx = parseInt(txs);
      if (tx === 0) {
        //temp.push(txOverviewStats[tx]);
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].totalAddress,
          increment: txOverviewStats[tx].newAddressSeen
        });
        temp.push({
          date: txOverviewStats[tx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: txOverviewStats[tx].newTransactionSeen,
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount: txOverviewStats[tx].totalBlockCount,
          newAddressSeen: txOverviewStats[tx].newAddressSeen
        });
      } else {
        temp.push({
          date: txOverviewStats[tx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: txOverviewStats[tx].newTransactionSeen,
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount:
            txOverviewStats[tx].totalBlockCount -
            txOverviewStats[tx - 1].totalBlockCount,
          newAddressSeen: txOverviewStats[tx].newAddressSeen
        });
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].totalAddress,
          increment: txOverviewStats[tx].newAddressSeen
        });
      }
    }
    this.setState({
      txOverviewStats: temp.slice(0, 14),
      addressesStats: addressesTemp.slice(0, 14)
      //transactionPerDay: temp[temp.length - 2].totalTransaction,
      // blockHeight: blocks[0] ? blocks[0].number : 0,
      // totalAccounts: txOverviewStats[txOverviewStats.length-1].totalAddress,
    });
  }
  async loadAllData() {
    const allData = await Promise.all([
      Client.getTxOverviewStats(),
      xhr.get(`https://dappchainapi.tronscan.org/api/stats/overview`)
    ]).catch(e => {
      console.log("error:" + e);
    });
    const [
      { txOverviewStats },
      {
        data: { data }
      }
    ] = allData;
    let SunTxOverviewStats = data;

    /*
     *  SUN-Network
     */
    let SunTemp = [];
    let SunAddressesTemp = [];
    for (let suntxs in SunTxOverviewStats) {
      let suntx = parseInt(suntxs);
      if (suntx === 0) {
        SunAddressesTemp.push({
          date: SunTxOverviewStats[suntx].date,
          total: SunTxOverviewStats[suntx].totalAddress,
          increment: SunTxOverviewStats[suntx].newAddressSeen,
          name: "sun_network"
        });
        SunTemp.push({
          date: SunTxOverviewStats[suntx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: SunTxOverviewStats[suntx].newTransactionSeen,
          avgBlockTime: SunTxOverviewStats[suntx].avgBlockTime,
          avgBlockSize: SunTxOverviewStats[suntx].avgBlockSize,
          totalBlockCount: SunTxOverviewStats[suntx].totalBlockCount,
          newAddressSeen: SunTxOverviewStats[suntx].newAddressSeen,
          name: "sun_network"
        });
      } else {
        SunTemp.push({
          date: SunTxOverviewStats[suntx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: SunTxOverviewStats[suntx].newTransactionSeen,
          avgBlockTime: SunTxOverviewStats[suntx].avgBlockTime,
          avgBlockSize: SunTxOverviewStats[suntx].avgBlockSize,
          totalBlockCount:
            SunTxOverviewStats[suntx].totalBlockCount -
            SunTxOverviewStats[suntx - 1].totalBlockCount,
          newAddressSeen: SunTxOverviewStats[suntx].newAddressSeen,
          name: "sun_network"
        });
        SunAddressesTemp.push({
          date: SunTxOverviewStats[suntx].date,
          total: SunTxOverviewStats[suntx].totalAddress,
          increment: SunTxOverviewStats[suntx].newAddressSeen,
          name: "sun_network"
        });
      }
    }

    /*
     *  Main-Network
     */
    let temp = [];
    let addressesTemp = [];
    for (let txs in txOverviewStats) {
      let tx = parseInt(txs);
      if (tx === 0) {
        //temp.push(txOverviewStats[tx]);
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].totalAddress,
          increment: txOverviewStats[tx].newAddressSeen,
          name: "main_chain"
        });
        temp.push({
          date: txOverviewStats[tx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: txOverviewStats[tx].newTransactionSeen,
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount: txOverviewStats[tx].totalBlockCount,
          newAddressSeen: txOverviewStats[tx].newAddressSeen,
          name: "main_chain"
        });
      } else {
        temp.push({
          date: txOverviewStats[tx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: txOverviewStats[tx].newTransactionSeen,
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount:
            txOverviewStats[tx].totalBlockCount -
            txOverviewStats[tx - 1].totalBlockCount,
          newAddressSeen: txOverviewStats[tx].newAddressSeen,
          name: "main_chain"
        });
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].totalAddress,
          increment: txOverviewStats[tx].newAddressSeen,
          name: "main_chain"
        });
      }
    }

    let TotalAddressesTemp = [];
    let TotalTemp = [];
    for (let i = 0; i < SunAddressesTemp.length; i++) {
      for (let j = 0; j < addressesTemp.length; j++) {
        if (i == j) {
          TotalAddressesTemp.push({
            date: addressesTemp[j]["date"],
            total: addressesTemp[j]["total"] + SunAddressesTemp[i]["total"],
            increment:
              addressesTemp[j]["increment"] + SunAddressesTemp[i]["increment"],
            name: "TRON"
          });
        }
      }
    }
    for (let i = 0; i < SunTemp.length; i++) {
      for (let j = 0; j < temp.length; j++) {
        TotalTemp.push({
          date: temp[j]["date"],
          totalTransaction:
            temp[j]["totalTransaction"] + SunTemp[i]["totalTransaction"],
          name: "TRON"
        });
      }
    }

    this.setState({
      txOverviewStats: temp.slice(0, 14),
      addressesStats: addressesTemp.slice(0, 14),
      SunTxOverviewStats: SunTemp.slice(0, 14),
      SunAddressesStats: SunAddressesTemp.slice(0, 14),
      TotalAddressesStats: TotalAddressesTemp.slice(0, 14),
      TotalTxOverviewStats: TotalTemp.slice(0, 14)
    });
  }

  doSearch = async () => {
    let { intl } = this.props;
    let { search } = this.state;
    let type = getSearchType(search);

    let result = await doSearch(search, type);
    if (result !== null) {
      this.setState({
        hasFound: true
      });
      setTimeout(() => {
        window.location.hash = result;
      }, 600);
    } else {
      this.setState({
        search: "",
        isShaking: true
      });

      setTimeout(() => {
        this.setState({
          isShaking: false
        });
      }, 1000);

      toastr.warning(
        intl.formatMessage({ id: "warning" }),
        intl.formatMessage({ id: "search_not_found" })
      );
    }
  };

  onSearchKeyDown = ev => {
    if (ev.keyCode === KEY_ENTER) {
      this.doSearch();
    }
  };

  async componentDidMount() {
    const { intl } = this.props;
    // this.load();
    this.loadAllData();
    isMobile && this.loadAccounts();
    this.reconnect();
    isMobile && this.loadHomepageBundle();
    let { noticezhIEO, noticeenIEO } = this.state;
    const data = await Client20.getTRONNotice(intl.locale, { page: 3 });
    // intl.locale == "zh"? data.articles.unshift(noticezhIEO):data.articles.unshift(noticeenIEO);
    this.setState({ notice: data.articles });
  }

  async componentDidUpdate(prevProps) {
    const { wsdata, intl } = this.props;
    let { noticezhIEO, noticeenIEO } = this.state;
    if (wsdata !== prevProps.wsdata) {
      this.reconnect();
    }
    if (prevProps.intl.locale !== intl.locale) {
      const data = await Client20.getTRONNotice(intl.locale, { page: 3 });
      // intl.locale == "zh"? data.articles.unshift(noticezhIEO):data.articles.unshift(noticeenIEO);
      this.setState({ notice: data.articles });
    }
  }

  async loadTps() {
    if (!this.state.blockHeight) {
      let date = parseInt(new Date().getTime());
      let info = await Client.getTps(date);
      this.setState({
        maxTps: info.data.maxTps ? info.data.maxTps : 0,
        tps: info.data.currentTps ? info.data.currentTps : 0,
        blockHeight: info.data.blockHeight ? info.data.blockHeight : 0
      });
    }
  }

  componentWillUnmount() {
    //clearConstellations();
    //this.listener && this.listener.close();
    let { account, websocket } = this.props;
    // if(websocket){
    //     websocket.close();
    //     Lockr.set("websocket", 'close')
    // }
  }

  reconnect() {
    const { wsdata, websocket, setWebsocket } = this.props;
    const { blockHeight, tps } = this.state;
    const info = wsdata.type === "tps" && wsdata.data;
    if (info.maxTps) {
      this.setState({
        maxTps: info.maxTps ? info.maxTps : 0,
        tps: info.currentTps ? info.currentTps : 0,
        blockHeight: info.blockHeight ? info.blockHeight : 0,
        startblockHeight: blockHeight,
        startTps: tps
      });
    }
  }

  getLogo = () => {
    let { theme } = this.props;
    switch (theme) {
      case "tron":
        return require("../../images/tron-banner-tronblue.png");
      default:
        return require("../../images/tron-banner-1.png");
    }
  };

  render() {
    let { intl, activeLanguage } = this.props;
    let {
      search,
      isShaking,
      hasFound,
      onlineNodes,
      startblockHeight,
      startTps,
      blockHeight,
      transactionPerDay,
      totalAccounts,
      txOverviewStats,
      SunTxOverviewStats,
      TotalTxOverviewStats,
      addressesStats,
      SunAddressesStats,
      TotalAddressesStats,
      maxTps,
      tps
    } = this.state;

    return (
      <main className="home pb-0">
        {/* <i className="main-icon-left"></i>
          <i className="main-icon-right"></i> */}
        <div className="container-fluid position-relative d-flex pt-3 pt-md-4 mx-auto flex-column">
          {/*<div ref={(el) => this.$ref = el} style={{*/}
          {/*zIndex: 0,*/}
          {/*left: 0,*/}
          {/*right: 0,*/}
          {/*top: 0,*/}
          {/*bottom: 0,*/}
          {/*}} className="position-absolute"/>*/}

          <div className="container home-splash p-0 p-md-3">
            {IS_MAINNET ? (
              <div className="row justify-content-center text-center">
                <div className="col-12 exchange">
                  <div className="notice">
                    <img
                      src={require("../../images/announcement-logo.png")}
                      alt=""
                    />

                    <div className="notice-wrap">
                      {this.state.notice.length == 0
                        ? this.state.newNotice.map((v, i) => (
                            <a className="item" key={i}>
                              <span className="title"> - </span>
                              <span className="date"> </span>
                            </a>
                          ))
                        : null}
                      {this.state.notice.map((v, i) => (
                        <a
                          className={`item-${i} item`}
                          key={v.id}
                          href={v.html_url}
                          target="_blank"
                        >
                          <span title={v.name} className="title">
                            {v.name}
                          </span>
                          <span className="date">
                            ({v.created_at.substring(5, 10)})
                          </span>
                        </a>
                      ))}
                    </div>
                    {this.state.notice.length > 0 ? (
                      <a
                        href={
                          intl.locale == "zh"
                            ? "https://support.tronscan.org/hc/zh-cn/categories/360001618172-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83"
                            : "https://support.tronscan.org/hc/en-us/categories/360001621692-Announcements"
                        }
                        target="_blank"
                      >
                        {tu("learn_more")}>
                      </a>
                    ) : null}
                  </div>
                  {/*<p className="mt-5 mt-5-logo">*/}
                  {/*<img src={this.getLogo()}*/}
                  {/*className="animated ad-600ms zoomIn"/>*/}
                  {/*</p>*/}
                  {/*<h2 className="mb-5 text-muted animated fadeIn ad-1600ms" style={{fontSize: 32}}>*/}
                  {/*{tu("tron_main_message")}*/}
                  {/*</h2>*/}
                  {/*
                    <div className={
                      "input-group input-group-lg mb-4" +
                      (isShaking ? " animated shake " : "") +
                      (hasFound ? " animated bounceOut" : "")
                    }>
                      <input type="text"
                             className="form-control p-3 bg-tron-light  color-grey-100 border-0 box-shadow-none"
                             style={{fontSize: 13, borderRadius: 0}}
                             value={search}
                             onKeyDown={this.onSearchKeyDown}
                             onChange={ev => this.setState({search: ev.target.value})}
                             placeholder={intl.formatMessage({id: 'search_description'})}/>

                      <div className="input-group-append">
                        <button className="btn btn-search box-shadow-none" onClick={this.doSearch}
                                style={{borderRadius: 0}}>
                          <i className="fa fa-search"/>
                        </button>
                      </div>
                    </div>
                    */}
                </div>
              </div>
            ) : (
              ""
            )}

            {isMobile ? (
              <div className="row text-center mr-0 ml-0 mobile-home-state">
                <div
                  className="col-12  card  pt-1 mb-0"
                  style={{ border: "none", borderRadius: 0 }}
                >
                  <div className="row pt-3">
                    {IS_MAINNET ? (
                      <div className="col-6 ">
                        <Link
                          to="/blockchain/nodes"
                          className="hvr-underline-from-center hvr-underline-white text-muted"
                        >
                          <img src={require("../../images/home/node.png")} />
                          {onlineNodes != 0 ? (
                            <h2>
                              <CountUp
                                start={0}
                                end={onlineNodes}
                                duration={1}
                              />
                            </h2>
                          ) : (
                            <h2>-</h2>
                          )}
                          <p className="m-0">{tu("online_nodes")}</p>
                        </Link>
                      </div>
                    ) : null}
                    <div className="col-6">
                      <Link
                        to="/blockchain/blocks"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        <img src={require("../../images/home/block.png")} />

                        {blockHeight != 0 ? (
                          <h2>
                            <CountUp
                              start={startblockHeight}
                              end={blockHeight}
                              duration={1}
                            />
                          </h2>
                        ) : (
                          <h2>-</h2>
                        )}
                        <p className="m-0">{tu("block_height")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <div
                        href="javascript:;"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        <img src={require("../../images/home/tps.png")} />
                        {maxTps ? (
                          <h2>
                            <CountUp start={0} end={tps} duration={1} />/
                            <CountUp start={0} end={maxTps} duration={1} />
                          </h2>
                        ) : (
                          <h2>-</h2>
                        )}
                        <p className="m-0">{tu("current_MaxTPS")}</p>
                      </div>
                    </div>

                    <div className="col-6">
                      <Link
                        to="/blockchain/transactions"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        <img
                          src={require("../../images/home/transctions.png")}
                        />
                        {transactionPerDay != 0 ? (
                          <h2>
                            <CountUp
                              start={0}
                              end={transactionPerDay}
                              duration={1}
                            />
                          </h2>
                        ) : (
                          <h2>-</h2>
                        )}
                        <p className="m-0">{tu("transactions_last_day")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link
                        to="/blockchain/accounts"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        <img src={require("../../images/home/account.png")} />

                        {totalAccounts != 0 ? (
                          <h2>
                            <CountUp
                              start={0}
                              end={totalAccounts}
                              duration={1}
                            />
                          </h2>
                        ) : (
                          <h2>-</h2>
                        )}
                        <p className="m-0">{tu("total_accounts")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <HrefLink
                        href="https://coinmarketcap.com/currencies/tron/"
                        target="_blank"
                        className="hvr-underline-from-center hvr-underline-white text-muted"
                      >
                        <img src={require("../../images/home/price.png")} />
                        <h2>
                          <TRXPrice amount={1} currency="USD" source="home" />
                        </h2>
                        <p className="m-0">{tu("pice_per_1trx")}</p>
                      </HrefLink>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <PaneGroup></PaneGroup>
            )}
          </div>
        </div>
        <div className=" pb-3 pb-md-5">
          <div className="container">
            {isMobile ? (
              <div className="row mt-0 mt-md-4 mb-3">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card " style={styles.card}>
                    <div
                      className="card-header bg-tron-light pb-0"
                      style={styles.card}
                    >
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/txOverviewStats">
                          {tu("14_day_transaction_history")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0">
                      <div style={{ minWidth: 255, height: 140 }}>
                        {txOverviewStats === null ? (
                          <TronLoader />
                        ) : (
                          <LineReactHighChartTx
                            style={{ minWidth: 255, height: 140 }}
                            data={txOverviewStats}
                            intl={intl}
                            source="home"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card" style={styles.card}>
                    <div
                      className="card-header bg-tron-light pb-0"
                      style={styles.card}
                    >
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/addressesStats">
                          {tu("14_day_address_growth")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0">
                      <div style={{ minWidth: 255, height: 140 }}>
                        {addressesStats === null ? (
                          <TronLoader />
                        ) : (
                          <LineReactHighChartAdd
                            style={{ minWidth: 255, height: 140 }}
                            data={addressesStats}
                            intl={intl}
                            source="home"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row mt-0 mt-md-4 mb-3">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card " style={styles.card}>
                    <div
                      className="card-header bg-tron-light color-grey-100 text-center pb-0"
                      style={styles.card}
                    >
                      <h5 className="mt-1 lh-150">
                        {/*<Link to="blockchain/stats/txOverviewStats">*/}
                        {/*{tu("14_day_transaction_history")}*/}
                        {/*</Link>*/}
                        <span className="color-tron-100">
                          {tu("14_day_transaction_history")}
                        </span>
                      </h5>
                    </div>
                    <div
                      className="card-body pt-0"
                      style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                    >
                      <div
                        style={
                          IS_MAINNET
                            ? { minWidth: 255, height: 260 }
                            : { minWidth: 255, height: 200 }
                        }
                      >
                        {txOverviewStats === null ? (
                          <TronLoader />
                        ) : IS_MAINNET ? (
                          <LineReactHighChartHomeTx
                            style={{ minWidth: 255, height: 260 }}
                            data={txOverviewStats}
                            sun={SunTxOverviewStats}
                            total={TotalTxOverviewStats}
                            intl={intl}
                            source="home"
                          />
                        ) : (
                          <LineReactHighChartTx
                            style={{ minWidth: 255, height: 200 }}
                            data={txOverviewStats}
                            intl={intl}
                            source="home"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card" style={styles.card}>
                    <div
                      className="card-header bg-tron-light color-grey-100 text-center pb-0"
                      style={styles.card}
                    >
                      <h5 className="mt-1 lh-150">
                        {/*<Link to="blockchain/stats/addressesStats">*/}
                        {/*{tu("14_day_address_growth")}*/}
                        {/*</Link>*/}
                        <span className="color-tron-100">
                          {tu("14_day_address_growth")}
                        </span>
                      </h5>
                    </div>
                    <div
                      className="card-body pt-0"
                      style={{ paddingLeft: "2rem", paddingRight: "2rem" }}
                    >
                      <div
                        style={
                          IS_MAINNET
                            ? { minWidth: 255, height: 260 }
                            : { minWidth: 255, height: 200 }
                        }
                      >
                        {addressesStats === null ? (
                          <TronLoader />
                        ) : IS_MAINNET ? (
                          <LineReactHighChartHomeAddress
                            style={{ minWidth: 255, height: 260 }}
                            data={addressesStats}
                            sun={SunAddressesStats}
                            total={TotalAddressesStats}
                            intl={intl}
                            source="home"
                          />
                        ) : (
                          <LineReactHighChartAdd
                            style={{ minWidth: 255, height: 200 }}
                            data={addressesStats}
                            intl={intl}
                            source="home"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row mt-0 mt-md-4">
              <div className="col-md-6 mt-0 mb-3 mt-md-0 text-center">
                <RecentBlocks />
              </div>
              <div className="col-md-6 text-center">
                <RecentTransfers />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

const styles = {
  list: {
    fontSize: 18
  },
  card: {
    border: "none",
    borderRadius: 0
  }
};

function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    account: state.app.account,
    theme: state.app.theme,
    activeLanguage: state.app.activeLanguage,
    wsdata: state.account.wsdata
  };
}

const mapDispatchToProps = {
  setWebsocket
};
