import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {Client} from "../../../services/api";
import {TransactionHashLink, BlockNumberLink, AddressLink} from "../../common/Links";
import {FormattedNumber} from "react-intl";
import {tu} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
import {ContractTypes} from "../../../utils/protocol";

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

    let {filter, isInternal = false} = this.props;

    this.setState({loading: true});

    let transactions = await Client.getContractTxs({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });

    this.setState({
      transactions: transactions.data,
      loading: false,
    });
  };

  render() {

    let {transactions, total, loading, EmptyState = null} = this.state;
    let {theadClass = "thead-dark", pagingProps = {}, isInternal = false} = this.props;

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
              {
                !isInternal && <th className="" style={{width: 150}}>{tu("hash")}</th>
              }
              {
                isInternal && <th className="" style={{width: 150}}>{tu("parenthash")}</th>
              }
              <th className="">{tu("block")}</th>
              <th className="">{tu("age")}</th>
              <th className="">{tu("from")}</th>
              <th className="">{tu("to")}</th>
              <th className="">{tu("value")}</th>
              {
                !isInternal && <th className="">{tu("fee")}</th>
              }
            </tr>
            </thead>
            <tbody>
            {
              transactions.map((transaction) => (
                  <tr key={transaction.txHash}>

                    <td className="">
                      <Truncate>
                        <TransactionHashLink hash={transaction.txHash}>
                          {transaction.txHash}
                        </TransactionHashLink>
                      </Truncate>
                    </td>
                    <td className="text-nowrap">
                      <BlockNumberLink number={transaction.block}/>
                    </td>
                    <td className="text-nowrap">
                      <TimeAgo date={transaction.timestamp}/>
                    </td>
                    <td className="text-nowrap">
                      <AddressLink address={transaction.ownerAddress}/>
                    </td>
                    <td className="text-nowrap">
                      <AddressLink address={transaction.sendAddress}/>
                    </td>
                    <td className="text-nowrap">
                      <FormattedNumber value={transaction.value}/>
                    </td>
                    {
                      !isInternal &&
                      <td className="text-nowrap">
                        <FormattedNumber value={transaction.txFee}/>
                      </td>
                    }
                  </tr>
              ))
            }
            </tbody>
          </table>
        </StickyContainer>
    )
  }
}
