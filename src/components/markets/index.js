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
                <h5 className="card-title text-center">{tu("Average Price in USD")}</h5>
                <div style={{height: 300}}>
                  {
                    volumeGraph.length === 0 ?
                      <TronLoader/> :
                      <ResponsiveContainer>
                        <AreaChart data={priceGraph} isAnimationActive={false}>
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={styles.line.stroke} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={styles.line.stroke} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tickFormatter={value => intl.formatDate(value * 1000)}
                          />
                          <YAxis tickFormatter={value => "$" + intl.formatNumber(value)} />
                          <CartesianGrid strokeDasharray="3 3"/>
                          <Tooltip
                            content={ ({payload}) => <div className="bg-white p-2 border">
                              {
                                (payload && payload[0]) && <Fragment>
                                  <FormattedDate value={payload[0].payload.time * 1000} /><br/>
                                  $<FormattedNumber
                                  value={payload[0].value}
                                  maximumFractionDigits={6}/>
                                </Fragment>
                              }
                            </div>
                            }
                          />
                          {/*<Legend />*/}
                          <Area name="Price"
                                type="natural"
                                dataKey="close"
                                stroke={styles.line.stroke}
                                fillOpacity={1}
                                fill="url(#colorUv)"
                                formatter={
                                  (value, name, props) => <Fragment>
                                  </Fragment>
                                }
                                strokeWidth={2} activeDot={{r: 8}}
                                isAnimationActive={false}/>
                        </AreaChart>
                      </ResponsiveContainer>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">{tu("Average Volume in USD")}</h5>
                <div style={{height: 300}}>
                  {
                    volumeGraph.length === 0 ?
                      <TronLoader/> :
                      <ResponsiveContainer>
                        <AreaChart data={volumeGraph} isAnimationActive={false}>
                          <defs>
                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={styles.line.stroke} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={styles.line.stroke} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="time"
                            tickFormatter={value => intl.formatTime(value * 1000)}
                          />
                          <YAxis tickFormatter={value => "$" + intl.formatNumber(value)} />
                          <CartesianGrid strokeDasharray="3 3"/>
                          <Tooltip
                            content={ ({payload}) => <div className="bg-white p-2 border">
                              {
                                (payload && payload[0]) && <Fragment>
                                  <FormattedDate value={payload[0].payload.time * 1000} />&nbsp;
                                  <FormattedTime value={payload[0].payload.time * 1000} />
                                  <br/>
                                  $<FormattedNumber
                                  value={payload[0].value}
                                  maximumFractionDigits={6}/>
                                </Fragment>
                              }
                            </div>
                            }
                          />
                          {/*<Legend />*/}
                          <Area name="Price"
                                type="natural"
                                dataKey="volume"
                                stroke={styles.line.stroke}
                                fillOpacity={1}
                                fill="url(#colorUv)"
                                formatter={
                                  (value, name, props) => <Fragment>
                                    </Fragment>
                                }
                                strokeWidth={2} activeDot={{r: 8}}
                                isAnimationActive={false}/>
                        </AreaChart>
                      </ResponsiveContainer>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <Chord markets={markets} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <MarketOverview markets={markets} />
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


export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(injectIntl(Markets));
