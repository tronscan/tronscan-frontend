import {Client} from "../../services/api";
import {tu} from "../../utils/i18n";
import React, {Fragment} from "react";
import {AddressLink} from "../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, isNaN, sortBy, sumBy, trim} from "lodash";
import Countdown from "react-countdown-now";
import {Sticky, StickyContainer} from "react-sticky";
import {connect} from "react-redux";
import {Alert} from "reactstrap";
import {BarLoader, TronLoader} from "../common/loaders";
import SweetAlert from "react-bootstrap-sweetalert";
import {ONE_TRX} from "../../constants";
import {login} from "../../actions/app";
import {reloadWallet} from "../../actions/wallet";
import {Link} from "react-router-dom";
import palette from "google-palette";
import {Truncate} from "../common/text";
import {withTimers} from "../../utils/timing";
import {loadVoteTimer} from "../../actions/votes";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";

function VoteChange({value, arrow = false}) {
  if (value > 0) {
    return (
        <span className="text-success">
        <span className="mr-1">+{value}</span>
          {arrow && <i className="fa fa-arrow-up"/>}
      </span>
    )
  }

  if (value < 0) {
    return (
        <span className="text-danger">
        <span className="mr-1">{value}</span>
          {arrow && <i className="fa fa-arrow-down"/>}
      </span>
    )
  }

  return (
      <span>
      -
    </span>
  )
}

class VoteOverview extends React.Component {

  constructor() {
    super();
    this.state = {
      privateKey: '',
      votingEnabled: false,
      votesSubmitted: false,
      submittingVotes: false,
      loading: false,
      votes: {},
      searchCriteria: "",
      modal: null,
      viewStats: false,
      colors: palette('mpn65', 20),
      votesList: {},
    };
  }

  setVote = (address, numberOfVotes) => {
    let {votes} = this.state;

    if (numberOfVotes !== "") {
      numberOfVotes = parseInt(numberOfVotes, 10);
      numberOfVotes = isNaN(numberOfVotes) ? "" : numberOfVotes;

      if (numberOfVotes < 0) {
        numberOfVotes = 0;
      }
    }

    let {votesAvailable} = this.getVoteStatus();
    votesAvailable += votes[address] || 0;

    if (numberOfVotes > votesAvailable) {
      numberOfVotes = votesAvailable;
    }

    votes[address] = numberOfVotes;

    this.setState({
      votes,
    });
  };

  getVoteStatus = () => {
    let {wallet} = this.props;
    let {votes} = this.state;

    let trxBalance = 0;

    if (wallet.isOpen) {
      trxBalance = wallet.current.frozenTrx / ONE_TRX;
    }

    let votesSpend = sumBy(Object.values(votes), vote => parseInt(vote, 10) || 0);

    let votesAvailable = trxBalance - votesSpend;
    let spendAll = (votesSpend > 0 && votesAvailable === 0);

    let voteState = 0;

    if (votesAvailable > 0) {
      voteState = 1;
    } else if (votesAvailable < 0) {
      voteState = -1;
    }

    if (trxBalance === 0) {
      voteState = -2;
    }

    return {
      trxBalance,
      votesSpend,
      votesAvailable,
      spendAll,
      voteState,
      votePercentage: (votesSpend / trxBalance) * 100,
    };
  };

  enableVoting = () => {
    this.setState({
      votingEnabled: true,
    })
  };

  componentDidUpdate(prevProps) {
    if (this.props.account.isLoggedIn && (this.props.account.address !== prevProps.account.address)) {
      this.loadCurrentVotes(this.props.account.address);
    }
  }

  async componentDidMount() {
    let {account,} = this.props;
    if (account.isLoggedIn) {
      this.props.reloadWallet();
      this.loadCurrentVotes(account.address);
    }
    await this.loadVotes();
    await this.loadVoteTimer();
  }

  loadVoteList = async () => {
    let votesList = await Client.getVotesList()
    this.setState({
      votesList,
    });
  }

  loadVoteTimer = async () => {
    this.props.loadVoteTimer();
  };

  loadVotes = async () => {

    let {voteList} = this.props;
    
    if (voteList.length === 0) {
      this.setState({loading: true});
    }
    await this.loadVoteList();
    this.setState({loading: false});

  };

