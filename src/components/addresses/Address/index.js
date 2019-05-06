/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
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
import TransfersTrc20 from "../../common/TransfersTrc20";
import PieReact from "../../common/PieChart";
import xhr from "axios/index";
import {sortBy, toUpper} from "lodash";
import _ from "lodash";
import Blocks from "../../common/Blocks";
import {channel} from "../../../services/api";
import rebuildList from "../../../utils/rebuildList";
import {API_URL} from '../../../constants.js'
import { FormatNumberByDecimals, FormatNumberByDecimalsBalance } from '../../../utils/number'
import { Progress } from 'antd'


class Address extends React.Component {
  constructor({match}) {
    super();

    this.state = {
      totalPower:0,
      candidates: [],
      showQrCode: false,
      loading: true,
      blocksProduced: 0,
      votes: null,
      rank: 0,
      totalVotes: 0,
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
    this.loadWitness(match.params.id);
  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadAddress(match.params.id);
      this.loadWitness(match.params.id);
    }
  }

  componentWillUnmount() {
    // this.live && this.live.close();
  }

  async loadVotes(address) {
    let votes = await xhr.get("https://api.tronscan.org/api/vote?sort=-votes&limit=40&start=0&candidate=" + address);

    let data = votes.data.data.slice(0, 10);
    let totalVotes = votes.data.totalVotes;
    for (let vote of data) {
      vote.name = vote.voterAddress;
      vote.value = ((vote.votes / totalVotes) * 100).toFixed(3);
    }
    this.setState({votes: data});

  }

  async loadMedia(address) {
    return
    try {
      let media = await Client.getAddressMedia(address);
      if (media.success) {
        this.setState({
          media: {
            image: media.image,
          }
        });
      }
    } catch (e) {
    }
  }


  async refreshAddress(id) {
    let {intl} = this.props;
    let address = await Client.getAddress(id);

    if (address.representative.enabled) {
      this.loadMedia(id);
    }

    this.setState(prevProps => ({
      address,
      tabs: {
        ...prevProps.tabs,
        token_balances: {
          id: "token_balances",
          icon: "fa fa-piggy-bank",
          path: "/token-balances",
          label: <span>{tu("token_balances")}</span>,
          cmp: () => <TokenBalances tokenBalances={address.balances} intl={intl}/>,
        },
      }
    }))
  }

