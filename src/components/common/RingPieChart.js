import React from 'react'
import {connect} from "react-redux";
import {injectIntl} from "react-intl";

import config from './chart.config.js'

import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legend/ScrollableLegendModel.js'
import 'echarts/lib/component/legend/ScrollableLegendView.js'
import 'echarts/lib/component/legend/scrollableLegendAction.js'

import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Exporting from 'highcharts/modules/exporting';

import {cloneDeep} from "lodash";

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Exporting(Highcharts);


export class RingPieReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'ringPie' + id
    }
  }

  initPie(id) {
    let {intl, data, message} = this.props;

    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.ringPieChart.title.text = intl.formatMessage({id: message.id}) + ' Top 10';

    config.ringPieChart.series[0].data = [];
    config.ringPieChart.series[1].data = [];
    config.ringPieChart.legend.data = [];

    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return 1;
        } else if (obj1[property] < obj2[property]) {
          return -1;
        } else {
          return 0;
        }

      }
    }

    if (data && data.length > 0) {
      let sortObj = data.sort(compare("name"));
      let pairData = [];
      let exchanges = []
      let temp = [];
      for (let index in sortObj) {
        pairData.push({name: sortObj[index].pair, value: sortObj[index].volume});
        if (temp.indexOf(sortObj[index].name) < 0) {
          temp.push(sortObj[index].name)
          exchanges.push({name: sortObj[index].name, value: 0, subCount: []});
        }
      }

      for (let index in exchanges) {
        for (let idx in sortObj) {
          if (sortObj[idx].name === exchanges[index].name) {
            exchanges[index].value = exchanges[index].value + sortObj[idx].volume;
            exchanges[index].subCount.push({name: sortObj[idx].pair, value: sortObj[idx].volume});
          }
        }
      }

      exchanges.sort(compare("value"));
      let finalExchanges = exchanges.slice(exchanges.length - 10, exchanges.length);
      let finalPairData = []
      for (let index in finalExchanges) {
        finalPairData.push(...finalExchanges[index].subCount);
      }
      config.ringPieChart.series[0].data = [];
      config.ringPieChart.series[1].data = [];

      config.ringPieChart.legend.data = temp;
      config.ringPieChart.series[0].data = finalExchanges;
      config.ringPieChart.series[1].data = finalPairData;

    }
    if (data && data.length === 0) {
      config.ringPieChart.title.text = "No data";
    }
    myChart.setOption(config.ringPieChart);
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

export class RepresentativesRingPieReact extends React.Component {

  constructor(props) {
      super(props)
      let id = ('_' + Math.random()).replace('.', '_');
      this.state = {
          pieId: 'ringPie' + id
      }
  }
  initPie(id) {
      let {intl, data, message, source} = this.props;
      let _config = cloneDeep(config.ringPieHighChart3D);
      console.log('data', data)
      if (data.length) {
          for (let index in data) {
              if (data[index].name.indexOf("http://") > -1) {
                  data[index].name = data[index].name.substring(7).split('.com')[0];
              }
          }
      }

      function compare(property) {
          return function (obj1, obj2) {
              if (obj1[property] > obj2[property]) {
                  return 1;
              } else if (obj1[property] < obj2[property]) {
                  return -1;
              } else {
                  return 0;
              }
          }
      }

      if (data && data.length === 0) {
          _config.title.text = "No data";
      }
      if (data && data.length > 0) {
          let exchanges = []
          let temp = [];
          for (let index in data) {
              if (temp.indexOf(data[index].name) < 0) {
                  temp.push(data[index].name)
                  _config.series[0].data.push([data[index].name, Number(data[index].volumeValue)]);
              }
          }
      }
      if (source == 'representatives'){
          _config.plotOptions.pie.showInLegend = false;
          _config.exporting.enabled = false;
      }
      _config.title.text = intl.formatMessage({id: message.id});
      _config.exporting.filename = intl.formatMessage({id: message.id});
      _config.tooltip.formatter = function (data) {
          let date = intl.formatDate(this.point.x);
          console.log(this.point)
          return (
              intl.formatMessage({id: 'witness'}) + ' : ' + this.point.name + '<br/>' +
              intl.formatMessage({id: 'produced_blocks'}) + ' : ' + this.point.y + '<br/>'+
              intl.formatMessage({id: '_percentage'}) + ' : ' + this.point.percentage.toFixed(2) + '%'
          )
      }
      Highcharts.chart(document.getElementById(id), _config);

  }


