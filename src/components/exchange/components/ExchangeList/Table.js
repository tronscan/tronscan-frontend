import React from "react";
import { Table } from 'antd';
import {QuestionMark} from "../../../common/QuestionMark";
import {withRouter} from 'react-router-dom';
import queryString from 'query-string';

// export function ExchangeTable({dataSource}) {
class ExchangeTable extends React.Component {

  constructor() {
    super();

    this.state = {
      columns: [],
      dataSource: []
      
      
    };
  }

  getColumns() {
    const columns = [{
      title: '交易对',
      key: 'first_token_id',
      render: (text, record, index) => {
        return record.first_token_id +'/'+ record.second_token_id
      }
    }, {
      title: '最新价格',
      dataIndex: 'price',
      key: 'price',
    }, 
    {
      title: <span>涨幅</span>,
      dataIndex: 'up_down_percent',
      key: 'up_down_percent',
      render: (text, record, index) => {
        return (
          text.indexOf('-') != -1?
          <span className='col-red'>{text}</span>:
          <span className='col-green'>{text}</span>
        )
      }
    }];

    this.setState({columns})
  }

  getData() {
    const data = [
          {
            "exchange_id":1,//交易对ID
            "creator_address":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1",//创建者
            "first_token_id":"IGG",//第一个tokenID
            "first_token_balance":10000,//第一个token 余额
            "second_token_id":"TRX",//第二个tokenID
            "second_token_balance":200,//第二个token 余额
            "create_time":"1536416859000",//创建时间
            "exchange_name":"IGG/TRX",//交易对名称
            "price":0.0023,//交易对价格
            "volume":3345.342,//24H成交量
            "up_down_percent":"-6.64%",//涨幅
            "high":0.0025,//最高价格
            "low":0.002,//最低价格
        },{
          "exchange_id":2,//交易对ID
          "creator_address":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1",//创建者
          "first_token_id":"IGG",//第一个tokenID
          "first_token_balance":10000,//第一个token 余额
          "second_token_id":"MEETONE",//第二个tokenID
          "second_token_balance":200,//第二个token 余额
          "create_time":"1536416859000",//创建时间
          "exchange_name":"IGG/MEETONE",//交易对名称
          "price":0.0023,//交易对价格
          "volume":3345.342,//24H成交量
          "up_down_percent":"+6.64%",//涨幅
          "high":0.0025,//最高价格
          "low":0.002,//最低价格
      }
    ]
   //this.setState({dataSource: data})

    const { dataSource } = this.props;
    console.log('dataSource222=========',dataSource)
    const parsed = queryString.parse(this.props.location.search).token;
    
    if(!parsed && dataSource.length){
      this.onSetUrl(dataSource[0])
    }
  }

  onSetUrl(record) {
     this.props.history.push('/exchange?token='+ record.exchange_name)

  }

  componentDidMount() {
    this.getData()
    this.getColumns()
  }

  render() {
    const { columns} = this.state
    const { dataSource } = this.props;
    return (
      <Table 
        dataSource={dataSource} 
        columns={columns} 
        pagination={false}
        rowKey={(record, index) => {
          return index
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              this.onSetUrl(record)
            }
          }
        }}
      />
    )
  }
}

export default withRouter(ExchangeTable)