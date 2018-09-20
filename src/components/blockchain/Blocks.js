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
          return <AddressLink address={record.witnessAddress} children={text}/>
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
      }
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
                {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
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
