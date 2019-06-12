/*eslint-disable no-script-url*/
import React, {Fragment, PureComponent} from 'react'
import {injectIntl} from "react-intl";
import logo from '../images/tron-banner-inverted.png'
import tronLogoBlue from '../images/tron-banner-tronblue.png'
import tronLogoDark from '../images/tron-banner-1.png'
import tronLogoTestNet from "../images/tron-logo-testnet.png";
import tronLogoInvertedTestNet from "../images/tron-logo-inverted-testnet.png";
import {flatRoutes, routes} from "../routes"
import {Link, NavLink, withRouter} from "react-router-dom"
import {filter, find, isString, isUndefined, trim, toUpper,debounce} from "lodash"
import {tu, t} from "../utils/i18n"
import {
  enableFlag,
  login,
  loginWithAddress,
  loginWithTronLink,
  logout,
  setActiveCurrency,
  setLanguage,
  setTheme
} from "../actions/app"
import { setWebsocket } from '../actions/account';
import {connect} from "react-redux"
import {Badge, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap"
import Avatar from "./common/Avatar"
import {AddressLink, HrefLink} from "./common/Links"
import {FormattedNumber} from "react-intl"
import {API_URL, IS_TESTNET, ONE_TRX} from "../constants"
import {matchPath} from 'react-router'
import {doSearch, getSearchType} from "../services/search"
import {readFileContentsFromEvent} from "../services/file"
import {decryptString, validatePrivateKey} from "../services/secureKey";
import SweetAlert from "react-bootstrap-sweetalert";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import Notifications from "./account/Notifications";
import SendModal from "./transfer/Send/SendModal";
import {bytesToString} from "@tronscan/client/src/utils/bytes";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import ReceiveModal from "./transfer/Receive/ReceiveModal";
import {toastr} from 'react-redux-toastr'
import Lockr from "lockr";
import {BarLoader} from "./common/loaders";
import {Truncate} from "./common/text";
import {Icon} from 'antd';
import isMobile from '../utils/isMobile';
import {Client} from '../services/api';
import $ from 'jquery';
import xhr from "axios/index";
import LedgerAccess from "../hw/ledger/LedgerAccess";
import { getQueryString } from "../utils/url";

class Navigation extends React.Component {

  constructor() {
    super();
    this.callAjax = debounce(this.callAjax, 500);
    this.fileRef = React.createRef();
    this.id = 0;
    this.loginFlag = false;
    this.isSearching=true;
    this.state = {
      search: "",
      searchResults: [],
      popup: null,
      notifications: [],
      isImportAccount: false,
      isTRONlinkLogin: false,
      loginWarning: false,
      signInWarning: false,
      address: '',
      announcement: '',
      annountime: '1-1',
      announId: 83
    };
  }

  // componentDidUpdate(prevProps) {
  /*
  if (account.isLoggedIn && wallet.isOpen && !this.loginFlag) {
     toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
     this.loginFlag = true;
   }
  */

  // }


  componentWillMount() {
    this.reLoginWithTronLink();
  }

  componentDidMount() {
    let {account,setWebsocket} = this.props;
    let _this = this;

    window.addEventListener('message', function (e) {
      if (e.data.message) {
        _this.setState({address: e.data.message.data});

      }
    })
    //this.getAnnouncement();
     setWebsocket();
    $(document).click(() => {
      $('#_searchBox').css({display: 'none'});
    });
  }

  componentWillUpdate(nextProps, nextState) {
      if (nextState.address !== this.state.address && this.isString(nextState.address) && this.isString(this.state.address)) {
      this.reLoginWithTronLink();
    }
  }

  componentWillUnmount() {
      let { account, websocket }  = this.props;
      if(!account.isLoggedIn && websocket){
          websocket.close();
          Lockr.set("websocket", 'close')
      }
  }

  componentDidUpdate(prevProps) {
    const {activeLanguage} = this.props
    if (activeLanguage != prevProps.activeLanguage) {
     // this.getAnnouncement()
    }
  }

  isString(str){
     return (typeof str==='string')&&str.constructor==String;
  }

  async getAnnouncement() {
    const {announId} = this.state
    let {activeLanguage} = this.props;

    const {data} = await Client.getNotices({sort: '-timestamp'});
    if (data.length) {
      const list = data.filter(o => o.id == announId)[0]
      if(list){
        const annt = activeLanguage === 'zh' ? list.titleCN : list.titleEN
        this.setState({announcement: annt, annountime: list.createTime.substring(5, 10)});
      }
    }

  }

  reLoginWithTronLink = () => {
    let {intl} = this.props;
    let { address } = this.state;
    if(getQueryString('from') == 'tronlink'){
        Lockr.set("islogin", 1)
    }
    if (Lockr.get("islogin")) {
      let timer = null;
      let count = 0;
      timer = setInterval(() => {
        const tronWeb = window.tronWeb;
        if (tronWeb && tronWeb.defaultAddress.base58) {
          this.props.loginWithTronLink(tronWeb.defaultAddress.base58, tronWeb).then(() => {
            toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
          });
          this.setState({address: tronWeb.defaultAddress.base58});
          clearInterval(timer)
        } else {
          count++
          if (count > 30) {
            count = 0
            Lockr.set("islogin", 0)
            clearInterval(timer)
          }
        }
      }, 100)
    }
  }

  setLanguage = (language) => {
    this.props.setLanguage(language);
  };

  setCurrency = (currency) => {
    this.props.setActiveCurrency(currency);
  };

  login(e) {
    e.stopPropagation();
    let {intl} = this.props;
    let {privateKey} = this.state;
    if (trim(privateKey) === "external") {
      this.props.enableFlag("mobileLogin");
    } else {
      this.props.login(privateKey).then(() => {
        toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
      });
    }
  };

  isLoginValid = () => {
    let {privateKey} = this.state;

    if (trim(privateKey) === "external") {
      return true;
    }

    if (!privateKey || privateKey.length === 0) {
      return false;
    }


    if (privateKey.length !== 64) {
      return false;
    }
    
    const HAS_LIST = '0123456789ABCDEF'.split('');
    for (let i = 0; i < privateKey.length; i++) {
      const element = toUpper(privateKey[i]);
      if(HAS_LIST.indexOf(element) === -1){
        return false
      }
    }
    

    return true;
  };

  selectFile(e) {
    e.stopPropagation();
    this.fileRef.current.click();
  };

  onFileSelected = async (ev) => {
    if (ev.target.value.endsWith(".txt")) {
      let contents = await readFileContentsFromEvent(ev);
      this.fileRef.current.value = '';
      this.openPasswordPrompt(contents);
    }
  };

  openPasswordPrompt = (contents) => {
    this.setState({
      isImportAccount: false,
      isTRONlinkLogin: false,
      loginWarning: false,
      signInWarning: false,
      popup: (
          <SweetAlert
              input
              showCancel
              inputType="password"
              cancelBtnBsStyle="default"
              cancelBtnText={tu("cancel")}
              title={tu("unlock_keyFile")}
              placeHolder="Password"
              onCancel={this.hideModal}
              validationMsg={tu("enter_password_message")}
              confirmBtnText={tu("ok_confirm")}
              onConfirm={(password) => this.unlockKeyFile(password, contents)}>
            {tu("password")}
          </SweetAlert>
      )
    });
  };

  hideModal = () => {
    this.setState({popup: null});
  };

  unlockKeyFile = (password, contents) => {
    let {key, address, salt} = JSON.parse(bytesToString(hexStr2byteArray(contents)));
    let privateKey = decryptString(password, salt, key);
    if (validatePrivateKey(privateKey) && pkToAddress(privateKey) === address) {
      this.setState({
        popup: (
            <SweetAlert
                success title={tu("wallet_unlocked")}
                onConfirm={this.hideModal}
                confirmBtnText={tu("ok_confirm")}/>
        )
      });
      this.props.login(privateKey);
    } else {
      this.setState({
        popup: (
            <SweetAlert
                danger
                showCancel
                title={tu("password_incorrect")}
                cancelBtnBsStyle="default"
                cancelBtnText={tu("try_again")}
                onCancel={() => this.openPasswordPrompt(contents)}
                onConfirm={this.hideModal}/>
        )
      });
    }
  };

  logout(e) {
    e.stopPropagation();
    let {intl, logout} = this.props;
    logout();
    this.loginFlag = false;
    this.setState({
      privateKey: '',
      isImportAccount: false,
      isTRONlinkLogin: false,
    });
    toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'logout_success'}));
  };


  getActiveComponent() {
    let {router} = this.props;
    return find(flatRoutes, route => route.path && matchPath(router.location.pathname, {
      path: route.path,
      strict: false,
    }));
  }


  doSearch = async () => {
    this.isSearching = true;
    let {intl} = this.props;

    let {searchResults} = this.state;
    if (searchResults && searchResults.length) {
      if (searchResults[0].desc === 'Block') {
        this.afterSearch("#/block/" + trim(searchResults[0].value));
      }
      if (searchResults[0].desc === 'Token-TRC20') {
        this.afterSearch("#/token20/" + trim(searchResults[0].value.split(' ')[searchResults[0].value.split(' ').length-1]));
      }
      if (searchResults[0].desc === 'Token-TRC10') {
        this.afterSearch("#/token/" + trim(searchResults[0].value.split(' ')[searchResults[0].value.split(' ').length-1]));
      }
      if (searchResults[0].desc === 'Address') {
        this.afterSearch("#/address/" + trim(searchResults[0].value));
      }
      if (searchResults[0].desc === 'Contract') {
        this.afterSearch("#/contract/" + trim(searchResults[0].value));
      }
      if (searchResults[0].desc === 'TxHash') {
        this.afterSearch("#/transaction/" + trim(searchResults[0].value));
      }
    }
    else {
      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'search_not_found'}));
    }

  };

  onSearchKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      this.doSearch();
      $('#_searchBox').css({display: 'none'});
    }
  };

  onSearchChange = (ev) => {
    this.setState({search: ev.target.value});
    ev.persist();
    this.callAjax(ev.target.value);
  }

  callAjax = async (value) => {
    this.isSearching = true;
    let {search} = this.state;
    if (search === "") {
      this.setState({searchResults: []});
      $('#_searchBox').css({display: 'none'});
      return;
    }

    let result = await xhr.get(API_URL+"/api/search?term=" + trim(search));
    let results = result.data;
    this.isSearching = false;
    /*let results = [
      {desc: 'Token-TRC10', value: "IGG 1000029"},
      {desc: 'Token-TRC20', value: "IGG 1000029"},
      {desc: 'Block', value: "1000029"},
      {desc: 'Address', value: "TVethjgashn8t4cwKWfGA3VvSgMwVmHKNM"},
      {desc: 'Contract', value: "TVethjgashn8t4cwKWfGA3VvSgMwVmHKNM"},
      {desc: 'TxHash', value: "9073aca5dfacd63c8e61f6174c98ab3f350bc9365df6ffc3bc7a70a252711d6f"}

    ];*/

    this.setState({searchResults: results});
    if (results.length) {
      $('#_searchBox').css({display: 'block'});
    } else {
      $('#_searchBox').css({display: 'none'});
    }
  }

  afterSearch = (hash) => {
    hash && (window.location.hash = hash);
    this.setState({searchResults: []});
    this.setState({search: ""});
  }

  onSetThemeClick = (ev) => {

    let {theme} = this.props;

    switch (theme) {
      case "light":
        this.props.setTheme("dark");
        break;
      case "dark":
        this.props.setTheme("light");
        break;
      case "tron":
        this.props.setTheme("dark");
        break;

    }
  };

  renderThemeChooser() {

    let {theme} = this.props;

    let icon = "";

    switch (theme) {
      case "light":
        icon = "fa fa-moon";
        break;
      case "dark":
        icon = "fa fa-sun";
        break;
      case "tron":
        icon = "fas fa-user-astronaut";
        break;
    }

    return (
        <li className="nav-item dropdown navbar-right">
          <a key={theme} className="nav-link" href="javascript:;" onClick={this.onSetThemeClick}>
            <i className={icon}/>
          </a>
        </li>
    )
  }

  newTransaction = () => {
    this.setState({
      popup: (
          <SendModal onClose={this.hideModal}/>
      )
    });
  };

  showReceive = () => {
    this.setState({
      popup: (
          <ReceiveModal onClose={this.hideModal}/>
      )
    });
  };

  getLogo = () => {
    let theme = 'light';

    if (IS_TESTNET) {
      switch (theme) {
        case "light":
          return tronLogoTestNet;
        default:
          return tronLogoInvertedTestNet;
      }
    } else {
      switch (theme) {
        case "tron":
          return tronLogoBlue;
        case "light":
          return tronLogoDark;
        default:
          return logo;
      }
    }
  };

  loginWithLedger = () => {
    this.openLedgerModal();
  };

  openLedgerModal = () => {
    this.setState({
      popup: (
          <Modal isOpen={true} fade={false} keyboard={false} size="lg" className="modal-dialog-centered">
            <ModalHeader className="text-center" toggle={this.hideModal}>
              {tu("open_ledger")}&nbsp;&nbsp;
              {/*<Link to="/help/ledger" onClick={this.hideModal} style={{fontSize:12,marginTop:6}}>*/}
                {/*<small>*/}
                    {/*{tu("ledger_user_guide")}*/}
                {/*</small>*/}
              {/*</Link>*/}
            </ModalHeader>
            <ModalBody className="p-0">
              <LedgerAccess onClose={this.hideModal} />
            </ModalBody>
          </Modal>
      )
    });
  };

  loginWithMobileDevice = () => {
    console.log("LOGIN WITH MOBILE");
  };

  loginWithTronLink(e) {
    let {intl} = this.props;
    e.stopPropagation();
    const {loginWarning, signInWarning} = this.state;
    const tronWeb = window.tronWeb;
    // 没有下载 tronlink
    if (!tronWeb) {
      this.setState({loginWarning: true});
      // this.loading = false
      return
    }

    // 没有登录 tronlink
    const address = tronWeb.defaultAddress.base58;
    if (!address) {
      this.setState({signInWarning: true});
      //this.loading = false
      Lockr.set("islogin", 0);
      return
    }

    // 已登录 tronlink
    if (address) {
      //this.isauot = true
      Lockr.set("islogin", 1);
      this.props.loginWithTronLink(address, tronWeb).then(() => {
        toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
        this.setState({isImportAccount: false})
      });
    }
  };

  closeLoginModel = (e) => {
    e.stopPropagation()
    this.setState({
      isImportAccount: false,
      isTRONlinkLogin: false,
      loginWarning: false,
      signInWarning: false
    })
  };

  clickLoginWithTronLink(e) {
    e.stopPropagation()
    this.setState({
      isTRONlinkLogin: true,
      isImportAccount: false
    }, () => {

    });
  }

  clickLoginWithPk(e) {
    e.stopPropagation()
    this.setState({
      isTRONlinkLogin: false,
      isImportAccount: true
    }, () => {

    })
  }

  renderWallet() {
    let {account, totalTransactions = 0, flags, wallet, activeLanguage} = this.props;
    let {isImportAccount, isTRONlinkLogin, loginWarning, signInWarning, address} = this.state;

    if (wallet.isLoading) {
      return (
          <li className="nav-item">
            <a className="nav-link" href="javascript:;">
              Loading Wallet...
            </a>
          </li>
      );

    }
    const STYLE_MAP={
      default: 156,
      zh: 137,
      ja: 180
    }
    const style_width = STYLE_MAP[activeLanguage]?
                        STYLE_MAP[activeLanguage]:
                        STYLE_MAP['default'];

    return (
        <Fragment>
          {
            (account.isLoggedIn && wallet.isOpen) ?

                <li className="nav-static dropdown token_black nav">
                  <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:;">
                    {tu("wallet")}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right account-dropdown-menu px-3">
                    <li className=" py-1">
                      <div className="row" style={{width: 305}}>
                        <Link to="/account" className="col-12 d-flex justify-content-end align-items-center">
                          {/* <div className="col-lg-2">
                          <Avatar size={45} value={account.address}/>
                        </div> */}
                          <div>
                            <b style={{color: '#333'}}>{wallet.current.name || tu("account")}</b>
                            <br/>
                            {/* <AddressLink
                              address={account.address}
                              className="small text-truncate text-nowrap d-sm-inline-block"
                              style={{width: 150}}/> */}
                            <Truncate><span>{account.address}</span></Truncate>
                          </div>
                          {/* <Link to="/account" className="col-lg-4 d-flex justify-content-end align-items-center"> */}
                          <i className="fa fa-angle-right ml-3" aria-hidden="true"></i>
                          {/* </Link> */}
                        </Link>
                      </div>

                    </li>
                    {
                      wallet.current.representative.enabled && (
                          <li className="dropdown-item text-danger text-center">
                            Representative
                          </li>
                      )
                    }
                    <li className="dropdown-divider"/>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-credit-card mr-2"/>
                      <FormattedNumber value={wallet.current.balance / ONE_TRX}/> TRX
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-bolt mr-2"/>
                      <FormattedNumber value={wallet.current.frozenTrx / ONE_TRX}/> TRON {tu("power")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-tachometer-alt mr-2"/>
                      <FormattedNumber
                          value={wallet.current.bandwidth.netRemaining + wallet.current.bandwidth.freeNetRemaining}/> {tu("bandwidth")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-server mr-2"/>
                      <FormattedNumber value={wallet.current.bandwidth.energyRemaining}/> {tu("energy")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </Link>
                    <Link className="dropdown-item"
                          to={"/blockchain/transactions?address=" + account.address}>
                      <i className="fa fa-exchange-alt mr-2"/>
                      <FormattedNumber value={totalTransactions}/> {tu("transactions")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </Link>
                    <li className="dropdown-divider"/>
                    <a className="dropdown-item" href="javascript:;" onClick={this.newTransaction}>
                      <i className="fa fa-paper-plane mr-2"/>
                      {tu("send")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </a>
                    <a className="dropdown-item" href="javascript:;" onClick={this.showReceive}>
                      <i className="fa fa-qrcode mr-2"/>
                      {tu("receive")}
                      <i className="fa fa-angle-right float-right" aria-hidden="true"></i>
                    </a>
                    {/*<Link className="dropdown-item" to={"/blockchain/transactions?address=" + account.address}>*/}
                    {/*<i className="fa fa-qrcode mr-2"/>*/}
                    {/*Receive*/}
                    {/*</Link>*/}
                    <li className="dropdown-divider"/>
                    <li className=" pt-1 pb-2">
                      <button className="btn btn-danger btn-block"
                              onClick={(e) => {
                                this.logout(e)
                              }}>{tu("sign_out")}</button>
                    </li>
                  </ul>
                </li> :
                <li className="dropdown nav nav_input">
                  <div className="nav-link dropdown-toggle nav-item" onClick={(e) => {
                    isMobile && this.clickLoginWithPk(e)
                  }}>
                    {tu("open_wallet")}
                    <ul className="dropdown-menu dropdown-menu-right nav-login-wallet" style={{minWidth: style_width}}>
                      <li className="px-2 py-1 border-bottom-0" onClick={(e) => {
                        this.clickLoginWithTronLink(e)
                      }}>
                        <div className="dropdown-item text-uppercase d-flex align-items-center text-muted">
                          <img src={require("../images/login/tronlink.png")} width="16px" height="16px" className="mr-2"/>
                          {tu('sign_in_with_TRONlink')}
                        </div>
                      </li>
                      <li className="px-2 py-1 border-bottom-0" onClick={(e) => this.loginWithLedger(e)}>
                        <div className="dropdown-item text-uppercase d-flex  align-items-center text-muted">
                          <img src={require("../images/login/ledger.png")} width="16px" height="16px" className="mr-2"/>
                          {tu('sign_in_with_ledger')}
                        </div>
                      </li>
                      <li className="px-2 py-1" onClick={(e) => {
                        this.clickLoginWithPk(e)
                      }}>
                        <div className="dropdown-item text-uppercase d-flex align-items-center text-muted">
                          <div className="d-flex justify-content-center mr-2" style={{width: '16px', height: '16px'}}>
                          <img src={require("../images/login/kp.png")} width="11px" height="16px"/>
                          </div>
                          {tu('import_a_wallet')}
                        </div>
                      </li>
                    </ul>
                  </div>

                  {
                    isImportAccount ? <div className="login-mask">
                      <ul className="login-import">
                        <div className="login-cancel" onClick={(e) => {
                          this.closeLoginModel(e)
                        }}>
                          <Icon type="close"/>
                        </div>
                        <li className="px-3 py-4">
                          <div className="text-center">
                            <label>{tu("private_key")}</label>
                            <input
                                type="text"
                                className="form-control"
                                onChange={ev => this.setState({privateKey: ev.target.value})}
                                placeholder=""/>
                          </div>
                          <div className="login-privatekey-warn pt-2">
                              <i class="fas fa-exclamation-triangle mr-2" style={{color:"#FF8C00"}}></i>
                              {tu("login_privatekey_warn")}
                              <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec" target="_blank">
                                 TronLink
                              </a>
                              {tu("login_privatekey_warn_safe")}
                          </div>
                          <button className="btn btn-danger btn-block mt-2"
                                  disabled={!this.isLoginValid()}
                                  onClick={(e) => {
                                    this.login(e)
                                  }}>
                            {tu("sign_in")}
                          </button>
                        </li>
                        {/* <li className="dropdown-divider blod"/> */}
                        <li className="px-3 py-4">
                          <div className="text-center">
                            <label>{tu("keystore_file")}</label>
                            <button className="btn btn-danger btn-block" onClick={(e) => {
                              this.selectFile(e)
                            }}>
                              {tu("select_file")}
                            </button>
                            <input type="file" ref={this.fileRef} className="d-none"
                                   onChange={this.onFileSelected}
                                   accept=".txt"/>
                          </div>

                        </li>
                        {/* <li className="dropdown-divider blod"/> */}
                        {
                          flags.mobileLogin &&
                          <Fragment>
                            <li className="px-3 py-4 ">
                              <div className="text-center">
                                <label>{tu("Mobile Login")}</label>
                                <button className="btn btn-success btn-block"
                                        onClick={this.loginWithMobileDevice}>
                                  {tu("login_mobile")}
                                </button>
                              </div>
                            </li>
                            {/* <li className="dropdown-divider"/> */}
                          </Fragment>
                        }
                        <li className="px-3 py-4" onClick={(e) => {
                          this.closeLoginModel(e)
                        }}>
                          <Link className="btn btn-primary btn-block" to="/wallet/new">
                            {tu("create_wallet")}
                          </Link>
                        </li>
                      </ul>
                    </div> : ''
                  }
                  {
                    isTRONlinkLogin ? <div className="login-mask">
                      <div className="login-tronlink">
                        <div className="login-cancel" onClick={(e) => {
                          this.closeLoginModel(e)
                        }}>
                          <Icon type="close"/>
                        </div>
                        <div className="px-3 py-4">
                          <div className="text-center">
                            <label>{tu('sign_in_TRONlink')}</label>
                          </div>
                        </div>
                        {/* <li className="dropdown-divider blod"/> */}
                        <div className="px-3 py-2 tronlink-pic">
                          <img src={require("../images/tronlink.png")} alt="TRONlink"/>
                        </div>
                        <div className="text-center pt-2" style={{color: '#C23631'}}>
                          {
                            loginWarning ? tu('sign_in_TRONlink_warning') : ''
                          }
                          {
                            signInWarning ? tu('sign_in_TRONlink_warning_0') : ''
                          }
                        </div>

                        {
                          flags.mobileLogin &&
                          <Fragment>
                            <div className="px-3 py-4 ">
                              <div className="text-center">
                                <label>{tu("Mobile Login")}</label>
                                <button className="btn btn-success btn-block"
                                        onClick={this.loginWithMobileDevice}>
                                  {tu("login_mobile")}
                                </button>
                              </div>
                            </div>
                            {/* <li className="dropdown-divider"/> */}
                          </Fragment>
                        }
                        <div className="px-3 py-4">
                          <button className="btn btn-warning btn-block"
                                  onClick={(e) => {
                                    this.loginWithTronLink(e)
                                  }}>
                            {tu("sign_in_TRONlink")}
                          </button>
                        </div>
                        <div className="text-center px-3 pb-4 install-TRONlink">
                          <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec">
                            {tu('uninstall_TRONlink')}>>
                          </a>
                        </div>
                      </div>
                    </div> : ''
                  }


                </li>
          }
        </Fragment>
    )
  }

  render() {

    let {intl, params} = this.props;
    let {
      languages,
      activeLanguage,
      currencyConversions,
      activeCurrency,
      wallet,
      syncStatus,
    } = this.props;

    let {search, popup, notifications, announcement, announId, annountime, searchResults} = this.state;

    let activeComponent = this.getActiveComponent();

    return (
        <div className="header-top">
          {popup}
          <div className="logo-wrapper">
            <div className="container py-2 d-flex px-0">
              <div className="ml-4">
                <Link to="/">
                  <img src={this.getLogo()} className="logo" alt="Tron"/>
                </Link>
              </div>
              {
                IS_TESTNET &&
                <div className="col text-center text-info font-weight-bold py-2">
                  TESTNET
                </div>
              }
              {
                (syncStatus && syncStatus.sync.progress < 95) &&
                <div className="col text-danger text-center py-2">
                  Tronscan is syncing, data might not be up-to-date ({Math.round(syncStatus.sync.progress)}%)
                </div>
              }
              {/*{*/}
                {/*announcement &&*/}
                {/*<div className="col text-danger text-center py-2 d-none d-md-block text-truncate nav_notice">*/}
                  {/*<img src={require('../images/announcement-logo.png')} alt="" style={{width: '16px'}}*/}
                       {/*className="mr-1"/>*/}
                  {/*<Link to={'/notice/' + announId}>{announcement} <span*/}
                      {/*style={{color: '#999'}}>({annountime})</span></Link>*/}
                {/*</div>*/}
              {/*}*/}
              <div className="ml-auto d-flex">
                {
                  <div className="hidden-mobile nav-searchbar">
                    <div className="input-group dropdown">
                      <input type="text"
                             className="form-control p-2 bg-white border-0 box-shadow-none"
                             style={styles.search}
                             value={search}
                             onKeyDown={this.onSearchKeyDown}
                             onChange={this.onSearchChange}
                             onClick={this.callAjax}
                             placeholder={intl.formatMessage({id: "search_description1"})}/>
                      <div className="input-group-append" style={{marginLeft:0}}>
                        <button className="btn box-shadow-none" disabled={this.isSearching} onClick={this.doSearch}>
                          <i className="fa fa-search"/>
                        </button>
                      </div>
                      <div className="dropdown-menu" id="_searchBox" style={{width: '100%',maxHeight:'300px', overflow:'auto'}}>
                        {
                          searchResults && searchResults.map((result, index) => {
                                if (result.desc === 'Block') {
                                  return <Link className="dropdown-item text-uppercase" to={"/block/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Token-TRC20') {
                                  return <Link className="dropdown-item text-uppercase" to={"/token20/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Token-TRC10') {
                                  return <Link className="dropdown-item text-uppercase" to={"/token/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Address') {
                                  return <Link className="dropdown-item text-uppercase" to={"/address/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Contract') {
                                  return <Link className="dropdown-item text-uppercase" to={"/contract/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'TxHash') {
                                  return <Link className="dropdown-item text-uppercase" to={"/transaction/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }}
                                            key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                              }
                          )
                        }
                      </div>
                    </div>
                  </div>
                }
                <div className="navbar navbar-expand-md navbar-dark py-0">
                  <ul className="navbar-nav navbar-right wallet-nav">
                    {
                      wallet.isOpen && <Notifications wallet={wallet} notifications={notifications}/>
                    }
                    {this.renderWallet()}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden-PC nav-searchbar">
            <div className="input-group dropdown">
              <input type="text"
                     className="form-control p-2 bg-white border-0 box-shadow-none"
                     style={styles.search}
                     value={search}
                     onKeyDown={this.onSearchKeyDown}
                     onChange={this.onSearchChange}
                     onClick={this.callAjax}
                     placeholder={intl.formatMessage({id: "search_description1"})}/>
              <div className="input-group-append">
                <button className="btn box-shadow-none" disabled={this.isSearching} onClick={this.doSearch}>
                  <i className="fa fa-search"/>
                </button>
              </div>
              <div className="dropdown-menu" id="_searchBox" style={{width: '100%',maxHeight:'300px', overflow:'auto'}}>
                {
                  searchResults && searchResults.map((result, index) => {
                        if (result.desc === 'Block') {
                          return <Link className="dropdown-item text-uppercase" to={"/block/" + trim(result.value)} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                        if (result.desc === 'Token-TRC20') {
                          return <Link className="dropdown-item text-uppercase" to={"/token20/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                        if (result.desc === 'Token-TRC10') {
                          return <Link className="dropdown-item text-uppercase" to={"/token/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                        if (result.desc === 'Address') {
                          return <Link className="dropdown-item text-uppercase" to={"/address/" + trim(result.value)} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                        if (result.desc === 'Contract') {
                          return <Link className="dropdown-item text-uppercase" to={"/contract/" + trim(result.value)} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                        if (result.desc === 'TxHash') {
                          return <Link className="dropdown-item text-uppercase" to={"/transaction/" + trim(result.value)} onClick={() => {
                            this.afterSearch()
                          }}
                                    key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                        }
                      }
                  )
                }
              </div>
            </div>
          </div>
          <nav className="top-bar navbar navbar-expand-md navbar-dark">
            <div className="container">
              <button className="navbar-toggler" type="button" data-toggle="collapse"
                      data-target="#navbar-top">
                <span className="navbar-toggler-icon"/>
              </button>
              {/*{*/}
                {/*announcement && <div className="col text-danger d-md-none">*/}
                  {/*<div className="">*/}

                    {/*<img src={require('../images/announcement-logo.png')} alt="" style={{width: '16px', height: '16px'}}*/}
                         {/*className="mr-1"/>*/}
                    {/*<Link to={'/notice/' + announId}>{announcement} <span style={{color: '#999'}}>({annountime})</span></Link>*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*}*/}
              <div className="collapse navbar-collapse" id="navbar-top">
                <ul className="navbar-nav mr-auto">
                  {filter(routes, r => r.showInMenu !== false).map(route => (
                      <li key={route.path} className="nav-item dropdown">
                        {
                          route.linkHref === true ?
                              <HrefLink
                                  className={route.routes ? "nav-link dropdown-toggle" : "nav-link"}
                                  href={activeLanguage == 'zh' ? route.zhurl : route.enurl}>
                                {route.icon &&
                                <i className={route.icon + " d-none d-lg-inline-block mr-1"}/>}
                                {tu(route.label)}
                              </HrefLink>
                              :
                              <NavLink
                                  className={route.routes ? "nav-link dropdown-toggle" : "nav-link"}
                                  {...((route.routes && route.routes.length > 0) ? {'data-toggle': 'dropdown'} : {})}
                                  activeClassName="active"
                                  to={route.redirect? route.redirect: route.path}
                              >
                                {route.icon &&
                                <i className={route.icon + " d-none d-lg-inline-block mr-1"}/>}
                                {tu(route.label)}
                              </NavLink>
                        }

                        {
                          route.routes && route.label !== "nav_more" &&
                          <div className="dropdown-menu">
                            {
                              route.routes && route.routes.map((subRoute, index) => {

                                if (subRoute === '-') {
                                  return (
                                      <div key={index} className="dropdown-divider"/>
                                  );
                                }

                                if (isString(subRoute)) {
                                  return (
                                      <h6 key={index}
                                          className="dropdown-header">{subRoute}</h6>
                                  )
                                }

                                if (subRoute.showInMenu === false) {
                                  return null;
                                }

                                if (!isUndefined(subRoute.url)) {
                                  return (
                                      <HrefLink
                                          key={subRoute.url}
                                          className="dropdown-item text-uppercase"
                                          href={subRoute.url}>
                                        {subRoute.icon &&
                                        <i className={subRoute.icon + " mr-2"}/>}
                                        {tu(subRoute.label)}
                                        {subRoute.badge &&
                                        <Badge value={subRoute.badge}/>}
                                      </HrefLink>
                                  );
                                }
                                if (!isUndefined(subRoute.enurl) || !isUndefined(subRoute.zhurl)) {
                                  return (
                                      <HrefLink
                                          key={subRoute.enurl}
                                          className="dropdown-item text-uppercase"
                                          href={activeLanguage == 'zh' ? subRoute.zhurl : subRoute.enurl}>
                                        {subRoute.icon &&
                                        <i className={subRoute.icon + " mr-2"}/>}
                                        {tu(subRoute.label)}
                                        {subRoute.badge &&
                                        <Badge value={subRoute.badge}/>}
                                      </HrefLink>
                                  );
                                }

                                return (
                                    <Link
                                        key={subRoute.path}
                                        className="dropdown-item text-uppercase"
                                        to={subRoute.path}>
                                      {subRoute.icon &&
                                      <i className={subRoute.icon + " mr-2" + " fa_width"}/>}
                                      {tu(subRoute.label)}
                                      {subRoute.badge && <Badge value={subRoute.badge}/>}
                                    </Link>
                                );
                              })
                            }
                          </div>
                        }
                        {
                          route.routes && route.label == "nav_more" &&
                          <div className="dropdown-menu more-menu" style={{left: 'auto'}}>
                            {
                              route.routes && route.routes.map((subRoute, index) => {
                                return <div className="" key={index}>
                                  <div className="more-menu-line"></div>
                                  {
                                    subRoute.map((Route, j) => {
                                      if (isString(Route)) {
                                        return (
                                            <h6 key={j}
                                                className="dropdown-header text-uppercase">{Route}</h6>
                                        )
                                      }

                                      if (Route.showInMenu === false) {
                                        return null;
                                      }

                                      if (!isUndefined(Route.url)) {
                                        return (
                                            <HrefLink
                                                key={Route.url}
                                                className="dropdown-item text-uppercase"
                                                href={Route.url}>
                                              {Route.icon &&
                                              <i className={Route.icon + " mr-2"}/>}
                                              {tu(Route.label)}
                                              {Route.badge &&
                                              <Badge value={Route.badge}/>}
                                            </HrefLink>
                                        );
                                      }
                                      if (!isUndefined(Route.enurl) || !isUndefined(Route.zhurl)) {
                                        return (
                                            <HrefLink
                                                key={Route.enurl}
                                                className="dropdown-item text-uppercase"
                                                href={activeLanguage == 'zh' ? Route.zhurl : Route.enurl}>
                                              {Route.icon &&
                                              <i className={Route.icon + " mr-2"}/>}
                                              {tu(Route.label)}
                                              {Route.badge &&
                                              <Badge value={Route.badge}/>}
                                            </HrefLink>
                                        );
                                      }

                                      return (
                                          <Link
                                              key={Route.path}
                                              className="dropdown-item text-uppercase"
                                              to={Route.path}>
                                            {Route.icon &&
                                            <i className={Route.icon + " mr-2" + " fa_width"}/>}
                                            {tu(Route.label)}
                                            {Route.badge && <Badge value={Route.badge}/>}
                                          </Link>
                                      );
                                    })
                                  }
                                </div>


                              })
                            }
                          </div>
                        }
                      </li>
                  ))}
                </ul>
                <ul className="navbar-nav navbar-right">
                  <li className="nav-item dropdown navbar-right">
                    <a className="nav-link dropdown-toggle dropdown-menu-right "
                       data-toggle="dropdown"
                       href="javascript:">
                      {activeCurrency.toUpperCase()}
                    </a>
                    <div className="dropdown-menu">
                      {
                        currencyConversions.map(currency => (
                            <a key={currency.id}
                               className="dropdown-item"
                               href="javascript:"
                               onClick={() => this.setCurrency(currency.id)}>{currency.name}</a>
                        ))
                      }
                    </div>
                  </li>
                  <li className="nav-item dropdown navbar-right">
                    <a className="nav-link dropdown-toggle dropdown-menu-right "
                       data-toggle="dropdown"
                       href="javascript:">{activeLanguage.toUpperCase()}</a>
                    <div className="dropdown-menu languages-menu">
                      {
                        Object.keys(languages).map(language => (
                            <a key={language}
                               className="dropdown-item"
                               href="javascript:"
                               onClick={() => this.setLanguage(language)}>{languages[language]}</a>
                        ))
                      }
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {
            activeComponent.none ? <div className="container pt-5 pb-4"></div>
                :
                (activeComponent && activeComponent.showSubHeader !== false) &&
                <div className="container d-flex sub-header">
                  {
                    activeComponent && <h4 className="pt-4">
                      <span className="text-uppercase">{tu(activeComponent.label)}</span> &nbsp;&nbsp;
                      {activeComponent.label === 'overview' &&
                      <small className='text-muted'>{tu('token_overview_tron')}</small>
                      }
                      {activeComponent.label === 'participate' &&
                      <small className='text-muted'>{tu('token_participate_tron')}</small>
                      }
                      {/*{activeComponent.label === 'create' &&*/}
                      {/*<small className='text-muted' style={{fontSize: '14px'}}>{tu('issued_token_of_tronscan')}</small>*/}
                      {/*}*/}
                    </h4>
                  }

                </div>
          }
        </div>
    )
  }
}


const styles = {
  search: {
    fontSize: 13,
    minWidth: 260,
    height:36,
  },
  searchType: {
    fontSize: 13,
  }
};

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    router: state.router,
    languages: state.app.availableLanguages,
    account: state.app.account,
    tokenBalances: state.account.tokens,
    frozen: state.account.frozen,
    totalTransactions: state.account.totalTransactions,
    currencyConversions: state.app.currencyConversions,
    activeCurrency: state.app.activeCurrency,
    wallet: state.wallet,
    theme: state.app.theme,
    flags: state.app.flags,
    syncStatus: state.app.syncStatus
  };
}

const mapDispatchToProps = {
  setLanguage,
  logout,
  login,
  loginWithAddress,
  loginWithTronLink,
  setActiveCurrency,
  setTheme,
  enableFlag,
  setWebsocket
};

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(withRouter(injectIntl(Navigation)))
