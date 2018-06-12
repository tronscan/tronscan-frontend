/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import {find} from "lodash";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import QRCode from "qrcode.react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {tu} from "../../../utils/i18n";


class ReceiveModal extends React.PureComponent {

  constructor() {
    super();

    this.state = {
      modal: null,
    };
  }

  hideModal = () => {
    let {onClose} = this.props;
    onClose && onClose();
  };


  componentDidMount() {
    let {wallet} = this.props;

    this.setState({
      modal: (
        <Modal isOpen={true} toggle={this.hideModal} fade={false} className="modal-dialog-centered">
          <ModalHeader className="text-center" toggle={this.hideModal}>{tu("receive")}</ModalHeader>
          <ModalBody className="text-center">
            <h5 className="py-2">{tu("send_to_following_address")}</h5>
            <p>
              <div className="input-group mb-3">
                <input type="text"
                       readOnly={true}
                       className="form-control"
                       value={wallet.address}/>
                <div className="input-group-append">
                  <CopyToClipboard text={wallet.address}>
                    <button className="btn btn-outline-secondary" type="button">
                      <i className="fa fa-paste"/>
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </p>
            <hr/>
            <QRCode size={512} style={{ width: '100%', height: 'auto' }} value={wallet.address} /><br/>
          </ModalBody>
        </Modal>
      )
    })
  }


  render() {
    let {modal} = this.state;
    return modal;
  }
}

function mapStateToProps(state) {
  return {
    wallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ReceiveModal)
