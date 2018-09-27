/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {tu} from "../../utils/i18n";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import Paging from "../common/Paging";
import {Sticky, StickyContainer} from "react-sticky";
import {Truncate} from "../common/text";
import SearchInput from "../../utils/SearchInput";
import SmartTable from "./Contract/SmartTable";

class Contracts extends React.Component {

  constructor() {
    super();

    this.state = {
      contracts: [],
      total: 0,
    };
  }

  componentDidMount() {
    this.loadContracts();
  }

  componentDidUpdate() {
    //checkPageChanged(this, this.loadContracts);
  }

  onChange = (page, pageSize) => {
    this.loadContracts(page, pageSize);
  };
  search = () => {
    console.log("searching");
  }
  loadContracts = async (page = 1, pageSize = 40) => {

    let result = await Client.getContracts({
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize
    });
    console.log(result);
    this.setState({
      contracts: result.data,
      loading: false,
      total: result.total
    });
  };

  render() {

    let {contracts, total, loading} = this.state;
    let {match} = this.props;

    return (
        <main className="container header-overlap pb-3">
          <div className="row">
            <div className="col-md-12">

              <StickyContainer>
                <div className="card">
                  {
                    <Fragment>
                      <Sticky>
                        {
                          ({style}) => (
                              <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                                <Paging onChange={this.onChange} loading={loading} url={match.url} total={total}/>
                              </div>
                          )
                        }
                      </Sticky>
                      {/*<SmartTable column={column}/>*/}

                      <table className="table table-hover table-striped m-0 transactions-table">
                        <thead className="thead-dark">
                        <tr>
                          <th style={{width: 150}}>{tu("address")}</th>
                          <th className="d-none d-md-table-cell">{tu("contract_name")}
                          <SearchInput search={this.search}></SearchInput>
                          </th>
                          <th className="d-none d-lg-table-cell">{tu("compiler")}</th>
                          <th className="d-none d-sm-table-cell">{tu("balance")}</th>
                          <th className="d-none d-md-table-cell">{tu("tx_count")}</th>
                          <th className="d-none d-md-table-cell">{tu("value")}
                          </th>
                          <th className="d-none d-sm-table-cell">{tu("setting")}</th>
                          <th className="d-none d-sm-table-cell">{tu("date_verified")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                          contracts.map((contract) => (
                              <tr key={contract.address}>
                                <th>
                                  <Truncate>
                                    <AddressLink address={contract.address} isContract={true}>{contract.address}</AddressLink>
                                  </Truncate>
                                </th>
                                <td className="d-none d-md-table-cell">
                                  {contract.name}
                                </td>
                                <td className="text-nowrap d-none d-lg-table-cell">
                                  {contract.compiler}
                                </td>
                                <td className="d-none d-sm-table-cell">
                                  <FormattedNumber value={contract.balance}/>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <FormattedNumber value={contract.trxCount}/>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <FormattedNumber value={contract.trxAmount}/>
                                </td>
                                <td className="d-none d-md-table-cell">
                                  {
                                    contract.isSetting &&
                                    <i className="fa fa-cog"></i>
                                  }
                                </td>
                                <td className="d-none d-md-table-cell">
                                  <FormattedDate value={contract.dateVerified}/>{' '}
                                  <FormattedTime value={contract.dateVerified}/>
                                </td>
                              </tr>
                          ))
                        }
                        </tbody>
                      </table>

                    </Fragment>
                  }
                </div>
              </StickyContainer>
            </div>
          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {

  return {};
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(Contracts);
