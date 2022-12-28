/* eslint-disable no-restricted-globals */
import { connect } from "react-redux";
import React from "react";
import { find } from "lodash";
import SendForm from "./SendForm";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import { tu } from "../../../utils/i18n";
import { injectIntl } from "react-intl";

@injectIntl
class SendModal extends React.PureComponent {
  constructor({ isOpen = false, to = "" }) {
    super();

    this.state = {
      isOpen,
      modal: (
        <Modal
          backdrop="static"
          isOpen={true}
          toggle={this.hideModal}
          fade={false}
          className="modal-dialog-centered fiexd-none send-modal"
        >
          <ModalHeader className="text-center" toggle={this.hideModal}>
            Send
          </ModalHeader>
          <ModalBody>
            <SendForm to={to} onSend={this.onSend} />
          </ModalBody>
        </Modal>
      )
    };
  }

  hideModal = () => {
    let { onClose } = this.props;
    onClose && onClose();
  };

  onSend = () => {
    this.setState({
      modal: (
        <SweetAlert
          success
          title="Successful Transaction"
          onConfirm={this.hideModal}
        />
      )
    });
  };

  render() {
    let { intl, account } = this.props;

    let { modal } = this.state;

    if (!account.isLoggedIn) {
      return (
        <SweetAlert
          danger
          title={intl.formatMessage({ id: "not_login" })}
          onConfirm={this.hideModal}
          // style={{
          //   width:'478px'
          // }}
        >
          {tu("login_first")}
        </SweetAlert>
      );
    }

    return modal;
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SendModal);
