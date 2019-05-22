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

class Kline extends React.Component {
  constructor() {
    super();

    this.state = {
      tokeninfo: [],
      tokeninfoItem: {},
      detailShow: false,
      tvStatus: true
    };
  }

  componentDidMount() {
    const { tokeninfo, tvWidget } = this.state;
    const { selectData } = this.props;
    this.createWidget(selectData.exchange_id);
    const newObj = tokeninfo.filter(o => o.symbol == selectData.fShortName)[0];
    this.setState({ tokeninfoItem: newObj, detailShow: false });
  }

  componentDidUpdate(prevProps) {
    const { tokeninfo } = this.state;
    const { selectData, selectStatus, activeLanguage, widget } = this.props;

    if (!tokeninfo.length && selectData.exchange_id) {
      this.getTokenInfo();
    }
    if (
      selectData.exchange_id != prevProps.selectData.exchange_id ||
      prevProps.activeLanguage != activeLanguage
    ) {
      if (!widget) {
        this.createWidget(selectData.exchange_id);
      } else {
        widget.chart().setSymbol(selectData.exchange_id.toString());
      }

      const newObj = tokeninfo.filter(
        o => o.symbol == selectData.fShortName
      )[0];
      this.setState({ tokeninfoItem: newObj, detailShow: false });
    }
  }

  componentWillUnmount() {
    const { setWidget } = this.props;
    setWidget({ widget: null, type: "trc20" });
  }

  createWidget(id) {
    const { change10lock, setWidget } = this.props;
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
        "paneProperties.legendProperties.showLegend": false, //关闭左上角
        // //背景色，
        // "paneProperties.background": "#fff",
        // "paneProperties.vertGridProperties.color": "#2c3450",
        // "paneProperties.vertGridProperties.style": 0,
        // "paneProperties.horzGridProperties.color": "#2c3450",
        // "paneProperties.horzGridProperties.style": 0,
        // "symbolWatermarkProperties.transparency": 90,
        "scalesProperties.textColor": "#999",
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
          label: "5m",
          resolution: "5",
          chartType: 2
        },
        {
          label: "30m",
          resolution: "30",
          chartType: 2
        },
        {
          label: "1h",
          resolution: "60",
          chartType: 2
        },
        {
          label: "4h",
          resolution: "240",
          chartType: 2
        },
        {
          label: "1d",
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

      setWidget({ widget: tvWidget, type: "trc20" });
      change10lock(true);
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
    const { selectData, widget } = this.props;
    let imgDefault = require("../../../../../images/logo_default.png");

    return (
      <div>
        {/* title 信息 */}
        <div className="exchange__kline__pic" id="tv_chart_container" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    selectStatus: state.exchange.status,
    activeLanguage: state.app.activeLanguage,
    widget: state.exchange.trc20
  };
}

const mapDispatchToProps = {
  change10lock,
  setWidget
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Kline)));
