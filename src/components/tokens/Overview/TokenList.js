import React, {Component} from 'react';
import {connect} from "react-redux";
import {filter, find, includes, sortBy} from "lodash";
import {loadTokens} from "../../../actions/tokens";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {tu} from "../../../utils/i18n";
import {Sticky, StickyContainer} from "react-sticky";
import {Client} from "../../../services/api";
import {checkPageChanged} from "../../../utils/PagingUtils";
import Paging from "../../common/Paging";
import {TokenLink} from "../../common/Links";

class TokenList extends Component {

  constructor() {
    super();

    this.state = {
      tokens: [],
      loading: false,
      pageSize: 25,
      page: 0,
      total: 0,
    };
  }


  loadPage = async (page = 0) => {

    this.setState({ loading: true });

    let {pageSize} = this.state;

    let {tokens, total} = await Client.getTokens({
      sort: '-name',
      limit: pageSize,
      start: page * pageSize,
    });

    this.setState({
      page,
      loading: false,
      tokens,
      total,
    });
  };

  componentDidMount() {
    this.loadPage();
  }

  componentDidUpdate() {
    checkPageChanged(this, this.loadPage);
  }

  render() {

    let {tokens, alert, loading, pageSize, page, total} = this.state;
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
                        <div style={{ zIndex: 100, ...style }} className="py-3 bg-white card-body border-bottom">
                          <Paging loading={loading} url={match.url} total={total} pageSize={pageSize} page={page}  />
                        </div>
                      )
                    }
                  </Sticky>
                  <table className="table table-hover m-0 table-striped">
                    <thead className="thead-dark">
                      <tr>
                        <th style={{width: 100}}>{tu("name")}</th>
                        <th style={{width: 100}}>{tu("Abbreviation")}</th>
                        <th style={{width: 150}}>{tu("total supply")}</th>
                        <th style={{width: 150}}>{tu("total issued")}</th>
                        <th style={{width: 150}}>{tu("registered")}</th>
                        {/*<th style={{width: 150}}>{tu("addresses")}</th>*/}
                        {/*<th style={{width: 150}}>{tu("transactions")}</th>*/}
                      </tr>
                    </thead>
                    <tbody>
                    {
                      tokens.map(token => (
                        <tr key={token.number}>
                          <td><TokenLink name={token.name} /></td>
                          <td><TokenLink name={token.abbr} /></td>
                          <td><FormattedNumber value={token.totalSupply} /></td>
                          <td><FormattedNumber value={token.issued} /></td>
                          <td>
                            <FormattedDate value={token.dateCreated} />{' '}
                            <FormattedTime value={token.dateCreated} />
                          </td>
                          {/*<td><FormattedNumber value={token.addresses} /></td>*/}
                          {/*<td><FormattedNumber value={token.transactions} /></td>*/}
                        </tr>
                      ))
                    }
                    </tbody>
                  </table>
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
