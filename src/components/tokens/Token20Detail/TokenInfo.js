import React from "react";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {ONE_TRX} from "../../../constants";
import {tu} from "../../../utils/i18n";
import {AddressLink, ExternalLink} from "../../common/Links";
import {withTimers} from "../../../utils/timing";
import {toThousands} from "../../../utils/number";

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
                <span>{token.issue_time}</span>
               {/*<FormattedDate value={token.issue_time}/>*/}
              </td>
            </tr>
            <tr>
              <th>{tu("total_supply")}:</th>
              <td>
                <div>
                    {/*<FormattedNumber value={token.total_supply_with_decimals / (Math.pow(10,token.decimals))} maximumFractionDigits={token.decimals}/>*/}
                  <span>{toThousands(parseFloat(token.total_supply_with_decimals / (Math.pow(10,token.decimals))).toFixed(token.decimals))}</span>
                  <span className="ml-1">{token.symbol}</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>{tu("issuer")}:</th>
              <td>
                  {
                      token.issue_address?
                          <AddressLink address={token.issue_address} /> :
                          <span style={{color: '#d8d8d8'}}>-</span>
                  }

              </td>
            </tr>
            {/*<tr>*/}
              {/*<td colSpan="2">*/}
                {/*<i className="fa fa-exclamation-circle" aria-hidden="true"*/}
                   {/*style={{color: '#999999', marginRight: '10px'}}></i>*/}
                {/*<span style={{color: '#999999', fontSize: '12px'}}>{tu('change_info')}</span>&nbsp;<a href='mailto:token@tronscan.org' style={{color:'red',fontSize: '12px'}}>{tu('contact_us')}</a></td>*/}
            {/*</tr>*/}

            </tbody>
          </table>
        </div>

    )
  }
}

export default withTimers(TokenInfo);
