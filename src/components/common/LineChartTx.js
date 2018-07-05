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

export class LineReactTx extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      lineId: 'lineTx' + id
    }
  }

  initLine(id) {
    let {intl, data} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.txOverviewChart.title.text='';
    config.txOverviewChart.xAxis[0].data = [];
    config.txOverviewChart.series[0].data = [];
   // config.txOverviewChart.yAxis[0].name =  intl.formatMessage({id: 'transactions_per_day'});

    if(data && data.length>0) {
      data.map((val) => {
        let temp;
        temp={...val,value:val.totalTransaction};
        config.txOverviewChart.xAxis[0].data.push(intl.formatDate(val.date));
        console.log(intl.formatDate(val.date));

        config.txOverviewChart.series[0].data.push(temp);
      })
    }
    if(data && data.length===0){
      config.txOverviewChart.title.text="No data";
    }
    myChart.setOption(config.txOverviewChart);

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