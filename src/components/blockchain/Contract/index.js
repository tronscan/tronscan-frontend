/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {AddressLink, TransactionHashLink} from "../../common/Links";
import {TRXPrice} from "../../common/Price";
import {ONE_TRX} from "../../../constants";
import {TronLoader} from "../../common/loaders";
import Transactions from "./Txs";
import Code from "./Code";
import Txhash from "./Txhash";
import Events from "./Events";
import {upperFirst} from "lodash";
import {Truncate} from "../../common/text";
import xhr from "axios/index";
import {API_URL} from "../../../constants";
import { Tooltip } from 'antd'


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
      contract:contract.data[0],
      tabs: {
        ...prevProps.tabs,
        transactions: {
          id: "transactions",
          path: "",
          label: <span>{tu("transactions")}</span>,
          cmp: () => <Transactions filter={{contract: id}}  />
        },
        // Txns: {
        //   id: "Txns",
        //   path: "/Txns",
        //   label: <span>{tu('token_txns')}</span>,
        //   cmp: () => <Txhash filter={{address: id}} />,
        // },
        voters: {
          id: "code",
          path: "/code",
          label: <span>{tu("Code")}</span>,
          cmp: () => <Code filter={{address: id}} />,
        },
        events: {
          id: "events",
          path: "/events",
          label: <span>{tu('Events')}</span>,
          cmp: () => <Events filter={{address: id}} />,
        }
      }
    }));

   
  }

  render() {

    let {contract, tabs, loading} = this.state;
    let {match, intl} = this.props;

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
                            <h6 className="contract-header__title">{tu('contract_overview')}</h6>
                            <ul>
                              <li><p>{upperFirst(intl.formatMessage({id: 'balance'}))}: </p><TRXPrice amount={parseInt(contract.balance) / ONE_TRX}/></li>
                              <li><p>{tu('trx_value')}: </p><TRXPrice amount={1} currency="USD" source="home"/></li>
                              <li><p>{upperFirst(intl.formatMessage({id: 'transactions'}))}: </p>
                                {contract.trxCount} 
                                <Tooltip placement="top" title={intl.formatMessage({id: 'Normal_Transactions'})}>
                                  <span className="ml-1"> txns </span>
                                </Tooltip>
                              </li>
                              {/* <li className="border-bottom-0"><p>{tu('token_tracker')}: </p>{contract.tokenContract}</li> */}
                            </ul>
                          </div>
                          <div className="contract-header__item">
                            <h6 className="contract-header__title">{tu('Misc')}</h6>
                            <ul>
                              <li>
                                <p>{tu('contract_creator')}:</p>
                                {contract.creator &&
                                  <div className="d-flex">
                                    <span style={{width: '30%'}}>
                                    <Truncate><AddressLink address={contract.creator.address} /></Truncate></span>
                                    <span className="px-1">{tu('at_txn')}</span>
                                    <span style={{width: '30%'}}>
                                    <Truncate>
                                      <TransactionHashLink hash={contract.creator.txHash}>{contract.creator.txHash}</TransactionHashLink>
                                      </Truncate>
                                    </span>
                                  </div>
                                }
                              </li>
                            </ul>
                          </div>
                        </div>
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
export default injectIntl(SmartContract);
