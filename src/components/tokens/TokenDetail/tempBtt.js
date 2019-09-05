import React from "react";
import xhr from "axios/index";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {filter, includes} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import {TronLoader} from "../../common/loaders";
import LineReact from "../../common/LineChart";
import {cloneDeep} from "lodash";
import {tu} from "../../../utils/i18n";
import CountUp from 'react-countup';
import {Link} from "react-router-dom"
import {API_URL} from "../../../constants";
import {
  SupplyAreaHighChart
} from "../../common/LineCharts";


import {loadPriceData} from "../../../actions/markets";
import {t} from "../../../utils/i18n";

class BTTSupplyTemp extends React.Component {

  constructor() {
    super();

    this.state = {
      accounts: null,
      transactionStats: null,
      blockStats: null,
      transactionValueStats: null,
      txOverviewStats: null,
      txOverviewStatsFull: null,
      addressesStats: null,
      blockSizeStats: null,
      blockchainSizeStats: null,
      priceStats: null,
      volumeStats: null,
      summit: null,
      pieChart: null,
      supplyTypesChart: null,
      genesisNum:null,
      blockProduceRewardsNum:null,
      nodeRewardsNum:null,
      independenceDayBurned:null,
      feeBurnedNum:null,
      currentTotalSupply:null,
      priceUSD:null,
      priceBTC:null,
      marketCapitalization:null,
      foundationFreeze:null,
      circulatingNum:null
    };
  }

  componentDidMount() {
    this.loadTotalTRXSupply();
    setInterval(() => {
      this.loadTotalTRXSupply();
    }, 60000);
  }

