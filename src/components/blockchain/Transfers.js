/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {getQueryParams} from "../../utils/url";
import {Truncate} from "../common/text";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {TRXPrice} from "../common/Price";
import {ONE_TRX} from "../../constants";
import {DatePicker} from 'antd';
import moment from "moment/moment";
import xhr from "axios/index";

const RangePicker = DatePicker.RangePicker;

class Transfers extends React.Component {

  constructor() {
    super();
    this.start = new Date(new Date().toLocaleDateString()).getTime();
    this.end = new Date().getTime();
    this.state = {
      transfers: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.load();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.load);
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };
  load = async (page = 1, pageSize = 20) => {

    let {location} = this.props;

    this.setState({loading: true});

    let searchParams = {};

    for (let [key, value] of Object.entries(getQueryParams(location))) {
      switch (key) {
        case "address":
        case "block":
          searchParams[key] = value;
          break;
      }
    }
    let req = {
      "query": {
        "bool": {
          "must": [
            {"range": {"date_created": {"gt": this.start, "lt": this.end}}}
          ]
        }
      },
      "from": (page - 1) * pageSize,
      "size": pageSize,
      "sort": {"date_created": "desc"}
    }
    let {data} = await xhr.post(`https://apilist.tronscan.org/transfers/transfers/_search`, req);
    let transfers = [];
    let total = data.hits.total;
    for (let record of data.hits.hits) {
      transfers.push({
        id: '',
        block: record['_source']['block'],
        transactionHash: record['_source']['hash'],
        timestamp: record['_source']['date_created'],
        transferFromAddress: record['_source']['owner_address'],
        transferToAddress: record['_source']['to_address'],
        amount: record['_source']['amount'],
        tokenName: record['_source']['token_name'],
      });
    }
    /*
    let {transfers, total} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      total: this.state.total,
      ...searchParams,
    });
    */
    this.setState({
      transfers,
      loading: false,
      total
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: '#',
        dataIndex: 'transactionHash',
        key: 'transactionHash',
        align: 'left',
        className: 'ant_table',
        width: '15%',
        render: (text, record, index) => {
          return <Truncate>
            <TransactionHashLink hash={text}>{text}</TransactionHashLink>
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
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'created'})),
        dataIndex: 'timestamp',
        key: 'timestamp',
        align: 'left',
        width: '14%',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'from'})),
        dataIndex: 'transferFromAddress',
        key: 'transferFromAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'value'})),
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: '180px',
        className: 'ant_table',
        render: (text, record, index) => {
          return record.tokenName == 'trx' ?
              <TRXPrice amount={record.amount / ONE_TRX}/>
              : record.amount + ' ' + record.tokenName

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
  onChangeDate = (dates, dateStrings) => {
    this.start = new Date(dateStrings[0]).getTime();
    this.end = new Date(dateStrings[1]).getTime();
  }
  onDateOk = () => {
    this.load();
  }
  disabledDate = (time) => {
    if(!time){
      return false
    }else{
      return time < moment().subtract(7, "days") || time > moment().add(0, 'd')
    }
  }
  render() {

    let {transfers, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transfers_unit'})

    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <div className="transactions-rangePicker" style={{width: "350px"}}>
                <RangePicker
                    defaultValue={[moment(this.start), moment(this.end)]}
                    ranges={{
                      'Today': [moment().startOf('day'), moment()],
                      'Yesterday': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
                      'This Week': [moment().startOf('isoWeek'), moment().endOf('isoWeek')],
                      // 'Last Week': [moment().subtract('isoWeek', 1).startOf('isoWeek'), moment().subtract('isoWeek', 1).endOf('isoWeek')]
                    }}
                    disabledDate={this.disabledDate}
                    showTime
                    format="YYYY/MM/DD HH:mm:ss"
                    onChange={this.onChangeDate}
                    onOk={this.onDateOk}
                />
              </div>
              <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={total}
                          onPageChange={(page, pageSize) => {
                            this.load(page, pageSize)
                          }}/>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Transfers));
