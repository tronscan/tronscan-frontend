import React, {Component} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {trim} from "lodash";
import {Sticky, StickyContainer} from "react-sticky";
import {Client} from "../../../services/api";
import Paging from "../../common/Paging";
import {TokenLink} from "../../common/Links";
import {getQueryParam} from "../../../utils/url";
import SearchInput from "../../../utils/SearchInput";
import {toastr} from 'react-redux-toastr'

class TokenList extends Component {

  constructor(props) {
    super(props);


    this.state = {
      tokens: [],
      loading: false,
      total: 0,
      filter: {},
    };

    let nameQuery = trim(getQueryParam(props.location, "search"));
    if (nameQuery.length > 0) {
      this.state.filter.name = `%${nameQuery}%`;
    }
  }

  loadPage = async (page = 1, pageSize = 40) => {
    let {filter} = this.state;
    let {intl} = this.props;
    this.setState({loading: true});

    let {tokens, total} = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: (page - 1) * pageSize,
      ...filter,
    });

    if (tokens.length === 0) {
      toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'record_not_found'}));
    }

    function compare(property) {
      return function (obj1, obj2) {

        if (obj1[property] > obj2[property]) {
          return -1;
        } else if (obj1[property] < obj2[property]) {
          return 1;
        } else {
          return 0;
        }

      }
    }

    //tokens = tokens.sort(compare('issuedPercentage'));
    this.setState({
      loading: false,
      tokens,
      total,
    });
  };

  componentDidMount() {
    this.loadPage();
  }

  setSearch = () => {
    let nameQuery = trim(getQueryParam(this.props.location, "search"));
    if (nameQuery.length > 0) {
      this.setState({
        filter: {
          name: `%${nameQuery}%`,
        }
      });
    } else {
      this.setState({
        filter: {},
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.location !== prevProps.location) {
      this.setSearch();
    }
    if (this.state.filter !== prevState.filter) {
      console.log("SEARCH CHANGED!");
      this.loadPage();
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };
  searchName = (name) => {

    if (name.length > 0) {
      this.setState({
        filter: {
          name: `%${name}%`,
        }
      });
    }
    else {

      if (window.location.hash !== '#/tokens/list')
        window.location.hash = '#/tokens/list';
      else {
        this.setState({
          filter: {},
        });
      }
    }

  }

  render() {

    let {tokens, alert, loading, total} = this.state;
    let {match} = this.props;

    return (
        <main className="container header-overlap">
          {alert}
          {
            <div className="row">
              <div className="col-md-12">
                <StickyContainer>
                  <div className="card">
                    <Sticky>
                      {
                        ({style}) => (
                            <div style={{zIndex: 100, ...style}} className="py-3 bg-white card-body border-bottom">
                              <Paging onChange={this.onChange} loading={loading} url={match.url} total={total}/>
                            </div>
                        )
                      }
                    </Sticky>
                    <div className="table-responsive">
                      <table className="table table-hover m-0 table-striped">
                      <thead className="thead-dark">
                      <tr>
                        <th className="text-nowrap">{tu("name")}
                          <SearchInput search={this.searchName}></SearchInput>
                        </th>
                        <th className="d-md-table-cell" style={{width: 100}}>{tu("abbreviation")}</th>
                        <th className="d-md-table-cell" >{tu("total_supply")}</th>
                        <th className="d-md-table-cell" style={{width: 150}}>{tu("total_issued")}</th>
                        <th className="text-nowrap" style={{width: 150}}>{tu("registered")}</th>
                        {/*<th style={{width: 150}}>{tu("addresses")}</th>*/}
                        {/*<th style={{width: 150}}>{tu("transactions")}</th>*/}
                      </tr>
                      </thead>
                      <tbody>
                      {
                        tokens.map((token, index) => (
                            <tr key={index}>
                              <td className="text-nowrap"><TokenLink name={token.name}/></td>
                              <td className="d-md-table-cell">{token.abbr}</td>
                              <td className="d-md-table-cell"><FormattedNumber value={token.totalSupply}/></td>
                              <td className="d-md-table-cell"><FormattedNumber value={token.issued}/></td>
                              <td>  {
                                  token.issued !== 0 ?
                                      <FormattedNumber value={token.issued}/> :
                                      '-'
                                }
                              </td>
                              <td className="text-nowrap">
                                <FormattedDate value={token.dateCreated}/>{' '}
                                <FormattedTime value={token.dateCreated}/>
                              </td>
                              {/*<td><FormattedNumber value={token.addresses} /></td>*/}
                              {/*<td><FormattedNumber value={token.transactions} /></td>*/}
                            </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    </div>
                  </div>
                </StickyContainer>
              </div>
            </div>
          }
        </main>

    )
  }
}

function mapStateToProps(state) {
  return {
    account: state.app.account,
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(TokenList));
