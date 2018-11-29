/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import SendOption from "./../SendOption";
import {find, round} from "lodash";
import {ONE_TRX,API_URL} from "../../../constants";
import {Alert} from "reactstrap";
import {reloadWallet} from "../../../actions/wallet";
import {FormattedNumber} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {TronLoader} from "../../common/loaders";
import {login} from "../../../actions/app";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import TronWeb from 'tronweb';
import _ from "lodash";
import xhr from "axios";
import {Select} from 'antd';
const { Option, OptGroup } = Select;

class SendForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      privateKey: "",
      to: props.to || "",
      token: "",
      amount: '',
      note: '',
      sendStatus: 'waiting',
      isLoading: false,
      toAccount: null,
      modal: null,
      tokens20:[],
    };
  }

  /**
   * Check if the form is valid
   * @returns {*|boolean}
   */
  isValid = () => {
    let {to, token, amount, privateKey} = this.state;
    let {account} = this.props;
    /*
       if (!privateKey || privateKey.length !== 64) {
         return false;
       }

      if(privateKey && privateKey.length === 64 && pkToAddress(privateKey) !== account.address){
         return false;
       }
    */
    return isAddressValid(to) && token !== "" && this.getSelectedTokenBalance() >= amount && amount > 0 && to !== account.address;
  };

  /**
   * Send the transaction
   */
  send = async () => {
    let {to, token, amount, note, privateKey} = this.state;
    let {account, onSend} = this.props;

    this.setState({isLoading: true, modal: null});

    if (token === "TRX") {
      amount = amount * ONE_TRX;
    }

    let {success} = await Client.sendWithNote(token, account.address, to, amount, note)(account.key);

    if (success) {
      this.refreshTokenBalances();

      onSend && onSend();
      //two work flows!

      this.setState({
        sendStatus: 'success',
        isLoading: false,
      });
    } else {
      this.setState({
        sendStatus: 'failure',
        isLoading: false,
      });

      setTimeout(() => {
        this.setState({
          sendStatus: 'waiting',
        });
      }, 2000);
    }
  };

  confirmSend = () => {

    let {to, token, amount} = this.state;
    this.setState({
      modal: (
          <SweetAlert
              info
              showCancel
              cancelBtnText={tu("cancel")}
              confirmBtnText={tu("confirm")}
              cancelBtnBsStyle="default"
              title={tu("confirm_transaction")}
              onConfirm={this.send}
              onCancel={this.hideModal}
              style={{marginLeft: '-240px', marginTop: '-195px'}}
          >
            {tu("transfer_confirm_info")}<br/>
            <span className="font-weight-bold">{' '}
              <FormattedNumber
                  maximumFractionDigits={7}
                  minimunFractionDigits={7}
                  value={amount}/>{' '}
              {token + ' '}
          </span><br/>
            {tu("to")}<br/>
            {to}
          </SweetAlert>
      )
    });
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  setAmount = (amount) => {


    if (amount !== '') {
      amount = parseFloat(amount);
      amount = round(amount, 6);
      if (amount <= 0) {
        amount = 0;
      }
    }

    this.setState({
      amount,
    });
  };

  getSelectedTokenBalance = () => {
    let {tokenBalances} = this.props;
    let {token} = this.state;

    if (token) {
      return parseFloat(find(tokenBalances, t => t.name === token).balance);
    }

    return 0;
  };

  isAmountValid = () => {
    let {amount} = this.state;
    let selectedTokenBalance = this.getSelectedTokenBalance();
    return amount !== 0 && amount !== '' && selectedTokenBalance >= amount;
  };

  componentDidMount() {
    this.refreshTokenBalances();

    //this.setAddress(this.props.to);

  }

  refreshTokenBalances = () => {
    let {account} = this.props;
    if (account.isLoggedIn) {
      this.props.reloadWallet();
      this.getTRC20Tokens();
    }
  };

  componentDidUpdate() {
    let {tokenBalances} = this.props;
    let {token} = this.state;
    if (!token && tokenBalances.length > 0) {
      this.setState({
        token: tokenBalances[0].name,
      })
    }
  }

  renderFooter() {

    let {sendStatus, isLoading} = this.state;

    if (sendStatus === 'success') {
      return (
          <Alert color="success" className="text-center">
            {tu("successful_send")}
          </Alert>
      )
    }

    if (sendStatus === 'failure') {
      return (
          <Alert color="danger" className="text-center">
            Something went wrong while submitting the transaction
          </Alert>
      )
    }

    return (
        <Fragment>

          {/*<Alert color="warning" className="text-center">*/}
          {/*{tu("address_warning")}*/}
          {/*</Alert>*/}
          <button
              type="button"
              disabled={!this.isValid() || isLoading}
              className="btn btn-primary btn-block btn-lg"
              onClick={this.confirmSend}>{tu("send")}</button>
        </Fragment>
    )
  }

  setMaxAmount = () => {

    let selectedTokenBalance = this.getSelectedTokenBalance();

    this.setState({
      amount: selectedTokenBalance,
    });
  };

  resetForm = () => {
    this.setState({
      amount: '',
      sendStatus: 'waiting',
      isLoading: false,
      to: "",
    });
  };

  setAddress = (address) => {
    this.setState({to: address});

    Client.getAddress(address).then(data => {
      this.setState({
        toAccount: data ? data : null,
      });
    })
  };

  setNote = (note) => {
    this.setState({note});
  };

  handleTokenChange = (value) => {
    console.log('token',value)
      this.setState({ token: value });
  }

  async getTRC20Tokens(){
      let {account} = this.props;
      const privateKey = account.key;
      const HttpProvider = TronWeb.providers.HttpProvider; // This provider is optional, you can just use a url for the nodes instead
      const fullNode = new HttpProvider('https://api.trongrid.io'); // Full node http endpoint
      const solidityNode = new HttpProvider('https://api.trongrid.io'); // Solidity node http endpoint
      const eventServer = 'https://api.trongrid.io/'; // Contract events http endpoint
      const tronWeb = new TronWeb(
          fullNode,
          solidityNode,
          eventServer,
          privateKey
      );
      let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
      let tokens20 = result.data.trc20_tokens;
          tokens20.map(async item =>{
              item.token20_name = item.name + '(' + item.symbol + ')';
              let  contractInstance = await tronWeb.contract().at(item.contract_address);
              let  balanceData = await contractInstance.balanceOf(account.address).call();
              if (typeof balanceData.balance === 'undefined' || balanceData.balance === null || !balanceData.balance) {

              }else{
                  item.balance = parseFloat(balanceData.balance.toString()) / Math.pow(10,item.decimals);
              }
              return item
          });
          console.log('tokens2011111111',tokens20)
          let tokens = _(tokens20)
              .filter(tb => tb.token20_name.toUpperCase() !== "TRX")
              .filter(tb => tb.balance > 0)
              .sortBy(tb => tb.token20_name)
              .value();
          this.setState({
              tokens20: tokens20
          });
          console.log('tokens2222',tokens)

  }
  render() {

    let {intl, tokenBalances, account} = this.props;
    let {isLoading, sendStatus, modal, to, note, toAccount, token, amount, privateKey,tokens20} = this.state;
    console.log('tokenBalances',tokenBalances)
    let isToValid = to.length !== 0 && isAddressValid(to);
    let isPrivateKeyValid = privateKey && privateKey.length === 64 && pkToAddress(privateKey) === account.address;
    let isAmountValid = this.isAmountValid();


    if (sendStatus === 'success') {
      return (
          <Fragment>
            <div className="alert alert-success text-center">
              {tu("successful_send")}
            </div>
            <div className="justify-content-center">
              <button className="btn btn-primary btn-block" onClick={this.resetForm}>
                {tu("make_another_transaction")}
              </button>
            </div>
          </Fragment>
      )
    }

    return (
        <form>
          {modal}
          {isLoading && <TronLoader/>}
          <div className="form-group">
            <label>{tu("to")}</label>
            <div className="input-group mb-3">
              <input type="text"
                     onChange={(ev) => this.setAddress(ev.target.value)}
                     className={"form-control " + (!isToValid ? "is-invalid" : "")}
                     value={to}/>
              <div className="invalid-feedback">
                {tu("fill_a_valid_address")}
                {/* tu("invalid_address") */}
              </div>
            </div>
          </div>
          {
            (toAccount && toAccount.name !== "") && <Alert color="info">
              <b>{toAccount.name}</b>
            </Alert>
          }
          <div className="form-group">
            <label>{tu("token")}</label>
            <div className="input-group mb-3"  style={{height:36}}>
              {/*<select*/}
                  {/*className="form-control"*/}
                  {/*onChange={(ev) => this.setState({token: ev.target.value})}*/}
                  {/*value={token}>*/}
                {/*{*/}
                  {/*tokenBalances.map((tokenBalance, index) => (*/}
                      {/*<SendOption key={index}*/}
                                  {/*name={tokenBalance.name}*/}
                                  {/*balance={tokenBalance.balance}/>*/}
                  {/*))*/}
                {/*}*/}
              {/*</select>*/}
              <Select
                  onChange={this.handleTokenChange}
                  value={token}
              >
                <OptGroup label={tu('TRC10_token')} key="TRC10">
                    {
                        tokenBalances.map((tokenBalance, index) => (
                            <Option value={tokenBalance.name} key={index}>
                                 {tokenBalance.name} ({tokenBalance.balance} {intl.formatMessage({id: "available"})})
                            </Option>
                        ))
                    }
                </OptGroup>

                <OptGroup label={tu('TRC20_token')} key="TRC20">
                    {
                        tokens20.map((token, index) => (
                            <Option value={token.name} key={index}>
                                {token.name} ({token.balance} {intl.formatMessage({id: "available"})})
                            </Option>
                        ))
                    }
                </OptGroup>
              </Select>
            </div>
          </div>
          <div className="form-group">
            <label>{tu("amount")}</label>
            <div className="input-group mb-3">
              <input type="number"
                     onChange={(ev) => this.setAmount(ev.target.value)}
                     className={"form-control " + (!isAmountValid ? "is-invalid" : "")}
                     value={amount}
                     placeholder='0.000000'/>
              <div className="input-group-append">
                <button className="btn btn-outline-secondary"
                        type="button"
                        onClick={this.setMaxAmount}>
                  MAX
                </button>
              </div>
              <div className="invalid-feedback">
                {tu("fill_a_valid_number")}
                {/* tu("insufficient_tokens") */}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>{tu("note")}</label>
            <div className="input-group mb-3">
            <textarea
                onChange={(ev) => this.setNote(ev.target.value)}
                className={"form-control"}
                value={note}
            />
              <div className="invalid-feedback">
                {tu("fill_a_valid_address")}
                {/* tu("invalid_address") */}
              </div>
            </div>
          </div>
          {this.renderFooter()}
        </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SendForm))
