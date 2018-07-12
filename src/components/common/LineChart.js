import React from 'react'
import {connect} from "react-redux";
import {injectIntl} from "react-intl";

import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'


export class LineReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      lineId: 'line' + id
    }
  }

  initLine(id) {
    let {intl, keysData, data, format, message} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }

    config.lineChart.title.text = intl.formatMessage({id: message.id});
    if(message.href)
      config.lineChart.title.link = '#/blockchain/stats/' + message.href;
    config.lineChart.xAxis.data = [];
    config.lineChart.series[0].data = [];

    if (data && data.length > 0) {
      data.map((val) => {

        if (format && format[keysData[0]]) {
          if (format.date) {
            config.lineChart.xAxis.data.push(intl.formatDate(val[keysData[0]] * 1000));
          }
          else {
            if ((val[keysData[0]] + "").length === 10)
              config.lineChart.xAxis.data.push(intl.formatTime(val[keysData[0]] * 1000));
            if ((val[keysData[0]] + "").length === 13)
              config.lineChart.xAxis.data.push(intl.formatTime(val[keysData[0]]));
          }
        }
        else {
          config.lineChart.xAxis.data.push(val[keysData[0]]);
        }
        config.lineChart.series[0].data.push(val[keysData[1]]);
      })
    }

    if (data && data.length === 0) {
      config.lineChart.title.text = "No data";
    }
    myChart.setOption(config.lineChart);

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(LineReact));