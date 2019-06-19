import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {TransactionHashLink, AddressLink, BlockNumberLink} from "./Links";
import {tu} from "../../utils/i18n";
import TimeAgo from "react-timeago";
import {TronLoader} from "./loaders";
import {Truncate} from "./text";
import {ContractTypes} from "../../utils/protocol";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {QuestionMark} from "./QuestionMark";
import TotalInfo from "./TableTotal";
import DateRange from "./DateRange";
import {DatePicker} from 'antd';
import moment from 'moment';
import {NameWithId} from "./names";
import rebuildList from "../../utils/rebuildList";
import xhr from "axios/index";
import {API_URL} from '../../constants.js'

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

  componentDidUpdate(prevProps) {
      let {filter,page} = this.props;
      if (prevProps.filter.address !== filter.address && page.router == 'account') {
          this.loadTransactions();
      }
  }

  onChange = (page, pageSize) => {
    this.loadTransactions(page, pageSize);
  };

  loadTransactions = async (page = 1, pageSize = 20) => {

    let {filter, isinternal=false, address=false} = this.props;

    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );

    let transactions, total,rangeTotal = 0;

    if(!isinternal ){
      if(address){
          let data = await Client.getTransactions({
              sort: '-timestamp',
              limit: pageSize,
              start: (page - 1) * pageSize,
              total: this.state.total,
              start_timestamp:this.start,
              end_timestamp:this.end,
              ...filter,
          });
          transactions = data.transactions;
          total = data.total,
          rangeTotal = data.rangeTotal
      }else{
          let data = await Client.getTransactions({
              sort: '-timestamp',
              limit: pageSize,
              start: (page - 1) * pageSize,
              total: this.state.total,
              ...filter,
          });
          transactions = data.transactions;
          total = data.total,
          rangeTotal = data.rangeTotal
      }

    }else {
        // TODO internal transctions

        let data = await Client.getInternalTransaction({
            limit: pageSize,
            start: (page - 1) * pageSize,
            start_timestamp: this.start,
            end_timestamp: this.end,
            ...filter
        });

        let newdata = rebuildList(data.list, 'tokenId', 'callValue', 'valueInfoList')
        transactions = newdata;
        total = data.total,
            rangeTotal = data.rangeTotal
    }

    this.setState({
        transactions,
        total,
        rangeTotal,
        loading: false,
    });
  };

  customizedColumn = () => {
      let {intl, isinternal = false} = this.props;
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
          return <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
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
      // {
      //     title: upperFirst(intl.formatMessage({id: 'status'})),
      //     dataIndex: 'confirmed',
      //     key: 'confirmed',
      //     align: 'center',
      //     className: 'ant_table',
      //     render: (text, record, index) => {
      //         return record.confirmed?
      //             <span className="badge badge-success text-uppercase">{intl.formatMessage({id:'Confirmed'})}</span> :
      //             <span className="badge badge-danger text-uppercase">{intl.formatMessage({id: 'Unconfirmed'})}</span>
      //     },
      // }
    ];
    return column;
  }

  trc20CustomizedColumn = () => {
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
            title: upperFirst(intl.formatMessage({id: 'block'})),
            dataIndex: 'block',
            key: 'block',
            align: 'left',
            className: 'ant_table',
            width: '10%',
            render: (text, record, index) => {
                return <BlockNumberLink number={record.block}/>
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
                return <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
            }
        },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'from',
        key: 'from',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: '',
        className: 'ant_table',
        width: '30px',
        render: (text, record, index) => {
          return <img src={require("../../images/arrow.png")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'to',
        key: 'to',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'trc20_my_trans_header_status'})),
        dataIndex: 'rejected',
        key: 'rejected',
        align: 'left',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          return <span>
              {
                  text?<img style={{width: '20px', height: '20px'}} src={require("../../images/internal_error.png")}/>:<img style={{width: '20px', height: '20px'}} src={require("../../images/internal_success.png")}/>
              }
          </span>
        }
      
      },
      {
        title: upperFirst(intl.formatMessage({id: 'amount'})),
        dataIndex: 'valueInfoList',
        key: 'valueInfoList',
        align: 'right',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          return record.valueInfoList.length ?record.valueInfoList.map((item,index) => {
            return <span key={index}><NameWithId value={item}/><span className={index == record.valueInfoList.length -1? 'd-none': ''}>, </span></span>
          }): '-'
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'contract_type'})),
      //   dataIndex: 'contractType',
      //   key: 'contractType',
      //   align: 'right',
      //   width: '20%',
      //   className: 'ant_table _text_nowrap',
      //   render: (text, record, index) => {
      //     return <span>{ContractTypes[text]}</span>
      //   }
      // },
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

    let {transactions, total, rangeTotal, loading, EmptyState = null} = this.state;
    let {intl, isinternal, address = false, filter: {contract}} = this.props;
    let column = !isinternal? this.customizedColumn():
                              this.trc20CustomizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transactions_unit'})

      // if (!loading && transactions && transactions.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
    //     );
    //   }
    //   return <EmptyState/>;
    // }

    return (
      <div className={"token_black table_pos " + (address?"mt-5":"")}>
          {loading && <div className="loading-style"><TronLoader/></div>}
          
          <div class="d-flex justify-content-between"  style={{position: "absolute", left: 0, top: '-28px'}}>
            {(total && contract && isinternal)? <div className="d-flex align-items-center">
              <div className="question-mark mr-2"><i>?</i></div><span className="flex-1">{tu('interTrx_tip')}</span>
            </div>: ''}
            
            {address ? <DateRange onDateOk={(start,end) => this.onDateOk(start,end)}  dateClass="date-range-box-address-unset" />: ''}
          </div>
          {total? <TotalInfo total={total} rangeTotal={rangeTotal} typeText="transactions_unit" common={!address}/>: ''}
          
          {
              (!loading && transactions.length === 0)?
                  <div className="p-3 text-center no-data">{tu("no_transactions")}</div>:
                  <SmartTable bordered={true} loading={loading} column={column} data={transactions} total={total}
                              onPageChange={(page, pageSize) => {
                                  this.loadTransactions(page, pageSize)
                              }}/>
          }

        </div>
    )
  }
}

export default (injectIntl(Transactions));