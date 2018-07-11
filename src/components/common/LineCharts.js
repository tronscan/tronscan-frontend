import React from 'react'
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'


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
    let {intl, data, source} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    if (source !== 'home') {
      config.txOverviewChart.title.text = intl.formatMessage({id: 'address_growth_chart'});
      config.txOverviewChart.title.link = '#/blockchain/stats/addressesStats';
      config.txOverviewChart.toolbox.feature = {
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
      config.txOverviewChart.title.text='';
      config.txOverviewChart.title.link='';
      config.txOverviewChart.toolbox.feature = {};
      config.txOverviewChart.grid[0].top = 40;
    }
    config.txOverviewChart.xAxis[0].data = [];
    config.txOverviewChart.series[0].data = [];
    config.txOverviewChart.yAxis[0].name = intl.formatMessage({id: 'addresses_amount'});
    config.txOverviewChart.tooltip.formatter = function (datas) {
      let date = new Date(parseInt(datas[0].data.date)).toLocaleString().split(' ')[0];
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
        config.txOverviewChart.xAxis[0].data.push(intl.formatDate(val.date));
        config.txOverviewChart.series[0].data.push(temp);
      })
    }
    if (data && data.length === 0) {
      config.txOverviewChart.title.text = "No data";
    }

    myChart.setOption(config.txOverviewChart);
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
    let {intl, data, source} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    if (source !== 'home') {
      config.txOverviewChart.title.text = intl.formatMessage({id: 'TRX_transaction_chart'});
      config.txOverviewChart.title.link = '#/blockchain/stats/txOverviewStats';
      config.txOverviewChart.toolbox.feature = {
        restore: {
          title: 'restore'
        },
        saveAsImage: {
          show: true,
          title: 'save'
        }
      }
      config.txOverviewChart.tooltip.formatter = function (datas) {
        let date = new Date(parseInt(datas[0].data.date)).toLocaleString().split(' ')[0];
        return (
            intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
            intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction + '<br/>' +
            intl.formatMessage({id: 'avg_blockSize'}) + ' : ' + datas[0].data.avgBlockSize + '<br/>' +
            intl.formatMessage({id: 'new_address_seen'}) + ' : ' + datas[0].data.newAddressSeen
        )

      }
    }
    if (source === 'home') {
      config.txOverviewChart.title.text='';
      config.txOverviewChart.title.link='';
      config.txOverviewChart.toolbox.feature = {};
      config.txOverviewChart.grid[0].top = 40;
      config.txOverviewChart.tooltip.formatter = function (datas) {
        let date = new Date(parseInt(datas[0].data.date)).toLocaleString().split(' ')[0];
        return (
            intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
            intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction
        )
      }
    }
    config.txOverviewChart.xAxis[0].data = [];
    config.txOverviewChart.series[0].data = [];
    config.txOverviewChart.yAxis[0].name = intl.formatMessage({id: 'transactions_per_day'});


    if (data && data.length > 0) {
      data.map((val) => {
        let temp;
        temp = {...val, value: val.totalTransaction};
        config.txOverviewChart.xAxis[0].data.push(intl.formatDate(val.date));
        config.txOverviewChart.series[0].data.push(temp);
      })
    }
    if (data && data.length === 0) {
      config.txOverviewChart.title.text = "No data";
    }
    myChart.setOption(config.txOverviewChart);
    this.myChart = myChart;
  }

  componentDidMount() {
    this.initLine(this.state.lineId);
    this.myChart.on('click', function (params) {
      console.log(params);
    });
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


