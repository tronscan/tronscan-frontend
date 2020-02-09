/* eslint-disable no-undef */
import React, { Fragment } from "react";
import { injectIntl, FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { connect } from "react-redux";
import { NavLink, Route, Switch } from "react-router-dom";
import { Client } from "../../../services/api";
import { tu } from "../../../utils/i18n";
import {
  AddressLink,
  TransactionHashLink,
  TokenTRC20Link
} from "../../common/Links";
import { TRXPrice } from "../../common/Price";
import { ONE_TRX } from "../../../constants";
import { TronLoader } from "../../common/loaders";
import Transactions from "../../common/Transactions";
import Txs from "./Txs";
import Code from "./Code";
// import Txhash from "./Txhash";
import Events from "./Events";
import Transfers from "./Transfers";
import Energy from "./Energy";
import Call from "./Call";
import TRXChart from "./TrxCharts";
import { upperFirst } from "lodash";
import { Truncate } from "../../common/text";
import xhr from "axios/index";
import {
  API_URL,
  CONTRACT_ADDRESS_USDT,
  CONTRACT_ADDRESS_WIN,
  CONTRACT_ADDRESS_GGC,
  IS_SUNNET,
  CONTRACT_MAINNET_API_URL
} from "../../../constants";
import { Tooltip, Icon } from "antd";
import TokenBalances from "./Balance.js";
import { CsvExport } from "../../common/CsvExport";
import moment from "moment";
import rebuildList from "../../../utils/rebuildList";
import { QuestionMark } from "../../common/QuestionMark.js";

class SmartContract extends React.Component {
  constructor({ match }) {
    super();

    this.state = {
      showQrCode: false,
      loading: true,
      blocksProduced: 0,
      address: {
        address: "",
        balance: 0,
        tokenBalances: {}
      },
      token20: null,
      csvurl: "",
      energyRemaining: 0
    };
  }

  componentDidMount() {
    let { match, walletType } = this.props;
    this.loadContract(match.params.id);
    
    const isPrivateKey = walletType.type === "ACCOUNT_PRIVATE_KEY";
    IS_SUNNET && this.getMappingBySidechainAddress(match.params.id);
    this.setState({
      isPrivateKey
    });
  }

  componentDidUpdate(prevProps) {
    let { match } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      this.loadContract(match.params.id);
    }
  }

  componentWillUnmount() {}

  async loadContract(id) {
    this.setState({ loading: true, address: { address: id } });

    let contract = await Client.getContractOverview(id);

    let result = await xhr.get(API_URL + "/api/token_trc20?contract=" + id);
    let token20 =
      result.data.trc20_tokens.length > 0 ? result.data.trc20_tokens[0] : "";
    if (token20) {
      this.setState(prevProps => ({
        loading: false,
        token20: token20,
        contract: contract.data[0],
        tabs: {
          ...prevProps.tabs,
          transactions: {
            id: "transactions",
            path: "",
            label: <span>{tu("transactions")}</span>,
            cmp: () => (
              <Txs
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ contract: id }}
                address
                isContract
              />
            )
          },
          // Txns: {
          //   id: "Txns",
          //   path: "/Txns",
          //   label: <span>{tu('token_txns')}</span>,
          //   cmp: () => <Txhash filter={{address: id}} />,
          token_balances: {
            id: "token_balances",
            path: "/token-balances",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => <TokenBalances id={id} />
          },
          Transfers: {
            id: "Transfers",
            path: "/transfers",
            label: <span>{tu("TRC20_transfers")}</span>,
            cmp: () => <Transfers filter={{ token: id }} token={token20} />
          },
          voters: {
            id: "code",
            path: "/code",
            label: <span>{tu("contract_title")}</span>,
            cmp: () => <Code filter={{ address: id }} />
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("Internal_txns")}</span>,
            cmp: () => (
              <Transactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ contract: id }}
                isinternal
                address
              />
            )
          },
          events: {
            id: "events",
            path: "/events",
            label: <span>{tu("Events")}</span>,
            cmp: () => <Events filter={{ address: id }} />
          },
          energy: {
            id: "energy",
            path: "/energy",
            label: <span>{tu("energy")}</span>,
            cmp: () => <Energy filter={{ address: id }} />
          },
          call: {
            id: "call",
            path: "/call",
            label: <span>{tu("call")}</span>,
            cmp: () => <Call filter={{ address: id }} />
          },
          trx_chart: {
            id: "trx_chart",
            path: "/trx-balances-chart",
            label: <span>{tu("address_balance")}</span>,
            cmp: () => <TRXChart filter={{ address: id }} />
          }
        }
      }));
    } else {
      this.setState(prevProps => ({
        loading: false,
        token20: token20,
        contract: contract.data[0],
        tabs: {
          ...prevProps.tabs,
          transactions: {
            id: "transactions",
            path: "",
            label: <span>{tu("transactions")}</span>,
            cmp: () => (
              <Txs
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ contract: id }}
                address
                isContract
              />
            )
          },
          // Txns: {
          //   id: "Txns",
          //   path: "/Txns",
          //   label: <span>{tu('token_txns')}</span>,
          //   cmp: () => <Txhash filter={{address: id}} />,
          // },
          // Transfers: {
          //     id: "Transfers",
          //     path: "/transfers",
          //     label: <span>{tu('TRC20_transfers')}</span>,
          //     cmp: () => <Transfers filter={{token: id}} token={token20}/>,
          // },
          token_balances: {
            id: "token_balances",
            // icon: "fa fa-piggy-bank",
            path: "/token-balances",
            label: <span>{tu("token_balances")}</span>,
            cmp: () => <TokenBalances id={id} />
          },
          voters: {
            id: "code",
            path: "/code",
            label: <span>{tu("contract_title")}</span>,
            cmp: () => <Code filter={{ address: id }} />
          },
          intransactions: {
            id: "intransactions",
            // icon: "fas fa-handshake",
            path: "/internal-transactions",
            label: <span>{tu("Internal_txns")}</span>,
            cmp: () => (
              <Transactions
                getCsvUrl={csvurl => this.setState({ csvurl })}
                filter={{ contract: id }}
                isinternal
                address
              />
            )
          },
          events: {
            id: "events",
            path: "/events",
            label: <span>{tu("Events")}</span>,
            cmp: () => <Events filter={{ address: id }} />
          },
          energy: {
            id: "energy",
            path: "/energy",
            label: <span>{tu("energy")}</span>,
            cmp: () => <Energy filter={{ address: id }} />
          },
          call: {
            id: "call",
            path: "/call",
            label: <span>{tu("call")}</span>,
            cmp: () => <Call filter={{ address: id }} />
          },
          trx_chart: {
            id: "trx_chart",
            path: "/trx-balances-chart",
            label: <span>{tu("address_balance")}</span>,
            cmp: () => <TRXChart filter={{ address: id }} />
          }
        }
      }));
    }
    if(contract&&contract.data&&contract.data[0]&&contract.data[0].creator&&contract.data[0].creator.address){
      this.loadAddress(contract.data[0].creator.address);
    }
  }

  async loadAddress(id){
    let address = await Client.getAddress(id);
    this.setState({
      energyRemaining:address.bandwidth.energyRemaining>= 0?address.bandwidth.energyRemaining:0
    })
  }

  /**
   * get Mainnet contract address
   */
  getMappingBySidechainAddress = async id => {
    const mainchainAddressData = await xhr.get(
      `${CONTRACT_MAINNET_API_URL}/external/sidechain/getMappingBySidechainAddress?sidechainAddress=${id}`
    );

    const {
      data: { retCode, data }
    } = mainchainAddressData;
    if (retCode === "0") {
      const { mainchainAddress } = data;
      this.setState({
        mainchainAddress
      });
    }
  };

  contractValue() {
    let contract = this.state.contract;
    let contractValue = "";

    if (contract.call_token_value) {
      let tokenList = [{ token_id: contract.call_token_id }];
      let tokenInfo = rebuildList(tokenList, "token_id", "amount")[0];
      let value =
        contract.call_token_value /
        Math.pow(10, tokenInfo.map_token_precision || 6);
      
      if (contract.call_value) {
        let trxValue = contract.call_value / 1000000
        contractValue = `${trxValue} TRX ${value} ${tokenInfo.map_token_name}`;
      } else {
        contractValue = `${value} ${tokenInfo.map_token_name}`;
      }
    } else {
      if (contract.call_value) {
        let trxValue = contract.call_value / 1000000
        contractValue = `${trxValue} TRX`;
      } else {
        contractValue = "0 TRX";
      }
    }

    return contractValue;
  }

  render() {
    let {
      contract,
      tabs,
      loading,
      token20,
      csvurl,
      mainchainAddress,
      isPrivateKey,
      energyRemaining
    } = this.state;
    let { match, intl } = this.props;
    const defaultImg = require("../../../images/logo_default.png");

    if (!contract) {
      return null;
    }

    const contractValue = this.contractValue();

    let pathname = this.props.location.pathname;
    let tabName = "";
    let rex = /[a-zA-Z0-9]{34}\/?([a-zA-Z\\-]+)$/;
    pathname.replace(rex, function(a, b) {
      tabName = b;
    });
    return (
      <main className="container header-overlap token_black">
        <div className="row">
          <div className="col-md-12 ">
            {loading ? (
              <div className="card">
                <TronLoader>
                  {tu("loading_address")} {contract.address}
                </TronLoader>
              </div>
            ) : (
              <Fragment>
                <div className="card list-style-header">
                  <div className="contract-header">
                    <h6>
                      <AddressLink
                        address={contract.address}
                        isContract={true}
                        includeCopy={true}
                        includeTransfer={true}
                        includeErcode={true}
                      />
                    </h6>

                    <div className="d-flex contract-header_list">
                      <div className="contract-header__item">
                        <h6 className="contract-header__title">
                          {tu("contract_overview")}
                        </h6>
                        <ul>
                          <li>
                            <p>
                              {upperFirst(
                                intl.formatMessage({ id: "contract_code_overview_name" })
                              )}
                              :{" "}
                            </p>
                            {contract.name || "--"}
                          </li>
                          <li>
                            <p>
                              {upperFirst(
                                intl.formatMessage({ id: "balance" })
                              )}
                              :{" "}
                            </p>
                            <div>
                              <TRXPrice
                                amount={
                                  contract.balance
                                    ? parseInt(contract.balance) / ONE_TRX
                                    : 0
                                }
                                showPopup={false}
                                currency="TRX"
                              />
                              {contract.balance > 0 && (
                                <p>
                                  ≈{" "}
                                  <TRXPrice
                                    amount={
                                      contract.balance
                                        ? parseInt(contract.balance) / ONE_TRX
                                        : 0
                                    }
                                    currency="USD"
                                    showPopup={false}
                                  />
                                  &nbsp;(@&nbsp;USD&nbsp;
                                  <TRXPrice
                                    amount={1}
                                    currency="USD"
                                    showPopup={false}
                                    showCurreny={false}
                                  />
                                  /TRX)
                                </p>
                              )}
                            </div>
                          </li>
                          {/* <li><p>{tu('trx_value')}: </p><TRXPrice amount={1} currency="USD" source="home"/></li> */}
                          <li>
                            <p>
                              {upperFirst(
                                intl.formatMessage({ id: "transactions" })
                              )}
                              :{" "}
                            </p>
                            <p className="contract_trx_count">
                              {contract.trxCount}
                              {/* <Tooltip
                                placement="top"
                                title={intl.formatMessage({
                                  id: "Normal_Transactions"
                                })}
                              > */}
                                <span className="ml-1"> Txns </span>
                              {/* </Tooltip> */}
                            </p>
                          </li>

                          {token20 && (
                            <li>
                              <p>{tu("token_tracker")}: </p>
                              {token20.contract_address ==
                                CONTRACT_ADDRESS_USDT ||
                              token20.contract_address ==
                                CONTRACT_ADDRESS_WIN ||
                              token20.contract_address ==
                                CONTRACT_ADDRESS_GGC ? (
                                <b
                                  className="token-img-top"
                                  style={{ marginRight: 10 }}
                                >
                                  <img
                                    width={20}
                                    height={20}
                                    src={token20.icon_url}
                                    alt=""
                                    onError={e => {
                                      e.target.onerror = null;
                                      e.target.src = defaultImg;
                                    }}
                                  />
                                  <i style={{ width: 10, height: 10 }}></i>
                                </b>
                              ) : (
                                <img
                                  width={20}
                                  height={20}
                                  src={token20.icon_url}
                                  alt=" "
                                  style={{ marginRight: 10 }}
                                  onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImg;
                                  }}
                                />
                              )}
                              <TokenTRC20Link
                                name={token20.name}
                                address={token20.contract_address}
                                namePlus={
                                  token20.name + " (" + token20.symbol + ")"
                                }
                              />
                            </li>
                          )}
                          {!token20 && (
                            <li>
                              <p>{tu("token_tracker")}: </p>
                              {/* <img width={20} height={20} src={defaultImg} /> */}
                              --
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="contract-header__item">
                        <h6 className="contract-header__title">
                          {tu("contract_create_msg")}
                        </h6>
                        <ul>
                          <li>
                            <p>{tu("contract_code_overview_creator")}:</p>
                            {contract.creator && (
                              <div className="d-flex">
                                <span style={{ width: "30%" }}>
                                  <AddressLink
                                    address={contract.creator.address}
                                  >
                                    {contract.creator.address}
                                  </AddressLink>
                                </span>
                               {
                                  contract.creator.txHash && <span className="d-flex" style={{ width: "70%" }}>
                                    <span className="px-1">{tu("at_txn")}</span>
                                      <span style={{ width: "30%" }}>
                                        <Truncate>
                                          <TransactionHashLink
                                            hash={contract.creator.txHash}
                                          >
                                            {contract.creator.txHash}
                                          </TransactionHashLink>
                                        </Truncate>
                                      </span>
                                  </span>  
                               } 
                              
                              </div>
                            )}
                          </li>
                          {IS_SUNNET && mainchainAddress && (
                            <li>
                              <p>{tu("main_account_mapping_btn")}: </p>
                              <span>
                                {tu("sidechain_contract_left")}
                                {` ${mainchainAddress} `}
                                {tu("sidechain_contract_right")}
                              </span>
                            </li>
                          )}
                          <li>
                            <p>{tu("contract_create_time")}:</p>
                            <div className="d-flex">
                              <span>
                                <FormattedDate value={contract.date_created}/>&nbsp;
                                <FormattedTime value={contract.date_created}
                                               hour='numeric'
                                               minute="numeric"
                                               second='numeric'
                                               hour12={false}
                                />
                                {/* {moment(contract.date_created).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )} */}
                              </span>
                            </div>
                          </li>
                          <li>
                            <p>{tu("contract_available_energy")}:</p>
                            <div className="d-flex">
                              <span>
                                <FormattedNumber value={contract.creator.consume_user_resource_percent < 100 ? energyRemaining : 0}/> &nbsp;ENERGY
                                
                              </span>
                            </div>
                          </li>
                          <li>
                            <div className="question-markk">
                              {tu("contract_enery")}
                              <span className="ml-1">
                                <QuestionMark
                                  placement="top"
                                  text="contract_enery_tip"
                                />
                              </span>
                              :
                            </div>
                            {contract.creator && (
                              <div className="d-flex">
                                <span>
                                  {tu("contract_percent")}
                                  {100 -
                                    contract.creator
                                      .consume_user_resource_percent}
                                  %
                                </span>
                                <span className="ml-2">
                                  {tu("contract_percent_user")}
                                  {
                                    contract.creator
                                      .consume_user_resource_percent
                                  }
                                  %
                                </span>
                              </div>
                            )}
                          </li>
                          <li>
                            <div className="question-markk">
                              {tu("contract_init_assets")}
                              <span className="ml-1">
                                <QuestionMark
                                  placement="top"
                                  text="contract_init_assets_tip"
                                />
                              </span>
                              :
                            </div>

                            <div className="d-flex">
                              <span style={{ width: "100%" }}>
                                {contractValue}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mt-3 list-style-body">
                  <div className="card-header list-style-body__header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {Object.values(tabs).map(tab => (
                        <li key={tab.id} className="nav-item">
                          <NavLink
                            exact
                            to={match.url + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} />
                            {tab.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-body p-0 list-style-body__body">
                    <Switch>
                      {Object.values(tabs).map(tab => (
                        <Route
                          key={tab.id}
                          exact
                          path={match.url + tab.path}
                          render={props => <tab.cmp />}
                        />
                      ))}
                    </Switch>
                  </div>
                </div>
                {["", "internal-transactions"].indexOf(tabName) !== -1 ? (
                  <CsvExport downloadURL={csvurl} />
                ) : (
                  ""
                )}
              </Fragment>
            )}
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    walletType: state.app.wallet
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(SmartContract));
