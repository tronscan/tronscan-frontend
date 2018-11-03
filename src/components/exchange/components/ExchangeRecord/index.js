import React, {Component} from "react";

import TranList from './TranList';
import Mytran from './Mytran';
import {connect} from "react-redux";

import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;
class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  componentDidMount() {
    // this.fetch();
  }
  callback(key) {
    // console.log(key);
  }
  render() {
    const { currentWallet } = this.props
    console.log(currentWallet? 1: 0)
    return (
      <div className="exchange__transactionlist p-3">
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab="交易记录" key="1">
          <TranList/>
        </TabPane>
        {
          currentWallet &&
          <TabPane tab="我的交易" key="2">
            <Mytran/>
          </TabPane>
        }
      </Tabs>

    </div>
    )
  }
}



function mapStateToProps(state) {
  return {
    currentWallet: state.wallet.current
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);
