import React from "react";
import {
  FormattedDate,
  FormattedNumber,
  FormattedRelative,
  FormattedTime,
  injectIntl
} from "react-intl";
import { ONE_TRX } from "../../../constants";
import { tu } from "../../../utils/i18n";
import { withTimers } from "../../../utils/timing";
import { Client } from "../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import { connect } from "react-redux";

class TokenInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTotalSupply: 0
    };
  }

  componentDidMount() {
    this.loadTotalTRXSupply();
  }
  loadTotalTRXSupply = async () => {
    const { funds } = await Client.getBttFundsSupply();
    this.setState({
      currentTotalSupply: parseInt(funds.totalTurnOver)
    });
  };
  render() {
    let { token } = this.props;
    let { currentTotalSupply } = this.state;
    let issued = token.precision
      ? token.issued / Math.pow(10, token.precision)
      : token.issued;
    let currentTotal = token.id == "1002000" ? currentTotalSupply : issued;
    return (
      <div className="tokenDetail_box">
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
                    />
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
                      />
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
                    />
                  </span>
                </td>
              ) : (
                <td>
                  {token.endTime - token.startTime > 1000 ? (
                    <span>
                      <FormattedDate value={token.endTime} />{" "}
                      <FormattedTime
                        value={token.endTime}
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                        hour12={false}
                      />
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
                token.canShow !== 3 && ( */}
                  <button
                    className="btn btn-default btn-xs d-inline-block ml-3"
                    onClick={() => this.preBuyTokens(token)}
                  >
                    {tu("participate")}
                  </button>
                {/* )} */}
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
              {token.id == "1002000" ? (
                <td>
                  
                </td>
              ) : (
                <td>
                  
                </td>
              )}
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

  preBuyTokens = token => {
    let { buyAmount } = this.state;
    let { currentWallet, wallet, intl } = this.props;

    if (!wallet.isOpen) {
      this.setState({
        alert: (
          <SweetAlert
            info
            showConfirm={false}
            // style={{ width: '30rem', height: '18.75rem',left:'50%',marginLeft:'-15rem'}}
          >
            <div className="token-sweet-alert">
              <a
                className="close"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
              </a>
              <span>{tu("login_first")}</span>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                {tu("OK")}
              </button>
            </div>
          </SweetAlert>
        )
      });
      return;
    } else {
      this.setState({
        alert: (
          <SweetAlert
            showConfirm={false}
            // style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
          >
            <div
              className="mt-5 token-sweet-alert"
              style={{ textAlign: "left" }}
            >
              <a
                style={{ float: "right", marginTop: "-45px" }}
                onClick={() => {
                  this.setState({ alert: null });
                }}
              >
                <i className="fa fa-times" ariaHidden="true"></i>
              </a>
              <h5 style={{ color: "black" }}>{tu("buy_token_info")}</h5>
              {token.remaining === 0 && <span> {tu("no_token_to_buy")}</span>}
              <div className="input-group mt-5">
                <input
                  type="number"
                  ref={ref => (this.buyAmount = ref)}
                  className="form-control"
                  max={token.remaining}
                  min={1}
                  onKeyUp={e => {
                    e.target.value = e.target.value.replace(/^0|[^\d*]/g, "");
                  }}
                  onChange={e => {
                    this.onBuyInputChange(
                      e.target.value,
                      ((token.trxNum / token.num) *
                        Math.pow(10, token.precision)) /
                        ONE_TRX,
                      token.remaining
                    );
                  }}
                />
              </div>
              <div className="text-center mt-3 text-muted">
                <b>
                  = <span ref={ref => (this.priceTRX = ref)}>0</span> TRX
                </b>
              </div>
              <button
                className="btn btn-danger btn-block mt-3"
                onClick={() => {
                  this.buyTokens(token);
                }}
              >
                {tu("participate")}
              </button>
            </div>
          </SweetAlert>
        )
      });
    }
  };
}

function mapStateToProps(state) {
  return {
    wallet: state.wallet
  };
}

export default connect(mapStateToProps)(withTimers(TokenInfo));
