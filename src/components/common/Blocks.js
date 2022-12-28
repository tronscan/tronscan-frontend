import React from "react";
import { Client } from "../../services/api";
import { BlockNumberLink } from "./Links";
import { t, tu } from "../../utils/i18n";
import { FormattedNumber, injectIntl,FormattedDate,FormattedTime } from "react-intl";
import { API_URL } from "../../constants";
// import TimeAgo from "react-timeago";
import moment from "moment";
import SmartTable from "./SmartTable.js";
import { upperFirst } from "lodash";
import { TronLoader } from "./loaders";
import qs from "qs";
import BlockTime from "../common/blockTime";
import { Table, Input, Button, Icon } from "antd";


class Blocks extends React.Component {
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
      timeType: true,
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
    };
  }

  componentDidMount() {
    this.load();
  }

  onChange = (page, pageSize) => {
    this.load(page, pageSize);
  };

  load = async (page = 1, pageSize = 20) => {
    let { filter, getCsvUrl } = this.props;

    this.setState({ loading: true });

    const params = {
      sort: "-number",
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter
    };
    const query = qs.stringify({ format: "csv", ...params });
    getCsvUrl(`${API_URL}/api/block?${query}`);

    let { blocks, total } = await Client.getBlocks(params);

    this.setState({
      page,
      blocks,
      total,
      loading: false,
      pagination: {
        ...this.state.pagination,
        total
      }
    });
  };

  changeType() {
    let { timeType } = this.state;

    this.setState({
      timeType: !timeType
    });
  }

  customizedColumn = () => {
    let { intl } = this.props;
    let {timeType} = this.state
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "height" })),
        dataIndex: "number",
        key: "number",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <BlockNumberLink number={text} />;
        }
      },
      {
        title: (
          <span
            className="token-change-type"
            onClick={this.changeType.bind(this)}
          >
            {upperFirst(
              intl.formatMessage({
                id: timeType ? "age" : "trc20_cur_order_header_order_time"
              })
            )}
            <Icon
              type="retweet"
              style={{
                verticalAlign: 0,
                marginLeft: 10
              }}
            />
          </span>
        ),
        dataIndex: "timestamp",
        key: "timestamp",
        align: "left",

        className: "ant_table",
        render: (text, record, index) => {
          return (
            <div>
              {timeType ? (
                <BlockTime time={Number(record.timestamp)}> </BlockTime>
              ) : (
                <span className="">
                  <FormattedDate value={record.timestamp} /> &nbsp;
                  <FormattedTime
                    value={record.timestamp}
                    hour="numeric"
                    minute="numeric"
                    second="numeric"
                    hour12={false}
                  />
                </span>
              )}
            </div>
          );
          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "transaction" })),
        dataIndex: "nrOfTrx",
        key: "nrOfTrx",
        align: "left",
        width:'150px',
        className: "ant_table",
        render: (text, record, index) => {
          return <span><FormattedNumber value={text} /> Txns</span>;
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "account_representative_block_table_res" })
        ),
        key: "netUsage",
        dataIndex: "netUsage",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
        return (<span><FormattedNumber value={record.netUsage} /> {tu('bandwidth')} / <FormattedNumber value={record.energyUsage} /> {tu('energy')}</span> ) ;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "bytes" })),
        dataIndex: "size",
        key: "size",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        },
        width:'150px'
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "account_representative_block_table_prize" })
        ),
        key: "blockReward",
        dataIndex: "blockReward",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <span><FormattedNumber value={text} /> TRX</span>;
        }
      }
    ];
    return column;
  };
  render() {
    let {
      page,
      total,
      pageSize,
      loading,
      blocks,
      emptyState: EmptyState = null
    } = this.state;
    let column = this.customizedColumn();
    let { intl } = this.props;
    let tableInfo = 
      intl.formatMessage({ id: "account_representative_block_desc" },{block:total,trx:this.props.blockReward});

    if (!loading && blocks.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center  no-data">{t("no_blocks_found")}</div>
        );
      }
      return <EmptyState />;
    }


    return (
      <div className="token_black table_pos">
        {loading && (
          <div className="loading-style">
            <TronLoader />
          </div>
        )}
        {total ? (
          <div
            className="table_pos_info d-none d-md-block table-no-absolute"
            style={{ left: "auto" }}
          >
            {tableInfo}
          </div>
        ) : (
          ""
        )}
        <Table
          bordered={true}
          loading={loading}
          dataSource={blocks}
          columns={column}
          pagination={this.state.pagination}
          onChange={(page, pageSize) => {
            this.load(page.current, page.pageSize);
          }}
          rowKey={(record, index) => {
            return index; 
          }}       
          />
      </div>
    );
  }
}

export default injectIntl(Blocks);
