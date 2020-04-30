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
import { API_URL, ONE_TRX} from "../../constants";
import Lockr from "lockr";
import { Radio } from 'antd';
import { isAddressValid } from "@tronscan/client/src/utils/crypto";
import { FormattedNumber } from "react-intl";

function addressFormat(addr) {
  let children_start =
    addr && isAddressValid(addr) ? addr.substring(0, 29) : "";
  let children_end = addr && isAddressValid(addr) ? addr.substring(29, 34) : "";

  return (
    <div className="ellipsis_box">
      <div className="ellipsis_box_start">{children_start}</div>
      <div className="ellipsis_box_end">{children_end}</div>
    </div>
  );
}
 class LedgerAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      connected: false,
      confirmed: false,
      address: "",
      type: props.loginType,
      from:0,
      to:1000,
      accounts:[],
      pathIndex:0,
      verifyAddress:false,
    };
    this.ledger = new LedgerDevice();
  }

  componentDidMount() {
    let { to } = this.state;
    this._isMounted = true;
    this.getAccounts(to);
  }

  componentWillUnmount() {
    this._isMounted = false;
    // this.ledger.close();
  }

  getAccounts = async (retryMax) => {
    this.setState({ loading: true });
    let {from, to} = this.state;
    let balance;
    const accounts = []
    try {
      if (retryMax <= 0 || !this._isMounted) {
        return 'error';
      }
      for (let i = from; i < to; i++) {
        const path = this.ledger.getPathForIndex(i);
        const address = await this.ledger.getAddress(path).catch(e => console.log('e=======',e));
        const valid =  await this.ledger.isActivedAddress(address);
        if(valid){
           balance = await this.ledger.getAddressTRXBalances(address);
        }
       
        accounts.push({
          path:path,
          address: address,
          balance: balance?balance:0,
          index: i,
          value: i,
        })
        if (!valid) {
          if(accounts.length !== 1){
            accounts.pop();
          }
          break;
        }
      }

      this.setState({ 
        loading: false,
        accounts
       });
      console.log('actived accounts',accounts)
    }catch (error){
      await delay(1000);
      return this.getAccounts(retryMax - 1);
    }
   
     
  }

  checkForConnection = async () => {
    this.setState({ loading: true, verifyAddress:true });
    let { pathIndex } = this.state;
    while (this._isMounted) {
      let { connected, address } = await this.ledger.checkForConnection(pathIndex,true);
      if (connected) {
        this.setState({
          connected,
          address
        });
        break;
      }
      await delay(300);
    }

    this.setState({ loading: false,verifyAddress:false });
  };

  openWallet = async () => {
    let { address, pathIndex} = this.state;
    let { history, onClose } = this.props;
    
    const tronWebLedger = this.props.tronWeb();
    const defaultAddress = {
      hex: tronWebLedger.address.toHex(address),
      base58: address
    };
    tronWebLedger.defaultAddress = defaultAddress;
    this.props.loginWithLedger(address, tronWebLedger, pathIndex);    
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

  onChange = e => {
    this.setState({
      pathIndex: e.target.value,
    });
  };
  render() {
    let { loading, connected, address, type, accounts, pathIndex, verifyAddress} = this.state;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div>
        {type != 2 ? (
          <div className="mt-2">
            <div className="ml-3" style={{ fontSize: 12 }}>
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
                </div>
              }
            </div>
            <div className="text-center pt-4 mx-4">
              <img
                src={require("./ledger-nano-s.png")}
                style={{ height: 65 }}
              />
              {loading && (
                <div className="mt-4">
                  <div className="text-muted">
                    { verifyAddress? tu("open_tron_app_on_verify_address"):tu("open_tron_app_on_ledger")}
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
                    className="btn btn-success mt-2"
                    onClick={this.openWallet}
                  >
                    {tu("open_wallet")}
                  </button>
                </div>
              )}
            {(accounts.length > 0 && !loading && !connected) && (
              <div className="my-3">
                <div className="text-center my-4">
                  <b className="text-success">Select An Account</b>
                  <br />
                  <div className="d-flex mt-3 choose-ledger-account">
                    <div style={{width:'50px'}}>
                      <Radio.Group options={accounts} onChange={this.onChange} value={pathIndex} />
                    </div>
                    <table className="table m-0 temp-table">
                    <tbody>
                    {
                      accounts.map((item,index)=>{
                        return <tr key={index} style={{fontSize: '12px',textAlign: 'left'}}>
                          {/* <td>
                            <Radio 
                             value={index} 
                             checked={item.checked} 
                             blur></Radio>
                          </td> */}
                          <td>
                            {index+1}
                          </td>
                          <td>
                            <div style={{color: '#c23631',fontFamily: 'Helvetica-Bold',userSelect: 'none',maxWidth:'220px'}}>
                               {addressFormat(item.address)}
                            </div> 
                          </td>
                          <td>
                            <FormattedNumber value={item.balance / ONE_TRX}  maximumFractionDigits={6}/> TRX
                          </td>
                          {/* <td className="text-right">
                            {
                              <button className="btn btn-danger mr-2"  style={{
                                marginTop: '-5px',
                                marginBottom: '-5px'
                              }} onClick={() => {
                                this.showUnfreezeModal(0, true, item.to)
                              }}>
                                {tu("unfreeze")}
                              </button>
                            }
                          </td> */}
                        </tr>
                      })
                    }
                    </tbody>
                  </table>
               
                  </div>
                 
                </div>
                <button
                  className="btn btn-success mt-2"
                  onClick={this.checkForConnection}
                >
                  {tu("ok_confirm")}
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
                  { verifyAddress? tu("open_tron_app_on_verify_address"):tu("open_tron_app_on_ledger")}
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
                  className="btn btn-success mt-2"
                  onClick={this.openWallet}
                >
                  {tu("ok_confirm")}
                </button>
              </div>
            )}
           {(accounts.length > 0 && !loading && !connected) && (
              <div className="my-3">
                <div className="text-center my-4">
                  <b className="text-success">Select An Account</b>
                  <br />
                  <div className="d-flex mt-3 choose-ledger-account">
                    <div style={{width:'50px'}}>
                      <Radio.Group options={accounts} onChange={this.onChange} value={pathIndex} />
                    </div>
                    <table className="table m-0 temp-table">
                    <tbody>
                    {
                      accounts.map((item,index)=>{
                        return <tr key={index} style={{fontSize: '12px',textAlign: 'left'}}>
                          {/* <td>
                            <Radio 
                             value={index} 
                             checked={item.checked} 
                             blur></Radio>
                          </td> */}
                          <td>
                            {index+1}
                          </td>
                          <td>
                            <div style={{color: '#c23631',fontFamily: 'Helvetica-Bold',userSelect: 'none',maxWidth:'220px'}}>
                               {addressFormat(item.address)}
                            </div> 
                          </td>
                          <td>
                            <FormattedNumber value={item.balance / ONE_TRX}  maximumFractionDigits={6}/> TRX
                          </td>
                          {/* <td className="text-right">
                            {
                              <button className="btn btn-danger mr-2"  style={{
                                marginTop: '-5px',
                                marginBottom: '-5px'
                              }} onClick={() => {
                                this.showUnfreezeModal(0, true, item.to)
                              }}>
                                {tu("unfreeze")}
                              </button>
                            }
                          </td> */}
                        </tr>
                      })
                    }
                    </tbody>
                  </table>
               
                  </div>
                 
                </div>
                <button
                  className="btn btn-success mt-2"
                  onClick={this.checkForConnection}
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
