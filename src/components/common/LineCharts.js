import React from 'react'
import moment from 'moment';
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/chart/bar'

import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Exporting from 'highcharts/modules/exporting';
import Variabled from 'highcharts/modules/variable-pie.js';

import {cloneDeep} from "lodash";

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Exporting(Highcharts);
Variabled(Highcharts)

export class SupplyAreaHighChart extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            areaId: 'areaBtt' + id
        }
    }
    initArea(id) {
        let total = 990000000000;
        let _config = cloneDeep(config.supplyAreaHighChart);
        let {intl, data, source} = this.props;
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }

        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val};
                _config.series.push(temp);
            })
        }
        _config.chart.zoomType = 'x';
        _config.chart.marginTop = 80;
        _config.title.text = intl.formatMessage({id: 'BTT_Token_Release_Schedule'});
        _config.subtitle.text = intl.formatMessage({id: 'source_btt_team'});
        _config.exporting.filename = intl.formatMessage({id: 'BTT_Token_Release_Schedule'});
        _config.xAxis.categories = ['2019-01','2019-02','2019-03','2019-04','2019-05','2019-06','2019-07','2019-08','2019-09','2019-10','2019-11','2019-12','2020-01', '2020-02', '2020-03','2020-04','2020-05','2020-06','2020-07','2020-08','2020-09','2020-10','2020-11','2020-12','2021-01','2021-02','2021-03','2021-04','2021-05','2021-06','2021-07','2021-08','2021-09','2021-10','2021-11','2021-12','2022-01','2022-02','2022-03','2022-04','2022-05','2022-06','2022-07','2022-08','2022-09','2022-10','2022-11','2022-12'];
        // _config.xAxis.tickPixelInterval = 100;
        // _config.xAxis.minRange=24 * 3600 * 1000;
        // _config.yAxis.title.text = intl.formatMessage({id: 'addresses_amount'});
        // _config.yAxis.tickAmount = 5;
        // _config.yAxis.min = 0;
        _config.yAxis.tickPositions = [0,20,40,60,80,100];
        _config.yAxis.labels.formatter = function() {
            return this.value + '%'
        }
        //_config.series[0].marker.enabled = false;

        //_config.series[0].pointInterval = 24 * 3600 * 1000;
        //_config.series[0].pointStart = Date.UTC(2018, 5, 25);


        Highcharts.chart(document.getElementById(id),_config);

    }
    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initArea(this.state.areaId);
    }
    componentDidUpdate() {
        this.initArea(this.state.areaId);
    }

    render() {
        return (
            <div>
                <div id={this.state.areaId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartAdd extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineAdd' + id
        }
    }
    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (source == 'home'){
            if (data && data.length > 0) {
                _config.xAxis.categories = [];

                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.total};
                    _config.xAxis.categories.push(moment(val.date).format('M/D'));
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.spacingTop = 20;
            _config.exporting.enabled = false;
            _config.yAxis.min = data[0].total - 100000;
            _config.yAxis.tickInterval = 100000;
            _config.yAxis.tickAmount = 4;
            _config.yAxis.allowDecimals = true;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000){
                    return this.value/1000000 + 'M'
                }
            }
            _config.tooltip.formatter = function () {
                let date = intl.formatDate((parseInt(this.point.date)));
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'daily_increment'}) + ' : ' + this.point.increment + '<br/>' +
                    intl.formatMessage({id: 'total_addresses'}) + ' : ' + this.point.total
                )
            }
        }else{
            if (data && data.length === 0) {
                _config.title.text = "No data";
            }
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.total};
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.zoomType = 'x';
            _config.chart.marginTop = 80;
            _config.title.text = intl.formatMessage({id: 'address_growth_chart'});
            _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
            _config.exporting.filename = intl.formatMessage({id: 'address_growth_chart'});
            _config.xAxis.tickPixelInterval = 100;
            _config.xAxis.minRange=24 * 3600 * 1000;
            _config.yAxis.title.text = intl.formatMessage({id: 'addresses_amount'});
            _config.yAxis.tickAmount = 5;
            _config.yAxis.min = 0;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000){
                    return this.value/1000000 + 'M'
                }
            }
            _config.series[0].marker.enabled = false;
            _config.series[0].pointInterval = 24 * 3600 * 1000;
            _config.series[0].pointStart = Date.UTC(2018, 5, 25);
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.x);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'daily_increment'}) + ' : ' + this.point.increment + '<br/>' +
                    intl.formatMessage({id: 'total_addresses'}) + ' : ' + this.point.total
                )
            }
        }
        Highcharts.chart(document.getElementById(id),_config);

    }
    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartTx extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineTx' + id
        }
    }
    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;

        if (source == 'home'){
            if (data && data.length > 0) {
                _config.xAxis.categories = [];
                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.totalTransaction};
                    _config.xAxis.categories.push(moment(val.date).format('M/D'));
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.spacingTop = 20;
            _config.yAxis.tickAmount = 4;
            _config.yAxis.allowDecimals = true;
            _config.exporting.enabled = false;
            _config.yAxis.tickInterval = 1000000;
            _config.yAxis.min = 0;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000 && this.value >= 1000 ){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000){
                    return this.value/1000000 + 'M'
                }else if(this.value <1000){
                    return this.value
                }
            }
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.date);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + this.point.y
                )
            }
        }else{
            if (data && data.length === 0) {
                _config.title.text = "No data";
            }
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.totalTransaction};
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.zoomType = 'x';
            _config.chart.marginTop = 80;
            _config.title.text = intl.formatMessage({id: 'tron_transaction_chart'});
            _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
            _config.exporting.filename = intl.formatMessage({id: 'tron_transaction_chart'});
            _config.xAxis.tickPixelInterval = 100;
            _config.xAxis.minRange=24 * 3600 * 1000
            _config.yAxis.title.text = intl.formatMessage({id: 'transactions_per_day'});
            _config.yAxis.tickAmount = 6;
            _config.yAxis.min = 0;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000){
                    return this.value/1000000 + 'M'
                }
            }
            _config.series[0].marker.enabled = false;
            _config.series[0].pointInterval = 24 * 3600 * 1000;
            _config.series[0].pointStart = Date.UTC(2018, 5, 25);
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.x);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + this.point.y + '<br/>' +
                    intl.formatMessage({id: 'avg_blockSize'}) + ' : ' + this.point.avgBlockSize + '<br/>' +
                    intl.formatMessage({id: 'new_address_seen'}) + ' : ' + this.point.newAddressSeen
                )
            }
        }
        Highcharts.chart(document.getElementById(id),_config);
    }
    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartTotalTxns extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineTx' + id
        }
    }
    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;

        if (source == 'home'){
            if (data && data.length > 0) {
                _config.xAxis.categories = [];
                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.newtotalTransaction};
                    _config.xAxis.categories.push(moment(val.date).format('M/D'));
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.spacingTop = 20;
            _config.yAxis.tickAmount = 4;
            _config.yAxis.allowDecimals = true;
            _config.exporting.enabled = false;
            _config.yAxis.tickInterval = 1000000;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000){
                    return this.value/1000000 + 'M'
                }
            }
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.date);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + this.point.y
                )
            }
        }else{
            if (data && data.length === 0) {
                _config.title.text = "No data";
            }
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    temp = {...val, y: val.newtotalTransaction};
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.zoomType = 'x';
            _config.chart.marginTop = 80;
            _config.title.text = intl.formatMessage({id: 'tron_total_transactions_chart'});
            _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
            _config.exporting.filename = intl.formatMessage({id: 'tron_total_transactions_chart'});
            _config.xAxis.tickPixelInterval = 100;
            _config.xAxis.minRange=24 * 3600 * 1000;
            _config.yAxis.title.text = intl.formatMessage({id: 'totle_transactions_per_day'});
            _config.yAxis.tickAmount = 6;
            _config.yAxis.min = 0;
            _config.yAxis.labels.formatter = function() {
                if(this.value < 1000000){
                    return this.value/1000 + 'k'
                }else if(this.value >= 1000000 && this.value < 1000000000){
                    return this.value/1000000 + 'M'
                }else if(this.value >= 1000000000){
                    return this.value/1000000000 + 'B'
                }
            }
            _config.series[0].marker.enabled = false;
            _config.series[0].pointInterval = 24 * 3600 * 1000;
            _config.series[0].pointStart = Date.UTC(2018, 5, 25);
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.x);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + this.point.y
                )
            }
        }
        console.log(_config)
        Highcharts.chart(document.getElementById(id),_config);
    }
    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartBlockchainSize extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineBlockchainSize' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;

        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, y: val.blockchainSize / 1000000};
                _config.series[0].data.push(temp);
            })
        }
        _config.chart.zoomType = 'x';
        _config.chart.marginTop = 80;
        _config.title.text = intl.formatMessage({id: 'blockchain_size'});
        _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
        _config.exporting.filename = intl.formatMessage({id: 'blockchain_size'});
        _config.xAxis.tickPixelInterval = 100;
        _config.xAxis.minRange=24 * 3600 * 1000
        _config.yAxis.title.text = intl.formatMessage({id: 'MByte'});
        _config.yAxis.tickAmount = 6;
        _config.yAxis.min = 0;
        _config.series[0].marker.enabled = false;
        _config.series[0].pointInterval = 24 * 3600 * 1000;
        _config.series[0].pointStart = Date.UTC(2018, 5, 25);
        _config.tooltip.formatter = function () {
            let date = intl.formatDate(this.point.x);
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'blockchain_size'}) + ' : ' + this.point.blockchainSize / 1000000
            )
        }

        Highcharts.chart(document.getElementById(id),_config);
    }

    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class BarReactHighChartBlockSize extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'barBlockSize' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;

        // _config.series[0].type = 'bar';
        // _config.series[0].barWidth = '50%';
        // _config.xAxis[0].boundaryGap = true;


        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, y: val.avgBlockSize};
                _config.series[0].data.push(temp);
            })
        }
        _config.chart.zoomType = 'x';
        _config.chart.marginTop = 80;
        _config.title.text = intl.formatMessage({id: 'average_blocksize'});
        _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
        _config.exporting.filename = intl.formatMessage({id: 'average_blocksize'});
        _config.xAxis.tickPixelInterval = 100;
        _config.xAxis.minRange=24 * 3600 * 1000;
        _config.yAxis.title.text = intl.formatMessage({id: 'bytes'});
        _config.yAxis.tickAmount = 6;
        _config.yAxis.min = 0;
        _config.series[0].type = 'column';
        _config.series[0].marker.enabled = false;
        _config.series[0].pointInterval = 24 * 3600 * 1000;
        _config.series[0].pointStart = Date.UTC(2018, 5, 25);
        _config.tooltip.formatter = function () {
            let date = intl.formatDate(this.point.x);
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'average_blocksize'}) + ' : ' + this.point.avgBlockSize
            )
        }
