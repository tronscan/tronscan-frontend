import React from 'react'
import {injectIntl} from "react-intl";
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import {connect} from "react-redux";

export class BarReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      barId: 'bar' + id
    }
  }

  initBar(id) {
    let {intl, data} = this.props;
    console.log(data);
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.barChart.title.text='';
    config.barChart.yAxis.data = [];
    config.barChart.series[0].data = [];
    if(data && data.length>0) {
      data.map((val) => {

        config.barChart.yAxis.data.push(val.name);
        config.barChart.series[0].data.push(val.total);

      })
    }
    if(data && data.length===0){
      config.barChart.title.text="No data";
    }
    myChart.setOption(config.barChart);

  }

  componentDidMount() {
    this.initBar(this.state.barId);
  }

  componentDidUpdate() {
    this.initBar(this.state.barId);
  }

  render() {
    return (
        <div>
          <div id={this.state.barId} style={this.props.style}></div>
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(BarReact));