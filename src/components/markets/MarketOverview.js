import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {Table, Input, Button, Icon} from 'antd';

export default class MarketOverview extends Component {
  constructor() {
    super();

    this.state = {
      markets: [],
      filterDropdownVisible: false,
      data: [],
      columns: [],
      searchText: '',
      filtered: false,
    }
  }

  componentDidMount() {

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
              {record.name.split(new RegExp(`(${searchText})`, 'i')).map((text, i) => (
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
    let column = this.props.column;
    let columns = this.setColumn(column);
    let {tableData} = this.props;
    let {data} = this.state;
    if (data.length) {
      tableData = this.state.data;
    }
    return (
        <div className="card token_black markets">
          <Table columns={columns} dataSource={tableData}/>
        </div>

    )
  }
}
