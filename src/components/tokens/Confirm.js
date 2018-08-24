import React, {Component} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {TextField} from "../../utils/formHelper";
import {filter, trim, some, sumBy} from "lodash";
import {ASSET_ISSUE_COST, ONE_TRX} from "../../constants";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {Alert} from "reactstrap";
import {addDays, addHours, isAfter} from "date-fns";
import "react-datetime/css/react-datetime.css";
import DateTimePicker from "react-datetime";
import {Link} from "react-router-dom";
import {NumberField} from "../common/Fields";
import SweetAlert from "react-bootstrap-sweetalert";
import 'moment/min/locales';

class Confirm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkbox: false,
      ...this.props.state
    };
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };
  submit = () => {
    let {checkbox} = this.state;
    if (checkbox)
      this.props.submit();
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }


  render() {
    let {numberOfCoins, numberOfTron, name, abbr, description, submitMessage, frozenSupply, url, confirmed, loading, issuedAsset, totalSupply, startTime, endTime, showFrozenSupply, checkbox} = this.state;
    let {nextStep} = this.props;
    let exchangeRate = numberOfTron / numberOfCoins;
    console.log(frozenSupply);
    return (

        <main className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">
                    {tu("issue_a_token")}
                  </h4>
                  <p>
                    用户账户中有至少1024TRX，就可以在波场协议上发行通证。
                    通证发行后，会在通证总览页面进行显示。 之后用户可以在发行期限内参与认购，用TRX兑换通证。
                    在发行通证后，您的账户将会收到全部的发行数额。 当其他用户使用TRX兑换您发行的通证，兑换数额将从您的账户扣除，并以指定汇率获得相应数额的TRX。
                  </p>
                  <hr/>
                  <h5 className="card-title">
                    {tu("确认设置")}
                  </h5>
                  <form>
                    <fieldset>

                      <strong>{tu("基本设置")}</strong>
                      <i className="fab fa-wpforms float-right"/>

                      <table className="table confirm">
                        <tbody>
                        <tr>
                          <td className="text-nowrap" style={{borderTop: '0px'}}>{tu("token_name")}:</td>
                          <td style={{borderTop: '0px'}}>{name}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">{tu("token_abbr")}:</td>
                          <td>{abbr}</td>
                        </tr>
                        <tr>
                          <td className="text-nowrap borderBottom">{tu("total_supply")}:</td>
                          <td className="borderBottom">{totalSupply}</td>
                        </tr>

                        </tbody>
                      </table>
                    </fieldset>

                    <fieldset>

                      <strong>{tu("汇率设置")}</strong>
                      <i className="fa fa-exchange-alt float-right"/>

                      <table className="table confirm">
                        <tbody>
                        <tr>
                          <td className="text-nowrap" style={{borderTop: '0px'}}>{tu("token_price")}</td>
                          <td style={{borderTop: '0px'}}> 1 {name || tu("token")} = <FormattedNumber
                              value={exchangeRate}/> TRX
                          </td>
                        </tr>
                        <tr>
                          <td className="text-nowrap">{tu("start_date")}</td>
                          <td><FormattedDate value={startTime}/></td>
                        </tr>
                        <tr>
                          <td className="text-nowrap borderBottom">{tu("end_date")}</td>
                          <td className="borderBottom"><FormattedDate value={endTime}/></td>
                        </tr>

                        </tbody>
                      </table>

                    </fieldset>
                    <fieldset>
                      <strong>{tu("frozen_supply")}</strong>
                      <i className="fa fa-snowflake float-right"/>
                      <br/>
                      {showFrozenSupply &&
                      <div className="form-row mt-2" style={{marginBottom: "-10px"}}>
                        <p className="col-md-6">
                          <label>{tu("amount")}</label>
                        </p>
                        <p className="col-md-6">
                          <label>{tu("days_to_freeze")}</label>
                        </p>
                      </div>
                      }
                      {!showFrozenSupply ?
                          <span>不启用锁仓功能</span> :
                          <table className="table ">
                            <tbody>
                            {
                              frozenSupply.map((frozen, index) => (
                                <tr key={index}>
                                  <td className="text-nowrap borderBottom"><FormattedNumber value={frozen.amount}/></td>
                                  <td className="borderBottom"><FormattedNumber value={frozen.days}/></td>
                                </tr>
                              ))
                            }
                            </tbody>
                          </table>
                      }
                    </fieldset>
                    <hr/>


                    <div className="form-group">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" value={checkbox} onChange={(e) => {
                          this.setState({checkbox: e.target.checked})
                        }}/>
                        <label className="form-check-label">
                          {tu("token_spend_confirm")}
                        </label>
                      </div>
                    </div>
                    <a className="btn btn-danger btn-lg" onClick={() => {
                      nextStep(3)
                    }}>上一步</a>
                    <a className="btn btn-danger btn-lg ml-1" onClick={() => {
                      this.submit();
                    }}>{tu("issue_token")}</a>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    tokens: state.tokens.tokens,
    account: state.app.account,
    wallet: state.wallet.current,
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Confirm));
