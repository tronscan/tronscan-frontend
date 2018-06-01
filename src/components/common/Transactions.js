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
import {ContractTypes} from "../../utils/protocol";

export default class Transactions extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      transactions: [],
      page: 0,
      total: 0,
      pageSize: 25,
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

  onChange = ({page}) => {
    this.loadTransactions(page);
  };

  loadTransactions = async (page = 0) => {

    let {filter} = this.props;
    let {pageSize} = this.state;

    this.setState({ loading: true });

    let {transactions, total} = await Client.getTransactions({
      sort: '-timestamp',
      limit: pageSize,
      start: page * pageSize,
      ...filter,
    });

    this.setState({
      page,
      transactions,
      total,
      loading: false,
    });
  };

  render() {

    let {transactions, page, total, pageSize, loading, EmptyState = null} = this.state;
    let {theadClass = "thead-dark"} = this.props;

    if (!loading && transactions.length === 0) {
      if (!EmptyState) {
        return null;
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
            <th className="" style={{width: 125 }}>{tu("age")}</th>
            <th className="">{tu("hash")}</th>
            <th className="" style={{width: 125 }}>{tu("contractType")}</th>
          </tr>
          </thead>
          <tbody>
          {
            transactions.map((transaction) => (
              <tr key={transaction.hash}>
                <td className="text-nowrap">
                  <TimeAgo date={transaction.timestamp} />
                </td>
                <td className="">
                  <Truncate>
                    <TransactionHashLink hash={transaction.hash}>
                      {transaction.hash}
                    </TransactionHashLink>
                  </Truncate>
                </td>
                <td className="">
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
