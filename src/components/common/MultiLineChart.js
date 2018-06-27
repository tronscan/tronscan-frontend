import React from 'react'
import {injectIntl} from "react-intl";
import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import {connect} from "react-redux";
import {keyBy, max, sortBy} from "lodash";
import {Client} from "../../services/api";

export class MultiLineReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      lineId: 'line' + id
    }
  }

  initLine(id) {
    let {intl, data, newCandidates} = this.props;
    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.lineChart.title.text='';
    config.lineChart.xAxis.data = [];
    config.lineChart.series[0].data = [];


    if(data && data.length>0) {
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

      let rawXAxis = Object.keys(stats)
      let xAxis = [];

      for (let index in rawXAxis) {
        xAxis.push(intl.formatTime(parseInt(rawXAxis[index])));
      }
      let yAxis = [];

      for (let candy in newCandidates) {
        let temp = [];
        for (let stat in stats) {

          for (let ss in stats[stat]) {
            if (stats[stat][ss].address === newCandidates[candy].address) {
              temp.push(stats[stat][ss].votes);

            }
          }
        }
        yAxis.push({key: newCandidates[candy].address, url:newCandidates[candy].url, data: temp});
      }
      console.log(yAxis);


      let latestTimestamp = max(Object.keys(stats));

      let highestAddresses = keyBy(sortBy(stats[latestTimestamp], s => s.votes * -1).slice(0, 27), s => s.address);


      config.lineChart.xAxis.data=xAxis;

      yAxis.map((val) => {
       // config.lineChart.series[0].data.push(val[keysData[1]]);
      })
    }
    if(data && data.length===0){
      config.lineChart.title.text="No data";
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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(MultiLineReact));