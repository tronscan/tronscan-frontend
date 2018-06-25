import React from "react";

import {Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, Treemap, XAxis, YAxis} from "recharts";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {filter, includes} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import RichList from "./RichList";
import {TronLoader} from "../../common/loaders";
import PieReact from "../../common/PieChart";
import LineReact from "../../common/LineChart";

const COLORS = ['#8889DD', '#9597E4', '#8DC77B', '#A5D297', '#E2CF45', '#F8C12D'];


function CustomizedContent({root, depth, x, y, width, height, index, payload, colors, rank, name}) {

  return (
      <g onClick={() => alert('clicked')}>
        <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: depth < 2 ? colors[Math.floor(index / root.children.length * 6)] : 'none',
              stroke: '#fff',
              strokeWidth: 2 / (depth + 1e-10),
              strokeOpacity: 1 / (depth + 1e-10),
            }}
        />
        {
          depth !== 10 ?
              <text
                  x={x + width / 2}
                  y={y + height / 2 + 7}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={14}
              >
                {name}
              </text>
              : null
        }
        {
          depth !== 2 ?
              <text
                  x={x + 4}
                  y={y + 18}
                  fill="#fff"
                  fontSize={16}
                  fillOpacity={0.9}
              >
                {index + 1}
              </text>
              : null
        }
      </g>
  );
}

function SimpleTreemap({data}) {
  return (
      <Treemap
          width={1000}
          height={500}
          className="treemap-accounts"
          data={data}
          isAnimationActive={false}
          dataKey="size"
          // ratio={4/3}
          stroke="#fff"
          fill="#8884d8"
          content={<CustomizedContent colors={COLORS}/>}
      />
  );
}


class Statistics extends React.Component {

  constructor() {
    super();

    this.state = {
      accounts: [],
      transactionStats: [],
      blockStats: [],
      transactionValueStats: []
    };
  }

  componentDidMount() {
    this.loadAccounts();
    this.loadStats();
  }

  async loadAccounts() {

    let {accounts} = await Client.getAccounts({
      limit: 35,
      sort: '-balance',
    });

    this.setState({
      accounts: filter(accounts, account => !includes(tronAddresses, account.address))
          .slice(0, 25)
          .map(account => ({
            name: account.address,
            value: account.balance / ONE_TRX,
          }))
    });
  }


  async loadStats() {

    let {intl} = this.props;

    let {stats} = await Client.getTransferStats({
      groupby: 'timestamp',
      interval: 'hour',
    });

    let {stats: blockStats} = await Client.getBlockStats({
      info: `avg-block-size`,
    });


    let transactionTotalStats = stats.total.map(row => ({
      timestamp: intl.formatTime(row.timestamp),
      value: row.value,
    }));

    let valueStats = stats.value.map(row => ({
      timestamp: intl.formatTime(row.timestamp),
      value: row.value / ONE_TRX,
    }));

    blockStats = blockStats.map(row => ({
      timestamp: intl.formatTime(row.timestamp),
      value: row.value,
    }));

    this.setState({
      transactionStats: transactionTotalStats,
      transactionValueStats: valueStats,
      blockStats,
    });
  }

  renderTreeMap() {

    let {accounts} = this.state;

    let addresses = [
      {
        name: 'Tron Foundation',
        children: filter(accounts, account => includes(tronAddresses, account.address)),
      },
      {
        name: 'Other',
        children: filter(accounts, account => !includes(tronAddresses, account.address)),
      },
    ];

    return (
        <SimpleTreemap data={addresses}/>
    );
  }

  render() {

    let {transactionStats, transactionValueStats, blockStats, accounts} = this.state;
console.log(transactionStats);
    return (
        <main className="container header-overlap">
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">{tu("Top")} {accounts.length} {tu("addresses")}</h5>
                  <div style={{height: 300}}>
                    {
                      accounts.length === 0 ?
                          <TronLoader/> :
                          <PieReact style={{height: 300}} data={accounts}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-center">{tu("trx_transferred_past_hour")}</h5>
                  <div style={{height: 300}}>
                    {
                      transactionValueStats.length === 0 ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={transactionValueStats} keysData={['timestamp','value']}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-center">{tu("transactions_past_hour")}</h5>
                  <div style={{height: 300}}>
                    {
                      transactionStats.length === 0 ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={transactionStats} keysData={['timestamp','value']}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="text-center">{tu("average_blocksize")} ({tu("bytes")})</h5>
                  <div style={{height: 300}}>
                    {
                      blockStats.length === 0 ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={blockStats} keysData={['timestamp','value']}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <RichList/>
            </div>
          </div>
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

const styles = {
  line: {
    stroke: '#343a40',
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Statistics))
