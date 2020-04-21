/*eslint-disable no-script-url*/
import React, {Fragment, PureComponent} from 'react'
import {injectIntl} from "react-intl";
import logo from '../images/tron-banner-inverted.png'
import tronLogoBlue from '../images/tron-banner-tronblue.png'
import tronLogoDark from '../images/tron-banner-1.png'
import tronLogoTestNet from "../images/tron-logo-testnet.png";
import tronLogoSunNet from "../images/tron-logo-sunnet.png";
import tronLogoInvertedTestNet from "../images/tron-logo-inverted-testnet.png";
import {flatRoutes, routes} from "../routes"
import {Link, NavLink, withRouter} from "react-router-dom"
import {filter, find, isString, isUndefined, trim, toUpper, debounce, slice} from "lodash"
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
import {API_URL, IS_TESTNET, ONE_TRX, IS_MAINNET, IS_SUNNET, SUNWEBCONFIG, NETURL} from "../constants"
import {matchPath} from 'react-router'
import {doSearch, getSearchType} from "../services/search"
import {readFileContentsFromEvent} from "../services/file"
import {decryptString, validatePrivateKey} from "../services/secureKey";
import SweetAlert from "react-bootstrap-sweetalert";
import {passwordToAddress,pkToAddress} from "@tronscan/client/src/utils/crypto";
import Notifications from "./account/Notifications";
import SendModal from "./transfer/Send/SendModal";
import SendMultiModal from "./transfer/SendMulti/SendModal";
import {bytesToString} from "@tronscan/client/src/utils/bytes";
import {hexStr2byteArray} from "@tronscan/client/src/lib/code";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import ReceiveModal from "./transfer/Receive/ReceiveModal";
import MenuNavigation from './MenuNavigation';
import {toastr} from 'react-redux-toastr'
import Lockr from "lockr";
import {BarLoader} from "./common/loaders";
import {Truncate} from "./common/text";
import NavPrice from "./common/NavPrice";
import { Icon,Drawer,Collapse,Divider } from 'antd';
import isMobile from '../utils/isMobile';
import {Client} from '../services/api';
import $ from 'jquery';
import xhr from "axios/index";
import LedgerAccess from "../hw/ledger/LedgerAccess";
import { getQueryString } from "../utils/url";




