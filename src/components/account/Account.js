import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {tu,t} from "../../utils/i18n";
import {loadRecentTransactions} from "../../actions/account";
import xhr from "axios";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";
import {Link} from "react-router-dom";
import {TRXPrice} from "../common/Price";
import FreezeBalanceModal from "./FreezeBalanceModal";
import {AddressLink, TokenLink} from "../common/Links";
import SweetAlert from "react-bootstrap-sweetalert";
import {IS_TESTNET, ONE_TRX} from "../../constants";
import {Client} from "../../services/api";
import {reloadWallet} from "../../actions/wallet";
import ApplyForDelegate from "./ApplyForDelegate";
import {filter, trim} from "lodash";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import QRImageCode from "../common/QRImageCode";
import {WidgetIcon} from "../common/Icon";
import ChangeNameModal from "./ChangeNameModal";
import {addDays, getTime} from "date-fns";
import Transfers from "../common/Transfers";
import TestNetRequest from "./TestNetRequest";
import Transactions from "../common/Transactions";

class Account extends Component {

  constructor() {
    super();

    this.state = {
      modal: null,
      showFreezeBalance: false,
      sr: null,
      issuedAsset: null,
      showBandwidth: false,
    };
  }

  componentDidMount() {
    let {wallet} = this.props;
    if (wallet.isOpen) {
      this.reloadTokens();
      this.loadAccount();
    }
  }

  componentDidUpdate(prevProps) {
    let {wallet} = this.props;
    if ((prevProps.wallet.isOpen !== wallet.isOpen) && wallet.isOpen) {
      this.reloadTokens();
      this.loadAccount();
    }
  }

