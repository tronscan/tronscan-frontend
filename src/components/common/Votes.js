import React, { Fragment } from "react";
import {
  FormattedDate,
  FormattedNumber,
  FormattedTime,
  injectIntl
} from "react-intl";
import { Sticky, StickyContainer } from "react-sticky";
import Paging from "./Paging";
import { Client } from "../../services/api";
import { AddressLink, ExternalLink } from "./Links";
import { tu, t } from "../../utils/i18n";
import { ONE_TRX } from "../../constants";
import SmartTable from "./SmartTable.js";
import { upperFirst } from "lodash";
import { TronLoader } from "./loaders";
import { withTimers } from "../../utils/timing";
import qs from "qs";
import { API_URL } from "../../constants";
import { Table, Input, Button, Icon } from "antd";
import { QuestionMark } from "../common/QuestionMark";

class Votes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      votes: [],
      page: 0,
      total: 0,
      pageSize: 25,
      totalVotes: 0,
      emptyState: props.emptyState,
      sort: "-votes",
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.load(1, 20, {});
  }

  onChange = (page, pageSize, sorter) => {
    this.load(page, pageSize, sorter);
  };

  load = async (page = 1, pageSize = 20, sorter) => {
    let { filter, getCsvUrl } = this.props;

    this.setState({ loading: true });

    const params = {
      sort: `${sorter.order === "descend" ? "-" : ""}${
        sorter.order ? sorter.columnKey : ""
      }`,
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter
    };
    const query = qs.stringify({ format: "csv", ...params });
    getCsvUrl && getCsvUrl(`${API_URL}/api/vote?${query}`);

    let { votes, total, totalVotes } = await Client.getVotes(params);

    this.setState({
      page,
      votes,
      total,
      totalVotes,
      loading: false,
      pagination: {
        ...this.state.pagination,
        total
      }
    });
  };
  customizedColumn = filter => {
    let { intl } = this.props;
    let { totalVotes } = this.state;
    let column_v = [
      {
        title: upperFirst(intl.formatMessage({ id: "voters" })),
        dataIndex: "voterAddress",
        key: "voterAddress",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return <AddressLink address={text} />;
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "votes_num" })),
        dataIndex: "votes",
        key: "votes",
        align: "left",
        width: "20%",
        className: "ant_table",
        sorter: true,
        defaultSortOrder: "descend",
        sortDirections: ["descend", "ascend"],
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        }
      },
      {
        title: (
          <span>
            {upperFirst(intl.formatMessage({ id: "account_percent" }))}
            <span className="ml-2">
              <QuestionMark
                placement="top"
                text="account_representative_voters_per_tip"
              />
            </span>
          </span>
        ),
        dataIndex: "candidateUrl",
        key: "candidateUrl",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Fragment>
              <FormattedNumber
                value={(record.votes / totalVotes) * 100}
                minimumFractionDigits={2}
              />
              %
            </Fragment>
          );
        }
      }
    ];
    let column_c = [
      {
        title: upperFirst(intl.formatMessage({ id: "witness" })),
        dataIndex: "candidateAddress",
        key: "candidateAddress",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Fragment>
              <span className="small">
                <AddressLink address={text} style={{ fontSize: "12px" }}>
                  {record.candidateName || text}
                </AddressLink>
              </span>
              <ExternalLink
                url={record.candidateUrl}
                style={{ fontSize: "12px" }}
              />
            </Fragment>
          );
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'candidate'})),
      //   dataIndex: 'candidateAddress',
      //   key: 'candidateAddress',
      //   align: 'left',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <Fragment><ExternalLink url={record.candidateUrl}/><br/>
      //       <span className="small"><AddressLink address={record.candidateAddress}/></span></Fragment>
      //   }
      // },

      {
        title: upperFirst(intl.formatMessage({ id: "votes_num" })),
        dataIndex: "votes",
        key: "votes",
        align: "left",
        width: "20%",
        // sorter: true,
        // defaultSortOrder: "descend",
        // sortDirections: ["descend", "ascend"],
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={text} />;
        }
      },
      {
        title: (
          <span>
            {upperFirst(intl.formatMessage({ id: "voter_percentage" }))}
            <span className="ml-2">
              <QuestionMark
                placement="top"
                text="account_vote_self_percent_tip"
              />
            </span>
          </span>
        ),
        dataIndex: "candidateUrl",
        key: "candidateUrl",
        align: "left",
        width: "20%",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Fragment>
              <FormattedNumber
                value={(record.votes / record.voterAvailableVotes) * 100}
                minimumFractionDigits={2}
              />
              %
            </Fragment>
          );
        }
      },
      {
        title: (
          <span>
            {upperFirst(intl.formatMessage({ id: "percentage" }))}
            <span className="ml-2">
              <QuestionMark
                placement="top"
                text="account_vote_total_percent_tip"
              />
            </span>
          </span>
        ),
        dataIndex: "candidateName",
        key: "candidateName",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Fragment>
              <FormattedNumber
                value={(record.votes / record.candidateTotalVotes) * 100}
                minimumFractionDigits={6}
              />
              %
            </Fragment>
          );
        }
      }
      // {
      //   title: (
      //     <span>
      //       {upperFirst(intl.formatMessage({id: 'account_vote_reward'}))}
      //       <span className="ml-2">
      //         <QuestionMark placement="top" text="account_vote_reward_tip"/>
      //       </span>
      //     </span>),
      //   dataIndex: 'percentage',
      //   key: 'percentage',
      //   align: 'right',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <Fragment><FormattedNumber value={(record.votes / totalVotes) * 100}
      //                                       minimumFractionDigits={2}/>%</Fragment>
      //   }
      // },
    ];

    if (filter.voter) {
      return column_c;
    }
    if (filter.candidate) {
      return column_v;
    }
  };

  render() {
    let {
      votes,
      page,
      total,
      pageSize,
      totalVotes,
      loading,
      emptyState: EmptyState = null
    } = this.state;
    let {
      showCandidate = true,
      showVoter = true,
      showVoterPercentage = true,
      filter
    } = this.props;

    let column = this.customizedColumn(filter);
    let { intl } = this.props;
    let tableInfo;
    if (filter.candidate) {
      tableInfo = intl.formatMessage(
        { id: "account_vote_candidate_total" },
        { num: total, votes: totalVotes }
      );
    }
    if (filter.voter) {
      tableInfo = intl.formatMessage(
        { id: "account_vote_voter_total" },
        { num: total }
      );
    }

    if (!loading && votes.length === 0) {
      if (!EmptyState) {
        return filter.candidate ? (
          <div className="p-3 text-center no-data">{t("no_voters_found")}</div>
        ) : (
          <div className="p-3 text-center no-data">{t("no_votes_found")}</div>
        );
      }
      return <EmptyState />;
    }

    return (
      <div className="token_black table_pos vote-wrap">
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
        {/* <SmartTable bordered={true} loading={loading} column={column} data={votes} total={total}
                      onPageChange={(page, pageSize) => {
                        this.load(page, pageSize)
                      }}/> */}
        <Table
          bordered={true}
          loading={loading}
          rowKey={(record, index) => {
            return index;
          }}
          dataSource={votes}
          columns={column}
          pagination={this.state.pagination}
          onChange={(page, pageSize, sorter) => {
            this.load(page.current, page.pageSize, sorter);
          }}
        />
      </div>
    );
  }
}

export default injectIntl(Votes);
