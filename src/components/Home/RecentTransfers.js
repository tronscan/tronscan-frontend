import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import {loadBlocks, loadTransactions} from "../../actions/blockchain";
import {connect} from "react-redux";
import {TronLoader} from "../common/loaders";
import {ONE_TRX} from "../../constants";
import {TRXPrice} from "../common/Price";
import {AddressLink, TransactionHashLink} from "../common/Links";
import TimeAgo from "react-timeago";
import {Link} from "react-router-dom";
import {withTimers} from "../utils/timing";
import {Client} from "../../services/api";


class RecentTransfers extends Component {

  constructor() {
    super();

    this.state = {
      transfers: [],
    };
  }

  componentDidMount() {
    this.load();
    this.props.setInterval(() => {
      this.load();
    }, 6000);
  }

  load = async () => {
    let {transfers} = await Client.getTransfers({
      sort: '-timestamp',
      limit: 10,
      count: null,
    });

    this.setState({ transfers });
  };

  render() {

    let {transfers} = this.state;

    if (transfers === null) {
      return (
        <div className="text-center d-flex justify-content-center">
          <TronLoader/>
        </div>
      );
    }

    if (transfers.length === 0) {
      return (
        <div className="text-center d-flex justify-content-center">
          <TronLoader/>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-header bg-dark text-white d-flex">
          <h5 className="m-0 lh-150">{tu("transfers")}</h5>
          <Link to="/blockchain/transfers" className="ml-auto text-white btn btn-outline-secondary btn-sm">
            {tu("view_all")}
          </Link>
        </div>
        <ul className="list-group list-group-flush scrollbar-dark" style={styles.list}>
        {
          transfers.map((transfer, i) => (
            <li key={transfer.transactionHash} className="list-group-item p-2">
              <div className="media">
                <div className="media-body mb-0 d-flex">
                  <div className="text-left">
                    <TransactionHashLink hash={transfer.transactionHash}>{transfer.transactionHash.substr(0, 20)}...</TransactionHashLink><br/>
                    <AddressLink address={transfer.transferFromAddress}  truncate={false}>
                      {transfer.transferFromAddress.substr(0, 12)}...
                    </AddressLink>
                    <i className="fas fa-arrow-right mr-1 ml-1"/>
                    <AddressLink address={transfer.transferToAddress}  truncate={false}>
                      {transfer.transferToAddress.substr(0, 12)}...
                    </AddressLink>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-muted">
                      <TimeAgo date={transfer.timestamp} />
                    </div>
                    <div>
                      <i className="fas fa-exchange-alt mr-1"/>
                      <TRXPrice amount={transfer.amount / ONE_TRX} />
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
    activeLanguage: state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
  loadTransactions
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(RecentTransfers)))

const styles = {
  list: {
    overflowY: 'scroll',
    overflowX: 'none',
    height: 500,
  }
};
