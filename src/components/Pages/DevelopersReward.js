import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { loadAccounts } from "../../actions/app";
import { tu } from "../../utils/i18n";
import { FormattedNumber, injectIntl } from "react-intl";
import { upperFirst, trim } from "lodash";
import { AddressLink } from "../common/Links";
import { CIRCULATING_SUPPLY, ONE_TRX } from "../../constants";
import { TRXPrice } from "../common/Price";
//import SmartTable from "../common/SmartTable.js";
import { TronLoader } from "../common/loaders";
//import { QuestionMark } from "../common/QuestionMark";
//import xhr from "axios/index";
import { Client } from "../../services/api";
import { Tooltip, Input, Table } from "antd";
import Note from "./Note";
//import { NameWithId } from "../common/names";
const { Search } = Input;

class developersReward extends Component {
  constructor() {
    super();

    this.state = {
      modal: null,
      loading: true,
      searchString: "",
      developers: [],
      total: 0,
      searchCriteria: "",
      pagination: {
        showQuickJumper: true,
        position: "bottom",
        showSizeChanger: true,
        defaultPageSize: 20,
        total: 0
      },
      filter: {
        sortField: "currentMonth",
        userSort: -1,
        order_current: "descend"
      }
    };
  }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 20) => {
    const { searchCriteria, filter } = this.state;
    this.setState({ loading: true });

    let { data, total } = await Client.getUserList({
      search: searchCriteria,
      pageSize: pageSize,
      page: page,
      ...filter
    });

    data.map((item, index) => {
      item.index = index + 1;
      // eslint-disable-next-line
      item.extraData = new Function("return " + item.extra)();
    });
    this.setState({
      loading: false,
      developers: data,
      total: total,
      pagination: {
        ...this.state.pagination,
        total
      }
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;

    const map = {
      descend: -1,
      ascend: 1
    };
    const sortMap = {
      currentYear: "currentYear",
      currentQuarter: "currentQuarter",
      currentMonth: "currentMonth"
    };
    this.setState(
      {
        pagination: pager,
        filter: {
          ...this.state.filter,
          sortField: sortMap[sorter.columnKey] || "currentMonth",
          userSort: map[sorter.order] || "-1",
          order_current: sorter.order
        }
      },
      () => this.loadAccounts(pager.current, pager.pageSize)
    );
  };

  hideModal = () => {
    this.setState({
      modal: null
    });
  };

  showNote = index => {
    // eslint-disable-next-line 
    let notes = new Function("return " + this.state.developers[index].note)();
    this.setState({
      modal: <Note notes={notes} onHide={this.hideModal} />
    });
  };
  onChange = (page, pageSize) => {
    this.loadAccounts(page, pageSize);
  };

  onSearchChange = searchCriteria => {
    this.setState(
      {
        searchCriteria: trim(searchCriteria)
      },
      () => {
        this.loadAccounts();
      }
    );
  };

  renderAccounts() {
    let { developers } = this.state;
    if (developers.length === 0) {
      return;
    }
    return (
      <Fragment>
        <div className="table-responsive">
          <table className="table table-striped m-0">
            <thead className="thead-dark">
              <tr>
                <th>{tu("address")}</th>
                <th className="d-md-table-cell">{tu("supply")}</th>
                <th className="d-md-table-cell">{tu("power")}</th>
                <th>{tu("balance")}</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((account, index) => (
                <tr key={account.address}>
                  <th>
                    <AddressLink address={account.address} />
                  </th>
                  <td className="d-md-table-cell text-nowrap">
                    <FormattedNumber
                      value={
                        (account.balance / ONE_TRX / CIRCULATING_SUPPLY) * 100
                      }
                      minimumFractionDigits={8}
                      maximumFractionDigits={8}
                    />{" "}
                    %
                  </td>
                  <td className="text-nowrap d-md-table-cell">
                    <FormattedNumber value={account.power / ONE_TRX} />
                  </td>
                  <td className="text-nowrap">
                    <TRXPrice amount={account.balance / ONE_TRX} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }

  customizedColumn = () => {
    let { intl } = this.props;
    let { filter } = this.state;
    const defaultImg = require("../../images/logo_default.png");

    let column = [
      // {
      //     title: upperFirst(intl.formatMessage({id: 'rank'})),
      //     dataIndex: 'tagName',
      //     align: 'left',
      //     render: (text, record, index) => {
      //         return <div>{record.index}</div>
      //     }
      // },
      {
        title: upperFirst(intl.formatMessage({ id: "developers_username" })),
        dataIndex: "name",
        key: "name",
        align: "left",
        className: "ant_table",
        width: "40%",
        render: (text, record, index) => {
          return (
            <div>
              {record.extraData && record.extraData.imgUrl !== "null" ? (
                <div>
                  <img
                    src={record.extraData.imgUrl}
                    width="20"
                    height="20"
                    alt={"@" + record.name}
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = defaultImg;
                    }}
                  />
                  <span className="ml-2">{record.name}</span>
                </div>
              ) : (
                <div>
                  <img
                    src={require(`../../images/developerReward/avatars.png`)}
                    width="20"
                    height="20"
                    alt={"@" + record.name}
                  />
                  <span className="ml-2">{record.name}</span>
                </div>
              )}
            </div>
          );
        }
      },

      {
        title: upperFirst(
          intl.formatMessage({ id: "developers_current_year" })
        ),
        dataIndex: "currentYear",
        key: "currentYear",
        align: "center",
        className: "ant_table",
        sorter: true,
        sortOrder: filter.sortField === "currentYear" && filter.order_current,
        render: (text, record, index) => {
          return (
            <div>
              <FormattedNumber value={record.currentYear} />
            </div>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "developers_current_quarter" })
        ),
        dataIndex: "currentQuarter",
        key: "currentQuarter",
        align: "center",
        sorter: true,
        sortOrder:
          filter.sortField === "currentQuarter" && filter.order_current,
        render: (text, record, index) => {
          return (
            <div>
              <FormattedNumber value={record.currentQuarter} />
            </div>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "developers_current_month" })
        ),
        dataIndex: "currentMonth",
        key: "currentMonth",
        align: "center",
        className: "ant_table",
        sorter: true,
        sortOrder: filter.sortField === "currentMonth" && filter.order_current,
        render: (text, record, index) => {
          return (
            <div>
              <FormattedNumber value={record.currentMonth} />
            </div>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_action" })
        ),
        dataIndex: "action",
        key: "action",
        align: "right",
        className: "ant_table",
        // width: '15%',
        render: (text, record, index) => {
          return (
            <a
              href="javascript:;"
              onClick={() => {
                this.showNote(index);
              }}
            >
              {tu("developers_view_points")}
            </a>
          );
        }
      }
    ];
    return column;
  };

  render() {
    let { match, intl } = this.props;
    let { total, loading, rangeTotal = 0, developers, modal } = this.state;

    let column = this.customizedColumn();
    let tableInfo =
      intl.formatMessage({ id: "view_total" }) +
      " " +
      rangeTotal +
      " " +
      intl.formatMessage({ id: "account_unit" }) +
      "<br/>(" +
      intl.formatMessage({ id: "table_info_big" }) +
      ")";
    let tableInfoTip =
      intl.formatMessage({ id: "table_info_account_tip1" }) +
      " " +
      rangeTotal +
      " " +
      intl.formatMessage({ id: "table_info_account_tip2" });
    return (
      <main className="container header-overlap pb-3 token_black">
        {modal}
        {loading && (
          <div className="loading-style">
            <TronLoader />
          </div>
        )}
        <div className="row mt-2">
          {total ? (
            <p className="developers_reward_tip">
              {tu("developers_reward_tip")}
            </p>
          ) : (
            ""
          )}

          <div className="col-md-12 table_pos trc20-ad-bg">
            {total ? (
              <div
                className="table_pos_info d-none d-md-block"
                style={{ left: "auto" }}
              >
                <div>
                  {tu("view_total")} {total} {tu("developers_account")}
                </div>
              </div>
            ) : (
              ""
            )}
            <div className="table_pos_search" style={{ right: "15px" }}>
              <Search
                placeholder={intl.formatMessage({ id: "developers_search" })}
                enterButton={intl.formatMessage({ id: "search" })}
                size="large"
                onSearch={value => this.onSearchChange(value)}
              />
            </div>
            <div className="card table_pos table_pos_addr table_pos_addr_data">
              <Table
                columns={column}
                rowKey={(record, index) => index}
                dataSource={developers}
                loading={loading}
                onChange={this.handleTableChange}
                pagination={this.state.pagination}
                bordered={true}
                rowClassName={(record, index) => {
                  if (record.index < 6) {
                    return "trc20-star-ad";
                  }
                }}
              />
            </div>
            {/* {total ? (
              <p className="developers_tip_bottom">{tu("developers_niTron")}</p>
            ) : (
              ""
            )} */}
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.app.accounts
  };
}

const mapDispatchToProps = {
  loadAccounts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(developersReward));