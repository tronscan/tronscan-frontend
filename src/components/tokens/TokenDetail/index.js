import React from "react";
import { Client } from "../../../services/api";
import { t, tu } from "../../../utils/i18n";

import { injectIntl } from "react-intl";
import TokenHolders from "./TokenHolders";
import { NavLink, Route, Switch } from "react-router-dom";
import { TronLoader } from "../../common/loaders";
import Transfers from "./Transfers.js";
import TokenInfo from "./TokenInfo.js";
import BTTSupply from "./BTTSupply.js";
import { Information } from "./Information.js";
import { ONE_TRX, API_URL, IS_MAINNET } from "../../../constants";
import { login } from "../../../actions/app";
import { reloadWallet } from "../../../actions/wallet";
import { Input } from "antd";
import { connect } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { pkToAddress } from "@tronscan/client/src/utils/crypto";
import { transactionResultManager } from "../../../utils/tron";
import xhr from "axios/index";
import Lockr from "lockr";
import { withTronWeb } from "../../../utils/tronWeb";
import { CsvExport } from "../../common/CsvExport";
import { loadUsdPrice } from "../../../actions/blockchain";
import ExchangeQuotes from "../ExchangeQuotes";

@withTronWeb
class TokenDetail extends React.Component {
  constructor() {
    super();

    this.state = {
      privateKey: "",
      loading: true,
      token: {},
      tabs: [],
      buyAmount: 0,
      alert: null,
      currentTotalSupply: "",
      csvurl: ""
    };
  }

  async componentDidMount() {
    let { match, priceUSD } = this.props;
    !priceUSD && (await this.props.loadUsdPrice());

    if (isNaN(Number(match.params.id))) {
      this.props.history.push("/tokens/list");
    } else {
      this.loadToken(decodeURI(match.params.id));
    }
  }

  componentDidUpdate(prevProps) {
    let { match, intl } = this.props;

    if (match.params.id !== prevProps.match.params.id) {
      if (isNaN(Number(match.params.id))) {
        this.props.history.push("/tokens/list");
      } else {
        this.loadToken(decodeURI(match.params.id));
      }
    }
  }
  loadTotalTRXSupply = async () => {
    const { funds } = await Client.getBttFundsSupply();
    this.setState({
      currentTotalSupply: parseInt(funds.totalTurnOver)
    });
  };
  loadToken = async id => {
    let { priceUSD } = this.props;
    let {currentTotalSupply} = this.state;

    this.setState({ loading: true });

    //let token = await Client.getToken(name);
    let result = await xhr.get(API_URL + "/api/token?id=" + id + "&showAll=1");
    let token = result.data.data[0];

    token.priceToUsd =
      token && token["market_info"]
        ? token["market_info"].priceInTrx * priceUSD
        : 0;
        
    if (!token) {
      this.setState({ loading: false, token: null });
      this.props.history.push("/tokens/list");
      return;
    }
    let tabs = [
      {
        id: "tokenInfo",
        icon: "",
        path: "",
        label: <span>{tu("token_issuance_info")}</span>,
        cmp: () => <TokenInfo token={token} />
      },
      {
        id: "transfers",
        icon: "",
        path: "/transfers",
        label: <span>{tu("token_transfers")}</span>,
        cmp: () => (
          <Transfers
            getCsvUrl={csvurl => this.setState({ csvurl })}
            filter={{ token: token.name, address: token.ownerAddress }}
          />
        )
      },
      {
        id: "holders",
        icon: "",
        path: "/holders",
        label: (
          <span>
            {IS_MAINNET ? tu("token_holders") : tu("DAppChain_holders")}
          </span>
        ),
        cmp: () => (
          <TokenHolders
            filter={{ token: token.name, address: token.ownerAddress }}
            token={{ totalSupply: token.totalSupply }}
            tokenPrecision={{ precision: token.precision }}
            getCsvUrl={csvurl => this.setState({ csvurl })}
          />
        )
      },
      {
        id: "quotes",
        icon: "",
        path: "/quotes",
        label: <span>{tu("token_market")}</span>,
        cmp: () => <ExchangeQuotes />
      }
    ];

    this.setState({
      loading: false,
      token
    });
    if (token.tokenID == 1002000) {
      let BttSupply = {
        id: "BTTSupply",
        icon: "",
        path: "/supply",
        label: <span>{tu("BTT_supply")}</span>,
        cmp: () => <BTTSupply token={token} />
      };
      tabs.push(BttSupply);
      this.loadTotalTRXSupply();
    }
    this.setState({
      tabs: tabs
    });
  };

  

