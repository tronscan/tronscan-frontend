import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {TransactionHashLink} from "./Links";
import {tu} from "../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "./loaders";
import {Truncate} from "./text";
import {ContractTypes} from "../../utils/protocol";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";

class Transactions extends React.Component {

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

  loadTransactions = async (page = 1, pageSize = 20) => {

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
  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      
      {
        title: upperFirst(intl.formatMessage({id: 'hash'})),
        dataIndex: 'hash',
        key: 'hash',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={text}>
              {text}
            </TransactionHashLink>
          </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        className: 'ant_table',
        width: '14%',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'contract_type'})),
        dataIndex: 'contractType',
        key: 'contractType',
        align: 'right',
        width: '20%',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          return <span>{ContractTypes[text]}</span>
        }
      },
    ];
    return column;
  }

  render() {

    let {transactions, total, loading, EmptyState = null} = this.state;
    let column = this.customizedColumn();
    let {intl} = this.props;
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transactions_unit'})

    if (!loading && transactions && transactions.length === 0) {
      if (!EmptyState) {
        return (
            <div className="p-3 text-center">{tu("no_transactions")}</div>
        );
      }
      return <EmptyState/>;
    }

    return (
        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
          <SmartTable bordered={true} loading={loading} column={column} data={transactions} total={total}
                      onPageChange={(page, pageSize) => {
                        this.loadTransactions(page, pageSize)
                      }}/>
        </div>
    )
  }
}

export default (injectIntl(Transactions));