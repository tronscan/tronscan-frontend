import React, {Fragment} from "react";

import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {loadPriceData} from "../../actions/markets";
import {tu} from "../../utils/i18n";
import MarketOverview from "./MarketOverview";
import {TronLoader} from "../common/loaders";
import Chord from "./Chord";
import {Client} from "../../services/api";
import LineReact from "../common/LineChart";
import RingPieReact from "../common/RingPieChart";

class Markets extends React.Component {

  constructor() {
    super();

    this.state = {
      priceGraph: [],
      volumeGraph: [],
      markets: [],
    };
  }

  componentDidMount() {
    this.loadMarketData();
  }

  loadMarketData = async () => {
    this.props.loadPriceData();

    let markets = await Client.getMarkets();

    this.setState({
      markets,
    });
  };

  render() {

    let {intl, priceGraph, volumeGraph} = this.props;
    let {markets} = this.state;

    return (
        <main className="container header-overlap pb-3">
          <div className="row">
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">{tu("average_price_usd")}</h5>
                  <div style={{height: 300}}>
                    {
                      priceGraph.length === 0 ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={priceGraph} keysData={['time', 'close']}
                                     format={{time: true, date: true}}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">{tu("average_volume_usd")}</h5>
                  <div style={{height: 300}}>
                    {
                      volumeGraph.length === 0 ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={volumeGraph} keysData={['time', 'volume']}
                                     format={{time: true}}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">{tu("Trade Volume")}{' Top 10'}</h5>
                  <RingPieReact style={{height: 700}} data={markets}/>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <MarketOverview markets={markets}/>
            </div>
          </div>
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    priceGraph: state.markets.price,
    volumeGraph: state.markets.volume,
  };
}

const mapDispatchToProps = {
  loadPriceData,
};

const styles = {
  line: {
    stroke: '#343a40',
  }
};


export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(injectIntl(Markets));
