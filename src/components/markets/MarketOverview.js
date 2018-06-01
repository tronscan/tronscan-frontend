import React, {Component} from "react";
import {tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, ExternalLink} from "../common/Links";
import {TimeAgo} from "react-timeago";
import {FormattedNumber} from "react-intl";
import {TRXPrice} from "../common/Price";

export default class MarketOverview extends Component {
  constructor() {
    super();

    this.state = {
      markets: [],
    }
  }

  componentDidMount() {
    // this.load();
  }

  async load() {
    let markets = await Client.getMarkets();

    this.setState({
      markets,
    });
  }

  render() {

    let {markets} = this.props;

    markets = markets.slice(0, 15);

    return (
        <div className="card">
          <table className="table table-hover bg-white m-0 table-striped">
            <thead className="thead-dark">
              <tr>
                <th style={{width: 25}}>{tu("rank")}</th>
                <th>{tu("name")}</th>
                <th style={{width: 100}}>{tu("pair")}</th>
                <th className="d-none d-sm-table-cell" style={{width: 125}}>{tu("volume")}</th>
                <th className="d-none d-md-table-cell" style={{width: 75}}>%</th>
                <th className="text-right" style={{width: 100}}>{tu("price")}</th>
              </tr>
            </thead>
            <tbody>
            {
              markets.map(market => (
                <tr key={market.rank}>
                  <th>
                    {market.rank}
                  </th>
                  <td>
                    <ExternalLink url={market.link}>{market.name}</ExternalLink>
                  </td>
                  <td className="" style={{width: 100}}>
                    <ExternalLink url={market.link}>{market.pair}</ExternalLink>
                  </td>
                  <td className="text-nowrap d-none d-sm-table-cell">
                    <TRXPrice amount={market.volumeNative} />
                  </td>
                  <td className="text-nowrap d-none d-md-table-cell">
                    <FormattedNumber value={market.volumePercentage} maximumFractionDigits={2} />%
                  </td>
                  <td className="text-right">
                    $<FormattedNumber value={market.price} maximumFractionDigits={8} />
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
    )
  }
}
