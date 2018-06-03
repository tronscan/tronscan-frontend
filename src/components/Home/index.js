import React, {Component} from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {doSearch} from "../../services/search";
import {clearConstellations, constellationPreset} from "../../lib/constellation/constellation";
import CountUp from 'react-countup';
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import RecentBlocks from "./RecentBlocks";
import SRNews from "./SRNews";
import {KEY_ENTER} from "../../utils/constants";
import {withTimers} from "../utils/timing";
import RecentTransfers from "./RecentTransfers";

const subHours = require('date-fns/sub_hours');

class Home extends Component {

  constructor() {
    super();
    this.state = {
      search: '',
      isShaking: false,
      hasFound: false,
      stats: {
        onlineNodes: 0,
        previousOnlineNodes: 0,
        blockHeight: 0,
        previousBlockHeight: 0,
        transactionPerHour: 0,
        previousTransactionPerHour: 0,
      },
    };
  }

  async load() {

    let {blocks} = await Client.getBlocks({
      limit: 1,
      sort: '-number',
    });

    let {total: totalTransactions} = await Client.getTransfers({
      limit: 1,
      date_start: subHours(new Date(), 1),
    });


    let {total} = await Client.getNodeLocations();
    this.setState(prevState => ({
      stats: {
        previousOnlineNodes: prevState.stats.onlineNodes,
        previousBlockHeight: prevState.stats.blockHeight,
        previousTransactionPerHour: prevState.stats.transactionPerHour,
        onlineNodes: total,
        blockHeight: blocks[0].number,
        transactionPerHour: totalTransactions,
      },
    }));
  }

