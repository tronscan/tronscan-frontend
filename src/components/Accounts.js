import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {loadAccounts} from "../actions/app";
import {tu} from "../utils/i18n";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter} from "lodash";
import {AddressLink} from "./common/Links";
import Paging from "./common/Paging";
import {Client} from "../services/api";
import {CIRCULATING_SUPPLY, ONE_TRX} from "../constants";
import {Sticky, StickyContainer} from "react-sticky";
import {TRXPrice} from "./common/Price";
import {WidgetIcon} from "./common/Icon";
import xhr from "axios/index";

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

  loadAccounts = async (page = 1,pageSize=40) => {

    this.setState({ loading: true });

    // let {accounts, total} = await Client.getAccounts({
    //   sort: '-balance',
    //   limit: pageSize,
    //   start: (page-1) * pageSize,
    // });
      let accountData = await xhr.get("https://assistapi.tronscan.org/api/account?sort=-balance&limit="+ pageSize + "&start=" + (page - 1) * pageSize);
      let accountsTotal = accountData.data.total;
      let accounts = accountData.data.data;
      this.setState({
      loading: false,
      accounts:accounts,
      total:accountsTotal
    });
  };

  componentDidUpdate() {
    //checkPageChanged(this, this.loadAccounts);
  }
  onChange = (page,pageSize) => {
    this.loadAccounts(page,pageSize);
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
                        <AddressLink address={account.address} />
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

  render() {

    let {match} = this.props;
    let {total, loading} = this.state;

    return (
      <main className="container header-overlap pb-3">
        <div className="row">
          <div className="col-md-12">
            <div className="card h-100 text-center widget-icon">
              <WidgetIcon className="fa fa-users text-secondary"  />
              <div className="card-body">
                <h3 className="text-primary">
                  <FormattedNumber value={total}/>
                </h3>
                {tu("total_accounts")}
              </div>
            </div>
          </div>

        </div>
          <div className="row mt-2">
            <div className="col-md-12">
              <StickyContainer>
                <div className="card mt-1">
                  <Sticky>
                    {
                      ({style}) => (
                        <div className="card-body bg-white py-3 border-bottom" style={{zIndex: 100, ...style}}>
                          <Paging onChange={this.onChange} url={match.url} total={total} loading={loading} />
                        </div>
                      )
                    }
                  </Sticky>
                  {this.renderAccounts()}
                </div>
              </StickyContainer>
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