console.log(_config)
        Highcharts.chart(document.getElementById(id),_config);

    }

    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartPrice extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'linePrice' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data, source} = this.props;
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (source == 'markets'){
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    //temp = {...val, y: val.close};
                    temp = [val.time*1000,val.close]
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.type= 'area';
            _config.chart.spacingTop = 20;
            _config.xAxis.tickPixelInterval = 100;
            _config.yAxis.tickAmount = 5;
            _config.yAxis.min = 0;
            _config.exporting.enabled = false;
            _config.series[0].marker.enabled = false;
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.x);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'average_price'}) + ' : ' + this.point.y
                )
            }
        }else{
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    //temp = {...val, y: val.close};
                    temp = [val.time*1000,val.close]
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.zoomType = 'x';
            _config.chart.marginTop = 80;
            _config.chart.type= 'area';
            _config.title.text = intl.formatMessage({id: 'average_price'});
            _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
            _config.exporting.filename = intl.formatMessage({id: 'average_price'});
            _config.xAxis.tickPixelInterval = 100;
            // _config.xAxis.minRange=24 * 3600 * 1000
            _config.yAxis.title.text = intl.formatMessage({id: 'usd'});
            _config.yAxis.tickAmount = 5;
            _config.yAxis.min = 0;

            _config.series[0].marker.enabled = false;
            //_config.series[0].pointInterval = 24 * 3600 * 1000;
            //_config.series[0].pointStart = Date.UTC(2017, 9, 10);
            _config.tooltip.formatter = function () {
                let date = intl.formatDate(this.point.x);
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'average_price'}) + ' : ' + this.point.y
                )
            }
        }
        console.log(_config)
        Highcharts.chart(document.getElementById(id),_config);
    }
    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactHighChartVolumeUsd extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineReactVolumeUsd' + id
        }
    }
    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);

        let {intl, data, source} = this.props;
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        if (source == 'markets'){
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    temp = [val.time,val.volume_billion]
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.spacingTop = 20;
            _config.xAxis.tickPixelInterval = 100;
            // _config.yAxis.title.text = intl.formatMessage({id: 'billion_usd'});
            _config.yAxis.tickAmount = 5;
            _config.yAxis.min = 0;
            _config.exporting.enabled = false;
            _config.series[0].marker.enabled = false;
            _config.tooltip.formatter = function () {
                let date = intl.formatDate((parseInt(this.point.x)));
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'volume_24'}) + ' : ' + this.point.y +'<br>'
                )
            }
        }else{
            if (data && data.length > 0) {
                data.map((val) => {
                    let temp;
                    temp = [val.time,val.volume_billion]
                    // temp = {...val, y: val.volume_billion};
                    _config.series[0].data.push(temp);
                })
            }
            _config.chart.zoomType = 'x';
            _config.chart.marginTop = 80;
            _config.title.text = intl.formatMessage({id: 'volume_24'});
            _config.subtitle.text = intl.formatMessage({id: 'HighChart_tip'});
            _config.exporting.filename = intl.formatMessage({id: 'volume_24'});
            _config.xAxis.tickPixelInterval = 100;
            // _config.xAxis.minRange=24 * 3600 * 1000
            _config.yAxis.title.text = intl.formatMessage({id: 'billion_usd'});
            _config.yAxis.tickAmount = 6;
            _config.yAxis.min = 0;
            _config.series[0].marker.enabled = false;
            //_config.series[0].pointInterval = 24 * 3600 * 1000;
            // _config.series[0].pointStart = Date.UTC(2018, 5, 25);
            _config.tooltip.formatter = function () {
                let date = intl.formatDate((parseInt(this.point.x)));
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'volume_24'}) + ' : ' + this.point.y +'<br>'
                )
            }
        }

        Highcharts.chart(document.getElementById(id),_config);
    }

    shouldComponentUpdate(nextProps)  {
        if(nextProps.intl.locale !== this.props.intl.locale){
            return true
        }
        return  false
    }
    componentDidMount() {
        this.initLine(this.state.lineId);
    }
    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactAdd extends React.Component {

    constructor(props) {

        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineAdd' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }

        if (source !== 'home') {
            _config.title.text = intl.formatMessage({id: 'address_growth_chart'});
            _config.title.link = '#/blockchain/stats/addressesStats';
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
        }
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        }
        if (source === 'home') {
            _config.title.text = '';
            _config.title.link = '';
            _config.toolbox.feature = {};
            _config.grid[0].top = 45;
        }
        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'addresses_amount'});
        _config.tooltip.formatter = function (datas) {
            let date = intl.formatDate((parseInt(datas[0].data.date)));
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'daily_increment'}) + ' : ' + datas[0].data.increment + '<br/>' +
                intl.formatMessage({id: 'total_addresses'}) + ' : ' + datas[0].data.total
            )

        }

        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.total};
                _config.xAxis[0].data.push(intl.formatDate(val.date));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        myChart.setOption(_config);
        this.myChart = myChart;

    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactTx extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineTx' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;

        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }

        if (source !== 'home') {
            _config.title.text = intl.formatMessage({id: 'tron_transaction_chart'});
            _config.title.link = '#/blockchain/stats/txOverviewStats';
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
            _config.tooltip.formatter = function (datas) {
                let date = intl.formatDate((parseInt(datas[0].data.date)));
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction + '<br/>' +
                    intl.formatMessage({id: 'avg_blockSize'}) + ' : ' + datas[0].data.avgBlockSize + '<br/>' +
                    intl.formatMessage({id: 'new_address_seen'}) + ' : ' + datas[0].data.newAddressSeen
                )

            }
        }
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        }
        if (source === 'home') {
            _config.title.text = '';
            _config.title.link = '';
            _config.toolbox.feature = {};
            _config.grid[0].top = 45;
            _config.tooltip.formatter = function (datas) {
                let date = intl.formatDate((parseInt(datas[0].data.date)));
                return (
                    intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                    intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction
                )
            }
        }
        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'transactions_per_day'});


        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.totalTransaction};
                _config.xAxis[0].data.push(intl.formatDate(val.date));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        myChart.setOption(_config);
        this.myChart = myChart;
    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactBlockSize extends React.Component {

    constructor(props) {

        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineBlockSize' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }

            }
        } else {
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
        }
        _config.title.text = intl.formatMessage({id: 'average_blocksize'});
        _config.title.link = '#/blockchain/stats/blockSizeStats';


        _config.series[0].type = 'bar';
        _config.series[0].barWidth = '50%';
        _config.xAxis[0].boundaryGap = true;
        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'bytes'});
        _config.tooltip.formatter = function (datas) {
            let date = intl.formatDate((parseInt(datas[0].data.date)));
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'average_blocksize'}) + ' : ' + datas[0].data.avgBlockSize
            )

        }

        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.avgBlockSize};
                _config.xAxis[0].data.push(intl.formatDate(val.date));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }

        myChart.setOption(_config);
        this.myChart = myChart;

    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactPrice extends React.Component {

    constructor(props) {

        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'linePrice' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }

            }
        } else {
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
        }
        _config.title.text = intl.formatMessage({id: 'average_price'});
        _config.title.link = '#/blockchain/stats/priceStats';


        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'usd'});
        _config.tooltip.formatter = function (datas) {
            let date = intl.formatDate((parseInt(datas[0].data.time) * 1000));
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'average_price'}) + ' : ' + datas[0].data.close
            )

        }

        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.close};
                _config.xAxis[0].data.push(intl.formatDate(parseInt(val.time) * 1000));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        myChart.setOption(_config);
        this.myChart = myChart;

    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactBlockchainSize extends React.Component {

    constructor(props) {

        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineBlockchainSize' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }

        _config.title.text = intl.formatMessage({id: 'blockchain_size'});
        _config.title.link = '#/blockchain/stats/blockchainSizeStats';
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        } else {
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
        }


        // _config.series[0].type = 'line';
        // _config.series[0].barWidth = '50%';
        // _config.xAxis[0].boundaryGap = true;
        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'MByte'});
        _config.tooltip.formatter = function (datas) {
            let date = intl.formatDate((parseInt(datas[0].data.date)));
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
                intl.formatMessage({id: 'blockchain_size'}) + ' : ' + datas[0].data.blockchainSize / 1000000
            )

        }

        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.blockchainSize / 1000000};
                _config.xAxis[0].data.push(intl.formatDate(val.date));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }

        myChart.setOption(_config);
        this.myChart = myChart;

    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class LineReactVolumeUsd extends React.Component {

    constructor(props) {

        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'lineReactVolumeUsd' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewChart);

        let {intl, data, source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }
        _config.title.text = intl.formatMessage({id: 'volume_24'});
        _config.title.link = '#/blockchain/stats/volumeStats';
        if (source === 'singleChart') {
            _config.title.subtext = intl.formatMessage({id: 'HighChart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        } else {
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                }
            }
        }


        _config.xAxis[0].data = [];
        _config.series[0].data = [];
        _config.yAxis[0].name = intl.formatMessage({id: 'billion_usd'});
        _config.tooltip.formatter = function (datas) {
            let date = intl.formatDate((parseInt(datas[0].data.time)));
            let time = intl.formatTime((parseInt(datas[0].data.time)));
            return (
                intl.formatMessage({id: 'date'}) + ' : ' + date + ' ' + time + '<br/>' +
                intl.formatMessage({id: 'volume_24'}) + ' : ' + datas[0].data.volume_usd
            )
        }

        if (data && data.length > 0) {
            data.map((val) => {
                let temp;
                temp = {...val, value: val.volume_billion};
                _config.xAxis[0].data.push(intl.formatDate(parseInt(val.time)));
                _config.series[0].data.push(temp);
            })
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }

        myChart.setOption(_config);
        this.myChart = myChart;

    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}


