/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import {random, range} from "lodash";
import TimeAgo from "react-timeago";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {ONE_TRX} from "../../constants";
import {getQueryParams} from "../../utils/url";
import Paging from "../common/Paging";
import {Sticky, StickyContainer} from "react-sticky";
import {TRXPrice} from "../common/Price";
import {Truncate} from "../common/text";

class Transfers extends React.Component {

  constructor() {
    super();

    this.state = {
      transfers: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.load);
  }
  onChange = (page,pageSize) => {
    this.load(page,pageSize);
  };
  load = async (page = 1, pageSize=40) => {

    let {location} = this.props;

    this.setState({ loading: true });

    let searchParams = {};

    for (let [key, value] of Object.entries(getQueryParams(location))) {
      switch (key) {
        case "address":
        case "block":
          searchParams[key] = value;
          break;
      }
    }

    let {transfers, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page-1) * pageSize,
      ...searchParams,
    });

    this.setState({
      transfers,
      loading: false,
      total
    });
  };

  render() {

    let {transfers, total, loading} = this.state;
    let {match} = this.props;

    return (
      <main className="container header-overlap pb-3">
        <div className="row">
          <div className="col-md-12">
            <StickyContainer>
              <div className="card">
                {
                  <Fragment>
                    <Sticky>
                      {
                        ({style}) => (
                          <div style={{ zIndex: 100, ...style }} className="card-body bg-white py-3 border-bottom">
                            <Paging onChange={this.onChange} loading={loading} url={match.url} total={total} />
                          </div>
                        )
                      }
                    </Sticky>
                    <table className="table table-hover table-striped m-0 transactions-table">
                      <thead className="thead-dark">
                        <tr>
                          <th style={{ width: 130 }}>#</th>
                          <th className="d-none d-md-table-cell" style={{ width: 100 }}>{tu("block")}</th>
                          <th className="d-none d-lg-table-cell" style={{ width: 125 }}>{tu("created")}</th>
                          <th className="d-none d-md-table-cell">{tu("from")}</th>
                          <th className="d-none d-sm-table-cell">{tu("to")}</th>
                          <th className="">{tu("value")}</th>
                        </tr>
                      </thead>
                      <tbody>
                      {
                        transfers.map((trx, index) => (
                          <tr key={trx.transactionHash}>
                            <th>
                              <Truncate>
                                <TransactionHashLink hash={trx.transactionHash}>{trx.transactionHash}</TransactionHashLink>
                              </Truncate>
                            </th>
                            <td className="d-none d-md-table-cell">
                              <BlockNumberLink number={trx.block}/>
                            </td>
                            <td className="text-nowrap d-none d-lg-table-cell">
                              <TimeAgo date={trx.timestamp} />
                            </td>
                            <td className="d-none d-md-table-cell">
                              <AddressLink address={trx.transferFromAddress} />
                            </td>
                            <td className="d-none d-sm-table-cell">
                              <AddressLink address={trx.transferToAddress} />
                            </td>
                            <td className="text-nowrap">
                              {
                                trx.tokenName.toUpperCase() === 'TRX' ?
                                  <Fragment>
                                    <TRXPrice amount={trx.amount / ONE_TRX}/>
                                  </Fragment> :
                                  <Fragment>
                                    <FormattedNumber value={trx.amount}/> {trx.tokenName}
                                  </Fragment>
                              }
                            </td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                  </Fragment>
                }
              </div>
            </StickyContainer>
          </div>
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transfers);
