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
import {Link} from "react-router-dom"

import {
    LineReactAdd,
    LineReactBlockSize,
    LineReactBlockchainSize,
    LineReactTx,
    LineReactPrice,
    LineReactVolumeUsd
} from "../../common/LineCharts";
import {
    RepresentativesRingPieReact,
    SupplyTypesTRXPieChart
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
            volume: null,
            pieChart: null,
            supplyTypesChart: null
        };
    }

    componentDidMount() {

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

        let volumeData = await xhr.get("https://server.tron.network/api/v2/node/market_data");
        let volumeUSD = volumeData.data.market_cap_by_available_supply
        let volume = volumeUSD.map(function (v, i) {
            return {
                time: v[0],
                volume_billion: v[1] / Math.pow(10, 9),
                volume_usd: intl.formatNumber(v[1]) + ' USD'
            }
        })

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
        let random = Math.random();
        let balanceData = await xhr.get("https://server.tron.network/api/v2/node/balance_info?random=" + random);
        let TRONFoundationTotal = balanceData.data.total;
        let {blocks} = await Client.getBlocks({
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
            {value: TRONFoundationTotal, name: 'foundation_freeze', selected: true},
            {value: circulatingNum, name: 'circulating_supply', selected: true},
        ]


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
            volume: volume,
            pieChart: pieChartData,
            supplyTypesChart: supplyTypesChartData
        });
    }

    render() {

        let {txOverviewStats, addressesStats, transactionStats, transactionValueStats, blockStats, accounts, blockSizeStats, blockchainSizeStats, priceStats, volume, pieChart, supplyTypesChart} = this.state;
        let {intl} = this.props;

        return (
            <main className="container header-overlap">
                <div className="text-center alert alert-light alert-dismissible fade show" role="alert">
                    {tu("click_the_chart_title_to_find_more")}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="card statistics-chart" style={{width: '100%'}}>
                    <div className="row mb-4 mt-5">
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/txOverviewStats">
                                    {tu("tron_transaction_chart")}
                                    <img src={require("../../../images/chart/TRON-Transaction-Chart.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div >*/}
                            {/*{*/}
                            {/*txOverviewStats === null ?*/}
                            {/*<TronLoader/> :*/}
                            {/*<LineReactTx style={{height: 350}} data={txOverviewStats} intl={intl}/>*/}
                            {/*}*/}
                            {/*</div>*/}
                        </div>
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/addressesStats">
                                    {tu("address_growth_chart")}
                                    <img src={require("../../../images/chart/Address-Growth-Chart.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                            {/*{*/}
                            {/*addressesStats === null ?*/}
                            {/*<TronLoader/> :*/}
                            {/*<LineReactAdd style={{height: 350}} data={addressesStats} intl={intl}/>*/}
                            {/*}*/}
                            {/*</div>*/}
                        </div>
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/blockSizeStats">
                                    {tu("average_blocksize")}
                                    <img src={require("../../../images/chart/Average-Block-Size.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                            {/*{*/}
                            {/*addressesStats === null ?*/}
                            {/*<TronLoader/> :*/}
                            {/*<LineReactAdd style={{height: 350}} data={addressesStats} intl={intl}/>*/}
                            {/*}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <hr/>
                    <div className="row mb-4 mt-4">
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/blockchainSizeStats">
                                    {tu("blockchain_size")}
                                    <img src={require("../../../images/chart/Blockchain-Size.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                                {/*{*/}
                                    {/*blockchainSizeStats === null ?*/}
                                        {/*<TronLoader/> :*/}
                                        {/*<LineReactBlockchainSize style={{height: 350}} data={blockchainSizeStats}*/}
                                                                 {/*intl={intl}/>*/}
                                {/*}*/}
                            {/*</div>*/}
                        </div>
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/priceStats">
                                    {tu("average_price")}
                                    <img src={require("../../../images/chart/Average-Price.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                            {/*{*/}
                            {/*priceStats === null ?*/}
                            {/*<TronLoader/> :*/}
                            {/*<LineReactPrice style={{height: 350}} data={priceStats} intl={intl}/>*/}
                            {/*}*/}
                            {/*</div>*/}
                        </div>
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/volumeStats">
                                    {tu("volume_24")}
                                    <img src={require("../../../images/chart/24-Hour-Trading-Volume.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                                {/*{*/}
                                    {/*volume === null ?*/}
                                        {/*<TronLoader/> :*/}
                                        {/*<LineReactVolumeUsd style={{height: 350}} data={volume} intl={intl}/>*/}
                                {/*}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <hr/>
                    <div className="row mb-4 mt-4">
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/pieChart">
                                    {tu("produce_distribution")}
                                    <img src={require("../../../images/chart/Block-Producer-Chart.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                                {/*{*/}
                                    {/*pieChart === null ?*/}
                                        {/*<TronLoader/> :*/}
                                        {/*<RepresentativesRingPieReact message={{id: 'produce_distribution'}}*/}
                                                                     {/*intl={intl}*/}
                                                                     {/*data={pieChart} style={{height: 300}}/>*/}
                                {/*}*/}
                            {/*</div>*/}
                        </div>
                        <div className="col-md-4">
                            <div className="card-chart">
                                <Link className="card-title" to="/blockchain/stats/supply">
                                    {tu("total_TRX_supply")}
                                    <img src={require("../../../images/chart/Total-TRX-Supply.png")}
                                         style={{width: 240, filter: 'grayscale(0%)'}}/>
                                </Link>
                            </div>
                            {/*<div style={{height: 350}}>*/}
                                {/*{*/}
                                    {/*supplyTypesChart === null ?*/}
                                        {/*<TronLoader/> :*/}
                                        {/*<SupplyTypesTRXPieChart message={{id: 'total_TRX_supply'}} intl={intl}*/}
                                                                {/*data={supplyTypesChart} style={{height: 300}}/>*/}
                                {/*}*/}
                            {/*</div>*/}
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



