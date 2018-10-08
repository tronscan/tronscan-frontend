/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {NavLink, Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {TronLoader} from "../../common/loaders";
import Transactions from "./Txs";
import Code from "./Code";
import Txhash from "./Txhash";


class SmartContract extends React.Component {


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
      }
    };
  }

  componentDidMount() {
    let {match} = this.props;
    this.loadContract(match.params.id);

  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadContract(match.params.id);
    }
  }

  componentWillUnmount() { }


  async loadContract(id) {

    this.setState({loading: true, address: {address: id} });


    let contract = await Client.getContractOverview(id);

    this.setState(prevProps => ({
      loading: false,
      contract:contract.data,
      tabs: {
        ...prevProps.tabs,
        transactions: {
          id: "transactions",
          path: "/transactions",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <Transactions filter={{address: id}}  />
        },

        // votes: {
        //   id: "internal_transactions",
        //   path: "/intr",
        //   label: <span>{tu("internal_transactions")}</span>,
        //   cmp: () => <Transactions filter={{address: id}} isInternal={true} />,
        // },
        Txns: {
          id: "Txns",
          path: "/Txns",
          label: <span>Token Txns</span>,
          cmp: () => <Txhash filter={{address: id}} />,
        },
        voters: {
          id: "code",
          path: "/code",
          label: <span>{tu("code")}</span>,
          cmp: () => <Code filter={{address: id}} />,
        },
      }
    }));
  }

  render() {

    let {contract, tabs, loading} = this.state;
    let {match} = this.props;

    if (!contract) {
      return null;
    }

    return (
        <main className="container header-overlap token_black">
          <div className="row">
            <div className="col-md-12 ">
              {
                loading ? <div className="card">
                      <TronLoader>
                        {tu("loading_address")} {contract.address}
                      </TronLoader>
                    </div> :
                    <Fragment>
                      <div className="card list-style-header">
                      <div className="contract-header">
                        <h6><AddressLink address={contract.address} includeCopy={true}/></h6>

                        <div className="d-flex justify-content-between">
                          <div className="contract-header__item">
                            <h6 className="contract-header__title">Contract Overview</h6>
                            <ul>
                              <li><p>Balance: </p>100,000,000,000 TRX</li>
                              <li><p>TRX Value: </p>$68.70</li>
                              <li><p>Transactions: </p>23 Txns</li>
                              <li className="border-bottom-0"><p>Token Tracke: </p>tHena (THENA)</li>
                            </ul>
                          </div>
                          <div className="contract-header__item">
                            <h6 className="contract-header__title">Misc</h6>
                            <ul>
                              <li><p>Contract Creato:</p>TV3Nm7f4f377d8f4b3…</li>
                            </ul>
                          </div>
                        </div>
                        {/* <table className="table m-0">
                          <tbody>

                          <tr>
                            <th>{tu("address")}:</th>
                            <td>
                              <AddressLink address={contract.address} includeCopy={true}/>
                            </td>
                          </tr>
                            <tr>
                              <th>{tu("name")}:</th>
                              <td>
                                {contract.name}
                              </td>
                            </tr>
                          <tr>
                            <th>{tu("transactions")}:</th>
                            <td>
                              {123}
                            </td>
                          </tr>
                          <tr>
                            <th>{tu("balance")}:</th>
                            <td>
                              <ul className="list-unstyled m-0">
                                <li>
                                  <TRXPrice amount={contract.balance / ONE_TRX}/>
                                  （$ xxxxxx）
                                </li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <th>{tu("creator")}:</th>
                            <td>
                              <ul className="list-unstyled m-0">
                                <li>
                                  {"ZK"}
                                </li>
                              </ul>
                            </td>
                          </tr>
                          </tbody>
                        </table> */}
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
                                         render={(props) => (<tab.cmp/>)}/>
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
export default SmartContract;
