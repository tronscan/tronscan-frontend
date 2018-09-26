import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "./Paging";
import {Client} from "../../services/api";
import {BlockNumberLink} from "./Links";
import {t, tu} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import TimeAgo from "react-timeago";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./loaders";

export default class Blocks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      blocks: [],
      page: 0,
      total: 0,
      pageSize: 25,
      totalVotes: 0,
      emptyState: props.emptyState,
    };
  }

  componentDidMount() {
    this.load();
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };

  load = async (page = 1, pageSize = 20) => {

    let {filter} = this.props;

    this.setState({ loading: true });

    let {blocks, total} = await Client.getBlocks({
      sort: '-number',
      limit: pageSize,
      start: (page-1) * pageSize,
      ...filter,
    });

    this.setState({
      page,
      blocks,
      total,
      loading: false,
    });
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'height'})),
        dataIndex: 'number',
        key: 'number',
        align: 'left',
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
        className: 'ant_table',
        render: (text, record, index) => {
          return <TimeAgo date={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'transaction'})),
        dataIndex: 'nrOfTrx',
        key: 'nrOfTrx',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'bytes'})),
        dataIndex: 'size',
        key: 'size',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
    ];
    return column;
  }
  render() {

    let {page, total, pageSize, loading, blocks, emptyState: EmptyState = null} = this.state;
    let column = this.customizedColumn();
    let {intl} = this.props;
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'record_unit'})


    if (!loading && blocks.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center">{t("no_blocks_found")}</div>
        );
      }
      return <EmptyState />;
    }

    return (
        <div className="token_black table_pos">
          {loading && <div className="loading-style"><TronLoader/></div>}
          {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
          <SmartTable bordered={true} loading={loading} column={column} data={blocks} total={total}
                      onPageChange={(page, pageSize) => {
                        this.load(page, pageSize)
                      }}/>
        </div>
    )
  }
}
