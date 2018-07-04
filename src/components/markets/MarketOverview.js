import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {ExternalLink} from "../common/Links";
import {FormattedNumber} from "react-intl";
import {TRXPrice} from "../common/Price";
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

  onSearch = () => {
    let {markets} = this.props;
    const {searchText} = this.state;
    const reg = new RegExp(searchText, 'gi');
    this.setState({
      filterDropdownVisible: false,
      filtered: !!searchText,
      data: this.data.map((record) => {
        console.log(record);
        const match = record.name.match(reg);
        console.log(match);
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


  setColumn = () => {
    const columns = [
      {
        title: 'rank',
        dataIndex: 'rank',
        key: 'rank',
        sorter: true
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
        filterIcon: <Icon type="smile-o" style={{color: this.state.filtered ? '#108ee9' : '#aaa'}}/>,
        filterDropdownVisible: this.state.filterDropdownVisible,
        onFilterDropdownVisibleChange: (visible) => {
          console.log(visible);
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
        key: 'pair',
      },
      {
        title: 'volumeNative',
        dataIndex: 'volumeNative',
        key: 'volumeNative',
      }
    ];
    return columns;
  }
  setData = (markets) => {
    let data=[];
    if(markets.length) {
      markets.map((val) => {
        data.push({
          key: val.rank,
          rank: val.rank,
          name: val.name,
          pair: val.pair,
          volumeNative: val.volumeNative,
        });

      })
    }
  //  this.setState({data: data});
    return data;
  }

  render() {
    let columns = this.setColumn();
    let {markets} = this.props;
    let data = this.state;
    let tableData;
    if(data.length){
      tableData = this.state.data;
    }
    else{
      tableData= this.setData(markets);
    }

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

    markets = markets.sort(compare("rank")).slice(0, 99);
    //console.log(markets);


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


