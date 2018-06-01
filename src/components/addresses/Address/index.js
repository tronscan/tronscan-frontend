/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {filter, head} from "lodash";
import {NavLink, Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {TokenBalances} from "./TokenBalances";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {TronLoader} from "../../common/loaders";
import Blocks from "./Blocks";
import Transactions from "../../common/Transactions";
import Votes from "../../common/Votes";
import Transfers from "../../common/Transfers";

class Address extends React.Component {


  constructor({match}) {
    super();

    this.state = {
      showQrCode: false,
      loading: true,
      blocksProduced: 0,
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
              Loading Transfers
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
              Loading Transactions
            </TronLoader>
          )
        },
      },
    };
  }

  componentDidMount() {
    let {match} = this.props;

    this.loadAddress(match.params.id);

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

  async loadMedia(address) {
    let media = await Client.getAddressMedia(address);

    if (media.success) {
      this.setState({
        media: {
          image: media.image,
        }
      });
    }
  }

  async loadAddress(id) {

    this.setState({loading: true, address: {address: id}, media: null, });

    // this.live = channel("/address-" + id);
    // this.live.on('transfer', transaction => {
    //   console.log("NEW TRANSACTION!", transaction);
    // });

    let address = await Client.getAddress(id);

    if (address.representative.enabled) {
      this.loadMedia(id);
    }

    let stats = await Client.getAddressStats(id);

    let {blocks, total} = await Client.getBlocks({
      producer: id,
      limit: 1,
    });

    this.setState(prevProps => ({
      loading: false,
      address,
      blocksProduced: total,
      stats,
      tabs: {
        ...prevProps.tabs,
        transfers: {
          id: "transfers",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("transfers")}</span>,
          cmp: () => <Transfers filter={{address: id}}  />
        },
        transactions: {
          id: "transactions",
          icon: "fas fa-handshake",
          path: "/transactions",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <Transactions filter={{address: id}}  />
        },
        token_balances: {
          id: "token_balances",
          icon: "fa fa-piggy-bank",
          path: "/token-balances",
          label: <span>{tu("token balances")}</span>,
          cmp: () => <TokenBalances tokenBalances={address.balances}/>,
        },
        blocks_produced: {
          id: "blocks-produced",
          icon: "fa fa-cube",
          path: "/blocks",
          label: <span>{tu("produced blocks")}</span>,
          cmp: () => <Blocks blocks={blocks}/>,
        },
        votes: {
          id: "votes",
          icon: "fa fa-bullhorn",
          path: "/votes",
          label: <span>{tu("votes")}</span>,
          cmp: () => <Votes
            filter={{voter: id}}
            showVoter={false}
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

  render() {

    let {address, tabs, stats, loading, blocksProduced, media} = this.state;
    let {match} = this.props;

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
                    Loading Address {address.address}
                  </TronLoader>
                </div> :
                <Fragment>
                  <div className="card">
                    {
                      address.representative.enabled &&
                      <div className="card-header text-center bg-info font-weight-bold text-white">
                        Representative
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
                    <table className="table m-0">
                      <tbody>
                      {
                        address.representative.enabled &&
                        <Fragment>
                          <tr>
                            <th>{tu("Website")}:</th>
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
                        <th>{tu("transactions")}:</th>
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
                        <th>{tu("Tron Power")}:</th>
                        <td>
                          <ul className="list-unstyled m-0">
                            <li>
                              <FormattedNumber value={address.frozen.total / ONE_TRX} />
                            </li>
                          </ul>
                        </td>
                      </tr>
                      </tbody>
                    </table>
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


  return {
  };
}

const mapDispatchToProps = {
};

// export default connect(mapStateToProps, mapDispatchToProps)(Address);
export default Address;
