import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {ExternalSigner} from "../../services/externalSigner";
import {Client} from "../../services/api";
import {TronLoader} from "../common/loaders";
import QRCode from "qrcode.react";
import SweetAlert from "react-bootstrap-sweetalert";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {loginWithAddress} from "../../actions/app";

class SignModal extends React.Component {

  constructor() {
    super();

    this.state = {
      modal: null,
      isOpen: false,
    };
  }

  componentDidMount() {
    this.reset();
    this.showQRCode();
  }

  reset() {
    this.signer && this.signer.close();
    this.signer = new ExternalSigner(this);
  }

  componentDidUpdate({isOpen}) {
    if (this.state.isOpen !== isOpen) {
      if (isOpen) {
        this.showQRCode();
      }
    }
  }

  componentWillUnmount() {
    this.signer.close();
    Client.setSigner(null);
  }

  onDeviceConneced({deviceName, address}) {
    this.setState({
      modal: (
          <SweetAlert success title="Device Connected" onConfirm={this.hideModal}>
            Logged in with {deviceName} and address {address}
          </SweetAlert>
      )
    });
  }

  buildConnectCode() {
    return JSON.stringify({
      channel: `${process.env.API_URL}/sign-${this.signer.uuid}`,
      code: this.signer.code,
    });
  }

  showAppLoggedIn(appLogin) {

    this.setState({
      modal: (
          <Modal isOpen={true} fade={false} className="modal-dialog-centered" toggle={this.hideModal}>
            <ModalHeader className="text-center" toggle={this.hideModal}>External Login Success</ModalHeader>
            <ModalBody>
              <div className="card">
                <img className="card-img-top" src={appLogin.app.logo}/>
                <div className="card-body">
                  <h5 className="card-title text-center">{appLogin.app.name}</h5>
                  <p className="card-text">
                    Address: {appLogin.wallet.address}
                  </p>
                  <Link className="btn btn-success btn-block" to="/account" onClick={this.hideModal}>
                    Go to account
                  </Link>
                </div>
              </div>
            </ModalBody>
          </Modal>
      )
    });
  }

  showQRCode() {

    this.signer.regenerateCode();

    this.signer.signListener.once("app-login", login => {
      if (parseInt(login.code) === this.signer.code) {
        Client.setSigner(this.signer);
        //this.props.loginWithAddress(login.wallet.address);
        this.showAppLoggedIn(login);
      }
    });

    this.setState({
      modal: (
          <Modal isOpen={true} fade={false} className="modal-dialog-centered" toggle={this.hideModal}>
            <ModalHeader className="text-center" toggle={this.hideModal}>Login with External Device</ModalHeader>
            <ModalBody>
              <QRCode size={512} style={{width: '100%', height: 'auto'}} value={this.buildConnectCode()}/><br/>
              {JSON.stringify(this.buildConnectCode())}
            </ModalBody>
          </Modal>
      )
    });
  }

  waitForTransaction(cancel) {
    this.setState({
      modal: (
          <Modal isOpen={true} fade={false} className="modal-dialog-centered" toggle={() => {
            cancel();
            this.hideModal();
          }}>
            <ModalHeader className="text-center">Signing Transaction on External Device</ModalHeader>
            <ModalBody>
              <TronLoader>
                Waiting for signed response from external device
              </TronLoader>
            </ModalBody>
          </Modal>
      )
    })
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  render() {

    let {modal} = this.state;

    return modal;
  }
}


const styles = {
  image: {
    maxWidth: "100%",
    maxHeight: 400,
  }
};

function mapStateToProps() {
  return {};
}

const mapDispatchToProps = {
  loginWithAddress
};

export default connect(mapStateToProps, mapDispatchToProps)(SignModal);
