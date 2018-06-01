/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";

class FreezeBalanceModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      confirmed: false,
      amount: "",
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

  onAmountChanged = (ev) => {

    let {trxBalance} = this.props;

    let amount = parseInt(ev.target.value);

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

    let {account} = this.props;
    let {amount} = this.state;

    this.setState({ loading: true });

    let {success} = await Client.freezeBalance(account.address, amount * ONE_TRX, 3)(account.key);

    this.confirmModal({ amount });
    this.setState({ loading: false });
  };

  render() {

    let {amount, confirmed, loading} = this.state;
    let {trxBalance} = this.props;

    let isValid = !loading && (amount > 0 && trxBalance >= amount && confirmed);

    return (
      <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered" >
        <ModalHeader className="text-center" toggle={this.hideModal}>
          {tu("Freeze Balance")}
        </ModalHeader>
        <ModalBody className="text-center">
          <form>
            <div className="form-group">
              <label>{tu("TRX Amount")}</label>
              <input type="number"
                     value={amount}
                     className="form-control text-center"
                     onChange={this.onAmountChanged}/>
            </div>
            <div className="form-check">
              <input type="checkbox"
                     className="form-check-input"
                     onChange={(ev) => this.setState({ confirmed: ev.target.checked })} />
              <label className="form-check-label">
                I confirm to freeze <b><FormattedNumber value={amount}/> TRX</b> for at least of 3 days
              </label>
            </div>
            <p className="mt-3">
              <button className="btn btn-primary col-sm"
                      disabled={!isValid}
                      onClick={this.freeze}
                >
                <i className="fa fa-snowflake mr-2"/>
                {tu("Freeze Balance")}
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
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(FreezeBalanceModal)
