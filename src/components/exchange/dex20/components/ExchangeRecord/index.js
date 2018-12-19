import React, {Component} from "react";
import TranList from './TranList';
import Mytran from './Mytran';
import Curorder from './Curorder'
import {connect} from "react-redux";
import {tu, tv} from "../../../../../utils/i18n";
import { Tabs } from 'antd';
import {injectIntl} from "react-intl";
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

  }
  render() {
    const { currentWallet } = this.props
    return (
      <div className="exchange__transactionlist p-3">
      <Tabs defaultActiveKey="1" onChange={this.callback}>
        <TabPane tab={tu("trc20_CurOrder")} key="1">
          <Curorder props={this.props}/>
        </TabPane>
        <TabPane tab={tu("trc20_TxRecord")} key="2">
          <TranList props={this.props}/>
        </TabPane>
        {
          currentWallet &&
          <TabPane tab={tu("trc20_my_transaction")} key="3">
            <Mytran props={this.props}/>
          </TabPane>
        }
      </Tabs>

    </div>
    )
  }
}



function mapStateToProps(state) {
  return {
    currentWallet: state.wallet.current,
    activeLanguage:  state.app.activeLanguage,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TransactionList));
