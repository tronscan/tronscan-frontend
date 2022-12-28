/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {ONE_TRX, IS_MAINNET} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
import {NumberField} from "../common/Fields";
import { transactionResultManager, transactionResultManagerSun} from "../../utils/tron";
import Lockr from "lockr";
import {withTronWeb} from "../../utils/tronWeb";
import { Tooltip } from 'antd';

@connect(
  state => ({
    account: state.app.account,
    wallet: state.app.wallet,
    tokenBalances: state.account.tokens,
    trxBalance: state.account.trxBalance || state.account.balance
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
      receiver:'',
      oneEnergy: 0,
      oneBandwidth: 0,
      getcalculate: 0,
      freezeError: '',
    };
  }

  componentDidMount() {
    this.props.reloadWallet();
    this.getFrozenEnergy(1)
    this.getFrozenBandwidth(1)
    
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
    let {trxBalance,intl} = this.props;

    let amount = parseInt(value);
    if (!isNaN(amount)) {
      if (amount > Math.floor(trxBalance)) {
        this.setState({
            freezeError: `${intl.formatMessage({id: 'freeze_balance_limit'})}`
        });
      }else{
          this.setState({
              freezeError: ''
          });
      }
      amount = amount > 0 ? Math.floor(amount) : Math.abs(amount);
    } else {
      amount = "";
    }

    this.setState({
      amount,
    }, () => {
      if(amount){
        this.getCalculat()
      }else{
        this.setState({getcalculate: 0})
      }
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
        const tronWebLedger = this.props.tronWeb();
        const { tronWeb, sunWeb } = this.props.account;

        if (!selectedResource) {
            type = 'BANDWIDTH';
        } else {
            type = 'ENERGY';
        }
        if(IS_MAINNET){
            if (Lockr.get("islogin") || this.props.wallet.type==="ACCOUNT_LEDGER" || this.props.wallet.type==="ACCOUNT_TRONLINK") {

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
      }else{
          if(this.props.wallet.type==="ACCOUNT_TRONLINK" || this.props.wallet.type==="ACCOUNT_PRIVATE_KEY"){
              let unSignTransaction;
              if(receiver==="") {
                  unSignTransaction = await sunWeb.sidechain.transactionBuilder.freezeBalance(amount * ONE_TRX, 3, type, sunWeb.sidechain.defaultAddress.base58).catch(e => false);
              }else{
                  unSignTransaction = await sunWeb.sidechain.transactionBuilder.freezeBalance(amount * ONE_TRX, 3, type, sunWeb.sidechain.defaultAddress.base58, receiver).catch(e => false);
              }
              result = await transactionResultManagerSun(unSignTransaction,sunWeb)
              res = result;
          }
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
  async getFrozenEnergy(one){
    const {account: {tronStationSDK}} = this.props
    const { amount } = this.state
    if(one){
      const data = await tronStationSDK.energy.trx2FrozenEnergy(1);
      this.setState({oneEnergy: data})
    }else{
      if(amount){
        const data = await tronStationSDK.energy.trx2FrozenEnergy(amount);
        this.setState({getcalculate: data})
      }
    }
  }
  async getFrozenBandwidth(one){
    const {account: {tronStationSDK}} = this.props
    const { amount } = this.state
    if(one){
      const data = await tronStationSDK.bp.trx2FrozenBandwidth(1);
      this.setState({oneBandwidth: data})
    }else{
      if(amount){
        const data = await tronStationSDK.bp.trx2FrozenBandwidth(amount);
        this.setState({getcalculate: data})
      }
    }
  }
  getCalculat() {
    const { selectedResource } = this.state
    const map = ['getFrozenBandwidth', 'getFrozenEnergy']
    this[map[selectedResource]]()
  }

  resourceSelectChange = (value) => {
    this.setState({
        selectedResource: Number(value)
    },() => {
      this.getCalculat()
    });
  };
  setReceiverAddress = (address) => {
    this.setState({receiver: address});
  };

  render() {

    let {receiver, amount, confirmed, loading, resources, selectedResource, oneEnergy, oneBandwidth, getcalculate, freezeError} = this.state;
    let {trxBalance, frozenTrx, intl} = this.props;
    trxBalance = !trxBalance ? 0 :  trxBalance;
    let isValid =  (amount > 0 && trxBalance >= amount && confirmed);
    // freezeError
    const freezeErrorItem = (
      <span className="pt-2 text-left" style={{ color: 'red', display: 'block' }}>{freezeError}</span>
    );
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
                {freezeError && freezeErrorItem}
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
              {Boolean(selectedResource == 0 && getcalculate) &&
                <div className="text-left d-flex align-items-center">
                  <span className="col-red mr-2">1TRX ≈ <FormattedNumber value={oneBandwidth}/>{tu('bandwidth')}, {tu('Expected_acquisition')}  &nbsp; <FormattedNumber value={getcalculate}/> &nbsp;{tu('bandwidth')} </span>
                  <Tooltip placement="top" title={tu('energy_more')} overlayStyle={{ maxWidth: '320px'}}>
                    <div className="question-mark"><i>?</i></div>
                  </Tooltip>
                </div>
              }
              {Boolean(selectedResource == 1&& getcalculate) &&
                <div className="text-left d-flex align-items-center">
                  <span className="col-red mr-2">1TRX ≈ <FormattedNumber value={oneEnergy}/>{tu('energy')}, {tu('Expected_acquisition')} &nbsp; <FormattedNumber value={getcalculate}/>  &nbsp;{tu('energy')}</span>
                  <Tooltip placement="top" title={tu('bandwidth_more')} overlayStyle={{maxWidth: '320px'}}>
                    <div className="question-mark"><i>?</i></div>
                  </Tooltip>
                </div>
              }
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