import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';


export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      
    };
  }

  componentDidMount() {}

  render() {

    return (

        <main className="">
          <h5 className="card-title">
            {tu("issue_a_token")}
          </h5>
          

        </main>
    )
  }
}

export default injectIntl(TokenCreate);
