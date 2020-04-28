import { Client } from "../../services/api";
import { tu } from "../../utils/i18n";
import React, { Fragment } from "react";
import { AddressLink } from "../common/Links";
import { FormattedNumber, injectIntl } from "react-intl";
import { filter, isNaN, sumBy, trim } from "lodash";
import Countdown from "react-countdown-now";
import { Sticky, StickyContainer } from "react-sticky";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import { BarLoader, TronLoader } from "../common/loaders";
import { QuestionMark } from "../common/QuestionMark";
import SweetAlert from "react-bootstrap-sweetalert";
import { ONE_TRX, IS_MAINNET } from "../../constants";
import { login } from "../../actions/app";
import { reloadWallet } from "../../actions/wallet";
import { Link } from "react-router-dom";
import palette from "google-palette";
import { Truncate } from "../common/text";
import { withTimers } from "../../utils/timing";
import { loadVoteTimer } from "../../actions/votes";
import {
  transactionResultManager,
  transactionResultManagerSun
} from "../../utils/tron";
import Lockr from "lockr";
import { withTronWeb } from "../../utils/tronWeb";
import FreezeBalanceModal from "../../components/account/FreezeBalanceModal";

function VoteChange({ value, arrow = false }) {
  if (value > 0) {
    return (
      <span style={{color: '#69c265'}}>
        <span className="mr-1">+<FormattedNumber value={value} /></span>
        {arrow && <i className="fa fa-arrow-up" />}
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="text-danger">
        <span className="mr-1"><FormattedNumber value={value} /></span>
        {arrow && <i className="fa fa-arrow-down" />}
      </span>
    );
  }

  return <span>-</span>;
}

function SortDom({type}){
  return (
    <div className="sort-wrap">
      <i className={`up ${type == 'asc' && 'active'}`}></i>
      <i className={`down ${type == 'desc' && 'active'}`}></i>
    </div>
  )
}

@withTronWeb
@injectIntl
@withTimers
@connect(
  state => ({
    account: state.app.account,
    tokenBalances: state.account.tokens,
    wallet: state.wallet,
    flags: state.app.flags,
    voteList: state.voting.voteList,
    voteTimer: state.voting.voteTimer,
    walletType: state.app.wallet,
    isRightText: state.app.isRightText,
    currentWallet: state.wallet.current,
  }),
  {
    login,
    reloadWallet,
    loadVoteTimer
  }
)
export default class VoteOverview extends React.Component {
  constructor() {
    super();
    this.state = {
      privateKey: "",
      votingEnabled: false,
      votesSubmitted: false,
      submittingVotes: false,
      loading: false,
      votes: {},
      searchCriteria: "",
      modal: null,
      viewStats: false,
      colors: palette("mpn65", 20),
      votesList: {},
      liveVotes: null,
      goSignedIn: false,
      lastSort: '',
      realSort: 'asc',
    };
  }

  setVote = (address, numberOfVotes) => {
    let { votes } = this.state;

    if (numberOfVotes !== "") {
      numberOfVotes = parseInt(numberOfVotes, 10);
      numberOfVotes = isNaN(numberOfVotes) ? "" : numberOfVotes;

      if (numberOfVotes < 0) {
        numberOfVotes = 0;
      }
    }

    let { votesAvailable } = this.getVoteStatus();
    votesAvailable += votes[address] || 0;

    if (numberOfVotes > votesAvailable) {
      numberOfVotes = votesAvailable;
    }

    votes[address] = numberOfVotes;

    this.setState({
      votes
    });
  };

