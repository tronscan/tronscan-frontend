/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React, {Fragment} from "react";
import {FormattedNumber, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import _, {find, round} from "lodash";
import { ACCOUNT_TRONLINK, API_URL, ONE_TRX, IS_MAINNET } from "../../../constants";
import {Alert} from "reactstrap";
import {reloadWallet} from "../../../actions/wallet";
import SweetAlert from "react-bootstrap-sweetalert";
import {TronLoader} from "../../common/loaders";
import {login} from "../../../actions/app";
import Lockr from "lockr";
import xhr from "axios";
import qs from 'qs';
import {Select} from 'antd';
import isMobile from '../../../utils/isMobile';
import {withTronWeb} from "../../../utils/tronWeb";
import { FormatNumberByDecimals,FormatNumberByDecimalsBalance } from '../../../utils/number'
import { transactionResultManager, transactionResultManagerSun, transactionMultiResultManager } from "../../../utils/tron"
import { getContractTypesByHex } from "../../../utils/mutiSignHelper"
import rebuildList from "../../../utils/rebuildList";
import rebuildToken20List from "../../../utils/rebuildToken20List";



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
      from:props.wallet.address || '',
      token: "",
      amount: '',
      note: '',
      sendStatus: 'waiting',
      isLoading: false,
      toAccount: null,
      fromAccount:null,
      modal: null,
      decimals:'',
      balance:'',
      ownerOption:[],
      activeOption:[],
      permissionId:'',
      permissionTime:24,
      tokenBalances:[],
      tokens20:[],
      errmessage:true,
    };
  }

  /**
   * Check if the form is valid
   * @returns {*|boolean}
   */
  isValid = () => {
    let {from, permissionTime, permissionId} = this.state;
    return  isAddressValid(from) && permissionTime && permissionId !== "";
  };

  /**
   * Send the transaction
   */
  send = async () => {
    let {token} = this.state;
    let TokenType = token.substr(token.length - 5, 5);
    switch (TokenType) {
      case 'TRC10':
        await this.token10Send();
        break;
      case 'TRC20':
        await this.token20Send();
        break;
    }
  };
  Mul (arg1, arg2) {
    let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  }
  /*
   * send TRX  and send TRC10
  */
  token10Send = async() => {
    let {to, from, token, amount, decimals, permissionId, permissionTime } = this.state;
    let list = token.split('-');
    let TokenName = list[1];
    let { onSend, wallet} = this.props;
    let  tronWeb, transactionId;
    let result, success;
    this.setState({isLoading: true, modal: null});
    if(IS_MAINNET){
        /*
        *   MainChain send TRX
        */
        if (TokenName === "_") {
            amount = this.Mul(amount,ONE_TRX);
            if(this.props.wallet.type==="ACCOUNT_LEDGER") {
                result = await this.props.tronWeb().trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
                    console.log(e)
                });
            }

            if(this.props.wallet.type==="ACCOUNT_TRONLINK" || this.props.wallet.type==="ACCOUNT_PRIVATE_KEY"){

                //create transaction
                tronWeb = this.props.account.tronWeb;
                const unSignTransaction = await tronWeb.transactionBuilder.sendTrx(to, amount, from, {'permissionId':permissionId}).catch(function (e) {
                    console.log(e)
                });

                //get transaction parameter value to Hex
                let HexStr = Client.getSendHexStr(TokenName, from, to, amount);

                //sign transaction
                const SignTransaction = await transactionMultiResultManager(unSignTransaction, tronWeb, permissionId, permissionTime,HexStr);

                // xhr.defaults.headers.common["MainChain"] = 'MainChain';

                //xhr multi-sign transaction api
                let { data } = await xhr.post("https://list.tronlink.org/api/wallet/multi/transaction", {
                    "address": wallet.address,
                    "transaction": SignTransaction,
                    "netType":"main_net"
                });
                result = data.code;

            }

            if (result == 0) {
                success = true;
            } else {
                success = false;
            }

        } else {
            /*
            *   MainChain send TRC10
            */
            amount = this.Mul(amount,Math.pow(10, decimals));
            if(this.props.wallet.type==="ACCOUNT_LEDGER") {
                result = await this.props.tronWeb().trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
                    console.log(e)
                });
            }



            if(this.props.wallet.type==="ACCOUNT_TRONLINK" || this.props.wallet.type==="ACCOUNT_PRIVATE_KEY" ){
                //create transaction
                tronWeb = this.props.account.tronWeb;
                const unSignTransaction = await tronWeb.transactionBuilder.sendToken(to, amount, TokenName, from, {'permissionId':permissionId}).catch(function (e) {
                    console.log(e)
                });
                //get transaction parameter value to Hex
                let HexStr = Client.getSendHexStr(TokenName, from, to, amount);

                //sign transaction
                const SignTransaction = await transactionMultiResultManager(unSignTransaction, tronWeb, permissionId,permissionTime, HexStr);

                // xhr.defaults.headers.common["MainChain"] = 'MainChain';

                //xhr multi-sign transaction api
                let { data } = await xhr.post("https://list.tronlink.org/api/wallet/multi/transaction", {
                    "address": wallet.address,
                    "transaction": SignTransaction,
                    "netType":"main_net"
                });
                result = data.code;
            }

            if (result == 0) {
                success = true;
            } else {
                success = false;
            }
        }
    }else{
        //DAppChain
        if (TokenName === "_") {
            amount = this.Mul(amount,ONE_TRX);
            result = await this.props.account.sunWeb.sidechain.trx.sendTransaction(to, amount, {address: wallet.address}, false).catch(function (e) {
                console.log(e)
            });

        }else{
            amount = this.Mul(amount,Math.pow(10, decimals));
            result = await this.props.account.sunWeb.sidechain.trx.sendToken(to, amount, TokenName, {address:wallet.address}, false).catch(function (e) {
                console.log(e)
            });
        }
        if (result) {
            success = result.result;
        } else {
            success = false;
        }
    }
    if (success) {
      //this.refreshTokenBalances();

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

    let {from, to, token, amount, tokens20, decimals, permissionId,permissionTime } = this.state;
    let TokenName = token.substring(0, token.length - 6);
    let {onSend,wallet} = this.props;
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
            unSignTransaction.extra = {
                to: to,
                decimals: decimals,
                token_name: TokenName,
                amount: amount,
            }
            transactionId = await transactionResultManager(unSignTransaction, tronWeb)
        } else if (this.props.wallet.type === "ACCOUNT_TRONLINK" || this.props.wallet.type === "ACCOUNT_PRIVATE_KEY") {
             tronWeb = this.props.account.tronWeb;
            // Send TRC20
            let unSignTransaction = await tronWeb.transactionBuilder.triggerSmartContract(
                tronWeb.address.toHex(contractAddress),
                'transfer(address,uint256)',
                {'permissionId':permissionId},
                [
                    {type: 'address', value: tronWeb.address.toHex(to)},
                    {type: 'uint256', value: new BigNumber(amount).shiftedBy(decimals).toString()}
                ],
                tronWeb.address.toHex(from),
            );
            if (unSignTransaction.transaction !== undefined)
                unSignTransaction = unSignTransaction.transaction;

            //get transaction parameter value to Hex
            let HexStr = Client.getTriggerSmartContractHexStr(unSignTransaction.raw_data.contract[0].parameter.value);

            //sign transaction
            let SignTransaction = await transactionMultiResultManager(unSignTransaction, tronWeb, permissionId,permissionTime,HexStr);

            let { data } = await xhr.post("https://list.tronlink.org/api/wallet/multi/transaction", {
              "address": wallet.address,
              "transaction": SignTransaction,
              "netType":"main_net"
            });
            let result = data.code;
            if (result == 0) {
                transactionId = true;
            } else {
                transactionId = false;
            }
        }


    }else{
         if (this.props.wallet.type === "ACCOUNT_TRONLINK" || this.props.wallet.type === "ACCOUNT_PRIVATE_KEY") {
             let sunWeb = this.props.account.sunWeb;
             let sendNum = new BigNumber(amount).shiftedBy(decimals).toString();
             let sendContractAddress = sunWeb.sidechain.address.toHex(contractAddress)
             let { transaction } = await sunWeb.sidechain.transactionBuilder.triggerSmartContract(sendContractAddress,'transfer(address,uint256)',{feeLimit:1000000},[{'type':'address','value':to},{'type':'uint256','value':sendNum}])
             transactionId = await transactionResultManagerSun(transaction,sunWeb)
         }
    }
    if (transactionId) {
      //this.refreshTokenBalances();
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
    setActivePermissionDisable = (keys,contractTypesArr) =>{
      let { wallet } = this.props;
      let isDisable = false;
        keys.map((key,k) => {
            if(key.address == wallet.address) {
                if(contractTypesArr){
                    contractTypesArr.map((type,i) => {
                        if(type.id == 31) {
                            isDisable = true
                            return;
                        }
                    })
                }else{
                    isDisable = true
                    return;
                }
            }
        })
        return isDisable;
    }

  getPermissions = async (address) => {
      let { errmessage }  = this.state;
      let { wallet }  = this.props;
      let walletAddress = await Client.getAccountByAddressNew(address);
      if (walletAddress.activePermissions.length == 0) {
          let activePermissionsData = {
              "operations": "7fff1fc0033e0300000000000000000000000000000000000000000000000000",
              "keys": [
                  {
                      "address": address,
                      "weight": 1
                  }
              ],
              "threshold": 1,
              "id": 2,
              "type": "Active",
              "permission_name": "active"
          }
          walletAddress.activePermissions.push(activePermissionsData)
      }
      if(!walletAddress.ownerPermission){
          walletAddress.ownerPermission = {
              "keys": [
                  {
                      "address": address,
                      "weight": 1
                  }
              ],
              "threshold": 1,
              "permission_name": "owner"
          }
      }
      let ownerPermissions = walletAddress.ownerPermission || {};
      let activePermissions = walletAddress.activePermissions || [];
      let isAddressHasPermissionArr = [];
      let ownerOption = [];
      let activeOption = [];
      if(JSON.stringify(ownerPermissions) != "{}") {
          ownerOption.push({
              permissionName:ownerPermissions.permission_name,
              permissionValue:0,
              permissionDisable: this.setActivePermissionDisable(ownerPermissions.keys)
          })
      }
      if(activePermissions){
          //
          activePermissions.map((item,index) =>{
              activeOption.push({
                  permissionName:item.permission_name,
                  permissionValue:item.id,
                  permissionDisable: this.setActivePermissionDisable(item.keys,getContractTypesByHex(item.operations))
              })
              isAddressHasPermissionArr = _.concat(isAddressHasPermissionArr,ownerPermissions.keys,item.keys)
          })
      }
      let isAddressHasPermission =  _.find(isAddressHasPermissionArr, function(o) { return o.address == wallet.address });
      if(!isAddressHasPermission){
          this.setState({
              errmessage:false
          });
      }else{
          this.setState({
              errmessage:true
          });
      }
      this.setState({
          ownerPermissions,
          ownerOption,
          activePermissions,
          activeOption,
      });
  }


  setAmount = (amount) => {
    let {token, decimals} = this.state;
    let list = token.split('-');
    let TokenName =  list[1];
    let TokenType = list[2];
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
    let {token,tokenBalances,tokens20} = this.state;
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

  setPermissionAddress = (value) => {
      let { ownerPermissions, activePermissions } = this.state;
      let { wallet } = this.props;
      let signList = [];
      if(value == 0){
          ownerPermissions.keys.map((item, index) => {
              if (item.address != wallet.address) {
                  signList.push(item.address)
              }
          });
      }else{
          let activePermissionAddress = find(activePermissions, t => t.id === value).keys;
          activePermissionAddress.map((item, index) => {
              if (item.address != wallet.address) {
                  signList.push(item.address)
              }
          });
      }
      this.setState({
          signList
      });
  }

  isAmountValid = () => {
    let {amount,balance} = this.state;
    let selectedTokenBalance = balance;
    return amount !== 0 && amount !== '' && selectedTokenBalance >= amount;
  };

  componentDidMount() {
    let { onSend, wallet} = this.props;
    this.refreshTokenBalances(wallet.address);
    this.setSenderAddress(wallet.address);
  }

  refreshTokenBalances = async (address) => {
    let {account} = this.props;
    if (account.isLoggedIn && isAddressValid(address)){
      let {balances, trc20token_balances} = await Client.getAccountByAddressNew(address);
      let balances_new = rebuildList(balances, 'name', 'balance');
      let trc20token_balances_new  = rebuildToken20List(trc20token_balances, 'contract_address', 'balance');

      trc20token_balances_new && trc20token_balances_new.map(item => {
          item.token20_name = item.name + '(' + item.symbol + ')';
          item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
          item.token20_balance_decimals = FormatNumberByDecimalsBalance(item.balance, item.decimals);
          return item
      });

      this.setState({
          tokenBalances: balances_new,
          tokens20: trc20token_balances_new
      });
    }


  };

  componentDidUpdate() {
    let {tokenBalances,tokens20} = this.state;
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
    onMultiSignSend = () =>{
        let {onClose,onMultiSend} = this.props;
        let {from, permissionId, permissionTime } = this.state;
        onMultiSend(permissionId,permissionTime,from)
    }

  renderFooter() {
    let { sendStatus, isLoading } = this.state;


    let { onClose } = this.props;
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

        <button
            type="button"
            className="btn btn-default mr-2"
            onClick={onClose}>{tu("trc20_cancel")}</button>
          <button
              type="button"
              disabled={!this.isValid() || isLoading}
              className="btn btn-primary"
              onClick={this.onMultiSignSend}>{tu("trc20_confirm")}</button>
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

  setReceiverAddress = (address) => {
    this.setState({to: address});
    Client.getAddress(address).then(data => {
      this.setState({
        toAccount: data ? data : null,
      });
    })
  };

  setSenderAddress = (address) => {
    this.setState({from: address});
    this.getPermissions(address);
    this.refreshTokenBalances(address);
    Client.getAddress(address).then(data => {
        this.setState({
            fromAccount: data ? data : null,
        });
    })
  };

  onChangePermissionTime = e => {
    const { intl } = this.props;
    const numValue = e;
    const MaxAmount  = 24;
    let errorMess = '';
    let reg = /^(([1-9])|(1\d)|(2[0-4]))$/
    if (numValue) {
        if (Number(numValue) > MaxAmount) {
           //  errorMess = `${intl.formatMessage({id: 'SR_brokerage_save_verify'})}`;
        }
        if (!new RegExp(reg).test(numValue)) {
            // max value
            return;
        }
    }
    this.setState({
        permissionTime:numValue,
    });
  }

  setNote = (note) => {
    this.setState({note});
  };

  handleTokenChange = (value) => {
      this.setState({ token: value },() =>{
          this.getSelectedTokenBalance();
      });
  }

  handlePermissionChange =  (value) => {
      this.setState({ permissionId: value },() =>{
          this.setPermissionAddress(value);
      });
  }

  async getTRC20Tokens(){
      let {account} = this.props;
      let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
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

    let {intl, account } = this.props;
    let {tokenBalances, tokens20, isLoading, sendStatus, modal, to, from, note, toAccount, fromAccount, permissionTime,permissionId, signList, token, amount, privateKey,decimals, ownerOption, activeOption, errmessage} = this.state;
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
    let isFromValid = from.length !== 0 && isAddressValid(from);
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

          {/*sender*/}
          <div className="form-group">
            <label>{tu("from")}</label>
            <div className="input-group mb-3">
                <input type="text"
                       onChange={(ev) => this.setSenderAddress(ev.target.value)}
                       className={"form-control " + (!isFromValid || !errmessage ? "is-invalid" : "")}
                       value={from}/>
                <div className="invalid-feedback">
                    {!errmessage? tu('no_control_permission'):tu("fill_a_valid_address")}
                </div>
            </div>
          </div>

            {
                (fromAccount && fromAccount.name) && <Alert color="info">
                    <b>{fromAccount.name}</b>
                </Alert>
            }
            {/*permission*/}
          <div className="form-group">
                <label>{tu("permission")}</label>
                <div className="input-group mb-3"  style={{height:36}}>
                    <Select
                        onChange={this.handlePermissionChange}
                        placeholder="Select Permission"
                        value={permissionId}
                    >
                        <OptGroup label={tu('owner_permission')} key="owner_permission">
                            {
                                ownerOption.map((owner, index) => (
                                    <Option value={owner.permissionValue} key={'owner_'+index} disabled={!owner.permissionDisable}>
                                        <span> {owner.permissionName} </span>
                                    </Option>
                                ))
                            }
                        </OptGroup>

                        <OptGroup label={tu('active_permission')} key="active_permission">
                            {
                                activeOption.map((activer, index) => (
                                    <Option value={activer.permissionValue} key={'activer_'+index} disabled={!activer.permissionDisable}>
                                        <span> {activer.permissionName} </span>
                                    </Option>
                                ))
                            }
                        </OptGroup>
                    </Select>
                </div>
            </div>
            {
                signList && <div className="text-left" style={{color:'#a2a2a2'}}>
                    {tu('signature_account')}:  {
                    signList.map((address, index) => (
                            <span> { address } </span>
                    ))
                }
                </div>
            }
            {/*Failure time*/}
            <div className="form-group">
                <label>{tu("translations_failure_time")}(H)</label>
                <div className="input-group mb-3">
                    <input type="text"
                           onChange={(ev) => this.onChangePermissionTime(ev.target.value)}
                           className="form-control"
                           value={permissionTime}
                    />
                </div>
            </div>
            {/*Receiver*/}
          {/*<div className="form-group">*/}
            {/*<label>{tu("to")}</label>*/}
            {/*<div className="input-group mb-3">*/}
              {/*<input type="text"*/}
                     {/*onChange={(ev) => this.setReceiverAddress(ev.target.value)}*/}
                     {/*className={"form-control " + (!isToValid ? "is-invalid" : "")}*/}
                     {/*value={to}/>*/}
              {/*<div className="invalid-feedback">*/}
                {/*{tu("fill_a_valid_address")}*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*{*/}
            {/*(toAccount && toAccount.name) && <Alert color="info">*/}
              {/*<b>{toAccount.name}</b>*/}
            {/*</Alert>*/}
          {/*}*/}
          {/*<div className="form-group">*/}
            {/*<label>{tu("token")}</label>*/}
            {/*<div className="input-group mb-3"  style={{height:36}}>*/}
              {/*<Select*/}
                  {/*onChange={this.handleTokenChange}*/}
                  {/*value={token}*/}
              {/*>*/}
                {/*<OptGroup label={tu('TRC10_token')} key="TRC10">*/}
                    {/*{*/}
                        {/*tokenBalances.map((tokenBalance, index) => (*/}
                            {/*<Option value={tokenBalance.token_name_type} key={index}>*/}
                                {/*<span> {tokenBalance.map_token_name}*/}
                                    {/*{*/}
                                        {/*tokenBalance.map_token_id !== '_'?*/}
                                            {/*<span style={{fontSize:12,color:'#999',margin:'2px 4px 8px'}}>[ID:{tokenBalance.map_token_id}]</span>*/}
                                            {/*:""*/}
                                    {/*}*/}
                                    {/*({tokenBalance.map_amount} {intl.formatMessage({id: "available"})})</span>*/}

                            {/*</Option>*/}
                        {/*))*/}
                    {/*}*/}
                {/*</OptGroup>*/}

                {/*<OptGroup label={tu('TRC20_token')} key="TRC20">*/}
                    {/*{*/}
                        {/*tokens20.map((token, index) => (*/}
                            {/*<Option value={token.token_name_type} key={index}>*/}
                                {/*/!*<span>{token.name}</span>*!/*/}
                                {/*/!*({token.token20_balance} {intl.formatMessage({id: "available"})})*!/*/}
                                {/*{token.name} ({token.token20_balance_decimals} {intl.formatMessage({id: "available"})})*/}
                            {/*</Option>*/}
                        {/*))*/}
                    {/*}*/}
                {/*</OptGroup>*/}
              {/*</Select>*/}
            {/*</div>*/}
          {/*</div>*/}
          {/*<div className="form-group">*/}
            {/*<label>{tu("amount")}</label>*/}
            {/*<div className="input-group mb-3">*/}
              {/*<input type="number"*/}
                     {/*onChange={(ev) => this.setAmount(ev.target.value)}*/}
                     {/*className={"form-control " + (!isAmountValid ? "is-invalid" : "")}*/}
                     {/*value={amount}*/}
                     {/*placeholder={placeholder}*/}
              {/*/>*/}
              {/*<div className="input-group-append">*/}
                {/*<button className="btn btn-outline-secondary"*/}
                        {/*type="button"*/}
                        {/*onClick={this.setMaxAmount}>*/}
                  {/*MAX*/}
                {/*</button>*/}
              {/*</div>*/}
              {/*<div className="invalid-feedback">*/}
                {/*{tu("fill_a_valid_number")}*/}
                {/*/!* tu("insufficient_tokens") *!/*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}

          {/*<div className="form-group">*/}
            {/*<label>{tu("note")}</label>*/}
            {/*<div className="input-group mb-3">*/}
            {/*<textarea*/}
                {/*onChange={(ev) => this.setNote(ev.target.value)}*/}
                {/*className={"form-control"}*/}
                {/*value={note}*/}
            {/*/>*/}
              {/*<div className="invalid-feedback">*/}
                {/*{tu("fill_a_valid_address")}*/}
                {/*/!* tu("invalid_address") *!/*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*</div>*/}
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