  compare (property) {
    return function (obj1, obj2) {
      if (obj1[property] > obj2[property]) {
        return 1;
      } else if (obj1[property] < obj2[property]) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  loadTotalTRXSupply = async() =>{
    let {intl} = this.props;
    //const {funds} = await Client.getBttFundsSupply();
    const funds = 170421000000;
    let total = 990000000000;
    let result=await xhr.get(`${API_URL}/api/bittorrent/graphic`);

    let supplyTypesChartData = result.data;
    let eurBittorrentURL = encodeURI(`https://api.coinmarketcap.com/v1/ticker/bittorrent/?convert=EUR`);
    let trxPriceData = await xhr.get(`${API_URL}/api/system/proxy?url=${eurBittorrentURL}`);
    let priceUSD = ((parseFloat(trxPriceData.data[0].price_usd))*1000).toFixed(2);
    let priceBTC = ((parseFloat(trxPriceData.data[0].price_btc))*1000).toFixed(5);
   // let marketCapitalization = ((parseFloat(trxPriceData.data[0].price_usd)*(funds.totalTurnOver))).toFixed(2);
    let marketCapitalization = ((parseFloat(trxPriceData.data[0].price_usd)*(funds))).toFixed(2);
    this.setState({
      supplyTypesChart: supplyTypesChartData,
      genesisNum:intl.formatNumber(total),
      // blockProduceRewardsNum:intl.formatNumber(funds.totalBlockPay),
      // nodeRewardsNum:intl.formatNumber(funds.totalNodePay),
      // independenceDayBurned:intl.formatNumber(funds.burnPerDay),
      // feeBurnedNum:intl.formatNumber(funds.burnByCharge),
      currentTotalSupply:parseInt(funds),
      priceUSD:priceUSD,
      priceBTC:priceBTC,
      marketCapitalization:marketCapitalization,
      //foundationFreeze:intl.formatNumber(funds.fundTrx),
      //circulatingNum:intl.formatNumber(funds.turnOver)
    });
  }


  async loadPieChart(){
    let {intl} = this.props;
    let {statisticData} = await Client.getStatisticData()
    let pieChartData = [];
    if (statisticData.length > 0) {
      statisticData.map((val, i) => {
        pieChartData.push({
          key: i + 1,
          name: val.name ? val.name : val.url,
          volumeValue: intl.formatNumber(val.blockProduced),
          volumePercentage: intl.formatNumber(val.percentage * 100, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }) + '%',
        });

      })
    }
    this.setState({
      pieChart: pieChartData
    });
  }

  render() {
    let {match, intl,activeLanguage} = this.props;
    let {supplyTypesChart,genesisNum,blockProduceRewardsNum,nodeRewardsNum,independenceDayBurned,feeBurnedNum,currentTotalSupply,priceUSD,priceBTC,marketCapitalization,foundationFreeze,circulatingNum} = this.state;
    let supplyURL = "https://ex.bnbstatic.com/images/20190128/c015d0e0-f442-4245-a963-b3e2ad50617b.jpg";
    return (

        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body p-5 btt-supply-body">
                {
                  <div>
                    {
                      !currentTotalSupply?
                          <TronLoader/> :
                          <div className="row" style={{fontSize : 12,marginRight:0}}>
                            <div className="col-md-12">
                              <div className="table-responsive">
                                <table className="table" style={{marginTop : 10}}>
                                  <thead>
                                  <tr>
                                    <th style={{border:0}}>
                                      <i className="fa fa-puzzle-piece" ></i>
                                      <span style={{marginTop:2}}>{tu('BTT_distribution_overview')}</span>
                                    </th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  <tr>
                                    <td style={{  width: '20%'}}>
                                      {tu('genesis')}:
                                    </td>
                                    <td className="text-nowrap">
                                      {genesisNum} BTT
                                    </td>
                                  </tr>

                                  <tr>
                                    <td><b>{tu('current_total_supply')}:</b><br/>
                                    </td>
                                    <td className="text-nowrap">
                                      <b>{intl.formatNumber(currentTotalSupply)} BTT</b>
                                    </td>
                                  </tr>

                                  </tbody>
                                </table>
                              </div>
                              <br/>
                              <div className="table-responsive">
                                <table className="table" style={{marginBottom:0}}>
                                  <thead>
                                  <tr>
                                    <th style={{border:0}}><br/><i className="fa fa-coins" ></i> {tu('price_per_1000_btt')}</th>
                                  </tr>
                                  </thead>
                                  <tbody><tr>
                                    <td style={{  width: '20%'}}>{tu('in_USD')}:
                                    </td>
                                    <td>
                                      ${priceUSD}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{tu('in_BTC')}:
                                    </td>
                                    <td>
                                      {priceBTC}
                                    </td>
                                  </tr>
                                  </tbody></table>
                                <div style={{fontSize:12,color:'#999',whiteSpace: 'nowrap',textAlign:'left', padding: '0.75rem',borderTop: '1px solid #DFD7CA',verticalAlign: 'top'}}>
                                  <div style={{transform:'scale(.9)',marginLeft: '-1.3rem'}}>
                                    {/**{tu('supply_notes')}*/}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-12" style={{backgroundColor: '#F5F5F5',marginTop:0,paddingBottom:15}}>
                              <div className="main-counters row" style={{marginBottom:'0px'}}>
                                <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    <CountUp start={0} end={currentTotalSupply} duration={2}  separator="," decimals={0} />
                                                                  &nbsp; BTT
                                                                </span>
                                  <h4>{tu('circulating_supply')}</h4>
                                </div>
                                <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    $<CountUp start={0} end={marketCapitalization} duration={2}  separator="," decimals={2}/>
                                                                </span>
                                  <h4>{tu('market_capitalization')}</h4>
                                </div>
                              </div>

                                                        <div className="card">
                                                          <div className="card-body">
                                                            <SupplyAreaHighChart
                                                                intl={intl}
                                                                data={supplyTypesChart}
                                                                style={{height: 400, marginTop: 10}}
                                                            />
                                                          </div>
                                                        </div>

                            </div>
                            <a href='https://support.binance.com/hc/en-us/articles/360022340552'>Binance Launchpad Public Sale</a>
                          </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
    );
  }
}


function

mapStateToProps(state) {
  return {
    priceGraph: state.markets.price,
    activeLanguage: state.app.activeLanguage,
  };
}

const
    mapDispatchToProps = {
      loadPriceData,
    };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BTTSupplyTemp))
