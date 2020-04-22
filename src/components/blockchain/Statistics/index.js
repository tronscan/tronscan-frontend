import React from "react";
import xhr from "axios/index";
import { tu } from "../../../utils/i18n";
import { Client } from "../../../services/api";
import { ONE_TRX,IS_MAINNET } from "../../../constants";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { filter, includes } from "lodash";
import { tronAddresses } from "../../../utils/tron";
import { Link } from "react-router-dom"
import { loadPriceData } from "../../../actions/markets";
import $ from 'jquery';

class StatsCharts extends React.Component {
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
      volume: null,
      pieChart: null,
      supplyTypesChart: null,
      tabs: [
        {
          name: 'charts_transaction',
          id: 'transfer'
        },
        {
          name: 'charts_circulation',
          id: 'currency'
        },
        {
          name: 'contract_code_overview_account',
          id: 'address'
        },
        {
          name: 'charts_block',
          id: 'block'
        },
        {
          name: 'charts_contract',
          id: 'contract'
        },
        {
          name: 'charts_SR',
          id: 'sr'
        },
        {
          name: 'chart_network',
          id: 'network'
        },

      ],
      scrollsId: '',
      linkIds: [],
    };
  }



  async loadAccounts() {

    let { accounts } = await Client.getAccounts({
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

    let { intl } = this.props;

    let { stats } = await Client.getTransferStats({
      groupby: 'timestamp',
      interval: 'hour',
    });

    let { stats: blockStats } = await Client.getBlockStats({
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
    let { intl } = this.props;
    let today = new Date();
    let timerToday = today.getTime();

    var birthday = new Date("2017/10/10");
    var timerBirthday = birthday.getTime();
    var dayNum = Math.floor((timerToday - timerBirthday) / 1000 / 3600 / 24);


    let { data } = await xhr.get("https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&limit=" + dayNum);

    let priceStatsTemp = data['Data'];

    let volumeData = await xhr.get("https://server.tron.network/api/v2/node/market_data");
    let volumeUSD = volumeData.data.market_cap_by_available_supply
    let volume = volumeUSD.map(function (v, i) {
      return {
        time: v[0],
        volume_billion: v[1] / Math.pow(10, 9),
        volume_usd: intl.formatNumber(v[1]) + ' USD'
      }
    })

    let { statisticData } = await Client.getStatisticData()
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
    let random = Math.random();
    let balanceData = await xhr.get("https://server.tron.network/api/v2/node/balance_info?random=" + random);
    let TRONFoundationTotal = balanceData.data.total;
    let { blocks } = await Client.getBlocks({
      limit: 1,
      sort: '-number',
    });
    let blockHeight = blocks[0] ? blocks[0].number : 0;
    let nodeRewardsNum = blockHeight * 16;
    let blockProduceRewardsNum = blockHeight * 32;
    let address = await Client.getAddress('TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy');
    let startFeeBurnedNum = Math.abs(-9223372036854.775808)
    let feeBurnedNum = (startFeeBurnedNum - Math.abs(address.balance / ONE_TRX)).toFixed(2);
    let genesisNum = 100000000000;
    let independenceDayBurned = 1000000000;
    let currentTotalSupply = genesisNum + blockProduceRewardsNum + nodeRewardsNum - independenceDayBurned - feeBurnedNum;
    let circulatingNum = (currentTotalSupply - TRONFoundationTotal).toFixed(2);
    let supplyTypesChartData = [
      { value: TRONFoundationTotal, name: 'foundation_freeze', selected: true },
      { value: circulatingNum, name: 'circulating_supply', selected: true },
    ]


    let { txOverviewStats } = await Client.getTxOverviewStatsAll();
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
      volume: volume,
      pieChart: pieChartData,
      supplyTypesChart: supplyTypesChartData
    });
  }

  componentDidMount() {
    this.getScrollsIds();
    this.props.location.hash && (
      setTimeout(() => {
        this.scrollToAnchor(this.props.location.hash.slice(1))
      })
    )
  }

  componentWillUnmount() {
    window.onscroll = null;
    //window.removeEventListener('scroll', this.onScrollEvent);
  }

  onScrollEvent(linkIds) {
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (linkIds.length) {
      linkIds.forEach((item, index) => {
        const el = $('#' + item.key).get(0);
        const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
        if (top <= viewPortHeight - 400) {
          $('.' + item.key).addClass('active');
          linkIds.forEach((k, v) => {
            if (item.key !== k.key) {
              $('.' + k.key).removeClass('active');
            }
          });
        }
      });
    }
  }
  getScrollsIds = () => {
    let { tabs } = this.state;
    const linkIds = [];
    tabs.forEach((item, index) => {
      // const top = document.getElementById(`${item.id}`);
      let top = $('#' + item.id);
      
      if (top) {
        linkIds.push({ key: item.id, offsetTop: top.offset().top });
      }
    })
    let _this = this;
     window.onscroll = function () {
      _this.onScrollEvent(linkIds);
    }
    //window.addEventListener('scroll',this.onScrollEvent.bind(this,linkIds));

  };

  updateHash = (id) => {
    window.location.hash = "#/data/stats"
    this.setState({
      scrollsId: id
    });
  }

  scrollToAnchor = (anchorName) => {
    if (anchorName || anchorName === 0) {
      const anchorElement = document.getElementById(anchorName);
      if (anchorElement) {
        anchorElement.scrollIntoView({
          block: 'center',
          behavior: 'smooth',
        });
      }
    }
  };

  render() {

    let { tabs, scrollsId, txOverviewStats, addressesStats, transactionStats, transactionValueStats, blockStats, accounts, blockSizeStats, blockchainSizeStats, priceStats, volume, pieChart, supplyTypesChart } = this.state;
    let { intl } = this.props;
    return (
      <main className="container header-overlap">
        <div className="card mt-3 list-style-body-scroll">
          <nav className="card-header list-style-body-scroll__header navbar navbar-expand-sm fixed-top" style={{ position: "sticky", zIndex: 10, background: '#f3f3f3', borderBottom: 'none' }}>
            <ul className="nav nav-tabs card-header-tabs navbar-nav">
              {
                Object.values(tabs).map(tab => (
                  <li className="nav-item scroll-li" key={tab.id}>
                    <a href="javascript:"
                      className={`scroll-tab nav-link ${tab.id} ${tab.id==='transfer'?'active':''}`}
                      key={tab.id}
                      //afterAnimate={() => this.updateHash(tab.id)}
                      onClick={() => this.scrollToAnchor(tab.id)}
                    >
                      {tu(tab.name)}
                    </a>
                  </li>
                ))
              }
            </ul>
          </nav>
          <div className="card statistics-chart" style={styles.card} >
            {/* transfer */}
            <div id="transfer">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fa fa-exchange-alt ml-5 mr-2 "></i>
                    {tu("charts_transaction")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                    {
                      IS_MAINNET?<Link className="card-title" to="/data/stats/txOverviewStatsType">
                      <span className="ml-5">
                        {tu("charts_daily_transactions")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Transactions.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>:<Link className="card-title" to="/data/stats/txOverviewStats">
                      <span className="ml-5">
                        {tu("charts_daily_transactions")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Transactions.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                    }
                    
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/totalTxns">
                      <span className="ml-5">
                        {tu("charts_total_transactions")}
                      </span>
                      <img src={require("../../../images/chart/Total-Transactions.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/volumeStats">
                      <span className="ml-5">
                        {tu("charts_volume_24")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Transaction-Volume.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
              */}
              </div>
            </div>
            {/* currency */}
            <div id="currency">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fas fa-layer-group ml-5 mr-2" />
                    {tu("charts_circulation")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>

              <div className="row mb-4 mt-4">
                {/* <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/priceStats">
                      <span className="ml-5">
                        {tu("charts_average_price")}
                      </span>
                      <img src={require("../../../images/chart/Average-TRX-Price.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div> */}
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/supply">
                      <span className="ml-5">
                        {tu("charts_total_TRX_supply")}
                      </span>
                      <img src={require("../../../images/chart/Total-TRX-Supply.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/charts/OverallFreezingRate">
                      <span className="ml-5">
                        {tu("charts_overall_freezing_rate")}
                      </span>
                      <img src={require("../../../images/chart/Overall-Freezing-Rate.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/charts/supply">
                      <span className="ml-5">
                        {tu("Supply_TRX_total_chart")}
                      </span>
                      <img src={require("../../../images/chart/Total-TRX-Supply-Worth.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
            {/* address */}
            <div id="address">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fa fa-users ml-5 mr-2" />
                    {tu("contract_code_overview_account")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/addressesStats">
                      <span className="ml-5">
                        {tu("charts_new_addresses")}
                      </span>
                      <img src={require("../../../images/chart/Account-Growth-Chart.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/charts/HoldTrxAccount">
                      <span className="ml-5">
                        {tu("chart_hold_trx_account")}
                      </span>
                      <img src={require("../../../images/chart/Accounts_holding_TRX.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* block */}
            <div id="block">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fas fa-cubes ml-5 mr-2" />
                    {tu("charts_block")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/blockSizeStats">
                      <span className="ml-5">
                        {tu("charts_average_blocksize")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Average-Block-Size.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/blockchainSizeStats">
                      <span className="ml-5">
                        {tu("charts_total_average_blocksize")}
                      </span>
                      <img src={require("../../../images/chart/Cumulative-Block-Size.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* contract */}
            <div id="contract">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fa fa-file-contract ml-5 mr-2" />
                    {tu("charts_contract")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/EnergyConsumeDistribution">
                      <span className="ml-5">
                        {tu("charts_daily_energy_contracts")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Energy-Consumption-By-Contracts.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/ContractInvocation">
                      <span className="ml-5">
                        {tu("charts_contract_calling")}
                      </span>
                      <img src={require("../../../images/chart/Contract-Calling.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/ContractInvocationDistribution">
                      <span className="ml-5">
                        {tu("charts_daily_contract_calling_profile")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Contract-Calling-Profile.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div id="sr">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fas fa-medal ml-5 mr-2" />
                    {tu("charts_SR")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                    <Link className="card-title" to="/data/stats/pieChart">
                      <span className="ml-5">
                        {tu("produce_distribution")}
                      </span>
                      <img src={require("../../../images/chart/Block-Producer-Chart.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div id="network">
              <div className="row mt-5 d-flex">
                <div className="charts-title mr-3 ml-3">
                  <span>
                    <i className="fas fa-wifi ml-5 mr-2" />
                    {tu("chart_network")}
                  </span>
                </div>
                <div className="charts-line"></div>
              </div>
              <div className="row mb-4 mt-4">
                <div className="col-md-4">
                  <div className="card-chart">
                  <Link className="card-title" to="/data/stats/EnergyConsume">
                      <span className="ml-5">
                        {tu("charts_daily_energy_consumption")}
                      </span>
                      <img src={require("../../../images/chart/Daily-Energy-Consumption.png")}
                        style={{ width: 240, filter: 'grayscale(100%)' }}
                        className="ml-5 mt-2" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </main>
    );
  }
}

const styles = {
  list: {
    fontSize: 18,
  },
  card: {
    border: 'none',
    borderRadius: 0,
    width: '100%'
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StatsCharts))



