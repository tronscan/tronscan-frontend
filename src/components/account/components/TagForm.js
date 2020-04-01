/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import {Alert} from "reactstrap";
import {reloadWallet} from "../../../actions/wallet";
import SweetAlert from "react-bootstrap-sweetalert";
import {TronLoader} from "../../common/loaders";
import {login} from "../../../actions/app";
import isMobile from '../../../utils/isMobile';
import {withTronWeb} from "../../../utils/tronWeb";
import BigNumber from "bignumber.js"
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });


@withTronWeb
class TagForm extends React.Component {

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
      setAccount:'',
      tag:''
    };
  }

  /**
   * Check if the form is valid
   * @returns {*|boolean}
   */
  isValid = () => {
    let {to, token, amount, privateKey,balance} = this.state;
    let {account} = this.props;
    /*
       if (!privateKey || privateKey.length !== 64) {
         return false;
       }

      if(privateKey && privateKey.length === 64 && pkToAddress(privateKey) !== account.address){
         return false;
       }
    */
    return isAddressValid(to) && token !== "" && balance >= amount && amount > 0 && to !== account.address;
  };

  /**
   * Send the transaction
   */
  send = async () => {
    let {token} = this.state;
    let TokenType = token.substr(token.length - 5, 5);
    
  };


  confirmSend = () => {

    let {to, token, amount} = this.state;
    let list = token.split('-');
    let TokenName =  list[0];
    let TokenID;
    const style = isMobile? {}: {marginLeft: '-240px', marginTop: '-195px'};
    if (list[1] !== '_' && list[1] !== 'TRC20') {
      TokenID = list[1];
    }
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
              style={style}
          >
            {tu("transfer_confirm_info")}<br/>
            <span className="font-weight-bold">{' '}
              <FormattedNumber
                  maximumFractionDigits={7}
                  minimunFractionDigits={7}
                  value={amount}/>{' '}
              {TokenName}
              {TokenID && '[' + TokenID + ']'}
          </span><br/>
            {tu("to")}<br/>
            <div className="text-truncate">{to}</div>
          </SweetAlert>
      )
    });
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };




  

  componentDidMount() {
    this.refreshTokenBalances();

    //this.setAddress(this.props.to);

  }

  refreshTokenBalances = () => {
    let {account} = this.props;
    if (account.isLoggedIn) {
      this.props.reloadWallet();
    }
  };

  componentDidUpdate() {
    
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

  

  resetForm = () => {
    this.setState({
      amount: '',
      sendStatus: 'waiting',
      isLoading: false,
      to: "",
    });
  };

  setAddress = (address) => {
    this.setState({setAccount: address});

    Client.getAddress(address).then(data => {
      this.setState({
        toAccount: data ? data : null,
      });
    })
  };

  setTag = (tag) => {
    this.setState({tag: tag});

  }

  setNote = (note) => {
    this.setState({note});
  };



  render() {

    let {intl, tokenBalances, account, tokens20 } = this.props;
    let {isLoading, modal, to, note, setAccount, tag} = this.state;

    let isToValid = setAccount.length !== 0 && isAddressValid(setAccount);
   // let isPrivateKeyValid = privateKey && privateKey.length === 64 && pkToAddress(privateKey) === account.address;

   

    return (
        <form className="send-form">
          {modal}
          {isLoading && <TronLoader/>}
          <div className="form-group">
            <label><span>*</span>{tu("data_account")}</label>
            <div className="input-group mb-3">
              <input type="text"
                     onChange={(ev) => this.setAddress(ev.target.value)}
                     className={"form-control " + (!isToValid ? "is-invalid" : "")}
                     value={setAccount}/>
                <div className="invalid-feedback">
                  {tu("fill_a_valid_address")}
                </div>
            </div>
          </div>
          
          <div className="form-group">
            <label><span>*</span>{tu("account_tags_table_1")}</label>
            <div className="input-group mb-3">
              <input type="text"
                     onChange={(ev) => this.setTag(ev.target.value)}
                     className={"form-control " + (!isToValid ? "is-invalid" : "")}
                     value={tag}/>
              <div className="invalid-feedback">
                
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
    wallet: state.app.wallet,
    tokenBalances: state.account.tokens,
    tokens20: state.account.tokens20,
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TagForm))
