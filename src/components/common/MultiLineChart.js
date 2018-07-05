import React from 'react'
import {injectIntl} from "react-intl";
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import {connect} from "react-redux";
import {keyBy, max, sortBy} from "lodash";
import _ from "lodash";
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'

export class MultiLineReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      lineId: 'multiLine' + id
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(_.isEmpty(this.props.data)){
      //return false
    }
    if (_.isEqual(this.props.data, nextProps.data)) {
      return false
    }

    return true
  }
  initLine(id) {

    let {intl, data, newCandidates} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.multiLineChart.title.text = '';
    config.multiLineChart.xAxis.data = [];
    config.multiLineChart.series = [];
    config.multiLineChart.legend.data=[];
    if (data && data.length > 0) {
      let stats = {};
      let addresses = {};
      for (let row of data) {
        if (!stats[row.timestamp]) {
          stats[row.timestamp] = [];
        }
        stats[row.timestamp].push({
          address: row.address,
          votes: row.votes,
        });
        addresses[row.address] = true;
      }

      let latestTimestamp = max(Object.keys(stats));
      let highestAddresses = keyBy(sortBy(stats[latestTimestamp], s => s.votes * -1));
      let rowStats = [];

      for (let [key, value] of Object.entries(stats)) {
        let row = {
          timestamp: key,
          datetime: intl.formatTime(parseInt(key)),
        };
        for (let entry of value) {
          if (typeof highestAddresses[entry.address] !== 'undefined') {
            row[entry.address] = entry.votes;
          }
        }
        rowStats.push(row);
      }

      rowStats = sortBy(rowStats, s => s.timestamp);

      let xAxis = [];
      for (let index in rowStats) {
        xAxis.push(rowStats[index].datetime);
      }

      let yAxis = [];
      let flag=false;

      for (let candy in newCandidates) {
        let temp = [];
        for (let stat in stats) {
          for (let ss in stats[stat]) {
            if (stats[stat][ss].address === newCandidates[candy].address) {
              temp.push(stats[stat][ss].votes);
              flag=true;
              break;
            }
          }
          if(!flag)
            temp.push(0);
          if(flag)
            flag=false;
        }
        temp=temp.slice(0,temp.length);

        yAxis.push({key: newCandidates[candy].address, url: newCandidates[candy].url, data: temp});
      }

      let newYAxis = yAxis.slice(0, 10);

      config.multiLineChart.xAxis.data = xAxis;

      newYAxis.map((val, index) => {
        config.multiLineChart.legend.data.push(val.url);
        config.multiLineChart.series.push({
          name: val.url,
          data: val.data,
          type: 'line',
          smooth: true
        })

      })
    }

    if (data && data.length === 0) {
      config.multiLineChart.title.text = "No data";
    }

    myChart.setOption(config.multiLineChart);

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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(MultiLineReact));