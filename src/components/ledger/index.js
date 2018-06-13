import React, {Component} from 'react';
import {filter, isUndefined} from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../services/api";
import LedgerSigner from "./LedgerSigner";
import {connect} from "react-redux";
import {loginWithAddress} from "../../actions/app";

const {ipcRenderer} = window.require('electron');

class Ledger extends Component {

  constructor() {
    super();

    this.state = {
      modal: null,
    };
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };

  componentDidMount() {

    ipcRenderer.on('ledger', (event, arg) => {

      switch (arg.type) {
        case "LEDGER_CONNECTED":

          Client.setSigner(new LedgerSigner());

          this.setState({
            modal: (
              <SweetAlert info title="Ledger Detected" onConfirm={this.hideModal}>
                Waiting for Address
              </SweetAlert>
            ),
          });
          break;
        case "LEDGER_ADDRESS":
          this.props.loginWithAddress(arg.address);
          this.setState({
            modal: (
              <SweetAlert success title="Ledger Wallet Opened" onConfirm={this.hideModal}>
                Address: {arg.address}
              </SweetAlert>
            ),
          });
          break;
        case "LEDGER_DISCONNECTED":
          this.setState({
            modal: (
              <SweetAlert warning title="Ledger Disconnected" onConfirm={this.hideModal}>
                Ledger Disconnected
              </SweetAlert>
            ),
          });
          break;
      }
    });
  }

  render() {

    let {modal} = this.state;

    return (
      <React.Fragment>
        {modal}
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {

  };
}

const mapDispatchToProps = {
  loginWithAddress,
};

export default connect(mapStateToProps, mapDispatchToProps)(Ledger);
