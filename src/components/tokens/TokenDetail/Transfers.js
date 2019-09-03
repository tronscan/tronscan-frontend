import React, {Fragment} from "react";
import {Client} from "../../../services/api";
import {AddressLink, TransactionHashLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {API_URL, ONE_TRX} from "../../../constants";
import {tu, t} from "../../../utils/i18n";
import TimeAgo from "react-timeago";
import moment from 'moment';
import {Truncate} from "../../common/text";
import {withTimers} from "../../../utils/timing";
import {FormattedNumber, injectIntl} from "react-intl";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "../../common/loaders";
import xhr from "axios/index";
import {NameWithId} from "../../common/names";
import TotalInfo from "../../common/TableTotal";
import DateSelect from "../../common/dateSelect";
import rebuildList from "../../../utils/rebuildList";
import qs from 'qs'

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
      pageSize: 20,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false
    };
  }

  componentDidMount() {
    // this.loadPage();

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };

  loadPage = async (page = 1, pageSize = 20) => {
    let {filter, getCsvUrl} = this.props;
    let {showTotal} = this.state;
    const params = {
      name: filter.token,
      issueAddress:filter.address,
      start_timestamp:this.start,
      end_timestamp:this.end,
    }

    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );

    const query = qs.stringify({ format: 'csv',...params})
    getCsvUrl(`${API_URL}/api/asset/transfer?${query}`)
    let {list, total, rangeTotal} = await Client.getAssetTransfers({
        limit: pageSize,
        start: (page - 1) * pageSize,
        ...params
    });

    const { count } = await Client.getCountByType({
      type: 'asset', 
      issueName: filter.address
    })

    let transfers = rebuildList(list,'tokenName','amount');


    for (let index in transfers) {
      transfers[index].index = parseInt(index) + 1;
    }

    this.setState({
      page,
      transfers,
      total: count,
      rangeTotal,
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
        className: 'ant_table',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={record.transactionHash}>
              {record.transactionHash}
            </TransactionHashLink>
          </Truncate>

        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        width: '150px',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TimeAgo date={record.timestamp} title={moment(record.timestamp).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={record.transferFromAddress}/>
        }
      },
      {
        title: '',
        className: 'ant_table',
        width: '30px',
        render: (text, record, index) => {
          return <img src={require("../../../images/arrow.png")}/>
        },
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={record.transferToAddress}/>
        },
      },
      {
        title: upperFirst(intl.formatMessage({id: 'amount'})),
        dataIndex: 'amount',
        key: 'amount',
        width: '200px',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <NameWithId value={record} br/>

        },
      }

    ];

    return column;
  }

  onDateOk (start,end) {
      this.start = start.valueOf();
      this.end = end.valueOf();
      let {page, pageSize} = this.state;
      this.loadPage(page,pageSize);
  }

  render() {

    let {transfers, page, total, rangeTotal, pageSize, loading, emptyState: EmptyState = null} = this.state;
    let {theadClass = "thead-dark", intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'a_totle'})+' ' + total +' '+ intl.formatMessage({id: 'transaction_info'});
    
    // if (!loading && transfers.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
    //     );
    //   }
    //   return <EmptyState/>;
    // }

    return (
        <Fragment>
        {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}

        <div className="row transfers">
          <div className="col-md-12 table_pos">
            <div className="d-flex justify-content-between pl-3 pr-3" style={{left: 'auto'}}>
            <TotalInfo total={total} rangeTotal={rangeTotal} typeText="transaction_info" divClass="table_pos_info_addr" selected/>
                <DateSelect onDateOk={(start,end) => this.onDateOk(start,end)}  dataStyle={{right: '35px'}}/>
            </div>
              {
                  (!loading && transfers.length === 0)?
                      <div className="pt-5 pb-5 text-center no-data transfers-bg-white">{tu("no_transfers")}</div>
                      :
                      <SmartTable border={false} loading={loading} column={column} data={transfers} total={rangeTotal>2000? 2000: rangeTotal} addr="address" transfers="token"
                                  onPageChange={(page, pageSize) => {
                                      this.loadPage(page, pageSize)
                                  }}/>
              }

          </div>
        </div>
        </Fragment>
    )
  }
}

export default withTimers(injectIntl(Transfers));
