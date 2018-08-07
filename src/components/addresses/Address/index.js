/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {NavLink, Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {TokenBalances} from "./TokenBalances";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {TronLoader} from "../../common/loaders";
import Transactions from "../../common/Transactions";
import Votes from "../../common/Votes";
import Transfers from "../../common/Transfers";
import PieReact from "../../common/PieChart";
import xhr from "axios/index";
import {sortBy} from "lodash";
import Blocks from "../../common/Blocks";

class Address extends React.Component {


  constructor({match}) {
    super();

    this.state = {
      candidates: [],
      showQrCode: false,
      loading: true,
      blocksProduced: 0,
      votes: null,
      address: {
        address: "",
        balance: 0,
        tokenBalances: {},
      },
      stats: {
        transactions: 0,
      },
      media: null,
      tabs: {
        transfers: {
          id: "transfers",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("transfers")}</span>,
          cmp: () => (
              <TronLoader>
                {tu("loading_transfers")}
              </TronLoader>
          )
        },
        transactions: {
          id: "transactions",
          icon: "fas fa-handshake",
          path: "/transactions",
          label: <span>{tu("transactions")}</span>,
          cmp: () => (
              <TronLoader>
                {tu("loading_transactions")}
              </TronLoader>
          )
        },
      },
    };
  }

  componentDidMount() {
    let {match} = this.props;

    this.loadAddress(match.params.id);
    this.loadVotes(match.params.id);
    this.loadWitness();
  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadAddress(match.params.id);
    }
  }

  componentWillUnmount() {
    // this.live && this.live.close();
  }

  async loadVotes(address) {
    let votes = await xhr.get("https://api.tronscan.org/api/vote?sort=-votes&limit=40&start=0&candidate=" + address);

    let data = votes.data.data.slice(0, 10);
    let totalVotes = votes.data.totalVotes;
    for (let d in data) {
      data[d].name = data[d].voterAddress;
      data[d].value = ((data[d].votes / totalVotes) * 100).toFixed(3);
    }
    this.setState({votes: data});

  }

  async loadMedia(address) {
    try  {
      let media = await Client.getAddressMedia(address);
      if (media.success) {
        this.setState({
          media: {
            image: media.image,
          }
        });
      }
   } catch(e) {}
  }

  async loadAddress(id) {

    this.setState({loading: true, address: {address: id}, media: null,});

    // this.live = channel("/address-" + id);
    // this.live.on('transfer', transaction => {
    //   console.log("NEW TRANSACTION!", transaction);
    // });

    let address = await Client.getAddress(id);

    if (address.representative.enabled) {
      this.loadMedia(id);
    }

    let stats = await Client.getAddressStats(id);

    let {total: totalProducedBlocks} = await Client.getBlocks({
      producer: id,
      limit: 1,
    });

    this.setState(prevProps => ({
      loading: false,
      address,
      blocksProduced: totalProducedBlocks,
      stats,
      tabs: {
        ...prevProps.tabs,
        transfers: {
          id: "transfers",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("transfers")}</span>,
          cmp: () => <Transfers filter={{address: id}}/>
        },
        transactions: {
          id: "transactions",
          icon: "fas fa-handshake",
          path: "/transactions",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <Transactions filter={{address: id}}/>
        },
        token_balances: {
          id: "token_balances",
          icon: "fa fa-piggy-bank",
          path: "/token-balances",
          label: <span>{tu("token_balances")}</span>,
          cmp: () => <TokenBalances tokenBalances={address.balances}/>,
        },
        blocks_produced: {
          id: "blocks-produced",
          icon: "fa fa-cube",
          path: "/blocks",
          label: <span>{tu("produced_blocks")}</span>,
          cmp: () => <Blocks filter={{producer: id}} />,
        },
        votes: {
          id: "votes",
          icon: "fa fa-bullhorn",
          path: "/votes",
          label: <span>{tu("votes")}</span>,
          cmp: () => <Votes
            filter={{voter: id}}
            showVoter={false}
            showVoterPercentage={false}
          />,
        },
        voters: {
          id: "voters",
          icon: "fa fa-bullhorn",
          path: "/voters",
          label: <span>{tu("voters")}</span>,
          cmp: () => <Votes
            filter={{candidate: id}}
            showCandidate={false}
          />,
        },
      }
    }));
  }

  async loadWitness() {
    let {witnesses} = await Client.getWitnesses();
    let votes = await Client.getLiveVotes();

    let candidates = witnesses.map(c => ({
      ...c,
      votes: 0,
    }));
    candidates = candidates.map(c => ({
      ...c,
      votes: (votes[c.address] ? votes[c.address].votes : 0),
    }));

    let newCandidates = sortBy(candidates, c => c.votes * -1).map((c, index) => ({
      ...c,
      rank: index + 1,
    }));

    this.setState({
      candidates: newCandidates
    });

  }

  render() {

    let {address, tabs, stats, loading, blocksProduced, media, votes, candidates} = this.state;
    let {match} = this.props;
    let rank;
    let totalVotes;
    let producer;
    for (let can in candidates) {
      if (address.address === candidates[can].address) {
        rank = candidates[can].rank;
        totalVotes = candidates[can].votes;
        producer = candidates[can].producer;
      }
    }

    if (!address) {
      return null;
    }

    return (
      <main className="container header-overlap">
        <div className="row">
          <div className="col-md-12 ">
            {
              loading ? <div className="card">
                  <TronLoader>
                    {tu("loading_address")} {address.address}
                  </TronLoader>
                </div> :
                <Fragment>
                  <div className="card">
                    {
                      address.representative.enabled && !producer &&
                      <div className="card-header text-center bg-info font-weight-bold text-white">
                        {tu("representatives")}
                      </div>
                    }
                    {
                      address.representative.enabled && producer &&
                      <div className="card-header text-center bg-danger font-weight-bold text-white">
                        {tu("representatives")}
                      </div>
                    }
                    {
                      media &&
                      <div className="card-body">
                        <div className="text-center">
                          <img style={{maxWidth: '100%'}} src={media.image}/>
                        </div>
                      </div>
                    }
                    <div className="row">
                      <div className="col-md-12">
                        <table className="table m-0">
                          <tbody>
                          {
                            rank &&
                            <tr>
                              <th>{tu("rank_real_time")}:</th>
                              <td>
                                {rank}
                              </td>
                            </tr>
                          }
                          {
                            address.representative.enabled &&
                            <Fragment>
                              {
                                address.name &&
                                <tr>
                                  <th>{tu("name")}:</th>
                                  <td>
                                    {address.name}
                                  </td>
                                </tr>
                              }
                              <tr>
                                <th>{tu("website")}:</th>
                                <td>
                                  <ExternalLink url={address.representative.url}/>
                                </td>
                              </tr>
                              <tr>
                                <th>{tu("blocks_produced")}:</th>
                                <td>
                                  <FormattedNumber value={blocksProduced}/>
                                </td>
                              </tr>
                            </Fragment>
                          }
                          <tr>
                            <th>{tu("address")}:</th>
                            <td>
                              <AddressLink address={address.address} includeCopy={true}/>
                            </td>
                          </tr>

                          <tr>
                            <th>{tu("transfers")}:</th>
                            <td>
                              <i className="fa fa-arrow-down text-success"/>&nbsp;
                              <span>{stats.transactions_in}</span>&nbsp;
                              <i className="fa fa-arrow-up  text-danger"/>&nbsp;
                              <span>{stats.transactions_out}</span>&nbsp;
                            </td>
                          </tr>
                          <tr>
                            <th>{tu("balance")}:</th>
                            <td>
                              <ul className="list-unstyled m-0">
                                <li>
                                  <TRXPrice amount={address.balance / ONE_TRX}/>
                                </li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <th>{tu("tron_power")}:</th>
                            <td>
                              <ul className="list-unstyled m-0">
                                <li>
                                  <FormattedNumber value={address.frozen.total / ONE_TRX}/>
                                </li>
                              </ul>
                            </td>
                          </tr>
                          {
                            totalVotes &&
                            <tr>
                              <th>{tu("total_votes")}:</th>
                              <td>
                                <ul className="list-unstyled m-0">
                                  <li>
                                    <FormattedNumber value={totalVotes}/>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          }
                          </tbody>
                        </table>
                      </div>
                      {
                        /*
                        <div className={address.representative.enabled ? 'col-md-6 mt-3 mt-md-0' : ''}>
                          {
                          address.representative.enabled && votes.length &&
                          <h4 className="text-center mt-3">Top {votes.length} {tu("voters")} {tu("addresses")}</h4>
                        }
                          {
                          address.representative.enabled &&
                        <PieReact style={{height: 340}} data={votes}/>
                        }
                        </div>
                       */
                      }
                    </div>
                  </div>
                  <div className="card mt-3">
                    <div className="card-header">
                      <ul className="nav nav-tabs card-header-tabs">
                        {
                          Object.values(tabs).map(tab => (
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
                          Object.values(tabs).map(tab => (
                            <Route key={tab.id} exact path={match.url + tab.path}
                                   render={(props) => (<tab.cmp block={address}/>)}/>
                          ))
                        }
                      </Switch>
                    </div>
                  </div>
                </Fragment>
            }
          </div>
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {


  return {};
}

const mapDispatchToProps = {};

// export default connect(mapStateToProps, mapDispatchToProps)(Address);
export default Address;
