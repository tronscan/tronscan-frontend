import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {loadPriceData} from "../../actions/markets";
import MarketOverview from "./MarketOverview";
import {TronLoader} from "../common/loaders";
import {Client} from "../../services/api";
import LineReact from "../common/LineChart";
import RingPieReact from "../common/RingPieChart";
import {
    LineReactPrice,
    LineReactVolumeUsd
} from "../common/LineCharts";
import xhr from "axios/index";

class Markets extends React.Component {

  constructor() {
    super();

    this.state = {
      priceGraph: [],
      volumeGraph: [],
      markets: [],
      priceStats: null,
      volume:null
    };
  }

  componentDidMount() {
    this.loadMarketData();
  }

  loadMarketData = async () => {
    let {intl} = this.props;
    this.props.loadPriceData();
    let markets = await Client.getMarkets();

    let today = new Date();
    let timerToday = today.getTime();
    let birthday = new Date("2017/10/10");
    let timerBirthday = birthday.getTime();
    let dayNum = Math.floor((timerToday - timerBirthday) / 1000 / 3600 / 24);
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
    this.setState({
      markets: markets,
      priceStats: priceStatsTemp,
      volume:volume
    });
  };

  formatTableData = (markets) => {
    let {intl} = this.props;
    let data = [];
    markets.sort((a, b) => a.rank - b.rank);
    if (markets.length) {
      markets.map((val) => {
        data.push({
          key: val.rank,
          rank: val.rank,
          name: val.name,
          pair: val.pair,
          volumeNative: intl.formatNumber(val.volumeNative) + ' TRX',
          volumePercentage: intl.formatNumber(val.volumePercentage, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }) + '%',
          price: '$' + intl.formatNumber(val.price, {maximumFractionDigits: 8})
        });

      })
    }
    return data.slice(0, 99);
  }


  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: intl.formatMessage({id: 'rank'}),
        dataIndex: 'rank',
        key: 'rank',
        sorter: true,
        width: '5%'
      },
      {
        title: intl.formatMessage({id: 'exchange'}),
        dataIndex: 'name',
        key: 'name',
        filterDropdown: true
      },
      {
        title: intl.formatMessage({id: 'pair'}),
        dataIndex: 'pair',
        key: 'pair',
        width: '12%'
      },
      {
        title: intl.formatMessage({id: 'volume'}),
        dataIndex: 'volumeNative',
        key: 'volumeNative',
        width: '14%'
      },
      {
        title: '%',
        dataIndex: 'volumePercentage',
        key: 'volumePercentage',
        width: '8%'
      },
      {
        title: intl.formatMessage({id: 'price'}),
        dataIndex: 'price',
        key: 'price',
        width: '10%'
      }
    ];

    return column;
  }

  render() {

    let {intl, priceGraph, volumeGraph} = this.props;
    let {markets,priceStats,volume} = this.state;
    let tableData = this.formatTableData(markets);
    let column = this.customizedColumn();

    return (
        <main className="container header-overlap pb-3">
          <div className="row">
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  {/*<div style={{height: 300}}>*/}
                    {/*{*/}
                      {/*priceGraph.length === 0 ?*/}
                          {/*<TronLoader/> :*/}
                          {/*<LineReact message={{id: 'average_price_usd'}} style={{height: 300}}*/}
                                     {/*data={priceGraph} keysData={['time', 'close']}*/}
                                     {/*format={{time: true, date: true}}/>*/}
                    {/*}*/}
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
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">

                  {/*<div style={{height: 300}}>*/}
                    {/*{*/}
                      {/*volumeGraph.length === 0 ?*/}
                          {/*<TronLoader/> :*/}
                          {/*<LineReact message={{id: 'average_volume_usd'}} style={{height: 300}}*/}
                                     {/*data={volumeGraph} keysData={['time', 'volume']}*/}
                                     {/*format={{time: true}}/>*/}
                    {/*}*/}
                  {/*</div>*/}
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
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">

                  <RingPieReact message={{id:'Trade Volume'}} style={{height: 700}} data={markets}/>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <MarketOverview tableData={tableData} column={column}/>
            </div>
          </div>
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    priceGraph: state.markets.price,
    volumeGraph: state.markets.volume,
  };
}

const mapDispatchToProps = {
  loadPriceData,
};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(Markets));
