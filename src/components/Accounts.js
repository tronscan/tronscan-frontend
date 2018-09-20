import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter} from "lodash";
import {AddressLink} from "./common/Links";
import {CIRCULATING_SUPPLY, ONE_TRX} from "../constants";
import {TRXPrice} from "./common/Price";
import SmartTable from "./common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./common/loaders";
import xhr from "axios/index";
import {Client} from "../services/api";


class Accounts extends Component {

  constructor() {
    super();

    this.state = {
      loading: true,
      searchString: "",
      accounts: [],
      total: 0,
    }
  }

  componentDidMount() {
    this.loadAccounts();
  }

  loadAccounts = async (page = 1, pageSize = 20) => {

    this.setState({loading: true});

    let { accounts, total } = await Client.getAccounts({
      sort: '-balance',
      limit: pageSize,
      start: (page - 1) * pageSize
    })

    this.setState({
      loading: false,
      accounts: accounts,
      total: total
    });
  };

  componentDidUpdate() {
    //checkPageChanged(this, this.loadAccounts);
  }

  onChange = (page, pageSize) => {
    this.loadAccounts(page, pageSize);
  };
  onSearchFieldChangeHandler = (e) => {
    this.setState({
      searchString: e.target.value,
    });
  };

  filteredAccounts() {
    let {accounts} = this.props;
    let {searchString} = this.state;

    searchString = searchString.toUpperCase();

    if (searchString.length > 0) {
      accounts = filter(accounts, a => a.address.toUpperCase().indexOf(searchString) !== -1);
    }

    return accounts;
  }

  renderAccounts() {

    let {accounts} = this.state;

    if (accounts.length === 0) {
      return;
    }

    return (
        <Fragment>
          <div className="table-responsive">
            <table className="table table-striped m-0">
              <thead className="thead-dark">
              <tr>
                <th>{tu("address")}</th>
                <th className="d-md-table-cell">{tu("supply")}</th>
                <th className="d-md-table-cell">{tu("power")}</th>
                <th>{tu("balance")}</th>
              </tr>
              </thead>
              <tbody>
              {
                accounts.map((account, index) => (
                    <tr key={account.address}>
                      <th>
                        <AddressLink address={account.address}/>
                      </th>
                      <td className="d-md-table-cell text-nowrap">
                        <FormattedNumber
                            value={(((account.balance / ONE_TRX) / CIRCULATING_SUPPLY) * 100)}
                            minimumFractionDigits={8}
                            maximumFractionDigits={8}
                        /> %
                      </td>
                      <td className="text-nowrap d-md-table-cell">
                        <FormattedNumber value={account.power / ONE_TRX}/>
                      </td>
                      <td className="text-nowrap">
                        <TRXPrice amount={account.balance / ONE_TRX}/>
                      </td>
                    </tr>
                ))
              }
              </tbody>
            </table>
          </div>

        </Fragment>
    )
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'address'})),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        className: 'ant_table',
        width: '40%',
        render: (text, record, index) => {
          return <AddressLink address={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'supply'})),
        dataIndex: 'balance',
        key: 'supply',
        align: 'left',
        className: 'ant_table',
        // width: '12%',
        render: (text, record, index) => {
          return <div><FormattedNumber
              value={(((parseInt(text) / ONE_TRX) / CIRCULATING_SUPPLY) * 100)}
              minimumFractionDigits={8}
              maximumFractionDigits={8}
          /> %</div>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'power'})),
        dataIndex: 'power',
        key: 'power',
        align: 'center',
        // width: '15%',
        render: (text, record, index) => {
          return <FormattedNumber value={parseInt(text) / ONE_TRX}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'balance'})),
        dataIndex: 'balance',
        key: 'balance',
        align: 'right',
        className: 'ant_table',
        // width: '15%',
        render: (text, record, index) => {
          return <TRXPrice amount={parseInt(text) / ONE_TRX}/>
        }
      }
    ];
    return column;
  }

  render() {

    let {match, intl} = this.props;
    let {total, loading, accounts} = this.state;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'account_unit'})

    return (
        <main className="container header-overlap pb-3 token_black">
          <div className="row">
            <div className="col-md-12">
              <div className="card h-100 text-center widget-icon accout_unit">
                {/* <WidgetIcon className="fa fa-users text-secondary"/> */}
                <div className="card-body">
                  <h3 className="text-primary">
                    <FormattedNumber value={total}/>
                  </h3>
                  {tu("total_accounts")}
                </div>
              </div>
            </div>

          </div>
          {loading && <div className="loading-style"><TronLoader/></div>}
          <div className="row mt-2">
            <div className="col-md-12 table_pos">
              {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
              <SmartTable bordered={true} loading={loading} column={column} data={accounts} total={total}
                          onPageChange={(page, pageSize) => {
                            this.loadAccounts(page, pageSize)
                          }}/>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    accounts: state.app.accounts,
  };
}

const mapDispatchToProps = {
  loadAccounts,
};


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Accounts))
