import React, { Component } from "react";
import { tu } from "./../../utils/i18n";
import { Client } from "./../../services/api";
import { Table, Input, Button, Icon } from "antd";
import isMobile from "../../utils/isMobile";

export default class SmartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
      data: [],
      searchText: "",
      filtered: false,
      pagination: {
        showQuickJumper: true,
        position: props.position || "both",
        showSizeChanger: true,
        defaultPageSize: 20,
        current: props.current || 1

        // showTotal: function (total) {
        //   return <div>{total} {tu('records')}</div>
        // }
      },
      loading: false
    };
  }

  componentDidMount() {
    // this.fetch();
  }

  componentDidUpdate(prevProps) {
    const { current } = this.props;
    const { pagination } = this.state;
    if (prevProps.current != current) {
      this.setState({
        pagination: {
          ...pagination,
          current: current
        }
      });
    }
  }

  loadDatas = async (page = 1, pageSize = 40) => {
    let { filter } = this.state;
    let result = await Client.getTokens({
      sort: "rank",
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter
    });
    return result;
  };

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {
      ...this.state.pagination
    };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.fetch({
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters
    });
  };

  fetch = (params = {}) => {
    this.setState({
      loading: true
    });
    if (!this.props.onPageChange) {
      this.setState({
        loading: false
      });
      return;
    }
    this.props.onPageChange(params.page, params.pageSize);
    this.setState({
      loading: false
    });
  };

  onInputChange = e => {
    this.setState({
      searchText: e.target.value
    });
  };
  onReset = () => {
    this.setState(
      {
        searchText: ""
      },
      () => {
        this.onSearch();
      }
    );
  };
  onSearch = () => {
    let { tableData,filterDropdownVisible } = this.props;
    const { searchText } = this.state;
    const reg = new RegExp(searchText, "gi");
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData
        .map(record => {
          const match = record.name.match(reg);
          if (!match) {
            return null;
          }
          return {
            ...record,
            name: (
              <span>
                {" "}
                {record.name
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, "i")
                  )
                  .map(
                    (text, i) =>
                      text.toLowerCase() === searchText.toLowerCase() ? (
                        <span key={i} className="highlight">
                          {" "}
                          {text}{" "}
                        </span>
                      ) : (
                        text
                      ) // eslint-disable-line
                  )}{" "}
              </span>
            )
          };
        })
        .filter(record => !!record)
    });
  };
  setColumn = column => {
    function compare(property) {
      return function(obj1, obj2) {
        if (obj1[property] > obj2[property]) {
          return 1;
        } else if (obj1[property] < obj2[property]) {
          return -1;
        } else {
          return 0;
        }
      };
    }
    let filter = {
     
    };

    let columns = [];

    for (let col of column) {
      if (col.sorter && !col.filterDropdown) {
        let temp = {
          sorter: compare(col.key)
        };
        columns.push({
          ...col,
          ...temp
        });
      } else if (!col.sorter && col.filterDropdown) {
        let temp = {
          ...filter
        };
        columns.push({
          ...col,
          ...temp
        });
      } else if (col.sorter && col.filterDropdown) {
        let temp = {
          sorter: compare(col.key),
          ...filter
        };
        columns.push({
          ...col,
          ...temp
        });
      } else {
        columns.push(col);
      }
    }

    return columns;
  };

  render() {
    let {
      total,
      loading,
      data,
      column,
      bordered,
      pagination = true,
      scroll,
      Footer,
      locale,
      addr,
      transfers,
      nopadding,
      contractAddress,
      isPaddingTop,
    } = this.props;
    let columns = this.setColumn(column);
    const paginationStatus = pagination
      ? {
          total: total,
          ...this.state.pagination
        }
      : pagination;

    return (
      <div>
        {" "}
        {addr ? (
          <div
            className={
              "card table_pos table_pos_addr " +
              (data.length == 0 ? "table_pos_addr_data" : "") +
              (transfers == "address" ? " transfer-mt-100" : " transfer-pt-100") +
              (nopadding ? " transfer-mp-0" :'')

            }
          >
            <Table
              bordered={bordered}
              columns={columns}
              rowKey={(record, index) => {
                return index;
              }}
              dataSource={data}
              locale={locale}
              scroll={scroll}
              footer={Footer}
              pagination={paginationStatus}
              loading={loading}
              onChange={this.handleTableChange}
            />{" "}
          </div>
        ) : (
          <div className="card table_pos">
            <Table
              bordered={bordered}
              columns={columns}
              footer={Footer}
              rowKey={(record, index) => {
                return index;
              }}
              dataSource={data}
              locale={locale}
              scroll={scroll}
              pagination={paginationStatus}
              loading={loading}
              onChange={this.handleTableChange}
            />{" "}
          </div>
        )}{" "}
      </div>
    );
  }
}
