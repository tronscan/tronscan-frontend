/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
import {NumberField} from "../common/Fields";
import {transactionResultManager} from "../../utils/tron";
import Lockr from "lockr";
import {withTronWeb} from "../../utils/tronWeb";

@connect(
  state => ({
    account: state.app.account,
    wallet: state.app.wallet,
    tokenBalances: state.account.tokens,
    trxBalance: state.account.trxBalance || state.account.balance,
  }),
  {
    reloadWallet
  }
)
@injectIntl
@withTronWeb
export default class FreezeBalanceModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      confirmed: false,
      amount: "",
      resources: [
        {
          label:"gain_bandwith",
          value:0
        },
        {
          label:"gain_energy",
          value:1
        }
      ],
      selectedResource:0,
      receiver:''
    };
  }

  componentDidMount() {
    this.props.reloadWallet();
  }

  hideModal = () => {
    let {onHide} = this.props;
    onHide && onHide();
  };

  confirmModal = () => {
    let {onConfirm} = this.props;
    let {amount} = this.state;
    onConfirm && onConfirm({
      amount
    });
  };

  onAmountChanged = (value) => {

    let {trxBalance} = this.props;


    let amount = parseInt(value);
    if (!isNaN(amount)) {
      amount = amount > 0 ? Math.floor(amount) : Math.abs(amount);
      // amount = amount < trxBalance ? amount : trxBalance;
    } else {
      amount = "";
    }



    this.setState({
      amount,
    });
  };

  freeze = async () => {

    let {account, onError, wallet} = this.props;
    let {amount, selectedResource, receiver,confirmed } = this.state;
    if(!confirmed){
      return;
    }
    let res, type, result;
    this.setState({loading: true});

    try {

      if (Lockr.get("islogin") || this.props.wallet.type==="ACCOUNT_LEDGER" || this.props.wallet.type==="ACCOUNT_TRONLINK") {
        const tronWebLedger = this.props.tronWeb();
        const { tronWeb } = this.props.account;
        if (!selectedResource) {
          type = 'BANDWIDTH';
        } else {
          type = 'ENERGY';
        }


        if(this.props.wallet.type==="ACCOUNT_LEDGER") {
          let unSignTransaction;
          if(receiver==="") {
             unSignTransaction = await tronWebLedger.transactionBuilder.freezeBalance(
                amount * ONE_TRX,
                3,
                type,
                wallet.address);
          }else{
             unSignTransaction = await tronWebLedger.transactionBuilder.freezeBalance(
                amount * ONE_TRX,
                3,
                type,
                wallet.address, receiver);
          }
           result = await transactionResultManager(unSignTransaction, tronWebLedger);
        }
        if(this.props.wallet.type==="ACCOUNT_TRONLINK"){
          let unSignTransaction;
          if(receiver==="") {
             unSignTransaction = await tronWeb.transactionBuilder.freezeBalance(amount * ONE_TRX, 3, type, tronWeb.defaultAddress.base58).catch(e => false);
          }else{
             unSignTransaction = await tronWeb.transactionBuilder.freezeBalance(amount * ONE_TRX, 3, type, tronWeb.defaultAddress.base58,receiver).catch(e => false);
          }
           result = await transactionResultManager(unSignTransaction,tronWeb)
        }

        res = result;
      } else {
        let {success} = await Client.freezeBalance(account.address, amount * ONE_TRX, 3, selectedResource, receiver)(account.key);
        res = success
      }


      if (res) {
        this.confirmModal({amount});
        this.setState({loading: false});
      } else {
        throw new Error("Failed to freeze");
      }

    } catch (e) {
      console.error(e);
      onError && onError();
    }

  };

  resourceSelectChange = (value) => {
    this.setState({
        selectedResource: Number(value)
    });
  };
  setReceiverAddress = (address) => {
    this.setState({receiver: address});
  };
  render() {

    let {receiver, amount, confirmed, loading, resources, selectedResource} = this.state;
    let {trxBalance, frozenTrx, intl} = this.props;
    trxBalance = !trxBalance ? 0 :  trxBalance;
    let isValid =  (amount > 0 && trxBalance >= amount && confirmed);

    return (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
          <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
            {tu("freeze")}
          </ModalHeader>
          <ModalBody className="text-center _freezeBody">

              <div className="form-group">
                <div className="text-left _power">{tu("current_power")}: <span
                    style={{fontWeight: 800}}>{frozenTrx / ONE_TRX}</span>
                </div>
              </div>
            <div className="form-group">
            <input type="text"
                   placeholder={intl.formatMessage({id: 'receive_address'})}
                   onChange={(ev) => this.setReceiverAddress(ev.target.value)}
                   className="form-control"
                   value={receiver}/>
            </div>
            <div className="form-group">
                <div style={{position:'relative'}}>
                  <button type="button" onClick={ ()=>{
                    this.setState({ amount: Math.floor(trxBalance) })
                  }} style={styles.maxButton}>MAX</button>
                  <NumberField
                      min={1}
                      decimals={0}
                      value={amount}
                      placeholder={intl.formatMessage({id: 'trx_amount'})}
                      className="form-control text-left"
                      style={{marginTop: '12px', background: "#F3F3F3", border: "1px solid #EEEEEE"}}
                      onChange={this.onAmountChanged}/>
                </div>
              </div>
              <div className="form-group">
                <select className="custom-select"
                  value={selectedResource}
                  onChange={(e) => {this.resourceSelectChange(e.target.value)}}>
                    {
                        resources.map((resource, index) => {
                            return (
                                <option key={index} value={resource.value}>{intl.formatMessage({id: resource.label})}</option>

                            )
                        })
                    }
                </select>
              </div>
              <div className="form-check">
                <input type="checkbox"
                       className="form-check-input"
                       onChange={(ev) => this.setState({confirmed: ev.target.checked})}/>
                <label className="form-check-label _freeze">
                  {tu("token_freeze_confirm_message_0")} <b><FormattedNumber
                    value={amount}/> TRX</b> {t("token_freeze_confirm_message_1")}
                </label>
              </div>
              <p className="mt-3">
                <button className="btn btn-primary col-sm"
                        disabled={!isValid}
                        onClick={this.freeze}
                        style={{background: '#4A90E2', borderRadius: '0px', border: '0px'}}
                >
                  <i className="fa fa-snowflake mr-2"/>
                  {tu("freeze")}
                </button>
              </p>
          </ModalBody>
        </Modal>
    )
  }
}

const styles = {
  maxButton: {
    position:'absolute',
    right:0,
    top:0,
    background:'none',
    height:'35px',
    border:'none',
    cursor:'pointer',
  }
};
