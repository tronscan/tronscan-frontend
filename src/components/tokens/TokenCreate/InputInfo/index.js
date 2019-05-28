import React, {Component} from 'react';
import {injectIntl} from "react-intl";
import {t, tu} from "../../../../utils/i18n";
import {BaseInfo} from './BaseInfo'
import { ContractInfo } from './ContractInfo';
import { PriceInfo } from './PriceInfo';
import { SocialInfo } from './SocialInfo';
import {Form} from 'antd';

export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isTrc10: false,
      isTrc20: false,
      ...this.props.state
    };
  }

  componentDidMount() {
    const {type} = this.props.state
    this.props.nextState({leave_lock: true})
    this.setState({
      isTrc10 : (type === 'trc10'),
      isTrc20 : (type === 'trc20')
    })
  }

  submit = (e) => {
    const {iconList} = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.nextState({paramData: values, iconList})
        this.props.nextStep(2)
      }
    });
  }

  render() {
    const {intl, nextStep} = this.props
    const { form } = this.props
    
    return (
      <main className="">
        <Form
          className="ant-advanced-search-form"
        >
          {/* base info */}
          <BaseInfo form={form} intl={intl} state={this.state}/>

          {/* contract info */}
          <ContractInfo form={form} intl={intl} state={this.state}/>
          
          {/* price info */}
          <PriceInfo form={form} intl={intl} state={this.state}/>

          {/* social info */}
          <SocialInfo form={form} intl={intl} state={this.state}/>
          
          <div className="text-right px-2">
            <a className="btn btn-default btn-lg" onClick={() => nextStep(0)}>{tu('prev_step')}</a>
            <button className="ml-4 btn btn-danger btn-lg" onClick={this.submit}>{tu('next')}</button>
          </div>
          
        </Form>
      </main>
    )
  }
}

function mapPropsToFields(props) {
  let data = props.state.paramData
  let params = {} 

  Object.keys(data).map(key => {
    params[key] = Form.createFormField({
      value: data[key],
    })
  })
  return  params
}

export default Form.create({ name: 'input_info', mapPropsToFields })(injectIntl(TokenCreate));
