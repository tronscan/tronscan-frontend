import React, {Component} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {TextField} from "../../utils/formHelper";
import {filter, trim, some, sumBy} from "lodash";
import {ASSET_ISSUE_COST, ONE_TRX} from "../../constants";
import {FormattedNumber} from "react-intl";
import {Alert} from "reactstrap";
import {addDays, addHours, isAfter} from "date-fns";
import "react-datetime/css/react-datetime.css";
import DateTimePicker from "react-datetime";
import {Link} from "react-router-dom";
import {NumberField} from "../common/Fields";

function ErrorLabel(error) {
  if (error !== null) {
    return (
      <small className="text-danger"> {error} </small>
    )
  }

  return null;
}

class TokenCreate extends Component {

  constructor() {
    super();

    let startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    let endTime = new Date();
    endTime.setHours(0, 0, 0, 0);
    endTime.setDate(startTime.getDate() + 90);

    this.state = {
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

  submit = async () => {
    let {currentWallet} = this.props;

    this.setState({ loading: true, submitMessage: null });

    try {
      let {success} = await Client.createToken({
        address: currentWallet.address,
        name: trim(this.state.name),
        shortName: trim(this.state.abbr),
        totalSupply: this.state.totalSupply,
        num: this.state.numberOfCoins,
        trxNum: this.state.numberOfTron * ONE_TRX,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        description: this.state.description,
        url: this.state.url,
        frozenSupply: filter(this.state.frozenSupply, fs => fs.amount > 0),
      })(currentWallet.key);

      if (success) {
        this.setState({
          isTokenCreated: true,
        });
      } else {
        this.setState({
          submitMessage: (
            <Alert color="warning" className="text-center">
              An error occurred while trying to create the token
            </Alert>
          )
        });
      }

    } finally {
      this.setState({ loading: false });
    }
  };

  isValid = () => {

    let { loading, name, abbr, totalSupply, numberOfCoins, numberOfTron, startTime, endTime, description, url, confirmed } = this.state;


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
        newErrors.name = tu("Name may not be longer then 32 characters");
      } else if (!/^[a-zA-Z]+$/i.test(name)) {
        newErrors.name = tu("Name may only contain a-Z characters");
      }

      abbr = trim(abbr);

      if (abbr.length === 0) {
        newErrors.abbr = tu("Abbreviation is required");
      } else if (abbr.length > 5) {
        newErrors.abbr = tu("Abbreviation may not be longer then 5 characters");
      } else if (!/^[a-zA-Z]+$/i.test(abbr)) {
        newErrors.abbr = tu("Abbreviation may only contain a-Z characters");
      }

      if (description.length === 0) {
        newErrors.description = tu("no_description_error");
      } else if (description.length > 200) {
        newErrors.description = tu("Description may not be longer then 200 characters");
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
    let {wallet} = this.props;
    return wallet.isOpen;
  };

  componentDidMount() {
    this.setStartTime();
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

  setStartTime = async () => {
    let block = await Client.getLatestBlock();

    let startTime = addDays(new Date(block.timestamp), 1);
    let minimumTime = addHours(new Date(block.timestamp), 1);

    this.setState({
      startTime,
      minimumTime,
    });
  };

  isValidStartTime = (current, selectedDate) => {
    let {minimumTime} = this.state;
    return isAfter(current, minimumTime);
  };

  isValidEndTime = (current, selectedDate) => {
    let {startTime} = this.state;
    return isAfter(current, startTime);
  };

  componentDidUpdate(prevProps, prevState) {
    let {frozenSupply} = this.state;

    if (frozenSupply.length === 0) {
      this.setState({
        frozenSupply: [
          {
            amount: 0,
            days: 1,
          }
        ]
      });
    } else if (frozenSupply.length > 0) {

      let emptyFields = this.getEmptyFrozenFields();

      if (emptyFields.length === 0) {
        this.setState({
          frozenSupply: [
            ...frozenSupply,
            {
              amount: 0,
              days: 1,
            }
          ]
        });
      }
    }

    let newState = {};
    let hasChange = false;

    for (let field of Object.keys(this.state)) {
      let value = this.state[field];
      if (value !== prevState[field]) {
        hasChange = true;
        switch (field) {
          case "num":
            value = value > 1 || value === "" ? value : 1;
            break;
          case "trxNum":
            value = value > 1 || value === "" ? value : 1;
            break;
          case "totalSupply":
            value = value > 1 || value === "" ? value : 1;
            break;
        }
      }
      newState[field] = value;
    }

    if (hasChange) {
      this.setState(newState);
    }
  }

  getEmptyFrozenFields = () => {
    let {frozenSupply} = this.state;
    return filter(frozenSupply, fs => Math.round(parseInt(fs.amount)) === 0 || fs.amount === "");
  };

  renderSubmit = () => {

    let {isTokenCreated} = this.state;
    let {valid} = this.isValid();

    let {wallet} = this.props;

    if (isTokenCreated) {
      return (
        <Alert color="success" className="text-center">
          {tu("token_issued_successfully")}<br/>
          The token will be available on the{' '}
          <Link to="/tokens/list">Tokens page</Link>{' '}
          in a few minutes
        </Alert>
      );
    }

    if (!wallet) {
      return (
        <Alert color="warning" className="text-center">
          {tu("trx_token_wallet_requirement")}
        </Alert>
      );
    }

    if (wallet.balance < ASSET_ISSUE_COST) {
      return (
        <Alert color="danger" className="text-center">
          {tu("trx_token_fee_message")}
        </Alert>
      );
    }

    return (
      <div className="text-center">
        <button
          disabled={!valid}
          type="button"
          className="btn btn-success"
          onClick={this.submit}>{tu("issue_token")}</button>
      </div>
    );
  };

  updateFrozen(index, values) {

    let {frozenSupply} = this.state;

    frozenSupply[index] = {
      ...frozenSupply[index],
      ...values
    };

    for (let frozen of frozenSupply) {

      if (trim(frozen.amount) !== "")
        frozen.amount = parseInt(frozen.amount);

      if (trim(frozen.days) !== "")
        frozen.days = parseInt(frozen.days);

      frozen.amount = frozen.amount > 0  || frozen.amount === "" ? frozen.amount : 0;
      frozen.days = frozen.days > 0  || frozen.days === "" ? frozen.days : 1;
    }

    this.setState({
      frozenSupply,
    });
  }

  blurFrozen(index) {
    let {frozenSupply} = this.state;

    let isEmpty = frozenSupply[index].amount <= 0 || frozenSupply[index].amount === "";

    if (isEmpty && this.getEmptyFrozenFields().length >= 2) {
      frozenSupply.splice(index, 1);
    }

    this.setState({
      frozenSupply,
    });
  }

  render() {
    let {numberOfCoins, numberOfTron, name, submitMessage, frozenSupply, url, confirmed, loading, issuedAsset, totalSupply, startTime, endTime} = this.state;

    if (!this.isLoggedIn()) {
      return (
        <main className="container pb-3 token-create header-overlap">
          <div className="row">
            <div className="col-sm-8">
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

    if (!loading && confirmed && !valid) {
      submitMessage = (
        <Alert color="warning" className="text-center">
          There are errors in the form
        </Alert>
      );
    }

    return (
      <main className="container pb-3 token-create header-overlap">
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">
                  {tu("issue_a_token")}
                </h5>
                <form>
                  <fieldset>
                    <legend>
                      {tu("Details")}
                      <i className="fab fa-wpforms float-right"/>
                    </legend>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>{tu("token_name")} *</label>
                        <TextField cmp={this} field="name" />
                        <small className="form-text text-muted">
                          {tu("token_message")}
                        </small>
                        { ErrorLabel(errors.name)}
                      </div>
                      <div className="form-group col-md-6">
                        <label>{tu("token_abbr")} *</label>
                        <TextField cmp={this} field="abbr" />
                        <small className="form-text text-muted">
                          {tu("abbr_message")}
                        </small>
                        { ErrorLabel(errors.abbr)}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label>{tu("total_supply")} *</label>
                        <NumberField
                          value={totalSupply}
                          min={1}
                          onChange={(totalSupply) => this.setState({ totalSupply })} />
                        <small className="form-text text-muted">
                          {tu("supply_message")}
                        </small>
                        { ErrorLabel(errors.supply)}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label>{tu("description")} *</label>
                        <TextField type="text" cmp={this} field="description" />
                        <small className="form-text text-muted">
                          {tu("description_message")}
                        </small>
                        { ErrorLabel(errors.description)}
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-12">
                        <label>{tu("Website URL")} *</label>
                        <TextField type="text" cmp={this} field="url" placeholder="http://" />
                        <small className="form-text text-muted">
                          {tu("url_message")}
                        </small>
                        { url !== "" && ErrorLabel(errors.url)}
                      </div>
                    </div>
                  </fieldset>
                  <hr/>
                  <fieldset>
                    <legend>
                      {tu("exchange_rate")}
                      <i className="fa fa-exchange-alt float-right"/>
                    </legend>

                    <div className="form-row">
                      <p className="col-md-12">
                        {tu("exchange_rate_message_0")}
                      </p>
                      <p className="col-md-12">
                        {tu("exchange_rate_message_1")} <b><FormattedNumber value={numberOfCoins} /> {name || tu("token")}</b>&nbsp;
                        {tu("exchange_rate_message_2")} <b><FormattedNumber value={numberOfTron} /> {tu("exchange_rate_message_3")}</b>.
                      </p>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>TRX {tu("amount")} *</label>
                        <NumberField
                          className="form-control"
                          value={numberOfTron}
                          min={1}
                          onChange={(value) => this.setState({ numberOfTron: value })} />
                        { numberOfTron !== "" && ErrorLabel(errors.tronAmount)}
                      </div>
                      <div className="form-group col-md-6">
                        <label>{tu("token")} {tu("amount")} *</label>
                        <NumberField
                          className="form-control"
                          value={numberOfCoins}
                          min={1}
                          onChange={(value) => this.setState({ numberOfCoins: value })} />
                        { numberOfCoins !== "" && ErrorLabel(errors.tokenAmount)}
                      </div>
                    </div>
                    <div className="form-row">
                      <p className="col-md-12">
                        <b>{tu("token_price")}</b>: 1 {name || tu("token")} = <FormattedNumber value={exchangeRate} /> TRX
                      </p>
                    </div>
                  </fieldset>
                  <hr/>
                  <fieldset>
                    <legend>
                      {tu("frozen_supply")}
                      <i className="fa fa-snowflake float-right"/>
                    </legend>

                    <div className="form-row text-muted">
                      <p className="col-md-12">
                        {tu("frozen_supply_message_0")}
                      </p>
                    </div>
                    {
                      frozenSupply.map((frozen, index) => (
                        <div key={index} className={"form-row " + (frozenSupply.length === index + 1 ? "text-muted" : "")}>
                          <div className="form-group col-md-9">
                            { index === 0 && <label>{tu("amount")}</label> }
                            <NumberField
                              className="form-control"
                              value={frozen.amount}
                              min={0}
                              onBlur={() => this.blurFrozen(index)}
                              decimals={0}
                              onChange={(amount) => this.updateFrozen(index, { amount })}
                            />
                          </div>
                          <div className="form-group col-md-3">
                            { index === 0 && <label>{tu("days_to_freeze")}</label> }
                            <NumberField
                              className="form-control"
                              onChange={(days) => this.updateFrozen(index, { days })}
                              decimals={0}
                              min={1}
                              value={frozen.days} />
                          </div>
                        </div>
                      ))
                    }
                    {
                      frozenSupply.length > 1 &&
                        <div>
                          Total Frozen Supply: {sumBy(frozenSupply, fs => parseInt(fs.amount))}
                        </div>
                    }
                  </fieldset>
                  <hr/>
                  <fieldset>
                    <legend>
                      {tu("participation")}
                      <i className="fa fa-calendar-alt float-right"/>
                    </legend>

                    <div className="form-row text-muted">
                      <p className="col-md-12">
                        {tu("participation_message_0")}{name}{tu("participation_message_1")}
                      </p>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-md-6">
                        <label>{tu("start_date")}</label>
                        <DateTimePicker
                          onChange={(data) => this.setState({ startTime: data.toDate() }) }
                          isValidDate={this.isValidStartTime}
                          value={startTime}
                          input={false}/>
                        {ErrorLabel(errors.startDate)}
                      </div>
                      <div className="form-group col-md-6">
                        <label>{tu("end_date")}</label>
                        <DateTimePicker
                          onChange={(data) => this.setState({ endTime: data.toDate() }) }
                          isValidDate={this.isValidEndTime}
                          value={endTime}
                          input={false}
                        />
                        {ErrorLabel(errors.endDate)}
                      </div>
                    </div>
                  </fieldset>
                  <div className="form-group">
                    <div className="form-check">
                      <TextField type="checkbox" cmp={this} field="confirmed" className="form-check-input" />
                      <label className="form-check-label">
                        {tu("token_spend_confirm")}
                      </label>
                    </div>
                  </div>
                  {submitMessage}
                  {this.renderSubmit()}
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 mt-3 mt-md-0">
            <div className="card">
              <div className="card-body">
                <p>
                  {t("token_issue_guide_message_1")}
                </p>
                <p>
                  {t("token_issue_guide_message_2")}
                </p>
                <p>
                  {t("token_issue_guide_message_3")}
                </p>
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
    tokens: state.tokens.tokens,
    currentWallet: state.wallet.current,
    wallet: state.wallet,
  };
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenCreate);
