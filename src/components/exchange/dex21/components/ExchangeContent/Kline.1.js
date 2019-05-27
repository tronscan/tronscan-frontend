import React from "react";
import { injectIntl, FormattedNumber } from "react-intl";
import { withRouter } from "react-router";
import { widget } from "../../../../../lib/charting_library.min";
import Datafeed from "./udf/index.js";
import { connect } from "react-redux";
import { tu, tv } from "../../../../../utils/i18n";
import { TRXPrice } from "../../../../common/Price";
import { Client20 } from "../../../../../services/api";
import { change10lock } from "../../../../../actions/exchange";
import { TokenTRC20Link } from "../../../../common/Links";
import { Icon } from "antd";

class Kline extends React.Component {
  constructor() {
    super();

    this.state = {
      tokeninfo: [],
      tokeninfoItem: {},
      detailShow: false,
      tvWidget: null,
      tvStatus: true
    };
  }

  componentDidMount() {
    // const {tokeninfo, tvWidget} = this.state
    // const { selectData} = this.props
    // tvWidget && tvWidget.remove()
    // this.setState({tvWidget:null})
    // this.createWidget(selectData.exchange_id)
    // const newObj = tokeninfo.filter(o => o.symbol == selectData.fShortName)[0]
    // this.setState({tokeninfoItem: newObj, detailShow: false})
  }

  componentDidUpdate(prevProps) {
    const { tokeninfo, tvWidget } = this.state;
    const { selectData, selectStatus, activeLanguage } = this.props;
    if (
      selectData.exchange_id != prevProps.selectData.exchange_id ||
      prevProps.activeLanguage != activeLanguage
    ) {
      tvWidget && tvWidget.remove();
      this.createWidget(selectData.exchange_id);

      const newObj = tokeninfo.filter(
        o => o.symbol == selectData.fShortName
      )[0];
      this.setState({ tokeninfoItem: newObj, detailShow: false });
    }
    if (!tokeninfo.length && selectData.exchange_id) {
      this.getTokenInfo();
    }
  }

  componentWillUnmount() {
    const { tvWidget } = this.state;
    tvWidget && tvWidget.remove();
  }

