import React, {Component} from 'react';
import {filter, isUndefined} from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";

const {ipcRenderer} = window.require('electron');


export default class Ledger extends Component {

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
    ipcRenderer.on('ledger-connected', (event, arg) => {
      this.setState({
        modal: (
          <SweetAlert info title="Ledger Detected" onConfirm={this.hideModal}>
            Waiting for Address
          </SweetAlert>
        ),
      });

      ipcRenderer.on('ledger-got-address', (event, arg) => {
        console.log(event, arg);
        this.setState({
          modal: (
            <SweetAlert success title="Ledger Wallet Opened" onConfirm={this.hideModal}>
              Address: {arg.address}
            </SweetAlert>
          ),
        });


      });
    });

    ipcRenderer.on('ledger-disconnected', (event, arg) => {
      this.setState({
        modal: (
          <SweetAlert warning title="Ledger Disconnected" onConfirm={this.hideModal}>
            Ledger Disconnected
          </SweetAlert>
        ),
      })
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
