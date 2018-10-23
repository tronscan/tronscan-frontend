import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../../../utils/i18n";
import xhr from "axios/index";

import { ExchangeTable } from './Table';

import { Input } from 'antd';
const Search = Input.Search;


class ExchangeList extends React.Component {

  constructor() {
    super();

    this.state = {
      dataSource: [{
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号'
      },
      {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号'
      },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
      // {
      //   key: '2',
      //   name: '胡彦祖',
      //   age: 42,
      //   address: '西湖区湖底公园1号'
      // },
    ],
      
      
    };
  }

  componentDidMount() {
    
  }

  render() {
    const {dataSource } = this.state;
    return (
      <div className="exchange-list p-3 mr-2">
        {/* 标题 */}
        <h6>市场</h6>

        {/* filter 筛选 */}
        <div className="exchange-list__filter d-flex justify-content-between align-items-center mb-3">
          <ul className="d-flex ">
            {/* <li className="mr-2">全部</li> */}
            {/* <li><i className="fas fa-star mr-1" style={{ color: '#F5A623'}}></i>自选</li> */}
          </ul>
          {/* <Search
            placeholder="input search text"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          /> */}
        </div>

        {/* 列表框 */}
        <div className="exchange-list__table">
          <ExchangeTable dataSource={dataSource}/>
        </div>
      </div>
    );
  }
}


export default injectIntl(ExchangeList);
