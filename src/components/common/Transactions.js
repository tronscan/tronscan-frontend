import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {TransactionHashLink} from "./Links";
import {tu} from "../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "./loaders";
import {Truncate} from "./text";
import {ContractTypes} from "../../utils/protocol";

export default class Transactions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transactions: [],
      total: 0,
      emptyState: props.EmptyState || (
        <TronLoader>
          Loading Transactions
        </TronLoader>
      )
    };
  }

  componentDidMount() {
    this.loadTransactions();
  }

  onChange = (page, pageSize) => {
    this.loadTransactions(page, pageSize);
  };

  loadTransactions = async (page = 1, pageSize = 40) => {

    let {filter} = this.props;

    this.setState({loading: true});

    let {transactions, total} = await Client.getTransactions({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });

    this.setState({
      transactions,
      total,
      loading: false,
    });
  };

  render() {

    let {transactions, total, loading, EmptyState = null} = this.state;
    let {theadClass = "thead-dark", pagingProps = {}} = this.props;

    if (!loading && transactions.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center">{tu("no_transactions")}</div>
        );
      }
      return <EmptyState/>;
    }

    return (
      <StickyContainer>
        <Sticky>
          {
            ({style}) => (
              <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                <Paging onChange={this.onChange} total={total} loading={loading} {...pagingProps} />
              </div>
            )
          }
        </Sticky>
        <table className="table table-hover m-0 border-top-0">
          <thead className={theadClass}>
          <tr>
            <th className="d-none d-md-table-cell" style={{width: 125}}>{tu("age")}</th>
            <th className="text-nowrap">{tu("hash")}</th>
            <th className="text-nowrap text-right" style={{width: 125}}>{tu("contract_type")}</th>
          </tr>
          </thead>
          <tbody>
          {
            transactions.map((transaction) => (
              <tr key={transaction.hash}>
                <td className="d-none d-md-table-cell">
                  <TimeAgo date={transaction.timestamp}/>
                </td>
                <td className="text-nowrap">
                  <Truncate>
                    <TransactionHashLink hash={transaction.hash}>
                      {transaction.hash}
                    </TransactionHashLink>
                  </Truncate>
                </td>
                <td className="text-nowrap text-right">
                  {ContractTypes[transaction.contractType]}
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
