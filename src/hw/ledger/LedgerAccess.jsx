import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import LedgerDevice from "./LedgerBridge";
import { delay } from "../../utils/promises";
import { PulseLoader } from "react-spinners";
import { loginWithLedger } from "../../actions/app";
import { tu, t } from "../../utils/i18n";
import { withTronWeb } from "../../utils/tronWeb";
import xhr from "axios/index";
import {API_URL} from "../../constants";
import Lockr from "lockr";

 class LedgerAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      connected: false,
      confirmed: false,
      address: "",
      type: props.loginType
    };
    this.ledger = new LedgerDevice();
  }

  componentDidMount() {
    this._isMounted = true;
    this.checkForConnection();
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.ledger.close();
  }

  checkForConnection = async () => {
    this.setState({ loading: true });
    while (this._isMounted) {
      let { connected, address } = await this.ledger.checkForConnection(true);

      if (connected) {
        this.setState({
          connected,
          address
        });
        break;
      }
      await delay(300);
    }

    this.setState({ loading: false });
  };

  openWallet = async () => {
    let { address } = this.state;
    let { history, onClose } = this.props;
    
    const tronWebLedger = this.props.tronWeb();
    const defaultAddress = {
      hex: tronWebLedger.address.toHex(address),
      base58: address
    };
    tronWebLedger.defaultAddress = defaultAddress;
    this.props.loginWithLedger(address, tronWebLedger);    
    history.push("/account");
    window.gtag("event", "Ledger", {
      event_category: "Login",
      event_label: address,
      referrer: window.location.origin,
      value: address
    });
    onClose && onClose();
    if(!Lockr.get("ledgerTokenList")){
      let { data } = await xhr.get(`${API_URL}/api/ledger?type=token10&start=0&limit=5000`);
      Lockr.set("ledgerTokenList", data.data);
    }
    if(!Lockr.get("ledgerExchangeList")){
      let { data }  = await xhr.get(`${API_URL}/api/ledger?type=exchange&start=0&limit=1000`);
      Lockr.set("ledgerExchangeList", data.data);
    }
  };
  render() {
    let { loading, connected, address, type } = this.state;
    return (
      <div>
        {type != 2 ? (
          <div className="mt-2 ml-3">
            <div style={{ fontSize: 12 }}>
              <div>{tu("latest_version_chrome")}</div>
              <div>{tu("ledger_support_version")}</div>
              <div className="mt-3">
                {tu("ledger_you_can")}
                <a target="_blank" href="https://www.ledger.com/">
                  {tu("ledger_website")}
                </a>
                {t("ledger_website_download")}
              </div>
              { <div>
                <a
                  target="_blank"
                  href="https://support.tronscan.org/hc/en-us/articles/360025936472-LEDGER-GUIDE"
                >
                  {tu("ledger_click_help")}>
                </a>
              </div> }
            </div>
            <div className="text-center pt-5 mx-5">
              <img
                src={require("./ledger-nano-s.png")}
                style={{ height: 65 }}
              />
              {loading && (
                <div className="mt-4">
                  <div className="text-muted">
                    {tu("open_tron_app_on_ledger")}
                  </div>
                  <div className="my-3">
                    <PulseLoader
                      color="#343a40"
                      loading={true}
                      height={5}
                      width={150}
                    />
                  </div>
                </div>
              )}
              {connected && (
                <div className="my-3">
                  <div className="text-center my-4">
                    <b className="text-success">Ledger Connected</b>
                    <br />
                    {address}
                  </div>
                  <button
                    className="btn btn-success mt-3"
                    onClick={this.openWallet}
                  >
                    {tu("open_wallet")}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center pt-5 mx-5">
            <img
              src={require("./ledger-tronlink.png")}
              style={{ height: 65 }}
            />
            {loading && (
              <div className="mt-4">
                <h5>
                  {tu("ledger_tronlink")}
                </h5>
                <div className="text-muted">
                  {tu("open_tron_app_on_ledger")}
                </div>
                <div className="my-3">
                  <PulseLoader
                    color="#343a40"
                    loading={true}
                    height={5}
                    width={150}
                  />
                </div>
              </div>
            )}
            {connected && (
              <div className="my-3">
                <div className="text-center my-4">
                  <b className="text-success">Ledger Connected</b>
                  <br />
                  {address}
                </div>
                <button
                  className="btn btn-success mt-3"
                  onClick={this.openWallet}
                >
                  {tu("ok_confirm")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { 
    loginWithLedger
  })(withRouter(withTronWeb(LedgerAccess)))
