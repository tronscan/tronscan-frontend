import React, {Component} from 'react';
import {connect} from "react-redux";
import xhr from "axios/index";
import {injectIntl} from "react-intl";
import {doSearch, getSearchType} from "../../services/search";
import CountUp from 'react-countup';
import {channel, Client, Client20} from "../../services/api";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import RecentBlocks from "./RecentBlocks";
import {KEY_ENTER} from "../../utils/constants";
import {withTimers} from "../../utils/timing";
import isMobile from "../../utils/isMobile";
import RecentTransfers from "./RecentTransfers";
import {tu} from "../../utils/i18n";
import {toastr} from "react-redux-toastr";
import {HrefLink} from "../common/Links";
import {TronLoader} from "../common/loaders";
import {LineReactHighChartAdd, LineReactHighChartTx} from "../common/LineCharts";
import {API_URL} from "../../constants";

@connect(
  state => (
    {
        blocks: state.blockchain.blocks,
        account: state.app.account,
        theme: state.app.theme,
        activeLanguage: state.app.activeLanguage,
        wsdata: state.account.wsdata
    }
  ),
)
@withTimers
@injectIntl
export default class Home extends Component {

  constructor() {
    super();
    this.listener = null;
    this.state = {
      search: '',
      isShaking: false,
      hasFound: false,
      totalAccounts: 0,
      onlineNodes: 0,
      blockHeight: 0,
      transactionPerDay: 0,
      txOverviewStats: null,
      addressesStats: null,
      maxTps: 0,
      tps: 0,
      notice: [],
      noticezhIEO:{
          id:1,
          html_url:"https://www.tronace.com?utm_source=TS1",
          name:"TRXMarket LaunchBase 瞩目呈现 ACE重磅登陆",
          created_at: "2019-04-09T12:00:00Z",
      },
      noticeenIEO:{
          id:1,
          html_url:"https://www.tronace.com?utm_source=TS1",
          name:"TRXMarket LaunchBase grand open ACE is waiting for you",
          created_at: "2019-04-09T12:00:00Z"
      },
    };
  }

  async loadNodes() {

    // let {total} = await Client.getNodeLocations();
    let {data} = await xhr.get(`${API_URL}/api/node`);
    this.setState({
      onlineNodes: data.total
    })
  }

  async loadAccounts() {
    let { totalAccounts } = await Client.getAccounts();
    this.setState({
      totalAccounts: totalAccounts
    })
  }

