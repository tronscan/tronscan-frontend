import {connect} from "react-redux";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import Scanner from "./Scanner";
import QRCode from "qrcode.react";

class AddSignatureModal extends React.Component {

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
    let {transaction} = this.props;

    this.setState({
      body: (
          <div className="text-center">
            <QRCode size={512} style={{width: '100%', height: 'auto'}} value={transaction}/><br/>
            <button className="btn btn-primary" onClick={this.signWithQRCode}>
              Sign with QR Code
            </button>
          </div>
      )
    });
  }

  signWithQRCode = () => {
    this.setState({
      body: (
          <div>
            <Scanner onScan={this.onCodeScan}/>
          </div>
      )
    });
  };

  onCodeScan = ({code}) => {
    this.setState({
      body: (
          <div>
            <h1>{code}</h1>
          </div>
      )
    });
  };

  render() {

    let {body} = this.state;
    let {transaction} = this.props;

    return (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered">
          <ModalHeader className="text-center" toggle={this.hideModal}>Sign Transaction</ModalHeader>
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

export default connect(mapStateToProps, mapDispatchToProps)(AddSignatureModal);
