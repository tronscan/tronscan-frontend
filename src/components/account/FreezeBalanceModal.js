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

class FreezeBalanceModal extends React.PureComponent {

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
      selectedResource:0
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
      amount = amount < trxBalance ? amount : trxBalance;
    } else {
      amount = "";
    }

    this.setState({
      amount,
    });
  };

  freeze = async () => {

    let {account, onError, privateKey} = this.props;
    let {amount,selectedResource} = this.state;
    let res,type;
    this.setState({loading: true});
    if (Lockr.get("islogin")) {
        const { tronWeb } = account;
        if(!selectedResource){
            type = 'BANDWIDTH';
        }else{
            type = 'ENERGY';
        }
        const unSignTransaction = await tronWeb.transactionBuilder.freezeBalance( amount * ONE_TRX, 3, type, tronWeb.defaultAddress.base58);
        const {result} = await transactionResultManager(unSignTransaction,tronWeb)
        res = result;
    }else {
        let {success} = await Client.freezeBalance(account.address, amount * ONE_TRX, 3, selectedResource)(account.key);
        res = success
    }
    if (res) {
      this.confirmModal({amount});
      this.setState({loading: false});
    } else {
      onError && onError();
    }
  };
  resourceSelectChange = (value) => {
    this.setState({
        selectedResource: Number(value)
    });
  }

  render() {

    let {amount, confirmed, loading, resources, selectedResource} = this.state;
    let {trxBalance, frozenTrx, intl} = this.props;

    let isValid = !loading && (amount > 0 && trxBalance >= amount && confirmed);
    return (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered _freezeContent">
          <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
            {tu("freeze")}
          </ModalHeader>
          <ModalBody className="text-center _freezeBody">
            <form>
              <div className="form-group">
                <div className="text-left _power">{tu("current_power")}: <span
                    style={{fontWeight: 800}}>{frozenTrx / ONE_TRX}</span>
                </div>

                <NumberField
                    min={1}
                    decimals={0}
                    value={amount}
                    placeholder={intl.formatMessage({id: 'trx_amount'})}
                    className="form-control text-left"
                    style={{marginTop: '12px', background: "#F3F3F3", border: "1px solid #EEEEEE"}}
                    onChange={this.onAmountChanged}/>
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
            </form>
          </ModalBody>
        </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
    trxBalance: state.account.trxBalance,
  };
}

const mapDispatchToProps = {
  reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FreezeBalanceModal))
