import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../utils/i18n";
import {connect} from "react-redux";
import {filter, trim, some, sumBy, cloneDeep} from "lodash";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import "react-datetime/css/react-datetime.css";
import {NumberField} from "../common/Fields";
import 'moment/min/locales';

function ErrorLabel(error) {
  if (error !== null) {
    return (
        <small className="text-danger"> {error} </small>
    )
  }
  return null;
}

export class BasicInfo extends PureComponent {

  constructor(props) {
    super(props);

    this.state = this.props.state;
  }

  isValid = () => {

    let {name, abbr, description, url, totalSupply} = this.state;

    let newErrors = {
      name: null,
      totalSupply: null,
      description: null,
      url: null,
      abbr: null,
    };

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

    if (totalSupply <= 0)
      newErrors.totalSupply = tu("no_supply_error");

    if (url.length === 0)
      newErrors.url = tu("no_url_error");

    if (some(Object.values(newErrors), error => error !== null)) {
      this.setState({errors: newErrors});
    }
    else {
      this.props.nextStep(2);
      this.state.step = 2;
      this.props.nextState(this.state);
    }
  };

  componentDidMount() {
    console.log("Basic");
  }

  componentDidUpdate(prevProps, prevState) {
  }

  render() {
    let {name, url, totalSupply, abbr, description} = this.state;

    let {errors} = this.state;

    return (

        <main className="">
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
                  <input type="text" className="form-control" onChange={(e) => {
                    this.setState({name: e.target.value})
                  }} value={name}/>
                  <small className="form-text text-muted">
                    {tu("token_message")}
                  </small>
                  {ErrorLabel(errors.name)}
                </div>
                <div className="form-group col-md-6">
                  <label>{tu("token_abbr")} *</label>
                  <input type="text" className="form-control" onChange={(e) => {
                    this.setState({abbr: e.target.value})
                  }} value={abbr}/>
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
                  <input type="text" className="form-control" onChange={(e) => {
                    this.setState({description: e.target.value})
                  }} value={description}/>
                  <small className="form-text text-muted">
                    {tu("description_message")}
                  </small>
                  {ErrorLabel(errors.description)}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label>{tu("website_url")} </label>
                  <input type="text" placeholder="http://" className="form-control" onChange={(e) => {
                    this.setState({url: e.target.value})
                  }} value={url}/>
                  <small className="form-text text-muted">
                    {tu("url_message")}
                  </small>
                  {ErrorLabel(errors.url)}
                </div>
              </div>
            </fieldset>

            <a className="btn btn-danger btn-lg" onClick={() => {
              this.isValid()
            }}>下一步</a>
          </form>

        </main>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BasicInfo));
