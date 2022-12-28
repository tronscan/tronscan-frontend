import React, {Component} from 'react';
import {connect} from "react-redux";
import {tu} from "../../utils/i18n";
import {Modal, ModalBody, ModalHeader} from "reactstrap";

class ChangeNameModal extends Component {

  constructor() {
    super();

    this.state = {
      name: "",
      disabled: false,
    };
  }

  isValid = () => {
    let {name} = this.state;

    if (name.length < 8) {
      return [false, tu("name_to_short")]
    }

    if (name.length > 32) {
      return [false, tu("name_to_long")];
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return [false, tu("permitted_characters_message")];
    }

    return [true];
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  confirm = () => {
    let {onConfirm} = this.props;
    let {name} = this.state;
    onConfirm && onConfirm(name);
    this.setState({disabled: true});
  };

  cancel = () => {
    let {onCancel} = this.props;
    onCancel && onCancel();
  };

  render() {

    let {modal, name, disabled} = this.state;

    let [isValid, errorMessage] = this.isValid();
    if (modal) {
      return modal;
    }

    return (
        <Modal isOpen={true} toggle={this.cancel} fade={false} size="lg" className="modal-dialog-centered">
          <ModalHeader className="text-center" toggle={this.cancel}>{tu("set_name")}</ModalHeader>
          <ModalBody>
            <p className="text-center">
              <label className="text-danger">{tu("unique_account_message")}</label>
              <input className={"form-control text-center " + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                     type="text"
                     placeholder="Account Name"
                     value={name}
                     onChange={(ev) => this.setState({name: ev.target.value})}/>
                {errorMessage?
                    <div className="invalid-feedback text-center text-danger">
                      {errorMessage}
                    </div>:null
                }
            </p>
            <div className="pt-3">
              <p className="text-center">
                <button
                    disabled={disabled || !isValid}
                    className="btn btn-success"
                    onClick={this.confirm}>{tu("change_name")}</button>
              </p>
            </div>
          </ModalBody>
        </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeNameModal)
