import React, {Component} from "react";
import TranList from './TranList';
import Mytran from './Mytran';
import {connect} from "react-redux";
import {tu, tv} from "../../../../utils/i18n";
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
        <TabPane tab={tu("TxRecord")} key="1">
          <TranList props={this.props}/>
        </TabPane>
        {
          currentWallet &&
          <TabPane tab={tu("my_transaction")} key="2">
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
