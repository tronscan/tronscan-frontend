import React from "react";
import {tu} from "../../utils/i18n";
import {RecaptchaAsync} from "../common/async";
import xhr from "axios/index";
import {FormattedNumber} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import {API_URL, ONE_TRX} from "../../constants";
import {Alert} from "reactstrap";

export default class TestNetRequest extends React.Component {

  constructor() {
    super();

    this.state = {
      modal: null,
      verificationCode: null,
      success: false,
      waitingForTrx: false,
    };
  }

  onVerify = (response) => {
    this.setState({
      verificationCode: response,
    });
  };

  onExpired = () => {
    this.setState({
      verificationCode: null,
    });
  };

  onLoad = (args) => {

  };

  requestTrx = async () => {
    let {account, onRequested} = this.props;
    let {verificationCode} = this.state;

    this.setState({waitingForTrx: true});

    try {

      let address = account.address;

      let {data} = await xhr.post(`${API_URL}/api/testnet/request-coins`, {
        address,
        captchaCode: verificationCode,
      });

      let {success, message, code, amount} = data;

      if (success) {
        this.setState({
          success: true,
          modal: (
              <SweetAlert success title={tu("trx_received")} onConfirm={this.hideModal}>
                <FormattedNumber value={amount / ONE_TRX}/> TRX {tu("have_been_added_to_your_account")}
              </SweetAlert>
          )
        });
      } else if (code === "CONTRACT_VALIDATE_ERROR") {
        this.setState({
          verificationCode: null,
          modal: (
              <SweetAlert danger title={tu("error")} onConfirm={this.hideModal}>
                {tu("test_trx_temporarily_unavailable_message")}
              </SweetAlert>
          )
        });
      } else {
        this.setState({
          verificationCode: null,
          modal: (
              <SweetAlert danger title="Error" onConfirm={this.hideModal}>
                {message}
              </SweetAlert>
          )
        });
      }

      onRequested && onRequested();

    } catch (e) {
      this.setState({
        verificationCode: null,
        modal: (
            <SweetAlert danger title="TRX Received" onConfirm={this.hideModal}>
              {tu("An_unknown_error_occurred,_please_try_again_in_a_few_minutes")}
            </SweetAlert>
        )
      });
    }
    finally {
      this.setState({
        waitingForTrx: false,
      });
    }
  };

  hideModal = () => {
    this.setState({modal: null});
  };

  canRequest = () => {
    let {verificationCode, waitingForTrx} = this.state;
    return !waitingForTrx && !!verificationCode;
  };

  render() {

    let {modal, success} = this.state;

    return (
        <div>
          {modal}
          <p className="pt-1">
            {tu("information_message_1")}
          </p>
          {
            success ?
                <Alert color="success">
                  {tu("information_message_3")}
                </Alert> :
                <React.Fragment>
                  <p className="d-flex justify-content-center">
                    <RecaptchaAsync
                        sitekey="6Le7AV4UAAAAADGmYVtg_lZuLj3w9xjwd7-P3gqX"
                        render="explicit"
                        onloadCallback={this.onLoad}
                        expiredCallback={this.onExpired}
                        verifyCallback={this.onVerify}/>
                  </p>
                  <button className="btn btn-secondary"
                          onClick={this.requestTrx}
                          disabled={!this.canRequest()}>
                    {tu("request_trx_for_testing")}
                  </button>
                </React.Fragment>
          }
        </div>
    )
  }
}
