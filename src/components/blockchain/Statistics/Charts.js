import React from "react";
import xhr from "axios/index";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, includes} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import {TronLoader} from "../../common/loaders";
import PieReact from "../../common/PieChart";
import LineReact from "../../common/LineChart";
import {cloneDeep} from "lodash";
import {tu} from "../../../utils/i18n";
import CountUp from 'react-countup';
import {Link} from "react-router-dom"
import {API_URL} from "../../../constants";
import { DatePicker, Select } from 'antd';
import SmartTable from "../../common/SmartTable.js"
import moment from 'moment';
import { upperFirst,sortBy } from 'lodash'
import {AddressLink} from "../../common/Links";
import {Truncate} from "../../common/text";
import {QuestionMark} from "../../common/QuestionMark";
import { CsvExport } from "../../common/CsvExport";
import isMobile from "../../../utils/isMobile";
import {
    LineReactHighChartAdd,
    LineReactHighChartTx,
    LineReactHighChartTotalTxns,
    LineReactHighChartBlockchainSize,
    BarReactHighChartBlockSize,
    LineReactHighChartPrice,
    LineReactHighChartVolumeUsd,
    EnergyConsumeChart,
    ContractInvocationChart,
    ContractInvocationDistributionChart,
    EnergyConsumeDistributionChart,
    OverallFreezingRateChart,
} from "../../common/LineCharts";

import {
    RepresentativesRingPieReact,
    SupplyTypesTRXPieChart,
} from "../../common/RingPieChart";

import {loadPriceData} from "../../../actions/markets";
import {t} from "../../../utils/i18n";

const Option = Select.Option;

// const API_URL = 'http://52.15.68.74:10000'

