import React from "react";
import {injectIntl} from "react-intl";

import {widget} from '../../../../lib/charting_library.min';
import './datafeeds/udf/dist/polyfills.js';
import {UDFCompatibleDatafeed} from './datafeeds/udf/dist/bundle';

class Kline extends React.Component {

  constructor() {
    super();

    this.state = {
      
    };
  }

  componentDidMount() {
   
    console.log(widget)
    const tvwedget = new widget({
      symbol: 'AAPL',
      interval: 'D',
      container_id: "tv_chart_container",
      //	BEWARE: no trailing slash is expected in feed URL
      datafeed: new UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
      library_path: "charting_library/",
      locale: "zh",

      disabled_features: [
        "use_localstorage_for_settings",
        "volume_force_overlay",
        "create_volume_indicator_by_default"
      ],
      preset: "mobile",
      height: 263,
      fullscreen: false,
      autosize: true,
    });
    
    tvwedget.onChartReady(() => {
      const chart =	tvwedget.chart()
      chart.setChartType(2)
      chart.clearMarks()
    })
  }

  render() {
    return (
      <div className="exchange__kline p-3 mb-2">
      {/* title 信息 */}
      <div className="d-flex exchange__kline__title">
        <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
        <div className="mr-3">涨幅<span className="ex-red ml-2">-6.65%</span></div>
        <div className="mr-3">高<span className=" ml-2">0.00245</span></div>
        <div className="mr-3">低<span className=" ml-2">0.00245</span></div>
        <div className="mr-3">24H成交量<span className=" ml-2">22332.23</span></div>
      </div>

      <hr/>

      <div className="exchange__kline__pic" id='tv_chart_container'></div>

    </div>
    )
  }
}

export default injectIntl(Kline);