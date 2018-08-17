import React, {Component} from 'react';
import {connect} from "react-redux";
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import {WITNESS_CREATE_COST} from "../../constants";
import {FormattedNumber} from "react-intl";
const {isWebUri} = require('valid-url');

class ApplyForDelegate extends Component {

  constructor() {
    super();

    this.state = {
      url: "",
      check: false,
      applyResponse: null,
      loading: false,
      modal: null,
    };
  }

  isValid = () => {
    let {check} = this.state;
    return check && this.isValidUrl();
  };

  isValidUrl = () => {
    let {url} = this.state;
    return url.length > 0 && isWebUri(url);
  };

  doApply = async () => {
    let {account,privateKey} = this.props;
    let {url} = this.state;

    this.setState({ loading: true});

    let {success} = await Client.applyForDelegate(account.address, url)(account.key);
    this.setState({ loading: false });
    if (success) {
      this.confirm();
    } else {
      this.setState({
        modal: (
          <SweetAlert warning title={tu("error")} onConfirm={this.hideModal}>
            {tu("apply_representative_error_message_0")} <br/>
            {tu("apply_representative_error_message_1")}
          </SweetAlert>
        )
      })
    }
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  confirm = () => {
    let {onConfirm} = this.props;
    onConfirm && onConfirm();
  };

  cancel = () => {
    let {onCancel} = this.props;
    onCancel && onCancel();
  };

  render() {

    let {check, loading, modal, url} = this.state;

    if (modal) {
      return modal;
    }

    return (
      <Modal isOpen={true} toggle={this.cancel} fade={false} size="lg" className="modal-dialog-centered">
        <ModalHeader className="text-center" toggle={this.cancel}>{tu("Super Representatives")}</ModalHeader>
        <ModalBody>
          <p className="card-text text-center">
            {t("apply_for_delegate_description")}
          </p>
          <p className="mt-5 text-center">
            <label>{tu("your_personal_website_address")}</label>
            <input className={"form-control text-center " + (check && !this.isValidUrl() ? " is-invalid" : "")}
                   type="text"
                   placeholder="https://"
                   value={url}
                   onChange={(ev) => this.setState({ url: ev.target.value })}/>
            <div className="invalid-feedback text-center text-danger">
              {tu("invalid_url")}
            </div>
          </p>
          <div className="text-center">
            <div className="form-check">
              <input type="checkbox"
                     className="form-check-input"
                     checked={check}
                     onChange={(ev) => this.setState({ check: ev.target.checked })} />
              <label className="form-check-label">
                {tu("understand_tron_sr_message_0")}
                <b> <FormattedNumber value={WITNESS_CREATE_COST}/> TRX</b> {t("understand_tron_sr_message_1")}
              </label>
            </div>
          </div>
          <div className="pt-3">
            <p className="text-center">
              <button
                disabled={!this.isValid() || loading}
                className="btn btn-success"
                onClick={this.doApply}>{tu("submit")}</button>
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
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ApplyForDelegate)
