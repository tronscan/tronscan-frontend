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
    const { tokeninfo, tvWidget } = this.state;
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
    console.log(buyList);
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
          // data: [
          //   [28408, 298.2393, 0.1367],
          //   [28412.73, 298.1026, 0.0389],
          //   [28420, 298.0637, 0.2],
          //   [28431.52, 297.8637, 0.2223],
          //   [28440.11, 297.6414, 0.1002],
          //   [28443.62, 297.5412, 0.0348],
          //   [28444.44, 297.5064, 0.3842],
          //   [28451, 297.1222, 0.176],
          //   [28456.25, 296.9462, 5],
          //   [28460, 291.9462, 0.4923],
          //   [28498.21, 291.4539, 0.0805],
          //   [28499, 291.3734, 0.05],
          //   [28500, 291.3234, 66.7432],
          //   [28500.01, 224.5802, 0.891],
          //   [28501, 223.6892, 1.4607],
          //   [28502, 222.2285, 0.12],
          //   [28508, 222.1085, 0.2191],
          //   [28509.23, 221.8894, 0.01],
          //   [28510, 221.8794, 26.5546],
          //   [28512, 195.3248, 0.1],
          //   [28522.67, 195.2248, 0.0473],
          //   [28529.81, 195.1775, 0.5],
          //   [28538, 194.6775, 0.094],
          //   [28538.03, 194.5835, 0.5],
          //   [28543, 194.0835, 0.4039],
          //   [28545, 193.6796, 0.095],
          //   [28555, 193.5846, 0.094],
          //   [28560, 193.4906, 0.374],
          //   [28561, 193.1166, 0.08],
          //   [28567.1, 193.0366, 1.1214],
          //   [28588, 191.9152, 0.02],
          //   [28600, 191.8952, 43.13],
          //   [28608, 148.7652, 0.1],
          //   [28613, 148.6652, 0.2],
          //   [28613.6, 148.4652, 0.0273],
          //   [28617.97, 148.4379, 0.7],
          //   [28625.8, 147.7379, 0.0587],
          //   [28640.04, 147.6792, 0.2283],
          //   [28650, 147.4509, 0.923],
          //   [28651, 146.5279, 1.8931],
          //   [28651.99, 144.6348, 0.015],
          //   [28656, 144.6198, 0.2],
          //   [28658, 144.4198, 0.01],
          //   [28660, 144.4098, 0.3489],
          //   [28665, 144.0609, 0.098],
          //   [28668, 143.9629, 0.1187],
          //   [28679.92, 143.8442, 0.0935],
          //   [28683.22, 143.7507, 0.6],
          //   [28692, 143.1507, 1],
          //   [28699, 142.1507, 0.3356],
          //   [28700, 141.8151, 1.8774],
          //   [28701.02, 139.9377, 1.8122],
          //   [28701.05, 138.1255, 0.7],
          //   [28703.03, 137.4255, 0.5],
          //   [28703.06, 136.9255, 0.7],
          //   [28708, 136.2255, 0.1],
          //   [28715.22, 136.1255, 0.3],
          //   [28723.22, 135.8255, 0.4],
          //   [28725.22, 135.4255, 0.15],
          //   [28731.15, 135.2755, 0.7705],
          //   [28735, 134.505, 0.0815],
          //   [28736, 134.4235, 0.0262],
          //   [28737, 134.3973, 0.3581],
          //   [28737.18, 134.0392, 0.3806],
          //   [28738.97, 133.6586, 0.2347],
          //   [28740, 133.4239, 3.3747],
          //   [28750, 130.0492, 2.6797],
          //   [28750.03, 127.3695, 0.6852],
          //   [28750.22, 126.6843, 0.5688],
          //   [28752, 126.1155, 0.12],
          //   [28753, 125.9955, 7.1862],
          //   [28756.74, 118.8093, 2.027],
          //   [28780, 116.7823, 3.2505],
          //   [28780.06, 113.5318, 0.093],
          //   [28797.03, 113.4388, 0.5],
          //   [28800, 112.9388, 1.2749],
          //   [28808, 111.6639, 0.1],
          //   [28822.89, 111.5639, 1.1127],
          //   [28822.92, 110.4512, 0.7],
          //   [28847, 109.7512, 1],
          //   [28850, 108.7512, 0.3888],
          //   [28855.53, 108.3624, 10],
          //   [28855.56, 98.3624, 0.5],
          //   [28856, 97.8624, 0.02],
          //   [28860, 97.8424, 0.0693],
          //   [28866, 97.7731, 0.02],
          //   [28871.66, 97.7531, 3.201],
          //   [28882, 94.5521, 0.1],
          //   [28888, 94.4521, 0.1404],
          //   [28888.88, 94.3117, 0.45],
          //   [28889, 93.8617, 0.1],
          //   [28890, 93.7617, 0.2193],
          //   [28900, 93.5424, 1.1176],
          //   [28901, 92.4248, 1],
          //   [28908, 91.4248, 1.1],
          //   [28915.73, 90.3248, 0.55],
          //   [28932.8, 89.7748, 0.004],
          //   [28937, 89.7708, 0.0035],
          //   [28940, 89.7673, 1.7601],
          //   [28942, 88.0072, 0.0347],
          //   [28943.53, 87.9725, 0.18],
          //   [28950, 87.7925, 0.06],
          //   [28955.03, 87.7325, 1.09],
          //   [28960.03, 86.6425, 0.0035],
          //   [28961, 86.639, 0.123],
          //   [28961.31, 86.516, 0.0075],
          //   [28962.09, 86.5085, 0.321],
          //   [28973.4, 86.1875, 0.7],
          //   [28980, 85.4875, 0.7071],
          //   [28981.52, 84.7804, 1.87],
          //   [28993.91, 82.9104, 0.0133],
          //   [28999, 82.8971, 0.002],
          //   [28999.88, 82.8951, 0.1118],
          //   [29000, 82.7833, 12.7248],
          //   [29002, 70.0585, 0.12],
          //   [29008, 69.9385, 0.1],
          //   [29010, 69.8385, 0.4676],
          //   [29010.03, 69.3709, 0.1802],
          //   [29010.06, 69.1907, 0.5],
          //   [29018, 68.6907, 0.1251],
          //   [29020, 68.5656, 0.1343],
          //   [29022, 68.4313, 1.0337],
          //   [29022.03, 67.3976, 0.7],
          //   [29050, 66.6976, 0.0684],
          //   [29053, 66.6292, 0.01],
          //   [29055.13, 66.6192, 0.1722],
          //   [29066, 66.447, 0.4879],
          //   [29066.1, 65.9591, 0.05],
          //   [29068, 65.9091, 0.4549],
          //   [29070, 65.4542, 0.3006],
          //   [29072, 65.1536, 0.0347],
          //   [29085, 65.1189, 0.0806],
          //   [29088, 65.0383, 0.0034],
          //   [29100, 65.0349, 15.2143],
          //   [29100.09, 49.8206, 0.172],
          //   [29102, 49.6486, 0.4637],
          //   [29105, 49.1849, 0.0342],
          //   [29106.31, 49.1507, 0.0608],
          //   [29109.84, 49.0899, 0.3934],
          //   [29109.87, 48.6965, 3.2],
          //   [29112.11, 45.4965, 0.0055],
          //   [29116.62, 45.491, 1.19],
          //   [29128.14, 44.301, 0.9665],
          //   [29136, 43.3345, 0.9451],
          //   [29136.52, 42.3894, 0.0608],
          //   [29145.66, 42.3286, 0.0608],
          //   [29149, 42.2678, 0.069],
          //   [29150, 42.1988, 36.5088],
          //   [29150.03, 5.69, 2.98],
          //   [29150.04, 2.71, 2.71]
          // ],
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
          // data: [
          //   [29180, 0.8431],
          //   [29190, 18.7992],
          //   [29193.3, 18.9259],
          //   [29195, 20.1828],
          //   [29195.8, 22.1698, 1.987],
          //   [29195.9, 22.2077, 0.0379],
          //   [29196, 22.2765, 0.0688],
          //   [29198, 24.2765, 2],
          //   [29198.97, 25.3765, 1.1],
          //   [29199, 25.809, 0.4325],
          //   [29199.96, 26.499, 0.69],
          //   [29199.99, 33.7677, 7.2687],
          //   [29200, 49.6009, 15.8332],
          //   [29205, 49.6459, 0.045],
          //   [29206, 50.2087, 0.5628],
          //   [29210, 50.6568, 0.4481],
          //   [29218, 50.9655, 0.3087],
          //   [29219.99, 51.7768, 0.8113],
          //   [29220, 53.2598, 1.483],
          //   [29222, 53.297, 0.0372],
          //   [29230, 53.797, 0.5],
          //   [29239.97, 54.487, 0.69],
          //   [29240, 55.9015, 1.4145],
          //   [29247.82, 56.4415, 0.54],
          //   [29247.85, 56.6107, 0.1692],
          //   [29249.57, 57.4907, 0.88],
          //   [29249.6, 60.5383, 3.0476],
          //   [29250, 66.028, 5.4897],
          //   [29250.2, 66.064, 0.036],
          //   [29257.95, 66.2636, 0.1996],
          //   [29260, 66.4753, 0.2117],
          //   [29269.9, 66.4803, 0.005],
          //   [29270, 66.6234, 0.1431],
          //   [29271, 66.7512, 0.1278],
          //   [29274.52, 67.4512, 0.7],
          //   [29276, 67.7385, 0.2873],
          //   [29279.88, 68.2385, 0.5],
          //   [29279.91, 69.0251, 0.7866],
          //   [29280, 73.8076, 4.7825],
          //   [29282.97, 74.5076, 0.7],
          //   [29283, 75.5076, 1],
          //   [29288, 77.0269, 1.5193],
          //   [29289, 77.3816, 0.3547],
          //   [29290, 79.8187, 2.4371],
          //   [29294.87, 80.9187, 1.1],
          //   [29294.9, 81.5802, 0.6615],
          //   [29294.99, 84.5802, 3],
          //   [29295, 146.6652, 62.085],
          //   [29296, 146.6951, 0.0299],
          //   [29297, 146.6978, 0.0027],
          //   [29298, 159.6089, 12.9111],
          //   [29298.71, 159.6438, 0.0349],
          //   [29298.99, 159.7133, 0.0695],
          //   [29299, 160.7382, 1.0249],
          //   [29299.8, 160.8211, 0.0829],
          //   [29299.9, 161.4211, 0.6],
          //   [29300, 300.4619, 139.0408],
          //   [29301.03, 300.4669, 0.005],
          //   [29305, 300.7669, 0.3],
          //   [29306.5, 300.8169, 0.05],
          //   [29307.13, 300.8404, 0.0235],
          //   [29310, 300.8414, 0.001],
          //   [29329.8, 300.8434, 0.002],
          //   [29348, 301.1026, 0.2592],
          //   [29349, 301.4128, 0.3102],
          //   [29350, 302.3845, 0.9717],
          //   [29352, 302.4092, 0.0247],
          //   [29359.97, 302.9092, 0.5],
          //   [29360, 303.5622, 0.653],
          //   [29361.1, 303.6374, 0.0752],
          //   [29379, 304.6374, 1],
          //   [29380, 305.5176, 0.8802],
          //   [29383.2, 305.6176, 0.1],
          //   [29384, 305.6877, 0.0701],
          //   [29386.8, 305.719, 0.0313],
          //   [29388, 308.4591, 2.7401],
          //   [29388.88, 308.5686, 0.1095],
          //   [29389.97, 317.5686, 9],
          //   [29391, 317.5719, 0.0033],
          //   [29395, 317.5776, 0.0057],
          //   [29398, 317.8276, 0.25],
          //   [29399, 317.9638, 0.1362],
          //   [29400, 345.3181, 27.3543],
          //   [29400.03, 346.3181, 1],
          //   [29403.12, 346.3332, 0.0151],
          //   [29410, 347.3934, 1.0602],
          //   [29411, 347.4024, 0.009],
          //   [29420, 347.6177, 0.2153],
          //   [29424.16, 347.6227, 0.005],
          //   [29430, 348.6227, 1],
          //   [29432, 348.7227, 0.1],
          //   [29439.83, 348.7753, 0.0526],
          //   [29447.94, 349.4753, 0.7],
          //   [29447.97, 349.6753, 0.2],
          //   [29449, 351.7253, 2.05],
          //   [29449.02, 351.9255, 0.2002],
          //   [29450, 387.399, 35.4735],
          //   [29450.01, 387.8074, 0.4084],
          //   [29458, 388.3074, 0.5],
          //   [29460, 388.7188, 0.4114],
          //   [29466, 389.7418, 1.023],
          //   [29468, 390.2208, 0.479],
          //   [29469.98, 390.7208, 0.5],
          //   [29470, 392.1821, 1.4613],
          //   [29477.98, 392.3321, 0.15],
          //   [29480, 396.6028, 4.2707],
          //   [29486, 406.6028, 10],
          //   [29488, 408.47, 1.8672],
          //   [29488.23, 408.9784, 0.5084],
          //   [29489, 410.1148, 1.1364],
          //   [29489.39, 410.7669, 0.6521],
          //   [29490, 412.4259, 1.659],
          //   [29495, 412.8022, 0.3763],
          //   [29496, 412.9955, 0.1933],
          //   [29498, 414.1007, 1.1052],
          //   [29499, 512.2822, 98.1815],
          //   [29499.05, 512.8822, 0.6],
          //   [29499.8, 512.9181, 0.0359],
          //   [29499.98, 513.0181, 0.1],
          //   [29499.99, 514.0064, 0.9883],
          //   [29500, 687.6153, 173.6089],
          //   [29500.1, 687.6186, 0.0033],
          //   [29500.88, 690.6186, 3],
          //   [29501, 690.622, 0.0034],
          //   [29501.19, 690.722, 0.1],
          //   [29509, 690.8218, 0.0998],
          //   [29510, 690.8348, 0.013],
          //   [29517, 691.8756, 1.0408],
          //   [29520, 692.1256, 0.25],
          //   [29522, 692.1297, 0.0041],
          //   [29522.59, 692.1968, 0.0671],
          //   [29525, 692.5569, 0.3601],
          //   [29528, 692.6569, 0.1],
          //   [29534, 692.6599, 0.003],
          //   [29536, 696.6687, 4.0088],
          //   [29540, 697.6667, 0.998],
          //   [29540.68, 697.6717, 0.005],
          //   [29543, 697.6751, 0.0034],
          //   [29544, 697.7816, 0.1065],
          //   [29545, 698.488, 0.7064],
          //   [29546, 698.4957, 0.0077],
          //   [29546.99, 700.4957, 2],
          //   [29548.99, 700.738, 0.2423],
          //   [29549.01, 700.749, 0.011],
          //   [29550, 706.5007, 5.7517],
          //   [29553, 706.7758, 0.2751],
          //   [29555, 708.7783, 2.0025],
          //   [29555.55, 708.8857, 0.1074],
          //   [29558, 709.2143, 0.3286],
          //   [29560, 710.2282, 1.0139]
          // ],
          data: sellList,
          // markPoint: {
          //   // symbol: "arrow",

          //   data: [
          //     {
          //       type: "min",
          //       symbol: "roundRect",
          //       symbolSize: [20, 10],
          //       itemStyle: {
          //         color: "red"
          //       }
          //     }
          //   ]
          // },
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
          // label: {
          //   show: true,
          //   position: "left",
          //   distance: 10,
          //   padding: 10,
          //   fontSize: 12,
          //   color: "#fff",
          //   backgroundColor: "rgba(0, 0, 0, .6)",
          //   formatter: function(params) {
          //     return [
          //       `价格 ：{a|￥${params.data[0]}}`,
          //       `总量 ：{a|${Math.round(params.data[1])}}`
          //     ].join("\n");
          //   },
          //   rich: {
          //     a: {
          //       color: "#fff",
          //       fontSize: "12",
          //       fontWeight: "bold",
          //       lineHeight: "20"
          //     }
          //   }
          // },
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
  }

  resetOption() {
    let { myChart, buyList, sellList } = this.state;
    var option = myChart && myChart.getOption();
    option.series[0].data = buyList;
    option.series[1].data = sellList;
    myChart.setOption(option);
  }

  async getData() {
    let res = await Client20.depthChart(112);
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