const { Panel } = Collapse;
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
      announId: 83,
      selectedNet:'',
      drawerVisible:false,//draw is visible
      currentActive:3,
      percent_change_24h:0,
      USD_Price:0,
      testNetAry: [
        "testnet",
        {
          url: "https://nile.tronscan.org",
          icon: false,
          label: "NILE TESTNET",
          sidechain: false
        },
        {
          url: "https://shasta.tronscan.org",
          icon: false,
          label: "SHASTA TESTNET",
          sidechain: false
        }
      ]
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
    let {intl} = this.props;
      // this.props.login('441d39fa209abf368a5f51191319d58dc2d4ef94f8f51514812bb4c036582079').then(() => {
      //     toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
      // });
    this.reLoginWithTronLink();
  }

  componentDidMount() {
    let {account,setWebsocket} = this.props;
    let _this = this;

    window.addEventListener('message', function (e) {
      if (e.data.message && e.data.message.action == "setAccount") {
        _this.setState({address: e.data.message.data.address});
      }
      if (e.data.message && e.data.message.action == "setNode") {
        if(e.data.message.data.fullNode == SUNWEBCONFIG.MAINFULLNODE){
            _this.setState({selectedNet: 'mainnet'});
            Lockr.set("NET", 'mainnet')
        }else if(e.data.message.data.fullNode == SUNWEBCONFIG.SUNFULLNODE){
            _this.setState({selectedNet: 'sunnet'});
            Lockr.set("NET", 'sunnet')
        }
      }

    })
    setWebsocket();
    $(document).click(() => {
      $('#_searchBox').css({display: 'none'});
      document.getElementById("mobile_searchBox").style.display = 'none'
    });

    this.setState({
        selectedNet: IS_MAINNET?'mainnet':'sunnet'
    });
    Lockr.set("NET", IS_MAINNET?'mainnet':'sunnet')
    // this.loadTrxPrices()
    // this.oTimer = setInterval(() => this.loadTrxPrices(), 1000*60*10);

  }

  async loadTrxPrices() {
      // var dataEur = Lockr.get("dataEur");
      let eurURL = encodeURI(
       `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=TRX&convert=USD` 
      );
      var { data: {data: dataEurObj} } = await xhr.post(
          `${API_URL}/api/system/proxy`,
          {
            url:eurURL
          }
      );
      if (dataEurObj) {
        let percent_change_24h = dataEurObj.TRX.quote.USD.percent_change_24h.toFixed(2) || 0;
        let USD_Price = parseFloat(dataEurObj.TRX.quote.USD.price)
        this.setState({
          percent_change_24h,
          USD_Price
        });
      } else{
       
        this.setState({
          percent_change_24h:0,
          USD_Price:0
        });
      }
     
    }

  componentWillUpdate(nextProps, nextState) {
      let { account,match,walletType } = this.props;
        if ((nextState.address !== this.state.address) && this.isString(nextState.address) && this.isString(this.state.address) && walletType.type === "ACCOUNT_TRONLINK") {
            this.reLoginWithTronLink();
        }
        if((nextState.selectedNet !== this.state.selectedNet) && this.state.selectedNet && nextState.selectedNet && this.props.account.isLoggedIn && walletType.type === "ACCOUNT_TRONLINK"){
            if(nextState.selectedNet === 'mainnet'){
                window.location.href= NETURL.MAINNET;
            }else if(nextState.selectedNet === 'sunnet'){
                window.location.href= NETURL.SUNNET;
            }
        }
  }

  componentWillUnmount() {
      let { account, websocket }  = this.props;
      if(!account.isLoggedIn && websocket){
          websocket.close();
          Lockr.set("websocket", 'close')
      }
      clearInterval(this.oTimer)
  }

  componentDidUpdate(prevProps) {
    const {activeLanguage} = this.props
    if (activeLanguage != prevProps.activeLanguage) {
     // this.getAnnouncement()
    }
  }

  netSelectChange = (value) => {
      Lockr.set("NET", value);
      Lockr.set("islogin", 0);
      this.setState({selectedNet: 'value'},()=>{
          if(value === 'mainnet'){
              window.location.href= NETURL.MAINNET;
          }else if(value === 'sunnet'){
              window.location.href= NETURL.SUNNET;
          }
      })

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
        const sunWeb = window.sunWeb;
        if (tronWeb && tronWeb.defaultAddress.base58) {
          this.props.loginWithTronLink(tronWeb.defaultAddress.base58, tronWeb, sunWeb).then(() => {
            toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
            window.gtag("event", "Tronlink", {
              event_category: "Login",
              event_label: tronWeb.defaultAddress.base58,
              referrer: window.location.origin,
              value: tronWeb.defaultAddress.base58
            });

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
    let {intl, account} = this.props;
    let {privateKey} = this.state;
    let address = pkToAddress(privateKey)
    if (trim(privateKey) === "external") {
      this.props.enableFlag("mobileLogin");
    } else {
      this.props.login(privateKey).then(() => {
        toastr.info(intl.formatMessage({id: 'success'}), intl.formatMessage({id: 'login_success'}));
        window.gtag("event", "PrivateKey", {
          event_category: "Login",
          event_label: address,
          referrer: window.location.origin,
          value: address
        });
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
      window.gtag("event", "KeystoreFile", {
        event_category: "Login",
        event_label: address,
        referrer: window.location.origin,
        value: address
      });
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
    // let {router} = this.props;
    // return find(flatRoutes, route => route.path && matchPath(router.location.pathname, {
    //   path: route.path,
    //   strict: false,
    // }));
      let {router} = this.props;
      let flatRoutesActives = slice(flatRoutes, 1);
      if(router.location.pathname == "/") {
          return flatRoutes[0]
      }else{
        return find(flatRoutesActives, route => route.path && matchPath(router.location.pathname, {
            path: route.path,
            strict: false,
        }));
      }
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
        this.afterSearch("#/contract/" + trim(searchResults[0].value)+'/code');
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
      document.getElementById("mobile_searchBox").style.display = 'none'
    }
  };

  onSearchChange = (ev) => {
    let value = (ev.target.value).replace(/\s+/g, "");
    this.setState({ search: value});
    ev.persist();
    this.callAjax(value);
  }

  callAjax = async (value) => {
    this.isSearching = true;
    let {search} = this.state;
    if (search === "") {
      this.setState({searchResults: []});
      $('#_searchBox').css({display: 'none'});
      document.getElementById("mobile_searchBox").style.display = 'none'
      return;
    } 

    let result = await xhr.get(API_URL+"/api/search?term=" + trim(search));
    let results = result.data;
    if(results.Error){
      results = []
    }
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
      document.getElementById("mobile_searchBox").style.display = 'block';
    } else {
      $('#_searchBox').css({display: 'none'});
      document.getElementById("mobile_searchBox").style.display = 'none'
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
          <a key={theme} className="nav-link" href="javascript:" onClick={this.onSetThemeClick}>
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

  muitlTransfer = () => {
    this.setState({
        popup: (
            <SendMultiModal onClose={this.hideModal}/>
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
    }else if(!IS_MAINNET){
      switch (theme) {
          case "light":
              return tronLogoSunNet;
          default:
              return tronLogoSunNet;
      }
    }else{
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

  openLedgerModal = (type) => {
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
            <LedgerAccess onClose={this.hideModal} loginType={type}/>
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
    const sunWeb = window.sunWeb;
    // 没有下载 tronlink
    if (!tronWeb || !sunWeb) {
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

    // 如果是tronlink的ledger登录，跳转到tronscan的ledger登录
    const tronlinkLoginType = tronWeb.defaultAddress.type;
    if (tronlinkLoginType == 2) {
      this.closeLoginModel(e);
      this.openLedgerModal(tronlinkLoginType);
      return;
    }

    if (address) {
        // 已登录 tronlink
        //this.isauot = true
        Lockr.set("islogin", 1);
        this.props.loginWithTronLink(address, tronWeb, sunWeb).then(() => {
          toastr.info(
            intl.formatMessage({ id: "success" }),
            intl.formatMessage({ id: "login_success" })
          );
          this.setState({ isImportAccount: false });
        });

        window.gtag("event", "Tronlink", {
          event_category: "Login",
          event_label: address,
          referrer: window.location.origin,
          value: address
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
  goAccountWaitSign = () => {
      window.location.hash = "#/account?from=nav&type=multisign";
  }

  changeCurrentDrawerFun = () =>{
    const {drawerVisible}= this.state;
    this.setState({
      drawerVisible :!drawerVisible
    })
  }

  renderWallet() {
    let {account, totalTransactions = 0, flags, wallet, activeLanguage} = this.props;
    let {isImportAccount, isTRONlinkLogin, loginWarning, signInWarning, address} = this.state;

    if (wallet.isLoading) {
      return (
          <li className="nav-item">
            <a className="nav-link" href="javascript:">
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
                  <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="javascript:">
                    {tu("wallet")}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-right account-dropdown-menu px-3">
                    <li className=" py-1">
                      <div className="row" style={{width: 305}}>
                        <Link to="/account" className="col-12 d-flex justify-content-end align-items-center">
                          {/* <div className="col-lg-2">
                          <Avatar size={45} value={account.address}/>
                        </div> */}
                          <div style={{width: 252}}>
                            <b style={{color: '#333'}}>{wallet.current.name || tu("account")}</b>
                            <br/>
                            {/* <AddressLink
                              address={account.address}
                              className="small text-truncate text-nowrap d-sm-inline-block"
                              style={{width: 150}}/> */}
                              {
                                  isAddressValid(account.address)?
                                    <div className="ellipsis_box">
                                      <div className="ellipsis_box_start">{account.address.substring(0,29)}</div>
                                      <div className="ellipsis_box_end">{account.address.substring(29,34)}</div>
                                    </div>
                                  :<Truncate><span>{account.address}</span></Truncate>
                              }

                          </div>
                          {/* <Link to="/account" className="col-lg-4 d-flex justify-content-end align-items-center"> */}
                          <i className="fa fa-angle-right ml-3" ></i>
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
                      <i className="fa fa-angle-right float-right" ></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-bolt mr-2"/>
                      <FormattedNumber value={wallet.current.frozenTrx / ONE_TRX}/> TRON {tu("power")}
                      <i className="fa fa-angle-right float-right" ></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-tachometer-alt mr-2"/>
                      <FormattedNumber
                          value={wallet.current.bandwidth.netRemaining + wallet.current.bandwidth.freeNetRemaining}/> {tu("bandwidth")}
                      <i className="fa fa-angle-right float-right" ></i>
                    </Link>
                    <Link className="dropdown-item" to="/account">
                      <i className="fa fa-server mr-2"/>
                      <FormattedNumber value={wallet.current.bandwidth.energyRemaining < 0 ? 0 :wallet.current.bandwidth.energyRemaining}/> {tu("energy")}
                      <i className="fa fa-angle-right float-right" ></i>
                    </Link>
                    <Link className="dropdown-item"
                          to={"/blockchain/transactions?address=" + account.address}>
                      <i className="fa fa-exchange-alt mr-2"/>
                      <FormattedNumber value={totalTransactions}/> {tu("transactions")}
                      <i className="fa fa-angle-right float-right" ></i>
                    </Link>
                    {
                        IS_MAINNET && <a className="dropdown-item" href="javascript:;" onClick={this.goAccountWaitSign}>
                          <i className="fas fa-file-signature mr-2"/>
                          <FormattedNumber value={wallet.current.signatureTotal}/> {tu("translations_wait_sign")}

                          <i className="fa fa-angle-right float-right" ></i>
                        </a>
                    }
                    <li className="dropdown-divider"/>
                    <a className="dropdown-item" href="javascript:" onClick={this.newTransaction}>
                      <i className="fa fa-paper-plane mr-2"/>
                      {tu("send")}
                      <i className="fa fa-angle-right float-right" ></i>
                    </a>
                    {
                     IS_MAINNET && <a className="dropdown-item" href="javascript:" onClick={this.muitlTransfer}>
                        <i className="far fa-paper-plane mr-2"/>
                          {tu("transfer_multi_sign")}
                        <i className="fa fa-angle-right float-right" ></i>
                      </a>
                    }

                    <a className="dropdown-item" href="javascript:" onClick={this.showReceive}>
                      <i className="fa fa-qrcode mr-2"/>
                      {tu("receive")}
                      <i className="fa fa-angle-right float-right" ></i>
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
                      {
                          IS_MAINNET &&  <li className="px-2 py-1 border-bottom-0" onClick={(e) => this.loginWithLedger(e)}>
                          <div className="dropdown-item text-uppercase d-flex  align-items-center text-muted">
                            <img src={require("../images/login/ledger.png")} width="16px" height="16px" className="mr-2"/>
                              {tu('sign_in_with_ledger')}
                          </div>
                        </li>
                      }
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
                              <i className="fas fa-exclamation-triangle mr-2" style={{color:"#FF8C00"}}></i>
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
                            <li className="px-3 py-4">
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

    let {intl, params,currentRouter} = this.props;
    let {
      languages,
      activeLanguage,
      currencyConversions,
      activeCurrency,
      wallet,
      syncStatus,
      walletType: { type },
    } = this.props;
    let {search, popup, notifications, announcement, announId, annountime, searchResults, selectedNet,drawerVisible,currentActive,percent_change_24h,USD_Price,testNetAry } = this.state;
    let activeComponent = this.getActiveComponent();
    const isShowSideChain = !type || (type && IS_SUNNET);
    let IsRepresentative = localStorage.getItem('representative')
    return (
        <div className="header-top nav-item-page">
          {popup}
        <div className={"logo-wrapper"}>
            {/* zh  ko ar fa nav menu flex space-between*/}
            {/* <div className={!IS_MAINNET?(activeLanguage == 'ru'||activeLanguage == 'es' ||activeLanguage == 'ja' ?'py-2 d-flex px-0 sunnet-menu-nav-wrapper':'py-2 d-flex px-0 single-menu-nav-wrapper' ):(activeLanguage === 'zh' || activeLanguage === 'ko' || activeLanguage === 'ar'  ? "py-2 d-flex px-0 single-menu-nav-wrapper" : "py-2 d-flex px-0 menu-nav-wrapper") }> */}
            <div className={IS_SUNNET ? "py-2 d-flex px-0 menu-nav-wrapper sunnet-menu-nav-wrapper":"py-2 d-flex px-0 menu-nav-wrapper"}>
              <div className="logoTrxPrice">
                <div className="mobileFlexible">
                  <Link to="/">
                    <img  src={this.getLogo()} className="logo" alt="Tron"/>
                  </Link>
                  {
                    IS_MAINNET?
                    <div className="currentTRXInfo">
                      <span className="TRXPrice">
                        <NavPrice
                          showPopup={false}
                          amount={1}
                          currency="USD"
                          source="home"
                          showCurreny={true}
                          currentPrice={USD_Price}
                          priceChage={percent_change_24h}
                          />
                      </span>
                    </div>
                    :null
                  }
                </div>
                {
                  IS_TESTNET &&
                  <div className="col text-center text-info font-weight-bold py-2">
                    TESTNET
                  </div>
                }
                {
                  (syncStatus && syncStatus.sync && syncStatus.sync.progress < 95) &&
                  <div className="col text-danger text-center py-2">
                    Tronscan is syncing, data might not be up-to-date ({Math.round(syncStatus.sync.progress)}%)
                  </div>
                }
            
                <div className="new-menu-List">
                  <nav className="top-bar navbar navbar-expand-md navbar-dark" style={{padding:0}}> 
                  {/*  pc nav */}
                    <div className="collapse navbar-collapse" id="navbar-top">
                      <ul className={activeLanguage==='ru' || activeLanguage==='es' || activeLanguage==='en'? 'single-language-navbar-nav navbar-nav':'navbar-nav'}>
                        {filter(routes, r => r.showInMenu !== false).map(route => (
                            <li key={route.path}  className={IS_MAINNET? 'nav-item dropdown': 'nav-item dropdown pr-3'}>
                              {
                                route.linkHref === true ?
                                    <HrefLink
                                        className={currentRouter == route.path ? "nav-link menu-active-tilte"
                                        : "nav-link"}
                                        href={activeLanguage == 'zh' ? route.zhurl : route.enurl}>
                                      {route.icon &&
                                      <i className={route.icon + " d-none d-lg-inline-block mr-1"}/>}
                                      {tu(route.label)}
                                    </HrefLink>
                                    :
                                    <span className={route.routes ? (route.label == 'nav_network' ? 'nav-network-hot' : "") : ""}> 
                                      {
                                        route.label == 'home_page' || route.label == 'Poloni DEX'?
                                        <NavLink
                                            className={route.routes ? (route.label == 'nav_network' ? 'nav-link text-capitalize' : "nav-link") : "nav-link"}
                                            {...((route.routes && route.routes.length > 0) ? {'data-toggle': 'dropdown'} : {})}
                                            activeClassName="active"
                                            to={route.redirect? route.redirect: route.path}
                                        >
                                          <span  className={
                                            (currentRouter.slice(1).split('/').indexOf(route.path.slice(1)) !== -1 || (currentRouter==='/exchange/trc20' && route.path ==="/exchange/trc20") || (route.path==='/more' && currentRouter.slice(1,5)==='help') || (route.path==='/more' && currentRouter.slice(1,6)==='tools')) || (route.path==='/newblock' && currentRouter.slice(1,11)==='blockchain') || (route.path==='/newblock' && currentRouter.slice(1,10)==='contracts') || (route.path==='/newblock' && currentRouter.slice(1,7)==='tokens') ? "menu-active-tilte-pc": ""}>
                                          {route.icon &&
                                            <i className={route.icon + " d-none d-lg-inline-block mr-1"}/>}
                                            {tu(route.label)}
                                            {route.label !== 'home_page' && route.label !== 'Poloni DEX'?<Icon type="caret-down" style={{color: 'rgba(51,51,51,0.50)',marginLeft:"4px",fontSize:'8px'}} /> : null}
                                          
                                          </span>
                                          {/* <i className="hot-nav"></i> */}
                                        </NavLink>
                                        :
                                        <span className={route.routes ? (route.label == 'nav_network' ? 'nav-link text-capitalize' : "nav-link") : "nav-link"}
                                        {...((route.routes && route.routes.length > 0) ? {'data-toggle': 'dropdown'} : {})}
                                        >
                                          <span  className={
                                            (currentRouter.slice(1).split('/').indexOf(route.path.slice(1)) !== -1 || (currentRouter==='/exchange/trc20' && route.path ==="/exchange/trc20") || (route.path==='/more' && currentRouter.slice(1,5)==='help') || (route.path==='/more' && currentRouter.slice(1,6)==='tools')) || (route.path==='/newblock' && currentRouter.slice(1,11)==='blockchain') || (route.path==='/newblock' && currentRouter.slice(1,10)==='contracts') || (route.path==='/newblock' && currentRouter.slice(1,7)==='tokens') ? "menu-active-tilte-pc": ""}>
                                          {route.icon &&
                                            <i className={route.icon + " d-none d-lg-inline-block mr-1"}/>}
                                            {tu(route.label)}
                                            {route.label !== 'home_page' && route.label !== 'Poloni DEX'?<Icon type="caret-down" style={{color: 'rgba(51,51,51,0.50)',marginLeft:"4px",fontSize:'8px'}} /> : null}
                                          </span>
                                        </span>
                                      }
                                    </span>
                                    
                              }

                              {
                                route.routes && route.label !== "nav_more" && route.label !== "nav_network" && route.label !== "newblock" &&
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
                                                className={currentRouter == subRoute.url ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
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
                                                className={currentRouter == subRoute.enurl ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
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
                                              className={currentRouter == subRoute.path ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
                                              to={subRoute.path}>
                                            {subRoute.icon &&
                                            <i className={`${subRoute.icon} mr-2  fa_width`}/>}
                                            {tu(subRoute.label)}
                                            {subRoute.badge && <Badge value={subRoute.badge}/>}
                                          </Link>
                                      );
                                    })
                                  }
                                </div>
                              }
                              {
                                  route.routes && (route.label == "nav_network" || route.label == "nav_more" || route.label == "newblock") &&
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
                                                      className="dropdown-header text-uppercase"> {tu(Route)}</h6>
                                              )
                                            }

                                            if (Route.showInMenu === false) {
                                              return null;
                                            }
                                            //wjl
                                            if (!isUndefined(Route.url) && !Route.sidechain && Route.label !== 'developer_challenge') {
                                              return (
                                                <span className='mr-3 d-inline-block developer_challenge_box' key={j+Route.label}>
                                                  <HrefLink
                                                      key={Route.url}
                                                      className={currentRouter == Route.url ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
                                                      href={Route.url}>
                                                    {Route.icon &&
                                                    <i className={Route.icon + " mr-2"} />}
                                                    {tu(Route.label)}
                                                    {Route.badge &&
                                                    <Badge value={Route.badge}/>}
                                                  </HrefLink>
                                                {Route.label==='NILE TESTNET'&& <span className="new-test-net">new</span>} 
                                                </span>
                                              );
                                            }
                                            if (!isUndefined(Route.url) && !Route.sidechain && Route.label == 'developer_challenge') {
                                                return (
                                                    <span className="mr-3 d-inline-block developer_challenge_box" key={Route.url+'_'+ Route.label}>
                                                      <HrefLink
                                                          key={Route.url+'_'+ Route.label}
                                                          className={currentRouter == Route.url ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
                                                          href={Route.url}>
                                                        {Route.icon &&
                                                        <i className={Route.icon + " mr-2"}/>}
                                                          {tu(Route.label)}
                                                          {Route.badge &&
                                                          <Badge value={Route.badge}/>}
                                                    </HrefLink>
                                                    <img src={require("../images/home/hot.svg")} title="hot" className="developer_challenge_hot"/>
                                                    </span>
                                                );
                                            }

                                            if (isUndefined(Route.url) && Route.sidechain) {
                                              const sidechainTab = (
                                                <a href="javascript:"
                                                  key={Route.label}
                                                  className="dropdown-item text-uppercase"
                                                  onClick={() => this.netSelectChange(IS_MAINNET?'sunnet':'mainnet')}
                                                >
                                                  {Route.icon && <i className={Route.icon + " mr-2"}/>}
                                                  {IS_MAINNET?tu('Side_Chain'):tu('Main_Chain')}
                                                </a>
                                              );
                                              return sidechainTab
                                            }
                                            if (!isUndefined(Route.enurl) || !isUndefined(Route.zhurl)) {
                                              return (
                                                  <HrefLink
                                                      key={Route.enurl}
                                                      className={currentRouter == Route.enurl ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
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
                                                <NavLink
                                                    key={Route.path}
                                                    className={currentRouter == Route.path ? "dropdown-item text-uppercase menu-active-tilte-pc" : "dropdown-item text-uppercase"}
                                                    to={Route.path}>
                                                  {/* {Route.icon &&
                                                  <i className={`${Route.icon} mr-2 fa_width`}/>} */}
                                                  {tu(Route.label)}
                                                  {/* {Route.badge && <Badge value={Route.badge}/>} */}
                                                </NavLink>
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
                    </div>
                  </nav>
                </div>
              </div>
              <div className="loginInfoNavBar">
                <div className={IS_MAINNET ? "navbar navbar-expand-md navbar-dark py-0 page-right-navbar mainetMargin mobileMarginMenu" : "navbar navbar-expand-md navbar-dark py-0 page-right-navbar"}>
                  <ul className="navbar-nav navbar-right wallet-nav">
                    {
                      wallet.isOpen && <Notifications wallet={wallet} notifications={notifications}/>
                    }
                    {this.renderWallet()}
                   
                    <li className="nav-item dropdown navbar-right hidden-mobile" style={{display:'flex'}}>
                        <Divider className="hidden-mobile" type="vertical" style={{marginTop:'0.7rem',height: '1.2em','display':'inline-block'}}/>
                        {/* test icon */}
                        <a className="nav-link dropdown-toggle dropdown-menu-right pr-0 nav-testnet-dropdown-menu"
                          data-toggle="dropdown"
                          href="javascript:">
                          <img src={require("../images/home/icon.svg")} width="16px" height="16px"/>
                        </a>
                        <div className="dropdown-menu testnet-dropdown-menu">
                          {
                            testNetAry.map((item,ind) => (
                                <a key={ind}
                                  target="_blank"
                                  className="dropdown-item"
                                  href={item.url}
                                  >
                                    {item.label}
                                    {item.label==='NILE TESTNET'&& <span className="new-test-net">new</span>} 
                                </a>
                            ))
                          }
                        </div>
        
                    </li>
                  </ul>
                  <div className="drawWrapper hidden-PC" onClick={()=>{this.setState({drawerVisible:true})}}>
                     {/* drawer */}
                    <Icon type="menu" />
                  </div>
                </div>
               
              </div>
            </div>
          </div>
          <div style={{boxShadow:"0 2px 40px 0 rgba(4,4,64,0.05)",background:"#F3F3F3"}}>
            <div className={isMobile ? "container p-0 p-md-3" : "container p-0 index-page-search-sec" }>
              <div className="row justify-content-center text-center">
                <div className="col-12">
                  {
                    <div className="hidden-mobile nav-searchbar" style={{width:"100%"}}>
                      <div className="input-group dropdown">
                        <input type="text"
                                className="form-control p-2 border-0 box-shadow-none newSearchInput"
                                style={styles.search}
                                value={search}
                                onKeyDown={this.onSearchKeyDown}
                                onChange={this.onSearchChange}
                                onClick={this.callAjax}
                                placeholder={intl.formatMessage({id: "index_page_search_placeholder"})}/>
                        <div className="input-group-append">
                          <button style={{textTransform:"none"}} className="btn box-shadow-none index_page_search"  onClick={this.doSearch}>
                            {/* <i className="fa fa-search"/> */}
                            {tu("index_page_search_input")}
                          </button>
                        </div>
                        <div className="dropdown-menu" id="_searchBox" style={{width: '100%',maxHeight:'300px', overflow:'auto'}}>
                          {
                            searchResults && searchResults.map((result, index) => {
                                if (result.desc === 'Block') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/block/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Token-TRC20') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/token20/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Token-TRC10') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/token/" + trim(result.value.split(' ')[result.value.split(' ').length-1])} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Address') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/address/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'Contract') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/contract/" + trim(result.value)+'/code'} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                                if (result.desc === 'TxHash') {
                                  return <Link className="dropdown-item dropdown-text-none" to={"/transaction/" + trim(result.value)} onClick={() => {
                                    this.afterSearch()
                                  }} key={index}>{result.desc + ': '}<Truncate><strong>{result.value}</strong></Truncate></Link>
                                }
                              }
                            )
                          }
                        </div>
                      </div>
                    </div>
                  }
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
                <button className="btn box-shadow-none mobile-button-search" onClick={this.doSearch}>
                  <i className="fa fa-search"/>
                </button>
              </div>
              <div className="dropdown-menu" id="mobile_searchBox" style={{width: '100%',maxHeight:'300px', overflow:'auto'}}>
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
                          return <Link className="dropdown-item text-uppercase" to={"/contract/" + trim(result.value)+'/code'} onClick={() => {
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
                      {IsRepresentative && activeComponent.label == 'contract_code_overview_account' && <span className="Representative-subTttle">{tu('Super Representatives')}</span>}
                    </h4>

                  }

                </div>
          }
          {/* drawer mobile nav */}
          <Drawer
            placement='right'
            closable={false}
            onClose={()=>{
              this.setState({
                drawerVisible:false
              })
            }}
            visible={drawerVisible}
          >
            <div className="mobile-draw-menu">
              <MenuNavigation currentRoutes={routes} changeDrawerFun={()=>this.changeCurrentDrawerFun()}></MenuNavigation>
              <Collapse accordion bordered={false} expandIconPosition="right"  defaultActiveKey={[currentActive]} expandIcon={({ isActive }) => <Icon type="down" rotate={isActive ? 180 : 0} />}>
                <Panel header={'EXPLORERS'} key="0" >
                  <div className="languages-menu mobile-testnet-dropdown-menu">
                    {
                      testNetAry.map((net,ind) => (
                          <a key={ind}
                            target="_blank"
                            className="dropdown-item"
                            href={net.url}
                            onClick={() => {
                              this.changeCurrentDrawerFun();
                              this.setState({
                                currentActive:3
                              })
                            }}>
                              {net.label}
                              {net.label==='NILE TESTNET'&& <span className="new-test-net">new</span>} 
                            </a>
                      ))
                    }
                  </div>
                </Panel>
                <Panel header={
                  <span>
                    <img src={require(`../images/home/${activeLanguage}.svg`)} alt="" style={{height:'16px',marginRight:'2px'}}/>
                    {languages[activeLanguage]}
                  </span>  
                  
                  } key="1" >
                  <div className="languages-menu">
                    {
                      Object.keys(languages).map(language => (
                          <a key={language}
                            className="dropdown-item"
                            href="javascript:"
                            onClick={() => {
                              this.changeCurrentDrawerFun();
                              this.setState({
                                currentActive:3
                              })
                              this.setLanguage(language)
                            }}>
                               <img src={require(`../images/home/${language}.svg`)} alt="" style={{height:'16px',marginRight:'2px'}} />
                              {languages[language]}
                            </a>
                      ))
                    }
                  </div>
                </Panel>
                <Panel header={activeCurrency} key="2" >
                  <div className="currency-menu">
                    {
                      currencyConversions.map((current,ind) => (
                          <a key={ind}
                            className="dropdown-item"
                            href="javascript:"
                            onClick={() => {
                              this.changeCurrentDrawerFun();
                              this.setState({
                                currentActive:3
                              })
                              this.props.setActiveCurrency(current.id)
                            }}>{current.name}</a>
                      ))
                    }
                  </div>
                </Panel>
              </Collapse>
            </div>
          </Drawer>
        </div>
    )
  }
}


const styles = {
  search: {
    fontSize: 14,
    minWidth: 260,
    height:48,
  },
  searchType: {
    fontSize: 13,
  }
};

function mapStateToProps(state) {
  return {
    currentRouter: state.router.location.pathname,
    activeLanguage: state.app.activeLanguage,
    router: state.router,
    languages: state.app.availableLanguages,
    account: state.app.account,
    walletType: state.app.wallet,
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