  loadAccount = async () => {
    let {loadRecentTransactions, currentWallet} = this.props;
    loadRecentTransactions(currentWallet.address);

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

    Client.getIssuedAsset(currentWallet.address).then(({token}) => {
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

    tokenBalances = filter(tokenBalances, tb => tb.name.toUpperCase() !== "TRX");

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
                <TokenLink name={token.name} />
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

    let { currentWallet } = this.props;

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
                      <div className="progress-bar bg-primary" style={{width: currentWallet.bandwidth.freeNetPercentage + '%'}}/>
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
                      <div className="progress-bar bg-primary" style={{width: currentWallet.bandwidth.netPercentage + '%'}}/>
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

    let {wallet} = this.props;

    return (
      <Transactions
        theadClass="thead-light"
        showTotal={false}
        autoRefresh={30000}
        EmptyState={() => <p className="text-center">No transactions yet</p>}
        filter={{address: wallet.current.address, limit: 10}}/>
    )
  }

  showFreezeBalance = () => {

    let {trxBalance} = this.props;

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
          onHide={this.hideModal}
          onConfirm={({amount}) => this.showFreezeConfirmation(amount)}
        />
      )
    });
  };

  hideModal = () => {
    this.setState({modal: null});
  };

  showUnfreezeModal = async () => {
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
          confirmBtnText="Unfreeze Assets"
          confirmBtnBsStyle="danger"
          cancelBtnBsStyle="default"
          title="Are you sure you want to unfreeze unlocked tokens?"
          onConfirm={this.unfreezeAssets}
          onCancel={this.hideModal}
        >
        </SweetAlert>
      )
    })
  };

  claimRewards = async () => {

    let {currentWallet} = this.props;

    let {success, code} = await Client.withdrawBalance(currentWallet.address)(currentWallet.key);
    if (success) {
      this.setState({
        modal: (
          <SweetAlert success title="Rewards Claimed!" onConfirm={this.hideModal}>
            Successfully claimed rewards
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        modal: (
          <SweetAlert danger title="Could not claim rewards" onConfirm={this.hideModal}>
            Something went wrong while trying to claim rewards, please try again later.<br/>
            {code}
          </SweetAlert>
        )
      });
    }
  };

  unfreeze = async () => {
    let {currentWallet} = this.props;

    this.hideModal();

    let {success} = await Client.unfreezeBalance(currentWallet.address)(currentWallet.key);
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
    let {currentWallet} = this.props;

    this.hideModal();

    let {success} = await Client.unfreezeAssets(currentWallet.address)(currentWallet.key);
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
    let {currentWallet} = this.props;
    let {success} = await Client.updateAccountName(currentWallet.address, name)(currentWallet.key);

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
    let {currentWallet} = this.props;
    let {success} = await Client.updateWitnessUrl(currentWallet.address, url)(currentWallet.key);

    if (success) {
      this.setState({
        modal: (
          <SweetAlert success title="URL changed" onConfirm={this.hideModal}>
            Successfully changed website to <b>{url}</b>
          </SweetAlert>
        )
      });

      setTimeout(() => this.props.reloadWallet(), 1000);
    } else {
      this.setState({
        modal: (
          <SweetAlert warning title="Unable to change URL" onConfirm={this.hideModal}>
            Something went wrong while updating the website, please try again later
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
          onCancel={this.hideModal} />
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
          confirmBtnText="Link Github"
          title="Link to Github"
          placeHolder="github username or https://github.com/{username}/tronsr-template"
          onCancel={this.hideModal}
          validationMsg="You must enter a URL"
          onConfirm={ async (name) => {
            if (await this.detectGithubUrl(name)) {
              this.setState({
                modal: (
                  <SweetAlert success title="Github linked!" onConfirm={this.hideModal}>
                    Successfully linked to Github!
                  </SweetAlert>
                )
              });
            } else {
              this.setState({
                modal: (
                  <SweetAlert
                    danger
                    showCancel
                    title="Could not link Github"
                    onCancel={this.hideModal}
                    onConfirm={this.changeGithubURL}>
                    Could not link to Github, make sure your username is correct!
                  </SweetAlert>
                )
              });
            }
          }}>
          Input your Github username
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
        console.log("trying ", url);
        await xhr.get(url);
        await this.updateGithubURL(input);
        return true;
      } catch(e) {

      }
    }

    return false;
  };

  updateGithubURL = async (url) => {

    let {currentWallet} = this.props;
    let key = await Client.auth(currentWallet.key);

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
          title="Change Website"
          placeHolder="https://"
          onCancel={this.hideModal}
          validationMsg="You must enter a URL"
          onConfirm={(name) => this.updateWebsite(name)}>
          Please specify the URL
        </SweetAlert>
      )
    });
  };

  applyForDelegate = () => {
    this.setState({
      modal: (
        <ApplyForDelegate
          onCancel={this.hideModal}
          onConfirm={() => {
            setTimeout(() => this.props.reloadWallet(), 1200);
            this.setState({
              modal: (
                <SweetAlert success title="Success" onConfirm={this.hideModal}>
                  Successfully applied to be Super Representative Candidate.<br/>
                  Your account will be upgraded shortly.
                </SweetAlert>
              )
            });
          }}/>
      )
    })
  };

  showQrCode = () => {

    let { currentWallet } = this.props;


    this.setState({
      modal: (
        <Modal className="modal-dialog-centered animated zoomIn" fade={false} isOpen={true} toggle={this.hideModal} >
          <ModalHeader toggle={this.hideModal}/>
          <ModalBody className="text-center p-0" onClick={this.hideModal}>
            <QRImageCode value={currentWallet.address} size={500} style={{width: '100%'}} />
          </ModalBody>
        </Modal>
      )
    });
  };

  render() {

    let {modal, sr, issuedAsset, showBandwidth} = this.state;
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
              <WidgetIcon className="fa fa-tachometer-alt" style={styles.iconEntropy} />
              <div className="card-body">
                <h3 className="text-secondary">
                  <FormattedNumber value={currentWallet.bandwidth.netRemaining} />
                </h3>
                <a href="javascript:;" onClick={() => this.setState(state => ({ showBandwidth: !state.showBandwidth }))}>
                  {tu("bandwidth")}
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-3 mt-md-0">
            <div className="card h-100 text-center widget-icon">
              <i className="icon-big fa fa-bolt fa-10x" style={{color: '#ffc107'}}/>
              <div className="card-body">
                <h3 className="text-warning">
                  <FormattedNumber value={currentWallet.frozenTrx / ONE_TRX} />
                </h3>
                {tu("Tron Power")}
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-3 mt-md-0">
            <div className="card h-100 widget-icon">
              <img src={require("../../images/tron-icon.svg")} style={styles.tronBalance}/>
              <div className="card-body text-center">
                <h3 className="text-danger">
                  <TRXPrice amount={currentWallet.balance / ONE_TRX} />
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
              <table className="table m-0">
                <tbody>
                {
                  wallet.isOpen &&
                    <tr>
                      <th>{tu("name")}:</th>
                      <td>
                        {currentWallet.name || "-"}
                        {
                          (trim(currentWallet.name) === "" && currentWallet.balance > 0) &&
                            <a href="javascript:" className="float-right text-primary" onClick={this.changeName}>
                              {tu("set_name")}
                            </a>
                        }
                      </td>
                    </tr>
                }
                {
                  currentWallet.representative.enabled &&
                    <tr>
                      <th>{tu("Website")}:</th>
                      <td>
                        <a href={currentWallet.representative.url}>{currentWallet.representative.url}</a>
                        <a href="javascript:" className="float-right text-primary" onClick={this.changeWebsite}>
                          Change Website
                        </a>

                      </td>
                    </tr>
                }
                <tr>
                  <th>{tu("address")}:</th>
                  <td>
                    <AddressLink address={currentWallet.address} includeCopy={true}/><br/>
                    <span className="text-danger">
                      ({tu("do_not_send_2")})
                    </span>
                    <a href="javascript:" className="float-right text-primary" onClick={this.showQrCode}>
                      {tu("show_qr_code")}
                    </a>
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
                          <TokenLink name={issuedAsset.name} />
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("start_date")}:</th>
                        <td>
                          <FormattedDate value={issuedAsset.startTime} />{' '}
                          <FormattedTime value={issuedAsset.startTime} />
                        </td>
                      </tr>
                      <tr>
                        <th>{tu("end_date")}:</th>
                        <td>
                          <FormattedDate value={issuedAsset.endTime} />{' '}
                          <FormattedTime value={issuedAsset.endTime} />
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
                            <th>{tu("Frozen Supply")}:</th>
                            <td>
                              <a href="javascript:" className="float-right text-primary" onClick={this.unfreezeAssetsConfirmation}>
                                Unfreeze Assets
                              </a>
                              {
                                issuedAsset.frozen.map(frozen => (
                                  <div>
                                    {frozen.amount} can be unlocked&nbsp;
                                    {
                                      (getTime(addDays(new Date(issuedAsset.startTime), frozen.days)) > getTime(new Date())) &&
                                        <FormattedRelative value={getTime(addDays(new Date(issuedAsset.startTime), frozen.days))} />
                                    }
                                  </div>
                                ))
                              }
                            </td>
                          </tr>
                      }
                    </tbody>
                  </table>
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
                  {tu("Tron Power")}
                </h5>
              </div>
              <div className="card-body text-center pt-0">
                <p className="card-text">
                  {tu("freeze_trx_premessage_0")}<Link to="/votes" className="text-primary">{t("freeze_trx_premessage_link")}</Link><br/>{tu("freeze_trx_premessage_1")}
                </p>
                {
                  hasFrozen &&
                  <button className="btn btn-danger mr-2" onClick={this.showUnfreezeModal}>
                    {tu("unfreeze")}
                    <i className="fa fa-fire ml-2"/>
                  </button>
                }
                <button className="btn btn-dark mr-2" onClick={this.showFreezeBalance}>
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
                      {tu("Super Representative")}
                    </h5>
                    <p className="card-text">
                      As a representative you receive rewards for producing blocks. These rewards
                      can be claimed every 24 hours
                    </p>
                    <button className="btn btn-success mr-2" onClick={this.claimRewards}>
                      Claim Rewards
                      <i className="fa fa-hand-holding-usd ml-2"/>
                    </button>
                  </div>
                  <div className="card-body border-top">
                    <h5 className="card-title text-center">
                      {tu("Landing Page")}
                    </h5>
                    <p className="card-text text-center">
                      Super Representatives can create a landing page on which they
                      can share more information about their team and plans
                    </p>
                    <p className="text-center">
                      <a className="btn btn-primary mr-2" target="_blank" href="https://github.com/tronscan/tronsr-template#readme">
                        Show more Information on how to publish a page
                        <i className="fa fa-question ml-2"/>
                      </a>
                    </p>
                    {
                      !this.hasGithubLink() &&
                        <Fragment>
                          <p className="card-text text-center">
                            Did you already configure your Github template? Then set the URL by using the button below
                          </p>
                          <p className="text-center">
                            <button className="btn btn-dark mr-2" onClick={this.changeGithubURL}>
                              Set Github Link
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
                            <a href={"http://github.com/" + sr.githubLink} target="_blank">{"http://github.com/" + sr.githubLink}</a>
                            <a href="javascript:;" className="float-right text-primary" onClick={this.changeGithubURL}>
                              {tu("Change Github Link")}
                            </a>
                          </td>
                        </tr>
                        <tr>
                          <th>{tu("Representative Page")}</th>
                          <td><Link className="text-primary" to={`/representative/${currentWallet.address}`}>View</Link>
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
                      {tu("Super Representative")}
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="card-text">
                      {tu("apply_for_delegate_predescription")}
                    </p>
                    <button className="btn btn-success mr-2" onClick={this.applyForDelegate}>
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
  loadRecentTransactions,
  reloadWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(Account)

const styles = {
  iconEntropy: {
    right: -100,
  },
  tronBalance: {
    position: 'absolute',
    right: -60,
    bottom: -75,
    height: 200,
  }
};