class StatCharts extends React.Component {

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
            circulatingNum:null,
            energyConsumeData: null,
            ContractInvocation: null,
            ContractInvocationDistribution: null,
            ContractInvocationDistributionParams: {
                time: new Date().getTime() - 2*24*60*60*1000,
                range: 20,
                total_used_energy: 0,
                scale: '',
                range_type: 'Top20'
            },
            EnergyConsumeDistribution: null,
            OverallFreezingRate:null,
            OverallFreezingRateParams:{
                start_day:'2019-12-01',
                end_day: moment().format("YYYY-MM-DD")
            }
        };
    }

    componentDidMount() {
        let {match} = this.props;
        let chartName = match.params.chartName;
       
        switch (chartName){
            case 'OverallFreezingRate':
                this.loadOverallFreezingRate();
                break;   
            default:
                this.loadTxOverviewStats();
                break;
        }
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

    async loadTxOverviewStats() {
        let { txOverviewStats } = await Client.getTxOverviewStatsAll();
        let temp = [];
        let addressesTemp = [];
        let blockSizeStatsTemp = [];
        let blockchainSizeStatsTemp = [];
        for (let txs in txOverviewStats) {
            let tx = parseInt(txs);
            if (tx === 0) {
                temp.push({
                    avgBlockSize: txOverviewStats[tx].avgBlockSize,
                    avgBlockTime: txOverviewStats[tx].avgBlockTime,
                    blockchainSize: txOverviewStats[tx].blockchainSize,
                    date: txOverviewStats[tx].date,
                    newAddressSeen: txOverviewStats[tx].newAddressSeen,
                    newBlockSeen: txOverviewStats[tx].newBlockSeen,
                    newTransactionSeen: txOverviewStats[tx].newTransactionSeen,
                    totalAddress: txOverviewStats[tx].totalAddress,
                    totalBlockCount: txOverviewStats[tx].totalBlockCount,
                    totalTransaction: txOverviewStats[tx].totalTransaction,
                    newtotalTransaction:txOverviewStats[tx].totalTransaction,
                    newtotalAddress:txOverviewStats[tx].totalAddress,
                    newtotalBlockCount:txOverviewStats[tx].totalBlockCount,
                })
                addressesTemp.push({
                    date: txOverviewStats[tx].date,
                    total: txOverviewStats[tx].newAddressSeen,
                    increment: txOverviewStats[tx].newAddressSeen,
                });
            }
            else {
                temp.push({
                    date: txOverviewStats[tx].date,
                    totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
                    avgBlockTime: txOverviewStats[tx].avgBlockTime,
                    avgBlockSize: txOverviewStats[tx].avgBlockSize,
                    totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
                    newAddressSeen: txOverviewStats[tx].newAddressSeen,
                    newtotalTransaction:txOverviewStats[tx].totalTransaction,
                    newtotalAddress:txOverviewStats[tx].totalAddress,
                    newtotalBlockCount:txOverviewStats[tx].totalBlockCount,
                });
                addressesTemp.push({
                    date: txOverviewStats[tx].date,
                    total: txOverviewStats[tx].totalAddress,
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
            txOverviewStats:  temp.slice(0, temp.length - 1),
            txOverviewStatsFull:  temp.slice(0, temp.length),
            addressesStats: addressesTemp.slice(0, addressesTemp.length - 1),
            blockSizeStats: blockSizeStatsTemp,
            blockchainSizeStats: blockchainSizeStatsTemp,
        });

        function compare (property) {
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

        let higest = {date: '', increment: ''};
        let lowest = {date: '', increment: ''};
        let addr = cloneDeep(addressesTemp).sort(compare('increment'));
        let tx = cloneDeep(temp).sort(compare('totalTransaction'));
        let totaltxns = cloneDeep(temp).sort(compare('newtotalTransaction'));
        let bs = cloneDeep(blockSizeStatsTemp).sort(compare('avgBlockSize'));
        let _bcs = [];

        for (let b in blockchainSizeStatsTemp) {
            let _b = parseInt(b);
            if (_b === 0) {
                _bcs.push({
                    date: blockchainSizeStatsTemp[0].date,
                    blockchainSize: blockchainSizeStatsTemp[0].blockchainSize / 1000000
                });
            }
            else {
                _bcs.push({
                    date: blockchainSizeStatsTemp[_b].date,
                    blockchainSize: (blockchainSizeStatsTemp[_b].blockchainSize - blockchainSizeStatsTemp[_b - 1].blockchainSize) / 1000000
                })
            }
        }
        let bcs = _bcs.sort(compare('blockchainSize'));

        this.setState({
            summit: {
                addressesStats_sort: [
                    {
                        date: addr[addr.length - 1].date,
                        increment: addr[addr.length - 1].increment
                    },
                    {
                        date: addr[0].date,
                        increment: addr[0].increment
                    }],
                txOverviewStats_sort: [
                    {
                        date: tx[tx.length - 1].date,
                        increment: tx[tx.length - 1].totalTransaction
                    },
                    {
                        date: tx[0].date,
                        increment: tx[0].totalTransaction
                    }],
                totalTxns_sort: [
                    {
                        date: totaltxns[totaltxns.length - 1].date,
                        increment: totaltxns[totaltxns.length - 1].newtotalTransaction
                    },
                    {
                        date: totaltxns[0].date,
                        increment: totaltxns[0].newtotalTransaction
                    }],
                blockSizeStats_sort: [
                    {
                        date: bs[bs.length - 1].date,
                        increment: bs[bs.length - 1].avgBlockSize
                    },
                    {
                        date: bs[0].date,
                        increment: bs[0].avgBlockSize
                    }],
                blockchainSizeStats_sort: [
                    {
                        date: bcs[bcs.length - 1].date,
                        increment: bcs[bcs.length - 1].blockchainSize
                    },
                    {
                        date: bcs[0].date,
                        increment: bcs[0].blockchainSize
                    }],


            }
        });
    }

    

    //冻结率
    async loadOverallFreezingRate() {
        let { start_day, end_day} = this.state.OverallFreezingRateParams;
       // let {data: {data}} = await xhr.get(API_URL + "/api/freezeresource?start_day="+ start_day+"&end_day="+end_day);
        let {data: {data}} = await xhr.get("http://3.14.14.175:9000" + "/api/freezeresource?start_day="+ start_day+"&end_day="+end_day);
       
        
        data.map((item, index) => {
            item.timestamp = moment(item.day).valueOf();
            item.freezing_rate_percent = parseFloat((item.freezing_rate * 100).toFixed(2));
        })
        console.log('data',data)
        this.setState({
            OverallFreezingRate:  sortBy(data, function(o) { return o.timestamp; }),
            // OverallFreezingRate:  data
        });
       
        let higest = {date: '', increment: ''};
        let lowest = {date: '', increment: ''};
        let pr = cloneDeep(data).sort(this.compare('freezing_rate'));
        for (let p in pr) {
            pr[p] = {date: pr[p].time, ...pr[p]};
        }
        this.setState({
            summit: {
                OverallFreezingRate_sort: [
                    {
                        date: pr[pr.length - 1].timestamp ,
                        increment: pr[pr.length - 1].freezing_rate ? (pr[pr.length - 1].freezing_rate * 100).toFixed(2) + '%': 0
                    },
                    {
                        date: pr[0].timestamp,
                        increment: pr[0].freezing_rate ? (pr[0].freezing_rate * 100).toFixed(2) + '%': 0
                    }],

            }
        });
    }

    freezingCustomizedColumn = () => {
    let {intl} = this.props;
    let column = [
        {
            title: upperFirst(intl.formatMessage({id: 'freezing_column_time'})),
            dataIndex: 'day',
            key: 'day',
            width: '60px',
            align: 'center',
            render: (text, record, index) => {
                return <span>{text}</span>
            }
        },
        {
        title: upperFirst(intl.formatMessage({id: 'freezing_column_total_circulation'})),
        dataIndex: 'total_turn_over',
        key: 'total_turn_over',
        render: (text, record, index) => {
            return <FormattedNumber value={text}/>
        }
        },
        {
        title: upperFirst(intl.formatMessage({id: 'freezing_column_total_frozen'})),
        dataIndex: 'total_freeze_weight',
        key: 'total_freeze_weight',
        render: (text, record, index) => {
            return <FormattedNumber value={text}/>
        }
        },
        {
        title: () => {
            let text = intl.formatMessage({id: 'freezing_column_freezing_rate_tip'}); 
            return (
              <div>
                {upperFirst(intl.formatMessage({id: 'freezing_column_freezing_rate'}))}
                <span className="ml-2">
                  <QuestionMark placement="top" text={text} />
                </span>
              </div>
            )
        },
        dataIndex: 'freezing_column_freezing_rate',
        key: 'freezing_column_freezing_rate',
        render: (text, record, index) => {
            return <span>
                {record.freezing_rate?
                    <span>
                        <FormattedNumber
                        value={(record.freezing_rate)*100}
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                    /> %
                    </span>    
                 :<span>0</span>
                }
                
            </span>
            }
        },
        {
        title: () => {
            let text = intl.formatMessage({id: 'freezing_column_energy_ratio_tip'}); 
            return (
              <div>
                {upperFirst(intl.formatMessage({id: 'freezing_column_energy_ratio'}))}
                <span className="ml-2">
                  <QuestionMark placement="top" text={text} />
                </span>
              </div>
            )
        },
        dataIndex: 'caller_amount',
        key: 'caller_amount',
        render: (text, record, index) => {
            return <span>
            {record.energy_rate?
                <span>
                    <FormattedNumber
                    value={(record.energy_rate)*100}
                    minimumFractionDigits={2}
                    maximumFractionDigits={2}
                /> %
                </span>    
             :<span>0</span>
            }
        </span>
        }
        },
        {
        title: () => {
            let text = intl.formatMessage({id: 'freezing_column_bandwidth_ratio_tip'}); 
            return (
              <div>
                {upperFirst(intl.formatMessage({id: 'freezing_column_bandwidth_ratio'}))}
                <span className="ml-2">
                  <QuestionMark placement="top" text={text} />
                </span>
              </div>
            )
        },
        dataIndex: 'trigger_amount',
        key: 'trigger_amount',
        render: (text, record, index) => {
            return <span>
            {record.net_rate?
                <span>
                    <FormattedNumber
                    value={(record.net_rate)*100}
                    minimumFractionDigits={2}
                    maximumFractionDigits={2}
                /> %
                </span>    
             :<span>0</span>
            }
        </span>
        }
        },
    //   {
    //     title: upperFirst(intl.formatMessage({id: 'freezing_column_more'})),
    //     dataIndex: 'caller_percent',
    //     key: 'caller_percent',
    //     render: (text, record, index) => {
    //       return <span>{text}</span>
    //     }
    //   },
        
    ];
    return column;
    }
    render() {
        let {match, intl} = this.props;
        let {txOverviewStats, txOverviewStatsFull, 
            addressesStats, blockSizeStats, blockchainSizeStats, summit ,OverallFreezingRate } = this.state;
        let { start_day, end_day} = this.state.OverallFreezingRateParams;

        let unit;
        
         let csvurl = "http://3.14.14.175:9000" + "/api/freezeresource?start_day=" + start_day+"&end_day="+end_day + "&format=csv";
        // let csvurl = API_URL + "/api/freezeresource?start_day=" + start_day+"&end_day="+end_day + "&format=csv";
        let freezing_column = this.freezingCustomizedColumn();
        let chartHeight = isMobile? 240: 580
        if (match.params.chartName === 'blockchainSizeStats' || match.params.chartName === 'addressesStats') {
            unit = 'increase';
        } else {
            unit = 'number';
        }
        

        return (
            <main className="container header-overlap">
                {
                    match.params.chartName != 'pieChart' && match.params.chartName != 'supply' && match.params.chartName != 'ContractInvocationDistribution' && match.params.chartName !='EnergyConsumeDistribution' ?
                        <div className="alert alert-light" role="alert">
                          <div className="row">
                            <div className="col-md-6 text-center">
                                {
                                    summit && summit[match.params.chartName + '_sort'] &&
                                    <span>{t('freezing_column_freezing_rate')}&nbsp;{tu('highest')}{t(unit)}{t('_of')}
                                      <strong>{' ' + summit[match.params.chartName + '_sort'][0].increment + ' '}</strong>
                                        {t('was_recorded_on')} {intl.formatDate(summit[match.params.chartName + '_sort'][0].date)}
                            </span>
                                }
                            </div>
                            <div className="col-md-6 text-center">
                                {
                                    summit && summit[match.params.chartName + '_sort'] &&
                                    <span>{t('freezing_column_freezing_rate')}&nbsp;{tu('lowest')}{t(unit)}{t('_of')}
                                      <strong>{' ' + summit[match.params.chartName + '_sort'][1].increment + ' '}</strong>
                                        {t('was_recorded_on')} {intl.formatDate(summit[match.params.chartName + '_sort'][1].date)}
                            </span>
                                }
                            </div>
                          </div>
                        </div>
                        : null
                }
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body p-3 p-md-5">
                        {
                           match.params.chartName === 'OverallFreezingRate' &&
                           <div>
                           {
                               OverallFreezingRate === null ? <TronLoader/> :
                               <div>
                                   <OverallFreezingRateChart
                                       style={{height: chartHeight}}
                                       data={OverallFreezingRate}
                                       intl={intl}
                                   />
                                   <div className="token_black">
                                   <div className="col-md-12 table_pos">
                                       {/* <p>{ intl.formatMessage({id: 'a_total'}) + intl.formatNumber(ContractInvocationDistributionParams.total_energy)+ 
                                           intl.formatMessage({id: 'Contract_times_calls'})}
                                       </p> */}
                                       
                                   </div>
                                   </div>

                               </div>
                           }
                           </div>
                       }
                    </div>

                  </div>
                   <div>
                   {
                        match.params.chartName === 'OverallFreezingRate' &&
                        <div>
                        {
                            OverallFreezingRate === null ? <TronLoader/> :
                            <div>
                                <div className="token_black">
                                    <div className="col-md-12 table_pos" style={{padding:0}}>
                                        <div className="pt-4 pb-2 d-flex justify-content-between">
                                            <div>
                                                {
                                                    intl.formatMessage({id: 'freezing_column_a_total'}) + intl.formatNumber(OverallFreezingRate.length)+ 
                                                    intl.formatMessage({id: 'freezing_column_calls'})
                                                }
                                            </div>
                                            <div style={{marginTop:-20}}>
                                            {[
                                                "OverallFreezingRate"
                                                ].indexOf(match.params.chartName) !== -1 ? (
                                                <CsvExport downloadURL={csvurl} />
                                                ) : (
                                                ""
                                                )}
                                            </div>
                                        </div>
                                        {
                                            ( OverallFreezingRate.length === 0)?
                                            <div className="p-3 text-center no-data">{tu("no_data")}</div>
                                            :
                                            <SmartTable 
                                                bordered={true} 
                                                column={freezing_column} 
                                                data={OverallFreezingRate}
                                                position="bottom"
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                           }
                           </div>
                       }
                        
                   </div>
                </div>
              </div>

            </main>
        );
    }
}


function

mapStateToProps(state) {
    return {
        priceGraph: state.markets.price
    };
}

const
    mapDispatchToProps = {
        loadPriceData,
    };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(StatCharts))
