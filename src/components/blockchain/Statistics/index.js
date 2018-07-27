import React from "react";
import xhr from "axios/index";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {filter, includes} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import {TronLoader} from "../../common/loaders";

import {
  LineReactAdd,
  LineReactBlockSize,
  LineReactBlockchainSize,
  LineReactTx,
  LineReactPrice,
  LineReactVolumeUsd
} from "../../common/LineCharts";
import {loadPriceData} from "../../../actions/markets";

class Statistics extends React.Component {
  constructor() {
    super();

    this.state = {
      accounts: null,
      transactionStats: null,
      blockStats: null,
      transactionValueStats: null,
      txOverviewStats: null,
      addressesStats: null,
      blockSizeStats: null,
      blockchainSizeStats: null,
      priceStats: null,
      volume:null
    };
  }

  componentDidMount() {
    this.loadAccounts();
    this.loadStats();
    this.loadTxOverviewStats();
  }

  async loadAccounts() {

    let {accounts} = await Client.getAccounts({
      limit: 35,
      sort: '-balance',
    });

    this.setState({
      accounts: filter(accounts, account => !includes(tronAddresses, account.address))
          .slice(0, 10)
          .map(account => ({
            name: account.address,
            value: account.balance / ONE_TRX,
          }))
    });
  }


  async loadStats() {

    let {intl} = this.props;

    let {stats} = await Client.getTransferStats({
      groupby: 'timestamp',
      interval: 'hour',
    });

    let {stats: blockStats} = await Client.getBlockStats({
      info: `avg-block-size`,
    });

    let transactionTotalStats = stats.total.map(row => ({
      timestamp: row.timestamp,
      value: row.value,
    }));

    let valueStats = stats.value.map(row => ({
      timestamp: row.timestamp,
      value: row.value / ONE_TRX,
    }));

    blockStats = blockStats.map(row => ({
      timestamp: row.timestamp,
      value: row.value,
    }));

    this.setState({
      transactionStats: transactionTotalStats,
      transactionValueStats: valueStats,
      blockStats,
    });
  }

  async loadTxOverviewStats() {
    let {intl} = this.props;
    let today = new Date();
    let timerToday = today.getTime();

    var birthday = new Date("2017/10/10");
    var timerBirthday = birthday.getTime();
    var dayNum = Math.floor((timerToday - timerBirthday) / 1000 / 3600 / 24);


    let {data} = await xhr.get("https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&limit=" + dayNum);

    let priceStatsTemp = data['Data'];

    let volumeData = await xhr.get("https://cors.io/?https://graphs2.coinmarketcap.com/currencies/tron/",);
    let volumeUSD = volumeData.data.volume_usd
    let volume = volumeUSD.map(function (v,i) {
        return {
            time:v[0],
            volume_billion:v[1]/Math.pow(10,9),
            volume_usd:intl.formatNumber(v[1]) + ' USD'
        }
    })

    let {txOverviewStats} = await Client.getTxOverviewStats();
    let temp = [];
    let addressesTemp = [];
    let blockSizeStatsTemp = [];
    let blockchainSizeStatsTemp = [];
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
      blockSizeStatsTemp.push({
        date: txOverviewStats[tx].date,
        avgBlockSize: txOverviewStats[tx].avgBlockSize
      });
      blockchainSizeStatsTemp.push({
        date: txOverviewStats[tx].date,
        blockchainSize: txOverviewStats[tx].blockchainSize
      });
    }

    this.setState({
      txOverviewStats: temp,
      addressesStats: addressesTemp,
      blockSizeStats: blockSizeStatsTemp,
      blockchainSizeStats: blockchainSizeStatsTemp,
      priceStats: priceStatsTemp,
      volume:volume
    });
  }

  render() {

    let {txOverviewStats, addressesStats, transactionStats, transactionValueStats, blockStats, accounts, blockSizeStats, blockchainSizeStats, priceStats,volume} = this.state;
    let {intl} = this.props;

    return (
        <main className="container header-overlap">
          <div className="text-center alert alert-light alert-dismissible fade show" role="alert">
            {tu("click_the_chart_title_to_find_more")}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 350}}>
                    {
                      txOverviewStats === null ?
                          <TronLoader/> :
                          <LineReactTx style={{height: 350}} data={txOverviewStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 350}}>
                    {
                      addressesStats === null ?
                          <TronLoader/> :
                          <LineReactAdd style={{height: 350}} data={addressesStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 350}}>
                    {
                      blockSizeStats === null ?
                          <TronLoader/> :
                          <LineReactBlockSize style={{height: 350}} data={blockSizeStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <div style={{height: 350}}>
                    {
                      blockchainSizeStats === null ?
                          <TronLoader/> :
                          <LineReactBlockchainSize style={{height: 350}} data={blockchainSizeStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <div style={{height: 350}}>
                    {
                      priceStats === null ?
                          <TronLoader/> :
                          <LineReactPrice style={{height: 350}} data={priceStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <div style={{height: 350}}>
                      {
                          volume === null ?
                              <TronLoader/> :
                              <LineReactVolumeUsd style={{height: 350}} data={volume} intl={intl}/>
                      }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    priceGraph: state.markets.price
  };
}

const mapDispatchToProps = {
  loadPriceData,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Statistics))



