import React, { Fragment } from "react";
import { tu, t } from "../../../utils/i18n";
import { TronLoader } from "../../common/loaders";
import { NavLink, Route, Switch } from "react-router-dom";
import {
  injectIntl,
  FormattedDate,
  FormattedNumber,
  FormattedTime
} from "react-intl";
import Clinet from "../../../services/dataApi";
import Overview from "./Overview";
import Accounts from "./Accounts";

class BestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      time: 1,
      times: [1, 2, 3],
      types: {
        overview: "",
        account: "1,2,3,4,5,6",
        token: "7,8,9,10",
        coutract: "11,12,13",
        resource: ""
      }
    };
  }
  componentDidMount() {
    this.setTabs();
    this.getData();
  }
  setTabs() {
    this.setState(prevProps => ({
      tabs: {
        ...prevProps.tabs,
        overview: {
          id: "overview",
          path: "",
          label: <span>{tu("data_overview")}</span>,
          cmp: () => <Overview />
        },
        account: {
          id: "account",
          path: "/account",
          label: <span>{tu("data_account")}</span>,
          cmp: () => <Accounts />
        },
        token: {
          id: "token",
          path: "/token",
          label: <span>{tu("data_token")}</span>,
          cmp: () => ""
        },
        contract: {
          id: "contract",
          path: "/coutract",
          label: <span>{tu("data_contract")}</span>,
          cmp: () => ""
        },
        resource: {
          id: "resource",
          path: "/resource",
          label: <span>{tu("data_recourse")}</span>,
          cmp: () => ""
        }
      }
    }));
  }
  async getData() {
    const { types } = this.state;
    const { match } = this.props;

    this.setState({
      loading: true
    });
    const { time } = this.state;
    const data = await Clinet.getTop10Data({
      type: types[match.params.name || "overview"],
      time: time
    }).catch(e => {
      this.setState({
        data: null,
        loading: false
      });
    });
    // console.log(data)
    this.setState({
      data,
      loading: false
    });
  }
  changeTime(v) {
    this.setState(
      {
        time: v
      },
      () => {
        this.getData();
      }
    );
  }
  render() {
    const { tabs, loading, times, time } = this.state;
    const { match, intl } = this.props;
    return (
      <main className="container header-overlap token_black">
        <div className="row">
          <div className="col-md-12 ">
            <Fragment>
              <div className="card mt-3 list-style-body">
                <div className="card-header list-style-body__header">
                  <ul className="nav nav-tabs card-header-tabs">
                    {tabs &&
                      Object.values(tabs).map(tab => (
                        <li key={tab.id} className="nav-item">
                          <NavLink
                            exact
                            to={"/blockchain/data" + tab.path}
                            className="nav-link text-dark"
                          >
                            <i className={tab.icon + " mr-2"} />
                            {tab.label}
                          </NavLink>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="time-filter">
                  <ul>
                    {times.map(v => (
                      <li
                        key={v}
                        className={time == v && "active"}
                        onClick={() => this.changeTime(v)}
                      >
                        {t(`data_time${v}`)}
                      </li>
                    ))}
                  </ul>
                </div>
                {loading ? (
                  <div className="card">
                    <TronLoader>
                      {/* {tu("loading_address")} {contract.address} */}
                    </TronLoader>
                  </div>
                ) : (
                  <div className="card-body p-0 list-style-body__body">
                    <Switch>
                      {tabs &&
                        Object.values(tabs).map(tab => (
                          <Route
                            key={tab.id}
                            exact
                            path={"/blockchain/data" + tab.path}
                            render={props => <tab.cmp />}
                          />
                        ))}
                    </Switch>
                  </div>
                )}
              </div>
            </Fragment>
          </div>
        </div>
      </main>
    );
  }
}

export default injectIntl(BestData);
