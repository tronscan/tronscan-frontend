import React, {Component, Fragment} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {filter, trim, some, sumBy} from "lodash";
import {ASSET_ISSUE_COST, ONE_TRX} from "../../constants";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {addDays, addHours, isAfter} from "date-fns";
import "react-datetime/css/react-datetime.css";
import {Link} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import 'moment/min/locales';
import BasicInfo from "./BasicInfo.js"
import ExchangeRate from "./ExchangeRate.js"
import FreezeSupply from "./FreezeSupply.js"
import Confirm from "./Confirm.js"
import xhr from "axios/index";
import {TronLoader} from "../common/loaders";
import {Steps} from 'antd';

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
      totalSupply: '',
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
        totalSupply: '',
        description: null,
        url: null,
        tronAmount: null,
        tokenAmount: null,
        startDate: null,
        endDate: null,
        abbr: null,
      },
      logoUrl: null,
      logoData: null,
      valid: false,
      frozenSupply: [{amount: 0, days: 1}],
      showFrozenSupply: false,
      step: 1,
      steps: [
        {title: 'basic_info', content: 'basic_info_desc'},
        {title: 'exchange_setting', content: 'exchange_setting_desc'},
        {title: 'freeze_setting', content: 'freeze_setting_desc'},
        {title: 'confirm_setting', content: 'confirm_setting_desc'}
      ]
    };
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };
  redirectToTokenList = () => {
    this.setState({
      modal: null,
    }, () => {
      window.location.hash = "#/myToken";
    });
  }
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
    let {account, intl} = this.props;
    let {logoData} = this.state;

    this.setState({
      modal:
          <SweetAlert
              showConfirm={false}
              showCancel={false}
              cancelBtnBsStyle="default"
              title={intl.formatMessage({id: 'in_progress'})}
              style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <TronLoader/>
          </SweetAlert>,
      loading: true
    });

    try {
      let result = await Client.createToken({
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

      if (result.success) {
        let result_img = await xhr.post("http://18.216.57.65:20110/api/uploadLogo", {
          imageData: logoData,
          owner_address: account.address
        });

        this.setState({
          isTokenCreated: true,
          modal:
              <SweetAlert
                  success
                  confirmBtnText={intl.formatMessage({id: 'confirm'})}
                  confirmBtnBsStyle="success"
                  onConfirm={this.redirectToTokenList}
                  style={{marginLeft: '-240px', marginTop: '-195px'}}
              >
                {tu("token_issued_successfully")}<br/>
                {tu("token_link_message_0")}
                {tu("token_link_message_1")}
                {tu("token_link_message_2")}
              </SweetAlert>
        });
      } else {
        this.setState({
          modal: (
              <SweetAlert
                  error
                  confirmBtnText={intl.formatMessage({id: 'confirm'})}
                  confirmBtnBsStyle="success"
                  onConfirm={this.hideModal}
                  style={{marginLeft: '-240px', marginTop: '-195px'}}
              >
                {result.message}
              </SweetAlert>
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
    // this.setStartTime();
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
        } else {
          this.setState({
            issuedAsset: null,
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

  componentDidUpdate(prevProps) {
    let {wallet} = this.props;

    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken();
      }
    }
  }

  renderSubmit = () => {
    let {account, intl} = this.props;

    let {wallet} = this.props;

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

  render() {
    let {modal, issuedAsset, step, steps} = this.state;
    let {match} = this.props;
    const Step = Steps.Step

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
              <div className="col-md-12">
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


    return (

        <main className="container pb-3 token-create header-overlap token_black">
          {modal}
          <div className="row">
            <div className="col-sm-12 col-md-3 mt-3 mt-md-0">
              <div className="card">
                <div className="card-body">
                  <Steps direction="vertical" current={step - 1}>
                    {steps.map((item, index) => <Step key={index} title={tu(item.title)}
                                                      description={tu(item.content)}/>)}
                  </Steps>
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
