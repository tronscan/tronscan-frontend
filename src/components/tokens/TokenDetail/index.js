import React, {Fragment} from "react";
import {Client} from "../../../services/api";
import {t, tu} from "../../../utils/i18n";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import TokenHolders from "./TokenHolders";
import {NavLink, Route, Switch} from "react-router-dom";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TronLoader} from "../../common/loaders";
import Transfers from "./Transfers.js";
import TokenInfo from "./TokenInfo.js";
import {ONE_TRX} from "../../../constants";
import {login} from "../../../actions/app";
import {reloadWallet} from "../../../actions/wallet";
import {connect} from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {Link} from "react-router-dom";
import {some, toLower} from "lodash";
import xhr from "axios/index";

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
    };
  }

  componentDidMount() {
    let {match} = this.props;
    this.loadToken(decodeURI(match.params.name),decodeURI(match.params.address));
  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.name !== prevProps.match.params.name) {
      this.loadToken(decodeURI(match.params.name),decodeURI(match.params.address));
    }
  }

  loadToken = async (name,address) => {

    this.setState({loading: true, token: {name}});

    //let token = await Client.getToken(name);
    let result = await xhr.get("http://18.216.57.65:20110/api/token?name=" + name+"&owner="+address);
    let token = result.data.data[0];

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
          cmp: () => <Transfers filter={{token: name}}/>
        },
        {
          id: "holders",
          icon: "",
          path: "/holders",
          label: <span>{tu("token_holders")}</span>,
          cmp: () => <TokenHolders filter={{token: name}} token={{totalSupply: token.totalSupply}}/>
        },
      ]
    });
  };

  submit = async (token) => {

    let {account, currentWallet} = this.props;
    let {buyAmount, privateKey} = this.state;

    let isSuccess = await Client.participateAsset(
        currentWallet.address,
        token.ownerAddress,
        token.name,
        buyAmount * token.price)(account.key);

    if (isSuccess.success) {
      this.setState({
        activeToken: null,
        confirmedParticipate: true,
        participateSuccess: isSuccess.success,
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
              style={{marginLeft: '-240px', marginTop: '-195px'}}
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
    this.setState({buyAmount: value});
    this.buyAmount.value = value;
    let priceTRX = value * (price / ONE_TRX);
    this.priceTRX.innerHTML = intl.formatNumber(priceTRX);
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
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
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
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
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
                      onChange={(e) => {
                        this.onBuyInputChange(e.target.value, token.price, token.remaining)
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

    let {buyAmount} = this.state;
    if (buyAmount <= 0) {
      return;
    }
    let {currentWallet, wallet} = this.props;
    let tokenCosts = buyAmount * (token.price / ONE_TRX);

    if ((currentWallet.balance / ONE_TRX) < tokenCosts) {
      this.setState({
        alert: (
            <SweetAlert
                warning
                showConfirm={false}
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
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
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
            >
              <div className="mt-5 token-sweet-alert">
                <a style={{float: 'right', marginTop: '-155px'}} onClick={() => {
                  this.setState({alert: null})
                }}><i className="fa fa-times" ariaHidden="true"></i></a>
                <h5 style={{color: 'black'}}>{tu("buy_confirm_message_1")}</h5>
                <span>
                {buyAmount} {token.name} {t("for")} {buyAmount * (token.price / ONE_TRX)} TRX?
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
              style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
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
                style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
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
    let {token, tabs, loading, buyAmount, alert} = this.state;
    let social_display = 0;


    token && token['social_media'] && token['social_media'].map((media, index) => {
      if (media.url) {
        social_display++;
      }
    })
    let lowerText = toLower(token.reputation) + '_active.png';

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
                          {token && token.imgUrl ?
                              <img className='token-logo' src={token.imgUrl}/> :
                              <img className='token-logo' src={require('../../../images/logo_default.png')}/>
                          }
                          <div style={{width: '80%'}}>
                            <h5 className="card-title">
                              {token.name} ({token.abbr})
                            </h5>
                            <p className="card-text">{token.description}</p>
                          </div>
                          <div className="ml-auto">
                            {!(token.endTime < new Date() || token.issuedPercentage === 100 || token.startTime > new Date()) &&
                            <button className="btn btn-default btn-xs"
                                    onClick={() => this.preBuyTokens(token)}>{tu("participate")}</button>
                            }
                          </div>
                        </div>
                      </div>

                      <table className="table m-0 tokenDetail ">
                        <tbody>
                        <tr>
                          <th>{tu("total_supply")}:</th>
                          <td>
                            <FormattedNumber value={token.totalSupply}/>
                          </td>
                          <th>{tu("reputation")}:</th>
                          <td>
                            <Link to={`/rating`}
                                  style={{display: 'flex', alignItems: 'center'}}>{tu(token.reputation)}<img
                                src={require('../../../images/state/' + lowerText)}
                                className="ml-1 faceico"/></Link>
                          </td>
                        </tr>
                        <tr>
                          <th>{tu("circulating_supply")}:</th>
                          <td>
                            <FormattedNumber value={token.issued}/>
                          </td>
                          <th>{tu("website")}:</th>
                          <td>
                            <ExternalLink url={token.url}/>
                          </td>

                        </tr>
                        <tr>
                          <th>{tu("token_holders")}:</th>
                          <td>
                            <FormattedNumber value={token.nrOfTokenHolders}/>
                          </td>
                          <th>{tu("issuer")}:</th>
                          <td>
                            <AddressLink address={token.ownerAddress}/>
                          </td>
                        </tr>
                        <tr>
                          <th>{tu("nr_of_Transfers")}:</th>
                          <td>
                            <FormattedNumber value={token.totalTransactions}/>
                          </td>
                          <th>{tu("white_paper")}:</th>
                          <td>{
                            token.white_paper !== 'no_message' ?
                                <ExternalLink url={token.white_paper && tu(token.white_paper)}
                                              _url={token.white_paper}/> :
                                <span style={{color: '#d8d8d8'}}>-</span>
                          }
                          </td>
                        </tr>
                        <tr>
                          <th>{tu("created")}:</th>
                          <td>
                            <FormattedDate value={token.dateCreated}/>{' '}
                            <FormattedTime value={token.dateCreated}/>
                          </td>
                          <th>{tu("GitHub")}:</th>
                          <td>{
                            token.github !== 'no_message' ?
                                <ExternalLink url={token.github && tu(token.github)} _url={token.github}/> :
                                <span style={{color: '#d8d8d8'}}>-</span>
                          }
                          </td>
                        </tr>
                        <tr>
                          <th>{tu("contract_address")}:</th>
                          <td>
                            <span style={{color: '#d8d8d8'}}>-</span>
                          </td>
                          <th>{tu("social_link")}:</th>
                          <td>
                            <div className="d-flex">
                              {token['social_media'] && token['social_media'].map((media, index) => {
                                return (media.url !== "" && <div key={index} style={{marginRight: '10px'}}>
                                      <a href={media.url}><img
                                          src={require('../../../images/' + media.name + '.png')}/></a>
                                    </div>
                                )
                              })
                              }
                              {
                                !social_display &&
                                <span style={{color: '#d8d8d8'}}>-</span>
                              }
                            </div>
                          </td>
                        </tr>

                        </tbody>
                      </table>
                    </div>

                    <div className="card mt-3 border_table">
                      <div className="card-header">
                        <ul className="nav nav-tabs card-header-tabs" style={{
                          height: '50px', marginTop: '-12px', marginLeft: '-20px'
                        }}>
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
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenDetail));