  loadCurrentVotes = async (address) => {
    let {votes} = await Client.getAccountVotes(address);

    this.setState({
      votes,
    });
  };

  renderVoteStatus() {
    let {votesAvailable, voteState} = this.getVoteStatus();

    switch (voteState) {
      case 0:
        return (
            <span className="text-success">
            {tu("all_votes_are_used_message")}
          </span>
        );

      case 1:
        return (
            <span>
            {tu("votes_remaining_message")}:&nbsp;<b><FormattedNumber value={votesAvailable}/></b>
          </span>
        );

      case -1:
        return (
            <span className="text-danger">
            {tu("to_much_votes_massage")}
          </span>
        );

      case -2:
        return (
            <span className="text-danger">
            {tu("need_min_trx_to_vote_message")}
          </span>
        );
    }
  }

  onSearchChange = (searchCriteria) => {
    this.setState({
      searchCriteria: trim(searchCriteria),
    });
  };

  renderVotingBar() {
    let {votingEnabled, votesSubmitted, submittingVotes} = this.state;
    let {intl, account} = this.props;

    let {trxBalance} = this.getVoteStatus();

    if (!account.isLoggedIn) {
      return (
          <div className="text-center">
            {tu("open_wallet_start_voting_message")}
          </div>
      );
    }

    if (votesSubmitted) {
      return (
          <Alert color="success" className="text-center m-0">
            {tu("thanks_submitting_vote_message")}
          </Alert>
      );
    }

    if (trxBalance <= 0) {
      return (
          <div className="text-center">
            {tu("warning_votes")}{' '}
            <Link to="/account" className="text-primary">{tu("account_page")}</Link>
          </div>
      );
    }

    if (submittingVotes) {
      return (
          <div className="d-flex justify-content-center p-3" style={{lineHeight: '36px'}}>
            <BarLoader width={160}/>
          </div>
      );
    }

    if (votingEnabled) {
      return (
          <div className="d-flex" style={{lineHeight: '36px'}}>
            <div className="d-flex">
              <div style={{width: '35px', height: '35px', paddingLeft: '10px'}}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
              <input style={{background: '#F3F3F3'}} type="text"
                     className="form-control"
                     placeholder={intl.formatMessage({id: 'search'})}
                     onChange={(ev) => this.onSearchChange(ev.target.value)}/>
            </div>
            <div className="ml-auto">
              {this.renderVoteStatus()}
            </div>
            <button className="btn btn-danger ml-auto _cancel" onClick={this.cancelVotes}>{tu("cancel")}</button>
            <button className="btn btn-warning ml-1 _reset" onClick={this.resetVotes}>{tu("reset")}</button>
            <button className="btn btn-success ml-1 _submit" onClick={this.submitVotes}>{tu("submit_votes")}</button>
          </div>
      );
    }

    return (
        <div className="text-center">
          <a className="" onClick={this.enableVoting} style={{color: '#C23631'}}>
            {tu("click_to_start_voting")}
          </a>
        </div>
    );
  }

  resetVotes = () => {
    this.setState({
      votes: {},
    });
  };

  cancelVotes = () => {
    this.loadCurrentVotes(this.props.account.address);
    this.setState({
      votingEnabled: false,
      searchCriteria: "",
    });
  };

