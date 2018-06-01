/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import React from "react";
import {find} from "lodash";
import {tu} from "../../../utils/i18n";
import {generateAccount} from "@tronscan/client/src/utils/account";
import {encryptKey, encryptString} from "../../../services/secureKey";
import {downloadStringAsFile} from "../../../services/file";
import {printPaperWallet} from "../Utils";
import {Link} from "react-router-dom";
import {login} from "../../../actions/app";
import {CopyToClipboard} from "react-copy-to-clipboard";
import ReactPasswordStrength from "react-password-strength";
import {byteArray2hexStr} from "@tronscan/client/src/utils/bytes";
import {stringToBytes} from "@tronscan/client/src/lib/code";
const uuidv4 = require("uuid/v4");

const tronLogo = require("../../../images/tron-banner-inverted.png");

function WizardStep({ icon, completed = false, first = false }) {
  return (
    <div className={"col step d-flex justify-content-center " + (completed ? "completed" : "") }>
      {
        first && <div className="progress first-progress">
          <div className="progress-bar bg-danger"/>
        </div>
      }
      <div className="step-icon">
        <i className={icon + " icon-waiting"} />
        <i className="fa fa-check icon-complete" />
      </div>
      <div className="progress">
        <div className="progress-bar bg-danger"/>
      </div>
    </div>
  )
}

function WizardPage({children}) {
  return (
    <div>
      {children}
    </div>
  );
}

class Wizard extends React.PureComponent {

  constructor({ isOpen = false }) {
    super();

    this.state = {
      step: 0,
      fieldPassword: "",
      fieldEncryptedKey: "",
      passwordValid: false,
    };
  }

  componentDidMount() {
    this.generateAccount();
  }

  generateAccount = () => {
    let account = generateAccount();
    this.setState({
      address: account.address,
      privateKey: account.privateKey,
      salt: uuidv4(),
    });
  };

  encryptData() {
    let {fieldPassword, privateKey, salt} = this.state;
    let encryptedKey = encryptKey(fieldPassword, salt);
    let {hex, bytes} = encryptString(encryptedKey, privateKey);

    return {
      encryptedKey,
      hex,
      bytes,
    };
  };

  buildEncryptedKeyStore() {
    let {encryptedKey, address, salt} = this.state;

    let data = {
      version: 1,
      key: encryptedKey,
      address: address,
      salt,
    };

    return byteArray2hexStr(stringToBytes(JSON.stringify(data)));
  }

  hideModal = () => {
    let {onClose} = this.props;
    onClose && onClose();
  };

  onPasswordChanged = ({password, isValid}) => {
    this.setState({
      fieldPassword: password,
      passwordValid: isValid,
    });
  };

  printPaperWallet = () => {
    let {address, privateKey} = this.state;
    printPaperWallet(address, privateKey);
  };

  componentWillReceiveProps({isOpen}) {
    this.setState({ isOpen, });
  }

  nextStep = () => {

    let {step, privateKey} = this.state;

    let nextStep = step < 3 ? step + 1 : 3;

    switch (nextStep) {
      case 1:
        let data = this.encryptData();
        this.setState({
          encryptedKey: data.hex,
        });
        break;
      case 3:
        this.props.login(privateKey);
        break;
    }

    this.setState({
      step: nextStep,
    });
  };

  previousStep = () => {
    this.setState(({step}) => ({
      step: step > 0 ? step - 1 : 0,
    }));
  };

  isStepValid = () => {
    let {step, passwordValid} = this.state;

    switch (step) {
      case 0:
        return passwordValid;
    }

    return true;
  };

  renderPage() {
    let {step, address, privateKey, encryptedKey} = this.state;

    switch (step) {
      case 0:
        return (
          <WizardPage>
            <div className="d-flex justify-content-center text-center">
              <div className="col-md-12">
                <h5>New Wallet</h5>
                <p>
                  This password encrypts your private key. This does not act as a seed to generate your keys.
                </p>
                <p>
                  You will need this password and your private key to unlock your wallet.
                </p>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-md-5">
                <div className="text-center">
                  <label>{tu("Password")}</label>
                  <ReactPasswordStrength
                    minLength={8}
                    changeCallback={this.onPasswordChanged}
                    minScore={2}
                    scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                    inputProps={{
                      // type: "text",
                      name: "password_input",
                      autoComplete: "off",
                      className: ""
                    }}
                  />
                  <div className="text-muted">A strong password is required</div>
                </div>
              </div>
            </div>
          </WizardPage>
        );

      case 1:
        return (
          <WizardPage>
            <div className="d-flex justify-content-center text-center">
              <div className="col-md-6">
                <h5>Save Your Keystore File</h5>
                <p>
                  <button className="btn btn-lg btn-block" onClick={() => downloadStringAsFile(this.buildEncryptedKeyStore(), address + ".txt")}>
                    <i className="fa fa-download mr-2"/>
                    Download Encrypted Key
                  </button>
                </p>
              </div>
            </div>
            <p className="text-center">
              <b>Do not lose it!</b> Tron Foundation cannot help you recover a lost key.<br/>
              <b>Do not share it!</b> Your funds may be stolen if you use this file a malicious site.<br/>
              <b>Make a backup!</b> Just in case your laptop is set on fire.<br/>
            </p>
          </WizardPage>
        );

      case 2:

        return (
          <WizardPage>
            <div className="d-flex justify-content-center text-center">
              <div className="col-md-6">
                <h5>Save Your Private Key</h5>
                <p>
                  <div className="input-group mb-3">
                    <input type="text"
                           readOnly={true}
                           className="form-control"
                           value={privateKey}/>
                    <div className="input-group-append">
                      <CopyToClipboard text={privateKey}>
                        <button className="btn btn-outline-secondary" type="button">
                          <i className="fa fa-paste"/>
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </p>
                <p>
                  <button className="btn btn-lg btn-block" onClick={this.printPaperWallet}>
                    <i className="fa fa-print mr-2"/>
                    Print Paper Wallet
                  </button>
                </p>
              </div>
            </div>
            <p className="text-center">
              <b>Do not lose it!</b> Tron Foundation cannot help you recover a lost key.<br/>
              <b>Do not share it!</b> Your funds may be stolen if you use this private key on a malicious website.<br/>
              <b>Make a backup!</b> Just in case your laptop is set on fire.<br/>
            </p>
          </WizardPage>
        );

      case 3:

        return (
          <WizardPage>
            <div className="text-center">
              <p className="font-weight-bold">
                Your new wallet is ready
              </p>
              <Link className="btn btn-success" to="/account">Go to account page</Link>
            </div>
          </WizardPage>
        );
    }
  }

  render() {

    let {} = this.props;

    let {step} = this.state;

    return (
      <main className="container wallet-wizard header-overlap">
        <div className="card">
          <div className="text-center p-5 bg-dark">
            <img src={tronLogo} style={{ height: 100 }}/>
          </div>
          <div className="card-body d-flex wizard-steps">
            <WizardStep completed={step > 0} first={true} icon="fa fa-key" />
            <WizardStep completed={step > 1} icon="fa fa-save" />
            <WizardStep completed={step > 2} icon="fa fa-lock" />
          </div>
          <div className="card-body">
            {this.renderPage()}
          </div>
          <div className="card-body">
            <div className="row d-flex px-3">
              {
                step < 3 &&
                  <button
                      disabled={!this.isStepValid()}
                      className="btn btn-dark btn-lg ml-auto"
                      onClick={this.nextStep}>
                    Next
                  </button>
              }
            </div>
          </div>
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
  };
}

const mapDispatchToProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wizard)
