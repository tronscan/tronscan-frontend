/* eslint-disable no-undef */
import React from "react";
import { loadTokens } from "../../../actions/tokens";
import { connect } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import { Client } from "../../../services/api";
import { tu, tv } from "../../../utils/i18n";
// import TimeAgoI18N from "../../common/TimeAgoI18N";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  FormattedMessage,
  injectIntl
} from "react-intl";
import { AddressLink, BlockNumberLink } from "../../common/Links";
import { CopyText } from "../../common/Copy";
import { QuestionMark } from "../../common/QuestionMark";
import { TronLoader } from "../../common/loaders";
import Transactions from "../../common/Transactions";
import { Truncate } from "../../common/text";
import Transfers from "../../common/Transfers";
import { Alert } from "reactstrap";
let updateTime = null;
@injectIntl
class Block extends React.Component {
  constructor({ match }) {
    super();

    this.state = {
      loading: true,
      notFound: false,
      block: {
        number: -1,
        transfers: []
      },
      tabs: {
        transactions: {
          id: "transactions",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <TronLoader />
        },
        transfers: {
          id: "transfers",
          icon: "fa fa-handshake",
          path: "/transfers",
          label: <span>{tu("transfers")}</span>,
          cmp: () => <TronLoader />
        }
      },
      confirmedNum: 0
    };
  }