  doSearch = async () => {
    let {search} = this.state;
    let result = await doSearch(search);
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
    }
  };

  onSearchKeyDown = (ev) => {
    if (ev.keyCode === KEY_ENTER) {
      this.doSearch();
    }
  };

  componentDidMount() {
    constellationPreset(this.$ref, "Hot Sparks");
    this.load();

    // this.props.setInterval(() => {
    //   this.load();
    // }, 6000);
  }

  componentWillUnmount() {
    clearConstellations();
  }

  getLogo = () => {
    let {theme} = this.props;
    switch(theme) {
      case "tron":
        return require("../../images/tron-banner-tronblue.png");
      default:
        return require("../../images/tron-banner-inverted.png");
    }
  };

  render() {

    let {search, isShaking, hasFound, stats} = this.state;

    console.log(stats);

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
                  Decentralize the Web
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
                         placeholder="Search Address, Block Height, Transaction Hash, Asset Name"/>

                  <div className="input-group-append">
                    <button className="btn btn-dark box-shadow-none" onClick={this.doSearch}>
                      <i className="fa fa-search"/>
                    </button>
                  </div>
                </div>

              </div>
            </div>
            <div className="row text-center home-stats ">
              <div className="col-md-3">
                <Link to="/nodes?mode=3d" className="hvr-underline-from-center hvr-underline-white text-muted">
                  <h2><CountUp start={stats.previousOnlineNodes} end={stats.onlineNodes} duration={1}/></h2>
                  <p>Online Nodes</p>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/blockchain/blocks" className="hvr-underline-from-center hvr-underline-white text-muted">
                  <h2><CountUp start={stats.previousBlockHeight} end={stats.blockHeight} duration={1}/></h2>
                  <p>Block Height</p>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/blockchain/transactions"
                      className="hvr-underline-from-center hvr-underline-white text-muted">
                  <h2><CountUp start={stats.previousTransactionPerHour} end={stats.transactionPerHour} duration={1}/></h2>
                  <p>Transactions last hour</p>
                </Link>
              </div>
              <div className="col-md-3">
                <Link to="/markets" className="hvr-underline-from-center hvr-underline-white text-muted">
                  <h2><TRXPrice amount={1000} currency="USD"/></h2>
                  <p>Price (per 1000TRX)</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="pb-4">
          <div className="container">
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

        <SRNews/>
        <div className="bg-light-grey py-5 pt-5">
          <div className="container homepage-filler">
            <div className="row pt-5 pb-5">
              <div className="col-md-7">
                <div className="mb-3 border-0">
                  <h5>Desktop Explorer BETA is here!</h5>
                  <p>
                    <span className="font-weight-bold">The BETA version is out!</span>{' '}
                    Use all your favorite features of Tronscan in the desktop version. By using the Desktop
                    version you are safe from malicious websites or browser extensions which may read your private key.
                  </p>
                  <p>
                    More features will be coming in the future for even better Desktop Integration.
                  </p>
                  <p>
                    The Desktop app is available for Windows, Linux and Mac
                  </p>
                  <div className="mt-3">
                    <a href="https://github.com/tronscan/tronscan-desktop/releases">
                      <button className="btn btn-tron btn-block col-xm-6 col-sm-3 ">
                        Download here
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-5 text-md-right text-sm-center">
                <img src={require("../../images/frontpage/Tron_windows.png")}/>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-5 pt-5">
          <div className="container homepage-filler">
            <div className="row pt-5 pb-5">

              <div className="col-md-5 text-left text-sm-center">

                <img src={require("../../images/frontpage/representatives.png")} />
              </div>
              <div className="col-md-7">
                <div className="mb-3 border-0">
                  <div >
                    <h5>Super Representatives Nodes</h5>
                    <p>
                      Super Representatives are the backbone of the network which will handle transactions, produce nodes and
                      receive rewards for being part of the top 27. Every 6 hours the votes will be counted and new Super Representatives
                      will be selected.
                    </p>
                    <p>
                      View the health of the network, check if your node is properly synced and see which node has
                      the best productivity.
                    </p>
                    <div className="mt-3">
                      <Link className="btn btn-tron btn-block col-xm-7 col-sm-4 float-right" to="/representatives">
                        View Representatives
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="bg-light-grey py-5 pt-5">
          <div className="container homepage-filler">
            <div className="row pt-5 pb-5">
              <div className="col-md-7">
                <div className="mb-3 border-0">
                  <h5>The Tron Explorer Wallet</h5>
                  <p className="mt-3">
                    Open your wallet on the Tron Explorer and make use of all the features on the Tron Network.
                    Vote for Super Representatives, transfer tokens to another account or gain Tron Power? It can all be
                    done right here on Tronscan.
                  </p>
                  {/*<p>*/}
                  {/*Be instantly notified of transactions happening on your wallet by enabling Desktop Notifications.*/}
                  {/*</p>*/}
                  <p>
                    <span className="font-weight-bold">Upcoming Feature!</span> Open your wallet on Tron Explorer
                    without needing to share your Private Key in the browser!
                  </p>
                  <div className="mt-3">
                    <Link to="/wallet/new" className="btn btn-tron btn-block col-xm-6 col-sm-3 ">
                      Create Wallet
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-md-5 text-md-right text-sm-center">
                <img src={require("../../images/frontpage/wallet-preview.png")}/>
              </div>
            </div>
          </div>
        </div>


        {/*<div className="bg-super-dark text-center">*/}
          {/*<video className="video pt-1 pb-1" no-controls autoPlay loop src={require("../../video/Hologram_Planet_by_nuva.mp4")}></video>*/}
        {/*</div>*/}


        <div className="pt-5 home-footer">
          <div className="container">
            <div className="row text-center text-xs-center text-sm-left text-md-left">
              <div className="col-md-2">
                &nbsp;
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <h5>Tron</h5>
                <ul className="list-unstyled quick-links">
                  <li><a href="https://stateoftrondapps.com/"><i className="fa fa-angle-right"/> DApps</a></li>
                  <li><a href="https://medium.com/@Tronfoundation"><i className="fa fa-angle-right"/> Tron Labs</a></li>
                  <li><a href="https://www.facebook.com/tronfoundation/"><i className="fa fa-angle-right"/> Facebook</a>
                  </li>
                  <li><a href="https://twitter.com/tronfoundation"><i className="fa fa-angle-right"/> Twitter</a></li>
                  <li><a href="https://tronfoundation.slack.com/"><i className="fa fa-angle-right"/> Slack</a></li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <h5>Development</h5>
                <ul className="list-unstyled quick-links">
                  <li><a href="https://github.com/tronprotocol"><i className="fa fa-angle-right"/> Github</a></li>
                  <li><a href="https://github.com/tronprotocol/java-tron"><i
                    className="fa fa-angle-right"/> java-tron</a></li>
                  <li>
                    <a href="https://github.com/tronprotocol/Documentation">
                      <i className="fa fa-angle-right"/> Documentation
                    </a>
                  </li>
                  <li><a href="http://wiki.tron.network/en/latest/"><i className="fa fa-angle-right"/> Wiki</a></li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-3">
                <h5>Quick links</h5>
                <ul className="list-unstyled quick-links">
                  <li><Link to="/votes"><i className="fa fa-angle-right"/> Vote for Super Representatives</Link></li>
                  <li><Link to="/representatives"><i className="fa fa-angle-right"/> View Super Representatives</Link></li>
                  <li><Link to="/wallet/new"><i className="fa fa-angle-right"/> Create a new Wallet</Link></li>
                  <li><Link to="/tokens/view"><i className="fa fa-angle-right"/> View Tokens</Link></li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
                <ul className="list-unstyled list-inline social text-center">
                  <li className="list-inline-item">
                    <a href="https://www.facebook.com/tronfoundation/"><i className="fab fa-facebook"/></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://www.github.com/tronprotocol"><i className="fab fa-github"/></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="https://twitter.com/tronfoundation"><i className="fab fa-twitter"/></a>
                  </li>
                  <li className="list-inline-item">
                    <a href="mailto:service@tron.network" target="_blank"><i className="fa fa-envelope"/></a>
                  </li>
                </ul>
              </div>
              <hr/>
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
 }
};

function mapStateToProps(state) {
  return {
    account: state.app.account,
    theme: state.app.theme,
  };
}

const mapDispatchToProps = {
};


export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(Home)))

