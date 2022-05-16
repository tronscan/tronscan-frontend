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
import {BigNumber} from 'bignumber.js'
import {cloneDeep} from "lodash";
import {tu} from "../../../utils/i18n";
import CountUp from 'react-countup';
import {Link} from "react-router-dom"
import {API_URL} from "../../../constants";
import { DatePicker, Select } from 'antd';
import SmartTable from "../../common/SmartTable.js"
import moment from 'moment';
import { upperFirst } from 'lodash'
import {AddressLink} from "../../common/Links";
import {Truncate} from "../../common/text";

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
    LineTxOverviewStatsType,
} from "../../common/LineCharts";

import {
    RepresentativesRingPieReact,
    SupplyTypesTRXPieChart,
} from "../../common/RingPieChart";

import {loadPriceData} from "../../../actions/markets";
import {t} from "../../../utils/i18n";

const Option = Select.Option;

// const API_URL = 'http://52.15.68.74:10000'

class Statistics extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: null,
            transactionStats: null,
            blockStats: null,
            transactionValueStats: null,
            txOverviewStats: null,
            txOverviewStatsType:null,
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
                time: new Date().getTime() - 24*60*60*1000,
                range: 20,
                total_used_energy: 0,
                scale: '',
                range_type: 'Top20'
            },
            EnergyConsumeDistribution: null,
            OverallFreezingRate:null,
            OverallFreezingRateParams:{
                start_day:'2019-12-01',
                end_day:'2019-12-12'
            },
            energyConsumeDataTop:{
                freezingEnergy:0,
                burningEnergy:0,
                userBurningEnergy:0
            }
        };
    }

    componentDidMount() {
        let {match} = this.props;
        let chartName = match.params.chartName;
        switch (chartName){
            case 'supply':

                this.loadTotalTRXSupply();
                setInterval(() => {
                    this.loadTotalTRXSupply();
                }, 60000);
                break;
            case 'pieChart':
                this.loadPieChart();
                break;
            case 'volumeStats':
                this.loadVolume();
                break;
            case 'priceStats':
                this.loadPriceStats();
                break;
            case 'accounts':
                this.loadAccounts();
                break;
            case 'EnergyConsume':
                this.loadEnergyConsumeData();
                break;
            case 'ContractInvocation':
                this.loadContractInvocation();
                break;
            case 'ContractInvocationDistribution':
                this.loadContractInvocationDistribution();
                break;
            case 'EnergyConsumeDistribution':
                this.loadEnergyConsumeDistribution();
                break;
            case 'OverallFreezingRate':
                this.loadOverallFreezingRate();
                break;   
            case 'txOverviewStatsType':
                this.loadTxOverviewStatsType();
                break;       
            case 'txOverviewStats':
                this.loadTxOverviewStats();
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

    async loadAccounts() {
        // let {accounts} = await Client.getAccounts({
        //     limit: 35,
        //     sort: '-balance',
        // });
        let accountData = await xhr.get("https://assistapi.tronscan.org/api/account?limit=35&sort=-balance");
        let accounts = accountData.data;
        this.setState({
            accounts: filter(accounts, account => !includes(tronAddresses, account.address))
                .slice(0, 10)
                .map(account => ({
                    name: account.address,
                    value: account.balance / ONE_TRX,
                }))
        });
    }
    loadTotalTRXSupply = async() =>{
        let {intl} = this.props;
        const {funds} = await Client.getFundsSupply();

        let supplyTypesChartData = [
            {value: funds.turnOver, name: 'circulating_supply', selected: true,sliced: true},
            {value: funds.fundTrx, name: 'total_frozen', selected: false,sliced: false},
        ]
        // cmc change api
        let btcURL =  encodeURI(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TRX&convert=BTC`
        );
        let usdURL = encodeURI(
            `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TRX&convert=USD`
        );
        var { data: {data:dataBTC} } = await xhr.post(
            `${API_URL}/api/system/proxy`,
            {
              url:btcURL
            }
          );
        var { data: {data:dataUSD} } = await xhr.post(
            `${API_URL}/api/system/proxy`,
            {
                url:usdURL
            }
        );

        let priceUSD,marketCapitalization
        if(dataUSD){
            priceUSD = (parseFloat(dataUSD.TRX.quote.USD.price)*1000).toFixed(2);  
            marketCapitalization = (dataUSD.TRX.quote.USD.price*(funds.totalTurnOver)).toFixed(2);
        }else{
            priceUSD = 0
        }
        let priceBTC;
        if(dataBTC){
            let  x = new BigNumber(dataBTC.TRX.quote.BTC.price); 
            priceBTC = x.multipliedBy(1000).toFixed(5);
        }else{
            priceBTC = 0
        }
        
        this.setState({
            supplyTypesChart: supplyTypesChartData,
            genesisNum:intl.formatNumber(funds.genesisBlockIssue),
            blockProduceRewardsNum:intl.formatNumber(funds.totalBlockPay),
            nodeRewardsNum:intl.formatNumber(funds.totalNodePay),
            independenceDayBurned:intl.formatNumber(funds.burnPerDay),
            feeBurnedNum:intl.formatNumber(funds.burnByCharge),
            currentTotalSupply:funds.totalTurnOver,
            priceUSD:priceUSD,
            priceBTC:priceBTC,
            marketCapitalization:marketCapitalization,
            foundationFreeze:intl.formatNumber(funds.fundTrx),
            circulatingNum:intl.formatNumber(funds.turnOver)
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

    async loadVolume(){
        let {intl} = this.props;
        let TRXURL = encodeURI(`https://graphs2.coinmarketcap.com/currencies/tron/`)
        let volumeData = await xhr.get(
            `${API_URL}/api/system/proxy?url=${TRXURL}`
        );
    
        let volumeUSD = volumeData.data.market_cap_by_available_supply

        let volume = volumeUSD.map(function (v, i) {
            return {
                time: v[0],
                volume_billion: v[1] / Math.pow(10, 9),
                volume_usd: intl.formatNumber(v[1]) + ' USD',
                volume_usd_num: v[1]
            }
        })
        this.setState({
            volumeStats: volume.slice(27, volume.length - 1),
        });
        let higest = {date: '', increment: ''};
        let lowest = {date: '', increment: ''};
        let vo = cloneDeep(volume).sort(this.compare('volume_usd_num'));
        for (let v in vo) {
            vo[v] = {date: vo[v].time, ...vo[v]};
        }
        this.setState({
            summit: {
                volumeStats_sort: [
                    {
                        date: vo[vo.length - 1].time,
                        increment: vo[vo.length - 1].volume_usd_num
                    },
                    {
                        date: vo[0].time,
                        increment: vo[0].volume_usd_num
                    }],
            }
        });
    }
    async loadPriceStats(){
        let {intl} = this.props;
        let today = new Date();
        let timerToday = today.getTime();
        let birthday = new Date("2017/10/10");
        let timerBirthday = birthday.getTime();
        let dayNum = Math.floor((timerToday - timerBirthday) / 1000 / 3600 / 24);
        let {data} = await xhr.get("https://min-api.cryptocompare.com/data/histoday?fsym=TRX&tsym=USD&limit=" + dayNum);
        let priceStatsTemp = data['Data'];
        this.setState({
            priceStats: priceStatsTemp
        });
        let higest = {date: '', increment: ''};
        let lowest = {date: '', increment: ''};
        let pr = cloneDeep(priceStatsTemp).sort(this.compare('close'));
        for (let p in pr) {
            pr[p] = {date: pr[p].time, ...pr[p]};
        }
        this.setState({
            summit: {
                priceStats_sort: [
                    {
                        date: pr[pr.length - 1].time * 1000,
                        increment: pr[pr.length - 1].close
                    },
                    {
                        date: pr[0].time * 1000,
                        increment: pr[0].close
                    }],
            }
        });
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

    async loadTxOverviewStatsType() {
        let { txOverviewStats } = await Client.getTxOverviewStatsAll();
        

        let temp = [];
        let addressesTemp = [];
        let blockSizeStatsTemp = [];
        let blockchainSizeStatsTemp = [];
        // for (let txs in txOverviewStats) {
        //     let tx = parseInt(txs);
        //     if (tx === 0) {
        //         temp.push({
        //             avgBlockSize: txOverviewStats[tx].avgBlockSize,
        //             avgBlockTime: txOverviewStats[tx].avgBlockTime,
        //             blockchainSize: txOverviewStats[tx].blockchainSize,
        //             date: txOverviewStats[tx].date,
        //             newAddressSeen: txOverviewStats[tx].newAddressSeen,
        //             newBlockSeen: txOverviewStats[tx].newBlockSeen,
        //             newTransactionSeen: txOverviewStats[tx].newTransactionSeen,
        //             totalAddress: txOverviewStats[tx].totalAddress,
        //             totalBlockCount: txOverviewStats[tx].totalBlockCount,
        //             totalTransaction: txOverviewStats[tx].totalTransaction,
        //             newtotalTransaction:txOverviewStats[tx].totalTransaction,
        //             newtotalAddress:txOverviewStats[tx].totalAddress,
        //             newtotalBlockCount:txOverviewStats[tx].totalBlockCount,
        //         })
        //         addressesTemp.push({
        //             date: txOverviewStats[tx].date,
        //             total: txOverviewStats[tx].newAddressSeen,
        //             increment: txOverviewStats[tx].newAddressSeen,
        //         });
        //     }
        //     else {
        //         temp.push({
        //             date: txOverviewStats[tx].date,
        //             totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
        //             avgBlockTime: txOverviewStats[tx].avgBlockTime,
        //             avgBlockSize: txOverviewStats[tx].avgBlockSize,
        //             totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
        //             newAddressSeen: txOverviewStats[tx].newAddressSeen,
        //             newtotalTransaction:txOverviewStats[tx].totalTransaction,
        //             newtotalAddress:txOverviewStats[tx].totalAddress,
        //             newtotalBlockCount:txOverviewStats[tx].totalBlockCount,
        //         });
        //         addressesTemp.push({
        //             date: txOverviewStats[tx].date,
        //             total: txOverviewStats[tx].totalAddress,
        //             increment: txOverviewStats[tx].newAddressSeen
        //         });
        //     }
        //     blockSizeStatsTemp.push({
        //         date: txOverviewStats[tx].date,
        //         avgBlockSize: txOverviewStats[tx].avgBlockSize
        //     });
        //     blockchainSizeStatsTemp.push({
        //         date: txOverviewStats[tx].date,
        //         blockchainSize: txOverviewStats[tx].blockchainSize
        //     });
        // }
        txOverviewStats.map((item, index) => {
            item.newTransactionSeen_num = item.newTransactionSeen?item.newTransactionSeen:0;
            item.triggers_num = item.newTrigger?item.newTrigger:0;
            item.trx_transfer_num = item.trx_transfer?item.trx_transfer:0;
            item.trc10_transfer_num = item.trc10_transfer?item.trc10_transfer:0;
            item.freeze_transaction_num = item.freeze_transaction?item.freeze_transaction:0;
            item.vote_transaction_num = item.vote_transaction?item.vote_transaction:0;
            item.other_transaction_num = item.other_transaction?item.other_transaction:0;
            item.shielded_transaction_num = item.shielded_transaction?item.shielded_transaction:0;
        })
       
        this.setState({
            txOverviewStatsType:  txOverviewStats.slice(0, txOverviewStats.length - 1),
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
        let tx = cloneDeep(txOverviewStats).sort(compare('newTransactionSeen'));
  
        this.setState({
            summit: {
                txOverviewStatsType_sort: [
                    {
                        date: tx[tx.length - 1].date,
                        increment: tx[tx.length - 1].newTransactionSeen
                    },
                    {
                        date: tx[0].date,
                        increment: tx[0].newTransactionSeen
                    }],
            }
        });
    }
    

    // 获取TRON日能量消耗图表
    async loadEnergyConsumeData() {
        let {data} = await xhr.get(API_URL + "/api/energystatistic");
        data.data.pop()
        this.setState({
            energyConsumeData: data.data,
            summit: {
                EnergyConsume_sort: [
                    {
                        date:  data.max.day,
                        increment: data.max.total_energy
                    },
                    {
                        date:  data.min.day,
                        increment: data.min.total_energy
                    }
                ]
                
            }
        });
    }

    // TRON日合约调用图表
    async loadContractInvocation() {
        // 次数
        let {data } = await xhr.get(API_URL + "/api/triggerstatistic");
        // 地址数
        let {data: addressData } = await xhr.get(API_URL + "/api/calleraddressstatistic");

        data.data.pop()
        addressData.data.pop()

        let payload = {
            trigger_amount: [],
            address_amount: []
        }
        data.data.map(item => {
            payload.trigger_amount.push([
                moment(item.day).valueOf(),
                item.triggers_amount
            ])
        })
        addressData.data.map(item => {
            payload.address_amount.push([
                moment(item.day).valueOf(),
                item.caller_amount
            ])
        })

        this.setState({
            ContractInvocation: payload,
            summit: {
                ContractInvocation_sort: [
                    {
                        date: data.max.day,
                        increment: data.max.triggers_amount
                    },
                    {
                        date: data.min.day,
                        increment: data.min.triggers_amount
                    }
                ]
                
            }
        });
    }

    // 每日合约消耗能量分布
    async loadEnergyConsumeDistribution(){
        let { time, range} = this.state.ContractInvocationDistributionParams
        let {data: {total, totalEnergy, data}} = await xhr.get(API_URL + "/api/energydailystatistic?limit="+ range+"&day="+time);

        let totle_used_energy = 0
        let used_scale = ''
        let freezingEnergy = 0
        let burningEnergy = 0
        let userBurningEnergy = 0;

        data.map((item, index) => {
            item.percent = ((item.total_energy / totalEnergy)*100).toFixed(2) + '%'
            item.index = index+1
            item.name = item.name || '-'
            totle_used_energy += item.total_energy
            freezingEnergy += Number(item.energy)
            burningEnergy += Number(item.trx)
            userBurningEnergy += Number(item.contract_supplied)
        })

        

        used_scale = ((totle_used_energy / totalEnergy)*100).toFixed(2) + '%'

        this.setState({
            EnergyConsumeDistribution: data,
            ContractInvocationDistributionParams: {
                ...this.state.ContractInvocationDistributionParams,
                total_used_energy: totle_used_energy,
                scale: used_scale,
                total_energy: totalEnergy
            },
            energyConsumeDataTop:{
                freezingEnergy,
                burningEnergy,
                userBurningEnergy
            }
        });
    }

     
    async loadContractInvocationDistribution() {
        let { time, range} = this.state.ContractInvocationDistributionParams
        let {data: {data, totalCallerAmount, totalTrigger}} = await xhr.get(API_URL + "/api/triggeramountstatistic?limit="+ range+"&day="+time);
        // let {data: callData} = await xhr.get(API_URL + "/api/calleraddressamountstatistic?limit="+ range+"&long="+time);

        let totle_used_energy = 0
        let used_scale = ''

        data.map((item, index) => {
            item.caller_percent = (item.caller_amount / totalCallerAmount).toFixed(2) + '%'
            item.trigger_percent = (item.trigger_amount / totalTrigger).toFixed(2) + '%'
            item.index = index+1
            item.name = item.name || '-'
        })
        
        used_scale = (totle_used_energy / data.totalTrigger).toFixed(2) + '%'


        this.setState({
            ContractInvocationDistribution: data,
            ContractInvocationDistributionParams: {
                ...this.state.ContractInvocationDistributionParams,
                total_energy: totalTrigger
            }
        });
    }

    //冻结率
    async loadOverallFreezingRate() {
        let { start_day, end_day} = this.state.OverallFreezingRateParams;
        let {data: {data}} = await xhr.get(API_URL + "/api/freezeresource?start_day="+ start_day+"&end_day="+end_day);
        data.map((item, index) => {
            item.freezing_percent = ((item.total_freeze_weight / item.total_turn_over)*100).toFixed(2) + '%'
        })
        this.setState({
            OverallFreezingRate: data,
            // ContractInvocationDistributionParams: {
            //     ...this.state.ContractInvocationDistributionParams,
            //     total_energy: totalTrigger
            // }
        });
    }

    onChangeDate = (date, dateString) => {
        let {match} = this.props;
        let chartName = match.params.chartName;
        this.setState({
            ContractInvocationDistributionParams: {
                ...this.state.ContractInvocationDistributionParams,
                time: date.valueOf()
            }
        }, () => {
           
            switch (chartName){
                case 'ContractInvocationDistribution':
                    this.loadContractInvocationDistribution();
                    break;
                case 'EnergyConsumeDistribution':
                    this.loadEnergyConsumeDistribution();
                    break;
            }
        })
       
       
    }
    handleChangeSelect = (value) => {
        let {match} = this.props;
        let chartName = match.params.chartName;
        let map = {
            20: 'Top20',
            50: 'Top50',
            100: 'Top100',
        }
        this.setState({
            ContractInvocationDistributionParams: {
                ...this.state.ContractInvocationDistributionParams,
                range: value,
                range_type: map[value]
            }
        }, () => {
            switch (chartName){
                case 'ContractInvocationDistribution':
                    this.loadContractInvocationDistribution();
                    break;
                case 'EnergyConsumeDistribution':
                    this.loadEnergyConsumeDistribution();
                    break;
            }
        })
    }

    disabledEndDate = (endValue) => {
        const startValue = new Date() -  24*60*60*1000
        if (!endValue || !startValue) {
          return false;
        }
        return endValue.valueOf() >= startValue.valueOf();
    }

    customizedColumn = () => {
        let {intl} = this.props;
        let column = [
            {
                title: "#",
                dataIndex: 'index',
                key: 'index',
                width: '5%',
                align: 'center',
                render: (text, record, index) => {
                  return <span style={{width:''}}>{text}</span>
                }
            },
          {
            title: upperFirst(intl.formatMessage({id: 'contract_address'})),
            dataIndex: 'contract_address',
            key: 'contract_address',
            width: '15%',
            render: (text, record, index) => {
            return <Truncate><AddressLink address={text} isContract={true}>{text}</AddressLink></Truncate>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'contract_name'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            render: (text, record, index) => {
              return <span style={{wordBreak:'break-all'}}>{text || '-'}</span>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'total_energy_used'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
              width: '12%',
            dataIndex: 'total_energy',
            key: 'total_energy',
            render: (text, record, index) => {
              return <span style={{width:''}}><FormattedNumber value={text}/></span>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'chart_resource_user_freeing'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
              width: '12%',
            dataIndex: 'energy',
            key: 'energy',
            render: (text, record, index) => {
              return <span style={{width:''}}><FormattedNumber value={text}/></span>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'chart_resource_user_burning'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
            dataIndex: 'trx',
            key: 'trx',
            width: '12%',
            render: (text, record, index) => {
              return <span style={{width:''}}><FormattedNumber value={text}/></span>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'chart_resource_contract_deployer'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
            width: '12%',
            dataIndex: 'contract_supplied',
            key: 'contract_supplied',
            render: (text, record, index) => {
              return <span style={{width:''}}><FormattedNumber value={text || 0}/></span>
            }
          },
          {
            title: () => {
                let title2 = upperFirst(intl.formatMessage({id: 'energy_scale'}))
                return (
                  <span className={'th-word-break'}>
                    {title2}
                  </span>
                );
              },
            dataIndex: 'percent',
            key: 'percent',
            width: '12%',
            render: (text, record, index) => {
              return <span>{text}</span>
            }
          },
        ];
        return column;
      }

      callCustomizedColumn = () => {
        let {intl} = this.props;
        let column = [
            {
                title: "#",
                dataIndex: 'index',
                key: 'index',
                width: '60px',
                align: 'center',
                render: (text, record, index) => {
                  return <span>{text}</span>
                }
            },
          {
            title: upperFirst(intl.formatMessage({id: 'contract_address'})),
            dataIndex: 'contract_address',
            key: 'contract_address',
            render: (text, record, index) => {
              return <AddressLink address={text} isContract={true}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'contract_name'})),
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
              return <span>{text || '-'}</span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'call_address_time'})),
            dataIndex: 'caller_amount',
            key: 'caller_amount',
            render: (text, record, index) => {
              return <FormattedNumber value={text}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'call_time'})),
            dataIndex: 'trigger_amount',
            key: 'trigger_amount',
            render: (text, record, index) => {
              return <FormattedNumber value={text}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'call_address_scale'})),
            dataIndex: 'caller_percent',
            key: 'caller_percent',
            render: (text, record, index) => {
              return <span>{text}</span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'call_scale'})),
            dataIndex: 'trigger_percent',
            key: 'trigger_percent',
            render: (text, record, index) => {
              return <span>{text}</span>
            }
          },
        ];
        return column;
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
            title: upperFirst(intl.formatMessage({id: 'freezing_column_freezing_rate'})),
            dataIndex: 'freezing_column_freezing_rate',
            key: 'freezing_column_freezing_rate',
            render: (text, record, index) => {
                return <span>
                    <FormattedNumber
                        value={(record.total_freeze_weight/record.total_turn_over)*100}
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                    /> %
                </span>


            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'freezing_column_energy_ratio'})),
            dataIndex: 'caller_amount',
            key: 'caller_amount',
            render: (text, record, index) => {
                return <span>
                    <FormattedNumber
                        value={(record.total_energy_weight/record.total_freeze_weight)*100} 
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                    /> %

                </span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'freezing_column_bandwidth_ratio'})),
            dataIndex: 'trigger_amount',
            key: 'trigger_amount',
            render: (text, record, index) => {
                return <span>
                    <FormattedNumber
                        value={(record.total_net_weight/record.total_freeze_weight)*100} 
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                    /> %
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
        let {txOverviewStats, txOverviewStatsType, txOverviewStatsFull, 
            addressesStats, blockSizeStats, blockchainSizeStats, 
            priceStats, transactionStats, transactionValueStats, 
            blockStats, accounts, volumeStats, pieChart, 
            supplyTypesChart, summit,genesisNum,
            blockProduceRewardsNum,nodeRewardsNum,
            independenceDayBurned,feeBurnedNum,currentTotalSupply,
            priceUSD,priceBTC,marketCapitalization,foundationFreeze,
            circulatingNum, energyConsumeData, ContractInvocation,
            ContractInvocationDistribution, ContractInvocationDistributionParams,
            EnergyConsumeDistribution,OverallFreezingRate,energyConsumeDataTop } = this.state;

        let unit;
        let uploadURL = API_URL + "/api/v2/node/overview_upload";
        let column = this.customizedColumn();
        let call_colum = this.callCustomizedColumn();
        let freezing_column = this.freezingCustomizedColumn();

        let chartHeight = isMobile? 240: 500
       

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
                                    <span>{t('highest')}{t(unit)}{t('_of')}
                                      <strong>{' ' + summit[match.params.chartName + '_sort'][0].increment + ' '}</strong>
                                        {t('was_recorded_on')} {intl.formatDate(summit[match.params.chartName + '_sort'][0].date)}
                            </span>
                                }
                            </div>
                            <div className="col-md-6 text-center">
                                {
                                    summit && summit[match.params.chartName + '_sort'] &&
                                    <span>{t('lowest')}{t(unit)}{t('_of')}
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
                            match.params.chartName === 'txOverviewStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    txOverviewStats === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartTx source='singleChart' style={{height: chartHeight}}
                                                              data={txOverviewStats} intl={intl}/>
                                }

                            </div>
                        }
                        {
                            match.params.chartName === 'txOverviewStatsType' &&
                            <div style={{height: chartHeight}}>
                                {
                                    txOverviewStatsType === null ?
                                        <TronLoader/> :
                                        <LineTxOverviewStatsType source='singleChart' style={{height: chartHeight}}
                                                              data={txOverviewStatsType} intl={intl}/>
                                }
                                
                            </div>
                        }
                        {
                            match.params.chartName === 'totalTxns' &&
                            <div style={{height: chartHeight}}>
                                {
                                  txOverviewStatsFull === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartTotalTxns source='singleChart' style={{height: chartHeight}}
                                                                     data={txOverviewStatsFull} intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'addressesStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    addressesStats === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartAdd source='singleChart' style={{height: chartHeight}} data={addressesStats} intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'blockSizeStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    blockSizeStats === null ?
                                        <TronLoader/> :
                                        <BarReactHighChartBlockSize source='singleChart' style={{height: chartHeight}}
                                                                    data={blockSizeStats}
                                                                    intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'blockchainSizeStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    blockchainSizeStats === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartBlockchainSize source='singleChart' style={{height: chartHeight}}
                                                                          data={blockchainSizeStats} intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'priceStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    priceStats === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartPrice source='singleChart' style={{height: chartHeight}}
                                                                 data={priceStats} intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'accounts' &&
                            <div style={{height: chartHeight}}>
                                {
                                    accounts === null ?
                                        <TronLoader/> :
                                        <PieReact style={{height: chartHeight}} data={accounts}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'transactionValueStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    transactionValueStats === null ?
                                        <TronLoader/> :
                                        <LineReact message={{
                                            id: 'trx_transferred_past_hour',
                                            href: 'transactionValueStats'
                                        }}
                                                   style={{height: chartHeight}} data={transactionValueStats}
                                                   keysData={['timestamp', 'value']}
                                                   format={{timestamp: true}}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'transactionStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    transactionStats === null ?
                                        <TronLoader/> :
                                        <LineReact
                                            message={{id: 'transactions_past_hour', href: 'transactionStats'}}
                                            style={{height: chartHeight}} data={transactionStats}
                                            keysData={['timestamp', 'value']}
                                            format={{timestamp: true}}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'blockStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    blockStats === null ?
                                        <TronLoader/> :
                                        <LineReact message={{id: 'average_blocksize', href: 'blockStats'}}
                                                   style={{height: chartHeight}} data={blockStats}
                                                   keysData={['timestamp', 'value']}
                                                   format={{timestamp: true}}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'volumeStats' &&
                            <div style={{height: chartHeight}}>
                                {
                                    volumeStats === null ?
                                        <TronLoader/> :
                                        <LineReactHighChartVolumeUsd style={{height: chartHeight}}
                                                                     data={volumeStats}
                                                                     intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'EnergyConsume' &&
                            <div style={{height: chartHeight}}>
                                {
                                    energyConsumeData === null ?
                                        <TronLoader/> :
                                        <EnergyConsumeChart source='singleChart'
                                                                     style={{height: chartHeight}}
                                                                     data={energyConsumeData}
                                                                     type="c2"
                                                                     intl={intl}/>
                                }
                            </div>
                        }
                        {
                            match.params.chartName === 'ContractInvocation' &&
                            <div style={{height: chartHeight}}>
                                {
                                    ContractInvocation === null ?
                                        <TronLoader/> :
                                        <ContractInvocationChart source='singleChart'
                                                                     style={{height: chartHeight}}
                                                                     data={ContractInvocation}
                                                                     intl={intl}/>
                                }
                            </div>
                        }

                        {
                        //    EnergyConsumeDistribution
                            match.params.chartName === 'EnergyConsumeDistribution' &&
                            <div>
                            {
                                EnergyConsumeDistribution === null ? <TronLoader/> :
                                <div>
                                    <div className="d-md-flex justify-content-between pb-3">
                                        <DatePicker 
                                            onChange={this.onChangeDate}
                                            disabledDate={this.disabledEndDate}
                                            defaultValue={moment(new Date(ContractInvocationDistributionParams.time), 'YYYY-MM-DD')}/>

                                        <div className="pt-3 pt-md-0">
                                            <span className="mr-2">{tu('range')}: </span>
                                            <Select defaultValue="top20" style={{ width: 160 }} onChange={this.handleChangeSelect}>
                                                <Option value="20">top20</Option>
                                                <Option value="50">top50</Option>
                                                <Option value="100">top100</Option>
                                            </Select>
                                        </div>
                                    </div>
                                
                                    <EnergyConsumeDistributionChart
                                        style={{height: chartHeight}}
                                        data={EnergyConsumeDistribution}
                                        intl={intl}
                                    />
                                    <div className="token_black">
                                    <div className="col-md-12 table_pos">
                                        {/* <p>{intl.formatMessage({id:'a_total'})+ intl.formatNumber(ContractInvocationDistributionParams.total_energy)+ 
                                        intl.formatMessage({id:'energe'})+' ('+ intl.formatMessage({id:'with_the_proportion_of'})+ContractInvocationDistributionParams.scale+
                                            ') '+ intl.formatMessage({id:'uesd_by_the'}) + ContractInvocationDistributionParams.range_type +
                                            intl.formatMessage({id:'contracts_from_the_total_used_of'}) + intl.formatNumber(ContractInvocationDistributionParams.total_used_energy)+
                                            intl.formatMessage({id:'energe'})}
                                        </p> */}
                                         <p style={{textAlign:'center'}}>
                                            {`${upperFirst(intl.formatMessage({id:'total_energy_used'}))}: ${intl.formatNumber(ContractInvocationDistributionParams.total_energy)} ENERGY,
                                            ${ContractInvocationDistributionParams.range_type} ${intl.formatMessage({id:'chart_energy'})}: ${intl.formatNumber(ContractInvocationDistributionParams.total_used_energy)} ENERGY
                                            (${intl.formatMessage({id: 'chart_resource_user_freeing'})} ${intl.formatNumber(energyConsumeDataTop.freezingEnergy)} ENERGY,
                                            ${intl.formatMessage({id: 'chart_resource_user_burning'})} ${intl.formatNumber(energyConsumeDataTop.burningEnergy)} ENERGY,
                                            ${intl.formatMessage({id: 'chart_resource_contract_deployer'})} ${intl.formatNumber(energyConsumeDataTop.userBurningEnergy)} ENERGY),
                                            ${upperFirst(intl.formatMessage({id:'energy_scale'}))} ${ContractInvocationDistributionParams.scale}`}
                                        </p>
                                        {( EnergyConsumeDistribution.length === 0)?
                                        <div className="p-3 text-center no-data">{tu("no_data")}</div>
                                        :
                                        <SmartTable 
                                            bordered={true} 
                                            column={column} 
                                            data={EnergyConsumeDistribution} 
                                        />}
                                    </div>
                                    </div>

                                </div>
                            }
                            </div>
                        }

                        {
                           
                            match.params.chartName === 'ContractInvocationDistribution' &&
                            <div>
                            {
                                ContractInvocationDistribution === null ? <TronLoader/> :
                                <div>
                                    <div className="d-md-flex justify-content-between pb-3">
                                        <DatePicker 
                                            onChange={this.onChangeDate}
                                            disabledDate={this.disabledEndDate}
                                            defaultValue={moment(new Date(ContractInvocationDistributionParams.time), 'YYYY-MM-DD')}/>

                                        <div className="pt-3 pt-md-0">
                                            <span className="mr-2">{tu('range')}: </span>
                                            <Select defaultValue="top20" style={{ width: 160 }} onChange={this.handleChangeSelect}>
                                                <Option value="20">top20</Option>
                                                <Option value="50">top50</Option>
                                                <Option value="100">top100</Option>
                                            </Select>
                                        </div>
                                    </div>
                                
                                    <ContractInvocationDistributionChart
                                        style={{height: chartHeight}}
                                        data={ContractInvocationDistribution}
                                        intl={intl}
                                    />
                                    <div className="token_black">
                                    <div className="col-md-12 table_pos">
                                        <p>{ intl.formatMessage({id: 'a_total'}) + intl.formatNumber(ContractInvocationDistributionParams.total_energy)+ 
                                            intl.formatMessage({id: 'Contract_times_calls'})}
                                        </p>
                                        {( ContractInvocationDistribution.length === 0)?
                                        <div className="p-3 text-center no-data">{tu("no_data")}</div>
                                        :
                                        <SmartTable 
                                            bordered={true} 
                                            column={call_colum} 
                                            data={ContractInvocationDistribution} 
                                        />}
                                    </div>
                                    </div>

                                </div>
                            }
                            </div>
                        }

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
                                       {( OverallFreezingRate.length === 0)?
                                       <div className="p-3 text-center no-data">{tu("no_data")}</div>
                                       :
                                       <SmartTable 
                                           bordered={true} 
                                           column={freezing_column} 
                                           data={OverallFreezingRate} 
                                       />}
                                   </div>
                                   </div>

                               </div>
                           }
                           </div>
                       }

                        
                        {

                            match.params.chartName === 'pieChart' &&
                            <div>
                                {
                                    pieChart === null ?
                                        <TronLoader/> :
                                        <RepresentativesRingPieReact source='singleChart'
                                                                     message={{id: 'produce_distribution'}}
                                                                     intl={intl}
                                                                     data={pieChart}
                                                                     style={{height: chartHeight}}/>

                                }
                            </div>

                        }
                        {
                            match.params.chartName === 'supply' &&
                            <div>
                                {
                                    supplyTypesChart === null ?
                                        <TronLoader/> :
                                        <div className="row" style={{fontSize : 12,marginRight:0}}>
                                          <div className="col-md-5">
                                            <div className="table-responsive">
                                              <table className="table" style={{marginTop : 10}}>
                                                <thead>
                                                <tr>
                                                  <th style={{border:0}}>
                                                    <i className="fa fa-puzzle-piece" ></i>
                                                    <span style={{marginTop:2}}>{tu('TRX_distribution_overview')}</span>
                                                  </th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                  <td>
                                                      {tu('genesis')}:
                                                  </td>
                                                  <td>
                                                      {genesisNum} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>+  {tu('block_produce_rewards')}:
                                                  </td>
                                                  <td>
                                                      {blockProduceRewardsNum} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>+ {tu('charts_total_TRX_supply_vote')}:
                                                  </td>
                                                  <td>
                                                      {nodeRewardsNum} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>- {tu('independence_day_burned')}:
                                                  </td>
                                                  <td>
                                                      {independenceDayBurned} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>- {tu('fee_burned')}:
                                                  </td>
                                                  <td>
                                                      {feeBurnedNum} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>= <b>{tu('current_total_supply')}:</b><br/>
                                                  </td>
                                                  <td>
                                                    <b>{intl.formatNumber(currentTotalSupply)} TRX</b>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style={{color:'red'}} className="go-foundation">
                                                    <Link to="/data/foundation" style={{color:'red',}}>{tu("total_frozen")}</Link>
                                                  </td>
                                                  <td>
                                                      {foundationFreeze} TRX
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>{tu('circulating_supply')}:
                                                  </td>
                                                  <td>
                                                      {circulatingNum} TRX
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
                                                  <th style={{border:0}}><br/><i className="fa fa-coins" ></i> {tu('price_per_1000_trx')}</th>
                                                </tr>
                                                </thead>
                                                <tbody><tr>
                                                  <td>{tu('in_USD')}:
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
                                                  *{tu('supply_notes')}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="col-md-7" style={{backgroundColor: '#F5F5F5',marginTop:0,paddingBottom:15}}>
                                            <div className="main-counters row">
                                              <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    <CountUp start={0} end={currentTotalSupply} duration={2}  separator="," decimals={2} />
                                                                </span>
                                                <h4>{tu('total_TRX_supply')}</h4>
                                              </div>
                                              <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    $<CountUp start={0} end={marketCapitalization} duration={2}  separator="," decimals={2}/>
                                                                </span>
                                                <h4>{tu('market_capitalization')}</h4>
                                              </div>
                                            </div>
                                            <div className="card">
                                              <div className="card-body" style={{height: 400}}>
                                                <SupplyTypesTRXPieChart
                                                    message={{id: 'breakdown_supply_types'}}
                                                    intl={intl}
                                                    data={supplyTypesChart}
                                                    style={{height: 300,marginTop:25}}
                                                    source='singleChart'
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                }
                            </div>

                        }
                    </div>

                  </div>
                    {
                        match.params.chartName === 'txOverviewStats' &&
                        <div style={{marginTop:20,float:'right'}}><i size="1" style={{fontStyle: 'normal'}}>[ Download <a href={uploadURL} style={{color: '#C23631'}}><b>CSV Export</b></a>&nbsp;<span className="glyphicon glyphicon-download-alt"></span> ]</i>&nbsp;</div>
                    }

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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Statistics))