  async load() {

    let {blocks} = await Client.getBlocks({
      limit: 1,
      sort: '-number',
    });

    let { txOverviewStats } = await Client.getTxOverviewStats();
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
            totalTransaction: txOverviewStats[tx].newTransactionSeen ,
            avgBlockTime: txOverviewStats[tx].avgBlockTime,
            avgBlockSize: txOverviewStats[tx].avgBlockSize,
            totalBlockCount: txOverviewStats[tx].totalBlockCount,
            newAddressSeen: txOverviewStats[tx].newAddressSeen
        });
      }
      else {
        temp.push({
          date: txOverviewStats[tx].date,
          // totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          totalTransaction: txOverviewStats[tx].newTransactionSeen ,
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
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
      addressesStats: addressesTemp.slice(0, 14),
      transactionPerDay: temp[temp.length - 2].totalTransaction,
      blockHeight: blocks[0] ? blocks[0].number : 0,
      totalAccounts: txOverviewStats[txOverviewStats.length-1].totalAddress,
    });
  }

  doSearch = async () => {
    let {intl} = this.props;
    let {search} = this.state;
    let type = getSearchType(search);

    let result = await doSearch(search, type);
    if (result !== null) {
      this.setState({
        hasFound: true,
      });
      setTimeout(() => {
        window.location.hash = result;
      }, 600);
    } else {
      this.setState({
        search: '',
        isShaking: true,
      });

      setTimeout(() => {
        this.setState({
          isShaking: false,
        });
      }, 1000);

      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'search_not_found'}));
    }
  }

  onSearchKeyDown = (ev) => {
    if (ev.keyCode === KEY_ENTER) {
      this.doSearch();
    }
  };

  async componentDidMount() {
    this.loadNodes();
    this.load();
    this.reconnect();

    let { intl } = this.props;
    let { noticezhIEO, noticeenIEO } = this.state;
    const data = await Client20.getTRONNotice(intl.locale, { page: 2 });
    intl.locale == "zh"? data.articles.unshift(noticezhIEO):data.articles.unshift(noticeenIEO);
    this.setState({ notice: data.articles });
    // constellationPreset(this.$ref, "Hot Sparks");

    // this.props.setInterval(() => {
    //   this.load();
    // }, 6000);
  }

  async  componentDidUpdate(prevProps) {
    const {wsdata, intl} = this.props;
    let { noticezhIEO, noticeenIEO } = this.state;
    if (wsdata !== prevProps.wsdata) {
      this.reconnect();
    }
    if (prevProps.intl.locale !== intl.locale) {
        const data = await Client20.getTRONNotice(intl.locale, { page: 2 });
        intl.locale == "zh"? data.articles.unshift(noticezhIEO):data.articles.unshift(noticeenIEO);
        this.setState({ notice: data.articles });
    }
  }



  componentWillUnmount() {
    //clearConstellations();
    this.listener && this.listener.close();
  }

  reconnect() {
    const {wsdata} = this.props
    const info = wsdata.type === 'tps'&& wsdata.data

    this.setState({
      maxTps:info.maxTps?info.maxTps:0,
      tps:info.currentTps?info.currentTps:0,
      blockHeight:info.blockHeight?info.blockHeight:0,
    })
  }

  getLogo = () => {
    let {theme} = this.props;
    switch (theme) {
      case "tron":
        return require("../../images/tron-banner-tronblue.png");
      default:
        return require("../../images/tron-banner-1.png");
    }
  };

  render() {
    let {intl, activeLanguage} = this.props;
    let {search, isShaking, hasFound, onlineNodes, blockHeight, transactionPerDay, totalAccounts, txOverviewStats, addressesStats,maxTps,tps} = this.state;
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
              <div className="row justify-content-center text-center">
                <div className="col-12 exchange">
                  <div className="notice">
                    <img src={require("../../images/announcement-logo.png")} alt="" />
                    <div className="notice-wrap">
                        {this.state.notice.map((v, i) => (
                            <a
                                className="item"
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
                                      ? "https://support.trx.market/hc/zh-cn/categories/360001523732-Announcements"
                                      : "https://support.trx.market/hc/en-us/categories/360001523732-Announcements"
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
                    */
                  }
                </div>
              </div>
              {
                isMobile?
              <div className="row text-center mr-0 ml-0 mobile-home-state">
                <div className="col-12  card  pt-1 mb-0" style={{border: 'none', borderRadius: 0}}>
                  <div className="row pt-3">
                    <div className="col-6 ">
                      <Link to="/blockchain/nodes" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <img src={require('../../images/home/node.png')}/>
                        <h2><CountUp start={0} end={onlineNodes} duration={1}/></h2>
                        <p className="m-0">{tu("online_nodes")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/blockchain/blocks"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <img src={require('../../images/home/block.png')}/>
                        <h2><CountUp start={0} end={blockHeight} duration={1}/></h2>
                        <p className="m-0">{tu("block_height")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <div href="javascript:;" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <img src={require('../../images/home/tps.png')}/>
                        <h2><CountUp start={0} end={tps} duration={1}/>/<CountUp start={0} end={maxTps} duration={1}/></h2>
                        <p className="m-0">{tu("current_MaxTPS")}</p>
                      </div>
                    </div>
                   
                    <div className="col-6">
                      <Link to="/blockchain/transactions"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <img src={require('../../images/home/transctions.png')}/>
                        <h2><CountUp start={0} end={transactionPerDay} duration={1}/></h2>
                        <p className="m-0">{tu("transactions_last_day")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to="/blockchain/accounts"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <img src={require('../../images/home/account.png')}/>
                        <h2><CountUp start={0} end={totalAccounts} duration={1}/></h2>
                        <p className="m-0">{tu("total_accounts")}</p>
                      </Link>
                    </div>
                    <div className="col-6">
                        <HrefLink href="https://coinmarketcap.com/currencies/tron/" target="_blank" className="hvr-underline-from-center hvr-underline-white text-muted">
                          <img src={require('../../images/home/price.png')}/>
                          <h2><TRXPrice amount={1} currency="USD" source="home"/></h2>
                          <p className="m-0">{tu("pice_per_1trx")}</p>
                        </HrefLink>
                    </div>
                    
                  </div>
                </div>
              </div>
              :
              <div className="row text-center mr-0 ml-0">
                <div className="col-12  card  pt-1 pl-0 pr-0" style={{border: 'none', borderRadius: 0}}>
                  <div className="card-body d-flex pt-4 pb-4 home-stats">
                    <div className="col-md-2 col-sm-12 col-xs-12 ">
                      <Link to="/blockchain/nodes" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={onlineNodes} duration={1}/></h2>
                        <p className="m-0">{tu("online_nodes")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2 col-sm-12 col-xs-12">
                      <Link to="/blockchain/blocks"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={blockHeight} duration={1}/></h2>
                        <p className="m-0">{tu("block_height")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2 col-sm-12 col-xs-12">
                      <div href="javascript:;" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={tps} duration={1}/>/<CountUp start={0} end={maxTps} duration={1}/></h2>
                        <p className="m-0">{tu("current_MaxTPS")}</p>
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-12 col-xs-12">
                      <Link to="/blockchain/transactions"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={transactionPerDay} duration={1}/></h2>
                        <p className="m-0">{tu("transactions_last_day")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2 col-sm-12 col-xs-12">
                      <Link to="/blockchain/accounts"
                            className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={totalAccounts} duration={1}/></h2>
                        <p className="m-0">{tu("total_accounts")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2 col-sm-12 col-xs-12">
                        <HrefLink href="https://coinmarketcap.com/currencies/tron/" target="_blank" className="hvr-underline-from-center hvr-underline-white text-muted">
                          <h2><TRXPrice amount={1} currency="USD" source="home"/></h2>
                          <p className="m-0">{tu("pice_per_1trx")}</p>
                        </HrefLink>
                    </div>
                  </div>
                </div>
              </div>
              }
              
            </div>
          </div>
          <div className=" pb-3 pb-md-5">
            <div className="container">
            {
              isMobile? 
              <div className="row mt-0 mt-md-4 mb-3">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card " style={styles.card}>
                    <div className="card-header bg-tron-light pb-0" style={styles.card}>
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/txOverviewStats">
                          {tu("14_day_transaction_history")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0">

                      <div style={{minWidth: 255, height: 140}}>
                        {
                          txOverviewStats === null ?
                              <TronLoader/> :
                              <LineReactHighChartTx style={{minWidth: 255, height: 140}} data={txOverviewStats}
                                                    intl={intl} source='home'/>
                        }
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card" style={styles.card}>
                    <div className="card-header bg-tron-light pb-0" style={styles.card}>
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/addressesStats">
                          {tu("14_day_address_growth")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0">

                      <div style={{minWidth: 255, height: 140}}>
                        {
                          addressesStats === null ?
                              <TronLoader/> :
                              <LineReactHighChartAdd style={{minWidth: 255, height: 140}} data={addressesStats}
                                                     intl={intl} source='home'/>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : 
              <div className="row mt-0 mt-md-4 mb-3">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card " style={styles.card}>
                    <div className="card-header bg-tron-light color-grey-100 text-center pb-0" style={styles.card}>
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/txOverviewStats">
                          {tu("14_day_transaction_history")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0" style={{paddingLeft: '2rem', paddingRight: '2rem'}}>

                      <div style={{minWidth: 255, height: 200}}>
                        {
                          txOverviewStats === null ?
                              <TronLoader/> :
                              <LineReactHighChartTx style={{minWidth: 255, height: 200}} data={txOverviewStats}
                                                    intl={intl} source='home'/>
                        }
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card" style={styles.card}>
                    <div className="card-header bg-tron-light color-grey-100 text-center pb-0" style={styles.card}>
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/addressesStats">
                          {tu("14_day_address_growth")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body pt-0" style={{paddingLeft: '2rem', paddingRight: '2rem'}}>

                      <div style={{minWidth: 255, height: 200}}>
                        {
                          addressesStats === null ?
                              <TronLoader/> :
                              <LineReactHighChartAdd style={{minWidth: 255, height: 200}} data={addressesStats}
                                                     intl={intl} source='home'/>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
             
              <div className="row mt-0 mt-md-4">
                <div className="col-md-6 mt-0 mb-3 mt-md-0 text-center">
                  <RecentBlocks/>
                </div>
                <div className="col-md-6 text-center">
                  <RecentTransfers/>
                </div>
              </div>
            </div>
          </div>

        </main>
    )
  }
}




const styles = {
  list: {
    fontSize: 18,
  },
  card: {
    border: 'none',
    borderRadius: 0
  }
}

function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    account: state.app.account,
    theme: state.app.theme,
    activeLanguage: state.app.activeLanguage,
    wsdata: state.account.wsdata
  };
}

const mapDispatchToProps = {};


