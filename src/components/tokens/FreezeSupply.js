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
import {Switch, Icon} from 'antd';

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
    this.state = {
      supplyCheck: false,
      ...this.props.state
    };
  }

  isValid = () => {
    if (sumBy(this.state.frozenSupply, fs => parseInt(fs.amount)) > this.state.totalSupply) {
      this.setState({supplyCheck: true});
      return;
    }
    this.setState({supplyCheck: false});
    this.props.nextStep(4);
    this.state.step = 4;
    this.props.nextState(this.state);
  };

  componentDidMount() {
    this.setState({supplyCheck: false});
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

  switchFreeze = (checked) => {
    this.setState({showFrozenSupply: checked});
    if (!checked) {
      this.setState({
        frozenSupply: [{amount: 0, days: 1}]
      });
    }
  }

  render() {
    let {frozenSupply, showFrozenSupply, errors, supplyCheck} = this.state;

    let {nextStep, intl} = this.props;

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
            <fieldset>
              <legend>
                {tu("frozen_supply")}
              </legend>

              <div className="form-row text-muted mb-3">
                <p className="col-md-12">
                  {tu("frozen_supply_message_0")}
                </p>
                <Switch checkedChildren={intl.formatMessage({id: 'freeze_on'})}
                        unCheckedChildren={intl.formatMessage({id: 'freeze_off'})}
                        onChange={this.switchFreeze}
                        checked={showFrozenSupply}
                />
              </div>
              {showFrozenSupply &&
              <div className="form-row text-muted" style={{marginBottom: "-10px"}}>
                <p className="col-md-7">
                  <span>{tu("amount")}</span>
                </p>
                <p className="col-md-3">
                  <span>{tu("days_to_freeze")}</span>
                </p>
              </div>
              }
              {showFrozenSupply &&
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
                    {

                      <div className="form-group col-md-2" style={{textAlign: 'center'}}>
                        {
                          index === 0 &&
                          <a className="anticon anticon-plus-circle-o" style={{fontSize: "30px", marginTop: "0px"}}
                             onClick={this.plusFrozen}></a>
                        }
                        {
                          index > 0 &&
                          <a className="anticon anticon-minus-circle-o" style={{fontSize: "30px", marginTop: "0px"}}
                             onClick={() => {
                               this.minusFrozen(index)
                             }}></a>
                        }
                      </div>
                    }
                  </div>
              ))
              }
              {
                showFrozenSupply && frozenSupply.length > 0 &&
                <div className="mb-1">
                  {tu('total')}{tu('frozen_supply')} : {sumBy(frozenSupply, fs => parseInt(fs.amount))}
                </div>
              }
              {supplyCheck &&
              <small className="text-danger"> Total frozen supply is bigger than total supply!</small>
              }
            </fieldset>
            <div className="pt-3">
              <a className="btn btn-default btn-lg" onClick={() => {
                nextStep(2)
              }}>{tu('prev_step')}</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FreezeSupply));
