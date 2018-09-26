import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import {loadTransactions} from "../../actions/blockchain";
import {connect} from "react-redux";
import {TronLoader} from "../common/loaders";
import {TRXPrice} from "../common/Price";
import {AddressLink, TransactionHashLink} from "../common/Links";
import TimeAgo from "react-timeago";
import {Link} from "react-router-dom";
import {withTimers} from "../../utils/timing";
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'

class RecentTransfers extends Component {

  constructor() {
    super();

    this.state = {
      transfers: [],
    };
  }

  componentDidMount() {
    this.props.loadTransactions();
    this.props.setInterval(() => {
      this.props.loadTransactions();
    }, 6000);
  }

  render() {
    let {transactions} = this.props;
    if (transactions === null) {
      return (
          <div className="text-center d-flex justify-content-center">
            <TronLoader/>
          </div>
      );
    }

    if (transactions.length === 0) {
      return (
          <div className="text-center d-flex justify-content-center">
            <TronLoader/>
          </div>
      );
    }

    return (
        <div className="card" style={styles.card}>
          <div className="card-header bg-tron-light d-flex">
            <i className="fa fa-server mr-3 fa_width_20 color-grey-100"></i>
            <h5 className="m-0 lh-175 color-grey-100">{tu("transfers")}</h5>
            <Link to="/blockchain/transfers"
                  className="ml-auto btn btn-sm btn-default"
                  style={{borderRadius: '0.15rem'}}>
              {tu("view_all")}
            </Link>
          </div>
          <PerfectScrollbar>
            <ul className="list-group list-group-flush" style={styles.list}>

              {
                transactions.map((transfer, i) => (
                    <li key={transfer.transactionHash} className="list-group-item overflow-h">
                      <div className="media">
                        <div className="media-body mb-0 d-flex">
                          <div className="text-left pt-1">
                            <div className="pt-1">
                              <i className="fa fa-bars mr-2 mt-1 fa_width color-tron-100"></i>
                              <TransactionHashLink
                                  hash={transfer.transactionHash}>{transfer.transactionHash.substr(0, 30)}...</TransactionHashLink>
                            </div>
                            <br/>

                            <span className="color-grey-300 mr-2">{tu("from")}</span>
                            <AddressLink wrapClassName="d-inline-block mr-2" className="color-tron-100"
                                         address={transfer.transferFromAddress} truncate={false}>
                              {transfer.transferFromAddress.substr(0, 15)}...
                            </AddressLink>
                            <span className="color-grey-300 mr-2">{tu("to")}</span>
                            <AddressLink wrapClassName="d-inline-block mr-2" className="color-tron-100"
                                         address={transfer.transferToAddress} truncate={false}>
                              {transfer.transferToAddress.substr(0, 15)}...
                            </AddressLink><br/>
                          </div>
                          <div className="ml-auto text-right d-flex flex-column pt-2 list-item-word"
                               style={styles.nowrap}>
                            <div className="color-grey-200" style={{flex: 1}}>
                              <TRXPrice amount={transfer.amount} name={transfer.tokenName} source='transfers'/>
                            </div>
                            <div className="text-muted color-grey-300 small" style={styles.nowrap}>
                              <TimeAgo date={transfer.timestamp}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                ))
              }

            </ul>
          </PerfectScrollbar>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    transactions: state.blockchain.transactions,
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
  loadTransactions
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentTransfers)))

const styles = {
  list: {
    overflowX: 'none',
    height: 594,
  },
  card: {
    border: 'none',
    borderRadius: 0
  },
  nowrap: {
    flex: 1,
    whiteSpace: 'nowrap'
  }
};
