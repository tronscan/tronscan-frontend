import React from "react";

import {Link} from "react-router-dom"
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

import {LineReactAdd, LineReactTx} from "../../common/LineCharts";

class Statistics extends React.Component {

  constructor() {
    super();

    this.state = {
      accounts: null,
      transactionStats: null,
      blockStats: null,
      transactionValueStats: null,
      txOverviewStats: null,
      addressesStats: null,
    };
  }

  componentDidMount() {
    this.loadAccounts();
    this.loadStats();
    this.loadTxOverviewStats();
  }

  async loadAccounts() {

    let {accounts} = await Client.getAccounts({
      limit: 35,
      sort: '-balance',
    });

    this.setState({
      accounts: filter(accounts, account => !includes(tronAddresses, account.address))
          .slice(0, 10)
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
      timestamp: row.timestamp,
      value: row.value,
    }));

    let valueStats = stats.value.map(row => ({
      timestamp: row.timestamp,
      value: row.value / ONE_TRX,
    }));

    blockStats = blockStats.map(row => ({
      timestamp: row.timestamp,
      value: row.value,
    }));

    this.setState({
      transactionStats: transactionTotalStats,
      transactionValueStats: valueStats,
      blockStats,
    });
  }

  async loadTxOverviewStats() {
    let {txOverviewStats} = await Client.getTxOverviewStats();
    let temp = [];
    let addressesTemp = [];

    for (let txs in txOverviewStats) {
      let tx = parseInt(txs);
      if (tx === 0) {
        temp.push(txOverviewStats[tx]);
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].newAddressSeen,
          increment: txOverviewStats[tx].newAddressSeen
        });
      }
      else {
        temp.push({
          date: txOverviewStats[tx].date,
          totalTransaction: (txOverviewStats[tx].totalTransaction - txOverviewStats[tx - 1].totalTransaction),
          avgBlockTime: txOverviewStats[tx].avgBlockTime,
          avgBlockSize: txOverviewStats[tx].avgBlockSize,
          totalBlockCount: (txOverviewStats[tx].totalBlockCount - txOverviewStats[tx - 1].totalBlockCount),
          newAddressSeen: txOverviewStats[tx].newAddressSeen
        });
        addressesTemp.push({
          date: txOverviewStats[tx].date,
          total: txOverviewStats[tx].newAddressSeen + addressesTemp[tx - 1].total,
          increment: txOverviewStats[tx].newAddressSeen
        });
      }
    }

    this.setState({
      txOverviewStats: temp,
      addressesStats: addressesTemp
    });
  }

  render() {

    let {txOverviewStats, addressesStats, transactionStats, transactionValueStats, blockStats, accounts} = this.state;
    let {intl} = this.props;
    return (
        <main className="container header-overlap">
          <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 350}}>
                    {
                      txOverviewStats === null ?
                          <TronLoader/> :
                          <LineReactTx style={{height: 350}} data={txOverviewStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 350}}>
                    {
                      addressesStats === null ?
                          <TronLoader/> :
                          <LineReactAdd style={{height: 350}} data={addressesStats} intl={intl}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {
            /*
            <div className="row">
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 300}}>
                    {
                      accounts === null ?
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

                  <div style={{height: 300}}>
                    {
                      transactionValueStats === null ?
                          <TronLoader/> :
                          <LineReact message={{id: 'trx_transferred_past_hour', href: 'transactionValueStats'}}
                                     style={{height: 300}} data={transactionValueStats}
                                     keysData={['timestamp', 'value']} format={{timestamp: true}}/>
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

                  <div style={{height: 300}}>
                    {
                      transactionStats === null ?
                          <TronLoader/> :
                          <LineReact message={{id: 'transactions_past_hour', href: 'transactionStats'}}
                                     style={{height: 300}} data={transactionStats}
                                     keysData={['timestamp', 'value']}
                                     format={{timestamp: true}}/>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-3">
              <div className="card">
                <div className="card-body">

                  <div style={{height: 300}}>
                    {
                      blockStats === null ?
                          <TronLoader/> :
                          <LineReact message={{id: 'average_blocksize', href: 'blockStats'}} style={{height: 300}}
                                     data={blockStats}
                                     keysData={['timestamp', 'value']}
                                     format={{timestamp: true}}/>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          */
          }
        </main>
    );
  }
}


function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Statistics))