  async loadAddress(id) {
    let {intl} = this.props;
    this.setState({loading: true, address: {address: id}, media: null,});

    let address = await Client.getAddress(id);
    if (address.representative.enabled) {
      this.loadMedia(id);
    }
    let tokenBalances = rebuildList(address.tokenBalances, 'name', 'balance')
    let balances = rebuildList(address.balances, 'name', 'balance')

    address.tokenBalances =_(tokenBalances)
      .sortBy(tb => toUpper(tb.map_token_name))
      .sortBy(tb => -tb.map_amount).value();
    address.balances = _(balances)
      .sortBy(tb => toUpper(tb.map_token_name))
      .sortBy(tb => -tb.map_amount).value();

    address.trc20token_balances && address.trc20token_balances.map(item => {
        item.token20_name = item.name + '(' + item.symbol + ')';
        item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
        item.token20_balance_decimals = FormatNumberByDecimalsBalance(item.balance, item.decimals);
        return item
    });
    address.token20List =  _(address.trc20token_balances)
        .filter(tb => tb.balance > 0)
        .sortBy(tb => -tb.balance)
        .value();
    let trxObj1 = _.remove(address.tokenBalances, o => toUpper(o.map_token_name) == 'TRX')[0]
    trxObj1 && address.tokenBalances.unshift(trxObj1)

    let trxObj2 = _.remove(address.balances, o => toUpper(o.map_token_name) == 'TRX')[0]
    trxObj2 && address.tokenBalances.unshift(trxObj2)

    let stats = await Client.getAddressStats(id);

    let {total: totalProducedBlocks} = await Client.getBlocks({
      producer: id,
      limit: 1,
    });
    if (address.representative.enabled) {
      this.setState(prevProps => ({
        loading: false,
        address,
        blocksProduced: totalProducedBlocks,
        stats,
        tabs: {
          // ...prevProps.tabs,
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "",
            label: <span>{tu("transfers")}</span>,
            cmp: () => <Transfers filter={{address: id}} address/>
          },
          transfers20: {
            id: "transfers20",
            // icon: "fa fa-exchange-alt",
            path: "/20transfers",
            label: <span>{tu("20_transfers")}</span>,
            cmp: () => <TransfersTrc20 filter={{address: id}}/>
          },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            cmp: () => <Transactions filter={{address: id}} address/>
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => <Transactions filter={{address: id}} isinternal />
          },
          token_balances: {
            id: "token_balances",
            // icon: "fa fa-piggy-bank",
            path: "/token-balances",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => <TokenBalances tokenBalances={address.balances} intl={intl} token20Balances={address.token20List}/>,
          },
          blocks_produced: {
            id: "blocks-produced",
            // icon: "fa fa-cube",
            path: "/blocks",
            label: <span>{tu("produced_blocks")}</span>,
            cmp: () => <Blocks filter={{producer: id}} intl={intl}/>,
          },
          votes: {
            id: "votes",
            // icon: "fa fa-bullhorn",
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
            // icon: "fa fa-bullhorn",
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
    else {
      this.setState(prevProps => ({
        loading: false,
        address,
        blocksProduced: totalProducedBlocks,
        stats,
        tabs: {
          // ...prevProps.tabs,
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "",
            label: <span>{tu("transfers")}</span>,
            cmp: () => <Transfers filter={{address: id}} address/>
          },
          transfers20: {
            id: "transfers20",
            // icon: "fa fa-exchange-alt",
            path: "/20transfers",
            label: <span>{tu("20_transfers")}</span>,
            cmp: () => <TransfersTrc20 filter={{address: id}}/>
          },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            cmp: () => <Transactions filter={{address: id}} address/>
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => <Transactions filter={{address: id}} isinternal address/>
          },
          token_balances: {
            id: "token_balances",
            // icon: "fa fa-piggy-bank",
            path: "/token-balances",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => <TokenBalances tokenBalances={address.balances} intl={intl} token20Balances={address.token20List}/>,
          },
          votes: {
            id: "votes",
            // icon: "fa fa-bullhorn",
            path: "/votes",
            label: <span>{tu("votes")}</span>,
            cmp: () => <Votes
                filter={{voter: id}}
                showVoter={false}
                showVoterPercentage={false}
            />,
          },
        }
      }));
    }


    let sentDelegateBandwidth = 0;
    if(address.delegated&&address.delegated.sentDelegatedBandwidth) {
      for (let i = 0; i < address.delegated.sentDelegatedBandwidth.length; i++) {
        sentDelegateBandwidth = sentDelegateBandwidth + address.delegated.sentDelegatedBandwidth[i]['frozen_balance_for_bandwidth'];
      }
    }

    let frozenBandwidth=0;
    if(address.frozen.balances.length > 0){
      frozenBandwidth=address.frozen.balances[0].amount;
    }

    let sentDelegateResource=0;
    if(address.delegated&&address.delegated.sentDelegatedResource) {
      for (let i = 0; i < address.delegated.sentDelegatedResource.length; i++) {
        sentDelegateResource = sentDelegateResource + address.delegated.sentDelegatedResource[i]['frozen_balance_for_energy'];
      }
    }

    let frozenEnergy=0;
    if(address.accountResource.frozen_balance_for_energy.frozen_balance > 0){
      frozenEnergy=address.accountResource.frozen_balance_for_energy.frozen_balance;
    }

    let totalPower=sentDelegateBandwidth+frozenBandwidth+sentDelegateResource+frozenEnergy;
    this.setState({
        totalPower:totalPower,
    });

  }

  async loadWitness(id) {
    /* 需要总票数，实时排名俩个参数*/
    let {data} = await Client.getVoteWitness(id)
    this.setState({
      totalVotes: data.realTimeVotes,
      rank: data.realTimeRanking
    });
  }

  render() {

    let {totalPower, address, tabs, stats, loading, blocksProduced, media, candidates, rank, totalVotes} = this.state;
    let {match} = this.props;
    console.log('address',address)
    let addr = match.params.id;
    let uploadURL = API_URL + "/api/v2/node/info_upload?address=" + match.params.id

    if (!address) {
      return null;
    }



    let pathname = this.props.location.pathname;
    let tabName = ''
    let rex = /[a-zA-Z0-9]{34}\/?([a-zA-Z\\-]+)$/
    pathname.replace(rex, function (a, b) {
      tabName = b
    })
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
                      <div className="card list-style-header">
                        {
                          address.representative.enabled &&
                          <div className="card-body">
                            <h5 className="card-title m-0">
                              <i className="fa fa-cube mr-2"/>
                              {tu("representatives")}
                            </h5>
                          </div>
                        }
                        <div className="row">

                          <div className="col-md-6">
                            <table className="table m-0">
                              <tbody>
                              {
                                Boolean(rank) &&
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
                                  <AddressLink address={addr} includeCopy={true}/>
                                </td>
                              </tr>
                              {!address.representative.enabled ? <tr>
                                <th>{tu("name")}:</th>
                                <td>
                                  <span>{address.name ? address.name : "-"}</span>
                                </td>
                              </tr> : ""}

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
                                      <TRXPrice showCurreny={false}
                                                amount={(totalPower) / ONE_TRX}/>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                              <tr>
                                <th>{tu("total_balance")}:</th>
                                <td>
                                  <ul className="list-unstyled m-0">
                                    <li>
                                      <TRXPrice
                                          amount={(address.balance + totalPower) / ONE_TRX}/>{' '}
                                      <span className="small">(<TRXPrice
                                          amount={(address.balance + totalPower) / ONE_TRX}
                                          currency="USD"
                                          showPopup={false}/>)</span>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                              {
                                Boolean(totalVotes) &&
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
                          <div className="col-md-6 d-flex address-circle">
                            <div className="address-circle-bandwidth d-flex mr-4">
                              <Progress width={82} strokeWidth={10} showInfo={false} type="circle" strokeColor="#f5bc5d" strokeLinecap="square" percent={address.bandwidth.netPercentage*100} />
                              <div className="circle-info">
                                <div>{tu('bandwidth')}</div>
                                <h2>
                                  <FormattedNumber
                                      value={address.bandwidth.netRemaining + address.bandwidth.freeNetRemaining}/>
                                </h2>
                              </div>
                            </div>
                            <div className="address-circle-line"></div>
                            <div className="address-circle-energy d-flex ml-4">
                              <Progress width={82} strokeWidth={10} showInfo={false} type="circle" strokeColor="#7aa2d5" strokeLinecap="square" percent={address.bandwidth.energyPercentage*100} />
                              <div className="circle-info">
                                <div>{tu('energy')}</div>
                                <h2>
                                  <FormattedNumber value={address.bandwidth.energyRemaining}/>
                                </h2>
                              </div>
                            </div>
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
                      <div className="card mt-3 list-style-body">
                        <div className="card-header list-style-body__header">
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
                        <div className="card-body p-0 list-style-body__body">
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
                      {
                        tabName === '' ?
                            <div style={{marginTop: 20, float: 'right'}}><i size="1" style={{fontStyle: 'normal'}}>[
                              Download <a href={uploadURL} style={{color: '#C23631'}}><b>CSV Export</b></a>&nbsp;<span
                                  className="glyphicon glyphicon-download-alt"></span> ]</i>&nbsp;
                            </div> : null
                      }

                    </Fragment>
              }
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
      tokens20: state.account.tokens20,
  };
}

const mapDispatchToProps = {};

export default injectIntl(Address);
//export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Address));
