/* eslint-disable no-undef */
import React from "react";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
// import TimeAgo from "react-timeago";
import moment from 'moment';
import { tu } from "../../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink} from "../common/Links";
import SmartTable from "../common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "../common/loaders";
import TotalInfo from "../common/TableTotal";
//import DateRange from "../common/DateRange";
import BlockTime from '../common/blockTime'


import {DatePicker} from 'antd';
import xhr from "axios/index";

const RangePicker = DatePicker.RangePicker;

class Blocks extends React.Component {

  constructor() {
    super();
    this.start = "";
    this.end = "";
    this.state = {
      loading: false,
      blocks: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.loadBlocks();
  }

  onChange = (page, pageSize) => {
    this.loadBlocks(page, pageSize);
  };

  loadBlocks = async (page = 1, pageSize = 20) => {
    let {location, match} = this.props;
    let date_to = match.params.date;
    let date_start = parseInt(match.params.date) - 24 * 60 * 60 * 1000;
    this.setState(
        {
            loading: true,
            page: page,
            pageSize: pageSize,
        }
    );
      const allData = await Promise.all([
        Client.getBlocks({
            limit: pageSize,
            start: (page - 1) * pageSize,
            sort: '-number',
            start_timestamp:this.start,
            end_timestamp:this.end,
        }),
        Client.getBlocks({
            limit: 0,
        })
      ]).catch(e => {
          console.log('error:' + e);
      });
      const [{ blocks }, { total, rangeTotal } ] = allData;

      this.setState({
      loading: false,
      blocks,
      total,
      rangeTotal
    });
  };
  setProducedName = (record) => {
    let ele = null;
    if (record.witnessName) {
      ele = <span>
          {record.witnessName}
      </span>
    } else {
      if (record.number) {
        ele = <span>
          {record.witnessAddress}
        </span>
      } else {
        ele = <span>
        </span>
      }
    }
    return ele
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.loadBlocks);
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'height'})),
        dataIndex: 'number',
        key: 'number',
        align: 'center',
        className: 'ant_table',
        width: '12%',
        render: (text, record, index) => {
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'age'})),
        dataIndex: 'timestamp',
        key: 'timestamp',

        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <BlockTime time={text}></BlockTime>
          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'status'})),
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        render: (text, record, index) => {
          return <span>
            {
               record.confirmed ? 
               <span><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> {tu('full_node_version_confirmed')}</span>
                 : 
               <span><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> {tu('full_node_version_unconfirmed')}</span>
            }
          </span>
         
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'transactions'})),
        dataIndex: 'nrOfTrx',
        key: 'nrOfTrx',
        align: 'center',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'produced_by'})),
        dataIndex: 'witnessName',
        key: 'witnessName',
        align: 'left',
        width: '40%',
        className: 'ant_table',
        render: (text, record, index) => {
          //return <AddressLink address={text}/>
          return <AddressLink address={record.witnessAddress}>{this.setProducedName(record)}</AddressLink>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'bytes'})),
        dataIndex: 'size',
        key: 'size',
        align: 'center',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        },
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
      this.loadBlocks(page,pageSize);
  }

  render() {

    let {blocks, total, rangeTotal, loading, page, pageSize} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row">
              <div className="col-md-12 table_pos">
                {total ?<TotalInfo total={total} rangeTotal={rangeTotal}  isQuestionMark={false} typeText="block_unit" /> :""}
                {/**<DateRange onDateOk={(start,end) => this.onDateOk(start,end)} /> */}
                <SmartTable bordered={true} loading={loading} column={column} data={blocks} total={total}
                            onPageChange={(page, pageSize) => {
                              this.loadBlocks(page, pageSize)
                            }}/>
              </div>
            </div>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Blocks));
