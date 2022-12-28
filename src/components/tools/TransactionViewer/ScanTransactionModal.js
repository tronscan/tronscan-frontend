import {connect} from "react-redux";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import Scanner from "./Scanner";

class ScanSignatureModal extends React.Component {

  constructor() {
    super();

    this.state = {
      body: null,
    }
  }

  hideModal = () => {
    let {onClose} = this.props;
    onClose && onClose();
  };

  componentDidMount() {
    this.setState({
      body: (
          <div>
            <Scanner onScan={this.onCodeScan}/>
          </div>
      )
    });
  }

  onCodeScan = ({code}) => {
    let {onConfirm} = this.props;
    onConfirm && onConfirm({code});
  };

  render() {

    let {body} = this.state;

    return (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered">
          <ModalHeader className="text-center" toggle={this.hideModal}>Scan Transaction</ModalHeader>
          <ModalBody>
            {body}
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

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ScanSignatureModal);
