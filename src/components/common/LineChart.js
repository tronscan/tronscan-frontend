import React from 'react'
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
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }

    config.lineChart.xAxis.data=[];
    config.lineChart.series[0].data=[];
    this.props.data.map((val)=>{
      config.lineChart.xAxis.data.push(val.timestamp);
      config.lineChart.series[0].data.push(val.value);
    })

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

export default LineReact

