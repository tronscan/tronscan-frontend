import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {t, tu} from "../../utils/i18n";
import {transactionResultManager} from "../../utils/tron";
import {loadRecentTransactions} from "../../actions/account";
import xhr from "axios";
import {injectIntl} from "react-intl";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import { SwitchToken } from "../common/Switch";
import FreezeBalanceModal from "./FreezeBalanceModal";
import {AddressLink, ExternalLink, HrefLink, TokenLink, TokenTRC20Link} from "../common/Links";
import SweetAlert from "react-bootstrap-sweetalert";
import {IS_TESTNET, ONE_TRX, API_URL} from "../../constants";
import {Client} from "../../services/api";
import {reloadWallet} from "../../actions/wallet";
import {login} from "../../actions/app";
import ApplyForDelegate from "./ApplyForDelegate";
import {filter, trim} from "lodash";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import QRImageCode from "../common/QRImageCode";
import {WidgetIcon} from "../common/Icon";
import ChangeNameModal from "./ChangeNameModal";
import CreateTxnPairModal from "./CreateTxnPairModal";
import OperateTxnPairModal from "./OperateTxnPairModal";
import {addDays, getTime} from "date-fns";
import TestNetRequest from "./TestNetRequest";
import Transactions from "../common/Transactions";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {QuestionMark} from "../common/QuestionMark";
import _ from "lodash";
import Lockr from "lockr";



class Account extends Component {
  constructor() {
    super();
    this.state = {
      modal: null,
      showFreezeBalance: false,
      showBuyTokens: false,
      sr: null,
      issuedAsset: null,
      showBandwidth: false,
      privateKey: "",
      temporaryName: "",
      selectedResource:null,
      hideSmallCurrency:true,
      tokenTRC10:true,
      tokens20:[],
      dealPairTrxLimit:100000,
      isTronLink:0
    };

  }

  componentDidMount() {
      let {account} = this.props;
      if (account.isLoggedIn) {
          this.setState({isTronLink:Lockr.get("islogin")});
          this.reloadTokens();
          this.loadAccount();
          this.getTRC20Tokens();
      }
  }

  componentDidUpdate(prevProps) {
    let {account} = this.props;
    if (((prevProps.account.isLoggedIn !== account.isLoggedIn) && account.isLoggedIn) || ((prevProps.account.address !== account.address) && account.isLoggedIn)) {
      this.setState({isTronLink:Lockr.get("islogin")});
      this.reloadTokens();
      this.loadAccount();
      this.getTRC20Tokens();
    }
  }

  loadAccount = async () => {
    let {account, loadRecentTransactions, currentWallet} = this.props;
    loadRecentTransactions(account.address);

    this.setState({
      issuedAsset: null,
      sr: null,
    });

    if (currentWallet && currentWallet.representative.enabled) {
      let sr = await Client.getSuperRepresentative(currentWallet.address);
      this.setState({
        sr,
      });
    }

    Client.getIssuedAsset(account.address).then(({token}) => {
      this.setState({
        issuedAsset: token,
      });
    });

    // if (currentWallet && currentWallet.allowExchange.length) {
    //     let {data,total} = await Client.getExchangesList({'address':currentWallet.address});
    //     this.setState({
    //         exchangesList: data,
    //     });
    //
    // }
  };

  reloadTokens = () => {
    this.props.reloadWallet();
  };

  async getTRC20Tokens(){
      let {account} = this.props;
      let result = await xhr.get(API_URL+"/api/token_trc20?sort=issue_time&start=0&limit=50");
      let tokens20 = result.data.trc20_tokens;
      //if(account.tronWeb.eventServer){
      tokens20 &&  tokens20.map(async item =>{
              item.token20_name = item.name + '(' + item.symbol + ')';
              let  contractInstance = await account.tronWeb.contract().at(item.contract_address);
              let  balanceData = await contractInstance.balanceOf(account.address).call();
              if(balanceData.balance){
                  item.token20_balance = parseFloat(balanceData.balance.toString()) / Math.pow(10,item.decimals);
              }else{
                  item.token20_balance = parseFloat(balanceData.toString()) / Math.pow(10,item.decimals);
              }
              return item
          });
          this.setState({
              tokens20: tokens20
          });
     // }
  }
  renderTRC20Tokens() {
    let {hideSmallCurrency,tokens20} = this.state;
    if(hideSmallCurrency){
        tokens20 = _(tokens20)
            .filter(tb => tb.token20_name.toUpperCase() !== "TRX")
            .filter(tb => tb.token20_balance >= 10)
            .sortBy(tb => tb.token20_name)
            .value();
    }else{
        tokens20 = _(tokens20)
            .filter(tb => tb.token20_name.toUpperCase() !== "TRX")
            .filter(tb => tb.token20_balance > 0)
            .sortBy(tb => tb.token20_name)
            .value();
    }

    if (tokens20.length === 0) {
      return (
          <div className="text-center d-flex justify-content-center p-4">
            {tu("no_tokens")}
          </div>
      );
    }
    return (
        <table className="table mt-3 temp-table">
          <thead className="thead-light">
          <tr>
            <th>{tu("name")}</th>
            <th className="text-right">{tu("balance")}</th>
          </tr>
          </thead>
          <tbody>
          {
              tokens20.map((token) => (
                <tr key={token.token20_name}>
                  <td>
                    <TokenTRC20Link name={token.name} address={token.contract_address} namePlus={token.name + ' (' + token.symbol + ')'} />
                  </td>
                  <td className="text-right">
                    <FormattedNumber value={token.token20_balance} maximumFractionDigits={token.decimals}/>
                  </td>
                </tr>
            ))
          }
          </tbody>
        </table>
    )
  }

  renderTokens() {
        let {hideSmallCurrency} = this.state;
        let {tokenBalances = []} = this.props;

        if(hideSmallCurrency){
            tokenBalances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "TRX")
                .filter(tb => tb.balance >= 10)
                .sortBy(tb => tb.name)
                .value();
        }else{
            tokenBalances = _(tokenBalances)
                .filter(tb => tb.name.toUpperCase() !== "TRX")
                .filter(tb => tb.balance > 0)
                .sortBy(tb => tb.name)
                .value();
        }
        if (tokenBalances.length === 0) {
            return (
                <div className="text-center d-flex justify-content-center p-4">
                    {tu("no_tokens")}
                </div>
            );
        }

