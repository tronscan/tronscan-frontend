import React from 'react'
import config from './chart.config.js'
import {injectIntl} from "react-intl";

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import {connect} from "react-redux";
import {cloneDeep} from "lodash";

export class PieReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'pie' + id
    }
  }

  initPie(id) {
    let _config=cloneDeep(config);
    let {intl, data} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    console.log('data',data)
    let length = data !== null ? data.length : 0;
    //_config.pieChart.title.text = intl.formatMessage({id: 'Top'}) + length + ' ' + intl.formatMessage({id: 'voters'}) + ' ' + intl.formatMessage({id: 'addresses'});
    // config.pieChart.title.link = '#/blockchain/stats/accounts';
    _config.pieChart.tooltip.formatter = function (datas) {
      return (
          //   intl.formatMessage({id: 'date'}) + ' : ' + date + '<br/>' +
          //   intl.formatMessage({id: 'total_transactions'}) + ' : ' + datas[0].data.totalTransaction
          datas.data.name + '<br/>' + intl.formatMessage({id: 'votes'}) +' : '+ datas.data.votes + ' (' + datas.data.value + '%)'
      )
    }

    _config.pieChart.series[0].data = [];

    if (data && data.length > 0) {
      _config.pieChart.series[0].data = data;
    }
    if (data && data.length === 0) {
      _config.pieChart.title.text = "";
    }
    myChart.setOption(_config.pieChart);
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

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(PieReact));


