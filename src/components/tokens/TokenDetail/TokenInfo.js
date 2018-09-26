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
        <div className="tokenDetail_box">
          <table className="table m-0 tokenDetail">
            <tbody>
            <tr>
              <th style={{borderTop: '0px'}}>{tu("start_date")}:</th>
              <td style={{borderTop: '0px'}}>
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
                <FormattedNumber value={token.price / ONE_TRX} maximumFractionDigits={6}/> TRX
              </td>
            </tr>
            <tr>
              <th>{tu("progress")}:</th>
              <td>
                <FormattedNumber value={token.issuedPercentage}/> %
              </td>
            </tr>
            <tr>
              <th>{tu("total_supply")}:</th>
              <td>
                <FormattedNumber value={token.totalSupply}/>
              </td>
            </tr>
            <tr>
              <th>{tu("circulating_supply")}:</th>
              <td>
                <FormattedNumber value={token.issued}/>
              </td>
            </tr>
            <tr>
              <th>{tu("fund_raised")}:</th>
              <td>
                <FormattedNumber value={token.participated / ONE_TRX}/> TRX
              </td>
            </tr>
            <tr>
              <th>{tu("country")}:</th>
              <td>
                {token.country !== 'no_message' ?
                    <span>{tu(token.country)}</span> :
                    <span>-</span>
                }
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <i className="fa fa-exclamation-circle" aria-hidden="true"
                   style={{color: '#999999', marginRight: '10px'}}></i>
                <span style={{color: '#999999', fontSize: '12px'}}>{tu('change_info')}</span>&nbsp;<a href='mailto:token@tron.network' style={{color:'red',fontSize: '12px'}}>{tu('contact_us')}</a></td>
            </tr>

            </tbody>
          </table>
        </div>

    )
  }
}

export default withTimers(TokenInfo);
