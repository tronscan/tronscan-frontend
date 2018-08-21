import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../utils/i18n";
import {Client} from "../../services/api";
import {connect} from "react-redux";
import {loadTokens} from "../../actions/tokens";
import {login} from "../../actions/app";
import {filter, trim, some, sumBy} from "lodash";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {Alert} from "reactstrap";
import "react-datetime/css/react-datetime.css";
import {NumberField} from "../common/Fields";
import 'moment/min/locales';
import DateTimePicker from "react-datetime";


function ErrorLabel(error) {
  if (error !== null) {
    return (
        <small className="text-danger"> {error} </small>
    )
  }
  return null;
}

export class FreezeSupply extends Component {

  constructor(props) {
    super(props);

    this.state = this.props.state;

  }

  isValid = () => {
    this.props.nextStep(4);
    this.state.step=4;
    this.props.nextState(this.state);
  };

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {

  }

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

      frozen.amount = frozen.amount > 0 || frozen.amount === "" ? frozen.amount : 0;
      frozen.days = frozen.days > 0 || frozen.days === "" ? frozen.days : 1;
    }

    this.setState({
      frozenSupply: frozenSupply,
    });
  }

  plusFrozen = () => {
    let {frozenSupply} = this.state;

    frozenSupply.push({amount: 0, days: 1});
    console.log(frozenSupply);

    this.setState({
      frozenSupply: frozenSupply,
    });
  }
  minusFrozen = (index) => {
    let {frozenSupply} = this.state;
    frozenSupply.splice(index, 1);
    this.setState({
      frozenSupply: frozenSupply,
    });
  }

  render() {
    let {frozenSupply} = this.state;

    let {errors} = this.state;

    let {nextStep} = this.props;

    console.log(frozenSupply);
    return (

        <main className="">
          <h5 className="card-title text-center">
            {tu("issue_a_token")}
          </h5>
          <form>
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
              <div className="form-row text-muted" style={{marginBottom: "-10px"}}>
                <p className="col-md-7">
                  <label>{tu("amount")}</label>
                </p>
                <p className="col-md-3">
                  <label>{tu("days_to_freeze")}</label>
                </p>
              </div>
              {
                frozenSupply.map((frozen, index) => (
                    <div key={index}
                         className="form-row text-muted">
                      <div className="form-group col-md-7">
                        <NumberField
                            className="form-control"
                            value={frozen.amount}
                            min={0}
                            decimals={0}
                            onChange={(amount) => this.updateFrozen(index, {amount})}
                        />
                      </div>
                      <div className="form-group col-md-3">
                        <NumberField
                            className="form-control"
                            onChange={(days) => this.updateFrozen(index, {days})}
                            decimals={0}
                            min={1}
                            value={frozen.days}/>
                      </div>
                      <div className="form-group col-md-2">
                        <a className="anticon anticon-plus-circle-o" style={{fontSize: "30px", marginTop: "0px"}} onClick={this.plusFrozen}></a>
                        {
                          frozenSupply.length > 1 &&
                          <a className="anticon anticon-minus-circle-o" style={{fontSize: "30px", marginTop: "0px"}} onClick={this.minusFrozen}></a>
                        }
                      </div>
                    </div>
                ))
              }
              {
                frozenSupply.length > 1 &&
                <div className="mb-1">
                  Total Frozen Supply: {sumBy(frozenSupply, fs => parseInt(fs.amount))}
                </div>
              }
            </fieldset>
            <a className="btn btn-danger btn-lg" onClick={() => {
              nextStep(2)
            }}>上一步</a>
            <a className="ml-1 btn btn-danger btn-lg" onClick={() => {
              this.isValid()
            }}>下一步</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FreezeSupply));
