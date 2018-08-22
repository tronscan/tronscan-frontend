import React, {Component, Fragment} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {TextField} from "../../utils/formHelper";
import {filter, trim, some, sumBy} from "lodash";
import {ASSET_ISSUE_COST, ONE_TRX} from "../../constants";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {Alert} from "reactstrap";
import {addDays, addHours, isAfter} from "date-fns";
import "react-datetime/css/react-datetime.css";
import DateTimePicker from "react-datetime";
import {Link} from "react-router-dom";
import {NumberField} from "../common/Fields";
import SweetAlert from "react-bootstrap-sweetalert";
import 'moment/min/locales';
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {NavLink, Route, Switch} from "react-router-dom";
import BasicInfo from "./BasicInfo.js"
import ExchangeRate from "./ExchangeRate.js"
import FreezeSupply from "./FreezeSupply.js"
import Confirm from "./Confirm.js"

class TokenCreate extends Component {

  constructor() {
    super();

    let startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    let endTime = new Date();
    endTime.setHours(0, 0, 0, 0);
    endTime.setDate(startTime.getDate() + 90);

    this.state = {
      privateKey: "",
      name: "",
      abbr: "",
      totalSupply: 100000,
      numberOfCoins: 1,
      numberOfTron: 1,
      startTime: startTime,
      endTime: endTime,
      description: "",
      url: "",
      confirmed: false,
      loading: false,
      isTokenCreated: false,
      minimumDate: Date.now,
      issuedAsset: null,
      errors: {
        name: null,
        totalSupply: null,
        description: null,
        url: null,
        tronAmount: null,
        tokenAmount: null,
        startDate: null,
        endDate: null,
        abbr: null,
      },

      valid: false,
      submitMessage: null,
      frozenSupply: [{amount: 0, days: 1}],
      step: 1,
    };
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };
  preSubmit = () => {
    let {intl} = this.props;
    let {checkbox} = this.state;
    if (!this.renderSubmit())
      return;
    this.setState({
      modal: (
          <SweetAlert
              info
              showCancel
              confirmBtnText={intl.formatMessage({id: 'confirm'})}
              confirmBtnBsStyle="success"
              cancelBtnText={intl.formatMessage({id: 'cancel'})}
              cancelBtnBsStyle="default"
              title={intl.formatMessage({id: 'confirm_token_issue'})}
              onConfirm={this.submit}
              onCancel={this.hideModal}
              style={{marginLeft: '-240px', marginTop: '-195px'}}
          >
          </SweetAlert>)
    });

  }

  submit = async () => {
    let {account} = this.props;
    let {privateKey} = this.state;

    this.setState({modal: null, loading: true, submitMessage: null});

    try {
      let {success} = await Client.createToken({
        address: account.address,
        name: trim(this.state.name),
        shortName: trim(this.state.abbr),
        totalSupply: this.state.totalSupply,
        num: this.state.numberOfCoins,
        trxNum: this.state.numberOfTron * ONE_TRX,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        description: this.state.description,
        url: this.state.url,
        frozenSupply: filter(this.state.frozenSupply, fs => fs.amount > 0),
      })(account.key);

      if (success) {
        this.setState({
          isTokenCreated: true,
        });
      } else {
        this.setState({
          submitMessage: (
              <Alert color="warning" className="text-center">
                {tu("token_creation_error")}
              </Alert>
          )
        });
      }

    } finally {
      this.setState({loading: false});
    }
  };

  isLoggedIn = () => {
    let {account} = this.props;
    return account.isLoggedIn;
  };

  componentDidMount() {
    this.setStartTime();
    this.checkExistingToken();
  }