  getVoteStatus = () => {
    let { wallet } = this.props;
    let { votes } = this.state;

    let trxBalance = 0;

    if (wallet.isOpen) {
      trxBalance = wallet.current.frozenTrx / ONE_TRX;
    }

    let votesSpend = sumBy(
      Object.values(votes),
      vote => parseInt(vote, 10) || 0
    );

    let votesAvailable = trxBalance - votesSpend;
    let spendAll = votesSpend > 0 && votesAvailable === 0;

    let voteState = 0;

    if (votesAvailable > 0) {
      voteState = 1;
    } else if (votesAvailable < 0) {
      voteState = -1;
    }

    if (trxBalance === 0 || votesAvailable === 0) {
      voteState = -2;
    }

    return {
      trxBalance,
      votesSpend,
      votesAvailable,
      spendAll,
      voteState,
      votePercentage: (votesSpend / trxBalance) * 100
    };
  };

  enableVoting = () => {
    this.setState({
      votingEnabled: true
    });
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.account.isLoggedIn &&
      this.props.account.address !== prevProps.account.address
    ) {
      this.loadCurrentVotes(this.props.account.address);
    }
  }

  async componentDidMount() {
    let { account } = this.props;
    if (account.isLoggedIn) {
      this.props.reloadWallet();
      this.loadCurrentVotes(account.address);
    }
    await this.loadVotes();
    await this.loadVoteTimer();
  }

  loadVoteList = async () => {
    let votesList = await Client.getVotesList();
    this.setState({
      votesList
    });
  };

  loadVoteTimer = async () => {
    this.props.loadVoteTimer();
  };

  loadVotes = async () => {
    let { voteList } = this.props;

    if (voteList.length === 0) {
      this.setState({ loading: true });
    }
    await this.loadVoteList();
    this.setState({ loading: false });
  };

  loadCurrentVotes = async address => {
    let { votes } = await Client.getAccountVotes(address);

    this.setState({
      votes
    });
  };

  renderVoteStatus() {
    let { votesAvailable, voteState } = this.getVoteStatus();
    const { isRightText } = this.props;
    switch (voteState) {
      case 0:
        return (
          <span className="text-success">
            {tu(" ")}
          </span>
        );

      case 1:
        return (
          <span>
            {tu("vote_overview_available_votes")}:&nbsp;
            <b>
              <FormattedNumber value={votesAvailable} />
            </b>
          </span>
        );

      case -1:
        return (
          <span className="text-danger">{tu("to_much_votes_massage")}</span>
        );

      case -2:
        return (
          <span className={
              (isRightText
                ? "d-flex flex-row-reverse justify-content-end"
                : "")}>
            {tu("vote_overview_not_enough_votes")}
            <a  className="text-danger" onClick={this.showFreezeBalance} href="javascript:;">{tu('vote_overview_to_freeze')}</a>
          </span>
        );
    }
  }

  onSearchChange = searchCriteria => {
    this.setState({
      searchCriteria: trim(searchCriteria)
    });
  };

  renderVotingBar() {
    let { votingEnabled, votesSubmitted, submittingVotes } = this.state;
    let { intl, account, isRightText } = this.props;
    let { trxBalance } = this.getVoteStatus();

    if (!account.isLoggedIn) {
      return (
        this.renderVotingBarFalse()
        // <div className="text-center">
        //   {tu("open_wallet_start_voting_message")}
        // </div>
      );
    }

    if (votesSubmitted) {
      return (
        <Alert color="success" className="text-center m-0">
          {tu("thanks_submitting_vote_message")}
        </Alert>
      );
    }

    // if (votingEnabled && trxBalance <= 0) {
    //   return (
    //     <div className="text-center">
    //       {tu("warning_votes")}{" "}
    //       <Link to="/account" className="text-primary">
    //         {tu("account_page")}
    //       </Link>
    //     </div>
    //   );
    // }

    if (submittingVotes) {
      return (
        <div
          className="d-flex justify-content-center p-3"
          style={{ lineHeight: "36px" }}
        >
          <BarLoader width={160} />
        </div>
      );
    }
    if (votingEnabled) {
      return (
        <div className="d-flex justify-content-between vote-overview-action">
          {/* <div className="d-flex">
            <div style={{ width: "35px", height: "35px", paddingLeft: "10px" }}>
              <i className="fa fa-search"></i>
            </div>
            <input
              style={{ background: "#F3F3F3" }}
              type="text"
              className="form-control"
              placeholder={intl.formatMessage({ id: "search" })}
              onChange={ev => this.onSearchChange(ev.target.value)}
            />
          </div> */}
          {this.searchRender()}
          <div className={`vote-overview-action-status ${isRightText && 'is-right'}`}>{this.renderVoteStatus()}</div>
          <div className="">
            <button
              className="btn action-btn red"
              onClick={this.cancelVotes}
            >
              {tu("cancel")}
            </button>
            <button
              className="btn action-btn yellow"
              onClick={this.resetVotes}
            >
              {tu("reset")}
            </button>
            <button
              className="btn action-btn green"
              onClick={this.submitVotes}
              disabled={trxBalance <= 0 ? true : false}
            >
              {tu("voting")}
            </button>
          </div>
        </div>
      );
    }

    return (
      // <div className="text-center">
      //   <a
      //     className=""
      //     onClick={this.enableVoting}
      //     style={{ color: "#C23631" }}
      //   >
      //     {tu("click_to_start_voting")}
      //   </a>
      // </div>
      this.renderVotingBarFalse()
    );
  }
  renderVotingBarFalse() {
    let { intl, account } = this.props;
    let { goSignedIn } = this.state;
    // if (!account.isLoggedIn) {
      return (
        <div className="text-center d-flex justify-content-between align-items-center ">
          {this.searchRender()}
          {/* {goSignedIn ? (
            <span style={{ color: "#333333" }}>{tu("not_signed_in")}</span>
          ) : (
            <a href="javascript:;" onClick={this.notSignedIn}>
              {tu("click_to_start_voting")}
            </a>
          )} */}
          <button
              className="btn action-btn green"
              onClick={this.checkVote}
            >
              {tu("voting")}
            </button>
        </div>
      );
    // }
  }
  searchRender = () => {
    let { intl } = this.props;
    return(
      <div className="d-flex vote-overview-search">
        <input
          type="text"
          placeholder={intl.formatMessage({ id: "vote_overview_search_placeholder" })}
          onChange={ev => this.onSearchChange(ev.target.value)}
        /><button>
          <i className="fa fa-search"></i>
        </button>
      </div>
    )
  }
  isLoggedIn = (type) => {
    let { account, intl } = this.props;
    if (!account.isLoggedIn){
        if(type != 1){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu('proposal_not_sign_in')}
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({ modal: null })}
                    // style={{ marginLeft: '-240px', marginTop: '-195px' }}
                >
                </SweetAlert>
            });
        }
        
    }
    return account.isLoggedIn;
  };

  showFreezeBalance = () => {

    let {privateKey} = this.state;

    let {currentWallet} = this.props;
    if (currentWallet.balance === 0) {
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
                          {tu('freeze_TRX_error')}
                      </SweetAlert>
                  )
                });
              }}
              onConfirm={({amount}) => this.showFreezeConfirmation(amount)}
          />
      )
    });
  };

  showFreezeConfirmation = (amount) => {
    this.setState({
      modal: (
          <SweetAlert success title={tu("tokens_frozen")} onConfirm={this.hideModal}>
            <p>{tu("successfully_frozen")} {amount} TRX</p>
            <p>{tu('freeze_modal_success_msg')}</p>
          </SweetAlert>
      )
    });

    setTimeout(() => this.props.reloadWallet(), 1000);
  };

  checkVote = () => {
    // this.setState({
    //   goSignedIn: true
    // });
    if (!this.isLoggedIn()) {
      return;
    }
    this.setState({
      votingEnabled: true
    });
  };
  resetVotes = () => {
    this.setState({
      votes: {}
    });
  };

  cancelVotes = () => {
    this.loadCurrentVotes(this.props.account.address);
    this.setState({
      votingEnabled: false,
      searchCriteria: ""
    });
  };

  hideModal = () => {
    this.setState({
      modal: null
    });
  };

  submitVotes = async () => {
    let { account } = this.props;
    let { votes } = this.state;
    let res;
    this.setState({ submittingVotes: true });
    let witnessVotes = {};
    const tronWebLedger = this.props.tronWeb();
    const { tronWeb, sunWeb } = this.props.account;
    for (let address of Object.keys(votes)) {
      if (votes[address] != "") {
        witnessVotes[address] = parseInt(votes[address], 10);
      }
    }
    if(this.props.walletType.type === "ACCOUNT_LEDGER" && Object.keys(witnessVotes).length > 5){
      this.setState({
        votesSubmitted: false,
        submittingVotes: false,
        votingEnabled: true,
        modal: (
          <SweetAlert warning title={tu("error")} onConfirm={this.hideModal}>
            {tu("votes_cannot_exceed_5_SRs")}
          </SweetAlert>
        )
      });
      return;
    }
    if (IS_MAINNET) {
      if (this.props.walletType.type === "ACCOUNT_LEDGER") {
        try {
          const unSignTransaction = await tronWebLedger.transactionBuilder
            .vote(witnessVotes, account.address)
            .catch(e => false);
          const { result } = await transactionResultManager(
            unSignTransaction,
            tronWebLedger
          );
          res = result;
        } catch (e) {
          console.error("error", e);
        }
      } else if (this.props.walletType.type === "ACCOUNT_PRIVATE_KEY") {
        let { success } = await Client.voteForWitnesses(
          account.address,
          witnessVotes
        )(account.key);
        res = success;
      } else if (this.props.walletType.type === "ACCOUNT_TRONLINK") {
        try {
          const unSignTransaction = await tronWeb.transactionBuilder
            .vote(witnessVotes, account.address)
            .catch(e => {
              console.error(e);
            });
          const { result } = await transactionResultManager(
            unSignTransaction,
            tronWeb
          );
          res = result;
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      if (
        this.props.walletType.type === "ACCOUNT_PRIVATE_KEY" ||
        this.props.walletType.type === "ACCOUNT_TRONLINK"
      ) {
        try {
          const unSignTransaction = await sunWeb.sidechain.transactionBuilder
            .vote(witnessVotes, account.address)
            .catch(e => false);
          const { result } = await transactionResultManagerSun(
            unSignTransaction,
            sunWeb
          );
          res = result;
        } catch (e) {
          console.error(e);
        }
      }
    }

    if (res) {
      setTimeout(() => this.props.reloadWallet(), 1200);
      setTimeout(() => this.setState({ votesSubmitted: false }), 5000);

      this.setState({
        votesSubmitted: true,
        submittingVotes: false,
        votingEnabled: false,
        modal: (
          <SweetAlert
            success
            title={tu("submissing_vote_message_title")}
            onConfirm={this.hideModal}
          >
            {tu("submissing_vote_message_0")}
            <br />
            {tu("submissing_vote_message_1")}
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        votesSubmitted: false,
        submittingVotes: false,
        votingEnabled: false,
        modal: (
          <SweetAlert danger title={tu("error")} onConfirm={this.hideModal}>
            {tu("submitting_vote_error_message")}
          </SweetAlert>
        )
      });
    }
  };

  getNextCycle() {
    let { voteTimer } = this.props;
    return voteTimer;
  }

  sortFun = (type) => {
    let {
      lastSort,
      realSort,
    } = this.state;
    if(type){
      this.setState({
        lastSort: lastSort == 'asc' ? 'desc' : 'asc',
        realSort: ''
      });
    } else {
      this.setState({
        realSort: realSort == 'asc' ? 'desc' : 'asc',
        lastSort: ''
      });
    }
  }

  render() {
    let {
      votingEnabled,
      votes,
      votesList,
      loading,
      modal,
      viewStats,
      colors,
      searchCriteria,
      lastSort,
      realSort,
    } = this.state;
    let { wallet, isRightText } = this.props;
    let candidates = votesList.data || [];

    let filteredCandidates = candidates.map((v, i) =>
      Object.assign(
        {
          rank: i
        },
        v
      )
    );

    if (searchCriteria !== "") {
      filteredCandidates = filter(candidates, c => {
        // if (c.url && trim(c.url.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
        //   return true;
        // }

        if (
          c.address &&
          trim(c.address.toLowerCase()).indexOf(
            searchCriteria.toLowerCase()
          ) !== -1 || trim(c.name.toLowerCase()).indexOf(
            searchCriteria.toLowerCase()
          ) !== -1 || trim(c.url.toLowerCase()).indexOf(
            searchCriteria.toLowerCase()
          ) !== -1 
        ) {
          return true;
        }

        return false;
      });
    }
    filteredCandidates.sort((a, b) => {
      if(lastSort == 'asc'){
        return a.lastRanking - b.lastRanking
      } else if(lastSort == 'desc'){
        return b.lastRanking - a.lastRanking
      } else if(realSort == 'asc'){
        return a.realTimeRanking - b.realTimeRanking
      } else if(realSort == 'desc'){
        return b.realTimeRanking - a.realTimeRanking
      } 
    })
    let totalVotes = votesList.totalVotes || 0;

    let biggestGainer = votesList.maxVotesRise || {};
    let { trxBalance } = this.getVoteStatus();

    let voteSize = Math.ceil(trxBalance / 20);

    return (
      <main className="container header-overlap _voteOverview vote-overview">
        {modal}
        <div className="row _badge">
          <div className="col-md-4 mt-3 mt-md-0">
            <div className="card h-100 text-left widget-icon bg-line_red bg-image_nextRound">
              <div className="card-body">
                <h3 className="text-primary">
                  <Countdown
                    date={this.getNextCycle()}
                    daysInHours={true}
                    onComplete={() => {
                      this.loadVotes();
                      this.loadVoteTimer();
                    }}
                  />
                </h3>
                {tu("representatives_vote_next_round")}
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-3 mt-md-0 position-relative">
            <div className="card h-100 widget-icon bg-line_green bg-image_totalVotes">
              <div className="card-body text-left">
                <h3 className="text-secondary">
                  <FormattedNumber value={totalVotes} />
                </h3>
                {/*
                  <a href="javascript:"
                     onClick={() => this.setState(state => ({viewStats: !state.viewStats}))}>{tu("total_votes")}</a>
                */}
                {tu("representatives_vote_total")}
              </div>
            </div>
          </div>

          <div className="col-md-4 mt-3 mt-md-0">
            <div className="card h-100 widget-icon bg-line_yellow bg-image_mostRank">
              <div className="card-body text-left">
                <h3 >
                  <VoteChange value={biggestGainer.changeVotes} arrow={true} />
                </h3>
                <div
                  className={
                    (isRightText
                      ? "flex-row-reverse justify-content-end"
                      : "") + " d-flex"
                  }
                  style={{flexWrap: 'wrap', fontSize: '14px'}}
                >
                  <div className="_ranks mr-2" style={{ whiteSpace: "nowrap" }}>
                    {tu("representatives_vote_realtime_votes")}
                  </div>
                  {/* <div>--</div> */}
                  <div
                    className=""
                    style={isRightText ? { maxWidth: "110px" } : {}}
                  >
                    {Math.abs(biggestGainer.changeVotes) ? (
                      <AddressLink address={biggestGainer.address} truncate={false}>
                        <div className="text-truncate">{biggestGainer.name || biggestGainer.url}</div>
                      </AddressLink>
                    ) : (
                      <span style={{ color: "#999999" }}>-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card mt-2">
            <TronLoader>{tu("loading_super_representatives")}</TronLoader>
          </div>
        ) : (
          <div className="row mt-2">
            <div className="col-md-12">
              <StickyContainer>
                <div className="card mt-1">
                  <div className="vote-overview-action-wrap">
                    <Sticky>
                      {({ style }) => (
                        <div
                          style={{
                            borderBottom: "1px solid #D8D8D8",
                            zIndex: 100,
                            padding: '0.75rem',
                            ...style
                          }}
                          className="card-body bg-white "
                        >
                          {this.renderVotingBar()}
                        </div>
                      )}
                    </Sticky>
                    {/* {!wallet.isOpen && (
                      <Sticky>
                        {({ style }) => (
                          <div
                            style={{
                              borderBottom: "1px solid #D8D8D8",
                              zIndex: 100,
                              padding: '0.75rem 1.25rem',
                              ...style
                            }}
                            className="card-body bg-white"
                          >
                            {this.renderVotingBarFalse()}
                          </div>
                        )}
                      </Sticky>
                    )} */}
                  </div>

                  <div className="table-responsive table-scroll">
                    <table className="table vote-table table-hover m-0">
                      <thead className="thead-light">
                        <tr>
                          
                          <th>{tu("name")}</th>
                          <th className="text-center" style={{ width: 50, cursor: 'pointer', position: 'relative' }} onClick={() => this.sortFun(1)}>
                            <div style={{display: 'flex',position: 'relative'}}>
                              {tu("sr_vote_last_ranking")}
                              <SortDom type={lastSort}></SortDom>
                            </div>
                          </th>
                          <th className="text-right" style={{ width: 150 }}>
                            {tu("sr_vote_last_votes")}
                          </th>
                          <th className="text-right" style={{ width: 100 }}>
                            {tu("percentage")}
                            <span className="ml-2">
                              <QuestionMark
                                placement="top"
                                text="sr_vote_percent_note"
                              />
                            </span>
                          </th>
                          <th className="text-right" style={{ width: 50, cursor: 'pointer', color: '#C64844', position: 'relative' }} onClick={() => this.sortFun()}>
                            <div style={{display: 'flex', position: 'relative'}}>
                              {tu("sr_vote_current_ranking")}
                              <SortDom type={realSort}></SortDom>
                            </div>
                          </th>
                          <th className="text-right" style={{ width: 150, color: '#C64844' }}>
                            {tu("sr_vote_current_vote")}
                          </th>
                          
                          <th className="text-right" style={{ width: 150 }}>
                            {tu("SR_voteRatio")}
                            <span className="ml-2">
                              <QuestionMark
                                placement="top"
                                text="voting_brokerage_tip"
                              />
                            </span>
                          </th>
                          {votingEnabled && trxBalance > 0 && (
                            <th style={{ width: 150 }}>{tu("your_vote")}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {searchCriteria.length > 0 &&
                          filteredCandidates.length === 0 && (
                            <tr>
                              <td colSpan="6" className="p-3 text-center">
                                No Super Representatives found for{" "}
                                <b>{searchCriteria}</b>
                              </td>
                            </tr>
                          )}
                        {filteredCandidates.map((candidate, index) => {
                          return (
                            <tr key={candidate.address + "_" + index}>
                              
                              <td className="d-flex flex-row ">
                                <div
                                  className="text-center text-sm-left"
                                  style={{ minWidth: "150px",maxWidth: "300px" }}
                                >
                                  <div className="d-flex flex-row ">
                                    {/* <Truncate> */}
                                    <div style={{flex : '1'}}>
                                      <AddressLink
                                        address={candidate.address}
                                        className="font-weight-bold"
                                      >
                                        {candidate.name || candidate.url}
                                      </AddressLink>
                                    </div>
                                      
                                    {/* </Truncate> */}
                                  </div>
                                  <AddressLink
                                    className="small text-muted"
                                    address={candidate.address}
                                  >{candidate.address}</AddressLink>
                                </div>
                                {!votingEnabled && candidate.hasPage && (
                                  <div className="_team ml-3">
                                    <Link
                                      className="btn btn-sm btn-block btn-default mt-1"
                                      to={`/representative/${candidate.address}`}
                                    >
                                      {tu("sr_vote_team_information")}
                                      {/* <i className="fas fa-users ml-2" /> */}
                                    </Link>
                                  </div>
                                )}
                              </td>
                              {viewStats ? (
                                <th
                                  className="align-middle text-center"
                                  style={{
                                    backgroundColor:
                                      "#" + colors[candidate.rank]
                                  }}
                                >
                                  {candidate.lastRanking}
                                </th>
                              ) : (
                                <td className="small align-middle text-center">
                                  {candidate.lastRanking}
                                </td>
                              )}
                              <td className="small text-right align-middle">
                                {totalVotes > 0 && (
                                  <Fragment>
                                    <FormattedNumber
                                      value={candidate.lastCycleVotes}
                                    />
                                    <br />
                                  </Fragment>
                                )}
                              </td>
                              <td className="small text-right align-middle">
                                {totalVotes > 0 && (
                                  <Fragment>
                                    <FormattedNumber
                                      value={candidate.lastCycleVotesPercentage}
                                      minimumFractionDigits={2}
                                      maximumFractionDigits={2}
                                    />
                                    %
                                  </Fragment>
                                )}
                              </td>
                              <td className={`small align-middle text-center ${candidate.change_cycle > 0 && 'up'} ${candidate.change_cycle < 0 && 'down'}`}>
                                <div>{candidate.realTimeRanking}</div>
                                {candidate.change_cycle != 0 && <div className="text">
                                  <VoteChange value={candidate.change_cycle} arrow={true} />
                                  {/* {candidate.change_cycle > 0 && '+'}{candidate.change_cycle} */}
                                </div>}
                              </td>
                              <td className={`small text-right align-middle _liveVotes ${candidate.changeVotes > 0 && 'up'} ${candidate.changeVotes < 0 && 'down'}`}>
                                {totalVotes > 0 && (
                                  <Fragment>
                                    <FormattedNumber
                                      value={candidate.realTimeVotes}
                                    />
                                    <br />
                                    {/* <span className={candidate.changeVotes > 0
                                                    ? 'color-green'
                                                    : 'color-red'}>
                                                  </span> */}
                                    {candidate.changeVotes > 0 ? (
                                      <span className="text">
                                        +
                                        <FormattedNumber
                                          value={candidate.changeVotes}
                                        />
                                      </span>
                                    ) : (
                                      <span className="text">
                                        <FormattedNumber
                                          value={candidate.changeVotes}
                                        />
                                      </span>
                                    )}
                                  </Fragment>
                                )}
                              </td>
                              
                              <td className="small text-right align-middle">
                                {
                                  <Fragment>
                                    <span>
                                      {candidate.brokerage ||
                                      candidate.brokerage == 0
                                        ? 100 - candidate.brokerage + "%"
                                        : ""}
                                    </span>
                                  </Fragment>
                                }
                              </td>
                              {votingEnabled && trxBalance > 0 && (
                                <td className="vote-input-field">
                                  <div className="input-group"
                                    style={{ minWidth: "100px" }}>
                                    <div className="input-group-prepend">
                                      <button
                                        className="btn btn-outline-danger"
                                        onClick={() =>
                                          this.setVote(
                                            candidate.address,
                                            (votes[candidate.address] || 0) -
                                              voteSize
                                          )
                                        }
                                        type="button"
                                      >
                                        -
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      value={votes[candidate.address] || ""}
                                      className="form-control text-center"
                                      style={{padding: '0 0.25rem'}}
                                      onChange={ev =>
                                        this.setVote(
                                          candidate.address,
                                          ev.target.value
                                        )
                                      }
                                    />
                                    <div className="input-group-append">
                                      <button
                                        className="btn btn-outline-success"
                                        onClick={() =>
                                          this.setVote(
                                            candidate.address,
                                            (votes[candidate.address] || 0) +
                                              voteSize
                                          )
                                        }
                                        type="button"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </StickyContainer>
            </div>
          </div>
        )}
      </main>
    );
  }
}
