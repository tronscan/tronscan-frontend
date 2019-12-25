/* eslint-disable no-undef */
import React from "react";
import {connect} from "react-redux";
import { Route, Switch} from "react-router-dom";
import {Client} from "../../../services/api";
import {tu} from "../../../utils/i18n";
import {FormattedDate, FormattedTime} from "react-intl";
import {BlockNumberLink} from "../../common/Links";
import {CopyText} from "../../common/Copy";
import {TronLoader} from "../../common/loaders";
import {Truncate} from "../../common/text";
// import Contract from "../../tools/TransactionViewer/Contract";
import {ContractTypes} from "../../../utils/protocol";
import {Alert} from "reactstrap";
import {setLanguage} from "../../../actions/app"
import queryString from 'query-string';
import tokenApi from '../../../services/tokenApi'
import { IS_MAINNET } from "../../../constants";
import Info from './info';


class Transaction extends React.Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      notFound: false,
      transaction: {
        hash: -1,
        timestamp: 0,
      },
      tabs: {
        contracts: {
          id: "contracts",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("contracts")}</span>,
          cmp: () => <TronLoader/>,
        }
      },
      resMessage: ''
    };
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    let {match,location} = this.props;
    let lang = queryString.parse(location.search).lang;
    if(lang){
        this.props.setLanguage(lang);
    }
    this.load(match.params.hash);
  }

  componentDidUpdate(prevProps) {
    let {match} = this.props;
    if (match.params.hash !== prevProps.match.params.hash) {
      this.load(match.params.hash);
    }
  }

  async load(id) {

    this.setState({loading: true, transaction: {hash: id}});

    let transaction = await Client.getTransactionByHash(id);
    if (!transaction['hash']) {
        this.setState({
            notFound: true,
        });
        return;
    }
    if(transaction && IS_MAINNET){
      const data = await tokenApi.getTransactionInfo(id).catch(e=>{})
      if(data){
        this.setState({
          resMessage: data && data.resMessage
        });
      }
    }

    this.setState({
      loading: false,
      transaction,
      tabs: {
        contracts: {
          id: "contracts",
          icon: "fa fa-exchange-alt",
          path: "",
          label: <span>{tu("contracts")}</span>,
          cmp: () => (
              <Info contract={{
                  ...{cost:transaction.cost},
                  ...transaction.contractData,
                  ...transaction['trigger_info'],
                  ...{internal_transactions: transaction['internal_transactions']},
                  ...{tokenTransferInfo: transaction['tokenTransferInfo']},
                  ...{contract_note:transaction.data},
                  contractType: ContractTypes[transaction.contractType],
              }}/>
          ),
        },
      }
    });
  }

  render() {

    let {transaction, tabs, loading,notFound,resMessage} = this.state;
    let {match} = this.props;
    if (notFound) {
        return (
            <main className="container header-overlap">
              <Alert color="warning" className="text-center">
                  {tu('transaction_not_found')}
              </Alert>
            </main>
        );
    }
    return (
        <main className="container header-overlap">
          {
            loading ? <div className="card">
                  <TronLoader>
                      {tu("loading_transaction")}
                  </TronLoader>
                </div> :
                <div className="row">
                  <div className="col-md-12">
                    <div className="card  list-style-header">
                      <div className="card-body">
                        <h5 className="card-title m-0">
                          <i className="fa fa-hashtag mr-1"></i>
                          {tu("hash")} {transaction.hash}
                        </h5>
                      </div>
                      <div className="table-responsive">
                        <table className="table table-hover m-0">
                          <tbody>
                          {
                              transaction.hasOwnProperty("confirmed") && <tr>
                                  <th>{tu("status")}:</th>
                                  <td>
                                      {
                                          transaction.confirmed ?
                                              <span className="badge badge-success text-uppercase">{tu("Confirmed")}</span> :
                                              <span className="badge badge-danger text-uppercase">{tu("Unconfirmed")}</span>
                                      }
                                  </td>
                              </tr>
                          }
                          {
                              transaction.hasOwnProperty("contractRet") &&<tr>
                                  <th>{tu("result")}:</th>
                                  <td>
                                      {transaction.contractRet} {IS_MAINNET && resMessage ? `(${resMessage})` : ''}
                                  </td>
                              </tr>
                          }

                            <tr>
                              <th>{tu("hash")}:</th>
                              <td>
                                <Truncate>
                                  {transaction.hash}
                                  <CopyText text={transaction.hash} className="ml-1"/>
                                </Truncate>
                              </td>
                            </tr>
                            <tr>
                              <th>{tu("block")}:</th>
                              <td><BlockNumberLink number={transaction.block}/></td>
                            </tr>
                            {
                              transaction.timestamp !== 0 && <tr>
                                <th>{tu("time")}:</th>
                                <td>
                                  <FormattedDate value={transaction.timestamp}/>&nbsp;
                                  <FormattedTime value={transaction.timestamp}
                                                 hour='numeric'
                                                 minute="numeric"
                                                 second='numeric'
                                                 hour12={false}
                                  />&nbsp;
                                  {/*(<TimeAgoI18N date={transaction.timestamp} activeLanguage={activeLanguage}/>)*/}
                                </td>
                              </tr>
                            }
                            {/*{*/}
                              {/*(transaction.data && trim(transaction.data).length > 0) ?*/}
                              {/*<tr>*/}
                                {/*<th>{tu("note")}:</th>*/}
                                {/*<td>*/}
                                  {/*<pre className="border border-grey bg-light-grey m-0 p-2 rounded"*/}
                                      {/*style={{whiteSpace: 'pre-wrap'}}>*/}
                                    {/*{decodeURIComponent(transaction.data)}*/}
                                  {/*</pre>*/}
                                {/*</td>*/}
                              {/*</tr>:<tr></tr>*/}
                            {/*}*/}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="card mt-3  list-style-body">
                      <div className="card-body p-0  list-style-body__body" style={{"overflow":"auto"}}>
                        <Switch>
                          {
                            Object.values(tabs).map(tab => (
                                <Route key={tab.id} exact path={match.url + tab.path} render={(props) => (<tab.cmp/>)}/>
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


function mapStateToProps(state) {

  return {};
}

const mapDispatchToProps = {
    setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