export class EnergyConsumeChart extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'EnergyConsumeChart' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data} = this.props;

        if (data && data.length > 0) {
            let chartData = [
                { name: intl.formatMessage({id: 'freezing_energy'}), data: []},
                { name: intl.formatMessage({id: 'burning_energy'}), data: []},
            ]
            data.map(item => {
                chartData[0].data.push([
                    item.day,
                    Number(item.energy)
                ])
                chartData[1].data.push([
                    item.day,
                    Number(item.trx)
                ])
            })

            let options = {
                chart: {
                    type: 'column',
                    zoomType: 'x'
                },
                title: {
                    text: intl.formatMessage({id: 'EnergyConsume_title'})
                },
                subtitle: {text: intl.formatMessage({id: 'EnergyConsume_subtitle'})},
                yAxis: {
                    min: 0,
                    title: {
                        text: intl.formatMessage({id: 'EnergyConsume_yaxis'})
                    }
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    symbolRadius: 0,
                    enabled: true
                },
                tooltip: {
                    formatter: function () {
                        return intl.formatMessage({id: 'date'}) +': '+intl.formatDate(this.x)+ '<br/>' +
                        intl.formatMessage({id: 'total_enegy_used'}) +': '+ intl.formatNumber(this.points[0].total)+'<br/>' +
                        this.points.map(item => {
                            return `<span style="color:${item.color}">${item.series.name}: </span>${intl.formatNumber(item.y)}<br/>`
                        }).join('')
                    },
                    shared: true
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                series: chartData
            }

            setOption(_config, options)
        }
        console.log(_config)
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        Highcharts.chart(id, _config);
    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class ContractInvocationChart extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'ContractInvocationChart' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data} = this.props;
        console.log('data :', data);
       
        if (data) {
            let options =  {
                chart: { zoomType: 'x' },
                title: {
                    text: intl.formatMessage({id: 'contract_call_chart'})
                },
                subtitle: {
                    text: intl.formatMessage({id: 'HighChart_tip'})
                },
                xAxis: {
                    tickPixelInterval: 100
                },
                yAxis: {
                    title: {
                        text: intl.formatMessage({id: 'contract_call_per_day'})
                    },
                },
                legend: {
                    align: 'center',
                    verticalAlign: 'bottom',
                    enabled: true
                },
                tooltip: {
                    formatter: function () {
                        return intl.formatMessage({id: 'date'}) + ': ' + intl.formatDate(this.x) + '<br/>' +
                            this.series.name + ': ' + this.y
                    }
                },
                plotOptions: {
                    series: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    name: intl.formatMessage({id: 'call_time'}),
                    data: data.trigger_amount
                }, {
                    name: intl.formatMessage({id: 'call_address_number'}),
                    data: data.address_amount
                }]
            }
            console.log(_config)
            setOption(_config, options)
        }
        
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        Highcharts.chart(id, _config);
    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}


