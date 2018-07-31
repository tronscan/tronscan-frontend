import React from 'react'
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/chart/bar'
import {cloneDeep} from "lodash";


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
    if(source==='singleChart'){
      _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
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
    if (source !== 'home') {
      _config.title.text = intl.formatMessage({id: 'address_growth_chart'});
      _config.title.link = '#/blockchain/stats/addressesStats';
      _config.toolbox.feature = {
        restore: {
          title: 'restore'
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
    if(source==='singleChart'){
      _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
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
    /* this.myChart.on('click', function (params) {
       console.log(params.data.date);
       window.location.href='#/blockchain/transactions/'+params.data.date;
     });
    */
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
    if(source==='singleChart'){
      _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
        _config.toolbox.feature = {
            saveAsImage: {
                show: true,
                title: 'save'
            }
        }
    }else{
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
    if(source==='singleChart'){
      _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
        _config.toolbox.feature = {
            saveAsImage: {
                show: true,
                title: 'save'
            }
        }
    }else{
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
      if(source==='singleChart'){
          _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
          _config.toolbox.feature = {
              restore: {
                  title: 'restore'
              },
              saveAsImage: {
                  show: true,
                  title: 'save'
              }
          }
      }else{
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
        if(source==='singleChart'){
            _config.title.subtext = intl.formatMessage({id: 'chart_tip'});
            _config.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        }else{
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
                intl.formatMessage({id: 'date'}) + ' : ' + date + ' '+ time + '<br/>' +
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