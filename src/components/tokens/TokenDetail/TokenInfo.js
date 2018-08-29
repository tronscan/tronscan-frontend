import React from "react";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {ONE_TRX} from "../../../constants";
import {tu} from "../../../utils/i18n";
import {withTimers} from "../../../utils/timing";

class TokenInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let token = this.props.token;
    return (

        <table className="table m-0 tokenDetail">
          <tbody>
          <tr>
            <th style={{borderTop:'0px'}}>{tu("start_date")}:</th>
            <td style={{borderTop:'0px'}}>
              <FormattedDate value={token.startTime}/>{' '}
              <FormattedTime value={token.startTime}/>
            </td>
          </tr>
          <tr>
            <th>{tu("end_date")}:</th>
            <td>
              <FormattedDate value={token.endTime}/>{' '}
              <FormattedTime value={token.endTime}/>
            </td>
          </tr>
          <tr>
            <th>{tu("price")}:</th>
            <td>
              <FormattedNumber value={token.price / ONE_TRX}/> TRX
            </td>
          </tr>
          <tr>
            <th>{tu("progress")}:</th>
            <td>
              <FormattedNumber value={token.percentage}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("total_supply")}:</th>
            <td>
              <FormattedNumber value={token.totalSupply}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("issued")}:</th>
            <td>
              <FormattedNumber value={token.issued}/> %
            </td>
          </tr>
          <tr>
            <th>{tu("fund_raised")}:</th>
            <td>
              <FormattedNumber value={token.issued * token.price / ONE_TRX}/> TRX
            </td>
          </tr>
          <tr>
            <th>{tu("country")}:</th>
            <td>

            </td>
          </tr>

          </tbody>
        </table>

    )
  }
}

export default withTimers(TokenInfo);
