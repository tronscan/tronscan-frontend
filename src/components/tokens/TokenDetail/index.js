import React from "react";
import {Client} from "../../../services/api";
import {t, tu} from "../../../utils/i18n";
import {injectIntl} from "react-intl";
import TokenHolders from "./TokenHolders";
import {NavLink, Route, Switch} from "react-router-dom";
import {TronLoader} from "../../common/loaders";
import Transfers from "./Transfers.js";
import TokenInfo from "./TokenInfo.js";
import BTTSupply from "./BTTSupply.js";
import {Information} from "./Information.js";
import {ONE_TRX,API_URL} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";
import {connect} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {transactionResultManager} from "../../../utils/tron";
import xhr from "axios/index";
import Lockr from "lockr";
import {withTronWeb} from "../../../utils/tronWeb";
import {CsvExport} from "../../common/CsvExport";


@withTronWeb
class TokenDetail extends React.Component {

  constructor() {
    super();

    this.state = {
      privateKey: '',
      loading: true,
      token: {},
      tabs: [],
      buyAmount: 0,
      alert: null,
      currentTotalSupply:'',
      csvurl: ''
    };
  }

  componentDidMount() {
    let {match} = this.props;
    if(isNaN(Number(match.params.id))){
        this.props.history.push('/tokens/list')
    }else{
        this.loadToken(decodeURI(match.params.id));
    }

  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.id !== prevProps.match.params.id) {
        if(isNaN(Number(match.params.id))){
            this.props.history.push('/tokens/list')
        }else{
            this.loadToken(decodeURI(match.params.id));
        }
    }
  }
    loadTotalTRXSupply = async() =>{
        const {funds} = await Client.getBttFundsSupply();
        this.setState({
            currentTotalSupply:parseInt(funds.totalTurnOver),
        });
    }
  loadToken = async (id) => {

    this.setState({loading: true});

    //let token = await Client.getToken(name);
    let result = await xhr.get(API_URL+"/api/token?id=" + id + "&showAll=1");
    let token = result.data.data[0];
    if(!token){
      this.setState({loading: false,token: null});
      this.props.history.push('/tokens/list')
      return;
    }
    // console.log(token);
      if(token.tokenID == 1002000){
        this.loadTotalTRXSupply();
        this.setState({
            loading: false,
            token,
            tabs: [
                {
                    id: "tokenInfo",
                    icon: "",
                    path: "",
                    label: <span>{tu("issue_info")}</span>,
                    cmp: () => <TokenInfo token={token}/>
                },
                {
                    id: "transfers",
                    icon: "",
                    path: "/transfers",
                    label: <span>{tu("token_transfers")}</span>,
                    cmp: () => <Transfers getCsvUrl={(csvurl) => this.setState({csvurl})} filter={{token: token.name, address: token.ownerAddress}}/>
                },
                {
                    id: "holders",
                    icon: "",
                    path: "/holders",
                    label: <span>{tu("token_holders")}</span>,
                    cmp: () => <TokenHolders filter={{token: token.name, address: token.ownerAddress}} token={{totalSupply: token.totalSupply}} tokenPrecision ={{precision:token.precision}}/>
                },
                {
                    id: "BTTSupply",
                    icon: "",
                    path: "/supply",
                    label: <span>{tu("BTT_supply")}</span>,
                    cmp: () => <BTTSupply token={token}/>
                },
            ]
        });
    }else{
        this.setState({
            loading: false,
            token,
            tabs: [
                {
                    id: "tokenInfo",
                    icon: "",
                    path: "",
                    label: <span>{tu("issue_info")}</span>,
                    cmp: () => <TokenInfo token={token}/>
                },
                {
                    id: "transfers",
                    icon: "",
                    path: "/transfers",
                    label: <span>{tu("token_transfers")}</span>,
                    cmp: () => <Transfers filter={{token: token.name, address: token.ownerAddress}}/>
                },
                {
                    id: "holders",
                    icon: "",
                    path: "/holders",
                    label: <span>{tu("token_holders")}</span>,
                    cmp: () => <TokenHolders filter={{token: token.name, address: token.ownerAddress}} token={{totalSupply: token.totalSupply}} tokenPrecision ={{precision:token.precision}}/>
                },
            ]
        });
    }

  };

  submit = async (token) => {
    let price=((token.trxNum / token.num)*Math.pow(10, token.precision));
    let {account, currentWallet} = this.props;
    let {buyAmount, privateKey} = this.state;

      let res;
      if (Lockr.get("islogin")||this.props.walletType.type==="ACCOUNT_LEDGER"||this.props.walletType.type==="ACCOUNT_TRONLINK") {
        const tronWebLedger = this.props.tronWeb();
        const { tronWeb } = this.props.account;
          try {
            if (this.props.walletType.type === "ACCOUNT_LEDGER") {
              const unSignTransaction = await tronWebLedger.transactionBuilder.purchaseToken(token.ownerAddress, token.id+"", parseInt((buyAmount * price).toFixed(0)),  this.props.walletType.address).catch(e => false);
              const {result} = await transactionResultManager(unSignTransaction, tronWebLedger);
              res = result;
            }
            if(this.props.walletType.type === "ACCOUNT_TRONLINK"){
              const unSignTransaction = await tronWeb.transactionBuilder.purchaseToken(token.ownerAddress, token.id+"", parseInt((buyAmount * price).toFixed(0)), tronWeb.defaultAddress.hex).catch(e => false);
              const {result} = await transactionResultManager(unSignTransaction, tronWeb);
              res = result;
            }
          } catch (e) {
              console.log(e)
          }
      }else {
          let isSuccess = await Client.participateAsset(
              currentWallet.address,
              token.ownerAddress,
              token.id+"",
              parseInt((buyAmount * price).toFixed(0)))(account.key);
          res = isSuccess.success
      }


    if (res) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: res,
        buyAmount: 0,
      });
      this.props.reloadWallet();
      return true;
    } else {
      return false;
    }
  };
  onInputChange = (value) => {
    let {account} = this.props;
    if (value && value.length === 64) {
      this.privateKey.className = "form-control";
      if (pkToAddress(value) !== account.address)
        this.privateKey.className = "form-control is-invalid";
    }
    else {
      this.privateKey.className = "form-control is-invalid";
    }
    this.setState({privateKey: value})
    this.privateKey.value = value;
  }
  confirmPrivateKey = (param) => {
    let {privateKey, token} = this.state;
    let {account} = this.props;

    let reConfirm = () => {
      if (this.privateKey.value && this.privateKey.value.length === 64) {
        if (pkToAddress(this.privateKey.value) === account.address)
          this.buyTokens(token);
      }
    }

    this.setState({
      alert: (
          <SweetAlert
              info
              showCancel
              cancelBtnText={tu("cancel")}
              confirmBtnText={tu("confirm")}
              confirmBtnBsStyle="success"
              cancelBtnBsStyle="default"
              title={tu("confirm_private_key")}
              onConfirm={reConfirm}
              onCancel={() => this.setState({alert: null})}
              // style={{marginLeft: '-240px', marginTop: '-195px'}}
          >
            <div className="form-group">
              <div className="input-group mb-3">
                <input type="text"
                       ref={ref => this.privateKey = ref}
                       onChange={(ev) => {
                         this.onInputChange(ev.target.value)
                       }}
                       className="form-control is-invalid"
                />
                <div className="invalid-feedback">
                  {tu("fill_a_valid_private_key")}
                </div>
              </div>
            </div>
          </SweetAlert>
      )
    });
  }


  isBuyValid = () => {
    return (this.state.buyAmount > 0);
  };

  onBuyInputChange = (value, price, max) => {
    let {intl} = this.props;
    if (value > max) {
      value = max;
    }
    value =  value.replace(/^0|[^\d*]/g,'')
    this.setState({buyAmount: value});
    this.buyAmount.value = value;
    let priceTRX = value * (price);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX,{
      maximumFractionDigits: 6,
    });
  }

  preBuyTokens = (token) => {
    let {buyAmount} = this.state;
    let {currentWallet, wallet, intl} = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
            <SweetAlert
                info
                showConfirm={false}
                // style={{ width: '30rem', height: '18.75rem',left:'50%',marginLeft:'-15rem'}}
            >
              <div className="token-sweet-alert">
                <a className="close" onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <span>{tu('login_first')}</span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("OK")}</button>
              </div>

            </SweetAlert>
        ),
      });
      return;
    }
    else {
      this.setState({
        alert: (
            <SweetAlert
                showConfirm={false}
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert" style={{textAlign: 'left'}}>
                <a style={{float: 'right', marginTop: '-45px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu('buy_token_info')}</h5>
                {token.remaining === 0 && <span> {tu('no_token_to_buy')}</span>}
                <div className="input-group mt-5">
                  <input
                      type="number"
                      ref={ref => this.buyAmount = ref}
                      className="form-control"
                      max={token.remaining}
                      min={1}
                      onKeyUp={(e)=>{ e.target.value = e.target.value.replace(/^0|[^\d*]/g,'') }}
                      onChange={(e) => {
                        this.onBuyInputChange(e.target.value, ((token.trxNum / token.num)*Math.pow(10, token.precision))/ONE_TRX, token.remaining)
                      }}
                  />
                </div>
                <div className="text-center mt-3 text-muted">
                  <b>= <span ref={ref => this.priceTRX = ref}>0</span> TRX</b>
                </div>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.buyTokens(token)
                }}>{tu("participate")}</button>
              </div>
            </SweetAlert>
        ),
      });
    }
  }
  buyTokens = (token) => {
    let price=((token.trxNum / token.num)*Math.pow(10, token.precision));
    let {buyAmount} = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let {currentWallet, wallet} = this.props;
    let tokenCosts = buyAmount * (price/ONE_TRX);

    if ((currentWallet.balance / ONE_TRX) < tokenCosts) {
      this.setState({
        alert: (
            <SweetAlert
                warning
                showConfirm={false}
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <span>
                  {tu("not_enough_trx_message")}
                </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("confirm")}</button>
              </div>
            </SweetAlert>
        ),
      });
    } else {
      this.setState({
        alert: (
            <SweetAlert
                warning
                showConfirm={false}
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <p className="ml-auto buy_confirm_message">{tu("buy_confirm_message_1")}</p>
                <span>
                {buyAmount} {token.name} {t("for")} {parseFloat((buyAmount * (price / ONE_TRX)).toFixed(6))} TRX?
                </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.confirmTransaction(token)
                }}>{tu("confirm")}</button>
              </div>
            </SweetAlert>
        ),
      });
    }
  };

  confirmTransaction = async (token) => {
    let {account, intl} = this.props;
    let {buyAmount} = this.state;

    this.setState({
      alert: (
          <SweetAlert
              showConfirm={false}
              showCancel={false}
              cancelBtnBsStyle="default"
              title={intl.formatMessage({id: 'transferring'})}
              // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
          </SweetAlert>
      ),
    });

    if (await this.submit(token)) {

      this.setState({
        alert: (
            <SweetAlert
                success
                showConfirm={false}
                // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu('transaction')} {tu('confirm')}</h5>
                <span>
                {tu('success_receive')} {token.name} {tu('tokens')}
              </span>
                <button className="btn btn-danger btn-block mt-3" onClick={() => {
                  this.setState({alert: null})
                }}>{tu("OK")}</button>
              </div>
            </SweetAlert>
        )
      });
    } else {
      this.setState({
        alert: (
            <SweetAlert danger title="Error" onConfirm={() => this.setState({alert: null})}>
              {tu('fail_transaction')}
            </SweetAlert>
        )
      });
    }
  };

  render() {

    let {match, wallet} = this.props;
    let {token, tabs, loading, buyAmount, alert,currentTotalSupply, csvurl} = this.state;
    let uploadURL = API_URL + "/api/v2/node/info_upload?address=" + match.params.id
    let pathname = this.props.location.pathname;
    let tabName = ''
    let rex = /[a-zA-Z0-9]{7}\/?([a-zA-Z\\-]+)$/
    pathname.replace(rex, function (a, b) {
      tabName = b
    })
    return (
        <main className="container header-overlap token_black mc-donalds-coin">
          {alert}
          {
            loading ? <div className="card">
                  <TronLoader>
                    {tu("loading_token")} {token.name}
                  </TronLoader>
                </div> :
                <div className="row">
                  {token &&
                  <div className="col-sm-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex">
                          {token && token.imgUrl && token.tokenID?
                              <div>
                                {
                                    token.tokenID == 1002000?
                                        <div className="token-img-top">
                                          <img className='token-logo' src={token.imgUrl}/>
                                          <i></i>
                                        </div>
                                        :<img className='token-logo' src={token.imgUrl}/>
                                }
                              </div>
                               :<img className='token-logo' src={require('../../../images/logo_default.png')}/>
                          }
                          <div style={{width: '70%'}} className="token-description">
                            <h5 className="card-title">
                              {token.name} ({token.abbr})
                            </h5>
                            <p className="card-text">{token.description}</p>
                          </div>
                          <div className="ml-auto">
                            {(!(token.endTime < new Date() || token.issuedPercentage === 100 || token.startTime > new Date() || token.isBlack) && (token.canShow !== 3)) &&
                            <button className="btn btn-default btn-xs d-inline-block"
                                    onClick={() => this.preBuyTokens(token)}>{tu("participate")}</button>
                            }
                            {/**<a href={"#/myToken?address="+ token.ownerAddress} className="btn btn-danger btn-xs d-inline-block token-detail-btn">{tu("update_token")}</a> */}
                          </div>
                        </div>
                      </div>
                      {token&&<Information token={token} currentTotalSupply={currentTotalSupply}></Information>}
                    </div>

                    <div className="card mt-3 border_table">
                      <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs" style={{marginTop: '-12px', marginLeft: '-20px'}}>
                          {
                            tabs.map(tab => (
                                <li key={tab.id} className="nav-item">
                                  <NavLink exact to={match.url + tab.path} className="nav-link text-dark">
                                    <i className={tab.icon + " mr-2"}/>
                                    {tab.label}
                                  </NavLink>
                                </li>
                            ))
                          }
                        </ul>
                      </div>
                      <div className="card-body p-0">
                        <Switch>
                          {
                            tabs.map(tab => (
                                <Route key={tab.id} exact path={match.url + tab.path} render={() => (<tab.cmp/>)}/>
                            ))
                          }
                        </Switch>
                      </div>
                    </div>
                      {
                          tabName === 'transfers' ?
                              <CsvExport downloadURL={csvurl}/>
                              : ''
                      }
                  </div>
                  }
                </div>

          }

        </main>
    )
  }
}


function mapStateToProps(state) {
  return {
    tokens: state.tokens.tokens,
    wallet: state.wallet,
    currentWallet: state.wallet.current,
    account: state.app.account,
    walletType: state.app.wallet,
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenDetail));
