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
    trxBalance: state.account.trxBalance || state.account.balance,
    currentWallet: state.wallet.current
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
          label:"freeze_modal_get_energy",
          value:1
        },
        {
          label:"freeze_modal_get_bandwidth",
          value:0
        }
      ],
      selectedResource:1,
      receiver: (this.props.currentWallet && this.props.currentWallet.address) || '',
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
    let {trxBalance, frozenTrx, intl, currentWallet} = this.props;
    trxBalance = !trxBalance ? 0 :  trxBalance;
    let isValid =  (amount > 0 && trxBalance >= amount && confirmed);
    // freezeError
    const freezeErrorItem = (
      <span className="pt-2 text-left" style={{ color: 'red', display: 'block' }}>{freezeError}</span>
    );
    return (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered freeze-modal-wrap">
          <ModalHeader className="text-center freeze-modal-header" toggle={this.hideModal}>
            {tu("freeze_modal_title")}
          </ModalHeader>
          <ModalBody className="text-center freeze-modal-body">
            <div className="freeze-tip d-flex justify-content-between">
              <div className="d-flex flex-wrap justify-content-center"><span>{tu('freeze_modal_tip1')}:</span> <span>{frozenTrx / ONE_TRX}</span> </div>
              <div className="d-flex flex-wrap justify-content-center"><span>{tu('freeze_modal_tip2')}:</span> <span><FormattedNumber value={currentWallet.bandwidth.energyRemaining<0?0:currentWallet.bandwidth.energyRemaining}/></span> </div>
              <div className="d-flex flex-wrap justify-content-center"><span>{tu('freeze_modal_tip3')}:</span> 
                <span><FormattedNumber value={currentWallet.bandwidth.netRemaining + currentWallet.bandwidth.freeNetRemaining}/></span> 
              </div>
            </div>
            {/* <div className="form-group">
              <div className="text-left _power">{tu("current_power")}: <span
                  style={{fontWeight: 800}}>{frozenTrx / ONE_TRX}</span>
              </div>
            </div> */}
            <div className="form-group">
              <div className="freeze_label">{tu('freeze_modal_get_resource')}:</div>
              <select className="custom-select"
                value={selectedResource}
                style={{border: "1px solid #979797"}}
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
            
            <div className="form-group">
              <div className="freeze_label">{tu('freeze_modal_get_amount')}(TRX):</div>
              <div style={{position:'relative'}}>
                {/* <button type="button" onClick={ ()=>{
                  this.setState({ amount: Math.floor(trxBalance) })
                }} style={styles.maxButton}>MAX</button> */}
                <NumberField
                    min={1}
                    decimals={0}
                    value={amount}
                    // placeholder={intl.formatMessage({id: 'trx_amount'})}
                    className="form-control text-left"
                    style={{marginTop: '12px', border: "1px solid #979797"}}
                    onChange={this.onAmountChanged}/>
              </div>
              {freezeError && freezeErrorItem}
              {Boolean(selectedResource == 0 && getcalculate) && !freezeError &&
                <div className="text-left d-flex align-items-center pt-2 ">
                  <span className="col-red mr-2">{tu('Expected_acquisition')} <FormattedNumber value={amount}/> {tu('freeze_modal_tron_power')}, {tu('freeze_modal_and')} <FormattedNumber value={getcalculate}/> {tu('bandwidth')} </span>
                  <Tooltip placement="top" title={tu('energy_more')} overlayStyle={{ maxWidth: '320px'}}>
                    <div className="question-mark"><i>?</i></div>
                  </Tooltip>
                </div>
              }
              {Boolean(selectedResource == 1&& getcalculate) && !freezeError &&
                <div className="text-left d-flex align-items-center pt-2 ">
                  <span className="col-red mr-2">{tu('Expected_acquisition')} <FormattedNumber value={amount}/> {tu('freeze_modal_tron_power')}, {tu('freeze_modal_and')} <FormattedNumber value={getcalculate}/> {tu('energy')}</span>
                  <Tooltip placement="top" title={tu('bandwidth_more')} overlayStyle={{maxWidth: '320px'}}>
                    <div className="question-mark"><i>?</i></div>
                  </Tooltip>
                </div>
              }
            </div>
            
            <div className="form-group">
              <div className="freeze_label">{tu('freeze_modal_receive')}:</div>
              <input type="text"
                  //  placeholder={intl.formatMessage({id: 'receive_address'})}
                   onChange={(ev) => this.setReceiverAddress(ev.target.value)}
                   className="form-control"
                   style={{border: "1px solid #979797"}}
                   value={receiver}/>
            </div>
            
            <div className="form-check text-left">
              <label className="form-check-label _freeze" style={{color: '#666666'}}>
                <input type="checkbox"
                  className="form-check-input"
                  onChange={(ev) => this.setState({confirmed: ev.target.checked})}/>
                {tu("token_freeze_confirm_message_0")} <FormattedNumber
                  value={amount}/> TRX {t("freeze_modal_confirm_days")}
              </label>
            </div>
            <p className="mt-4">
              <button className="btn btn-primary col-sm"
                      disabled={!isValid}
                      onClick={this.freeze}
                      style={{background: '#69C265',width: '40%', fontSize: '0.875rem', height: '2.375rem', borderRadius: '0px', border: '0px'}}
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