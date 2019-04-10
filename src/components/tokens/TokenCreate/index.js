import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';

const Step = Steps.Step;


export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
    };
  }

  componentDidMount() {}

  render() {
    let {step} = this.state
    return (

        <main  className="container pb-3 token-create header-overlap">
          <Steps size="small" current={step}>
            <Step title="Finished" />
            <Step title="In Progress" />
            <Step title="Waiting" />
          </Steps>,
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                
                </div>
              </div>
            </div>
          </div>
        
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