  isBuyValid = () => {
    return this.state.buyAmount > 0;
  };

  render() {
    let { match, wallet, intl,priceUSD } = this.props;
    let {
      token,
      tabs,
      loading,
      buyAmount,
      alert,
      currentTotalSupply,
      csvurl
    } = this.state;
    let uploadURL =
      API_URL + "/api/v2/node/info_upload?address=" + match.params.id;
    let pathname = this.props.location.pathname;
    let tabName = "";
    let rex = /[a-zA-Z0-9]{7}\/?([a-zA-Z\\-]+)$/;
    pathname.replace(rex, function(a, b) {
      tabName = b;
    });

    return (
      <main className="container header-overlap token_black mc-donalds-coin">
        {alert}
        {loading ? (
          <div className="card">
            <TronLoader>
              {tu("loading_token")} {token.name}
            </TronLoader>
          </div>
        ) : (
          <div className="row">
            {token && (
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body mt-2">
                    <div className="d-flex">
                      {token && token.imgUrl && token.tokenID ? (
                        <div>
                          {token.tokenID == 1002000 ? (
                            <div className="token-img-top">
                              <img className="token-logo" src={token.imgUrl} />
                              <i></i>
                            </div>
                          ) : (
                            <img className="token-logo" src={token.imgUrl} />
                          )}
                        </div>
                      ) : (
                        <img
                          className="token-logo"
                          src={require("../../../images/logo_default.png")}
                        />
                      )}
                      <div className="token-description">
                        <h5 className="card-title">
                          {token.name} ({token.abbr})
                        </h5>
                        <p className="card-text">{token.description}</p>
                      </div>

                      <div className="token-sign">TRC10</div>
                    </div>
                  </div>
                  {token && (
                    <Information
                      token={token}
                      currentTotalSupply={currentTotalSupply}
                      priceUSD={priceUSD}
                    ></Information>
                  )}
                </div>

                <div
                  className="card mt-3"
                  style={{
                    borderTop: "1px solid #d8d8d8"
                  }}
                >
                  <div
                    className="card-header"
                    style={{
                      borderLeft: "1px solid #d8d8d8",
                      borderRight: "1px solid #d8d8d8",
                      position: "relative"
                    }}
                  >
                    <ul
                      className="nav nav-tabs card-header-tabs"
                      style={{ marginTop: "-12px", marginLeft: "-20px" }}
                    >
                      {tabs.map((tab, tabInd) => (
                        <li key={tabInd} className="nav-item">
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
                    {pathname.slice(-9) === "transfers" ? (
                      <div
                        style={{
                          position: "absolute",
                          right: "20px",
                          top: 6,
                          height: 26
                        }}
                      >
                        <div
                          className="input-group-append"
                          style={{ marginLeft: 0 }}
                        >
                          <Input allowClear />
                          <button
                            className="btn box-shadow-none"
                            style={{
                              height: "35px",
                              width: "35px",
                              background: "#C23631",
                              borderRadius: "0 2px 2px 0",
                              color: "#fff"
                            }}
                          >
                            <i className="fa fa-search" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="card-body p-0">
                    <Switch>
                      {tabs.map((tab, tabInd) => (
                        <Route
                          key={tabInd}
                          exact
                          path={match.url + tab.path}
                          render={() => <tab.cmp />}
                        />
                      ))}
                    </Switch>
                    <div
                      style={{
                        position: "absolute",
                        left: "20px",
                        bottom: "28px"
                      }}
                    >
                      {["transfers", "holders"].indexOf(tabName) !== -1 ? (
                        <CsvExport downloadURL={csvurl} />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    tokens: state.tokens.tokens,
    wallet: state.wallet,
    currentWallet: state.wallet.current,
    account: state.app.account,
    walletType: state.app.wallet,
    priceUSD: state.blockchain.usdPrice
  };
}

const mapDispatchToProps = {
  login,
  reloadWallet,
  loadUsdPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TokenDetail));