  componentDidMount() {
    let { match } = this.props;

    this.loadBlock(match.params.id);
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadBlock(match.params.id);
    }
  }

  componentWillUnmount() {
    clearInterval(updateTime);
  }

  async loadBlock(id) {
    this.setState({ loading: true, block: { number: id } });

    let block;

    if (!isNaN(id)) {
      block = await Client.getBlockByNumber(id);
    } else {
      block = await Client.getBlockByHash(id);
    }

    if (!block) {
      this.setState({
        notFound: true
      });
      return;
    }
    // blcok detail confirm num
    if (block.number) {
      let confirmNumObj = await Client.getBlockByNumber(block.number);
      let confirmedNum = confirmNumObj && confirmNumObj.confirmations;
      this.setState({
        confirmedNum
      });

      if (confirmedNum < 19) {
        updateTime = setInterval(async () => {
          let confirmNumObj = await Client.getBlockByNumber(block.number);
          let confirmedNum = confirmNumObj && confirmNumObj.confirmations;
          this.setState({
            confirmedNum
          });
          if (confirmedNum > 18) {
            block = await Client.getBlockByNumber(id);
            this.setState({
              block
            });
            clearInterval(updateTime);
          }
        }, 3000);
      } else {
        clearInterval(updateTime);
      }
    }

    this.setState({
      loading: false,
      block,
      totalTransactions: block.nrOfTrx,
      tabs: {
        transactions: {
          id: "transactions",
          icon: "fa fa-handshake",
          path: "",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <Transactions filter={{ block: block.number }} isBlock />
        },
        transfers: {
          id: "transfers",
          icon: "fa fa-exchange-alt",
          path: "/transfers",
          label: <span>{tu("transfers")}</span>,
          cmp: () => <Transfers filter={{ block: block.number }} />
        }
      }
    });
  }

  render() {
    let {
      block,
      tabs,
      loading,
      totalTransactions,
      notFound,
      confirmedNum
    } = this.state;
    let { activeLanguage, match, intl } = this.props;
    if (notFound) {
      return (
        <main className="container header-overlap">
          <Alert color="warning" className="text-center">
            {tu("block_not_found")}
          </Alert>
        </main>
      );
    }

    return (
      <main className="container header-overlap">
        {loading ? (
          <div className="card">
            <TronLoader>
              {tu("loading_block")} {block.number}
            </TronLoader>
          </div>
        ) : (
          <div className="row">
            <div className="col-md-12 ">
              <div className="card list-style-header">
                <div className="card-body">
                  <h5 className="card-title m-0">
                    <i className="fa fa-cube mr-2" />
                    {tu("block")} #{block.number}
                  </h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover m-0">
                    <tbody>
                      <tr>
                        <th>
                          <span>{tu("status")}</span>{" "}
                          <QuestionMark
                            placement="right"
                            text={intl.formatMessage({
                              id: "full_node_version_confirmed_tips"
                            })}
                          ></QuestionMark>
                          :
                        </th>
                        <td>
                          {block.confirmed ? (
                            <div>
                              <span className="badge badge-success text-uppercase">
                                {tu("full_node_version_confirmed")}{" "}
                              </span>
                              {confirmedNum > 200 ? (
                                <span className="block-status-tag">
                                  {tu("block_detail_confirmed_over_show")}
                                </span>
                              ) : (
                                <span className="block-status-tag">
                                  <FormattedMessage
                                    id="block_detail_confirmed_show"
                                    values={{ num: confirmedNum }}
                                  ></FormattedMessage>
                                </span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="badge badge-confirmed text-uppercase">
                                {tu("full_node_version_unconfirmed")}
                              </span>
                              {confirmedNum > 200 ? (
                                <span className="block-status-tag">
                                  {tu("block_detail_confirmed_over_show")}
                                </span>
                              ) : (
                                <span className="block-status-tag">
                                  <FormattedMessage
                                    id="block_detail_confirmed_show"
                                    values={{ num: confirmedNum }}
                                  ></FormattedMessage>
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("hash")}:</th>
                        <td>
                          <Truncate>
                            {block.hash}{" "}
                            <CopyText text={block.hash} className="ml-1" />
                          </Truncate>
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("height")}:</th>
                        <td>{block.number}</td>
                      </tr>
                      {block.timestamp !== 0 && (
                        <tr>
                          <th>{tu("time")}:</th>
                          <td>
                            <FormattedDate value={block.timestamp} />
                            &nbsp;
                            <FormattedTime
                              value={block.timestamp}
                              hour="numeric"
                              minute="numeric"
                              second="numeric"
                              hour12={false}
                            />
                            &nbsp;
                            {/*{(<TimeAgoI18N date={block.timestamp} activeLanguage={activeLanguage}/>)}*/}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <th>{tu("transactions")}:</th>
                        <td>{totalTransactions} Txns</td>
                      </tr>
                      <tr>
                        <th>{tu("parenthash")}:</th>
                        <td>
                          <Truncate>
                            <BlockNumberLink number={block.number - 1}>
                              {block.parentHash}
                            </BlockNumberLink>
                            <CopyText
                              text={block.parentHash}
                              className="ml-1"
                            />
                          </Truncate>
                        </td>
                      </tr>
                      {block.witnessAddress !== "" && (
                        <tr>
                          <th>{tu("produced_by")}:</th>
                          <td>
                            <Truncate>
                              <AddressLink
                                address={block.witnessAddress}
                                includeCopy={true}
                              >
                                {block.witnessName}
                              </AddressLink>
                            </Truncate>
                          </td>
                        </tr>
                      )}

                      <tr>
                        <th>{tu("size")}:</th>
                        <td>
                          <FormattedNumber value={block.size} />
                          &nbsp;
                          {tu("bytes")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card mt-3 list-style-body">
                <div className="card-header list-style-body__header">
                  <ul className="nav nav-tabs card-header-tabs">
                    {Object.values(tabs).map(tab => (
                      <li key={tab.id} className="nav-item">
                        <NavLink
                          exact
                          to={match.url + tab.path}
                          className="nav-link text-dark"
                        >
                          {tab.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-body p-0 list-style-body__body">
                  <Switch>
                    {Object.values(tabs).map(tab => (
                      <Route
                        key={tab.id}
                        exact
                        path={match.url + tab.path}
                        render={props => <tab.cmp block={block} />}
                      />
                    ))}
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }
}

function mapStateToProps(state) {
  let block = {};

  return {
    block,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  loadTokens
};

export default connect(mapStateToProps, mapDispatchToProps)(Block);
