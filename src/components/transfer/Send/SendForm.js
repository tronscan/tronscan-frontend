/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import _, {find, round} from "lodash";
import { ACCOUNT_TRONLINK, API_URL, ONE_TRX, IS_MAINNET ,uuidv4} from "../../../constants";
import {Alert} from "reactstrap";
import {reloadWallet} from "../../../actions/wallet";
import SweetAlert from "react-bootstrap-sweetalert";
import {TronLoader} from "../../common/loaders";
import {login} from "../../../actions/app";
import Lockr from "lockr";
import xhr from "axios";
import {Select} from 'antd';
import isMobile from '../../../utils/isMobile';
import {withTronWeb} from "../../../utils/tronWeb";
import { FormatNumberByDecimals } from '../../../utils/number'
import { transactionResultManager, transactionResultManagerSun} from "../../../utils/tron"
import BigNumber from "bignumber.js"
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });

const { Option, OptGroup } = Select;

@withTronWeb
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
      decimals:'',
      balance:'',
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
    switch (TokenType) {
      case 'TRC10':
        if (Lockr.get("islogin") || this.props.wallet.type==="ACCOUNT_LEDGER" || this.props.wallet.type==="ACCOUNT_TRONLINK") {
          await this.tokenSendWithTronLink();
        } else {
          await this.token10Send();
        }
        break;
      case 'TRC20':
        await this.token20Send();
        break;
    }
  };

  tokenSendWithTronLink = async() => {
    let {to, token, amount, decimals, note } = this.state;
    let list = token.split('-');
    let TokenName = list[1];
    let { onSend, wallet} = this.props;

    let result, success;
    this.setState({isLoading: true, modal: null});
    if(IS_MAINNET){
        //MainChain
        if (TokenName === "_") {
            amount = this.Mul(amount,ONE_TRX);
            if(this.props.wallet.type==="ACCOUNT_LEDGER") {
                // result = await this.props.tronWeb().trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
                //     console.log(e)
                // });
               
                const unSignTransaction = await this.props.tronWeb().transactionBuilder.sendTrx(to, amount, wallet.address).catch(function (e) {
                  console.log(e)
                });
            
                //set transaction note
                const transactionWithNote = await this.props.tronWeb().transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
                result = await transactionResultManager(transactionWithNote, this.props.tronWeb());
            }
            if(this.props.wallet.type==="ACCOUNT_TRONLINK"){
                const unSignTransaction = await this.props.account.tronWeb.transactionBuilder.sendTrx(to, amount, wallet.address).catch(function (e) {
                  console.log(e)
                });
                //set transaction note
                const transactionWithNote = await this.props.account.tronWeb.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
                result = await transactionResultManager(transactionWithNote, this.props.account.tronWeb);

                // result = await this.props.account.tronWeb.trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
                //     console.log(e)
                // });
            }
            if (result) {
                success = result.result;
            } else {
                success = false;
            }

        } else {
            amount = this.Mul(amount,Math.pow(10, decimals));
            if(this.props.wallet.type==="ACCOUNT_LEDGER") {
              const unSignTransaction = await this.props.tronWeb().transactionBuilder.sendToken(to, amount, TokenName, wallet.address).catch(function (e) {
                console.log(e)
              });
              //set transaction note
              const transactionWithNote = await this.props.tronWeb().transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
              result = await transactionResultManager(transactionWithNote, this.props.tronWeb());
                // result = await this.props.tronWeb().trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
                //     console.log(e)
                // });
            }
            if(this.props.wallet.type==="ACCOUNT_TRONLINK"){
              const unSignTransaction = await this.props.account.tronWeb.transactionBuilder.sendToken(to, amount, TokenName, wallet.address).catch(function (e) {
                console.log(e)
              });
              //set transaction note
              const transactionWithNote = await this.props.account.tronWeb.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
              result = await transactionResultManager(transactionWithNote, this.props.account.tronWeb);

              // result = await this.props.account.tronWeb.trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
              //     console.log(e)
              // });
            }
            if (result) {
                success = result.result;
            } else {
                success = false;
            }
        }
    }else{
        //DAppChain
        if (TokenName === "_") {
          amount = this.Mul(amount,ONE_TRX);
          const unSignTransaction = await this.props.account.sunWeb.sidechain.transactionBuilder.sendTrx(to, amount, wallet.address).catch(function (e) {
            console.log(e)
          });
          
          let payload = unSignTransaction.__payload__;
          //set transaction note
          let transactionWithNote = await this.props.account.sunWeb.sidechain.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
          //set tronlink __payload__
          transactionWithNote.__payload__ = payload;
          result = await transactionResultManagerSun(transactionWithNote, this.props.account.sunWeb);
          // result = await this.props.account.sunWeb.sidechain.trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
          //     console.log(e)
          // });
        }else{
            amount = this.Mul(amount,Math.pow(10, decimals));
            const unSignTransaction = await this.props.account.sunWeb.sidechain.transactionBuilder.sendToken(to, amount, TokenName, wallet.address).catch(function (e) {
              console.log(e)
            });
            let payload = unSignTransaction.__payload__;
            //set transaction note
            let transactionWithNote = await this.props.account.sunWeb.sidechain.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
            //set tronlink __payload__
            transactionWithNote.__payload__ = payload;
            result = await transactionResultManagerSun(transactionWithNote, this.props.account.sunWeb);
            // result = await this.props.account.sunWeb.sidechain.trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
            //     console.log(e)
            // });
        }
        if (result) {
            success = result.result;
        } else {
            success = false;
        }
    }
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

  Mul (arg1, arg2) {
      let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
      m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
      resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
      return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }

  token10Send = async () => {
    let {to, token, amount, note, decimals} = this.state;
    let list = token.split('-');
    let TokenName =  list[1];
    let {account, onSend, wallet } = this.props;

    this.setState({isLoading: true, modal: null});

    if (TokenName === '_') {
      amount = this.Mul(amount,ONE_TRX);
    }else{
      amount = this.Mul(amount,Math.pow(10, decimals))
    }
    let result, success;
    if(IS_MAINNET){
        result= await Client.sendWithNote(TokenName, account.address, to, amount, note)(account.key);
        if (result) {
            success = result.success;
        } else {
            success = false;
        }
    } else{
        // if (TokenName === "_") {
        //     result = await this.props.account.sunWeb.sidechain.trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
        //         console.log(e)
        //     });
        // }else{
        //     result = await this.props.account.sunWeb.sidechain.trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
        //         console.log(e)
        //     });
        // }
        if (TokenName === "_") {
          const unSignTransaction = await this.props.account.sunWeb.sidechain.transactionBuilder.sendTrx(to, amount, wallet.address).catch(function (e) {
            console.log(e)
          });
          //set transaction note
          const transactionWithNote = await this.props.account.sunWeb.sidechain.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
          result = await transactionResultManagerSun(transactionWithNote, this.props.account.sunWeb);
          // result = await this.props.account.sunWeb.sidechain.trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
          //     console.log(e)
          // });
        }else{
            const unSignTransaction = await this.props.account.sunWeb.sidechain.transactionBuilder.sendToken(to, amount, TokenName, wallet.address).catch(function (e) {
              console.log(e)
            });
            //set transaction note
            const transactionWithNote = await this.props.account.sunWeb.sidechain.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8');
            result = await transactionResultManagerSun(transactionWithNote, this.props.account.sunWeb);
            // result = await this.props.account.sunWeb.sidechain.trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
            //     console.log(e)
            // });
        }
        if (result) {
            success = result.result;
        } else {
            success = false;
        }
    }


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

  token20Send = async () => {

    let {to, token, amount, decimals, note} = this.state;
    let TokenName = token.substring(0, token.length - 6);
    let {onSend,tokens20} = this.props;
    let tronWeb;
    let transactionId;
    this.setState({ isLoading: true, modal: null });
    let contractAddress = find(tokens20, t => t.name === TokenName).contract_address;
    if(IS_MAINNET) {
        if (this.props.wallet.type === "ACCOUNT_LEDGER") {
            tronWeb = this.props.tronWeb();
            // Send TRC20
            let unSignTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
                tronWeb.address.toHex(contractAddress),
                'transfer(address,uint256)',
                10000000, 0,
                [
                    {type: 'address', value: tronWeb.address.toHex(to)},
                    {type: 'uint256', value: new BigNumber(amount).shiftedBy(decimals).toString()}
                ],
                tronWeb.address.toHex(this.props.wallet.address),
            );
            if (unSignTransaction.transaction !== undefined)
                unSignTransaction = unSignTransaction.transaction;
                let transactionWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8'); 
                transactionWithNote.extra = {
                    to: to,
                    decimals: decimals,
                    token_name: TokenName,
                    amount: amount.toString(),
                    note:note
                }
            transactionId = await transactionResultManager(transactionWithNote, tronWeb)
        } else if (this.props.wallet.type === "ACCOUNT_TRONLINK" || this.props.wallet.type === "ACCOUNT_PRIVATE_KEY") {
              tronWeb = this.props.account.tronWeb;
            //  let contractInstance = await tronWeb.contract().at(contractAddress);
            //  transactionId = await contractInstance.transfer(to, new BigNumber(amount).shiftedBy(decimals).toString()).send();
          let unSignTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
            tronWeb.address.toHex(contractAddress),
            'transfer(address,uint256)',
            10000000, 0,
            [
                {type: 'address', value: tronWeb.address.toHex(to)},
                {type: 'uint256', value: new BigNumber(amount).shiftedBy(decimals).toString()}
            ],
            tronWeb.address.toHex(this.props.wallet.address),
          );

          if (unSignTransaction.transaction !== undefined)
              unSignTransaction = unSignTransaction.transaction;
         
          let transactionWithNote = await tronWeb.transactionBuilder.addUpdateData(unSignTransaction, note, 'utf8'); 
          if(this.props.wallet.type === "ACCOUNT_TRONLINK"){
            transactionWithNote.__payload__ = unSignTransaction.__payload__;
          }  
          transactionId = await transactionResultManager(transactionWithNote, tronWeb)
        }
    }else{
         if (this.props.wallet.type === "ACCOUNT_PRIVATE_KEY") {
              let sunWeb = this.props.account.sunWeb;
              let sendNum = new BigNumber(amount).shiftedBy(decimals).toString();
              let sendContractAddress = sunWeb.sidechain.address.toHex(contractAddress)
              let { transaction } = await sunWeb.sidechain.transactionBuilder.triggerSmartContract(
                sendContractAddress,
                'transfer(address,uint256)',
                {feeLimit:1000000},
                [
                  {'type':'address','value':to},
                  {'type':'uint256','value':sendNum}
                ]
              )
              let transactionWithNote = await sunWeb.sidechain.transactionBuilder.addUpdateData(transaction, note, 'utf8');
              transactionId = await transactionResultManagerSun(transactionWithNote,sunWeb)
          }else if(this.props.wallet.type === "ACCOUNT_TRONLINK"){
            let sunWeb = this.props.account.sunWeb;
            let sendNum = new BigNumber(amount).shiftedBy(decimals).toString();
            let sendContractAddress = sunWeb.sidechain.address.toHex(contractAddress)
            let { transaction } = await sunWeb.sidechain.transactionBuilder.triggerSmartContract(
              sendContractAddress,
              'transfer(address,uint256)',
              {feeLimit:1000000},
              [
                {'type':'address','value':to},
                {'type':'uint256','value':sendNum}
              ]
            )
          let transactionWithNote = await sunWeb.sidechain.transactionBuilder.addUpdateData(transaction, note, 'utf8'); 
          if(this.props.wallet.type === "ACCOUNT_TRONLINK"){
            transactionWithNote.__payload__ = transaction.__payload__;
          }   
          transactionId = await transactionResultManagerSun(transactionWithNote,sunWeb)
        }
    }
    if (transactionId) {
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

  setAmount = (amount) => {
    let {token, decimals} = this.state;
    let list = token.split('-');
    let TokenName = list.length>2?list[1]:list[0];
    let TokenType = list.length>2?list[2]:list[1];
    if (token && TokenType === 'TRC10') {
      if (TokenName === '_') {
        if (amount !== '') {
          amount = parseFloat(amount);
          amount = round(amount, 6);
          if (amount <= 0) {
            amount = 0;
          }
        }
      } else {
        if (amount !== '') {
          amount = parseFloat(amount);
          amount = round(amount, decimals);
          if (amount <= 0) {
            amount = 0;
          }
        }
      }
    } else if (token && TokenType === 'TRC20') {
      if (amount !== '') {
        amount = parseFloat(amount);
        amount = round(amount, decimals);
        if (amount <= 0) {
          amount = 0;
        }
      }
    }


    this.setState({
      amount,
    });
  };

  getSelectedTokenBalance = () => {
    let {tokenBalances,tokens20} = this.props;
    let {token} = this.state;
    let TokenType =  token.substr(token.length-5,5);
    let list = token.split('-')
    if (token && TokenType == 'TRC10') {
        let TokenName =  list[1];
        let balance = parseFloat(find(tokenBalances, t => t.map_token_id === TokenName).map_amount);
        let TokenDecimals = parseFloat(find(tokenBalances, t => t.map_token_id === TokenName).map_token_precision);
        if(TokenName == 'TRX'){
            this.setState({
                decimals: 6,
                balance:balance
            })
        }else{
            this.setState({
                decimals: TokenDecimals,
                balance:balance
            })
        }
    }else if(token && TokenType == 'TRC20'){
        let TokenName =  list[0];
        let balance = parseFloat(find(tokens20, t => t.name === TokenName).token20_balance_decimals);
        let TokenDecimals = parseFloat(find(tokens20, t => t.name === TokenName).decimals);
        this.setState({
            decimals: TokenDecimals,
            balance:balance
        })
    }

    return 0;
  };

  isAmountValid = () => {
    let {amount,balance} = this.state;
    let selectedTokenBalance = balance;
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
      //this.getTRC20Tokens();
    }
  };

  componentDidUpdate() {
    let {tokenBalances,tokens20} = this.props;
    tokenBalances = _.filter(tokenBalances, tb => tb.balance > 0);

    let {token} = this.state;
    if (!token && tokenBalances.length > 0) {
      this.setState(
        {
        token: tokenBalances[0].map_token_name + '-' + tokenBalances[0].map_token_id + '-TRC10',
        },
        () => this.getSelectedTokenBalance())

    } else if (!token && tokens20.length > 0 && tokenBalances.length === 0) {
      this.setState(
        {
          token: tokens20[0].name + '-TRC20',
        },
        () => this.getSelectedTokenBalance())
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
    let {balance} = this.state;
    this.setState({
      amount: balance,
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
      this.setState({ token: value },() =>{
          this.getSelectedTokenBalance();
      });

  }

  async getTRC20Tokens(){
      let {account} = this.props;
      let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50&uuid="+uuidv4);
      let tokens20 = result.data.trc20_tokens;
      const tronWebLedger = this.props.tronWeb();
      const { tronWeb } = this.props.account;
      if (this.props.wallet.type === "ACCOUNT_LEDGER"){
          for (let i = 0; i < tokens20.length; i++) {
              const item = tokens20[i];
              item.token20_name = item.name + '(' + item.symbol + ')';
              item.token_name_type = item.name + '-TRC20';
              let  contractInstance = await tronWebLedger.contract().at(item.contract_address);
              let  balanceData = await contractInstance.balanceOf(account.address).call();
              if(balanceData.balance){
                  item.balance = parseFloat(balanceData.balance.toString()) / Math.pow(10,item.decimals);
              }else{
                  item.balance = parseFloat(balanceData.toString()) / Math.pow(10,item.decimals);
              }
          }
          let tokens = _(tokens20)
              .filter(tb => tb.balance > 0)
              .sortBy(tb => -tb.balance)
              .value();

          this.setState({
              tokens20: tokens
          });
      }
      if(this.props.wallet.type === "ACCOUNT_TRONLINK" || this.props.wallet.type === "ACCOUNT_PRIVATE_KEY"){
          for (let i = 0; i < tokens20.length; i++) {
              const item = tokens20[i];
              item.token20_name = item.name + '(' + item.symbol + ')';
              item.token_name_type = item.name + '-TRC20';
              let  contractInstance = await tronWeb.contract().at(item.contract_address);
              let  balanceData = await contractInstance.balanceOf(account.address).call();
              if(balanceData.balance){

                  //item.balance = parseFloat(balanceData.balance.toString()) / Math.pow(10,item.decimals);
                  item.balance = FormatNumberByDecimals(balanceData.balance.toString() , item.decimals);
              }else{
                  item.balance = FormatNumberByDecimals(balanceData.toString() , item.decimals);
                  //item.balance = parseFloat(balanceData.toString()) / Math.pow(10,item.decimals);
              }
          }
          let tokens = _(tokens20)
              .filter(tb => tb.balance > 0)
              .sortBy(tb => -tb.balance)
              .value();

          this.setState({
              tokens20: tokens
          });
      }
    }

  render() {

    let {intl, tokenBalances, account, tokens20 } = this.props;
    let {isLoading, sendStatus, modal, to, note, toAccount, token, amount, privateKey,decimals} = this.state;
    tokenBalances = _(tokenBalances)
        .filter(tb => tb.balance > 0)
        .filter(tb => tb.map_token_id > 0 || tb.map_token_id == '_')
        .value();
    tokenBalances.map(item =>{
        item.token_name_type = item.map_token_name + '-' + item.map_token_id + '-TRC10';
        return item
    });
    tokens20.map(item =>{
        item.token_name_type =  item.name + '-TRC20';
        return item
    });
    let placeholder = '0.000000';
    let num = 0;
    if(decimals || decimals == 0){
       placeholder =num.toFixed(decimals)
    }

    let isToValid = to.length !== 0 && isAddressValid(to);
   // let isPrivateKeyValid = privateKey && privateKey.length === 64 && pkToAddress(privateKey) === account.address;
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
        <form className="send-form">
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
            (toAccount && toAccount.name) && <Alert color="info">
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
                            <Option value={tokenBalance.token_name_type} key={index}>
                                <span> {tokenBalance.map_token_name}
                                    {
                                        tokenBalance.map_token_id !== '_'?
                                            <span style={{fontSize:12,color:'#999',margin:'2px 4px 8px'}}>[ID:{tokenBalance.map_token_id}]</span>
                                            :""
                                    }
                                    ({tokenBalance.map_amount} {intl.formatMessage({id: "available"})})</span>

                            </Option>
                        ))
                    }
                </OptGroup>

                <OptGroup label={tu('TRC20_token')} key="TRC20">
                    {
                        tokens20.map((token, index) => (
                            <Option value={token.token_name_type} key={index}>
                                {/*<span>{token.name}</span>*/}
                                {/*({token.token20_balance} {intl.formatMessage({id: "available"})})*/}
                                {token.name} ({token.token20_balance_decimals} {intl.formatMessage({id: "available"})})
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
                     placeholder={placeholder}
              />
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
          {
             <div className="form-group">
                <label>{tu("note")}</label>
                <div className="input-group mb-3">
                <textarea
                    onChange={(ev) => this.setNote(ev.target.value)}
                    className={"form-control"}
                    value={note}
                    placeholder={this.props.wallet.type === "ACCOUNT_LEDGER"?intl.formatMessage({id: "enter_up_to_50_characters"}):''}
                    maxLength={this.props.wallet.type === "ACCOUNT_LEDGER"?50:1000000}
                />
                {
                  this.props.wallet.type === "ACCOUNT_LEDGER"?<div className="ledger-note-invalid">
                  {tu("fill_a_valid_ledger_note")}
                </div>:''
                }
                
              </div>
            </div> 
          }         
          
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SendForm))