        return (
            <table className="table mt-3 temp-table">
              <thead className="thead-light">
              <tr>
                <th>{tu("name")}</th>
                <th className="text-right">{tu("balance")}</th>
              </tr>
              </thead>
              <tbody>
              {
                  tokenBalances.map((token) => (
                      <tr key={token.name}>
                        <td>
                          <TokenLink name={token.name} address={token.address}/>
                        </td>
                        <td className="text-right">
                          <FormattedNumber value={token.balance}/>
                        </td>
                      </tr>
                  ))
              }
              </tbody>
            </table>
        )
    }

  renderBandwidth() {

    let {currentWallet} = this.props;

    return (
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body px-0 border-0">
                <h5 className="card-title text-center m-0">
                  {tu("bandwidth")}
                </h5>
              </div>
              <table className="table m-0">
                <tbody>
                <tr>
                  <th style={{width: 200}}>{tu("free_bandwidth")}</th>
                  <td>
                    <span className="text-primary">
                      <FormattedNumber value={currentWallet.bandwidth.freeNetUsed} className="text-success"/>&nbsp;
                    </span>/&nbsp;
                    <span className="text-muted">
                      <FormattedNumber value={currentWallet.bandwidth.freeNetLimit}/>
                    </span>
                    <span className="float-right">
                      {Math.ceil(currentWallet.bandwidth.freeNetPercentage)}%
                    </span>
                    <div className="progress mt-1">
                      <div className="progress-bar bg-primary"
                           style={{width: currentWallet.bandwidth.freeNetPercentage + '%'}}/>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th style={{width: 200}}>{tu("bandwidth")}</th>
                  <td>
                    <span className="text-primary">
                      <FormattedNumber value={currentWallet.bandwidth.netUsed} className="text-primary"/>&nbsp;
                    </span>/&nbsp;
                    <span className="text-muted">
                      <FormattedNumber value={currentWallet.bandwidth.netLimit}/>
                    </span>
                    <span className="float-right">
                      {Math.ceil(currentWallet.bandwidth.netPercentage)}%
                    </span>
                    <div className="progress mt-1">
                      <div className="progress-bar bg-primary"
                           style={{width: currentWallet.bandwidth.netPercentage + '%'}}/>
                    </div>
                  </td>
                </tr>
                {
                  Object.keys(currentWallet.bandwidth.assets).length > 0 &&
                  <tr>
                    <td className="bg-light text-center" colSpan={2}>
                      Tokens
                    </td>
                  </tr>
                }
                {
                  Object.entries(currentWallet.bandwidth.assets).map(([token, bandwidth]) => (
                      <tr>
                        <th style={{width: 200}}>{token}</th>
                        <td>
                        <span className="text-primary">
                          <FormattedNumber value={bandwidth.netUsed} className="text-primary"/>&nbsp;
                        </span>
                          /&nbsp;
                          <span className="text-muted">
                          <FormattedNumber value={bandwidth.netLimit}/>
                        </span>
                          <span className="float-right">
                          {Math.ceil(bandwidth.netPercentage)}%
                        </span>
                          <div className="progress mt-1">
                            <div className="progress-bar bg-primary" style={{width: bandwidth.netPercentage + '%'}}/>
                          </div>
                        </td>
                      </tr>
                  ))
                }
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
  }

  renderFrozenTokens() {

    let {frozen, accountResource,account} = this.props;
    if (frozen.balances.length === 0 && accountResource.frozen_balance === 0) {
      return null;
    }

    return (
        <table className="table m-0 temp-table">
          <thead className="thead-light">
          <tr>
            <th>{tu("freeze_type")}</th>
            <th>{tu("balance")}</th>
            <th className="text-right">{tu("unfreeze_time")}</th>
          </tr>
          </thead>
          <tbody>
          {
              frozen.balances.length > 0 && <tr>
                <td>
                    {tu('bandwidth')}
                </td>
                <td>
                  <TRXPrice amount={frozen.balances[0].amount / ONE_TRX}/>
                </td>
                <td className="text-right">
                  <span className="mr-1">{tu('After')}</span>
                  <FormattedDate value={frozen.balances[0].expires}/>&nbsp;
                  <FormattedTime value={frozen.balances[0].expires}/>
                </td>
              </tr>
          }
          {
              accountResource.frozen_balance > 0 && <tr>
                <td>
                    {tu('energy')}
                </td>
                <td>
                  <TRXPrice amount={accountResource.frozen_balance / ONE_TRX}/>
                </td>
                <td className="text-right">
                  <span className="mr-1">{tu('After')}</span>
                  <FormattedDate value={accountResource.expire_time}/>&nbsp;
                  <FormattedTime value={accountResource.expire_time}/>
                </td>
              </tr>
          }
          </tbody>
        </table>
    )
  }

  renderTransactions() {

    let {account} = this.props;

    return (
        <Transactions
            theadClass="thead-light"
            showTotal={false}
            autoRefresh={30000}
            pagingProps={{showPageSize: false}}
            EmptyState={() => <p className="text-center">No transactions yet</p>}
            filter={{address: account.address}}/>
    )
  }

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
    let {privateKey} = this.state;
    let {account} = this.props;

    let confirm = null;
    if (param === 'freeze')
      confirm = this.showFreezeBalance;
    if (param === 'unfreeze')
      confirm = this.showUnfreezeModal;
    if (param === 'applySR')
      confirm = this.applyForDelegate;
    if (param === 'claimRewards')
      confirm = this.claimRewards;
    if (param === 'unfreezeAssetsConfirmation')
      confirm = this.unfreezeAssetsConfirmation;
    if (param === 'changeName')
      confirm = this.changeName;
    if (param === 'changeWebsite')
      confirm = this.changeWebsite;
    if (param === 'changeGithubURL')
      confirm = this.changeGithubURL;


    let reConfirm = () => {
      if (this.privateKey.value && this.privateKey.value.length === 64) {
        if (pkToAddress(this.privateKey.value) === account.address)
          confirm();
      }
    }

    this.setState({
      modal: (
          <SweetAlert
              info
              showCancel
              cancelBtnText={tu("cancel")}
              confirmBtnText={tu("confirm")}
              confirmBtnBsStyle="success"
              cancelBtnBsStyle="default"
              title={tu("confirm_private_key")}
              onConfirm={reConfirm}
              onCancel={this.hideModal}
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
  showFreezeBalance = () => {

    let {privateKey} = this.state;

    let {trxBalance, currentWallet} = this.props;

    if (trxBalance === 0) {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("not_enough_trx")} onConfirm={this.hideModal}>
              {tu("freeze_trx_least")}
            </SweetAlert>
        )
      });
      return;
    }


    this.setState({
      modal: (
          <FreezeBalanceModal
              frozenTrx={currentWallet.frozenTrx}
              privateKey={privateKey}
              onHide={this.hideModal}
              onError={() => {
                this.setState({
                  modal: (
                      <SweetAlert warning title={tu("Error")} onConfirm={this.hideModal}>
                        Something went wrong while trying to freeze TRX
                      </SweetAlert>
                  )
                });
              }}
              onConfirm={({amount}) => this.showFreezeConfirmation(amount)}
          />
      )
    });
  };
  resourceSelectChange = (value) => {
      this.setState({
          selectedResource: Number(value)
      });
  }

  hideModal = () => {
      this.setState({
          modal: null,
      });
  };

  hideFreezeModal = () =>{
      this.setState({
          modal: null,
          selectedResource:null
      });
  }

  showUnfreezeModal = async () => {
    let {privateKey,selectedResource,resources} = this.state;
    let {intl} = this.props;
    this.setState({
        modal: (
          <SweetAlert
              info
              showCancel
              confirmBtnText={tu("unfreeze")}
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              cancelBtnText={tu("cancel")}
              title={tu("unfreeze_trx_confirm_message")}
              onConfirm={this.unfreeze}
              onCancel={this.hideFreezeModal}
              style={{height: '300px'}}
          >
              <div className="form-group" style={{marginBottom:'36px'}}>
                <div className="mt-3 mb-2 text-left" style={{color:'#666'}}>
                    {tu("please_select_the_type_of_unfreeze")}
                </div>
                <select className="custom-select"
                        value={selectedResource}
                        onChange={(e) => {this.resourceSelectChange(e.target.value)}}>
                        <option value="0">{intl.formatMessage({id: "unfreeze_bandwidth"})}</option>
                        <option value="1">{intl.formatMessage({id: "unfreeze_energy"})}</option>
                </select>
              </div>

          </SweetAlert>
      ),

    })
  };

  unfreezeAssetsConfirmation = async () => {
    this.setState({
      modal: (
          <SweetAlert
              info
              showCancel
              confirmBtnText={tu("unfreeze_assets")}
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              cancelBtnText={tu("cancel")}
              title={tu("sure_to_unfreeze_unlocked_tokens_message")}
              onConfirm={this.unfreezeAssets}
              onCancel={this.hideModal}
          >
          </SweetAlert>
      )
    })
  };

  claimRewards = async () => {
    let res;
    let {account, currentWallet} = this.props;
    if(this.state.isTronLink === 1){
        const { tronWeb } = account;
        const unSignTransaction = await tronWeb.transactionBuilder.withdrawBlockRewards(tronWeb.defaultAddress.base58).catch(e=>false);
        const {result} = await transactionResultManager(unSignTransaction,tronWeb)
        res = result;
    } else {
        let {success, code} = await Client.withdrawBalance(currentWallet.address)(account.key);
        res = success;
    }
    if (res) {
      this.setState({
        modal: (
            <SweetAlert success title={tu("rewards_claimed")} onConfirm={this.hideModal}>
              {tu("successfully_claimed_rewards")}
            </SweetAlert>
        )
      });
    } else {
      this.setState({
        modal: (
            <SweetAlert danger title={tu("could_not_claim_rewards")} onConfirm={this.hideModal}>
              {tu("claim_rewards_error_message")}
            </SweetAlert>
        )
      });
    }
  };

  unfreeze = async () => {
    let {account} = this.props;
    let {privateKey,selectedResource} = this.state;
    let res,type;
    this.hideModal();
    if(!selectedResource) {
        selectedResource = 0
    }
    if (Lockr.get("islogin")) {
      const { tronWeb } = account;
      if(!selectedResource){
        type = 'BANDWIDTH';
      }else{
        type = 'ENERGY';
      }
        try {
            const unSignTransaction = await tronWeb.transactionBuilder.unfreezeBalance(type, tronWeb.defaultAddress.base58).catch(e=>false);
            const {result} = await transactionResultManager(unSignTransaction,tronWeb)
            res = result;
        } catch (e) {
             console.log(e)
        }
    }else {
      let {success} = await Client.unfreezeBalance(account.address, selectedResource)(account.key);
      res = success
    }

    if (res) {
      this.setState({
        modal: (
            <SweetAlert success title="TRX Unfrozen" onConfirm={this.hideFreezeModal}>
              {tu("success_unfrozen_trx")}
            </SweetAlert>
        )
      });
      setTimeout(() => this.reloadTokens(), 1200);
    } else {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("unable_to_unfreeze")} onConfirm={this.hideFreezeModal}>
              {tu("unable_unfreeze_trx_message")}
            </SweetAlert>
        ),
      });
    }
  };

  unfreezeAssets = async () => {
    let {account} = this.props;
    let {privateKey} = this.state;
    let res;
    this.hideModal();
      if(this.state.isTronLink === 1){
          const { tronWeb } = account;
          const unSignTransaction = await tronWeb.fullNode.request('wallet/unfreezeasset', {
              owner_address: tronWeb.defaultAddress.hex,
          }, 'post').catch(e=>false);
          const {result} = await transactionResultManager(unSignTransaction,tronWeb)
          res = result;
      } else {
          let {success} = await Client.unfreezeAssets(account.address)(account.key);
          res = success;
      }

    if (res) {
      this.setState({
        modal: (
            <SweetAlert success title={tu("tokens_unfrozen")} onConfirm={this.hideModal}>
              {tu("success_tokens_unfrozen_message")}
            </SweetAlert>
        )
      });

      setTimeout(() => this.loadAccount(), 1200);
      setTimeout(() => this.props.reloadWallet(), 1200);

    } else {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("unable_to_unfreeze")} onConfirm={this.hideModal}>
              {tu("Unable_tokens_unfrozen_message")}
            </SweetAlert>
        ),
      });
    }
  };

  showFreezeConfirmation = (amount) => {
    this.setState({
      modal: (
          <SweetAlert success title={tu("tokens_frozen")} onConfirm={this.hideModal}>
            {tu("successfully_frozen")} {amount} TRX
          </SweetAlert>
      )
    });

    setTimeout(() => this.props.reloadWallet(), 1000);
  };

  updateName = async (name) => {
    let res;
    let {account, currentWallet} = this.props;
    if(this.state.isTronLink === 1){
        const { tronWeb } = account;
        const unSignTransaction = await tronWeb.fullNode.request('wallet/updateaccount', {account_name:tronWeb.fromUtf8(name),owner_address:tronWeb.defaultAddress.hex}, 'post').catch(e=>false);
        const {result} = await  transactionResultManager(unSignTransaction,tronWeb);
        res = result;
    }else{
        let {success} = await Client.updateAccountName(currentWallet.address, name)(account.key);
        res = success;
    }
    if (res) {
      this.setState({
        temporaryName: name,
        modal: (
            <SweetAlert success title={tu("name_changed")} onConfirm={this.hideModal}>
              {tu("successfully_changed_name_to_message")} <b>{name}</b>
            </SweetAlert>
        )
      });
      setTimeout(() => this.props.reloadWallet(), 1000);
    } else {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("unable_to_rename_title")} onConfirm={this.hideModal}>
              {tu("unable_to_rename_message")}
            </SweetAlert>
        )
      })
    }
  };

  updateWebsite = async (url) => {
    let res;
    let {account, currentWallet} = this.props;
    if(this.state.isTronLink === 1){
        const tronWeb = account.tronWeb;
        const unSignTransaction = await tronWeb.fullNode.request('wallet/updatewitness', {update_url:tronWeb.fromUtf8(url),owner_address:tronWeb.defaultAddress.hex}, 'post');
        const {result} = await  transactionResultManager(unSignTransaction,tronWeb);
        res = result;
    } else {
        let {success} = await Client.updateWitnessUrl(currentWallet.address, url)(account.key);
        res = success;
    }

    if (res) {
      this.setState({
        modal: (
            <SweetAlert success title={tu("url_changed")} onConfirm={this.hideModal}>
              {tu("successfully_changed_website_message")} <b>{url}</b>
            </SweetAlert>
        )
      });

      setTimeout(() => this.props.reloadWallet(), 1000);
    } else {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("unable_to_change_website_title")} onConfirm={this.hideModal}>
              {tu("unable_to_change_website_message")}
            </SweetAlert>
        )
      })
    }
  };

  createTxnPair = async (firstTokenId, secondTokenId, firstTokenBalance, secondTokenBalance) => {
      let res;
      let {account, currentWallet} = this.props;
      if(this.state.isTronLink === 1){
            const { tronWeb } = account;
            const unSignTransaction = await tronWeb.transactionBuilder.createTRXExchange(firstTokenId,firstTokenBalance,secondTokenBalance,tronWeb.defaultAddress.hex).catch(e=>false);
            const {result} = await  transactionResultManager(unSignTransaction,tronWeb);
            res = result;
      }else{
            const {success} =  await Client.createExchange(currentWallet.address, firstTokenId,secondTokenId,firstTokenBalance,secondTokenBalance)(account.key);
            res = success;
      }
      if (res) {
          this.setState({
              temporaryName: name,
              modal: (
                  <SweetAlert success onConfirm={this.hideModal}>
                      {tu("successfully_created_pair")}
                  </SweetAlert>
              )
          });

          setTimeout(() => this.props.reloadWallet(), 1000);
      } else {
          this.setState({
              modal: (
                  <SweetAlert warning  onConfirm={this.hideModal}>
                      {tu("pair_creation_failed")}
                  </SweetAlert>
              )
          })
      }
  };

  injectExchange = async (exchangeId, tokenId, quant) => {
        let res;
        let {account, currentWallet} = this.props;
        if(this.state.isTronLink === 1){
          const { tronWeb } = account;
          const unSignTransaction = await tronWeb.transactionBuilder.injectExchangeTokens(exchangeId, tokenId, quant, tronWeb.defaultAddress.hex).catch(e=>false);
          const {result} = await transactionResultManager(unSignTransaction,tronWeb);
          res = result;
        } else {
          const {success} = await Client.injectExchange(currentWallet.address, exchangeId, tokenId, quant)(account.key);
          res = success;
         }
        if (res) {
            this.setState({
                temporaryName: name,
                modal: (
                    <SweetAlert success  onConfirm={this.hideModal}>
                        {tu("successful_injection")}
                    </SweetAlert>
                )
            });

            setTimeout(() => this.props.reloadWallet(), 5000);
        } else {
            this.setState({
                modal: (
                    <SweetAlert warning onConfirm={this.hideModal}>
                        {tu("sorry_injection_failed")}
                    </SweetAlert>
                )
            })
        }
    };

  withdrawExchange = async (exchangeId, tokenId, quant) => {
        let res;
        let {account, currentWallet} = this.props;
        if(this.state.isTronLink === 1){
            const { tronWeb } = account;
            const unSignTransaction = await tronWeb.transactionBuilder.withdrawExchangeTokens(exchangeId, tokenId, quant, tronWeb.defaultAddress.hex).catch(e=>false);
            const {result} = await transactionResultManager(unSignTransaction,tronWeb)
            res = result;
        } else {
            const {success} = await Client.withdrawExchange(currentWallet.address, exchangeId, tokenId, quant)(account.key);
            res = success;
        }
        if (res) {
            this.setState({
                temporaryName: name,
                modal: (
                    <SweetAlert success onConfirm={this.hideModal}>
                        {tu("successful_withdrawal")}
                    </SweetAlert>
                )
            });

            setTimeout(() => this.props.reloadWallet(), 5000);
        } else {
            this.setState({
                modal: (
                    <SweetAlert warning onConfirm={this.hideModal}>
                        {tu("sorry_withdrawal_failed")}
                    </SweetAlert>
                )
            })
        }
    };

  changeName = () => {
    this.setState({
      modal: (
          <ChangeNameModal
              onConfirm={(name) => this.updateName(name)}
              onCancel={this.hideModal}/>
      )
    })
  };

  changeTxnPair = () => {
      this.setState({
          modal: (
              <CreateTxnPairModal
                  onCreate={(firstTokenId,secondTokenId,firstTokenBalance,secondTokenBalance) => this.createTxnPair(firstTokenId,secondTokenId,firstTokenBalance,secondTokenBalance)}
                  onCancel={this.hideModal}
                  dealPairTrxLimit={this.state.dealPairTrxLimit}
              />
          )
      })
  };

  injectTxnPair = (exchange) => {
      this.setState({
          modal: (
              <OperateTxnPairModal
                  onInject={(exchangeId,tokenId,quant) => this.injectExchange(exchangeId,tokenId,quant)}
                  onCancel={this.hideModal}
                  exchange={exchange}
                  inject={true}
              />
          )
      })
  };

  withdrawTxnPair = (exchange) => {
        this.setState({
            modal: (
                <OperateTxnPairModal
                    onWithdraw={(exchangeId,tokenId,quant) => this.withdrawExchange(exchangeId,tokenId,quant)}
                    onCancel={this.hideModal}
                    exchange={exchange}
                    inject={false}
                    dealPairTrxLimit={this.state.dealPairTrxLimit}
                />
            )
        })
    };


  changeGithubURL = async () => {
    this.setState({
      modal: (
        this.state.isTronLink === 1?
          <SweetAlert onCancel={this.hideModal} onConfirm={this.hideModal}>
              {tu("change_login_method")}
          </SweetAlert>
          :
          <SweetAlert
              input
              showCancel
              cancelBtnBsStyle="default"
              cancelBtnText={tu("cancel")}
              confirmBtnText={tu("link_github")}
              title={tu("link_to_github")}
              placeHolder="github username or https://github.com/{username}/tronsr-template"
              onCancel={this.hideModal}
              validationMsg={tu("you_must_enter_a_url")}
              onConfirm={async (name) => {
                if (await this.detectGithubUrl(name)) {
                  this.setState({
                    modal: (
                        <SweetAlert success title={tu("github_linked")} onConfirm={this.hideModal}>
                          {tu("successfully_linked_github")}
                        </SweetAlert>
                    )
                  });
                } else {
                  this.setState({
                    modal: (
                        <SweetAlert
                            danger
                            showCancel
                            title={tu("could_not_link_github")}
                            onCancel={this.hideModal}
                            onConfirm={this.changeGithubURL}>
                          {tu("unable_to_link_github_message")}
                        </SweetAlert>
                    )
                  });
                }
              }}>
            {tu("enter_your_github_username")}
          </SweetAlert>
      )
    });
  };

  hasGithubLink = () => {
    let {sr} = this.state;
    return sr && (trim(sr.githubLink).length !== 0);
  };

  detectGithubUrl = async (input) => {

    let urls = [
      `https://raw.githubusercontent.com/${input}/tronsr-template/master/logo.png`,
      `https://raw.githubusercontent.com/${input}/master/logo.png`,
    ];

    for (let url of urls) {
      try {
        await xhr.get(url);
        await this.updateGithubURL(input);
        return true;
      } catch (e) {

      }
    }

    return false;
  };

  updateGithubURL = async (url) => {
    let {account, currentWallet} = this.props;
    let key = await Client.auth(account.key);
    let [name, repo] = url.split("/");
    let githubLink = name + "/" + (repo || "tronsr-template");
    if(this.state.isTronLink === 1) {
        // const { tronWeb } = account;
        // const unSignTransaction = await tronWeb.transactionBuilder.withdrawExchangeTokens(exchangeId, tokenId, quant, tronWeb.defaultAddress.hex);
        // await transactionResultManager(unSignTransaction,tronWeb)
        return;
    } else {
        await Client.updateSuperRepresentative(key, {
            address: currentWallet.address,
            githubLink,
        });
    }
    this.loadAccount();
  };
  changeWebsite = () => {
      this.setState({
              modal: (
                  <SweetAlert
                      input
                      showCancel
                      cancelBtnBsStyle="default"
                      title={tu("change_website")}
                      placeHolder="https://"
                      onCancel={this.hideModal}
                      validationMsg={tu("you_must_enter_url")}
                      onConfirm={(name) => this.updateWebsite(name)}>
                      {tu("specify_the_url")}
                  </SweetAlert>
              )
          });
  };

  applyForDelegate = () => {
    let {privateKey} = this.state;

    this.setState({
      modal: (
          <ApplyForDelegate
              isTronLink = {this.state.isTronLink}
              privateKey={privateKey}
              onCancel={this.hideModal}
              onConfirm={() => {
                setTimeout(() => this.props.reloadWallet(), 1200);
                this.setState({
                  modal: (
                      <SweetAlert success title={tu("success")} onConfirm={this.hideModal}>
                        {tu("successfully_appied_sr_canidate_message_0")} <br/>
                        {tu("successfully_appied_sr_canidate_message_1")}
                      </SweetAlert>
                  )
                });
              }}/>
      )
    })
  };

  showQrCode = () => {

    let {currentWallet} = this.props;


    this.setState({
      modal: (
          <Modal className="modal-dialog-centered animated zoomIn" fade={false} isOpen={true} toggle={this.hideModal}>
            <ModalHeader toggle={this.hideModal}/>
            <ModalBody className="text-center p-0" onClick={this.hideModal}>
              <QRImageCode value={currentWallet.address} size={500} style={{width: '100%'}}/>
            </ModalBody>
          </Modal>
      )
    });
  };

  toissuedAsset = () => {
    window.location.hash = "#/myToken";
  }

  handleSwitch = (val) => {
      this.setState({hideSmallCurrency: val});
  }

  handleTRC10Token = () => {
      this.setState({tokenTRC10: true});
  }

  handleTRC20Token = () => {
      this.setState({tokenTRC10: false});
  }

  render() {
    let {modal, sr, issuedAsset, showBandwidth, showBuyTokens, temporaryName, hideSmallCurrency,tokenTRC10} = this.state;
    let {account, frozen, totalTransactions, currentWallet, wallet, accountResource,trxBalance} = this.props;
    if (!wallet.isOpen || !currentWallet) {
      return (
          <main className="container header-overlap">
            <div className="row">
              <div className="col-md-12">
                <div className="card p-3">
                  <h5 className="text-muted text-center">
                    {tu("no_open_wallet")}
                  </h5>
                </div>
              </div>
            </div>
          </main>
      );
    }
    let hasFrozen = frozen.balances.length > 0;
    let hasResourceFrozen =  accountResource.frozen_balance > 0
    return (
        <main className="container header-overlap token_black accounts">
          {modal}
          <div className="text-center alert alert-light alert-dismissible fade show" role="alert">
              <a href="https://trondice.org" target="_blank" style={{textDecoration:'none'}}>
                  {tu("account_ad")}
              </a>
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="row">
            <div className="col-md-3">
              <div className="card h-100 bg-line_red bg-image_band">
                <div className="card-body">
                  <h3 style={{color: '#C23631'}}>
                    <FormattedNumber value={currentWallet.bandwidth.netRemaining + currentWallet.bandwidth.freeNetRemaining}/>
                  </h3>
                  {/* <a href="javascript:;"
                     onClick={() => this.setState(state => ({showBandwidth: !state.showBandwidth}))}>
                    {tu("bandwidth")}
                  </a> */}
                  {tu("bandwidth")}
                  <span className="ml-2">
                      <QuestionMark placement="top" text="bandwidth_tip" />
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3 mt-3 mt-md-0">
              <div className="card h-100 bg-line_blue bg-image_engry">
                <div className="card-body">
                  <h3 style={{color: '#4A90E2'}}>
                    <FormattedNumber value={currentWallet.bandwidth.energyRemaining}/>
                  </h3>
                    {tu("energy")}
                    <span className="ml-2">
                      <QuestionMark placement="top" text="energy_tip"/>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3 mt-3 mt-md-0">
              <div className="card h-100 bg-line_yellow bg-image_vote">
                <div className="card-body">
                  <h3 style={{color: '#E0AE5C'}}>
                    <FormattedNumber value={currentWallet.frozenTrx / ONE_TRX}/>
                  </h3>
                    TRON {tu("power")}
                    <span className="ml-2">
                      <QuestionMark placement="top" text="power_tip"/>
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-3 mt-3 mt-md-0">
              <div className="card h-100 bg-line_green bg-image_balance">
                <div className="card-body">
                  <h3 style={{color: '#93C54B'}}>
                    <TRXPrice amount={currentWallet.balance / ONE_TRX}/>
                  </h3>
                  {tu("available_balance")}
                </div>
              </div>
            </div>
          </div>
          {showBandwidth && this.renderBandwidth()}
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card px-3">
                {
                  currentWallet.representative.enabled &&
                  <div className="card-header bg-info text-center font-weight-bold text-white">Representative</div>
                }
                <div className="table-responsive">
                  <table className="table m-0">
                    <tbody>
                    {
                      wallet.isOpen &&
                      <tr>
                        <th style={{border: 'none'}}>{tu("name")}:</th>
                        <td style={{border: 'none'}}>
                          {currentWallet.name|| temporaryName || "-"}
                          {
                            (trim(currentWallet.name) === "" && (currentWallet.balance > 0 || currentWallet.frozenTrx > 0)) &&
                            <a href="javascript:" className="float-right text-primary btn btn-default btn-sm"
                               onClick={() => {
                                 this.changeName()
                               }}>
                              {tu("set_name")}
                            </a>
                          }
                        </td>
                      </tr>
                    }
                    {
                      currentWallet.representative.enabled &&
                      <tr>
                        <th>{tu("website")}:</th>
                        <td>
                          <a href={currentWallet.representative.url}>{currentWallet.representative.url}</a>
                          <a href="javascript:" className="float-right text-primary btn btn-default btn-sm"
                             onClick={() => {
                               this.changeWebsite()
                             }}>
                            {tu("change_website")}
                          </a>

                        </td>
                      </tr>
                    }
                    <tr>
                      <th style={{width: 150}}>{tu("address")}:</th>
                      <td>
                        <a href="javascript:" className="float-right text-primary btn btn-default btn-sm"
                           onClick={this.showQrCode}>
                          {tu("show_qr_code")}
                        </a>

                        <div className="float-left" style={{width: 350}}>
                          <AddressLink address={account.address} includeCopy={true}/>
                        </div>

                        {
                          IS_TESTNET &&
                          <p className="text-danger">
                            ({tu("do_not_send_2")})
                          </p>
                        }
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("transactions")}:</th>
                      <td>
                        <FormattedNumber value={totalTransactions}/>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {
            issuedAsset &&
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center m-0">
                      {tu("issued_token")}
                    </h5>

                    <table className="table mt-3 temp-table">
                      <tbody>
                      <tr>
                        <th style={{width: 150}}>{tu("name")}:</th>
                        <td>
                          <TokenLink name={issuedAsset.name} address={issuedAsset.ownerAddress}/>
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("start_date")}:</th>
                        <td>
                          {issuedAsset.endTime - issuedAsset.startTime >1000 ? <span><FormattedDate value={issuedAsset.startTime}/>{' '}<FormattedTime value={issuedAsset.startTime}/></span>:"-"}
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("end_date")}:</th>
                        <td>
                          {issuedAsset.endTime - issuedAsset.startTime >1000 ? <span><FormattedDate value={issuedAsset.endTime}/>{' '}<FormattedTime value={issuedAsset.endTime}/></span>:"-"}
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("progress")}:</th>
                        <td>
                          <div className="progress mt-1">
                            <div className="progress-bar bg-success" style={{width: issuedAsset.percentage + '%'}}/>
                          </div>
                        </td>
                      </tr>
                      {
                        issuedAsset.frozen.length > 0 &&
                        <tr>
                          <th>{tu("frozen_supply")}:</th>
                          <td>
                            <a href="javascript:" className="float-right text-primary"
                               onClick={() => {
                                 this.unfreezeAssetsConfirmation()
                               }}>
                              {tu("unfreeze_assets")}
                            </a>
                            {
                              issuedAsset.frozen.map((frozen, index) => (
                                  <div key={index}>
                                    {frozen.amount} {tu("can_be_unlocked")}&nbsp;
                                    {
                                      (getTime(addDays(new Date(issuedAsset.startTime), frozen.days)) > getTime(new Date())) &&
                                      <FormattedRelative
                                          value={getTime(addDays(new Date(issuedAsset.startTime), frozen.days))}/>
                                    }
                                  </div>
                              ))
                            }
                          </td>
                        </tr>
                      }
                      </tbody>
                    </table>
                    <button className="btn btn-danger btn-lg mb-3" onClick={this.toissuedAsset}
                            style={{width: '120px', margin: 'auto'}}>{tu('token_detail')}</button>
                  </div>
                </div>
              </div>
            </div>
          }
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body temp-table">
                  <div className="d-flex justify-content-between account-switch">
                    <h5 className="card-title text-center m-0">
                        {tu("tokens")}
                    </h5>
                    <SwitchToken  handleSwitch={this.handleSwitch} text="hide_small_currency" hoverText="tokens_less_than_10"/>
                  </div>
                  <div className="account-token-tab">
                    <a href="javascript:;"
                       className={"btn btn-default btn-sm" + (tokenTRC10?' active':'')}
                       onClick={this.handleTRC10Token}>
                        {tu("TRC10_token")}
                    </a>
                    <a href="javascript:;"
                       className={"btn btn-default btn-sm ml-2" + (tokenTRC10?'':' active')}
                       onClick={this.handleTRC20Token}>
                        {tu("TRC20_token")}
                    </a>
                  </div>
                    {
                        tokenTRC10?<div>
                                {this.renderTokens()}
                            </div>
                            :
                            <div>
                                {this.renderTRC20Tokens()}
                            </div>
                    }
                </div>
              </div>
            </div>
          </div>
            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between trade_pair_title">
                                <h5 className="card-title text-center">
                                    {tu("my_trading_pairs")}
                                    {tu("deal_pair_tip")}
                                </h5>
                                <p className="card-text">
                                    <a href="javascript:" className={trxBalance >= this.state.dealPairTrxLimit?"btn btn-default btn-sm btn-plus-square":"float-right btn btn-default btn-sm btn-plus-square disabled"}
                                       onClick={() => {
                                           this.changeTxnPair()
                                       }}>
                                        <i className="fa fa-plus-square"></i>
                                        &nbsp;
                                        {tu("create_trading_pairs")}
                                    </a>
                                </p>
                            </div>
                            <div style={{overflowX:'auto'}}>
                            <table className="table m-0 temp-table mt-4">
                                <thead className="thead-light">
                                <tr>
                                    <th>{tu("pairs")}</th>
                                    <th>{tu("balance")}</th>
                                    <th className="text-right"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    currentWallet.exchanges.length? currentWallet.exchanges.map((exchange, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    {exchange.first_token_id === "_"?"TRX":exchange.first_token_id}/{exchange.second_token_id === "_"?"TRX":exchange.second_token_id}
                                                </td>
                                                <td>
                                                    <FormattedNumber value={ exchange.first_token_id === "_"? exchange.first_token_balance / ONE_TRX : exchange.first_token_balance }/>
                                                    /
                                                    <FormattedNumber value={ exchange.second_token_id === "_"? exchange.second_token_balance / ONE_TRX : exchange.second_token_balance }/>
                                                </td>
                                                <td className="text-right" style={{display:'flex',flexDirection:'row',justifyContent:'flex-end'}}>
                                    <div className="dex-inject" style={{whiteSpace:'nowrap'}}
                                          onClick={() => {
                                              this.injectTxnPair(exchange)
                                          }}
                                    >
                                        {tu("capital_injection")}
                                    </div>
                                                    |
                                                    <div className="dex-divestment" style={{whiteSpace:'nowrap'}}
                                                          onClick={() => {
                                                              this.withdrawTxnPair(exchange)
                                                          }}
                                                    >
                                       {tu("capital_withdrawal")}
                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }):<tr>
                                        <td></td>
                                        <td>
                                            {tu('no_pairs')}
                                        </td>
                                        <td></td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="row mt-3">*/}
                {/*<div className="col-md-12">*/}
                    {/*<div className="card">*/}
                        {/*<div className="card-body">*/}
                            {/*<h5 className="card-title text-center m-0">*/}
                                {/*{tu('apply_for_process')}*/}
                            {/*</h5>*/}
                            {/*<p className="pt-3">*/}
                                {/*{tu('token_application_instructions_1')}*/}
                            {/*</p>*/}
                            {/*<div className="text-center">*/}
                                {/*<a href="https://goo.gl/forms/OXFG6iaq3xXBHgPf2" target="_blank">*/}
                                    {/*<button className="btn btn-danger">*/}
                                        {/*{t("apply_for_the_currency")}*/}
                                    {/*</button>*/}
                                {/*</a>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
            {/*</div>*/}
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body temp-table">
                  <h5 className="card-title text-center m-0">
                    {tu("transactions")}
                  </h5>
                  {this.renderTransactions()}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center m-0">
                    TRON {tu("power")}
                  </h5>

                  <div className="card-body px-0 d-lg-flex justify-content-lg-between">
                    <p className="card-text freeze-trx-premessage">
                      {tu("freeze_trx_premessage_0")}
                      <Link to="/sr/votes">{t("freeze_trx_premessage_link")}</Link>
                      {tu("freeze_trx_gain_bandwith_energy")}
                      <br/>
                      <br/>{tu("freeze_trx_premessage_1")}
                      <br/>
                      <br/>{tu("freeze_trx_premessage_2")}
                    </p>
                    <div>
                      {
                          (hasFrozen || hasResourceFrozen) &&
                        <button className="btn btn-danger mr-2" onClick={() => {
                          this.showUnfreezeModal()
                        }}>
                          {tu("unfreeze")}
                        </button>
                      }
                      <button className="btn btn-primary" onClick={() => {
                        this.showFreezeBalance()
                      }}>
                        {tu("freeze")}
                      </button>
                    </div>
                  </div>
                  {this.renderFrozenTokens()}
                </div>
              </div>
            </div>
          </div>
            {
            currentWallet.representative.enabled ?
                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title text-center">
                                    {tu("Super Representatives")}
                                </h5>
                                <p className="card-text">
                                    {tu("sr_receive_reward_message_0")}
                                </p>
                                <div className="text-center">
                                    <button className="btn btn-success"
                                            onClick={() => {
                                                this.claimRewards()
                                            }}
                                            disabled={currentWallet.representative.allowance === 0}
                                    >
                                        {tu("claim_rewards")}
                                    </button>
                                    {
                                        currentWallet.representative.allowance > 0 ?
                                            <p className="m-0 mt-3 text-success">
                                                Claimable Rewards: <TRXPrice amount={currentWallet.representative.allowance / ONE_TRX}
                                                                             className="font-weight-bold"/>
                                            </p> :
                                            <p className="m-0 mt-3 font-weight-bold" style={{color: '#D0AC6E'}}>
                                                No rewards to claim
                                            </p>
                                    }
                                </div>
                                <hr/>
                                <h5 className="card-title text-center">
                                    {tu("landing_page")}
                                </h5>
                                <div className="text-center">
                                    <p className="card-text text-center">
                                        {tu("create_sr_landing_page_message_0")}
                                    </p>
                                    <p className="text-center">
                                        <HrefLink className="btn btn-danger"
                                                  href="https://github.com/tronscan/tronsr-template#readme">
                                            {tu("show_more_information_publish_sr_page")}
                                        </HrefLink>
                                    </p>
                                    {
                                        !this.hasGithubLink() &&
                                        <Fragment>
                                            <p className="card-text text-center">
                                                {tu("set_github_url_message_0")}
                                            </p>
                                            <p className="text-center">
                                                <button className="btn btn-dark mr-2" onClick={() => {
                                                    this.changeGithubURL()
                                                }}>
                                                    {tu("set_github_link")}
                                                </button>
                                            </p>
                                        </Fragment>
                                    }
                                </div>
                            </div>
                            {
                                this.hasGithubLink() &&
                                <table className="table m-0">
                                    <tbody>
                                    <tr>
                                        <th>{tu("Github Link")}:</th>
                                        <td>
                                            <HrefLink href={"http://github.com/" + sr.githubLink}
                                                      target="_blank">{"http://github.com/" + sr.githubLink}</HrefLink>
                                            <a href="javascript:;" className="float-right text-primary"
                                               onClick={() => {
                                                   this.changeGithubURL()
                                               }}>
                                                {tu("Change Github Link")}
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>{tu("Representative Page")}</th>
                                        <td><Link className="text-primary"
                                                  to={`/representative/${currentWallet.address}`}>View</Link>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
                :
                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title text-center m-0">
                                    {tu("Super Representatives")}
                                </h5>
                                <p className="pt-3">
                                    {tu("apply_for_delegate_predescription")}
                                </p>
                                <div className="text-center">
                                    <button className="apply-super-btn btn btn-success"
                                            onClick={() => {
                                                this.applyForDelegate()
                                            }}>
                                        {tu("apply_super_representative_candidate")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        }
          {
            IS_TESTNET && <div className="row mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body text-center">
                    <h5 className="card-title border-bottom-0 m-0">
                      {tu("testnet")}
                    </h5>
                    <TestNetRequest
                        account={account}
                        onRequested={() => setTimeout(() => this.reloadTokens(), 1500)}/>
                  </div>
                </div>
              </div>
            </div>
          }
        {/*
        <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center m-0">
                    {t("buy_trx")}
                  </h5>
                  <div className="py-3">
                    {t("buy_trx_message_0")}
                    <HrefLink href={"https://changelly.com/faq"}
                              target="_blank">{"changelly.com/faq"}</HrefLink>{"."}
                  </div>
                  <div className="text-center">
                    {
                      !showBuyTokens && <button className="btn btn-danger"
                                                onClick={() => this.setState(state => ({showBuyTokens: !state.showBuyTokens}))}>
                        {t("buy_trx_using_changelly")}
                      </button>
                    }
                  </div>
                  {
                    showBuyTokens && <iframe
                        src={"https://changelly.com/widget/v1?auth=email&from=USD&to=TRX&merchant_id=9i8693nbi7bzkyrr&address=" + currentWallet.address + "&amount=100&ref_id=9i8693nbi7bzkyrr&color=28cf00"}
                        height="500" className="changelly" scrolling="no"
                        style={{overflowY: 'hidden', border: 'none', width: '100%'}}> {t("cant_load_widget")}
                    </iframe>
                  }
                </div>
              </div>
            </div>
          </div>
          */}
        </main>
    )
  }
}


function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
    totalTransactions: state.account.totalTransactions,
    frozen: state.account.frozen,
    accountResource: state.account.accountResource,
    wallet: state.wallet,
    currentWallet: state.wallet.current,
    trxBalance: state.account.trxBalance,
  };
}

const mapDispatchToProps = {
  login,
  loadRecentTransactions,
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Account))

const styles = {
  iconEntropy: {
    right: 0,
  },
  tronBalance: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: 100,
  }
};
