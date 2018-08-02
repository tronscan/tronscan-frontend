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

    let columns=[];

    for(let col of column){
      if(col.sorter && !col.filterDropdown) {
        let temp={sorter: compare(col.key)}
        columns.push({...col,...temp});
      }
      else if(!col.sorter && col.filterDropdown){
        let temp={...filter}
        columns.push({...col,...temp});
      }
      else if(col.sorter && col.filterDropdown){
        let temp={sorter: compare(col.key), ...filter}
        columns.push({...col,...temp});
      }
      else{
        columns.push(col);
      }

    }

    return columns;
    /*
    const columns = [
      {
        title: 'rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: compare('rank')
      },
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        filterDropdown: (
            <div className="custom-filter-dropdown">
              <Input
                  ref={ele => this.searchInput = ele}
                  placeholder="Search name"
                  value={this.state.searchText}
                  onChange={this.onInputChange}
                  onPressEnter={this.onSearch}
              />
              <Button type="primary" onClick={this.onSearch}>Search</Button>
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
        },
      },
      {
        title: 'pair',
        dataIndex: 'pair',
        key: 'pair'
      },
      {
        title: 'volumeNative',
        dataIndex: 'volumeNative',
        key: 'volumeNative',
      }
    ];
    return columns;
    */
  }


  render() {
    let column = this.props.column;
    let columns = this.setColumn(column);
    let {tableData} = this.props;
    let {data} = this.state;
    if(data.length){
      tableData = this.state.data;
    }
/*
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
*/
   // markets = markets.sort(compare("rank")).slice(0, 99);


    return (


        <div className="card">
          <Table columns={columns} dataSource={tableData}/>
          {/*
            <table className="table table-hover bg-white m-0 table-striped">
            <thead className="thead-dark">
              <tr>
                <th style={{width: 25}}>{tu("rank")}</th>
                <th>{tu("exchange")}</th>
                <th className="d-none d-sm-table-cell" style={{width: 75}}>{tu("pair")}</th>
                <th className="d-none d-md-table-cell" style={{width: 100}}>{tu("volume")}</th>
                <th className="d-none d-md-table-cell" style={{width: 75}}>%</th>
                <th className="text-right" style={{width: 100}}>{tu("price")}</th>
              </tr>
            </thead>
            <tbody>
            {
              markets.map(market => (
                <tr key={market.rank}>
                  <th>
                    {market.rank}
                  </th>
                  <td>
                    <ExternalLink url={market.link}>{market.name}</ExternalLink>
                  </td>
                  <td className="d-none d-sm-table-cell" style={{width: 75}}>
                    <ExternalLink url={market.link}>{market.pair}</ExternalLink>
                  </td>
                  <td className="text-nowrap d-none d-md-table-cell">
                    <TRXPrice amount={market.volumeNative} />
                  </td>
                  <td className="text-nowrap d-none d-md-table-cell">
                    <FormattedNumber value={market.volumePercentage} maximumFractionDigits={2} />%
                  </td>
                  <td className="text-right">
                    $<FormattedNumber value={market.price} maximumFractionDigits={8} />
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
          */}
        </div>

    )
  }
}
