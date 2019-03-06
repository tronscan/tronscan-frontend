import React from "react";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {ONE_TRX} from "../../../constants";
import {tu} from "../../../utils/i18n";
import {withTimers} from "../../../utils/timing";
import {Client} from "../../../services/api";


class TokenInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadTotalTRXSupply();
  }
  loadTotalTRXSupply = async() =>{
      const {funds} = await Client.getBttFundsSupply();
      this.setState({
          currentTotalSupply:parseInt(funds.totalTurnOver),
      });
  }
  render() {
    let {token} = this.props;
    let { currentTotalSupply } = this.state;
      let  issued = token.precision ? token.issued / Math.pow(10,token.precision) :token.issued
      let currentTotal =  currentTotalSupply ? currentTotalSupply : issued;
      console.log('currentTotalSupply',currentTotalSupply)
    console.log('token',token)
    return (
        <div className="tokenDetail_box">
          <table className="table m-0 tokenDetail">
            <tbody>
            <tr>
              <th style={{borderTop: '0px'}}>{tu("start_date")}:</th>
              {
                token.id == '1002000'? <td style={{borderTop: '0px'}}>
                      <span><FormattedDate value={1548658800000}/>{' '}<FormattedTime value={1548658800000}/></span>
                    </td>:
                    <td style={{borderTop: '0px'}}>
                        {token.endTime - token.startTime >1000 ? <span><FormattedDate value={token.startTime}/>{' '}<FormattedTime value={token.startTime}/></span>:"-"}
                    </td>

              }

            </tr>
            <tr>
              <th>{tu("end_date")}:</th>
                {
                    token.id == '1002000'? <td>
                          <span><FormattedDate value={1548659681000}/>{' '}<FormattedTime value={1548659681000}/></span>
                    </td>:
                    <td>
                    {token.endTime - token.startTime >1000 ? <span><FormattedDate value={token.endTime}/>{' '}<FormattedTime value={token.endTime}/></span>:"-"}
                    </td>
                }

            </tr>
            <tr>
              <th>{tu("price")}:</th>
                {
                    token.id == '1002000'? <td>
                      <FormattedNumber value={0.00447261} maximumFractionDigits={8}/> TRX <br/>
                      <FormattedNumber value={ 0.00001824} maximumFractionDigits={8}/> BNB
                    </td>:
                    <td>
                      <FormattedNumber value={((token.trxNum / token.num)*Math.pow(10, token.precision))/ONE_TRX} maximumFractionDigits={6}/> TRX
                    </td>
                }

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
                <FormattedNumber value={token.precision ? token.totalSupply / Math.pow(10,token.precision) :token.totalSupply}/>
              </td>
            </tr>
            <tr>
              <th>{tu("circulating_supply")}:</th>
              <td>
                <FormattedNumber  value={currentTotal}/>
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
                    <span>{ tu(token.country)} </span>:
                    <span>
                      {
                          token.id == 1002000? <span>
                           { tu('Singapore')}
                          </span> : <span>
                                 -
                              </span>
                      }
                    </span>
                }
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <i className="fa fa-exclamation-circle" aria-hidden="true"
                   style={{color: '#999999', marginRight: '10px'}}></i>
                <span style={{color: '#999999', fontSize: '12px'}}>{tu('change_info')}</span>&nbsp;<a href='mailto:token@tronscan.org' style={{color:'red',fontSize: '12px'}}>{tu('contact_us')}</a></td>
            </tr>

            </tbody>
          </table>
        </div>

    )
  }
}

export default withTimers(TokenInfo);
