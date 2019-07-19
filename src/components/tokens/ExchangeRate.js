import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {filter, trim, some, sumBy} from "lodash";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import "react-datetime/css/react-datetime.css";
import {NumberField} from "../common/Fields";
import 'moment/min/locales';
import DateTimePicker from "react-datetime";
import {Switch, Select} from 'antd';
const Option = Select.Option;

function ErrorLabel(error) {
  if (error !== null) {
    return (
        <small className="text-danger"> {error} </small>
    )
  }
  return null;
}

export class ExchangeRate extends PureComponent {

  constructor(props) {
    super(props);

    let startTime = new Date();
    startTime.setHours(0, 0, 0, 0);

    let endTime = new Date();
    endTime.setHours(0, 0, 0, 0);
    endTime.setDate(startTime.getDate() + 90);
    this.state = {
      showTime: true,
      ...this.props.state
    }
  }

  isValid = () => {

    let { numberOfCoins, numberOfTron, startTime, endTime,showTime } = this.state;

    let newErrors = {
      tronAmount: null,
      tokenAmount: null,
      startDate: null,
      endDate: null,
    };

    if (numberOfTron <= 0)
      newErrors.tronAmount = tu("tron_value_error");

    if (numberOfCoins <= 0)
      newErrors.tokenAmount = tu("coin_value_error");

    if(showTime){
      if (!startTime)
        newErrors.startDate = tu("invalid_starttime_error");

      let calculatedStartTime = new Date(startTime).getTime();

      if (calculatedStartTime < Date.now())
        newErrors.startDate = tu("past_starttime_error");

      if (!endTime)
        newErrors.endDate = tu("invalid_endtime_error");

      if (new Date(endTime).getTime() <= calculatedStartTime)
        newErrors.endDate = tu("date_error");
    }

    if (some(Object.values(newErrors), error => error !== null)) {
      this.setState({errors: newErrors});
    }
    else {
      this.props.nextStep(3);
      this.state.step=3;
      this.props.nextState(this.state);
    }

  };

  switchFreeze = (checked) => {
    this.setState({showTime: checked});
    if (!checked) {
        let startTime = new Date();
        startTime.setTime(startTime.getTime()+ 120*1000);
        let endTime = new Date();
        endTime.setTime(endTime.getTime() + 121*1000);
        this.setState({
            startTime,
            endTime
        });
    }else{
      let startTime = new Date();
      startTime.setHours(0, 0, 0, 0);
      startTime.setTime(startTime.getTime() + 24*60*60*1000);

      let endTime = new Date();
      endTime.setHours(0, 0, 0, 0);
      endTime.setTime(endTime.getTime() + 24*60*60*1000*2);

      this.setState({
        startTime,
        endTime
      });
    }
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

  handleChange = (e) =>{
     this.setState({precision: e.target.value})
  }

  render() {
    let {numberOfCoins, numberOfTron, name, startTime, endTime, precision, showTime} = this.state;

    let {errors} = this.state;

    let exchangeRate = numberOfTron / numberOfCoins;
    let {activeLanguage, language, nextStep, intl} = this.props;

    if (activeLanguage === "en") {
      language = 'en-gb';
    } else if (activeLanguage === "no") {
      language = 'en-gb';
    } else if (activeLanguage === "zh") {
      language = 'zh-cn';
    } else {
      language = activeLanguage;
    }

    return (

        <main className="">
          <h5 className="card-title">
            {tu("issue_a_token")}
          </h5>
          <p>
            {tu('token_issue_guide_message_1')}
            {tu('token_issue_guide_message_2')}
            {tu('token_issue_guide_message_3')}
          </p>
          <hr/>
          <form>
            <fieldset className="mb-3">
              <legend>
                  {tu("token_precision")}
              </legend>
              <div className="form-row">
                <p className="col-md-12">
                    {tu("token_precision_message_0")}
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <select className="form-control" onChange={this.handleChange} value={precision}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                  </select>
                </div>
              </div>

            </fieldset>
            <fieldset>
              <legend>
                {tu("exchange_rate")}
              </legend>
              <div className="form-row">
                <p className="col-md-12">
                  {tu("exchange_rate_message_0")}
                </p>
              </div>
              
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>* <span>TRX</span> {tu("amount")}</label>
                  <NumberField
                      className="form-control"
                      value={numberOfTron}
                      min={1}
                      onChange={(value) => this.setState({numberOfTron: value})}/>
                  {numberOfTron === "" && ErrorLabel(errors.tronAmount)}
                </div>
              </div>
              <div className="form-row">
                <p className="col-md-12">
                  <span>{tu("token_price")}</span>: 1 {name || tu("token")} = <FormattedNumber
                    value={exchangeRate} maximumFractionDigits={7} minimunFractionDigits={7}/> TRX
                </p>
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>* {tu("token")} {tu("amount")}</label>
                  <NumberField
                      className="form-control"
                      value={numberOfCoins}
                      min={1}
                      onChange={(value) => this.setState({numberOfCoins: value})}/>
                  {numberOfCoins === "" && ErrorLabel(errors.tokenAmount)}
                </div>
                
              </div>
            </fieldset>
            
            <fieldset className="mb-3">
              <legend>
                {tu("participation")}
              </legend>

              <div className="form-row mb-3">

                {showTime &&
                  <p className="col-md-12">
                      {tu("participation_message_0")}{name}{tu("participation_message_1")}
                  </p>
                }
                {!showTime &&
                  <p className="col-md-12">
                      {tu("participation_message_2")}
                  </p>
                }
                <Switch checkedChildren={intl.formatMessage({id: 'freeze_on'})}
                        unCheckedChildren={intl.formatMessage({id: 'freeze_off'})}
                        onChange={this.switchFreeze}
                        checked={showTime}
                />
              </div>
              { showTime && 
                <div className="form-row">
                  <div className="form-group col-sm-12 col-md-12 col-lg-6">
                    <label>{tu("start_date")}</label>
                    <DateTimePicker
                        locale={language}
                        onChange={(data) => this.setState({startTime: data.toDate()})}
                        isValidDate={this.isValidStartTime}
                        value={startTime}
                        //closeOnSelect={true}
                        input={true}
                    />
                    {ErrorLabel(errors.startDate)}
                  </div>
                  <div className="form-group col-sm-12 col-md-12 col-lg-6">
                    <label>{tu("end_date")}</label>
                    <DateTimePicker
                        locale={language}
                        onChange={(data) => this.setState({endTime: data.toDate()})}
                        isValidDate={this.isValidEndTime}
                        value={endTime}
                        //closeOnSelect={true}
                        input={true}
                    />
                    {ErrorLabel(errors.endDate)}
                  </div>
                </div>
              }
            </fieldset>
            <div className="pt-2">
            <a className="btn btn-default btn-lg" onClick={()=>{nextStep(1)}}>{tu('prev_step')}</a>
            <a className="ml-4 btn btn-danger btn-lg" onClick={() => {
              this.isValid()
            }}>{tu('next')}</a>
            </div>
          </form>

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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ExchangeRate));
