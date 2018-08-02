import React from "react";
import {Sticky, StickyContainer} from "react-sticky";
import Paging from "../../common/Paging";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {AddressLink} from "../../common/Links";
import {Client} from "../../../services/api";


export class TokenHolders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      addresses: [],
      page: 0,
      total: 0,
      pageSize: 25,
    };
  }

  componentDidMount() {

    this.loadTokenHolders();

  }

  componentDidUpdate() {

  }

  onChange = (page, pageSize) => {
    this.loadTokenHolders(page, pageSize);
  };

  loadTokenHolders = async (page = 1, pageSize = 40) => {
    let {filter} = this.props;
    this.setState({loading: true});

    let {addresses, total} = await Client.getTokenHolders(filter.token, {
      sort: '-balance',
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: true
    });

    this.setState({
      page,
      addresses,
      total,
      loading: false,
    });

  };

  render() {
    let {token} = this.props;
    let {addresses, page, total, pageSize, loading} = this.state;
    if (!loading && addresses.length === 0) {
      return (
          <div className="p-3 text-center">{tu("no_holders_found")}</div>
      );
    }
    return (
        <StickyContainer>
          {
            <Sticky>
              {
                ({style}) => (
                    <div style={{zIndex: 100, ...style}} className="card-body bg-white py-3 border-bottom">
                      <Paging onChange={this.onChange} total={total} loading={loading} pageSize={pageSize} page={page}/>
                    </div>
                )
              }
            </Sticky>
          }
          <table className="table table-hover m-0 border-top-0">
            <thead className="thead-dark">
            <tr>
              <th style={{width: 125}}>{tu("address")}</th>
              <th style={{width: 125}}>{tu("quantity")}</th>
              <th style={{width: 125}}>{tu("percentage")}</th>
            </tr>
            </thead>
            <tbody>
            {
              addresses.map((tokenHolder, index) => (
                  <tr key={index}>
                    <td>
                      <AddressLink address={tokenHolder.address}/>
                    </td>
                    <td className="text-nowrap">
                      <FormattedNumber value={tokenHolder.balance}/>&nbsp;
                    </td>
                    <td className="text-nowrap">
                      <FormattedNumber
                          value={(((tokenHolder.balance) / token.totalSupply) * 100)}
                          minimumFractionDigits={4}
                          maximumFractionDigits={8}
                      /> %
                    </td>
                  </tr>
              ))
            }
            </tbody>
          </table>
        </StickyContainer>
    )
  }

}
