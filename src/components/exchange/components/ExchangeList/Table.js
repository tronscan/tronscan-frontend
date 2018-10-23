import React from "react";
import { Table } from 'antd';

export function ExchangeTable({dataSource}) {

  const columns = [{
    title: '交易对',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '最新价格',
    dataIndex: 'age',
    key: 'age',
  }, 
  // {
  //   title: '24H成交量',
  //   dataIndex: 'address',
  //   key: 'address',
  // }, 
  {
    title: '涨幅',
    dataIndex: 'key',
    key: 'key',
  },
  // {
  //   title: 'id',
  //   dataIndex: 'key',
  //   key: 'key',
  // }
];

  return (
    <Table 
      dataSource={dataSource} 
      columns={columns} 
      pagination={false}
      // scroll={{ y: 1240 }}
    />
  )
}