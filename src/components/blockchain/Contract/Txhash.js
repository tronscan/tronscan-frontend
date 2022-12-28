import React, {Fragment} from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {Client} from "../../../services/api";
import {TransactionHashLink, BlockNumberLink, AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
// import TimeAgo from "react-timeago";
import moment from 'moment';
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
import {ContractTypes} from "../../../utils/protocol";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst, toUpper} from "lodash";
import xhr from "axios/index";
import {API_URL} from "../../../constants";
import {TRXPrice} from "../../common/Price";
import {ONE_TRX} from "../../../constants";
import { Tooltip } from 'antd'
import BlockTime from '../common/blockTime'


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

  loadTransactions = async (page = 1, pageSize = 40) => {

    let {filter, isInternal = false} = this.props;

    this.setState({loading: true});

    // let transactions = await Client.getContractTxs({
    //   sort: '-timestamp',
    //   limit: pageSize,
    //   start: (page - 1) * pageSize,
    //   ...filter,
    // });


    let transactions = xhr.get(`http://18.216.57.65:20111/api/contracts/transaction`, {
      sort: '-timestamp',
      count: true,
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter
    }).then((result) => {
      return result.data
    });

    transactions.data.map( item => {
      item.tip = item.ownerAddress == filter.contract? 'out': 'in'
    })

    this.setState({
      transactions: transactions.data,
      loading: false,
    });
  };

  customizedColumn = () => {
    let {intl, isInternal = false} = this.props;
    
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: isInternal? 'ParentTxHash': 'TxHash'})),
        dataIndex: 'txHash',
        key: 'txHash',
        align: 'left',
        width: '150px',
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
        width: '120px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <BlockTime time={text}></BlockTime>

          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'ownerAddress',
        key: 'ownerAddress',
        align: 'left',
        render: (text, record, index) => {
          return  record.tip == 'in'?
                  <span className="d-flex">
                    <Tooltip placement="top" title={intl.formatMessage({id: 'contracts'})}>
                      <span><i className="far fa-file mr-1"></i></span>
                    </Tooltip>
                    
                    <AddressLink address={text} isContract={false}/>
                  </span>:
                  <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: '',
        dataIndex: 'tip',
        align: 'center',
        render: (text, record, index) => {
          return <div className={"tip tip-"+text}>{toUpper(text)}</div>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'toAddress',
        key: 'toAddress',
        align: 'left',
        render: (text, record, index) => {
          return record.tip == 'out'?
                  <span className="d-flex">
                    <Tooltip placement="top" title={intl.formatMessage({id: 'contracts'})}>
                      <span><i className="far fa-file mr-1"></i></span>
                    </Tooltip>
                    
                    <AddressLink address={text} isContract={false}/>
                  </span>:
                  <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'value'})),
        dataIndex: 'value',
        key: 'value',
        align: 'left',
        width: '150px',
        className: 'ant_table',
        render: (text, record, index) => {
          return  <TRXPrice amount={parseInt(text) / ONE_TRX}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'token'})),
        dataIndex: 'token',
        key: 'token',
        align: 'right',
        width: '80px',
        className: 'ant_table',
        render: (text, record, index) => {
          return  <span>{text}</span>
        }
      }
    ];
    return column;
  }

  render() {

    let {transactions, total, loading, EmptyState = null} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'contract_unit'})

    // if (!loading && transactions.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center">{tu("no_transactions")}</div>
    //     );
    //   }
    //   return <EmptyState/>;
    // }

    return (
      <Fragment>
        {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
        <div className="row">
          <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading}
                          column={column} data={transactions} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadContracts(page, pageSize)
                          }}/>
          </div>
        </div>
      </Fragment>
    )}
}

export default injectIntl(Transactions)
