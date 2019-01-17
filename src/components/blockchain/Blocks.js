/* eslint-disable no-undef */
import React from "react";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {FormattedNumber, injectIntl} from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink} from "../common/Links";
import SmartTable from "../common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "../common/loaders";
import xhr from "axios/index";


class Blocks extends React.Component {

  constructor() {
    super();

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

    this.setState({loading: true});
    /*
    let req = {
      "from": (page - 1) * pageSize,
      "size": pageSize,
      "sort": {"date_created": "desc"}
    }
    let {data} = await xhr.post(`https://apilist.tronscan.org/blocks/blocks/_search`, req);
    let blocks = [];
    let total = data.hits.total;
    for (let record of data.hits.hits) {
      blocks.push({
        number: record['_source']['number'],
        nrOfTrx: record['_source']['transactions'],
        size: record['_source']['size'],
        timestamp: record['_source']['date_created'],
        witnessName: record['_source']['witness_name'],
      });
    }
   */
    let {blocks, total} = await Client.getBlocks({
      sort: '-number',
      limit: pageSize,
      start: (page - 1) * pageSize,
    });

    this.setState({
      loading: false,
      blocks,
      total
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
          return <TimeAgo date={text}/>
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
  }

  render() {

    let {blocks, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'block_unit'})

    return (
        <main className="container header-overlap pb-3 token_black">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {
            <div className="row">
              <div className="col-md-12 table_pos">
                {total ?
                    <div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>{tableInfo}</div> : ''}
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
