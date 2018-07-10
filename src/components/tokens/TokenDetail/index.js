import React from "react";
import {Client} from "../../../services/api";
import Avatar from "../../common/Avatar";
import {tu} from "../../../utils/i18n";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime} from "react-intl";
import {TokenHolders} from "./TokenHolders";
import {NavLink, Route, Switch} from "react-router-dom";
import {AddressLink, ExternalLink} from "../../common/Links";
import {TronLoader} from "../../common/loaders";
import {addDays, getTime} from "date-fns";
import Transfers from "../../common/Transfers";


export default class TokenDetail extends React.Component {


  constructor() {
    super();

    this.state = {
      loading: true,
      token: {},
      tabs: [],
    };
  }

  componentDidMount() {

    let {match} = this.props;

    this.loadToken(decodeURI(match.params.name));
  }

  loadToken = async (name) => {

    this.setState({ loading: true, token: { name } });

    let token = await Client.getToken(name);

    let {addresses, total: totalAddresses} = await Client.getTokenHolders(name);

    this.setState({
      loading: false,
      token,
      tabs: [
        {
          id: "transactions",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("token_transfers")}</span>,
          cmp: () => <Transfers filter={{ token: name }} />
        },
        {
          id: "holders",
          icon: "fa fa-user",
          path: "/holders",
          label: <span>{totalAddresses} {tu("token_holders")}</span>,
          cmp: () => <TokenHolders tokenHodlers={addresses} token={token} />
        },
      ]
    });
  };

  render() {

    let {match} = this.props;
    let {token, tabs, loading} = this.state;

    return (
      <main className="container header-overlap">
        {
          loading ? <div className="card">
            <TronLoader>
              {tu("loading_token")} {token.name}
            </TronLoader>
          </div> :
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <Avatar value={token.name} className="float-right"/>
                    <h5 className="card-title">
                      {token.name}
                    </h5>
                    <p className="card-text">{token.description}</p>
                  </div>
                  <table className="table m-0">
                    <tbody>
                    <tr>
                      <th style={{width: 250}}>{tu("website")}:</th>
                      <td>
                        <ExternalLink url={token.url} />
                      </td>
                    </tr>
                    <tr>
                      <th style={{width: 250}}>{tu("total_supply")}:</th>
                      <td>
                        <FormattedNumber value={token.totalSupply} />
                      </td>
                    </tr>
                    {
                      token.frozen.length > 0 &&
                      <tr>
                        <th>{tu("Frozen Supply")}:</th>
                        <td>
                          {
                            token.frozen.map(frozen => (
                              <div>
                                {frozen.amount} {tu("can_be_unlocked_in")}&nbsp;
                                <FormattedRelative value={getTime(addDays(new Date(token.startTime), frozen.days))} />
                              </div>
                            ))
                          }
                        </td>
                      </tr>
                    }
                    <tr>
                      <th>{tu("issuer")}:</th>
                      <td>
                        <AddressLink address={token.ownerAddress} />
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("start_date")}:</th>
                      <td>
                        <FormattedDate value={token.startTime} />{' '}
                        <FormattedTime value={token.startTime} />
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("end_date")}:</th>
                      <td>
                        <FormattedDate value={token.endTime} />{' '}
                        <FormattedTime value={token.endTime} />
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("token_holders")}:</th>
                      <td>
                        <FormattedNumber value={token.nrOfTokenHolders} />
                      </td>
                    </tr>
                    <tr>
                      <th>{tu("nr_of_Transfers")}:</th>
                      <td>
                        <FormattedNumber value={token.totalTransactions} />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>

                <div className="card mt-3">
                  <div className="card-header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {
                        tabs.map(tab => (
                          <li key={tab.id} className="nav-item">
                            <NavLink exact to={match.url + tab.path} className="nav-link text-dark" >
                              <i className={tab.icon + " mr-2"} />
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
                        tabs.map(tab => (
                          <Route key={tab.id} exact path={match.url + tab.path} render={() => (<tab.cmp />)} />
                        ))
                      }
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
        }

      </main>
    )
  }
}
