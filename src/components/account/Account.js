import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {t, tu} from "../../utils/i18n";
import {loadRecentTransactions} from "../../actions/account";
import xhr from "axios";
import {injectIntl} from "react-intl";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import FreezeBalanceModal from "./FreezeBalanceModal";
import {AddressLink, ExternalLink, HrefLink, TokenLink} from "../common/Links";
import SweetAlert from "react-bootstrap-sweetalert";
import {IS_TESTNET, ONE_TRX} from "../../constants";
import {Client} from "../../services/api";
import {reloadWallet} from "../../actions/wallet";
import {login} from "../../actions/app";
import ApplyForDelegate from "./ApplyForDelegate";
import {filter, trim} from "lodash";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import QRImageCode from "../common/QRImageCode";
import {WidgetIcon} from "../common/Icon";
import ChangeNameModal from "./ChangeNameModal";
import {addDays, getTime} from "date-fns";
import TestNetRequest from "./TestNetRequest";
import Transactions from "../common/Transactions";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import _ from "lodash";

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
      privateKey: ""
    };

  }

  componentDidMount() {
    let {account} = this.props;
    if (account.isLoggedIn) {
      this.reloadTokens();
      this.loadAccount();
    }
  }

  componentDidUpdate(prevProps) {
    let {account} = this.props;
    if ((prevProps.account.isLoggedIn !== account.isLoggedIn) && account.isLoggedIn) {
      this.reloadTokens();
      this.loadAccount();
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
  };

  reloadTokens = () => {
    this.props.reloadWallet();
  };

  renderTokens() {

    let {tokenBalances = []} = this.props;

    tokenBalances = _(tokenBalances)
      .filter(tb => tb.name.toUpperCase() !== "TRX")
      .filter(tb => tb.balance > 0)
      .sortBy(tb => tb.name)
      .value();

    if (tokenBalances.length === 0) {
      return (
          <div className="text-center d-flex justify-content-center p-4">
            {tu("no_tokens")}
          </div>
      );
    }

    return (
        <table className="table border-0 m-0">
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
                    <TokenLink name={token.name}/>
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

    let {frozen} = this.props;

    if (frozen.balances.length === 0) {
      return null;
    }

    return (
        <table className="table border-0 m-0">
          <thead className="thead-light">
          <tr>
            <th>{tu("balance")}</th>
            <th className="text-right">{tu("expires")}</th>
          </tr>
          </thead>
          <tbody>
          {
            frozen.balances.map((balance, index) => (
                <tr key={index}>
                  <td>
                    <TRXPrice amount={balance.amount / ONE_TRX}/>
                  </td>
                  <td className="text-right">
                    <FormattedDate value={balance.expires}/>&nbsp;
                    <FormattedTime value={balance.expires}/>
                  </td>
                </tr>
            ))
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
      if(pkToAddress(value)!==account.address)
        this.privateKey.className = "form-control is-invalid";
    }
    else{
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
        if(pkToAddress(this.privateKey.value)===account.address)
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

  hideModal = () => {
    this.setState({modal: null});
  };

  showUnfreezeModal = async () => {
    let {privateKey} = this.state;
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
              onCancel={this.hideModal}
          >
          </SweetAlert>
      )
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

    let {account, currentWallet} = this.props;
    let {privateKey} = this.state;
    let {success, code} = await Client.withdrawBalance(currentWallet.address)(account.key);
    if (success) {
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
              {tu("claim_rewards_error_message")}<br/>
              {code}
            </SweetAlert>
        )
      });
    }
  };

  unfreeze = async () => {
    let {account} = this.props;
    let {privateKey} = this.state;
    this.hideModal();

    let {success} = await Client.unfreezeBalance(account.address)(account.key);
    if (success) {
      this.setState({
        modal: (
            <SweetAlert success title="TRX Unfrozen" onConfirm={this.hideModal}>
              {tu("success_unfrozen_trx")}
            </SweetAlert>
        )
      });
      setTimeout(() => this.reloadTokens(), 1200);
    } else {
      this.setState({
        modal: (
            <SweetAlert warning title={tu("unable_to_unfreeze")} onConfirm={this.hideModal}>
              {tu("unable_unfreeze_trx_message")}
            </SweetAlert>
        ),
      });
    }
  };

  unfreezeAssets = async () => {
    let {account} = this.props;
    let {privateKey} = this.state;
    this.hideModal();

    let {success} = await Client.unfreezeAssets(account.address)(account.key);
    if (success) {
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
    let {account, currentWallet} = this.props;
    let {privateKey} = this.state;
    let {success} = await Client.updateAccountName(currentWallet.address, name)(account.key);

    if (success) {
      this.setState({
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
    let {account, currentWallet} = this.props;
    let {privateKey} = this.state;
    let {success} = await Client.updateWitnessUrl(currentWallet.address, url)(account.key);

    if (success) {
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

  changeName = () => {
    this.setState({
      modal: (
          <ChangeNameModal
              onConfirm={(name) => this.updateName(name)}
              onCancel={this.hideModal}/>
      )
    });
  };

  changeGithubURL = async () => {
    this.setState({
      modal: (
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
    let {privateKey} = this.state;
    let key = await Client.auth(account.key);

    let [name, repo] = url.split("/");
    let githubLink = name + "/" + (repo || "tronsr-template");

    await Client.updateSuperRepresentative(key, {
      address: currentWallet.address,
      githubLink,
    });

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
    window.location.hash="#/myToken";
  }

  render() {

    let {modal, sr, issuedAsset, showBandwidth, showBuyTokens} = this.state;
    let {account, frozen, totalTransactions, currentWallet, wallet} = this.props;

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

    return (
        <main className="container header-overlap">
          {modal}
          <div className="row">
            <div className="col-md-4">
              <div className="card h-100 text-center widget-icon">
                <WidgetIcon className="fa fa-tachometer-alt" style={styles.iconEntropy}/>
                <div className="card-body">
                  <h3 className="text-secondary">
                    <FormattedNumber value={currentWallet.bandwidth.netRemaining}/>
                  </h3>
                  <a href="javascript:;"
                     onClick={() => this.setState(state => ({showBandwidth: !state.showBandwidth}))}>
                    {tu("bandwidth")}
                  </a>
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 text-center widget-icon">
                <i className="icon-big fa fa-bolt fa-7x" style={{color: '#ffc107'}}/>
                <div className="card-body">
                  <h3 className="text-warning">
                    <FormattedNumber value={currentWallet.frozenTrx / ONE_TRX}/>
                  </h3>
                  TRON {tu("power")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon">
                <img src={require("../../images/tron-icon.svg")} style={styles.tronBalance}/>
                <div className="card-body text-center">
                  <h3 className="text-danger">
                    <TRXPrice amount={currentWallet.balance / ONE_TRX}/>
                  </h3>
                  {tu("balance")}
                </div>
              </div>
            </div>
          </div>

          {showBandwidth && this.renderBandwidth()}
        <div className="row mt-3">
          <div className="col-md-12">
            <div className="card">
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
                          <th>{tu("name")}:</th>
                          <td>
                            {currentWallet.name || "-"}
                            {
                              (trim(currentWallet.name) === "" && (currentWallet.balance > 0 || currentWallet.frozenTrx > 0)) &&
                              <a href="javascript:" className="float-right text-primary" onClick={() => {
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
                            <a href="javascript:" className="float-right text-primary" onClick={() => {
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
                          <a href="javascript:" className="float-right text-primary" onClick={this.showQrCode}>
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
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body px-0 border-0">
                  <h5 className="card-title text-center m-0">
                    {tu("tokens")}
                  </h5>
                </div>
                {this.renderTokens()}
              </div>
            </div>
          </div>
          {
            issuedAsset &&
            <div className="row mt-3">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-body px-0 border-0">
                    <h5 className="card-title text-center m-0">
                      {tu("Issued Token")}
                    </h5>
                  </div>
                  <table className="table m-0">
                    <tbody>
                    <tr>
                      <th style={{width: 150}}>{tu("name")}:</th>
                      <td>
                        <TokenLink name={issuedAsset.name}/>
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("start_date")}:</th>
                      <td>
                        <FormattedDate value={issuedAsset.startTime}/>{' '}
                        <FormattedTime value={issuedAsset.startTime}/>
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("end_date")}:</th>
                      <td>
                        <FormattedDate value={issuedAsset.endTime}/>{' '}
                        <FormattedTime value={issuedAsset.endTime}/>
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
                            issuedAsset.frozen.map(frozen => (
                                <div>
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
                  <button className="btn btn-danger btn-lg" onClick={this.toissuedAsset} style={{width:'120px',margin:'auto'}}>{tu('token_detail')}</button>
                </div>
              </div>
            </div>
          }
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body px-0 border-0">
                  <h5 className="card-title text-center m-0">
                    {tu("transactions")}
                  </h5>
                </div>
                {this.renderTransactions()}
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body px-0 border-0">
                  <h5 className="card-title text-center m-0">
                    TRON {tu("power")}
                  </h5>
                </div>
                <div className="card-body text-center pt-0">
                  <p className="card-text">
                    {tu("freeze_trx_premessage_0")}<Link to="/votes"
                                                         className="text-primary">{t("freeze_trx_premessage_link")}</Link><br/>{tu("freeze_trx_premessage_1")}
                  </p>
                  {
                    hasFrozen &&
                    <button className="btn btn-danger mr-2" onClick={() => {
                      this.showUnfreezeModal()
                    }}>
                      {tu("unfreeze")}
                      <i className="fa fa-fire ml-2"/>
                    </button>
                  }
                  <button className="btn btn-dark mr-2" onClick={() => {
                    this.showFreezeBalance()
                  }}>
                    {tu("freeze")}
                    <i className="fa fa-snowflake ml-2"/>
                  </button>
                </div>
                {this.renderFrozenTokens()}
              </div>
            </div>
          </div>
          {
            currentWallet.representative.enabled ?
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body text-center">
                        <h5 className="card-title text-center">
                          {tu("Super Representatives")}
                        </h5>
                        <p className="card-text">
                          {tu("sr_receive_reward_message_0")}
                        </p>
                        <button className="btn btn-success mr-2"
                                onClick={() => {
                                  this.claimRewards()
                                }}
                                disabled={currentWallet.representative.allowance === 0}>
                          {tu("claim_rewards")}
                          <i className="fa fa-hand-holding-usd ml-2"/>
                        </button>
                        {
                          currentWallet.representative.allowance > 0 ?
                              <p className="m-0 mt-3 text-success">
                                Claimable Rewards: <TRXPrice amount={currentWallet.representative.allowance / ONE_TRX}
                                                             className="font-weight-bold"/>
                              </p> :
                              <p className="m-0 mt-3 font-weight-bold text-danger">
                                No rewards to claim
                              </p>
                        }
                      </div>
                      <div className="card-body border-top">
                        <h5 className="card-title text-center">
                          {tu("landing_page")}
                        </h5>
                        <p className="card-text text-center">
                          {tu("create_sr_landing_page_message_0")}
                        </p>
                        <p className="text-center">
                          <HrefLink className="btn btn-primary mr-2"
                                    href="https://github.com/tronscan/tronsr-template#readme">
                            {tu("show_more_information_publish_sr_page")}
                            <i className="fa fa-question ml-2"/>
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
                                <i className="fab fa-github ml-2"/>
                              </button>
                            </p>
                          </Fragment>
                        }
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
                </div> :
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-body px-0 border-0">
                        <h5 className="card-title text-center m-0">
                          {tu("Super Representatives")}
                        </h5>
                      </div>
                      <div className="card-body text-center">
                        <p className="card-text">
                          {tu("apply_for_delegate_predescription")}
                        </p>
                        <button className="btn btn-success mr-2" onClick={() => {
                          this.applyForDelegate()
                        }}>
                          <i className="fa fa-hand-holding-usd mr-2"/>
                          {tu("apply_super_representative_candidate")}
                        </button>
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
          <div className="row mt-3">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body mb-0 pb-0 px-0 border-0 text-center">
                  <h5 className="card-title text-center m-0">
                    {t("buy_trx")}
                  </h5>
                  <p className="card-body text-center">
                    {t("buy_trx_message_0")}
                    <HrefLink href={"https://changelly.com/faq"}
                              target="_blank">{"changelly.com/faq"}</HrefLink>{"."}
                  </p>
                  <p>
                    {
                      !showBuyTokens && <button className="btn btn-primary my-2"
                                                onClick={() => this.setState(state => ({showBuyTokens: !state.showBuyTokens}))}>
                        {t("buy_trx_using_changelly")}
                        <i className="fa fa-credit-card ml-2"/>
                      </button>
                    }
                  </p>
                  {
                    showBuyTokens && <iframe
                        src={"https://changelly.com/widget/v1?auth=email&from=USD&to=TRX&merchant_id=9d1448c106fd&address=" + currentWallet.address + "&amount=100&ref_id=9d1448c106fd&color=28cf00"}
                        height="500" className="changelly" scrolling="no"
                        style={{overflowY: 'hidden', border: 'none', width: '100%'}}> {t("cant_load_widget")}
                    </iframe>
                  }
                </div>
              </div>
            </div>
          </div>
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
