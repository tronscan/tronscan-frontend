import React, {Fragment} from "react";
import {tu,t} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {ONE_TRX,IS_MAINNET} from "../../../constants";
import {NavLink, Route, Switch} from "react-router-dom";
import {upperFirst} from 'lodash'
import {Link} from "react-router-dom";
import MyInitiated from './MyInitiated'
import MyParticipated from './MyParticipated'

class MyProposals extends React.Component {

  constructor() {
      super();
      this.state = {
          loading:false,
          tabs: {
            myInitiated: {
              id: "myInitiated",
              icon: "fa fa-exchange-alt",
              path: "",
              label: <span>{tu("proposal_my_initiate")}</span>,
              cmp: () => <MyInitiated/>,
            },
            myParticipated: {
              id: "myParticipated",
              icon: "fa fa-handshake",
              path: "/myparticipated",
              label: <span>{tu("proposal_my_participate")}</span>,
              cmp: () => <MyParticipated/>,
            },
          },
      };
  }

  componentDidMount() {
    // let {match} = this.props;
    // this.load(match.params.id)
  }

  render(){
    let {tabs, loading} = this.state;
    let {activeLanguage, match} = this.props;
    return(
      <main className="container header-overlap committee">
          {
            loading ? <div className="card">
                  <TronLoader>
                  </TronLoader>
                </div> :
                <div className="row proposal-table my-proposals-table">
                  <div className="col-md-12 ">
                    <div className="">
                      <div className="card-header list-style-body__header">
                        <ul className="nav nav-tabs card-header-tabs">
                          {
                            Object.values(tabs).map(tab => (
                                <li key={tab.id} className="nav-item">
                                  <NavLink exact to={match.url + tab.path} className="nav-link text-dark">
                                    {tab.label}
                                  </NavLink>
                                </li>
                            ))
                          }
                        </ul>
                      </div>
                      <div className="card-body p-0 token_black">
                        <Switch>
                          {
                            Object.values(tabs).map(tab => (
                                <Route key={tab.id} exact path={match.url + tab.path}
                                       render={(props) => (<tab.cmp />)}/>
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

export default injectIntl(MyProposals);