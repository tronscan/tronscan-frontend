/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import {find} from "lodash";
import SendForm from "./SendForm";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";

class SendModal extends React.PureComponent {

  constructor({isOpen = false, to = ""}) {
    super();

    this.state = {
      isOpen,
      modal: (
          <Modal backdrop={false} isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered">
            <ModalHeader className="text-center" toggle={this.hideModal}>Send</ModalHeader>
            <ModalBody className="text-center">
              <SendForm to={to} onSend={this.onSend}/>
            </ModalBody>
          </Modal>
      )
    };
  }

  hideModal = () => {
    let {onClose} = this.props;
    onClose && onClose();
  };


  onSend = () => {
    this.setState({
      modal: (
          <SweetAlert success title="Successful Transaction" onConfirm={this.hideModal}/>
      )
    });
  };

  render() {

    let {account} = this.props;

    let {modal} = this.state;

    if (!account.isLoggedIn) {
      return (
          <SweetAlert danger title="Not logged in" onConfirm={this.hideModal}>
            You have to be logged in to make transactions
          </SweetAlert>
      )
    }

    return modal;
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SendModal)
