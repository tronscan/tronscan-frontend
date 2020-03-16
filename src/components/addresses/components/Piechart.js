import React from "react";

import config from "./chart.config.js";

import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/component/title";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/legend/ScrollableLegendModel.js";
import "echarts/lib/component/legend/ScrollableLegendView.js";
import "echarts/lib/component/legend/scrollableLegendAction.js";
import { cloneDeep } from "lodash";

import Highcharts from "highcharts/highcharts";
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsDrilldown from "highcharts/modules/drilldown";
import Highcharts3D from "highcharts/highcharts-3d";
import Exporting from "highcharts/modules/exporting";

HighchartsMore(Highcharts);
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Exporting(Highcharts);

export class Piechart extends React.Component {
  constructor(props) {
    super(props);
    let id = ("_" + Math.random()).replace(".", "_");
    this.state = {
      pieId: "ringPie" + id
    };
  }
  initPie(id) {
    let { intl, data, message, source } = this.props;
    let _config = cloneDeep(config.piechart);
    if (data && data.length === 0) {
      _config.title.text = "No data";
    }

    if (data && data.length > 0) {
      let temp = [];
      for (let index in data) {
        if (temp.indexOf(data[index].name) < 0) {
          _config.series[0].data.push({
            name: data[index].name,
            y: data[index].value,
            usdBalance:data[index].usdBalance
          });
        }
      }
    }
    _config.title.text = intl.formatMessage({ id: message.id });
    _config.exporting.filename = intl.formatMessage({ id: message.id });
    _config.tooltip.formatter = function() {
      return `${this.point.name}: ${this.point.percentage.toFixed(2)}%（${Highcharts.numberFormat(this.point.usdBalance, 3, '.', ',')} USD)`;
    };

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
    );
  }
}
