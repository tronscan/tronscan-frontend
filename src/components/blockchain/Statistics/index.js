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
import {
  RepresentativesRingPieReact
} from "../../common/RingPieChart";
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
      volume:null,
      pieChart:null,
      pieData:[{"address":"TYVJ8JuQ6ctzCa2u79MFmvvNQ1U2tYQEUM","name":"","url":"http://tronone.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp","name":"Sesameseed","url":"https://www.sesameseed.org","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TEKUPpjTMKWw9LJZ9YJ4enhCjAmVXSL7M6","name":"lianjinshu","url":"http://www.lianjinshu.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TDGmmTC7xDgQGwH4FYRGuE7SFH2MePHYeH","name":"TeamTronics","url":"https://www.teamtronics.org","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TPRxUBEakukBMwTScCHgvCPSBYk5UhfboJ","name":"","url":"http://www.cryptodiva.io/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TTcYhypP8m4phDhN6oRexz2174zAerjEWP","name":"CryptoGuyInZA","url":"https://www.cryptoguyinza.co.za/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGj1Ej1qRzL9feLTLhjwgxXF4Ct6GTWg2U","name":"Skypeople","url":"http://www.skypeople.co.kr","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TVMP5r12ymtNerq5KB4E8zAgLDmg2FqsEG","name":"CryptoGirls","url":"https://www.cryptogirls.ro/","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TMAbjAuefZqzJAyGhkn4AbWa3jinzcZtGc","name":"MLG-Global","url":"https://mlgblockchain.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1","name":"JustinSunTron","url":"https://twitter.com/justinsuntron","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TRXDEXMoaAprSGJSwKanEUBqfQjvQEDuaw","name":"TrxDexCom","url":"https://TrxDex.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TSNbzxac4WhxN91XvaUfPTKP2jNT18mP6T","name":"BitTorrent","url":"https://www.bittorrent.com/","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TY65QiDt4hLTMpf3WRzcX357BnmdxT2sw9","name":"uTorrent","url":"https://www.utorrent.com/","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TKSXDA8HfE9E1y39RczVQ1ZascUEtaSToF","name":"CryptoChain","url":"http://cryptochain.network","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TV6qcwSp38uESiDczxxb7zbJX1h2LfDs78","name":"","url":"https://tronstronics.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TLTDZBcPoJ8tZ6TTEeEqEvwYFk2wgotSfD","name":"","url":"http://TronGr27.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"THKJYuUmMKKARNf7s2VT51g5uPY6KEqnat","name":"","url":"http://TronGr1.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TZHvwiw9cehbMxrtTbmAexm9oPo4eFFvLS","name":"","url":"http://TronGr15.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TWm3id3mrQ42guf7c4oVpYExyTYnEGy3JL","name":"","url":"http://TronGr9.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TVDmPWGYxgi5DNeW8hXrzrhY8Y6zgxPNg4","name":"","url":"http://TronGr2.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TK6V5Pw2UWQWpySnZyCDZaAvu1y48oRgXN","name":"","url":"http://TronGr6.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TX3ZceVew6yLC5hWTXnjrUFtiFfUDGKGty","name":"","url":"http://TronGr18.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TGK6iAKgBmHeQyp5hn3imB71EDnFPkXiPR","name":"","url":"http://TronGr16.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TNGoca1VHC6Y5Jd2B1VFpFEhizVk92Rz85","name":"","url":"http://TronGr12.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TDarXEG2rAD57oa7JTK785Yb2Et32UzY32","name":"","url":"http://TronGr4.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434},{"address":"TDbNE1VajxjpgM5p7FyGNDASt3UVoFbiD3","name":"","url":"http://TronGr26.com","blockProduced":251,"total":6784,"percentage":0.03699882075471698},{"address":"TCf5cqLffPccEY7hcsabiFnMfdipfyryvr","name":"","url":"http://TronGr20.com","blockProduced":252,"total":6784,"percentage":0.03714622641509434}]

    };
  }

  componentDidMount() {
    this.loadAccounts();
    this.loadStats();
    this.loadTxOverviewStats();
    this.getPiechart();
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

  async getPiechart(){
        let {intl} = this.props;
        //let {data} = await xhr.get("http://172.16.20.198:9000/api/witness/maintenance-statistic");
        let data = this.state.pieData;
        let PiechartData = [];
        if (data.length > 0) {
            data.map((val,i) => {
                PiechartData.push({
                    key: i+1,
                    name: val.name?val.name:val.url,
                    volumeValue: intl.formatNumber(val.blockProduced),
                    volumePercentage: intl.formatNumber(val.percentage*100, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    }) + '%',
                });

            })
        }
        // PiechartData.sortBy((a, b) => b.volumeValue - a.volumeValue);
        this.setState({
            pieChart: PiechartData
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

    let {txOverviewStats, addressesStats, transactionStats, transactionValueStats, blockStats, accounts, blockSizeStats, blockchainSizeStats, priceStats,volume,pieChart} = this.state;
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
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <div style={{height: 350}}>
                      {
                          pieChart === null ?
                              <TronLoader/> :
                              <RepresentativesRingPieReact message={{id:'calculation_of_calculation_of_force'}} intl={intl} data={pieChart} style={{height: 300}}/>
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



