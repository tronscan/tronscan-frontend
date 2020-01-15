import React, { Fragment } from "react";
import { tu } from "../../../utils/i18n";
import { TronLoader } from "../../common/loaders";
import { NavLink, Route, Switch } from "react-router-dom";

import Overview from "./Overview";
import Accounts from "./Accounts";

class BestData extends React.Component {
  constructor() {
    super();
    this.state = {
      tabs: [],
      loading: true
    };
  }
  componentDidMount() {
    this.setTabs();
  }

  setTabs() {
    this.setState(prevProps => ({
      loading: false,
      tabs: {
        ...prevProps.tabs,
        overview: {
          id: "Overview",
          path: "",
          label: <span>{tu("data_overview")}</span>,
          cmp: () => <Overview />
        },
        accounts: {
          id: "Accounts",
          path: "/accounts",
          label: <span>{tu("data_account")}</span>,
          cmp: () => <Accounts />
        },
        tokens: {
          id: "",
          path: "",
          label: <span>{tu("data_token")}</span>,
          cmp: () => <Overview />
        },
        contracts: {
          id: "",
          path: "",
          label: <span>{tu("data_contract")}</span>,
          cmp: () => <Overview />
        },
        resources: {
          id: "",
          path: "",
          label: <span>{tu("data_recourse")}</span>,
          cmp: () => <Overview />
        }
      }
    }));
  }

  render() {
    const { tabs, loading } = this.state;
    return (
      <main className="container header-overlap token_black">
        <div className="">
          <div className="col-md-12 ">
            {loading ? (
              <div className="card">
                <TronLoader>
                  {/* {tu("loading_address")} {contract.address} */}
                </TronLoader>
              </div>
            ) : (
              <Fragment>
                <div className="card mt-3 list-style-body">
                  <div className="card-header list-style-body__header">
                    <ul className="nav nav-tabs card-header-tabs">
                      {Object.values(tabs).map(tab => (
                        <li key={tab.id} className="nav-item">
                          {/* <NavLink
                            exact
                            to={match.url + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} />
                            {tab.label}
                          </NavLink> */}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="card-body p-0 list-style-body__body">
                    <Accounts />
                    <Switch>
                      {/* {Object.values(tabs).map(tab => (
                        <Route
                          key={tab.id}
                          exact
                          path={match.url + tab.path}
                          render={props => <tab.cmp />}
                        />
                      ))} */}
                    </Switch>
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </main>
    );
  }
}

export default BestData;
