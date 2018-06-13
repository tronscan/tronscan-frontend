import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {login} from "../../../actions/app";
import {trim} from "lodash";
import {tu} from "../../../utils/i18n";
import {readFileContentsFromEvent} from "../../../services/file";
import SweetAlert from "react-bootstrap-sweetalert";
import {decryptString, validatePrivateKey} from "../../../services/secureKey";
import {bytesToString} from "@tronscan/client/src/utils/bytes";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";

class KeyStoreAccess extends Component {

  constructor() {
    super();

    this.fileRef = React.createRef();

    this.state = {
      popup: null,
    }
  }

  selectFile = () => {
    this.fileRef.current.click();
  };

  hideModal = () => {
    this.setState({
      popup: null,
    });
  };

  onFileSelected = async (ev) => {
    if (ev.target.value.endsWith(".txt")){
      let contents = await readFileContentsFromEvent(ev);
      this.fileRef.current.value = '';
      this.openPasswordPrompt(contents);
    }
  };

  openPasswordPrompt = (contents) => {
    this.setState({
      popup: (
        <SweetAlert
          input
          showCancel
          inputType="password"
          cancelBtnBsStyle="default"
          title="Unlock KeyFile"
          placeHolder="Password"
          onCancel={this.hideModal}
          validationMsg="You must enter your password!"
          onConfirm={(password) => this.unlockKeyFile(password, contents)}>
          Password
        </SweetAlert>
      )
    });
  };

  unlockKeyFile = (password, contents) => {

    let {key, address, salt} = JSON.parse(bytesToString(hexStr2byteArray(contents)));
    let {history} = this.props;

    let privateKey = decryptString(password, salt, key);

    if (validatePrivateKey(privateKey) && pkToAddress(privateKey) === address) {
      this.setState({
        popup: (
          <SweetAlert
            success title="Wallet Unlocked"
            onCancel={this.hideModal}
            onConfirm={() => history.push("/account")} />
        )
      });
      this.props.login(privateKey);
    } else {
      this.setState({
        popup: (
          <SweetAlert
            danger
            showCancel
            title="Password Incorrect"
            cancelBtnText="Try again"
            onCancel={() => this.openPasswordPrompt(contents)}
            onConfirm={this.hideModal} />
        )
      });
    }
  };

  render() {

    let {popup} = this.state;

    return (
      <div className="text-center p-3 mx-5">
        {popup}
        <h2>{tu("keystore_file")}</h2>
        <button className="btn btn-success btn-block" onClick={this.selectFile}>
          {tu("select_file")}
        </button>
        <input type="file" ref={this.fileRef} className="d-none" onChange={this.onFileSelected} accept=".txt" />
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
  };
}

const mapDispatchToProps = {
  login
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(KeyStoreAccess));
