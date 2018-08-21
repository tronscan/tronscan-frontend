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
    let {numberOfCoins, numberOfTron, name, abbr, description, submitMessage, frozenSupply, url, confirmed, loading, issuedAsset, totalSupply, startTime, endTime, checkbox} = this.state;
    let {nextStep} = this.props;
    let exchangeRate = numberOfTron / numberOfCoins;

    return (

        <main className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center">
                    {tu("issue_a_token")}
                  </h5>


                  <form>
                    <fieldset>
                      <legend>
                        {tu("details")}
                        <i className="fab fa-wpforms float-right"/>
                      </legend>
                      <table className="table table-hover table-striped bg-white m-0 sr">
                        <tbody>
                        <tr>
                          <th className="text-nowrap">{tu("token_name")}</th>
                          <td>{name}</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("token_abbr")}</th>
                          <td>{abbr}</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("total_supply")}</th>
                          <td>{totalSupply}</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("description")}</th>
                          <td>{description}</td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("url_message")}</th>
                          <td>{url}</td>
                        </tr>
                        </tbody>
                      </table>
                    </fieldset>
                    <hr/>
                    <fieldset>
                      <legend>
                        {tu("exchange_rate")}
                        <i className="fa fa-exchange-alt float-right"/>
                      </legend>
                      <table className="table table-hover table-striped bg-white m-0 sr">
                        <tbody>
                        <tr>
                          <th className="text-nowrap">{tu("token_price")}</th>
                          <td> 1 {name || tu("token")} = <FormattedNumber
                              value={exchangeRate}/> TRX
                          </td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("start_date")}</th>
                          <td><FormattedDate value={startTime}/></td>
                        </tr>
                        <tr>
                          <th className="text-nowrap">{tu("end_date")}</th>
                          <td><FormattedDate value={endTime}/></td>
                        </tr>

                        </tbody>
                      </table>

                    </fieldset>
                    <hr/>
                    <fieldset>
                      <legend>
                        {tu("frozen_supply")}
                        <i className="fa fa-snowflake float-right"/>
                      </legend>
                      <table className="table table-hover table-striped bg-white m-0 sr">
                        <tbody>

                        </tbody>
                      </table>

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
                    <a className="btn btn-danger btn-lg" onClick={()=>{nextStep(3)}}>上一步</a>
                    <a className="btn btn-danger btn-lg" onClick={() => {
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
