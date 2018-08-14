import React, {Component} from 'react';
import {connect} from "react-redux";
import xhr from "axios/index";
import {injectIntl} from "react-intl";
import {doSearch, getSearchType} from "../../services/search";
import {clearConstellations, constellationPreset} from "../../lib/constellation/constellation";
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
import {LineReactAdd, LineReactTx} from "../common/LineCharts";

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
    let {data} = await xhr.get("https://tron.network/api/v2/node/nodemap");
    this.setState({
      onlineNodes: data.data.length
    })
  }

  async loadAccounts() {
    let totalAccounts = await Client.getAccounts();
    this.setState({
      totalAccounts: totalAccounts.total
    })
  }

  async load() {

    let {blocks} = await Client.getBlocks({
      limit: 1,
      sort: '-number',
    });

    /* let {total: totalTransactions} = await Client.getTransfers({
       limit: 1,
       date_start: subDays(new Date(), 1),
     });
    */

    let {txOverviewStats} = await Client.getTxOverviewStats();

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
          totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
          newAddressSeen: txOverviewStats[tx].newAddressSeen
        });
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].newAddressSeen + addressesTemp[tx - 1].total,
          increment: txOverviewStats[tx].newAddressSeen
        });
      }
    }

    this.setState({
      txOverviewStats: temp.slice(temp.length - 14, temp.length),
      addressesStats: addressesTemp,
      transactionPerDay: temp[temp.length - 1].totalTransaction,
      blockHeight: blocks[0] ? blocks[0].number : 0
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
    this.loadAccounts();
    this.load();
    constellationPreset(this.$ref, "Hot Sparks");

    // this.props.setInterval(() => {
    //   this.load();
    // }, 6000);
  }

  componentWillUnmount() {
    clearConstellations();
  }

  getLogo = () => {
    let {theme} = this.props;
    switch (theme) {
      case "tron":
        return require("../../images/tron-banner-tronblue.png");
      default:
        return require("../../images/tron-banner-inverted.png");
    }
  };

  render() {
    let {intl} = this.props;
    let {search, isShaking, hasFound, onlineNodes, blockHeight, transactionPerDay, totalAccounts, txOverviewStats, addressesStats} = this.state;

    return (
        <main className="home pb-0">
          <div className="container-fluid position-relative d-flex p-3 mx-auto flex-column">
            <div ref={(el) => this.$ref = el} style={{
              zIndex: 0,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }} className="position-absolute"/>
            <div className="container home-splash">
              <div className="row justify-content-center text-center">
                <div className="col-12 col-sm-8 col-lg-6">
                  <p className="mt-5">
                    <img src={this.getLogo()}
                         style={styles.logo}
                         className="animated ad-600ms zoomIn"/>
                  </p>
                  <h2 className="mb-5 mt-4 text-muted animated fadeIn ad-1600ms" style={{fontSize: 32}}>
                    {tu("tron_main_message")}
                  </h2>
                  <div className={
                    "input-group input-group-lg pb-5 mb-5 " +
                    (isShaking ? " animated shake " : "") +
                    (hasFound ? " animated bounceOut" : "")
                  }>
                    <input type="text"
                           className="form-control p-3 bg-dark text-white border-0 box-shadow-none"
                           style={{fontSize: 13}}
                           value={search}
                           onKeyDown={this.onSearchKeyDown}
                           onChange={ev => this.setState({search: ev.target.value})}
                           placeholder={intl.formatMessage({id: 'search_description'})}/>

                    <div className="input-group-append">
                      <button className="btn btn-dark box-shadow-none" onClick={this.doSearch}>
                        <i className="fa fa-search"/>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              <div className="row text-center home-stats ">
                <div className="col-md-2">
                  <Link to="/nodes" className="hvr-underline-from-center hvr-underline-white text-muted">
                    <h2><CountUp start={0} end={onlineNodes} duration={1}/></h2>
                    <p>{tu("online_nodes")}</p>
                  </Link>
                </div>
                <div className="col-md-3 ">
                  <Link to="/blockchain/blocks" className="hvr-underline-from-center hvr-underline-white text-muted">
                    <h2><CountUp start={0} end={blockHeight} duration={1}/></h2>
                    <p>{tu("block_height")}</p>
                  </Link>
                </div>
                <div className="col-md-2 ">
                  <Link to="/blockchain/transactions"
                        className="hvr-underline-from-center hvr-underline-white text-muted">
                    <h2><CountUp start={0} end={transactionPerDay} duration={1}/></h2>
                    <p>{tu("transactions_last_day")}</p>
                  </Link>
                </div>
                <div className="col-md-3 ">
                  <Link to="/blockchain/accounts" className="hvr-underline-from-center hvr-underline-white text-muted">
                    <h2><CountUp start={0} end={totalAccounts} duration={1}/></h2>
                    <p>{tu("total_accounts")}</p>
                  </Link>
                </div>
                <div className="col-md-2 ">
                  <Link to="/markets" className="hvr-underline-from-center hvr-underline-white text-muted">
                    <h2><TRXPrice amount={1000} currency="USD"/></h2>
                    <p>{tu("pice_per_1000trx")}</p>
                  </Link>
                </div>

              </div>
            </div>
          </div>
          <div className="pb-5">
            <div className="container">
              <div className="row mt-3">
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card">
                    <div className="card-header bg-dark text-white d-flex">
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/txOverviewStats" style={{color: 'white'}}>
                          {tu("past_14_days_of_transactions")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body">

                      <div style={{height: 250}}>
                        {
                          txOverviewStats === null ?
                              <TronLoader/> :
                              <LineReactTx style={{height: 250}} data={txOverviewStats} intl={intl} source='home'/>
                        }
                      </div>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 mt-3 mt-md-0 ">
                  <div className="card">
                    <div className="card-header bg-dark text-white d-flex">
                      <h5 className="m-0 lh-150">
                        <Link to="blockchain/stats/addressesStats" style={{color: 'white'}}>
                          {tu("address_growth")}
                        </Link>
                      </h5>
                    </div>
                    <div className="card-body">

                      <div style={{height: 250}}>
                        {
                          addressesStats === null ?
                              <TronLoader/> :
                              <LineReactAdd style={{height: 250}} data={addressesStats} intl={intl} source='home'/>
                        }
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div className="row mt-3">
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
                <div className="col-md-2">
                  &nbsp;
                </div>
                <div className="col-xs-12 col-sm-4 col-md-3">
                  <h5>TRON</h5>
                  <ul className="list-unstyled quick-links">
                    <li><HrefLink href="https://stateoftrondapps.com/"><i
                        className="fa fa-angle-right"/> DApps</HrefLink></li>
                    <li><HrefLink href="https://medium.com/@Tronfoundation"><i className="fa fa-angle-right"/> TRON Labs</HrefLink>
                    </li>
                    <li><HrefLink href="https://www.facebook.com/tronfoundation/"><i
                        className="fa fa-angle-right"/> Facebook</HrefLink></li>
                    <li><HrefLink href="https://twitter.com/tronfoundation"><i
                        className="fa fa-angle-right"/> Twitter</HrefLink></li>
                    <li><HrefLink href="https://tronfoundation.slack.com/"><i
                        className="fa fa-angle-right"/> Slack</HrefLink></li>
                    <li><HrefLink href="https://www.reddit.com/r/tronix"><i
                        className="fa fa-angle-right"/> Reddit</HrefLink></li>
                  </ul>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-3">
                  <h5>Development</h5>
                  <ul className="list-unstyled quick-links">
                    <li><HrefLink href="https://github.com/tronprotocol"><i
                        className="fa fa-angle-right"/> Github</HrefLink></li>
                    <li><HrefLink href="https://github.com/tronprotocol/java-tron"><i
                        className="fa fa-angle-right"/> java-tron</HrefLink></li>
                    <li>
                      <HrefLink href="https://github.com/tronprotocol/Documentation">
                        <i className="fa fa-angle-right"/> Documentation
                      </HrefLink>
                    </li>
                    <li><HrefLink href="http://wiki.tron.network/en/latest/"><i
                        className="fa fa-angle-right"/> Wiki</HrefLink></li>
                  </ul>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-3">
                  <h5>Quick links</h5>
                  <ul className="list-unstyled quick-links">
                    <li><Link to="/votes"><i className="fa fa-angle-right"/> {tu("vote_for_super_representatives")}
                    </Link></li>
                    <li><Link to="/representatives"><i
                        className="fa fa-angle-right"/> {tu("view_super_representatives")}</Link></li>
                    <li><Link to="/wallet/new"><i className="fa fa-angle-right"/> {tu("create_new_wallet")}</Link></li>
                    <li><Link to="/tokens/view"><i className="fa fa-angle-right"/> {tu("view_tokens")}</Link></li>
                    <li><Link to="/help/copyright"><i className="fa fa-angle-right"/> {tu("copyright")}</Link></li>
                  </ul>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <ul className="list-unstyled list-inline social text-center">
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
  logo: {
    height: 100,
    marginLeft: -16
  },
  list: {
    fontSize: 18,
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    theme: state.app.theme,
  };
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(Home)))
