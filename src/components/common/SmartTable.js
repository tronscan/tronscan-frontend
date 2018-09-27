import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {Table, Input, Button, Icon} from 'antd';

export default class SmartTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterDropdownVisible: false,
      data: [],
      searchText: '',
      filtered: false,
      pagination: {
        position: 'both',
        showSizeChanger: true,
        defaultPageSize:20
        // showTotal: function (total) {
        //   return <div>{total} {tu('records')}</div>
        // }
      },
      loading: false,
    }
  }

  componentDidMount() {
    // this.fetch();
  }

  loadDatas = async (page = 1, pageSize = 40) => {
    let {filter} = this.state;
    let result = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });
    return result
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = {...this.state.pagination};
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  }

  fetch = (params = {}) => {
    this.setState({loading: true});
    if (!this.props.onPageChange) {
      this.setState({
        loading: false,
      });
      return;
    }
    this.props.onPageChange(params.page, params.pageSize);
    this.setState({
      loading: false,
    });
  }

  onInputChange = (e) => {
    this.setState({searchText: e.target.value});
  }
  onReset = () => {
    this.setState({searchText: ''}, () => {
      this.onSearch();
    });
  }
  onSearch = () => {
    let {tableData} = this.props;
    const {searchText} = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: tableData.map((record) => {
        const match = record.name.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          name: (
              <span>
              {record.name.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
                  text.toLowerCase() === searchText.toLowerCase()
                      ? <span key={i} className="highlight">{text}</span> : text // eslint-disable-line
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }
  setColumn = (column) => {
    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return 1;
        } else if (obj1[property] < obj2[property]) {
          return -1;
        } else {
          return 0;
        }

      }
    }

    let filter = {
      filterDropdown: (
          <div className="custom-filter-dropdown">
            <Input
                ref={ele => this.searchInput = ele}
                placeholder="Search name"
                value={this.state.searchText}
                onChange={this.onInputChange}
                onPressEnter={this.onSearch}
            />
            <Button type="primary" onClick={this.onSearch}>{tu("search")}</Button>
            <Button className="btn-secondary ml-1" onClick={this.onReset}>{tu("reset")}</Button>
          </div>
      ),
      filterIcon: <Icon type="filter" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
      filterDropdownVisible: this.state.filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible) => {

        this.setState({
          filterDropdownVisible: visible,
        }, () => {
          this.searchInput && this.searchInput.focus()
        });
      }
    }

    let columns = [];

    for (let col of column) {
      if (col.sorter && !col.filterDropdown) {
        let temp = {sorter: compare(col.key)}
        columns.push({...col, ...temp});
      }
      else if (!col.sorter && col.filterDropdown) {
        let temp = {...filter}
        columns.push({...col, ...temp});
      }
      else if (col.sorter && col.filterDropdown) {
        let temp = {sorter: compare(col.key), ...filter}
        columns.push({...col, ...temp});
      }
      else {
        columns.push(col);
      }

    }

    return columns;

  }

  render() {

    let {total, loading, data, column, bordered} = this.props;
    let columns = this.setColumn(column);
    return (
        <div className="card table_pos">
          <Table
              bordered={bordered}
              columns={columns}
              rowKey={(record, index) => {
                return index
                if (record.transactionHash) return record.transactionHash;
                if (record.address) return record.address;
                if (record.hash) return record.hash;
                if (record.id) return record.id;
                if (record.number) return record.number;
                if (record.name) return record.name;
              }}
              dataSource={data}
              pagination={{total: total, ...this.state.pagination}}
              loading={loading}
              onChange={this.handleTableChange}
          />
        </div>

    )
  }
}