  createWidget(id) {
    const { change10lock } = this.props;
    const locale = this.props.intl.locale || "en";
    let interval = localStorage.getItem("interval");
    if (!interval) {
      interval = "30";
      localStorage.setItem("interval", "30");
    }
    change10lock(false);
    const tvWidget = new widget({
      symbol: id,
      interval: interval,
      container_id: "tv_chart_container",
      //	BEWARE: no trailing slash is expected in feed URL
      // datafeed: new UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
      datafeed: new Datafeed.UDFCompatibleDatafeed(),
      library_path: "charting_library/",
      locale: locale,
      //preset: "mobile",
      disabled_features: [
        "use_localstorage_for_settings",
        "volume_force_overlay",
        "header_compare",
        "header_symbol_search",
        "header_resolutions",
        "header_undo_redo",
        "header_chart_tpye",
        "header_screenshot",
        "header_chart_type",
        "display_market_stauts",
        "study_templates",
        "left_toolbar",
        "go_to_date",
        //"create_volume_indicator_by_default",
        "display_market_status",
        "control_bar"
        // "countdown"
      ],
      enabled_features: [
        "dont_show_boolean_study_arguments",
        "move_logo_to_main_pane",
        "hide_last_na_study_output",
        "legend_context_menu"
      ],
      height: 490,
      fullscreen: false,
      autosize: true,

      drawings_access: {
        type: "black",
        tools: [
          {
            name: "Regression Trend"
          }
        ]
      },
      studies_overrides: {},
      custom_css_url: "css/myself.css",
      loading_screen: {
        backgroundColor: "#fff"
      },
      timezone: "Asia/Shanghai", //默认时区
      theme: "Light",
      overrides: {
        // "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
        volumePaneSize: "medium", //成交量大小的显示
        "paneProperties.legendProperties.showLegend": false //关闭左上角
        // //背景色，
        // "paneProperties.background": "#fff",
        // "paneProperties.vertGridProperties.color": "#2c3450",
        // "paneProperties.vertGridProperties.style": 0,
        // "paneProperties.horzGridProperties.color": "#2c3450",
        // "paneProperties.horzGridProperties.style": 0,
        // "symbolWatermarkProperties.transparency": 90,
        // "scalesProperties.textColor": "#AAA",
        // "paneProperties.topMargin": 5,
        // "paneProperties.bottomMargin": 5,
        // //蜡烛的样式
        // "mainSeriesProperties.candleStyle.upColor": "#589065",
        // "mainSeriesProperties.candleStyle.downColor": "#ae4e54",
        // "mainSeriesProperties.candleStyle.drawWick": true,
        // "mainSeriesProperties.candleStyle.drawBorder": true,
        // "mainSeriesProperties.candleStyle.borderColor": "#589065",
        // "mainSeriesProperties.candleStyle.borderUpColor": "#589065",
        // "mainSeriesProperties.candleStyle.borderDownColor": "#ae4e54",
        // "mainSeriesProperties.candleStyle.wickUpColor": "#589065", //控制影线的颜色
        // "mainSeriesProperties.candleStyle.wickDownColor": "#ae4e54",
        // "mainSeriesProperties.candleStyle.barColorsOnPrevClose": false,
        // "paneProperties.crossHairProperties.color": "#fff", //十字线的颜色
        // // "paneProperties.crossHairProperties.style":'0',
        // "mainSeriesProperties.areaStyle.color1": "rgba(255,255,255,0.1)",
        // "mainSeriesProperties.areaStyle.color2": "rgba(255,255,255,0.1)",
        // "mainSeriesProperties.areaStyle.linecolor": "#4e5b85",
        // "mainSeriesProperties.areaStyle.linestyle": 0,
        // "mainSeriesProperties.areaStyle.linewidth": 1,
        // "mainSeriesProperties.areaStyle.priceSource": "close"
      },
      favorites: {
        chartTypes: ["Area", "Line"]
      }
    });

    tvWidget.MAStudies = [];
    tvWidget.selectedIntervalButton = null;

    tvWidget.onChartReady(() => {
      this.setState({ tvWidget });
      change10lock(true);
      const chart = tvWidget.chart();
      chart.setChartType(1);

      let mas = [
        {
          day: 5,
          color: "#9836ff"
        },
        {
          day: 10,
          color: "#ffe100"
        },
        {
          day: 30,
          color: "#ff4076"
        },
        {
          day: 60,
          color: "#49bd72"
        }
      ];

      let buttons = [
        // {
        //     label: this.locale === 'zh'?"分时":"Time",
        //     resolution: "1",
        //     chartType: 3
        // },
        {
          label: "5min",
          resolution: "5",
          chartType: 2
        },
        {
          label: "30min",
          resolution: "30",
          chartType: 2
        },
        {
          label: "1hour",
          resolution: "60",
          chartType: 2
        },
        {
          label: "4hour",
          resolution: "240",
          chartType: 2
        },
        {
          label: "1day",
          resolution: "D",
          chartType: 2
        },
        {
          label: "1week",
          resolution: "W",
          chartType: 2
        },
        {
          label: "1mon",
          resolution: "M",
          chartType: 2
        }
      ];

      // MAStudies
      // mas.forEach(item => {
      //     chart.createStudy("Moving Average", false, false, [item.day], entity => {
      //         tvWidget.MAStudies.push(entity);
      //     }, {"plot.color": item.color});
      // })
      chart.onIntervalChanged().subscribe(null, function(interval, obj) {
        tvWidget.changingInterval = false;
      });
      buttons.forEach((item, index) => {
        let button = tvWidget.createButton();
        if (chart.resolution() === item.resolution) {
          button.addClass("selected");
          tvWidget.selectedIntervalButton = button;
        }

        button
          .attr("data-resolution", item.resolution)
          .attr(
            "data-chart-type",
            item.chartType === undefined ? 1 : item.chartType
          )
          .html("<span>" + item.label + "</span>")
          .on("click", function() {
            if (!tvWidget.changingInterval && !button.hasClass("selected")) {
              // chart.setVisibleRange({from:Math.round(new Date().getTime()/1000)-10*24*60*60,to:Math.round(new Date().getTime()/1000) })
              let chartType = +button.attr("data-chart-type");
              let resolution = button.attr("data-resolution");

              if (chart.resolution() !== resolution) {
                tvWidget.changingInterval = true;
                chart.setResolution(resolution);
              }
              // if (chart.chartType() !== chartType) {
              // chart.setChartType(1);
              //     // widget.applyOverrides({
              //     // 	"mainSeriesProperties.style": chartType
              //     // });1537358229
              // }
              localStorage.setItem("interval", resolution);
              // storage.set('chartType', chart.chartType())
              updateSelectedIntervalButton(button);
              showMAStudies(chartType !== 3);
            }
          });
      });
      function updateSelectedIntervalButton(button) {
        tvWidget.selectedIntervalButton &&
          tvWidget.selectedIntervalButton.removeClass("selected");
        button.addClass("selected");
        tvWidget.selectedIntervalButton = button;
      }

      function showMAStudies(visible) {
        tvWidget.MAStudies.forEach(item => {
          // chart.setEntityVisibility(item, true);
        });
      }
    });
  }

