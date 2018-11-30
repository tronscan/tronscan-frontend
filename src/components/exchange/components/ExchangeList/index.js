import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../../../utils/i18n";
import xhr from "axios/index";
import { map } from 'lodash'
import ExchangeTable from './Table';
import { Explain} from './Explain';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Input } from 'antd';
import {filter} from 'lodash'

const Search = Input.Search;


class ExchangeList extends React.Component {

  constructor() {
    super();

    this.state = {
      dataSource: [],
      time: null
    };
  }

  componentDidMount() {
    this.getExchanges()
    const getDataTime = setInterval(() => {
      this.getExchanges();
    }, 10000)

    this.setState({time: getDataTime})
  }

  componentWillUnmount() {
    const {time} = this.state
    clearInterval(time);
  }

  getExchanges = async () => {
      let {data} = await Client.getExchangesList();
      map(data, item => {
        if(item.up_down_percent.indexOf('-') != -1){
          item.up_down_percent = '-' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        }else{
          item.up_down_percent = '+' + Math.abs(Number(item.up_down_percent).toFixed(2)) + '%'
        }
        
      })
      let exchangesList = filter(data,function (o) {
          return  o.exchange_id != 1
      })
      this.setState({
          dataSource: exchangesList,
      });

  }


  render() {
    const { dataSource } = this.state;
    let {intl} = this.props;
    return (
      <div className="exchange-list mr-2">

        {/* 市场 */}
        <div className="exchange-list-mark p-3">
          {/* 标题 */}
          <div className="market-title">
              <h6>{tu("marks")}</h6>
              <div className="beginners-guide">
                  <i className="fas fa-book-open"></i>
                  <a href={intl.locale == 'zh'?"https://coin.top/production/js/2018-11-27-09-31-26DEX.pdf":"https://coin.top/production/js/20181130053556.pdf"} target="_blank" >{tu('beginners_guide')}</a>
              </div>
          </div>


          {/* filter 筛选 */}
          <div className="exchange-list__filter d-flex justify-content-between align-items-center mb-3">
            <ul className="d-flex ">
              {/* <li className="mr-2">全部</li> */}
              {/* <li><i className="fas fa-star mr-1" style={{ color: '#F5A623'}}></i>自选</li> */}
            </ul>
            {/* <Search
              placeholder="input search text"

              style={{ width: 200 }}
            /> */}
          </div>

          {/* 列表框 */}
          <PerfectScrollbar >
              <div className="exchange-list__table" style={styles.list}>
                <ExchangeTable dataSource={dataSource} props={this.props}/>
              </div>
          </PerfectScrollbar>
        </div>

        {/* 说明 */}
        <Explain/>
        
      </div>
    );
  }
}


export default injectIntl(ExchangeList);
const styles = {
    list: {
        height: 370,
    }
};