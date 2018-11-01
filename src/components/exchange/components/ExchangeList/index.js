import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../../../utils/i18n";
import xhr from "axios/index";
import { map } from 'lodash'

import ExchangeTable from './Table';
import { Explain} from './Explain';

import { Input } from 'antd';
const Search = Input.Search;


class ExchangeList extends React.Component {

  constructor() {
    super();

    this.state = {
      dataSource: []
    };
  }

  componentDidMount() {
    this.getExchanges()
  }

  getExchanges = async () => {
      let {data} = await Client.getExchangesList();
      map(data.data, item => {
        if(item.up_down_percent.indexOf('-') != -1){
          item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        }else{
          item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        }
        
      })
      this.setState({
          dataSource: data.data,
      });

  }


  render() {
    const { dataSource } = this.state;
    return (
      <div className="exchange-list mr-2">

        {/* 市场 */}
        <div className="exchange-list-mark p-3">
          {/* 标题 */}
          <h6>市场</h6>

          {/* filter 筛选 */}
          <div className="exchange-list__filter d-flex justify-content-between align-items-center mb-3">
            <ul className="d-flex ">
              <li className="mr-2">全部</li>
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
            <ExchangeTable dataSource={dataSource} />
          </div>
        </div>

        {/* 说明 */}
        <Explain/>
        
      </div>
    );
  }
}


export default injectIntl(ExchangeList);
