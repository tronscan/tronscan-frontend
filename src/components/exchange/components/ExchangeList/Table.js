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
      key: 'firstName',
      render: (text, record, index) => {
        return record.firstName +'/'+ record.lastName
      }
    }, {
      title: '最新价格',
      dataIndex: 'amount',
      key: 'amount',
    }, 
    {
      title: <span>涨幅 <QuestionMark text="这是提示"/></span>,
      dataIndex: 'range',
      key: 'range',
      render: (text, record, index) => {
        return <span className={text< 0? 'col-red': 'col-green'}>{text}</span>
      }
    }];

    this.setState({columns})
  }

  getData() {
    const data = [
      {
        firstName: 'IGG',
        lastName: 'TRX',
        amount: 1231323,
        range: 32
      },
      {
        firstName: 'IGG',
        lastName: 'TRX',
        amount: 123123132123,
        range: -32
      },
    ]
    this.setState({dataSource: data})
    
    
    const parsed = queryString.parse(this.props.location.search).token;
    
    if(!parsed){
      this.onSetUrl(data[0])
    }
  }

  onSetUrl(record) {
     this.props.history.push('/exchange?token='+ record.firstName +'_'+ record.lastName)
  }

  componentDidMount() {
    this.getData()
    this.getColumns()
  }

  render() {
    const {dataSource, columns} = this.state
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