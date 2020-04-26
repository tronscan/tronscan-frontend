import React, { Component } from "react";
import { tu } from "../../utils/i18n";
import { injectIntl } from "react-intl";
import { loadTransactions } from "../../actions/blockchain";
import { connect } from "react-redux";
//import { TronLoader } from "../common/loaders";
import { Truncate } from "../common/text";
//import { TRXPrice } from "../common/Price";
import { AddressLink, TransactionHashLink } from "../common/Links";
// import TimeAgo from "react-timeago";
//import moment from "moment";
import { Link } from "react-router-dom";
import { withTimers } from "../../utils/timing";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NameWithId } from "../common/names";
import _ from "lodash";
import isMobile from "../../utils/isMobile";
import BlockTime from "../common/blockTime";

class RecentTransfers extends Component {
  constructor() {
    super();

    this.state = {
      transfers: [],
      beforeRender: ["", "", "", "", "", ""]
    };
  }

  componentDidMount() {
    this.props.loadTransactions();
    this.props.setInterval(() => {
      this.props.loadTransactions();
    }, 3000);
  }

  render() {
    let { transactions, isRightText, blocks } = this.props;
    // if (transactions === null) {
    //   return (
    //       <div className="text-center d-flex justify-content-center">
    //         <TronLoader/>
    //       </div>
    //   );
    // }

    // if (transactions.length === 0) {
    //   return (
    //       <div className="text-center d-flex justify-content-center">
    //         <TronLoader/>
    //       </div>
    //   );
    // }

    return (
      <div className="card" style={styles.card}>
        <div className="card-header bg-tron-light d-flex">
          <i className="fa fa-server mr-3 fa_width_20 color-grey-100"></i>
          <h5 className="m-0 lh-175 color-grey-100">{tu("transfers")}</h5>
          <Link
            to="/blockchain/transfers"
            className="ml-auto btn btn-sm btn-default"
            style={{ borderRadius: "0.15rem" }}
          >
            {tu("view_all")}
          </Link>
        </div>
        {isMobile ? (
          <PerfectScrollbar>
            <ul className="list-group list-group-flush" style={styles.list}>
              {transactions.length != 0
                ? transactions.map(
                    (transfer, i) =>
                      transfer && (
                        <li
                          key={transfer.transactionHash}
                          className="list-group-item overflow-h mobile-block"
                        >
                          <div className="media">
                            <div className=" mb-0 w-100 d-flex ">
                              <div className="text-left pt-1 w-100">
                                <div className="d-flex justify-content-between">
                                  <div className="pt-1 d-flex flex-1">
                                    <i className="fa fa-bars mr-2 mt-1 fa_width color-tron-100"></i>
                                    {/* <TransactionHashLink
                                      hash={transfer.transactionHash}>{transfer.transactionHash.substr(0, 13)}...</TransactionHashLink> */}
                                    <div className="flex-1">
                                      <Truncate>
                                        <TransactionHashLink
                                          hash={transfer.transactionHash}
                                        >
                                          {transfer.transactionHash}
                                        </TransactionHashLink>
                                      </Truncate>
                                    </div>
                                  </div>
                                  <div className="text-muted color-grey-300 small pt-2 pl-3">
                                    <BlockTime
                                      time={transfer.timestamp}
                                    ></BlockTime>
                                  </div>
                                </div>

                                <div
                                  className={
                                    (isRightText
                                      ? "flex-row-reverse justify-content-end"
                                      : "") + " d-flex align-items-center"
                                  }
                                >
                                  <span className="color-grey-300 mr-2">
                                    {tu("from")}
                                  </span>
                                  <AddressLink
                                    className="color-tron-100 small"
                                    wrapClassName="d-inline-block w-50"
                                    address={transfer.transferFromAddress}
                                  >
                                    {transfer.transferToAddress}
                                  </AddressLink>
                                </div>
                                <div
                                  className={
                                    (isRightText
                                      ? "flex-row-reverse justify-content-end"
                                      : "") + " d-flex align-items-center"
                                  }
                                >
                                  <span className="color-grey-300 mr-2">
                                    {tu("to")}
                                  </span>
                                  <AddressLink
                                    className="color-tron-100 small"
                                    wrapClassName="d-inline-block w-50"
                                    address={transfer.transferToAddress}
                                  >
                                    {transfer.transferToAddress}
                                  </AddressLink>
                                </div>
                                <div className="color-grey-200 pb-2">
                                  <span className="color-grey-300 mr-2 d-inline-block">
                                    {tu("value")}
                                  </span>
                                  <NameWithId
                                    value={transfer}
                                    type="abbr"
                                    page="home"
                                    totoken
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                  )
                : this.state.beforeRender.map((transfer, i) => (
                    <li
                      key={i}
                      className="list-group-item overflow-h mobile-block"
                    >
                      <div className="media">
                        <div className=" mb-0 w-100 d-flex ">
                          <div className="text-left pt-1 w-100">
                            <div className="d-flex justify-content-between">
                              <div className="pt-1 d-flex flex-1">
                                <i className="fa fa-bars mr-2 mt-1 fa_width color-tron-100"></i>
                                <div className="flex-1">--</div>
                              </div>
                              <div className="text-muted color-grey-300 small pt-2 pl-3">
                                <BlockTime
                                  time={transfer.timestamp}
                                ></BlockTime>

                                {/* <TimeAgo date={transfer.timestamp} title={moment(transfer.timestamp).format("MMM-DD-YYYY HH:mm:ss A")}/> */}
                              </div>
                            </div>

                            <div
                              className={
                                (isRightText
                                  ? "flex-row-reverse justify-content-end"
                                  : "") + " d-flex align-items-center"
                              }
                            >
                              <span className="color-grey-300 mr-2">
                                {tu("from")}
                              </span>
                              <AddressLink
                                className="color-tron-100 small"
                                wrapClassName="d-inline-block w-50"
                                address=""
                              >
                                --
                              </AddressLink>
                            </div>
                            <div
                              className={
                                (isRightText
                                  ? "flex-row-reverse justify-content-end"
                                  : "") + " d-flex align-items-center"
                              }
                            >
                              <span className="color-grey-300 mr-2">
                                {tu("to")}
                              </span>
                              <AddressLink
                                className="color-tron-100 small"
                                wrapClassName="d-inline-block w-50"
                                address=""
                              >
                                --
                              </AddressLink>
                            </div>
                            <div className="color-grey-200 pb-2">
                              <span className="color-grey-300 mr-2 d-inline-block">
                                {tu("value")}
                              </span>
                              --
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          </PerfectScrollbar>
        ) : (
          <PerfectScrollbar>
            <ul className="list-group list-group-flush" style={styles.list}>
              {// && transactions.length != 0 && blocks.length != 0
              transactions.length != 0
                ? transactions.map(
                    (transfer, i) =>
                      transfer && (
                        <li
                          key={transfer.transactionHash}
                          className="list-group-item overflow-h"
                          style={{ minHeight: "100px" }}
                        >
                          <div className="media">
                            <div className="media-body mb-0">
                              <div className="text-left pt-1 d-flex justify-content-between">
                                <div
                                  className="pt-1 d-flex pr-2 color-transfers-hash"
                                  style={{ flex: 1, maxWidth: "309px" }}
                                >
                                  <i className="fa fa-bars mr-2 mt-1 fa_width color-tron-100"></i>
                                  <Truncate>
                                    <TransactionHashLink
                                      hash={transfer.transactionHash}
                                    >
                                      {transfer.transactionHash}
                                    </TransactionHashLink>
                                  </Truncate>
                                </div>
                                <div
                                  className="color-grey-200 pt-1 "
                                  style={{ fontSize: "14px" }}
                                >
                                  {/* <TRXPrice amount={transfer.amount} name={transfer.tokenName} source='transfers'/> */}
                                  <NameWithId
                                    value={transfer}
                                    type="abbr"
                                    page="home"
                                    totoken
                                  />
                                </div>
                              </div>
                              <div className="d-flex pt-2 list-item-word">
                                <div
                                  className={
                                    (isRightText
                                      ? "flex-row-reverse justify-content-end"
                                      : "") + " d-flex pt-2 text-left"
                                  }
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  <span className="color-grey-300 mr-2">
                                    {tu("from")}
                                  </span>

                                  <AddressLink
                                    wrapClassName="d-inline-block mr-2 address_max_width"
                                    className="color-tron-100"
                                    address={transfer.transferFromAddress}
                                    truncate={false}
                                  >
                                    {transfer.transferFromAddress}
                                  </AddressLink>

                                  <span className="color-grey-300 mr-2">
                                    {tu("to")}
                                  </span>
                                  <AddressLink
                                    wrapClassName="d-inline-block mr-2 address_max_width"
                                    className="color-tron-100"
                                    address={transfer.transferToAddress}
                                    truncate={false}
                                  >
                                    {transfer.transferToAddress}
                                  </AddressLink>
                                </div>
                                <div
                                  className="text-muted text-right color-grey-300 small"
                                  style={styles.nowrap}
                                >
                                  <BlockTime
                                    time={transfer.timestamp}
                                  ></BlockTime>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                  )
                : this.state.beforeRender.map((transfer, i) => (
                    <li
                      key={i}
                      className="list-group-item overflow-h"
                      style={{ minHeight: "100px" }}
                    >
                      <div className="media">
                        <div className="media-body mb-0">
                          <div className="text-left pt-1 d-flex justify-content-between">
                            <div
                              className="pt-1 d-flex pr-2 color-transfers-hash"
                              style={{ flex: 1, maxWidth: "309px" }}
                            >
                              <i className="fa fa-bars mr-2 mt-1 fa_width color-tron-100"></i>
                              --
                            </div>
                            <div
                              className="color-grey-200 pt-1 "
                              style={{ fontSize: "14px" }}
                            >
                              --
                            </div>
                          </div>
                          <div className="d-flex pt-2 list-item-word">
                            <div
                              className={
                                (isRightText
                                  ? "flex-row-reverse justify-content-end"
                                  : "") + " d-flex pt-2 text-left"
                              }
                              style={{ fontSize: "0.8rem" }}
                            >
                              <span className="color-grey-300 mr-2">
                                {tu("from")}
                              </span>

                              <AddressLink
                                wrapClassName="d-inline-block mr-2 address_max_width"
                                className="color-tron-100"
                                address=""
                                truncate={false}
                              >
                                --
                              </AddressLink>

                              <span className="color-grey-300 mr-2">
                                {tu("to")}
                              </span>
                              <AddressLink
                                wrapClassName="d-inline-block mr-2 address_max_width"
                                className="color-tron-100"
                                address=""
                                truncate={false}
                              >
                                --
                              </AddressLink>
                            </div>
                            <div
                              className="text-muted text-right color-grey-300 small"
                              style={styles.nowrap}
                            >
                              --
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
            </ul>
          </PerfectScrollbar>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    transactions: state.blockchain.transactions,
    activeLanguage: state.app.activeLanguage,
    isRightText: state.app.isRightText
  };
}

const mapDispatchToProps = {
  loadTransactions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimers(injectIntl(RecentTransfers)));

const styles = {
  list: {
    overflowX: "none",
    height: 594
  },
  card: {
    border: "none",
    borderRadius: 0
  },
  nowrap: {
    flex: 1,
    whiteSpace: "nowrap"
  }
};
