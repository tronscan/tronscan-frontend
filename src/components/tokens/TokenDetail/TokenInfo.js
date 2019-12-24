import React from "react";
import {
  FormattedDate,
  FormattedNumber,
  FormattedRelative,
  FormattedTime,
  injectIntl
} from "react-intl";
import { ONE_TRX } from "../../../constants";
import { tu, t } from "../../../utils/i18n";
import { withTimers } from "../../../utils/timing";
import { Client } from "../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux";
import { transactionResultManager } from "../../../utils/tron";
import Lockr from "lockr";
import { withTronWeb } from "../../../utils/tronWeb";
import { reloadWallet } from "../../../actions/wallet";
import { isEqual } from "lodash";
import Participate from "./Participate";
import ApiClientToken from "../../../services/tokenApi";

// @withTimers
@withTronWeb
class TokenInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTotalSupply: 0,
      alert: null,
      buyAmount: 0,
      participateassetissueTotal: 0
    };
  }

  componentDidMount() {
    this.loadTotalTRXSupply();
    this.loadParticipateassetissue();
  }
  // shouldComponentUpdate(nextProps) {
  //   if (
  //     nextProps.activeLanguage !== this.props.activeLanguage ||
  //     this.state.alert
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }
  async loadParticipateassetissue() {
    let { token } = this.props;
    let params = {
      id: token.id,
      limit: 1
    };
    let data = await ApiClientToken.getParticipateassetissue(params);

    this.setState({
      participateassetissueTotal: data && data.total
    });
  }
  loadTotalTRXSupply = async () => {
    const { funds } = await Client.getBttFundsSupply();
    this.setState({
      currentTotalSupply: parseInt(funds.totalTurnOver)
    });
  };
  render() {
    let { token } = this.props;
    let { currentTotalSupply, alert, participateassetissueTotal } = this.state;
    let issued = token.precision
      ? token.issued / Math.pow(10, token.precision)
      : token.issued;
    let currentTotal = token.id == "1002000" ? currentTotalSupply : issued;
    return (
      <div className="tokenDetail_box">
        {alert}
        <table className="table m-0 tokenDetail">
          <tbody>
            <tr>
              <th style={{ borderTop: "0px" }}>{tu("start_time")}:</th>
              {token.id == "1002000" ? (
                <td style={{ borderTop: "0px" }}>
                  <span>
                    <FormattedDate value={1548658800000} />{" "}
                    <FormattedTime
                      value={1548658800000}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    />{" "}
                    UTC
                  </span>
                </td>
              ) : (
                <td style={{ borderTop: "0px" }}>
                  {token.endTime - token.startTime > 1000 ? (
                    <span>
                      <FormattedDate value={token.startTime} />{" "}
                      <FormattedTime
                        value={token.startTime}
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                        hour12={false}
                      />{" "}
                      UTC
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              )}
            </tr>
            <tr>
              <th>{tu("end_time")}:</th>
              {token.id == "1002000" ? (
                <td>
                  <span>
                    <FormattedDate value={1548659681000} />{" "}
                    <FormattedTime
                      value={1548659681000}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    />{" "}
                    UTC
                  </span>
                </td>
              ) : (
                <td>
                  {token.endTime - token.startTime > 1000 ? (
                    <span style={{ float: "left" }}>
                      <FormattedDate value={token.endTime} />{" "}
                      <FormattedTime
                        value={token.endTime}
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                        hour12={false}
                      />{" "}
                      UTC
                    </span>
                  ) : (
                    "-"
                  )}
                  {/* {!(
                    token.endTime < new Date() ||
                    token.issuedPercentage === 100 ||
                    token.startTime > new Date() ||
                    token.isBlack
                  ) &&
                    token.canShow !== 3 && <Participate token={token} />} */}
                </td>
              )}
            </tr>
            <tr>
              <th>{tu("token_price_issue")}:</th>
              {token.id == "1002000" ? (
                <td>
                  <FormattedNumber
                    value={0.00447261}
                    maximumFractionDigits={8}
                  />{" "}
                  TRX <br />
                  <FormattedNumber
                    value={0.00001824}
                    maximumFractionDigits={8}
                  />{" "}
                  BNB
                </td>
              ) : (
                <td>
                  <FormattedNumber
                    value={
                      ((token.trxNum / token.num) *
                        Math.pow(10, token.precision)) /
                      ONE_TRX
                    }
                    maximumFractionDigits={6}
                  />{" "}
                  TRX
                </td>
              )}
            </tr>
            <tr>
              <th>{tu("progress")}:</th>
              <td>
                <FormattedNumber value={token.issuedPercentage} /> %
              </td>
            </tr>
            <tr>
              <th>{tu("token_Participants")}:</th>
              {
                <td>
                  {participateassetissueTotal}{" "}{tu("address")}
                </td>
              }
            </tr>
            <tr>
              <th>{tu("fund_raised")}:</th>
              {token.id == "1002000" ? (
                <td>
                  <FormattedNumber value={159403820.4} /> TRX
                </td>
              ) : (
                <td>
                  <FormattedNumber value={token.participated / ONE_TRX} /> TRX
                </td>
              )}
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
    );
  }
}

export default TokenInfo;
