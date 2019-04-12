import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps } from 'antd';
import SelectTrc from './SelectTrc';
import InputInfo from './InputInfo';
import SubmitInfo from './SubmitInfo';

const Step = Steps.Step;


export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 3,
      type: 'trc20',
      paramData: {
        token_name: '',
        token_abbr: '',
        token_introduction: '',
        token_supply: 0,
        precision: 0,
        logo_url: '',
        author: 'rabbit',
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
    console.log(params)
    this.setState(params);
  }

  render() {
    let {step} = this.state;
    return (

        <main  className="container pb-3 token-create header-overlap tokencreated">
          <Steps size="small" current={step}>
            <Step title="类型" />
            <Step title="录入" />
            <Step title="确认" />
            <Step title="结果" />
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
                  { step === 2 &&
                    <SubmitInfo
                        state={this.state}
                        nextStep={(number) => {
                            this.changeStep(number)
                        }}
                        nextState={(params) => {
                            this.changeState(params)
                        }}
                    />
                  }
                    { step === 3 &&
                    <SubmitInfo
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
