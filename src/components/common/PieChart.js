import React from 'react'
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'

export class PieReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'pie' + id
    }
  }

  initPie(id) {
    let { data }=this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.pieChart.series[0].data = [];
    config.pieChart.title.text="";

    if (data && data.length > 0) {
      config.pieChart.series[0].data = data;
    }
    if(data && data.length===0){
      config.pieChart.title.text="No data";
    }
    myChart.setOption(config.pieChart);
  }


  componentDidMount() {
    this.initPie(this.state.pieId);
  }

  componentDidUpdate() {
    this.initPie(this.state.pieId);
  }

  render() {
    return (
        <div>
          <div id={this.state.pieId} style={this.props.style}></div>
        </div>
    )
  }
}

export default PieReact

