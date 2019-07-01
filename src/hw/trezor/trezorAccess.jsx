import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {PulseLoader} from "react-spinners";
import {t, tu} from "../../utils/i18n";
import TrezorConnect from "trezor-connect";
import {connect} from "react-redux";
import {loginWithTrezor} from "../../actions/app";

window.__TREZOR_CONNECT_SRC = 'https://localhost:8088/';

@connect(
  null,
  {
    loginWithTrezor
  }
)
@withRouter
export default class TrezorAccess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      connected: false,
      confirmed: false,
      address: "",
    };

  };

  componentDidMount() {
    this._isMounted = true;
    this.getAddress();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAddress = async () => {

    TrezorConnect.manifest({
      email: 'dev@tronscan.org',
      appUrl: 'https://tronscan.org'
    });

    console.log("getting address!");
    try {
      let {payload, success} = await TrezorConnect.tronGetAddress({
        "path": "m/44'/195'/0'/0/0",
        "showOnTrezor": true
      });

      console.log("result",  {
        payload,
        success,
      });

      if (success) {
        this.setState({
          loading: false,
          connected: true,
          address: payload.address
        });
      }
    } catch (e) {
      console.error("trezor error", e);
    }

  };

  openWallet = () => {
    let {address} = this.state;
    let {history, onClose} = this.props;
    this.props.loginWithTrezor(address);

    history.push("/account");

    onClose && onClose();
  };

  render() {
    let {loading, connected, address} = this.state;
    return (
      <div className="mt-2 ml-3">
        <div style={{fontSize:12}}>
          <div>{tu('latest_version_chrome')}</div>
          <div>{tu('ledger_support_version')}</div>
          <div className="mt-3">{tu('ledger_you_can')}
            <a target="_blank"
               href="https://www.ledger.com/"
               rel="noopener noreferrer">
                {tu('ledger_website')}
            </a>
            {t('ledger_website_download')}

          </div>
          <div>
            <a target="_blank"
               href="https://support.tronscan.org/hc/en-us/articles/360025936472-LEDGER-GUIDE"
               rel="noopener noreferrer">
                {tu('ledger_click_help')}>
            </a>
          </div>
        </div>
        <div className="text-center pt-5 mx-5">
          <img src={require("./trezor-logo-black.png")} style={{ height: 65 }} />
            { loading &&
            <div className="mt-4">
              <div className="text-muted">
                  {tu('open_tron_app_on_ledger')}
              </div>
              <div className="my-3">
                <PulseLoader color="#343a40" loading={true} height={5} width={150} />
              </div>
            </div>
            }
            {
                connected &&
                <div className="my-3">
                  <div className="text-center my-4">
                    <b className="text-success">Ledger Connected</b><br/>
                      {address}
                  </div>
                  <button className="btn btn-success mt-3"
                          onClick={this.openWallet}>
                      {tu("open_wallet")}
                  </button>
                </div>
            }
        </div>

      </div>
    )
  }
}
