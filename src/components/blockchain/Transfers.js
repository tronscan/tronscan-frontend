/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
// import TimeAgo from "react-timeago";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {getQueryParams} from "../../utils/url";
import {Truncate} from "../common/text";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import TotalInfo from "../common/TableTotal";
import DateRange from "../common/DateRange";
//import {TRXPrice} from "../common/Price";
//import {ONE_TRX} from "../../constants";
import {DatePicker} from 'antd';
import moment from 'moment';
//import xhr from "axios/index";
import {NameWithId} from "../common/names";
import rebuildList from "../../utils/rebuildList";
import BlockTime from '../common/blockTime'
import { tu } from "../../utils/i18n";
import { Tooltip,Icon } from 'antd';


const RangePicker = DatePicker.RangePicker;

class Transfers extends React.Component {

  constructor() {
     super();
     this.start = moment([2018,5,25]).startOf('day').valueOf();
     this.end = moment().valueOf();
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
    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );
    let searchParams = {};

    for (let [key, value] of Object.entries(getQueryParams(location))) {
      switch (key) {
        case "address":
        case "block":
          searchParams[key] = value;
          break;
      }
    }

    let {transfers, total, rangeTotal,contractMap} = await Client.getTransfers({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize,
      start_timestamp: this.start,
      end_timestamp: this.end,
      ...searchParams,
    });
    let transfersList = rebuildList(transfers, 'tokenName', 'amount');
    transfersList.forEach(item=>{
      if(contractMap){
          contractMap[item.transferFromAddress]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
          contractMap[item.transferToAddress]? (item.toIsContract = true) :  (item.toIsContract = false)
      }
    })

    this.setState({
      transfers: transfersList,
      loading: false,
      total,
      rangeTotal,
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
          return <span>
            {/*  Distinguish between contract and ordinary address */}
            {record.ownerIsContract? (
              <span className="d-flex">
                <Tooltip
                  placement="top"
                  title={upperFirst(
                      intl.formatMessage({
                      id: "transfersDetailContractAddress"
                      })
                  )}
                >
                  <Icon
                    type="file-text"
                    style={{
                    verticalAlign: 0,
                    color: "#77838f",
                    lineHeight: 1.4
                    }}
                  />
                </Tooltip>
                <AddressLink address={text} isContract={true}>{text}</AddressLink>
              </span>
              ) : <AddressLink address={text}>{text}</AddressLink>
            }
          </span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'to'})),
        dataIndex: 'transferToAddress',
        key: 'transferToAddress',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <span>
            {/*  Distinguish between contract and ordinary address */}
            {record.toIsContract? (
              <span className="d-flex">
                <Tooltip
                  placement="top"
                  title={upperFirst(
                      intl.formatMessage({
                      id: "transfersDetailContractAddress"
                      })
                  )}
                >
                  <Icon
                    type="file-text"
                    style={{
                      verticalAlign: 0,
                      color: "#77838f",
                      lineHeight: 1.4
                    }}
                  />
                </Tooltip>
                <AddressLink address={text} isContract={true}>{text}</AddressLink>
              </span>
              ) : <AddressLink address={text}>{text}</AddressLink>
            }
          </span>
        }

      },
      {
        title: upperFirst(intl.formatMessage({id: 'status'})),
        dataIndex: 'confirmed',
        key: 'confirmed',
        align: 'left',
        className: 'ant_table',
        width: '14%',
        render: (text, record, index) => {
        return  text ? 
        <span><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> {tu('full_node_version_confirmed')}</span>
         : <span>
           <img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> {tu('full_node_version_unconfirmed')}</span>
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
          return <NameWithId value={record} type="abbr" totoken/>

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

  onDateOk (start,end) {
      this.start = start.valueOf();
      this.end = end.valueOf();
      let {page, pageSize} = this.state;
      this.load(page,pageSize);
  }

  render() {

    let {transfers, total, rangeTotal, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();


    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row">
            <div className="col-md-12 table_pos">
              {total ?<TotalInfo total={total} rangeTotal={rangeTotal} isQuestionMark={false}  typeText="transfers_unit"/>:""}
              {
                false && total? <DateRange onDateOk={(start,end) => this.onDateOk(start,end)} /> :''
              }
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
