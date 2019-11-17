/* eslint-disable no-restricted-globals */
import { connect } from "react-redux";
import React from "react";
import { tu, t } from "../../../utils/i18n";
import { generateAccount } from "@tronscan/client/src/utils/account";
import { encryptKey, encryptString } from "../../../services/secureKey";
import { downloadStringAsFile } from "../../../services/file";
import { printPaperWallet } from "../Utils";
import { Link } from "react-router-dom";
import { login } from "../../../actions/app";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactPasswordStrength from "react-password-strength";
import { byteArray2hexStr } from "@tronscan/client/src/utils/bytes";
import { stringToBytes } from "@tronscan/client/src/lib/code";

const uuidv4 = require("uuid/v4");

const tronLogo = require("../../../images/tron-banner-inverted.png");

function WizardStep({ icon, completed = false, first = false }) {
  return (
    <div
      className={
        "col step d-flex justify-content-center " +
        (completed ? "completed" : "")
      }
    >
      {first && (
        <div className="progress first-progress">
          <div className="progress-bar bg-danger" />
        </div>
      )}
      <div className="step-icon">
        <i className={icon + " icon-waiting"} />
        <i className="fa fa-check icon-complete" />
      </div>
      <div className="progress">
        <div className="progress-bar bg-danger" />
      </div>
    </div>
  );
}

function WizardPage({ children }) {
  return <div>{children}</div>;
}

class Wizard extends React.PureComponent {
  constructor({ isOpen = false }) {
    super();

    this.state = {
      step: 0,
      fieldPassword: "",
      fieldEncryptedKey: "",
      passwordValid: false
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
      salt: uuidv4()
    });
  };

  encryptData() {
    let { fieldPassword, privateKey, salt } = this.state;
    let encryptedKey = encryptKey(fieldPassword, salt);
    let { hex, bytes } = encryptString(encryptedKey, privateKey);

    return {
      encryptedKey,
      hex,
      bytes
    };
  }

  buildEncryptedKeyStore() {
    let { encryptedKey, address, salt } = this.state;

    let data = {
      version: 1,
      key: encryptedKey,
      address: address,
      salt
    };

    return byteArray2hexStr(stringToBytes(JSON.stringify(data)));
  }

  hideModal = () => {
    let { onClose } = this.props;
    onClose && onClose();
  };

  onPasswordChanged = ({ password, isValid }) => {
    this.setState({
      fieldPassword: password,
      passwordValid: isValid
    });
  };

  printPaperWallet = () => {
    let { address, privateKey } = this.state;
    printPaperWallet(address, privateKey);
  };

  componentWillReceiveProps({ isOpen }) {
    this.setState({ isOpen });
  }

  nextStep = () => {
    let { step, privateKey } = this.state;

    let nextStep = step < 3 ? step + 1 : 3;

    switch (nextStep) {
      case 1:
        let data = this.encryptData();
        this.setState({
          encryptedKey: data.hex
        });
        break;
      case 3:
        this.props.login(privateKey);
        break;
    }

    this.setState({
      step: nextStep
    });
  };

  previousStep = () => {
    this.setState(({ step }) => ({
      step: step > 0 ? step - 1 : 0
    }));
  };

  downloadEncryptedKeyFile = () => {
    let { address } = this.state;

    downloadStringAsFile(this.buildEncryptedKeyStore(), address + ".txt");
  };

  isStepValid = () => {
    let { step, passwordValid } = this.state;

    switch (step) {
      case 0:
        return passwordValid;
    }

    return true;
  };

  renderPage() {
    let { step, privateKey } = this.state;

    switch (step) {
      case 0:
        return (
          <WizardPage>
            <div className="d-flex justify-content-center text-center">
              <div className="col-md-12">
                <h5>{tu("new_wallet")}</h5>
                <p>{tu("password_encr_key_message_0")}</p>
                <p>{tu("password_encr_key_message_1")}</p>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <div className="col-md-5">
                <div className="text-center">
                  <label>{tu("password")}</label>
                  <ReactPasswordStrength
                    minLength={8}
                    tooShortWord={t("too_short")}
                    changeCallback={this.onPasswordChanged}
                    minScore={2}
                    scoreWords={[
                      t("weak"),
                      t("okay"),
                      t("good"),
                      t("strong"),
                      t("secure")
                    ]}
                    inputProps={{
                      // type: "text",
                      name: "password_input",
                      autoComplete: "off",
                      className: ""
                    }}
                  />
                  <div className="text-muted">{tu("strong_password_info")}</div>
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
                <h5>{tu("save_keystore_file")}</h5>
                <p>
                  <button
                    className="btn btn-lg btn-block"
                    onClick={this.downloadEncryptedKeyFile}
                  >
                    <i className="fa fa-download mr-2" />
                    {tu("download_keystore_file")}
                  </button>
                </p>
              </div>
            </div>
            <p className="text-center">
              <b>{tu("do_not_lose_it")}</b> {tu("do_not_lose_it_message_0")}{" "}
              <br />
              <b>{tu("do_not_share_it")}</b> {tu("do_not_share_it_message_0")}{" "}
              <br />
              <b>{tu("make_a_backup")}</b> {tu("make_a_backup_message_0")}{" "}
              <br />
            </p>
          </WizardPage>
        );

      case 2:
        return (
          <WizardPage>
            <div className="d-flex justify-content-center text-center">
              <div className="col-md-6">
                <h5>{tu("save_private_key")}</h5>
                <p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      readOnly={true}
                      className="form-control"
                      value={privateKey}
                    />
                    <div className="input-group-append">
                      <CopyToClipboard text={privateKey}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                        >
                          <i className="fa fa-paste" />
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </p>
                <p>
                  <button
                    className="btn btn-lg btn-block"
                    onClick={this.printPaperWallet}
                  >
                    <i className="fa fa-print mr-2" />
                    {tu("print_paper_wallet")}
                  </button>
                </p>
              </div>
            </div>
            <p className="text-center">
              <b>{tu("do_not_lose_it")}</b> {tu("do_not_lose_it_message_0")}{" "}
              <br />
              <b>{tu("do_not_share_it")}</b> {tu("do_not_share_it_message_0")}{" "}
              <br />
              <b>{tu("make_a_backup")}</b> {tu("make_a_backup_message_0")}{" "}
              <br />
            </p>
          </WizardPage>
        );

      case 3:
        return (
          <WizardPage>
            <div className="text-center">
              <p className="font-weight-bold">
                {tu("new_wallet_ready_message")}
              </p>
              <Link className="btn btn-success" to="/account">
                {tu("go_to_account_page")}
              </Link>
            </div>
          </WizardPage>
        );
    }
  }

  render() {
    let { step } = this.state;
    const defaultImg = require("../../../images/logo_default.png");

    return (
      <main className="container wallet-wizard header-overlap">
        <div className="card">
          <div className="text-center p-5 bg-dark">
            <img
              className="wallet-wizard-logo"
              src={tronLogo}
              onError={e => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
            />
          </div>
          <div className="card-body d-flex wizard-steps">
            <WizardStep completed={step > 0} first={true} icon="fa fa-key" />
            <WizardStep completed={step > 1} icon="fa fa-save" />
            <WizardStep completed={step > 2} icon="fa fa-lock" />
          </div>
          <div className="card-body">{this.renderPage()}</div>
          <div className="card-body">
            <div className="row d-flex px-3">
              {step < 3 && (
                <button
                  disabled={!this.isStepValid()}
                  className="btn btn-dark btn-lg ml-auto"
                  onClick={this.nextStep}
                >
                  {tu("next")}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account
  };
}

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
