import React, {Fragment} from "react";
import {tu,t} from "../../../utils/i18n";
import { connect } from 'react-redux';
import {Client, proposalApi} from "../../../services/api";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {ONE_TRX,IS_MAINNET} from "../../../constants";
import {NavLink, Route, Switch, Link, withRouter} from "react-router-dom";
import {upperFirst} from 'lodash'
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
          total: 0
      };
  }
  componentWillMount(){
    let { account, currentWallet } = this.props;
    if(!account || !(currentWallet && currentWallet.representative && currentWallet.representative.enabled)){
      this.props.history.push('/proposals')
    }
  }
  componentDidMount() {
    this.load();
  }
  componentDidUpdate(prevProps){
    let { account } = this.props
    if(prevProps.account.address != account.address){
      this.props.history.push('/proposals')
    }
    
}
  load = async (page = 1, pageSize = 20) => {
      let { account, currentWallet } = this.props;
      this.setState({ loading: true });
      let { data, total } = await proposalApi.getMyProposalList({
          limit: pageSize,
          start: (page - 1) * pageSize,
          address: account.address
      });
      
      this.setState({
          loading: false,
          total,
      });
  };
  render(){
    let {tabs, loading, total} = this.state;
    let {activeLanguage, match} = this.props;
    return(
      <main className="container header-overlap committee">
          {
            loading ? <div className="card">
                  <TronLoader>
                  </TronLoader>
                </div> :
                <div>
                  {
                    total > 0 ? 
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
                    :
                    <div className="my-proposals-empty">
                      <img src={require('../../../images/proposals/tron-empty.svg')} alt=""/>
                      <div>
                        {t('trc20_no_data')},
                        {t('proposal_go')}
                        <Link to="/proposalscreate">{t('proposal_create')}</Link>
                        {t('proposal_or')}
                        <Link to="/proposals">{t('proposal_vote_link')}</Link>
                      </div>
                    </div>
                  }
                </div>
                
          }

        </main>
    )
  }
}


function mapStateToProps(state) {
  return {
      account: state.app.account,
      currentWallet: state.wallet.current
  };
}

export default connect(mapStateToProps, null)(withRouter(injectIntl(MyProposals)));