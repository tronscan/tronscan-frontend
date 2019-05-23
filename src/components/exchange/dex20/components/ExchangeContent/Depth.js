import React from "react";
import { injectIntl, FormattedNumber } from "react-intl";
import { withRouter } from "react-router";
import { widget } from "../../../../../lib/charting_library.min";
import Datafeed from "./udf/index.js";
import { connect } from "react-redux";
import { tu, tv } from "../../../../../utils/i18n";
import { TRXPrice } from "../../../../common/Price";
import { Client20 } from "../../../../../services/api";
import { change10lock, setWidget } from "../../../../../actions/exchange";
import { TokenTRC20Link } from "../../../../common/Links";
import { Icon } from "antd";

const echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");

class Depth extends React.Component {
  constructor() {
    super();

    this.state = {
      tokeninfo: [],
      tokeninfoItem: {},
      detailShow: false,
      tvStatus: true,
      myChart: null,
      buyList: [],
      sellList: [],
      buyFlag: false,
      sellFlag: false,
      timer: null
    };
  }

  async componentDidMount() {
    const { tokeninfo, tvWidget, myChart } = this.state;
    const { selectData } = this.props;
    await this.getData();
    this.createWidget();
    let timer = setInterval(() => {
      this.getData();
      this.resetOption();
    }, 20000);

    this.setState({
      timer: timer
    });
    
  }

  async componentDidUpdate(prevProps) {
    const { tokeninfo, buyFlag, sellFlag, myChart, timer } = this.state;
    const { selectData, activeLanguage, widget, register } = this.props;

    if (selectData.exchange_id != prevProps.selectData.exchange_id) {
      myChart.dispose();
      this.setState({
        myChart: null,
        buyFlag: false,
        sellFlag: false
      });

      await this.getData();
      this.createWidget();
      clearInterval(timer);
      this.setState({
        timer: setInterval(() => {
          this.getData();
          this.resetOption();
        }, 20000)
      });
    }

    // if (prevProps.register && prevProps.register.buyList) {
    //   if (
    //     register &&
    //     register.buyList &&
    //     prevProps.register.buyList != register.buyList &&
    //     register.tokenId === selectData.exchange_id
    //   ) {
    //     this.setState(
    //       {
    //         buyList: register.buyList
    //       },
    //       () => {
    //         this.resetOption();
    //       }
    //     );
    //   }
    //   if (!buyFlag) {
    //     this.setState(
    //       {
    //         buyList: prevProps.register.buyList,
    //         buyFlag: true
    //       },
    //       () => {
    //         this.createWidget();
    //       }
    //     );
    //   }
    // }

    // if (prevProps.register && prevProps.register.sellList) {
    //   if (
    //     register &&
    //     register.sellList &&
    //     prevProps.register.sellList != register.sellList &&
    //     register.tokenId === selectData.exchange_id
    //   ) {
    //     this.setState(
    //       {
    //         sellList: register.sellList
    //       },
    //       () => {
    //         this.resetOption();
    //       }
    //     );
    //   }

    //   if (!sellFlag) {
    //     this.setState(
    //       {
    //         sellList: prevProps.register.sellList,
    //         sellFlag: true
    //       },
    //       () => {
    //         this.createWidget();
    //       }
    //     );
    //   }
    // }
  }

  componentWillUnmount() {
    const { setWidget } = this.props;
    setWidget({ widget: null, type: "trc20" });
  }

  createWidget(id) {
    const { change10lock, setWidget } = this.props;
    const { buyList, sellList } = this.state;
    let { myChart } = this.state;

    const locale = this.props.intl.locale || "en";
    // 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById("myChart"));
    myChart.showLoading();

    const start = (buyList.length * 2) / 5;
    const end = buyList.length + (sellList.length * 2) / 5;
    // 绘制图表
    myChart.setOption({
      animation: false,
      tooltip: {
        showContent: false,
        extraCssText: "box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#fff",
            borderColor: "#f2ba00",
            borderWidth: "1",
            color: "#666",
            fontSize: 12
          }
        }
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0],
          startValue: start,
          endValue: end,
          filterMode: "filter"
        }
      ],
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: {
          showMinLabel: false,
          color: function(value, index) {
            return "#999";
          },
          lineStyle: {
            color: "#ccc"
          }
        },
        axisLine: {
          lineStyle: {
            color: "#ccc"
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: ["#ccc"],
            type: "dashed",
            opacity: 0.3
          }
        }
      },
      grid: {
        left: "1%",
        right: "1%",
        bottom: "1%",
        top: "20",
        containLabel: true
      },
      yAxis: [
        {
          type: "value",
          position: "left",
          axisTick: {
            inside: true,
            lineStyle: {
              color: ["#ccc"]
            }
          },
          axisLabel: {
            inside: true,
            showMinLabel: false,
            color: function(value, index) {
              return "#999999";
            },
            lineStyle: {
              color: "#ccc"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#ccc"
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#ccc"],
              type: "dashed",
              opacity: 0.3
            }
          },
          splitArea: {
            areaStyle: {
              color: ["#F15454", "#69C265"]
            }
          }
        }
      ],
      series: [
        {
          step: "start",
          data: buyList,
          type: "line",
          symbol: "circle",
          showSymbol: false,
          symbolSize: 4,
          itemStyle: {
            color: "#fff",
            borderColor: "#f2ba00",
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10
          },
          // markPoint: {
          //   data: [
          //     {
          //       name: "标线1起点",
          //       symbolSize: [50, 20],
          //       type: "min",
          //       symbol: "rect",
          //       itemStyle: {
          //         color: "green"
          //       }
          //     }
          //   ]
          // },
          lineStyle: {
            color: "#008c00",
            width: "1"
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#69C265" // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#69C265" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            opacity: 0.2
          }
        },
        {
          data: sellList,
          step: "end",
          type: "line",
          symbol: "circle",
          showSymbol: false,
          symbolSize: 5,
          itemStyle: {
            color: "#fff",
            borderColor: "#f2ba00",
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowBlur: 10
          },
          lineStyle: {
            color: "#ee3523",
            width: "1"
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#F15454" // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: "#F15454" // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff" // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            },
            opacity: 0.2
          }
        }
      ]
    });

    this.setState(
      {
        myChart: myChart
      },
      () => {
        myChart.hideLoading();
      }
    );
    window.onresize = function () {
      myChart.resize();
    };
  }

  resetOption() {
    let { myChart, buyList, sellList } = this.state;
    var option = myChart && myChart.getOption();
    option.series[0].data = buyList;
    option.series[1].data = sellList;
    myChart.setOption(option);
  }

  async getData() {
    const { selectData } = this.props;
    let res = await Client20.depthChart(selectData.exchange_id);
    let { data } = res;
    let buyList = [],
      sellList = [];
    for (let i in data.buy) {
      let item = data.buy[i];
      buyList.push([item.Price, item.amount]);
    }
    for (let i in data.sell) {
      let item = data.sell[i];
      sellList.push([item.Price, item.amount]);
    }

    this.setState({
      buyList: buyList.reverse(),
      sellList: sellList
    });
  }

  getTokenInfo() {}

  render() {
    const { tokeninfoItem, detailShow, tvStatus } = this.state;
    const { selectData, widget } = this.props;
    let imgDefault = require("../../../../../images/logo_default.png");

    return (
      <div>
        <div className="exchange__kline__pic exchange__depth " id="myChart" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    selectStatus: state.exchange.status,
    activeLanguage: state.app.activeLanguage,
    widget: state.exchange.trc20,
    register: state.exchange.register
  };
}

const mapDispatchToProps = {
  change10lock,
  setWidget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Depth)));
