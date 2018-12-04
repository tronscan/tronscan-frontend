import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu} from "../../utils/i18n";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
import _ from "lodash";

class OperateTxnPairModal extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      tokenId: "",
      tokenBalances: "",
      tokenQuant: "",
      disabled: false,
    };
  }

  isValid = () => {
    let {tokenQuant, tokenBalances} = this.state;
    let {inject} = this.props;
    if (!inject && tokenQuant >= tokenBalances) {
      return [false, tu("withdraw_all")]
    }
    if (!/^([1-9][0-9]+|[1-9])$/.test(tokenQuant)) {
      return [false, tu("operate_txn_pair_message")];
    }
    return [true];
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  inject = async () => {
    let {onInject, exchange} = this.props;
    let {tokenId, tokenQuant} = this.state;
    if (tokenId === "TRX") {
      tokenId = "_";
      tokenQuant = parseFloat(tokenQuant * ONE_TRX);
    } else {
      tokenQuant = parseFloat(tokenQuant)
    }
    onInject && onInject(exchange.exchange_id, tokenId, tokenQuant);

    this.setState({disabled: true});
  };

  withdraw = async () => {
    let {onWithdraw, exchange} = this.props;
    let {tokenId, tokenQuant} = this.state;
    if (tokenId === "TRX") {
      tokenId = "_";
      tokenQuant = parseFloat(tokenQuant * ONE_TRX);
    } else {
      tokenQuant = parseFloat(tokenQuant)
    }
    onWithdraw && onWithdraw(exchange.exchange_id, tokenId, tokenQuant);

    this.setState({disabled: true});

  }

  cancel = () => {
    let {onCancel} = this.props;
    onCancel && onCancel();
  };

  tokenIdChange = (value) => {
    let {currentWallet, exchange} = this.props;
    let tokenBalances = exchange.first_token_id == value ? exchange.first_token_balance : exchange.second_token_balance;

    this.setState({
      tokenId: value,
      tokenBalances: tokenBalances
    });
  };

  render() {
    let {exchange, inject, intl} = this.props;
    let firstTokenId = exchange.first_token_id === "_" ? "TRX" : exchange.first_token_id;
    let secondTokenId = exchange.second_token_id === "_" ? "TRX" : exchange.second_token_id;
    let exchangeToken = [firstTokenId, secondTokenId];
    let {modal, tokenId, tokenQuant, disabled} = this.state;
    let [isValid, errorMessage] = this.isValid();
    if (modal) {
      return modal;
    }

    return (
      <Modal isOpen={true} toggle={this.cancel} fade={false} size="md" className="modal-dialog-centered">
        <ModalHeader className="text-center" toggle={this.cancel}>
          {inject ? tu("capital_injection") : tu("capital_withdrawal")}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-12">
              {inject ? <label>{tu("choose_a_Token_for_capital_injection")}</label> :
                <label>{tu("choose_a_Token_for_capital_withdrawal")}</label>}
              <select className="custom-select"
                      value={tokenId}
                      onChange={(e) => {
                        this.tokenIdChange(e.target.value)
                      }}
              >
                {
                  tokenId ? "" : <option value=''>{tu("select_the_name_of_the_Token")}</option>
                }
                {
                  exchangeToken.map((token, index) => {
                    return (
                      <option key={index} value={token}>{token}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              {inject ? <label>{tu("injection_amount")}</label> : <label>{tu("withdrawal_amount")}</label>}
              <input
                className={"form-control text-center " + ((tokenQuant.length !== 0 && !isValid) ? " is-invalid" : "")}
                type="text"
                placeholder={intl.formatMessage({id: 'enter_the_amount'})}
                value={tokenQuant}
                onInput={(ev) => this.setState({tokenQuant: ev.target.value})}/>
              <div className="invalid-feedback text-center text-danger">
                {errorMessage}
              </div>
            </div>
          </div>
          <div className="pt-4">
            <p className="text-center">
              {
                inject ?
                  <button
                    disabled={disabled || !isValid}
                    className="btn btn-success"
                    style={{width: '100%'}}
                    onClick={this.inject}>{tu("capital_injection")}</button> :
                  <button
                    disabled={disabled || !isValid}
                    className="btn btn-warning"
                    style={{width: '100%'}}
                    onClick={this.withdraw}>{tu("capital_withdrawal")}</button>
              }

            </p>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.wallet,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {
    reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OperateTxnPairModal))

