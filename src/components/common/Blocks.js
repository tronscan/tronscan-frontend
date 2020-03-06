import React from "react";
import { Client } from "../../services/api";
import { BlockNumberLink } from "./Links";
import { t, tu } from "../../utils/i18n";
import { FormattedNumber, injectIntl } from "react-intl";
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
      emptyState: props.emptyState
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
      loading: false
    });
  };

  customizedColumn = () => {
    let { intl } = this.props;
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
        title: upperFirst(intl.formatMessage({ id: "age" })),
        dataIndex: "timestamp",
        key: "timestamp",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <BlockTime time={text}></BlockTime>;
          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "transaction" })),
        dataIndex: "nrOfTrx",
        key: "nrOfTrx",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "account_representative_block_table_res" })
        ),
        key: "nrOfTrx1",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "bytes" })),
        dataIndex: "size",
        key: "size",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "account_representative_block_table_prize" })
        ),
        key: "nrOfTrx2",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
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
      intl.formatMessage({ id: "account_representative_block_desc" },{block:total,trx:total});

    if (!loading && blocks.length === 0) {
      if (!EmptyState) {
        return (
          <div className="p-3 text-center  no-data">{t("no_blocks_found")}</div>
        );
      }
      return <EmptyState />;
    }

    let pagination = true;
    const paginationStatus = pagination
      ? {
          total: total,
          ...this.state.pagination
        }
      : pagination;

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
          pagination={paginationStatus}
          onChange={(page, pageSize) => {
            console.log('page',page, pageSize)
            this.load(page, pageSize);
          }}
        />
      </div>
    );
  }
}

export default injectIntl(Blocks);
