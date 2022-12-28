import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import {loadTransactions} from "../../actions/blockchain";
import {connect} from "react-redux";
import {TronLoader} from "../common/loaders";
import {ONE_TRX} from "../../constants";
import {TRXPrice} from "../common/Price";
import {AddressLink, TransactionHashLink} from "../common/Links";
// import TimeAgo from "react-timeago";
//import moment from 'moment';
import {Link} from "react-router-dom";
import {withTimers} from "../../utils/timing";
import BlockTime from '../common/blockTime'

class RecentTransactions extends Component {

  constructor() {
    super();

    this.state = {
      blocks: [],
    };
  }

  componentDidMount() {
    this.props.loadTransactions();
    // this.props.setInterval(() => {
    //   this.props.loadTransactions();
    // }, 6000);
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
        <div className="card">
          <div className="card-header bg-dark text-white d-flex">
            <h5 className="m-0 lh-150">{tu("Transactions")}</h5>
            <Link to="/blockchain/transactions" className="ml-auto text-white btn btn-outline-secondary btn-sm">
              {tu("view_all")}
            </Link>
          </div>
          <ul className="list-group list-group-flush scrollbar-dark" style={styles.list}>
            {
              transactions.map((transaction, i) => (
                  <li key={transaction.hash} className="list-group-item p-2">
                    <div className="media">
                      <div className="media-body mb-0 d-flex">
                        <div className="text-left">
                          <TransactionHashLink
                              hash={transaction.hash}>{transaction.hash}</TransactionHashLink>
                          <br/>
                          <AddressLink wrapClass="d-inline-block" address={transaction.transferFromAddress}>
                            {transaction.transferFromAddress}
                          </AddressLink>
                          <i className="fas fa-arrow-right mr-1 ml-1"/>
                          <AddressLink wrapClass="d-inline-block" address={transaction.transferToAddress}>
                            {transaction.transferToAddress}
                          </AddressLink>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-muted">
                          <BlockTime time={transaction.timestamp}></BlockTime>

                            {/* <TimeAgo date={transaction.timestamp} title={moment(transaction.timestamp).format("MMM-DD-YYYY HH:mm:ss A")}/> */}
                          </div>
                          <div>
                            <i className="fas fa-exchange-alt mr-1"/>
                            <TRXPrice amount={transaction.amount / ONE_TRX}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
              ))
            }
          </ul>
        </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    transactions: state.blockchain.transactions,
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
  loadTransactions
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentTransactions)))

const styles = {
  list: {
    overflowY: 'scroll',
    overflowX: 'none',
    height: 500,
  }
};
