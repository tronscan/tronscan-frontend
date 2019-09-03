import React, {Fragment} from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {Client} from "../../../services/api";
import {TransactionHashLink, BlockNumberLink, AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
import {ContractTypes} from "../../../utils/protocol";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst, toUpper} from "lodash";
import xhr from "axios";
import {API_URL} from "../../../constants";
import {TRXPrice} from "../../common/Price";
import {ONE_TRX} from "../../../constants";
import TotalInfo from "../../common/TableTotal";
import DateSelect from "../../common/dateSelect";
import {Tooltip} from 'antd'
import moment from 'moment';
import {DatePicker} from "antd/lib/index";
import qs from 'qs'

const RangePicker = DatePicker.RangePicker;

class Transactions extends React.Component {

  constructor(props) {
    super(props);
    this.start = moment([2018,5,25]).startOf('day').valueOf();
    this.end = moment().valueOf();
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

    let {filter, intl, isInternal = false, getCsvUrl} = this.props;

    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );
    const params = {
      sort: '-timestamp',
      start_timestamp: this.start,
      end_timestamp: this.end,
      ...filter,
    }
    const query = qs.stringify({ format: 'csv',...params})
    getCsvUrl(`${API_URL}/api/contracts/transaction?${query}`)

    let transactions = await Client.getContractTxs({
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...params,
    });

    transactions.data.map(item => {
      item.tip = item.ownAddress == filter.contract ? 'out' : 'in'
    })
    this.setState({
      transactions: transactions.data,
      total: transactions.total,
      rangeTotal :transactions.rangeTotal,
      loading: false
    });
  };

  customizedColumn = () => {
    let {intl, isInternal = false} = this.props;

    let column = [
      {
        title: upperFirst(intl.formatMessage({id: isInternal ? 'ParentTxHash' : 'TxHash'})),
        dataIndex: 'txHash',
        key: 'txHash',
        align: 'left',
        // width: '150px',
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
        title: upperFirst(intl.formatMessage({id: 'block'})),
        dataIndex: 'block',
        key: 'block',
        align: 'left',
        width: '90px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        width: '150px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'ownAddress',
        key: 'ownAddress',
        align: 'left',
        render: (text, record, index) => {
          return record.tip == 'in' ?
              <span className="d-flex">
            {record.ownAddressType == 2 &&
            <Tooltip placement="top" title={intl.formatMessage({id: 'contracts'})}>
              <span><i className="far fa-file mr-1"></i></span>
            </Tooltip>}

                <AddressLink address={text} isContract={record.ownAddressType == 2}/>
          </span> :
              <Truncate><span>{text}</span></Truncate>
        }
      },
      // {
      //   title: '',
      //   dataIndex: 'tip',
      //   align: 'center',
      //   render: (text, record, index) => {
      //     return <div className={"tip tip-"+text}>{toUpper(text)}</div>
      //   }
      // },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'toAddress',
        key: 'toAddress',
        align: 'left',
        render: (text, record, index) => {
          return record.tip == 'out' ?
              <span className="d-flex">
            {record.toAddressType == 2 &&
            <Tooltip placement="top" title={intl.formatMessage({id: 'contracts'})}>
              <span><i className="far fa-file mr-1"></i></span>
            </Tooltip>}

                <AddressLink address={text} isContract={record.toAddressType == 2}/>
          </span> :
              <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'status'})),
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
            return (
                <div>
                    {
                        record.confirmed ?
                            <span className="badge badge-success text-uppercase">{tu("Confirmed")}</span> :
                            <span className="badge badge-danger text-uppercase">{tu("Unconfirmed")}</span>
                    }
                </div>

            )
        }
    },
    {
        title: upperFirst(intl.formatMessage({id: 'result' })),
        dataIndex: 'contractRet',
        key: 'contractRet',
        align: 'left',
        className: 'ant_table',
        width: '10%',
        render: (text, record, index) => {
            return <span>{text}</span>
        }
    },
      {
        title: upperFirst(intl.formatMessage({id: 'value'})),
        dataIndex: 'value',
        key: 'value',
        align: 'right',
        width: '120px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TRXPrice amount={parseInt(text) / ONE_TRX}/>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'TxFee'})),
      //   dataIndex: 'txFee',
      //   key: 'txFee',
      //   align: 'right',
      //   width: '120px',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return  <TRXPrice amount={parseInt(text) / ONE_TRX}/>
      //   }
      // }
    ];
    return column;
  }

  onDateOk (start,end) {
      this.start = start.valueOf();
      this.end = end.valueOf();
      let {page, pageSize} = this.state;
      this.loadTransactions(page,pageSize);
  }

  render() {

    let {transactions, total,rangeTotal, loading, EmptyState = null} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();

    // if (!loading && transactions.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_tnx")}</div>
    //     );
    //   }
    //
    //   return <EmptyState/>;
    // }

    return (
        <Fragment>
          {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos mt-5">
              {total ? <TotalInfo total={total} rangeTotal={rangeTotal} top="-28px" typeText="transactions_unit" selected/>:""}
              <DateSelect onDateOk={(start,end) => this.onDateOk(start,end)} dataStyle={{marginTop: '-3.3rem', right: '15px'}}/>
              {
                  (!loading && transactions.length === 0)? <div className="p-3 text-center no-data">{tu("no_tnx")}</div>:
                    <SmartTable bordered={true} loading={loading}
                                column={column} data={transactions} total={rangeTotal>2000? 2000: rangeTotal}
                                onPageChange={(page, pageSize) => {
                                   this.loadTransactions(page, pageSize)
                  }}/>
              }

            </div>
          </div>
        </Fragment>
    )
  }
}

export default injectIntl(Transactions)