  getTokenInfo() {
    const { selectData } = this.props;
    Client20.gettokenInfo20().then(({ trc20_tokens }) => {
      if (trc20_tokens) {
        const newObj = trc20_tokens.filter(
          o => o.name == selectData.first_token_id
        )[0];
        this.setState({ tokeninfoItem: newObj });
        this.setState({ tokeninfo: trc20_tokens });
      }
    });
  }

  render() {
    const { tokeninfoItem, detailShow, tvStatus } = this.state;
    const { selectData } = this.props;

    return (
      <div className="exchange__kline p-3 mb-2">
        {/* title 信息 */}
        <div className="d-flex mb-3 exchange__kline__title position-relative">
          {
            <img
              src={tokeninfoItem ? tokeninfoItem.icon_url : ""}
              style={{ width: "46px", height: "46px" }}
            />
          }

          <div className="ml-3">
            <div className="d-flex mb-1">
              <div
                className="kline_down"
                onClick={() => this.setState({ detailShow: !detailShow })}
              >
                <Icon type="caret-down" theme="filled" />
              </div>

              <h5 className="mr-3 font-weight-bold">
                {selectData.exchange_name} ≈ <span>{selectData.price}</span>
              </h5>
            </div>
            <div className="d-flex">
              <div className="mr-3">
                {tu("pairs_change")}
                {!selectData.isUp ? (
                  <span className="col-red ml-2">
                    {selectData.up_down_percent}
                  </span>
                ) : (
                  <span className="col-green ml-2">
                    {selectData.up_down_percent}
                  </span>
                )}
              </div>
              <div className="mr-3">
                {tu("H")}
                <span className=" ml-2">{selectData.high}</span>
              </div>
              <div className="mr-3">
                {tu("L")}
                <span className=" ml-2">{selectData.low}</span>
              </div>
              <div className="mr-3">
                {tu("24H_VOL")}{" "}
                <span className="ml-1">
                  {" "}
                  <TRXPrice amount={selectData.svolume} />
                </span>
                {/*<span className=" ml-2">{selectData.volume} {selectData.first_token_id}</span>*/}
                {/*≈*/}
              </div>
            </div>
          </div>
          {tokeninfoItem && detailShow && (
            <div className="kline_detail p-3">
              <p className="kline_detail__inr">
                <b className="mr-2">{tu("trc20_token_info_Token_Info")}</b>
                {tokeninfoItem.token_desc}
              </p>
              <ul className="">
                <li>
                  <p className="title">{tu("trc20_token_info_Total_Name")}</p>
                  <p className="value" style={{ textDecoration: "underline" }}>
                    <TokenTRC20Link
                      name={tokeninfoItem.name}
                      address={tokeninfoItem.contract_address}
                    />
                  </p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Token_Symbol")}</p>
                  <p className="value">{tokeninfoItem.symbol}</p>
                </li>
                <li>
                  <p className="title">
                    {tu("trc20_token_info_Contract_Address")}
                  </p>
                  <p className="value">{tokeninfoItem.contract_address}</p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Total_Supply")}</p>
                  <p className="value">
                    <FormattedNumber
                      value={
                        Number(tokeninfoItem.total_supply_with_decimals) /
                        Math.pow(10, tokeninfoItem.decimals)
                      }
                    />
                  </p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Website")}</p>
                  <a href={tokeninfoItem.home_page} target="_bank">
                    {tokeninfoItem.home_page}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        <hr />

        <div className="exchange__kline__pic" id="tv_chart_container" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    selectStatus: state.exchange.status,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  change10lock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Kline)));

{
  "asks": [[23878.100000, 0.333000], [23878.990000, 1.550000], [23879.000000, 0.260000], [23880.000000, 0.184000], [23893.420000, 0.300000], [23897.070000, 1.300000], [23897.990000, 0.720000], [23900.000000, 1.026000], [23908.990000, 0.598800], [23909.000000, 10.000000], [23909.990000, 0.800000], [23910.000000, 1.567000], [23911.100000, 0.095000], [23948.970000, 0.600000], [23948.990000, 0.900000], [23949.000000, 8.081500], [23950.000000, 2.707500], [23973.190000, 0.300000], [23973.200000, 5.000000], [23992.000000, 0.159000], [23999.000000, 0.971800], [24000.000000, 3.968800], [24001.000000, 1.249100], [24024.900000, 1.290000], [24068.530000, 0.500000], [24068.600000, 1.528000], [24072.700000, 1.290000], [24085.000000, 4.489700], [24086.000000, 5.047200], [24087.610000, 0.001000], [24095.590000, 0.150000], [24099.000000, 0.002700], [24100.000000, 5.048800], [24102.000000, 1.112900], [24105.590000, 0.300000], [24107.980000, 0.001000], [24108.530000, 0.750000], [24128.000000, 0.998000], [24150.000000, 0.060000], [24158.580000, 0.001000], [24164.160000, 0.722800], [24164.170000, 0.726600], [24188.000000, 0.020200], [24191.900000, 0.010000], [24193.000000, 0.020400], [24198.000000, 1.107500], [24200.000000, 8.125200], [24209.180000, 0.001000], [24210.710000, 0.003000], [24230.000000, 0.029700], [24242.420000, 0.010400], [24259.790000, 0.001000], [24259.990000, 0.400000], [24260.000000, 1.000000], [24288.110000, 1.180400], [24300.000000, 13.729000], [24310.380000, 0.001000], [24350.000000, 0.280600], [24360.000000, 2.000000], [24380.000000, 0.200000], [24396.990000, 0.250000], [24397.000000, 0.100000], [24398.000000, 0.200000], [24399.000000, 0.400000], [24400.000000, 0.622700], [24435.510000, 0.227000], [24444.000000, 0.232300], [24450.000000, 2.073400], [24455.000000, 0.115200], [24478.000000, 0.199600], [24495.000000, 0.609800], [24496.000000, 1.307700], [24499.000000, 2.464100], [24500.000000, 84.157900], [24501.000000, 0.500000], [24510.000000, 0.100000], [24514.610000, 0.003000], [24520.000000, 0.400000], [24530.000000, 0.100000], [24531.000000, 0.803300], [24550.000000, 1.571200], [24560.000000, 28.593300], [24568.000000, 0.200000], [24575.100000, 0.398400], [24580.000000, 0.300000], [24588.000000, 0.400000], [24590.000000, 0.038800], [24598.000000, 0.233200], [24599.990000, 0.120000], [24600.000000, 2.387600], [24601.710000, 0.001000], [24602.900000, 0.700000], [24605.400000, 0.004100], [24608.090000, 0.001000], [24621.000000, 0.210000], [24650.000000, 1.150000], [24657.000000, 0.500000], [24659.190000, 0.001000], [24665.000000, 0.015600], [24680.000000, 0.846800], [24688.000000, 0.520200], [24689.000000, 0.829400], [24699.940000, 0.149700], [24699.990000, 0.025800], [24700.000000, 3.469400], [24710.290000, 0.001000], [24716.000000, 1.000000], [24734.000000, 2.000000], [24738.860000, 0.142100], [24750.000000, 8.154200], [24760.900000, 0.110000], [24761.390000, 0.001000], [24798.000000, 0.200000], [24799.000000, 0.010000], [24799.900000, 0.525300], [24800.000000, 10.407700], [24800.210000, 0.379500], [24812.490000, 0.001000], [24818.510000, 0.003000], [24838.000000, 0.004400], [24840.000000, 0.746000], [24848.090000, 0.016000], [24849.000000, 0.287400], [24850.000000, 1.715300], [24856.110000, 0.075300], [24859.000000, 0.100000], [24860.000000, 0.390000], [24863.590000, 0.001000], [24880.000000, 0.688600], [24888.000000, 1.146600], [24890.000000, 3.141600], [24896.250000, 4.061400], [24898.020000, 0.500400], [24899.000000, 0.010000], [24899.990000, 0.068800], [24900.000000, 12.840300], [24908.400000, 0.040000], [24914.690000, 0.001000], [24933.900000, 0.086000], [24949.990000, 0.400000], [24950.000000, 2.957500], [24956.000000, 0.599400], [24959.990000, 0.431800], [24960.000000, 0.153100], [24965.790000, 0.001000], [24970.000000, 0.010600], [24980.000000, 4.793400], [24988.000000, 3.326900], [24988.880000, 0.106300], [24990.000000, 9.022300]],
    "bids": [[23850.000000, 8.386100], [23831.000000, 1.954700], [23830.000000, 5.906000], [23802.000000, 0.849900], [23801.000000, 24.716200], [23800.000000, 12.705000], [23786.730000, 0.023000], [23780.000000, 0.390000], [23779.990000, 0.180000], [23779.090000, 0.400000], [23778.180000, 0.280000], [23777.280000, 0.600000], [23773.640000, 0.270000], [23772.740000, 0.600000], [23772.120000, 0.001000], [23770.900000, 0.330000], [23770.000000, 54.000000], [23747.330000, 0.800000], [23735.160000, 0.150000], [23725.160000, 0.300000], [23722.120000, 0.001000], [23701.000000, 0.103000], [23700.100000, 0.200000], [23700.000000, 0.411000], [23692.170000, 0.790000], [23692.160000, 0.500000], [23678.010000, 0.700000], [23678.000000, 0.072600], [23672.120000, 0.001000], [23666.000000, 4.900000], [23661.390000, 0.300000], [23652.160000, 0.750000], [23651.000000, 1.116300], [23650.000000, 0.955600], [23630.000000, 0.288900], [23622.120000, 0.001000], [23612.990000, 0.001000], [23608.000000, 0.036800], [23602.470000, 0.590000], [23602.460000, 3.000000], [23602.000000, 1.694800], [23600.600000, 0.019000], [23600.010000, 0.302000], [23600.000000, 3.269700], [23580.010000, 0.350000], [23580.000000, 2.000000], [23551.000000, 0.130000], [23550.120000, 0.100000], [23550.000000, 2.595900], [23533.010000, 0.590000], [23533.000000, 1.000000], [23530.000000, 3.633200], [23518.180000, 0.300000], [23518.000000, 1.713900], [23515.000000, 10.530300], [23510.100000, 1.250000], [23509.000000, 0.093700], [23508.000000, 0.200000], [23506.000000, 13.465400], [23505.000000, 0.100000], [23502.000000, 0.130000], [23501.010000, 0.100000], [23501.000000, 2.600000], [23500.020000, 10.200000], [23500.010000, 14.180400], [23500.000000, 52.328300], [23499.470000, 0.032400], [23499.000000, 1.076400], [23480.000000, 3.000000], [23456.000000, 1.185800], [23450.000000, 0.586800], [23448.000000, 0.102300], [23444.440000, 0.200000], [23444.000000, 0.235500], [23420.900000, 0.001000], [23409.500000, 0.020000], [23408.000000, 0.200000], [23401.950000, 0.540000], [23401.940000, 0.917300], [23400.990000, 0.050000], [23400.010000, 0.400000], [23400.000000, 6.882100], [23399.000000, 0.005000], [23393.000000, 0.001000], [23390.000000, 1.000000], [23381.540000, 0.001000], [23380.000000, 1.360500], [23373.000000, 0.042800], [23360.000000, 1.000000], [23358.280000, 1.000000], [23350.670000, 0.600000], [23350.660000, 2.000000], [23340.000000, 0.005500], [23334.000000, 0.178100], [23333.330000, 0.133800], [23333.000000, 3.481300], [23330.000000, 3.000000], [23323.660000, 1.600000], [23308.000000, 0.200000], [23301.000000, 0.260000], [23300.500000, 5.257200], [23300.000000, 31.860200], [23299.000000, 1.005000], [23298.000000, 0.110000], [23296.370000, 0.360000], [23288.000000, 0.337100], [23287.100000, 0.699500], [23280.000000, 2.058500], [23275.000000, 0.171900], [23269.000000, 0.007200], [23260.000000, 0.430000], [23258.000000, 0.623300], [23250.010000, 0.002000], [23250.000000, 6.899500], [23237.050000, 0.210000], [23234.000000, 0.004700], [23232.000000, 0.100000], [23225.000000, 1.281000], [23222.330000, 4.306200], [23220.000000, 0.058800], [23213.000000, 0.004300], [23211.000000, 0.412000], [23210.200000, 0.046900], [23210.000000, 0.400000], [23208.000000, 0.200000], [23200.000000, 18.541100], [23199.000000, 0.005000], [23188.000000, 0.808700], [23177.000000, 0.681100], [23168.000000, 1.500000], [23164.560000, 0.086300], [23160.600000, 0.069300], [23152.360000, 0.001000], [23150.000000, 0.397900], [23142.960000, 0.129700], [23139.480000, 0.003000], [23133.330000, 2.143400], [23132.280000, 0.570000], [23130.900000, 1.000000], [23125.000000, 0.500000], [23123.000000, 0.001000], [23120.010000, 0.029600], [23120.000000, 1.050000], [23115.000000, 0.007900], [23113.000000, 0.939900], [23112.000000, 0.100000], [23111.000000, 0.559400], [23110.000000, 50.201200], [23109.000000, 6.497300], [23108.000000, 2.280000]]
}
