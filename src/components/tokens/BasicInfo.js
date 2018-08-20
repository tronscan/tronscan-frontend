import React, {Component, Fragment} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
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
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import {NavLink, Route, Switch} from "react-router-dom";

function ErrorLabel(error) {
  if (error !== null) {
    return (
        <small className="text-danger"> {error} </small>
    )
  }

  return null;
}

export class BasicInfo extends Component {

  constructor() {
    super();

    let startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    let endTime = new Date();
    endTime.setHours(0, 0, 0, 0);
    endTime.setDate(startTime.getDate() + 90);

    this.state = {
      privateKey: "",
      name: "",
      abbr: "",
      totalSupply: 100000,
      numberOfCoins: 1,
      numberOfTron: 1,
      startTime: startTime,
      endTime: endTime,
      description: "",
      url: "http://",
      confirmed: false,
      loading: false,
      isTokenCreated: false,
      minimumDate: Date.now,
      issuedAsset: null,
      errors: {
        name: null,
        supply: null,
        description: null,
        url: null,
        tronAmount: null,
        tokenAmount: null,
        startDate: null,
        endDate: null,
        abbr: null,
      },

      valid: false,
      submitMessage: null,
      frozenSupply: [],
    };
  }

  hideModal = () => {
    this.setState({
      modal: null,
    });
  };



  isValid = () => {

    let {loading, name, abbr, totalSupply, numberOfCoins, numberOfTron, startTime, endTime, description, url, confirmed} = this.state;


    let newErrors = {
      name: null,
      supply: null,
      description: null,
      url: null,
      tronAmount: null,
      tokenAmount: null,
      startDate: null,
      endDate: null,
    };

    if (loading) {
      return {
        errors: newErrors,
        valid: false,
      };
    }

    if (confirmed) {

      name = trim(name);

      if (name.length === 0) {
        newErrors.name = tu("no_name_error");
      } else if (name.length > 32) {
        newErrors.name = tu("tokenname_error_message_0");
      } else if (!/^[a-zA-Z]+$/i.test(name)) {
        newErrors.name = tu("tokenname_error_message_1");
      }

      abbr = trim(abbr);

      if (abbr.length === 0) {
        newErrors.abbr = tu("abbreviation_required");
      } else if (abbr.length > 5) {
        newErrors.abbr = tu("abbreviation_error_message_0");
      } else if (!/^[a-zA-Z]+$/i.test(abbr)) {
        newErrors.abbr = tu("abbreviation_error_message_1");
      }

      if (description.length === 0) {
        newErrors.description = tu("no_description_error");
      } else if (description.length > 200) {
        newErrors.description = tu("description_error_message_0");
      }
    }

    if (totalSupply <= 0)
      newErrors.supply = tu("no_supply_error");

    if (url.length === 0)
      newErrors.url = tu("no_url_error");

    if (numberOfTron <= 0)
      newErrors.tronAmount = tu("tron_value_error");

    if (numberOfCoins <= 0)
      newErrors.tokenAmount = tu("coin_value_error");

    if (!startTime)
      newErrors.startDate = tu("invalid_starttime_error");

    let calculatedStartTime = new Date(startTime).getTime();

    if (calculatedStartTime < Date.now())
      newErrors.startDate = tu("past_starttime_error");

    if (!endTime)
      newErrors.endDate = tu("invalid_endtime_error");

    if (new Date(endTime).getTime() <= calculatedStartTime)
      newErrors.endDate = tu("date_error");

    return {
      errors: newErrors,
      valid: confirmed === true && !some(Object.values(newErrors), error => error !== null),
    };
  };

  isLoggedIn = () => {
    let {account} = this.props;
    return account.isLoggedIn;
  };

  componentDidMount() {
  
    this.checkExistingToken();
  }

  checkExistingToken = () => {

    let {wallet} = this.props;

    if (wallet !== null) {
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        if (token) {
          this.setState({
            issuedAsset: token,
          });
        }
      });
    }
  };


  componentDidUpdate(prevProps, prevState) {

  }


  render() {
    let {modal, numberOfCoins, numberOfTron, name, submitMessage, frozenSupply, url, confirmed, loading, issuedAsset, totalSupply, startTime, endTime} = this.state;

    if (!this.isLoggedIn()) {
      return (
          <main className="container pb-3 token-create header-overlap">
            <div className="row">
              <div className="col-sm-12">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center p-3">
                      {tu("not_signed_in")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      );
    }
    if (issuedAsset !== null) {
      return (
          <main className="container pb-3 token-create header-overlap">
            <div className="row">
              <div className="col-sm-8">
                <div className="card">
                  <div className="card-body">
                    <div className="text-center p-3">
                      {tu("trx_token_account_limit")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      );
    }

    let {valid, errors} = this.isValid();

    let exchangeRate = numberOfTron / numberOfCoins;
    let {activeLanguage, language} = this.props;

    if (activeLanguage === "en") {
      language = 'en-gb';
    } else if (activeLanguage === "no") {
      language = 'en-gb';
    } else if (activeLanguage === "zh") {
      language = 'zh-cn';
    } else {
      language = activeLanguage;
    }

    if (!loading && confirmed && !valid) {
      submitMessage = (
          <Alert color="warning" className="text-center">
            {tu("errors_in_form")}
          </Alert>
      );
    }

    return (

        <main className="container pb-3 token-create header-overlap">
          {modal}
          <div className="row">
            <div className="col-sm-12">
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
                      <p>
                        <small className="form-text text-muted">
                          {'('}{tu("language_support")}{')'}
                        </small>
                      </p>
                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>{tu("token_name")} *</label>
                          <TextField cmp={this} field="name"/>
                          <small className="form-text text-muted">
                            {tu("token_message")}
                          </small>
                          {ErrorLabel(errors.name)}
                        </div>
                        <div className="form-group col-md-6">
                          <label>{tu("token_abbr")} *</label>
                          <TextField cmp={this} field="abbr"/>
                          <small className="form-text text-muted">
                            {tu("abbr_message")}
                          </small>
                          {ErrorLabel(errors.abbr)}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label>{tu("total_supply")} *</label>
                          <NumberField
                              className="form-control"
                              value={totalSupply}
                              min={1}

                              onChange={(totalSupply) => this.setState({totalSupply})}/>
                          <small className="form-text text-muted">
                            {tu("supply_message")}
                          </small>
                          {ErrorLabel(errors.supply)}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label>{tu("description")} *</label>
                          <TextField type="text" cmp={this} field="description"/>
                          <small className="form-text text-muted">
                            {tu("description_message")}
                          </small>
                          {ErrorLabel(errors.description)}
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group col-md-12">
                          <label>{tu("website_url")} </label>
                          <TextField type="text" cmp={this} field="url" placeholder="http://"/>
                          <small className="form-text text-muted">
                            {tu("url_message")}
                          </small>
                          {url !== "" && ErrorLabel(errors.url)}
                        </div>
                      </div>
                    </fieldset>

                    <div className="form-group">
                      <div className="form-check">
                        <TextField type="checkbox" cmp={this} field="confirmed" className="form-check-input"/>
                        <label className="form-check-label">
                          {tu("token_spend_confirm")}
                        </label>
                      </div>
                    </div>
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
  login,
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BasicInfo));
