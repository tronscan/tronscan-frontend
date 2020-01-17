import React, { Fragment } from "react";
import { tu, t } from "../../../utils/i18n";
import { TronLoader } from "../../common/loaders";
import { NavLink, Route, Switch } from "react-router-dom";
import {
  injectIntl,
 
} from "react-intl";
import moment from 'moment';
import BigNumber from "bignumber.js";
import Clinet from "../../../services/dataApi";
import Overview from "./Overview";
import Accounts from "./Accounts";
import Tokens from "./Tokens";
import Contracts from "./Contracts";
import DataResources from "./Resources";

class BestData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      time: 1,
      times: [1, 2, 3],
      types: {
        overview: "0",
        account: "1,2,3,4,5,6",
        token: "7,8,9,10",
        contract: "11,12,13",
        resource: "14,15"
      },
      currentTime:`${moment().subtract(1,'hours').format("YYYY-MM-DD HH:mm:ss")}~${moment().format("HH:mm:ss")}`

      // tabs: {

      // },
    };
  }
  componentDidMount() {
    let { match } = this.props;
    this.getData(match.params.name);
  }
  componentDidUpdate(prevProps) {
    let { match } = this.props;
    console.log("match.params.name", match.params.name);
    console.log("prevProps.match.params.name", prevProps.match.params.name);
    if (match.params.name !== prevProps.match.params.name) {
      this.getData(match.params.name);
    }
  }


  setTabs(data, time) {
    this.setState(prevProps => ({
      tabs: {
        ...prevProps.tabs,
        overview: {
          id: "overview",
          path: "",
          label: <span>{tu("data_overview")}</span>,
          cmp: () => <Overview topData={data} topTime={time} />
        },
        account: {
          id: "account",
          path: "/account",
          label: <span>{tu("data_account")}</span>,
          cmp: () => <Accounts topData={data} />
        },
        token: {
          id: "token",
          path: "/token",
          label: <span>{tu("data_token")}</span>,
          cmp: () => <Tokens topData={data} />
        },
        contract: {
          id: "contract",
          path: "/contract",
          label: <span>{tu("data_contract")}</span>,
          cmp: () => <Contracts topData={data} />
        },
        resource: {
          id: "resource",
          path: "/resource",
          label: <span>{tu("data_recourse")}</span>,
          cmp: () => <DataResources topData={data} />
        }
      }
    }));
  }

  async getData(name) {
    const { types } = this.state;
    this.setState({
      loading: true
    });
    const { time } = this.state;
    console.log("name", name);
    const data = await Clinet.getTop10Data({
      type: types[name || "overview"],
      time: time
    }).catch(e => {
      this.setState({
        data: null,
        loading: false
      });
    });
    if (name === "resource" && data) {
      data.forEach(res => {
        res.data.forEach((result, ind) => {
          result.rank = ind + 1;
        });
      });
      this.dataResourcesEnergyFun(data);
      this.bandwithColumnsFooter(data);
    }
    this.setTabs(data, time);

    this.setState({
      data,
      loading: false
    });
  }

  changeTime(v) {
    let { match } = this.props;
    let currentTime;
    if(v===1){
        currentTime=`${moment().subtract(1,'hours').format("YYYY-MM-DD HH:mm:ss")}~${moment().format("HH:mm:ss")}`
    }else if(v === 2){
      currentTime=`${moment().subtract(1,'day').format("YYYY-MM-DD HH:mm:ss")}~${moment().format("YYYY-MM-DD HH:mm:ss")}`
    }else if(v === 3){
      currentTime=`${moment().subtract(7,'days').format("YYYY-MM-DD HH:mm:ss")}~${moment().format("YYYY-MM-DD HH:mm:ss")}`
    }
    this.setState(
      {
        time: v,
        currentTime
      },
      () => {
        this.getData(match.params.name);
      }
    );
  }

  sumArr(arr) {
    return arr.reduce(function(prev, cur) {
      return new BigNumber(prev).plus(new BigNumber(cur)).toString();
    }, 0);
  }

  dataResourcesEnergyFun(topData) {
    let energyData;
    if (topData.length == 0) return;
    if (topData.length > 0) {
      energyData = topData[0].data || [];
    }
    let totalEnergyUseAry = [],
      totalEnergyBurn = [],
      totalWholeEnergyUse = [],
      totalPercentage = [];
    energyData.forEach(res => {
      totalEnergyUseAry.push(res.energy_use);
      totalEnergyBurn.push(res.energy_burn);
      totalWholeEnergyUse.push(res.whole_energy_use);
      totalPercentage.push(res.percentage);
    });
    topData[0].data.push({
      rank: "111111",
      address: "",
      energy_use: this.sumArr(totalEnergyUseAry) || 0,
      energy_burn: this.sumArr(totalEnergyBurn) || 0,
      whole_energy_use: this.sumArr(totalWholeEnergyUse) || 0,
      percentage: this.sumArr(totalPercentage) || 0
    });
  }

  bandwithColumnsFooter = (topData) => {
    let bandWithData;
    if (topData.length == 0) return;
    if (topData.length > 0) {
      bandWithData = topData[1].data || [];
    }
    let totalNetUseAry = [],
      totalNetBurn = [],
      totalWholeNetyUse = [],
      totalPercentage = [];
    bandWithData.forEach(res => {
      totalNetUseAry.push(res.net_use);
      totalNetBurn.push(res.net_burn);
      totalWholeNetyUse.push(res.whole_net_use);
      totalPercentage.push(res.percentage);
    });
    topData[1].data.push({
      rank: "111111",
      address: "",
      net_use: this.sumArr(totalNetUseAry) || 0,
      net_burn: this.sumArr(totalNetBurn) || 0,
      whole_net_use: this.sumArr(totalWholeNetyUse) || 0,
      percentage: this.sumArr(totalPercentage) || 0
    });
  };

  render() {
    const { tabs, loading, times, time,currentTime } = this.state;
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
                        <li
                          key={tab.id}
                          className="nav-item"
                          // onClick={() => this.getData(tab.id)}
                        >
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
                <div className="card-body p-0  list-style-body__body">
                  <div className="pb-5">
                    <div className="time-filter d-flex justify-content-between">
                      <ul>
                        {times.map((v, ind) => (
                          <li
                            key={ind}
                            className={time == v ? "active" : ""}
                            onClick={() => this.changeTime(v)}
                          >
                            {t(`data_time${v}`)}
                          </li>
                        ))}
                      </ul>
                      <div>{currentTime}</div>
                    </div>
                    {loading && (
                      <div className="loading-style">
                        <TronLoader />
                      </div>
                    )}
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
                </div>
              </div>
            </Fragment>
          </div>
        </div>
      </main>
    );
  }
}
export default injectIntl(BestData);
