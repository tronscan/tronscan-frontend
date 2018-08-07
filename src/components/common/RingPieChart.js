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


export class RingPieReact extends React.Component {

  constructor(props) {
    super(props)
    let id = ('_' + Math.random()).replace('.', '_');
    this.state = {
      pieId: 'ringPie' + id
    }
  }

  initPie(id) {
    let {intl, data,message} = this.props;

    let myChart = echarts.getInstanceByDom(document.getElementById(id));
    if (myChart === undefined) {
      myChart = echarts.init(document.getElementById(id));
    }
    config.ringPieChart.title.text=intl.formatMessage({id:message.id})+' Top 10';

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
    if(data && data.length===0){
      config.ringPieChart.title.text="No data";
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
        let {intl, data,message,source} = this.props;
        let myChart = echarts.getInstanceByDom(document.getElementById(id));
        if (myChart === undefined) {
            myChart = echarts.init(document.getElementById(id));
        }
        config.representPieChart.title.text=intl.formatMessage({id:message.id});
        config.representPieChart.series[0].data = [];
        config.representPieChart.legend.data = [];
        config.representPieChart.title.link = '#/blockchain/stats/pieChart';
        config.representPieChart.tooltip.formatter = function (datas) {
            return (
                intl.formatMessage({id: 'witness'}) + ' : ' + datas.name + '<br/>' +
                intl.formatMessage({id: 'produced_blocks'}) + ' : ' + datas.value + '<br/>' +
                intl.formatMessage({id: 'percentage'}) + ' : ' + datas.percent + '%'
            )

        }
        if(source==='singleChart'){
            config.representPieChart.legend.show = true;
            config.representPieChart.toolbox.feature = {
                restore: {
                    title: 'restore'
                },
                saveAsImage: {
                    show: true,
                    title: 'save'
                }
            }
        }else{
            config.representPieChart.legend.show = false;
            config.representPieChart.toolbox.feature = {
                restore: {
                    show: false,
                    title: 'restore'
                },
                saveAsImage: {
                    show: false,
                    title: 'save'
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

        if (data && data.length > 0) {
            let exchanges = []
            let temp = [];
            for (let index in data) {
                if (temp.indexOf(data[index].name) < 0) {
                    temp.push(data[index].name)
                    exchanges.push({name: data[index].name, value: data[index].volumeValue});
                }
            }

            exchanges.sort(compare("value")).reverse();

            config.representPieChart.series[0].data = [];
            config.representPieChart.legend.data = temp;
            config.representPieChart.series[0].data = exchanges;

        }
        if(data && data.length===0){
            config.representPieChart.title.text="No data";
        }
        myChart.setOption(config.representPieChart);
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