    // config.ringPieReactHighChart3D.title.text = intl.formatMessage({id: message.id});
    // config.ringPieReactHighChart3D.series[0].data = [];
    // config.ringPieReactHighChart3D.legend.data = [];
    // config.ringPieReactHighChart3D.title.link = '#/blockchain/stats/pieChart';
    // config.ringPieReactHighChart3D.tooltip.formatter = function (datas) {
    //   return (
    //       intl.formatMessage({id: 'witness'}) + ' : ' + datas.name + '<br/>' +
    //       intl.formatMessage({id: 'produced_blocks'}) + ' : ' + datas.value + '<br/>' +
    //       intl.formatMessage({id: '_percentage'}) + ' : ' + datas.percent + '%'
    //   )
    //
    // }
    // if (source === 'singleChart') {
    //   let seriesCenter = ['50%', '50%'];
    //   config.ringPieReactHighChart3D.series[0].center = seriesCenter;
    //   config.ringPieReactHighChart3D.legend.show = true;
    //   config.ringPieReactHighChart3D.toolbox.feature = {
    //     restore: {
    //       title: 'restore'
    //     },
    //     saveAsImage: {
    //       show: true,
    //       title: 'save'
    //     }
    //   }
    // } else {
    //   let seriesCenter = ['50%', '60%'];
    //   config.ringPieReactHighChart3D.legend.show = false;
    //   config.ringPieReactHighChart3D.toolbox.feature = {
    //     restore: {
    //       show: false,
    //       title: 'restore'
    //     },
    //     saveAsImage: {
    //       show: false,
    //       title: 'save'
    //     }
    //   }
    // }

    shouldComponentUpdate(nextProps) {
        if (nextProps.intl.locale !== this.props.intl.locale) {
            return true
        }
        return false
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

export class SupplyTypesTRXPieChart extends React.Component {
    constructor(props) {
        super(props)
        let id = ('_' + Math.random()).replace('.', '_');
        this.state = {
            pieId: 'ringPie' + id
        }
    }
    initPie(id) {
        let {intl, data,message,source} = this.props;
        let _config = cloneDeep(config.supplyPieHighChart);
        console.log('data', data)

        if(data && data.length===0){
            _config.title.text="No data";
        }
        if (data && data.length > 0) {
            let temp = [];
            for (let index in data) {
                if (temp.indexOf(data[index].name) < 0) {
                    _config.series[0].data.push({name: intl.formatMessage({id: data[index].name}), y: parseInt(data[index].value), selected:data[index].selected,sliced:data[index].sliced});
                }
            }
            console.log('_config.series[0].data',_config.series[0].data)
        }
        _config.title.text=intl.formatMessage({id:message.id});
        _config.exporting.filename = intl.formatMessage({id: message.id});
        _config.tooltip.formatter = function () {
            return (
                intl.formatMessage({id: this.point.name}) + ' (' + intl.formatNumber(this.point.y) + ' TRX' + ')<br/>' +
                intl.formatMessage({id: '_percentage'}) + ' : ' + this.point.percentage.toFixed(2) + '%'
            )
        }

        // if(source==='singleChart'){
        //     let seriesCenter = ['50%', '50%'];
        //     config.supplyTypesTRXPieChart.legend.show = true;
        //     config.supplyTypesTRXPieChart.series[0].center = seriesCenter;
        //     config.supplyTypesTRXPieChart.toolbox.feature = {
        //         restore: {
        //             show: false,
        //             title: 'restore'
        //         },
        //         saveAsImage: {
        //             show: false,
        //             title: 'save'
        //         }
        //     }
        // }else{
        //     let seriesCenter = ['50%', '60%'];
        //     config.supplyTypesTRXPieChart.legend.show = false;
        //     config.supplyTypesTRXPieChart.series[0].center = seriesCenter;
        //     config.supplyTypesTRXPieChart.toolbox.feature = {
        //         restore: {
        //             show: false,
        //             title: 'restore'
        //         },
        //         saveAsImage: {
        //             show: false,
        //             title: 'save'
        //         }
        //     }
        // }
        Highcharts.chart(document.getElementById(id), _config);
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

// function mapStateToProps(state) {
//   return {}
// }
//
// const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(RingPieReact));