  checkExistingToken = () => {

    let {wallet} = this.props;

    if (wallet !== null) {
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        if (token) {
          this.setState({
            issuedAsset: token,
          });
        }
      });
    }
  };

  setStartTime = async () => {
    let block = await Client.getLatestBlock();

    let startTime = addDays(new Date(block.timestamp), 1);
    let minimumTime = addHours(new Date(block.timestamp), 1);

    this.setState({
      startTime,
      minimumTime,
    });
  };

  isValidStartTime = (current, selectedDate) => {
    let {minimumTime} = this.state;
    return isAfter(current, minimumTime);
  };

  isValidEndTime = (current, selectedDate) => {
    let {startTime} = this.state;
    return isAfter(current, startTime);
  };

  componentDidUpdate(prevProps, prevState) {

  }

  renderSubmit = () => {
    let {isTokenCreated, privateKey} = this.state;
    let {account,intl} = this.props;

    let {wallet} = this.props;

    if (isTokenCreated) {
      this.setState({
            modal:
                <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                  {tu("token_issued_successfully")}<br/>
                  {tu("token_link_message_0")}{' '}
                  <Link to="/tokens/list">{tu("token_link_message_1")}</Link>{' '}
                  {tu("token_link_message_2")}
                </SweetAlert>
          }
      );
      return false
    }

    if (!wallet) {
      this.setState({
            modal:
                <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                  {tu("trx_token_wallet_requirement")}
                </SweetAlert>
          }
      );
      return false
    }

    if (wallet.balance < ASSET_ISSUE_COST) {
      this.setState({
            modal:
                <SweetAlert
                    error
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="success"
                    onConfirm={this.hideModal}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                  {tu("trx_token_fee_message")}
                </SweetAlert>
          }
      );
      return false
    }
    return true
  };


  changeStep = (step) => {
    this.setState({step: step});
  }
  changeState = (params) => {
    this.setState(params);
  }
  changeClassName = (stateStep, step) => {
    if (stateStep === step)
      return "ant-steps-item ant-steps-item-process"
    if (stateStep > step)
      return "ant-steps-item ant-steps-item-finish"
    if (stateStep < step)
      return "ant-steps-item ant-steps-item-wait"
  }

  render() {
    let {modal, numberOfCoins, numberOfTron, name, submitMessage, frozenSupply, url, confirmed, loading, issuedAsset, totalSupply, startTime, endTime, step} = this.state;
    let {match} = this.props;

    /*
        if (!this.isLoggedIn()) {
          return (
              <main className="container pb-3 token-create header-overlap">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="text-center p-3">
                          {tu("not_signed_in")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
          );
        }
        if (issuedAsset !== null) {
          return (
              <main className="container pb-3 token-create header-overlap">
                <div className="row">
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <div className="text-center p-3">
                          {tu("trx_token_account_limit")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
          );
        }
    */


    return (

        <main className="container pb-3 token-create header-overlap">
          {modal}
          <div className="row">
            <div className="col-sm-12 col-md-3 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <div className="ant-steps ant-steps-vertical">
                    <div className={this.changeClassName(step, 1)}>
                      <div className="ant-steps-item-tail"></div>
                      <div className="ant-steps-item-icon"><span className="ant-steps-icon">1</span></div>
                      <div className="ant-steps-item-content">
                        <div className="ant-steps-item-title">基本信息</div>
                        <div className="ant-steps-item-description">通证的基本信息</div>
                      </div>
                    </div>
                    <div className={this.changeClassName(step, 2)}>
                      <div className="ant-steps-item-tail"></div>
                      <div className="ant-steps-item-icon"><span className="ant-steps-icon">2</span></div>
                      <div className="ant-steps-item-content">
                        <div className="ant-steps-item-title">汇率设置</div>
                        <div className="ant-steps-item-description">规定每个通证的价格</div>
                      </div>
                    </div>
                    <div className={this.changeClassName(step, 3)}>
                      <div className="ant-steps-item-tail"></div>
                      <div className="ant-steps-item-icon"><span className="ant-steps-icon">3</span></div>
                      <div className="ant-steps-item-content">
                        <div className="ant-steps-item-title">锁仓设置</div>
                        <div className="ant-steps-item-description">可锁定部分通证固定时间</div>
                      </div>
                    </div>
                    <div className={this.changeClassName(step, 4)}>
                      <div className="ant-steps-item-tail"></div>
                      <div className="ant-steps-item-icon"><span className="ant-steps-icon">4</span></div>
                      <div className="ant-steps-item-content">
                        <div className="ant-steps-item-title">确认设置</div>
                        <div className="ant-steps-item-description">确认全部信息</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-12 col-md-9">
              <div className="card">
                <div className="card-body">
                  {
                    step === 1 &&
                    <BasicInfo state={this.state} nextStep={(number) => {
                      this.changeStep(number)
                    }} nextState={(params) => {
                      this.changeState(params)
                    }}/>
                  }
                  {
                    step === 2 &&
                    <ExchangeRate state={this.state} nextStep={(number) => {
                      this.changeStep(number)
                    }} nextState={(params) => {
                      this.changeState(params)
                    }}/>
                  }
                  {
                    step === 3 &&
                    <FreezeSupply state={this.state} nextStep={(number) => {
                      this.changeStep(number)
                    }} nextState={(params) => {
                      this.changeState(params)
                    }}/>
                  }
                  {
                    step === 4 &&
                    <Confirm state={this.state} nextStep={(number) => {
                      this.changeStep(number)
                    }} nextState={(params) => {
                      this.changeState(params)
                    }} submit={() => {
                      this.preSubmit()
                    }}/>
                  }

                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    tokens: state.tokens.tokens,
    account: state.app.account,
    wallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
  login,
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenCreate));
