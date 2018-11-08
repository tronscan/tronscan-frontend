import React, {Component} from 'react';
import {connect} from "react-redux";
import xhr from "axios/index";
import {injectIntl} from "react-intl";
import {doSearch, getSearchType} from "../../services/search";
import CountUp from 'react-countup';
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import RecentBlocks from "./RecentBlocks";
import {KEY_ENTER} from "../../utils/constants";
import {withTimers} from "../../utils/timing";
import RecentTransfers from "./RecentTransfers";
import {tu} from "../../utils/i18n";
import {toastr} from "react-redux-toastr";
import {HrefLink} from "../common/Links";
import {TronLoader} from "../common/loaders";
import {LineReactHighChartTx, LineReactHighChartAdd} from "../common/LineCharts";
import {channel} from "../../services/api";

const subDays = require("date-fns/sub_days");

class Home extends Component {

  constructor() {
    super();
    this.state = {
      search: '',
      isShaking: false,
      hasFound: false,
      totalAccounts: 0,
      onlineNodes: 0,
      blockHeight: 0,
      transactionPerDay: 0,
      txOverviewStats: null,
      addressesStats: null
    };
  }

  async loadNodes() {
    // let {total} = await Client.getNodeLocations();
    let {data} = await xhr.get("https://server.tron.network/api/v2/node/nodemap?total=1");
    this.setState({
      onlineNodes: data.total
    })
  }

  async loadAccounts() {
    let { totalAccounts } = await Client.getAccounts();
    // let accountData = await xhr.get("http://18.216.57.65:20110/api/account");
    // let totalAccounts = accountData.total;
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
    // let overviewData = await xhr.get("http://18.216.57.65:20110/api/stats/overview");
    // let txOverviewStats = overviewData.data.data;
    let temp = [];
    let addressesTemp = [];
    for (let txs in txOverviewStats) {
      let tx = parseInt(txs);
      if (tx === 0) {
        temp.push(txOverviewStats[tx]);
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].newAddressSeen,
          increment: txOverviewStats[tx].newAddressSeen
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
      txOverviewStats: temp.slice(temp.length - 15, temp.length - 1),
      addressesStats: addressesTemp.slice(addressesTemp.length - 14, addressesTemp.length),
      transactionPerDay: temp[temp.length - 2].totalTransaction,
      blockHeight: blocks[0] ? blocks[0].number : 0,
      totalAccounts: txOverviewStats[txOverviewStats.length-1].totalAddress
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

  componentDidMount() {
    this.loadNodes();
    this.load();
    this.reconnect();
    // constellationPreset(this.$ref, "Hot Sparks");

    // this.props.setInterval(() => {
    //   this.load();
    // }, 6000);
  }



  componentWillUnmount() {
    //clearConstellations();
    this.listener && this.listener.close();
  }

  reconnect() {
      this.listener && this.listener.close();
      this.listener = channel("/tronblock");
      this.listener.on("tron-block", info => {
          this.setState({
              maxTps:info.maxTps,
              tps:info.tps,
              blockHeight:info.maxBlock,
          })
      });
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
          <i className="main-icon-left"></i>
          <i className="main-icon-right"></i>
          <div className="container-fluid position-relative d-flex pt-4 mx-auto flex-column">
            {/*<div ref={(el) => this.$ref = el} style={{*/}
            {/*zIndex: 0,*/}
            {/*left: 0,*/}
            {/*right: 0,*/}
            {/*top: 0,*/}
            {/*bottom: 0,*/}
            {/*}} className="position-absolute"/>*/}
            <div className="container home-splash">
              <div className="row justify-content-center text-center">
                <div className="col-12">
                  {/*<p className="mt-5 mt-5-logo">*/}
                  {/*<img src={this.getLogo()}*/}
                  {/*className="animated ad-600ms zoomIn"/>*/}
                  {/*</p>*/}
                  {/*<h2 className="mb-5 text-muted animated fadeIn ad-1600ms" style={{fontSize: 32}}>*/}
                  {/*{tu("tron_main_message")}*/}
                  {/*</h2>*/}
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
                </div>
              </div>

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
                    <div className="col-md-2 col-sm-6">
                      <Link to="/blockchain/stats/supply" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><CountUp start={0} end={tps} duration={1}/>/<CountUp start={0} end={maxTps} duration={1}/></h2>
                        <p className="m-0">{tu("current_MaxTPS")}</p>
                      </Link>
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
            </div>
          </div>
          <div className="pb-5">
            <div className="container">
              <div className="row mt-4">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card" style={styles.card}>
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
              <div className="row mt-4">
                <div className="col-md-6 mt-3 mt-md-0 text-center">
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
    account: state.app.account,
    theme: state.app.theme,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(Home)))
