import React from "react";

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
import LineReactTx from "../../common/LineChartTx";

class Statistics extends React.Component {

  constructor() {
    super();

    this.state = {
      accounts: null,
      transactionStats: null,
      blockStats: null,
      transactionValueStats: null,
      txOverviewStats:null
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

  async loadTxOverviewStats() {
    let {txOverviewStats} = await Client.getTxOverviewStats();
    this.setState({
      txOverviewStats:txOverviewStats
    });
  }

  render() {

    let {txOverviewStats, transactionStats, transactionValueStats, blockStats, accounts} = this.state;
    return (
        <main className="container header-overlap">
          <div className="row">
            <div className="col-md-12 mt-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">{tu("TRX_transaction_chart")}</h5>
                  <div style={{height: 300}}>
                    {
                      txOverviewStats === null ?
                          <TronLoader/> :
                          <LineReactTx style={{height: 300}} data={txOverviewStats}/>
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
                  <h5 className="card-title text-center">{tu("Top")} {accounts !== null ? accounts.length : 0} {tu("addresses")}</h5>
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
                  <h5 className="text-center">{tu("trx_transferred_past_hour")}</h5>
                  <div style={{height: 300}}>
                    {
                      transactionValueStats === null ?
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
                      transactionStats === null ?
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
                      blockStats === null ?
                          <TronLoader/> :
                          <LineReact style={{height: 300}} data={blockStats} keysData={['timestamp','value']}/>
                    }
                  </div>
                </div>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Statistics))