export class ContractInvocationDistributionChart extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'ContractInvocationChart' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data} = this.props;

        
        var chartdata = data.slice(0).map(o => {
            o.y= o.trigger_amount
            o.name = o.contract_address
            return o
            // return {
            //     name: o.contract_address,
            //     y: o.trigger_amount,
            //     real_name: o.name,
            //     trigger_percent: o.trigger_percent
            // }
        })
       
        if (data && data.length > 0) {
            let options =  {
                chart: {
                    type: 'variablepie'
                },
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                title: {
                    text: intl.formatMessage({id: 'contract_call_chart_day'})
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    intl.formatMessage({id: 'call_address_time'}) + ': <b>{point.caller_amount}</b><br/>' +
                    intl.formatMessage({id: 'call_address_scale'}) + ': <b>{point.caller_percent}</b><br/>'+
                    intl.formatMessage({id: 'call_time'}) + ': <b>{point.y}</b><br/>' +
                    intl.formatMessage({id: 'call_scale'}) + ': <b>{point.trigger_percent}</b><br/>'
                },
                series: [{
                    minPointSize: 70,
                    innerSize: '30%',
                    zMin: 0,
                    name: 'countries',
                    data: chartdata
                }]
            }
            Object.keys(options).map(item => {
                _config[item] = options[item]
            })
            console.log('_config :', _config);
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        Highcharts.chart(id, _config);
    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

export class EnergyConsumeDistributionChart extends React.Component {

    constructor(props) {
        super(props)
        this.myChart = null;
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            lineId: 'ContractInvocationChart' + id
        }
    }

    initLine(id) {
        let _config = cloneDeep(config.overviewHighChart);
        let {intl, data} = this.props;
        let totalUsedEnergy = 0
        let freezingEnergy = 0
        let burningEnergy = 0

        
        var chartdata = data.slice(0).map(o => {
            totalUsedEnergy += Number(o.total_energy)
            freezingEnergy += Number(o.energy)
            burningEnergy += Number(o.trx)

            return {
                name: o.contract_address,
                y: Number(o.total_energy),
                real_name: o.name,
                percent: o.percent
            }
        })
        const SUBTITLE = `
            ${intl.formatMessage({id: 'total_used_energy'})}: ${intl.formatNumber(totalUsedEnergy)}(
            ${intl.formatMessage({id: 'energy_used_by_freezing_TRX'})} ${intl.formatNumber(freezingEnergy)}
            ${intl.formatMessage({id: 'energy_used_by_burning_TRX'})} ${intl.formatNumber(burningEnergy)}
            )
        `
       
        if (data && data.length > 0) {
            let options =  {
                chart: {
                    type: 'variablepie'
                },
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#2b908f', '#f45b5b', '#91e8e1'],
                title: {
                    text: intl.formatMessage({id: 'total_energy_used_chart'})
                },
                subtitle: {
                    text: SUBTITLE
                },
                tooltip: {
                    headerFormat: '',
                    pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
                    intl.formatMessage({id: 'total_energy_used'}) + ': <b>{point.y}</b><br/>' +
                    intl.formatMessage({id: 'energy_scale'}) + ': <b>{point.percent}</b><br/>'
                },
                series: [{
                    minPointSize: 70,
                    innerSize: '30%',
                    zMin: 0,
                    name: 'countries',
                    data: chartdata
                }]
            }
            Object.keys(options).map(item => {
                _config[item] = options[item]
            })
            console.log('_config :', _config);
        }
        if (data && data.length === 0) {
            _config.title.text = "No data";
        }
        Highcharts.chart(id, _config);
    }

    componentDidMount() {
        this.initLine(this.state.lineId);
    }

    componentDidUpdate() {
        this.initLine(this.state.lineId);
    }

    render() {
        return (
            <div>
                <div id={this.state.lineId} style={this.props.style}></div>
            </div>
        )
    }
}

function setOption(config, child) {
    Object.keys(child).map(item => {
        if(child[item] && child[item].toString() === '[object Object]'){
            config[item] = config[item] || {}
            setOption(config[item] , child[item])
        }else{
            config[item] = child[item]
        }
    }) 
}