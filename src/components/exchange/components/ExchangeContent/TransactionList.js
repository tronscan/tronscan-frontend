import React, {Component} from "react";

import TranList from './TranList';
import Mytran from './Mytran';

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

export default class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  componentDidMount() {
    // this.fetch();
  }
  callback(key) {
    console.log(key);
  }
  render() {
    return (
      <div className="exchange__kline p-3">
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="交易记录" key="1">
          <TranList/>
        </TabPane>
        <TabPane tab="我的交易" key="2">
          <Mytran/>
        </TabPane>
      </Tabs>

    </div>
    )
  }
}
