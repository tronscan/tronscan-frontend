import React, {Component} from "react";
import {Client} from "../../../services/api";
import {TimeAgo} from "react-timeago";
import {FormattedNumber} from "react-intl";
import {TRXPrice} from "../../common/Price";
import {tu} from "../../../utils/i18n";

export default class RichList extends Component {
  constructor() {
    super();

    this.state = {
      richList: [],
      totals: {
        accounts: 0,
        coins: 0,
      }
    }
  }

  componentDidMount() {
    this.load();
  }

  async load() {
    let {data, total} = await Client.getRichList();


    this.setState({
      richList: data,
      totals: total,
    });
  }

  render() {

    let {richList, totals} = this.state;

    return (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-center">
              Rich List
            </h5>
          </div>
          <table className="table table-hover bg-white m-0 table-striped">
            <thead className="thead-dark">
              <tr>
                <th>{tu("balance")}</th>
                <th className="d-none d-lg-table-cell">{tu("addresses")}</th>
                <th className="text-nowrap text-right">% {tu("addresses")}</th>
                <th className="text-right d-none d-md-table-cell">{tu("TRX")}</th>
                <th className="text-right">$ {tu("USD")}</th>
                <th className="text-right  d-none d-md-table-cell">% {tu("Coins")}</th>
              </tr>
            </thead>
            <tbody>
            {
              richList.map((row, index) => (
                <tr key={index}>
                  <th>
                    <FormattedNumber value={row.from}/>{' - '}
                    <FormattedNumber value={row.to} />
                  </th>
                  <td className="d-none d-lg-table-cell">
                    {row.accounts}
                  </td>
                  <td className="text-right text-nowrap" style={{width: 100}}>
                    <FormattedNumber value={(row.accounts / totals.accounts) * 100}
                                     maximumFractionDigits={2}
                                     minimumFractionDigits={2} /> %
                  </td>
                  <td className="text-right text-nowrap d-none d-md-table-cell">
                    <TRXPrice amount={row.balance} />
                  </td>
                  <td className="text-right text-nowrap">
                    <TRXPrice amount={row.balance} currency="USD" />
                  </td>
                  <td className="text-right text-nowrap d-none d-md-table-cell">
                    <FormattedNumber value={(row.balance / totals.coins) * 100}
                                     maximumFractionDigits={4}
                                     minimumFractionDigits={4}/> %
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
