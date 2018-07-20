import React from 'react'
import {injectIntl} from "react-intl";
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/markPoint'

import {connect} from "react-redux";
import {cloneDeep} from "lodash";

export class LineReactTx extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      lineId: 'lineTx' + id
    }
  }

  initLine(id) {
    let _config=cloneDeep(config);
    let {intl, data} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    _config.overviewChart.toolbox.feature = {};
    _config.overviewChart.dataZoom = [];
    _config.overviewChart.series[0].smooth = true;
    _config.overviewChart.series[0].markPoint.symbolSize = 80;
    _config.overviewChart.series[0].lineStyle = {
      normal: {
        type: 'solid',
        color: "red",
        width: 5
      }
    };
    _config.overviewChart.grid[0].top = 120;
    // config.overviewChart.title.text = intl.formatMessage({id: 'TRON Transactions Chart'});
    _config.overviewChart.xAxis[0].data = [];
    _config.overviewChart.series[0].data = [];
    _config.overviewChart.yAxis[0].name = intl.formatMessage({id: 'Transactions Per Day'});
    _config.overviewChart.yAxis[0].nameGap = 40;
    _config.overviewChart.yAxis[0].nameTextStyle = {
      fontWeight: 'bolder',
      fontSize:'15'
    };
    _config.overviewChart.tooltip.formatter = function (datas) {
      let date = new Date(parseInt(datas[0].data.date)).toLocaleString().split(' ')[0];
      return (
          intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
          intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction + '<br/>' +
          intl.formatMessage({id: 'avg_blockTime'}) + ' : ' + datas[0].data.avgBlockTime + '<br/>' +
          intl.formatMessage({id: 'avg_blockSize'}) + ' : ' + datas[0].data.avgBlockSize + '<br/>' +
          intl.formatMessage({id: 'total_BlockCount'}) + ' : ' + datas[0].data.totalBlockCount + '<br/>' +
          intl.formatMessage({id: 'new_address_seen'}) + ' : ' + datas[0].data.newAddressSeen + '<br/>'
      )

    }

    if (data && data.length > 0) {
      data.map((val) => {
        let temp;
        temp = {...val, value: val.totalTransaction};
        _config.overviewChart.xAxis[0].data.push(intl.formatDate(val.date));
        _config.overviewChart.series[0].data.push(temp);
      })
    }
    if (data && data.length === 0) {
      _config.overviewChart.title.text = "No data";
    }
    myChart.setOption(_config.overviewChart);

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

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(LineReactTx));