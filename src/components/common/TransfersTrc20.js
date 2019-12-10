import React from "react";
import { injectIntl} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, TransactionHashLink} from "./Links";
import {tu} from "../../utils/i18n";
import { FormatNumberByDecimals } from '../../utils/number'
// import TimeAgo from "react-timeago";
import moment from 'moment';
import {Truncate} from "./text";
import {withTimers} from "../../utils/timing";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./loaders";
import TotalInfo from "./TableTotal";
import DateRange from "./DateRange";
import _ from "lodash";
import BlockTime from '../common/blockTime'

class Transfers extends React.Component {

  constructor(props) {
    super(props);

    this.start = moment([2018,5,25]).startOf('day').valueOf();
    this.end = moment().valueOf();
    this.state = {
      filter: {},
      transfers: [],
      page: 1,
      total: 0,
      rangeTotal:0,
      pageSize: 20,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false,
      hideSmallCurrency:true,
      tokenName:"_"
    };
  }

  componentDidMount() {
    let {page, pageSize} = this.state;
    this.load(page,pageSize);

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(page,pageSize), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
      this.setState({
          page:page,
          pageSize:pageSize
      },() => {
          this.load(page, pageSize);
      });

  };

  load = async (page, pageSize) => {
    let {filter} = this.props;
    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );
    let {list, total, rangeTotal} = await Client.getTRC20tfs({
        limit: pageSize,
        start: (page - 1) * pageSize,
        address: filter.address,
        start_timestamp:this.start,
        end_timestamp:this.end,
    });

    list.map( item => {
      if(filter.address){
        item.fromtip = !(item.transferFromAddress == filter.address)
        item.totip = !(item.transferToAddress == filter.address)
      }else{
        item.fromtip = true
        item.totip = true
      }
    })
   
    this.setState({
      page,
      transfers:list,
      total:total,
      rangeTotal:rangeTotal,
      loading: false,
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
     
      {
        title: upperFirst(intl.formatMessage({id: 'hash'})),
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        align: 'left',
        width: '20%',
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
          return <BlockTime time={text}></BlockTime>
          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.fromtip?
          <AddressLink address={text}/>:
          <Truncate><span>{text}</span></Truncate>
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
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.totip?
          <AddressLink address={text}/>:
          <Truncate><span>{text}</span></Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'amount'})),
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        className: 'ant_table _text_nowrap',
        render: (text, record, index) => {
          // return <NameWithId value={record}/>
          return <span>{FormatNumberByDecimals(record.amount, record.decimals) +' '+record.tokenName}</span>
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
  };

  onDateOk (start,end) {
      this.start = start.valueOf();
      this.end = end.valueOf();
      let {page, pageSize} = this.state;
      this.load(page,pageSize);
  }
  render() {

    let {transfers, page, total, pageSize, loading, emptyState: EmptyState = null, rangeTotal} = this.state;
    let column = this.customizedColumn();
    let {intl} = this.props;

    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transfers_unit'})
    let locale  = {emptyText: intl.formatMessage({id: 'no_transfers'})}
    // if (!loading && transfers.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
    //     );
    //   }
    //
    //   return <EmptyState/>;
    // }

    return (
        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="d-flex justify-content-between" style={{left: 'auto'}}>
            {total ?<TotalInfo total={total} rangeTotal={rangeTotal} typeText="transactions_unit" divClass="table_pos_info_addr"/> :""}
            <DateRange onDateOk={(start,end) => this.onDateOk(start,end)} dateClass={total?"date-range-box-trc20":"date-range-box-trc20-nodata"}/>
          </div>
          {
            (!loading && transfers.length === 0)?
            <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
            :
            <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={total} locale={locale} addr="address" transfers="address"
              onPageChange={(page, pageSize) => {
                  this.onChange(page, pageSize)
            }}/>
          }




        </div>
    )
  }
}

export default withTimers(injectIntl(Transfers));
