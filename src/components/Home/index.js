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

      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'record_not_found'}));
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
    // constellationPreset(this.$ref, "Hot Sparks");

    // this.props.setInterval(() => {
    //   this.load();
    // }, 6000);
  }


  componentWillUnmount() {
    //clearConstellations();
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
    let {search, isShaking, hasFound, onlineNodes, blockHeight, transactionPerDay, totalAccounts, txOverviewStats, addressesStats} = this.state;
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
                      <Link to="/nodes" className="hvr-underline-from-center hvr-underline-white text-muted">
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
                    <div className="col-md-3 col-sm-12 col-xs-12">
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

                    <div className="col-md-3 col-sm-12 col-xs-12">
                      <Link to="/markets" className="hvr-underline-from-center hvr-underline-white text-muted">
                        <h2><TRXPrice amount={1} currency="USD" source="home"/></h2>
                        <p className="m-0">{tu("pice_per_1trx")}</p>
                      </Link>
                    </div>
                    {/*<div className="col-md-2 col-sm-6">*/}
                    {/*<Link to="/blockchain/stats/supply" className="hvr-underline-from-center hvr-underline-white text-muted">*/}
                    {/*<h2><TRXBurned /></h2>*/}
                    {/*<p className="m-0">{tu("burned_trx")}</p>*/}
                    {/*</Link>*/}
                    {/*</div>*/}
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
          <div className="pt-5 home-footer">
            <div className="container">
              <div className="row text-center text-xs-center text-sm-left text-md-left">
                <div className="col-xs-12 col-sm-4 col-md-4">
                  <h5>TRON</h5>
                  <div className="line"></div>
                  <ul className="list-unstyled quick-links pt-3">
                    <li className="p-2"><HrefLink href="https://stateoftrondapps.com/"><i
                        className="fa fa-angle-right mr-4"/> DApps</HrefLink></li>
                    <li className="p-2"><HrefLink
                        href={activeLanguage == 'zh' ? 'https://tron.network/exchangesList?lng=zh' : 'https://tron.network/exchangesList?lng=en'}><i
                        className="fa fa-angle-right mr-4"/> List TRX</HrefLink></li>
                    <li className="p-2"><HrefLink href="https://medium.com/@Tronfoundation"><i
                        className="fa fa-angle-right mr-4"/> TRON Labs</HrefLink>
                    </li>
                    <li className="p-2"><HrefLink href="https://www.facebook.com/tronfoundation/"><i
                        className="fa fa-angle-right mr-4"/> Facebook</HrefLink></li>
                    <li className="p-2"><HrefLink href="https://twitter.com/tronfoundation"><i
                        className="fa fa-angle-right mr-4"/> Twitter</HrefLink></li>
                    <li className="p-2"><HrefLink href="https://tronfoundation.slack.com/"><i
                        className="fa fa-angle-right mr-4"/> Slack</HrefLink></li>
                    <li className="p-2"><HrefLink href="https://www.reddit.com/r/tronix"><i
                        className="fa fa-angle-right mr-4"/> Reddit</HrefLink></li>
                  </ul>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-4">
                  <h5>Development</h5>
                  <div className="line"></div>
                  <ul className="list-unstyled quick-links pt-3">
                    <li className="p-2"><HrefLink href="https://github.com/tronprotocol"><i
                        className="fa fa-angle-right mr-4"/> Github</HrefLink></li>
                    <li className="p-2"><HrefLink href="https://github.com/tronprotocol/java-tron"><i
                        className="fa fa-angle-right mr-4"/> java-tron</HrefLink></li>
                    <li className="p-2">
                      <HrefLink href="https://github.com/tronprotocol/Documentation">
                        <i className="fa fa-angle-right mr-4"/> Documentation
                      </HrefLink>
                    </li>
                    <li className="p-2"><HrefLink href="http://wiki.tron.network/en/latest/"><i
                        className="fa fa-angle-right mr-4"/> Wiki</HrefLink></li>
                  </ul>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-4">
                  <h5>Quick links</h5>
                  <div className="line"></div>
                  <ul className="list-unstyled quick-links pt-3">
                    <li className="p-2"><Link to="/votes"><i
                        className="fa fa-angle-right mr-4"/> {tu("vote_for_super_representatives")}
                    </Link></li>
                    <li className="p-2"><Link to="/representatives"><i
                        className="fa fa-angle-right mr-4"/> {tu("view_super_representatives")}</Link></li>
                    <li className="p-2"><Link to="/wallet/new"><i
                        className="fa fa-angle-right mr-4"/> {tu("create_new_wallet")}</Link></li>
                    <li className="p-2"><Link to="/tokens/view"><i
                        className="fa fa-angle-right mr-4"/> {tu("view_tokens")}</Link></li>
                    <li className="p-2"><Link to="/help/copyright"><i
                        className="fa fa-angle-right mr-4"/> {tu("copyright")}</Link></li>
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <ul className="list-unstyled list-inline social text-center" style={{marginBottom: 4}}>
                    <li className="list-inline-item">
                      <HrefLink href="https://www.facebook.com/tronfoundation/"><i
                          className="fab fa-facebook"/></HrefLink>
                    </li>
                    <li className="list-inline-item">
                      <HrefLink href="https://www.github.com/tronprotocol"><i className="fab fa-github"/></HrefLink>
                    </li>
                    <li className="list-inline-item">
                      <HrefLink href="https://twitter.com/tronfoundation"><i className="fab fa-twitter"/></HrefLink>
                    </li>
                    <li className="list-inline-item">
                      <HrefLink href="mailto:service@tron.network" target="_blank"><i
                          className="fa fa-envelope"/></HrefLink>
                    </li>
                    <li className="list-inline-item">
                      <HrefLink href="https://www.reddit.com/r/Tronix" target="_blank"><i
                          className="fab fa-reddit-alien"/></HrefLink>
                    </li>
                  </ul>
                </div>
                <hr/>
              </div>
              <div className="row ">
                <div className="col-xs-12 col-sm-12 col-md-12 text-center mb-3">
                  <Link to="/help/copyright">Copyright© 2017-2018 {tu("tron_foundation")}</Link>
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
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(Home)))
