import React, {Component} from 'react';
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import CountUp from 'react-countup';
import {Client} from "../services/api";
import {withTimers} from "../utils/timing";
import {TronLoader} from "./common/loaders";
import {LineReactAdd, LineReactTx} from "./common/LineChartTx";
import xhr from "axios/index";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";


class Demo extends Component {

  constructor() {
    super();
    this.state = {
      volume: 0,
      previousVolume: 0,
      totalAccounts: 0,
      previousTotalAccounts: 0,
      transactionLastDay: 0,
      previousTransactionLastDay: 0,
      txOverviewStats: null,
    };
  }

  async load() {


    /* let {total: totalTransactions} = await Client.getTransfers({
       limit: 1,
       date_start: subDays(new Date(), 1),
     });
    */


    // let vol = await xhr.get("https://api.coinmarketcap.com/v1/ticker/tron/");

    // let volume = vol.data[0]["24h_volume_usd"];

    // let totalAccounts = await Client.getAccounts();

    // let {txOverviewStats} = await Client.getTxOverviewStats();

    // let temp = [];

    // for (let txs in txOverviewStats) {
    //   let tx = parseInt(txs);
    //   if (tx === 0) {
    //     temp.push(txOverviewStats[tx]);
    //   }
    //   else {
    //     temp.push({
    //       date: txOverviewStats[tx].date,
    //       totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
    //       avgBlockTime: txOverviewStats[tx].avgBlockTime,
    //       avgBlockSize: txOverviewStats[tx].avgBlockSize,
    //       totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
    //       newAddressSeen: txOverviewStats[tx].newAddressSeen
    //     });

    //   }
    // }


    // this.setState(prevState => ({
    //   volume: volume,
    //   previousVolume: prevState.volume,
    //   // totalAccounts: totalAccounts.total,
    //   transactionLastDay: temp[temp.length - 1].totalTransaction,
    //   previousTransactionLastDay: prevState.transactionLastDay,
    //   txOverviewStats: temp
    // }));

  }

  async loadAccount() {
    let totalAccounts = await Client.getAccounts();
    this.setState(prevState => ({
      totalAccounts: totalAccounts.total,
      previousTotalAccounts: prevState.totalAccounts,
    }));

  }

  componentDidMount() {
    // constellationPreset(this.$ref, "Hot Sparks");
    this.load();
    this.loadAccount();
    this.props.setInterval(() => {
      this.load();
    }, 3600000);
    this.props.setInterval(() => {
      this.loadAccount();
    }, 10000);
  }

  componentWillUnmount() {
    //clearConstellations();
  }


  render() {

    let {intl} = this.props;
    let {txOverviewStats, volume, totalAccounts, transactionLastDay, previousVolume, previousTotalAccounts, previousTransactionLastDay} = this.state;
    document.getElementsByTagName('body')[0].style.height = '95%';
    let height = window.innerHeight * 0.65;
    let width = window.innerWidth;
    return (
        <main className="home pb-0">


          <div className="pb-5 mt-5">
            <div className="container-fluid" style={{paddingLeft: '5%', paddingRight: '5%'}}>


              <div className="row" style={{height: '150px'}}>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="card h-100 widget-icon">

                    <div className="card-body" style={{lineHeight: '50px', display: 'flex'}}>
                      <img src={require("../images/icon1.png")} style={{
                        float: 'left',
                        width: '100px',
                        height: '100px',
                        marginTop: '5px',
                        marginRight: '20px',
                        marginLeft: '10px'
                      }}/>
                      <div>
                        <strong style={{whiteSpace: 'nowrap'}}>TRON Transactions Last Day</strong>
                        <h1 className="text-danger">
                          <FormattedNumber value={transactionLastDay}/>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="card h-100 widget-icon">

                    <div className="card-body" style={{lineHeight: '50px', display: 'flex'}}>
                      <img src={require("../images/icon2.png")} style={{
                        float: 'left',
                        width: '100px',
                        height: '100px',
                        marginTop: '5px',
                        marginRight: '20px',
                        marginLeft: '10px'
                      }}/>
                      <div>
                        <strong style={{whiteSpace: 'nowrap'}}>Total Accounts</strong>
                        <h1 className="text-danger">

                          {/* <FormattedNumber value={totalAccounts}/> */}
                          <CountUp redraw={true} separator="," start={0} end={totalAccounts} duration={1}/>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mt-3 mt-md-0">
                  <div className="card h-100 widget-icon">

                    <div className="card-body" style={{lineHeight: '50px', display: 'flex'}}>
                      <img src={require("../images/icon3.png")} style={{
                        float: 'left',
                        width: '100px',
                        height: '100px',
                        marginTop: '5px',
                        marginRight: '20px',
                        marginLeft: '10px'
                      }}/>
                      <div>
                        <strong style={{whiteSpace: 'nowrap'}}>Volume (24H)（$）</strong>
                        <h1 className="text-danger">
                          <CountUp redraw={true} separator="," start={0} end={volume} duration={1}/>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row mt-4">
                <div className="col-md-12 mt-3 mt-md-0 ">
                  <div className="card">

                    <div className="card-body">

                      <div style={{height: height}}>
                        {
                          txOverviewStats === null ?
                              <TronLoader/> :
                              <LineReactTx style={{height: height}} data={txOverviewStats} intl={intl} source='home'/>
                        }
                      </div>

                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>


        </main>
    )
  }
}

const countUpProps = {
  redraw: true
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};


export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(Demo)))
