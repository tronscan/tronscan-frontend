/* eslint-disable no-undef */
import React from "react";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {FormattedNumber,injectIntl} from "react-intl";
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

  loadBlocks = async (page = 1, pageSize = 10) => {

    this.setState({loading: true});

    let {blocks, total} = await Client.getBlocks({
      sort: '-number',
      limit: pageSize,
      start: (page - 1) * pageSize,
    });
    let {witnesses} = await Client.getWitnesses();

    for(let block in blocks){
      for(let witness in witnesses){
        if(blocks[block].witnessAddress===witnesses[witness].address){
          if(witnesses[witness].name!=="")
            blocks[block].witnessName=witnesses[witness].name;
          else
            blocks[block].witnessName=witnesses[witness].url.substring(7).split('.com')[0];;
        }

      }
    }

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
        width:'12%',
        render: (text, record, index) => {
          return <BlockNumberLink number={text}/>
        }
      },
      {
        title: intl.formatMessage({id: 'age'}),
        dataIndex: 'timestamp',
        key: 'timestamp',

        align: 'center',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TimeAgo date={text} />
        }
      },
      {
        title: <i className="fas fa-exchange-alt"/>,
        dataIndex: 'nrOfTrx',
        key: 'nrOfTrx',
        align: 'center',
        render: (text, record, index) => {
          return <FormattedNumber value={text} />
        }
      },
      {
        title: intl.formatMessage({id: 'produced by'}),
        dataIndex: 'witnessAddress',
        key: 'witnessAddress',
        align: 'center',
        width: '40%',
        className: 'ant_table',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: intl.formatMessage({id: 'bytes'}),
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
    let {match} = this.props;
    let column = this.customizedColumn();
    return (
      <main className="container header-overlap pb-3">
        {loading && <div className="loading-style"><TronLoader/></div>}
        {
          <div className="row">
            <div className="col-md-12">
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
