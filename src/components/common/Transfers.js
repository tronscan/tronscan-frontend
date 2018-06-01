import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {AddressLink, TransactionHashLink} from "./Links";
import {TRXPrice} from "./Price";
import {ONE_TRX} from "../../constants";
import {tu} from "../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "./loaders";
import {Truncate} from "./text";
import {withTimers} from "../utils/timing";
import {FormattedNumber} from "react-intl";

class Transfers extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transfers: [],
      page: 0,
      total: 0,
      pageSize: 25,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false
    };
  }

  componentDidMount() {
    this.load();

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(), this.state.autoRefresh);
    }
  }

  onChange = ({page}) => {
    this.load(page);
  };

  load = async (page = 0) => {

    let {filter} = this.props;
    let {pageSize, showTotal} = this.state;

    this.setState({ loading: true });

    let {transfers, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: page * pageSize,
      count: showTotal ? true : null,
      ...filter,
    });

    this.setState({
      page,
      transfers,
      total,
      loading: false,
    });
  };

  render() {

    let {transfers, page, total, pageSize, loading, emptyState: EmptyState = null} = this.state;
    let {theadClass = "thead-dark"} = this.props;

    if (!loading && transfers.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center">No Transfers</div>
        );
      }
      return <EmptyState />;
    }

    return (
      <StickyContainer>
        {
          total > pageSize &&
            <Sticky>
              {
                ({style}) => (
                  <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                    <Paging onChange={this.onChange} total={total} loading={loading} pageSize={pageSize} page={page}/>
                  </div>
                )
              }
            </Sticky>
        }
        <table className="table table-hover m-0 border-top-0">
          <thead className={theadClass}>
            <tr>
              <th className="d-none d-lg-table-cell" style={{width: 125 }}>{tu("age")}</th>
              <th className="d-none d-lg-table-cell" style={{width: 125 }}>{tu("hash")}</th>
              <th className="d-none d-md-table-cell">{tu("from")}</th>
              <th>{tu("to")}</th>
              <th className="text-right" style={{width: 125 }}>{tu("amount")}</th>
            </tr>
          </thead>
          <tbody>
          {
            transfers.map((transfer) => (
              <tr key={transfer.transactionHash}>
                <td className="text-nowrap d-none d-lg-table-cell">
                  <TimeAgo date={transfer.timestamp} />
                </td>
                <td className="d-none d-lg-table-cell">
                  <Truncate>
                    <TransactionHashLink hash={transfer.transactionHash}>
                      {transfer.transactionHash}
                    </TransactionHashLink>
                  </Truncate>
                </td>
                <td className="d-none d-md-table-cell">
                  <AddressLink address={transfer.transferFromAddress} />
                </td>
                <td>
                  <AddressLink address={transfer.transferToAddress} />
                </td>
                <td className="text-nowrap text-right">
                  {
                    transfer.tokenName === "TRX" ?
                      <TRXPrice amount={transfer.amount / ONE_TRX} /> :
                      <span><FormattedNumber value={transfer.amount} /> {transfer.tokenName}</span>
                  }
                </td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </StickyContainer>
    )
  }
}

export default withTimers(Transfers);
