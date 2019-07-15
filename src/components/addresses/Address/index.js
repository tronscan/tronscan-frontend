/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import TokenBalances from "./TokenBalances";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {TronLoader} from "../../common/loaders";
import Transactions from "../../common/Transactions";
import NewTransactions from "../../common/NewTransactions";
import Votes from "../../common/Votes";
import Transfers from "../../common/Transfers";
import TransfersTrc20 from "../../common/TransfersTrc20";
import TransfersAll from "../../common/TransfersAll";
import PieReact from "../../common/PieChart";
import xhr from "axios/index";
import {sortBy, toUpper} from "lodash";
import _ from "lodash";
import Blocks from "../../common/Blocks";
import {channel} from "../../../services/api";
import rebuildList from "../../../utils/rebuildList";
import rebuildToken20List from "../../../utils/rebuildToken20List";
import {API_URL} from '../../../constants.js'
import { FormatNumberByDecimals, FormatNumberByDecimalsBalance, toThousands } from '../../../utils/number'
import { Progress, Tooltip } from 'antd'
import BigNumber from "bignumber.js"
import {HrefLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {CsvExport} from "../../common/CsvExport";
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });


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
      csvurl: "",
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
         // path: "/token-balances",
          path: "",
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

    let balances = rebuildList(address.balances, 'name', 'balance')
    let x;
    balances.map((item,index) =>{
        if(item.map_token_id === '_'){
            item.map_amount_logo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
            item.tokenType = '-';
            item.priceInTrx = 1
        }else{
            item.tokenType = 'TRC10'
        }

        if(item.priceInTrx){
            x= new BigNumber(item.map_amount);
            item.TRXBalance = (x.multipliedBy(item.priceInTrx)).decimalPlaces(6);
            item.TRXBalance_toThousands = toThousands((x.multipliedBy(item.priceInTrx)).decimalPlaces(6));

        }else{
            item.TRXBalance = 0
        }
    })

    let trc20token_balances_new  = rebuildToken20List(address.trc20token_balances, 'contract_address', 'balance');
    let y;
    trc20token_balances_new && trc20token_balances_new.map(item => {
        item.tokenType = 'TRC20'
        item.token20_name = item.name + '(' + item.symbol + ')';
        item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
        item.token20_balance_decimals = FormatNumberByDecimalsBalance(item.balance, item.decimals);
        item.map_amount = FormatNumberByDecimalsBalance(item.balance, item.decimals);
        if(item.priceInTrx){
            y = new BigNumber(item.token20_balance_decimals);
            item.TRXBalance = (y.multipliedBy(item.priceInTrx)).decimalPlaces(6);
            item.TRXBalance_toThousands = toThousands((y.multipliedBy(item.priceInTrx)).decimalPlaces(6));
        }else{
            item.TRXBalance = 0
        }

        return item
    });



    let tokenBalances = balances.concat(trc20token_balances_new)
    let TRXBalance = 0;
    tokenBalances.map((item,index) =>{
        TRXBalance +=  Number(item.TRXBalance)
    })

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
          token_balances: {
              id: "token_balances",
              // icon: "fa fa-piggy-bank",
             // path: "/token-balances",
              path:"",
              label: <span>{tu("token_balances")}</span>,
              cmp: () => <TokenBalances tokenBalances={tokenBalances} intl={intl}/>,
          },
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "/transfers",
            label: <span>{tu("transfers")}</span>,
            cmp: () => <TransfersAll id={{address: id}} getCsvUrl={(csvurl) => this.setState({csvurl})} address/>
          },
          // transfers20: {
          //   id: "transfers20",
          //   // icon: "fa fa-exchange-alt",
          //   path: "/20transfers",
          //   label: <span>{tu("20_transfers")}</span>,
          //   cmp: () => <TransfersTrc20 filter={{address: id}}/>
          // },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            cmp: () => <NewTransactions getCsvUrl={(csvurl) => this.setState({csvurl})} filter={{address: id}} address/>
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => <Transactions getCsvUrl={(csvurl) => this.setState({csvurl})} filter={{address: id}} isinternal />
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
          token_balances: {
              id: "token_balances",
              // icon: "fa fa-piggy-bank",
             // path: "/token-balances",
              path: "",
              label: <span>{tu("token_balances")}</span>,
              cmp: () => <TokenBalances tokenBalances={tokenBalances} intl={intl}/>,
          },
          transfers: {
            id: "transfers",
            // icon: "fa fa-exchange-alt",
            path: "/transfers",
            label: <span>{tu("transfers")}</span>,
            cmp: () => <TransfersAll getCsvUrl={(csvurl) => this.setState({csvurl})} id={{address: id}} address/>
          },
          // transfers20: {
          //   id: "transfers20",
          //   // icon: "fa fa-exchange-alt",
          //   path: "/20transfers",
          //   label: <span>{tu("20_transfers")}</span>,
          //   cmp: () => <TransfersTrc20 filter={{address: id}}/>
          // },
          transactions: {
            id: "transactions",
            // icon: "fas fa-handshake",
            path: "/transactions",
            label: <span>{tu("transactions")}</span>,
            isHidden: true,
            cmp: () => <NewTransactions getCsvUrl={(csvurl) => this.setState({csvurl})} filter={{address: id}} address/>
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("internal_transactions")}</span>,
            cmp: () => <Transactions getCsvUrl={(csvurl) => this.setState({csvurl})} filter={{address: id}} isinternal address/>
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
        TRXBalanceTotal:TRXBalance + totalPower/ONE_TRX,
        netUsed:address.bandwidth.netUsed + address.bandwidth.freeNetUsed,
        netLimit:address.bandwidth.netLimit + address.bandwidth.freeNetLimit,
        netRemaining:address.bandwidth.netRemaining + address.bandwidth.freeNetRemaining,
        bandWidthPercentage:((address.bandwidth.netUsed + address.bandwidth.freeNetUsed)/(address.bandwidth.netLimit + address.bandwidth.freeNetLimit))*100,
        availableBandWidthPercentage:(1-(address.bandwidth.netUsed + address.bandwidth.freeNetUsed)/(address.bandwidth.netLimit + address.bandwidth.freeNetLimit))*100,
        energyUsed:address.bandwidth.energyUsed,
        energyLimit:address.bandwidth.energyLimit,
        energyRemaining:address.bandwidth.energyRemaining,
        energyPercentage:address.bandwidth.energyPercentage * 100,
        availableEnergyPercentage:address.bandwidth.energyRemaining ?(1- address.bandwidth.energyPercentage) * 100 : 0,
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

  bandWidthCircle = () => {
    let { netUsed, netLimit, netRemaining, bandWidthPercentage} = this.state;
    let {intl} = this.props;
    let address_percentage_remaining = new BigNumber(100 - Number(bandWidthPercentage));
    let addressPercentageRemaining = netRemaining?address_percentage_remaining.decimalPlaces(2) + '%':'0%';
    let address_percentage_used = new BigNumber(bandWidthPercentage);
    let addressPercentageUsed = netUsed?address_percentage_used.decimalPlaces(2) + '%':'0%';
    return (
        <div>
          <div>
              {intl.formatMessage({id: 'address_netLimit'}) + ' : ' + netLimit }
          </div>
          <div>
              <span>{intl.formatMessage({id: 'address_netRemaining'}) + ' : ' + netRemaining }</span>&nbsp;&nbsp;
              <span>{intl.formatMessage({id: 'address_percentage'}) + ' : ' + addressPercentageRemaining  }</span>
          </div>
          <div>
            <span>{intl.formatMessage({id: 'address_netUsed'}) + ' : ' + netUsed }</span>&nbsp;&nbsp;
            <span>{intl.formatMessage({id: 'address_percentage'}) + ' : ' + addressPercentageUsed }</span>
          </div>
        </div>
    )

  }

  energyCircle = () => {
    let { energyLimit, energyRemaining, energyUsed, energyPercentage } = this.state;
      let {intl} = this.props;
      let address_percentage_remaining = new BigNumber(100 - Number(energyPercentage));
      let addressPercentageRemaining = energyRemaining?address_percentage_remaining.decimalPlaces(2) + '%': '0%';
      let address_percentage_used = new BigNumber(energyPercentage);
      let addressPercentageUsed = energyUsed?address_percentage_used.decimalPlaces(2) + '%': '0%';
      return (
          <div>
            <div>
                {intl.formatMessage({id: 'address_energyLimit'}) + ' : ' + energyLimit }
            </div>
            <div>
              <span>{intl.formatMessage({id: 'address_energyRemaining'}) + ' : ' + energyRemaining }</span>&nbsp;&nbsp;
              <span>{intl.formatMessage({id: 'address_percentage'}) + ' : ' + addressPercentageRemaining }</span>
            </div>
            <div>
              <span>{intl.formatMessage({id: 'address_energyUsed'}) + ' : ' + energyUsed }</span>&nbsp;&nbsp;
              <span>{intl.formatMessage({id: 'address_percentage'}) + ' : ' + addressPercentageUsed }</span>
            </div>
          </div>
      )

  }

  render() {

    let {totalPower, address, tabs, stats, 
        loading, blocksProduced, media, candidates, 
        rank, totalVotes, netRemaining, bandWidthPercentage, 
        energyRemaining, energyPercentage, TRXBalanceTotal,
        availableBandWidthPercentage,availableEnergyPercentage, csvurl} = this.state;
    let {match,intl} = this.props;
    let addr = match.params.id;


    if (!address) {
      return null;
    }


    let uploadURL = API_URL + "/api/v2/node/info_upload?address=" + match.params.id
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
                                <th>
                                    <span className="mr-1">{tu("address_info_transactions")}</span>
                                    <QuestionMark placement="top" text="address_transactions_tip" />
                                  <span className="ml-1">:</span>
                                </th>
                                <td>
                                  <span>{address.totalTransactionCount}</span>

                                </td>
                              </tr>
                              <tr>
                                <th>{tu("address_info_transfers")}:</th>
                                <td>
                                  <div className="d-flex">
                                    <div>
                                        {stats.transactions_in + stats.transactions_out}
                                    </div>
                                    <div>
                                      <span className="ml-1">(</span>
                                      <i className="fa fa-arrow-down text-success"/>&nbsp;
                                      <span>{stats.transactions_in}</span>&nbsp;
                                      <i className="fa fa-arrow-up  text-danger"/>&nbsp;
                                      <span>{stats.transactions_out}</span>&nbsp;
                                      <span>)</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              {/*<tr>*/}
                                {/*<th>{tu("balance")}:</th>*/}
                                {/*<td>*/}
                                  {/*<ul className="list-unstyled m-0">*/}
                                    {/*<li>*/}
                                      {/*<TRXPrice amount={address.balance / ONE_TRX}/>*/}
                                    {/*</li>*/}
                                  {/*</ul>*/}
                                {/*</td>*/}
                              {/*</tr>*/}
                              <tr>
                                <th>
                                    <span className="mr-1">{tu("tron_power")}</span>
                                    <QuestionMark placement="top" text="address_tron_power_tip" className="ml-1"/>
                                    <span className="ml-1" >:</span>
                                </th>
                                <td>
                                  <ul className="list-unstyled m-0">
                                    <li className="d-flex">
                                      <TRXPrice showCurreny={false}
                                                amount={(totalPower) / ONE_TRX}/>
                                      <div>
                                         <span className="ml-1">(</span> {tu("address_tron_power_used")}: {address.voteTotal}&nbsp;   {tu("address_tron_power_remaining")}: {(totalPower) / ONE_TRX - address.voteTotal } <span>)</span>
                                      </div>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                              <tr>
                                <th>
                                  <span className="mr-1">{tu("total_balance")}</span>
                                    <QuestionMark placement="top" text="address_total_balance_tip" className="ml-1"/>
                                  <span className="ml-1" >:</span>
                                </th>
                                <td>
                                  <ul className="list-unstyled m-0">
                                    <li >
                                      <div>
                                        <TRXPrice
                                            amount={TRXBalanceTotal}/>{' '}
                                        <span className="small">(<TRXPrice
                                            amount={TRXBalanceTotal}
                                            currency="USD"
                                            showPopup={false}/>)</span>
                                      </div>

                                      <div>
                                        <span className="small">
                                          {tu('address_total_balance_info_sources')}：
                                        </span>
                                        <span className="small">
                                            <HrefLink
                                                href={
                                                    intl.locale == "zh"
                                                        ? "https://trx.market/zh/"
                                                        : "https://trx.market/"
                                                }
                                            >TRXMarket</HrefLink>
                                        </span>
                                        <img width={15} height={15}  style={{marginLeft:5}} src={require("../../../images/svg/market.png")} alt=""/>
                                      </div>

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
                            <div className="address-circle-bandwidth d-flex">
                              <Tooltip title={this.bandWidthCircle} overlayStyle={{'maxWidth':'500px'}}>
                                <Progress
                                    width={82}
                                    strokeWidth={10}
                                    showInfo={false}
                                    type="circle"
                                    strokeColor="#FFA30B"
                                    strokeLinecap="square"
                                    percent={availableBandWidthPercentage}
                                />
                              </Tooltip>


                              <div className="circle-info">
                                <div>{tu('address_netRemaining')}</div>
                                <h2>
                                     <FormattedNumber
                                        value={netRemaining?netRemaining:0}/>

                                </h2>
                              </div>
                            </div>
                            <div className="address-circle-line"></div>
                            <div className="address-circle-energy d-flex">
                              <Tooltip title={this.energyCircle} overlayStyle={{'maxWidth':'500px'}}>
                                <Progress
                                    width={82}
                                    strokeWidth={10}
                                    showInfo={false}
                                    type="circle"
                                    strokeColor="#4A90E2"
                                    strokeLinecap="square"
                                    percent={availableEnergyPercentage}
                                />
                              </Tooltip>
                              <div className="circle-info">
                                <div>{tu('address_energyRemaining')}</div>
                                <h2>
                                  <FormattedNumber value={energyRemaining?energyRemaining:0}/>
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
                      {/*
                        ['transfers', 'transactions', 'internal-transactions'].indexOf(tabName) !== -1?
                        <CsvExport downloadURL={csvurl}/>: ''
                      */}

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
