import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';
import SelectTrc from './SelectTrc';
import InputInfo from './InputInfo';

const Step = Steps.Step;


export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      type: 'trc10',
      paramData: {
        token_name: '',
        token_abbr: '',
        tonken_introduction: '',
        issue: 0,
        precision: 0,
        logo_url: '',
        author: '',
        contract_address: '',
        contract_create_date: '',
        contract_code: "",
        website: '',
        email: '',
        while_paper: '',

      }
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    console.log(this.state, prevProps)
  }


  changeStep = (step) => {
    this.setState({step: step});
  }
  changeState = (params) => {
    this.setState(params);
  }

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
                  { step === 0 && 
                    <SelectTrc 
                      state={this.state} 
                      nextStep={(number) => {
                        this.changeStep(number)
                      }} 
                      nextState={(params) => {
                        this.changeState(params)
                      }}
                    /> 
                  }
                  { step === 1 && 
                    <InputInfo 
                      state={this.state} 
                      nextStep={(number) => {
                        this.changeStep(number)
                      }} 
                      nextState={(params) => {
                        this.changeState(params)
                      }}
                    /> 
                  }
                </div>
              </div>
            </div>
          </div>
        
        </main>
    )
  }
}

export default injectIntl(TokenCreate);
