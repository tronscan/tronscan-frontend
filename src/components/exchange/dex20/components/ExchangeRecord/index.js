import React, { Component } from "react";
import TranList from "./TranList";
import Mytran from "./Mytran";
import Curorder from "./Curorder";
import { connect } from "react-redux";
import { tu, tv } from "../../../../../utils/i18n";
import { Tabs, Checkbox, Badge } from "antd";
import { injectIntl } from "react-intl";
import Lockr from "lockr";
const TabPane = Tabs.TabPane;
class TransactionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      showCurrent: Lockr.get("showCurrent") || false,
      isDot: false,
      flag: true
    };

    this.changeCheckbox = this.changeCheckbox.bind(this);
  }

  componentDidMount() {
    // this.fetch();
  }

  componentDidUpdate(prevProps) {
    let { delegateFailureList, app } = this.props;
    let { flag } = this.state;
    let uAddr = app.account ? app.account.address : "";

    let oldList = prevProps.delegateFailureList[uAddr] || [];
    let newList = delegateFailureList[uAddr] || [];
    if (newList && oldList && oldList.length > 0) {
      if (newList[0] && !oldList.includes(newList[0])) {
        this.setState({
          isDot: true
        });
      }
    } else if (newList && !oldList) {
      this.setState({
        isDot: true
      });
    }
  }
  callback = key => {
    if (key == 3) {
      this.setState({
        isLoad: true,
        isDot: false
      });
    } else {
      this.setState({
        isLoad: false
      });
    }
  };
  render() {
    const { currentWallet } = this.props;
    const { isLoad, showCurrent, isDot } = this.state;
    return (
      <div className="exchange__transactionlist p-3">
        <Tabs defaultActiveKey="1" onChange={this.callback}>
          <TabPane tab={tu("trc20_CurOrder")} key="1">
            <Curorder props={this.props} showCurrent={showCurrent} />
          </TabPane>
          {/* <TabPane tab={tu("trc20_TxRecord")} key="2">
          <TranList props={this.props}/>
        </TabPane> */}
          {currentWallet && (
            <TabPane
              tab={
                <span>
                  <Badge dot={isDot}>{tu("trc20_my_transaction")}</Badge>
                </span>
              }
              key="3"
            >
              <Mytran
                props={this.props}
                isLoad={isLoad}
                showCurrent={showCurrent}
              />
            </TabPane>
          )}
        </Tabs>
        <div className="filter-btn">
          <Checkbox
            checked={this.state.showCurrent}
            onChange={this.changeCheckbox}
          >
            {tu("trc20_see_currentParis")}
          </Checkbox>
        </div>
      </div>
    );
  }
  changeCheckbox(e) {
    this.setState({
      showCurrent: e.target.checked
    });

    Lockr.set("showCurrent", e.target.checked);
  }
}

function mapStateToProps(state) {
  return {
    currentWallet: state.wallet.current,
    activeLanguage: state.app.activeLanguage,
    delegateFailureList: state.exchange.delegateFailureList || {},
    app: state.app ? state.app : {}
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TransactionList));
