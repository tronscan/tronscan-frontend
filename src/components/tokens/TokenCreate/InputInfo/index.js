import React, {Component} from 'react';
import {injectIntl} from "react-intl";
import {t, tu} from "../../../../utils/i18n";
import {BaseInfo} from './BaseInfo'
import { ContractInfo } from './ContractInfo';
import { PriceInfo } from './PriceInfo';
import { SocialInfo } from './SocialInfo';
import {Form} from 'antd';
import {Client} from "../../../../services/api";
import moment from 'moment';

export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    console.log('111111this.props.state',this.props.state)
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

    async loadContractCode(id) {
        this.setState({loading: true});
        let contractCode = await Client.getContractCode(id);
        console.log('contractCode',contractCode)
        this.setState({
            contract_created_date:moment(contractCode.data.date_created) || '1111',
            contract_created_address: contractCode.data.creator.address || '',
        }, () => {
            this.props.form.setFieldsValue({ contract_created_date:contractCode.data.date_created?moment(contractCode.data.date_created) : moment(1539204941000)});
            this.props.form.setFieldsValue({ contract_created_address:contractCode.data.creator.address || '1111' });
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
          <ContractInfo form={form} intl={intl} state={this.state} loadContractCode={(id) => { this.loadContractCode(id) }}/>
          
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