  hideModal = () => {
    this.setState({
      modal: null,
    });
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
    let {privateKey} = this.state;
    let {account} = this.props;

    let reConfirm = () => {
      if (this.privateKey.value && this.privateKey.value.length === 64) {
        if (pkToAddress(this.privateKey.value) === account.address)
          this.submitVotes();
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
  submitVotes = async () => {
    let {account} = this.props;
    let {votes, privateKey} = this.state;

    this.setState({submittingVotes: true,});

    let witnessVotes = {};

    for (let address of Object.keys(votes)) {
      witnessVotes[address] = parseInt(votes[address], 10);
    }

    let {success} = await Client.voteForWitnesses(account.address, witnessVotes)(account.key);

    if (success) {
      setTimeout(() => this.props.reloadWallet(), 1200);
      setTimeout(() => this.setState({votesSubmitted: false,}), 5000);

      this.setState({
        votesSubmitted: true,
        submittingVotes: false,
        votingEnabled: false,
        modal: (
            <SweetAlert success title={tu("submissing_vote_message_title")} onConfirm={this.hideModal}>
              {tu("submissing_vote_message_0")}<br/>
              {tu("submissing_vote_message_1")}
            </SweetAlert>
        )
      });
    } else {
      this.setState({
        votesSubmitted: true,
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
    let {voteTimer} = this.props;
    return voteTimer;
  }

  render() {

    let {votingEnabled, votes, votesList, loading, modal, viewStats, colors, searchCriteria} = this.state;
    let {wallet} = this.props;
    let candidates = votesList.data || []
  
    let filteredCandidates = candidates.map((v, i) => Object.assign({
      rank: i
    }, v));

    if (searchCriteria !== "") {
      filteredCandidates = filter(candidates, c => {
        if (trim(c.url.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
          return true;
        }

        if (c.name.length > 0 && trim(c.name.toLowerCase()).indexOf(searchCriteria.toLowerCase()) !== -1) {
          return true;
        }

        return false;
      });
    }

    let totalVotes = votesList.totalVotes || 0;

    let biggestGainer = votesList.fastestRise || {}
    let {trxBalance} = this.getVoteStatus();

    let voteSize = Math.ceil(trxBalance / 20);

    return (
        <main className="container header-overlap _voteOverview">
          {modal}
          <div className="row _badge">
            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 text-left widget-icon bg-line_red bg-image_nextRound">
                <div className="card-body">
                  <h3 className="text-primary">
                    <Countdown date={this.getNextCycle()} daysInHours={true} onComplete={() => {
                      this.loadVotes();
                      this.loadVoteTimer();
                    }}/>
                  </h3>
                  {tu("next_round")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0 position-relative">
              <div className="card h-100 widget-icon bg-line_green bg-image_totalVotes">
                <div className="card-body text-left">
                  <h3 className="text-secondary">
                    <FormattedNumber value={totalVotes}/>
                  </h3>
                  {/*
                  <a href="javascript:"
                     onClick={() => this.setState(state => ({viewStats: !state.viewStats}))}>{tu("total_votes")}</a>
                */}
                  {tu("total_votes")}
                </div>
              </div>
            </div>

            <div className="col-md-4 mt-3 mt-md-0">
              <div className="card h-100 widget-icon bg-line_yellow bg-image_mostRank">
                <div className="card-body text-left">
                  <h3 className="text-success">
                    <VoteChange value={biggestGainer.change_cycle} arrow={true}/>
                  </h3>
                  <div className="d-flex">
                    <div className="_ranks" style={{whiteSpace: 'nowrap'}}>{tu("most_ranks")}--</div>
                    <div className="text-nowrap text-truncate">
                      <AddressLink address={biggestGainer.address}>
                        {biggestGainer.name || biggestGainer.url}
                      </AddressLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
            loading ? <div className="card mt-2">
                  <TronLoader>
                    {tu("loading_super_representatives")}
                  </TronLoader>
                </div> :
                <div className="row mt-2">
                  <div className="col-md-12">
                    <StickyContainer>
                      <div className="card mt-1">
                        {
                          wallet.isOpen &&
                          <Sticky>
                            {
                              ({style}) => (
                                  <div style={{borderBottom: "1px solid #D8D8D8", zIndex: 100, ...style}}
                                       className="card-body bg-white p-2">
                                    {this.renderVotingBar()}
                                  </div>
                              )
                            }
                          </Sticky>
                        }

                        <div className="table-responsive">
                          <table className="table vote-table table-hover m-0">
                            <thead className="thead-light">
                            <tr>
                              <th className="d-none d-sm-table-cell text-center" style={{width: 50}}>#</th>
                              <th>{tu("name")}</th>

                              <th className="text-right" style={{width: 150}}>{tu("votes")}</th>
                              <th className="text-right" style={{width: 150}}>{tu("live")}</th>
                              <th className="text-right" style={{width: 100}}>{tu("percentage")}</th>
                              {
                                votingEnabled && <th style={{width: 200}}>
                                  {tu("your vote")}
                                </th>
                              }
                            </tr>
                            </thead>
                            <tbody>
                            {
                              (searchCriteria.length > 0 && filteredCandidates.length === 0) &&
                              <tr>
                                <td colSpan="6" className="p-3 text-center">
                                  No Super Representatives found for <b>{searchCriteria}</b>
                                </td>
                              </tr>
                            }
                            {
                              filteredCandidates.map(candidate => {
                                    return (

                                        <tr key={candidate.address}>
                                          {
                                            viewStats ?
                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4 text-center"
                                                    style={{backgroundColor: "#" + colors[candidate.rank]}}>
                                                  {candidate.rank + 1}
                                                </th> :
                                                <th className="font-weight-bold d-none d-sm-table-cell pt-4 text-center">
                                                  {candidate.rank + 1}
                                                </th>
                                          }
                                          <td className="d-flex flex-column flex-sm-row ">
                                            <div className="text-center text-sm-left">
                                              <Truncate>
                                                <AddressLink address={candidate.address}
                                                             className="font-weight-bold">{candidate.name || candidate.url}</AddressLink>
                                              </Truncate>
                                              <AddressLink className="small text-muted" address={candidate.address}/>
                                            </div>
                                            {
                                              candidate.hasPage && <div className="_team ml-0 ml-sm-auto">
                                                <Link className="btn btn-lg btn-block btn-default mt-1"
                                                      to={`/representative/${candidate.address}`}>
                                                  {tu("open_team_page")}
                                                  <i className="fas fa-users ml-2"/>
                                                </Link>
                                              </div>
                                            }
                                          </td>
                                          <td className="small text-right align-middle">
                                            {
                                              totalVotes > 0 &&
                                              <Fragment>
                                                <FormattedNumber value={candidate.lastCycleVotes}/><br/>
                                              </Fragment>
                                            }
                                          </td>
                                          <td className="small text-right align-middle _liveVotes">
                                            {
                                              totalVotes > 0 &&
                                              <Fragment>
                                                <FormattedNumber value={candidate.realTimeVotes}/><br/>
                                                  {/* <span className={candidate.changeVotes > 0
                                                    ? 'color-green'
                                                    : 'color-red'}>
                                                  </span> */}
                                                {(candidate.changeVotes > 0) ?
                                                    <span className="color-green">+<FormattedNumber
                                                        value={candidate.changeVotes}/></span>
                                                    : <span className="color-red"><FormattedNumber
                                                        value={candidate.changeVotes}/></span>
                                                }
                                              </Fragment>
                                            }
                                          </td>
                                          <td className="small text-right align-middle">
                                            {
                                              totalVotes > 0 &&
                                              <Fragment>
                                                <FormattedNumber value={candidate.votesPercentage}
                                                                 minimumFractionDigits={2}
                                                                 maximumFractionDigits={2}
                                                />%
                                              </Fragment>
                                            }
                                          </td>
                                          {
                                            votingEnabled && <td className="vote-input-field">
                                              <div className="input-group">
                                                <div className="input-group-prepend">
                                                  <button className="btn btn-outline-danger"
                                                          onClick={() => this.setVote(candidate.address, (votes[candidate.address] || 0) - voteSize)}
                                                          type="button">-
                                                  </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={votes[candidate.address] || ""}
                                                    className="form-control form-control-sm text-center"
                                                    onChange={(ev) => this.setVote(candidate.address, ev.target.value)}/>
                                                <div className="input-group-append">
                                                  <button className="btn btn-outline-success"
                                                          onClick={() => this.setVote(candidate.address, (votes[candidate.address] || 0) + voteSize)}
                                                          type="button">+
                                                  </button>
                                                </div>
                                              </div>
                                            </td>
                                          }
                                        </tr>
                                    )
                                  }
                              )
                            }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </StickyContainer>
                  </div>
                </div>
          }

        </main>
    );
  }
}


function mapStateToProps(state) {
  return {
    account: state.app.account,
    tokenBalances: state.account.tokens,
    wallet: state.wallet,
    flags: state.app.flags,
    voteList: state.voting.voteList,
    voteTimer: state.voting.voteTimer,
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
  loadVoteTimer,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTimers(injectIntl(VoteOverview)))
