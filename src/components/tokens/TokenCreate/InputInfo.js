import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import NumericInput from '../../common/NumericInput';
import {
  Form, Row, Col, Input, InputNumber, AutoComplete, DatePicker
} from 'antd';
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

export class TokenCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      iconList: [
        {name: 'twitter', active: true, links: ['']},
        {name: 'Facebook', active: true, links: ['']},
        {name: 'telegram', active: true, links: ['']},
        {name: 'weibo', active: true, links: ['']},
        {name: 'reddit', active: false, links: ['']},
        {name: 'Medium', active: false, links: ['']},
        {name: 'steemit', active: false, links: ['']},
        {name: 'Instagram', active: false, links: ['']},
        {name: 'weixin', active: false, links: ['']},
        {name: 'Group', active: false, links: ['']},
        {name: 'discord', active: false, links: ['']}
      ],
      ...this.props.state
    };
  }

  componentDidMount() {}

  handleLogoChange = (value) => {
    let autoCompleteResult;
    if (!value || /\.jpg|\.png$/.test(value)) {
      autoCompleteResult = [];
    }else {
      autoCompleteResult = ['.jpg', '.png'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  submit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  addSocal = (index) => {
    let {iconList} = this.state

    if(!iconList[index].active){
      iconList[index].active = true
    }else{
      iconList[index].active = false
    }
    this.setState({ iconList: iconList })
  }
  addSocalItem = (index) => {
    let {iconList} = this.state
    iconList[index].links.push('')
    this.setState({ iconList: iconList })
  }

  render() {
    const { autoCompleteResult, type, iconList } = this.state;
    const {intl} = this.props
    const { getFieldDecorator } = this.props.form;

    const isTrc10 = type === 'trc10'
    const isTrc20 = type === 'trc20'

    const logoOptions = autoCompleteResult.map(logo => (
      <AutoCompleteOption key={logo}>{logo}</AutoCompleteOption>
    ));

    return (
        <main className="">
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.submit}
          >
            {/* base info */}
            <div>
              <h4 className="mb-3">{tu('basic_info')}</h4>
              <hr/>
              <Row gutter={24} type="flex" justify="space-between" className="px-2">
                <Col  span={24} md={11}>
                  <Form.Item label={tu('name_of_the_token')}>
                    {getFieldDecorator('token_name', {
                      rules: [{ required: true, message: tu('name_v_required'), whitespace: true},
                              {min: 1, max: 30, message: tu('name_v_length')},
                              {pattern: /^[a-zA-Z0-9 ]+$/, message: tu('name_v_format')}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'token_message'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('token_abbr')}>
                    {getFieldDecorator('token_abbr', {
                      rules: [{ required: true, message: tu('abbr_v_required'), whitespace: true},
                              {min: 1, max: 10, message: tu('abbr_v_length')},
                              {pattern: /^[a-zA-Z0-9]+$/, message: tu('abbr_v_format')}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'abbr_message'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('description')}>
                    {getFieldDecorator('token_introduction', {
                      rules: [{ required: true, message: tu('description_v_required'), whitespace: true},
                              {min: 1, max: 500, message: tu('description_v_length')}],
                    })(
                      <TextArea autosize={{ minRows: 1, maxRows: 6 }}  placeholder={intl.formatMessage({id: 'description_message'})} />
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('total_supply')}>
                    {getFieldDecorator('token_supply', {
                      rules: [{ required: true, message: tu('supply_v_required'), whitespace: true}],
                    })(
                      <NumericInput placeholder={intl.formatMessage({id: 'abbr_message'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('TRC20_decimals')}>
                    {getFieldDecorator('precision',{
                      rules: [{ required: true, message: ''}],
                    })(
                      <InputNumber min={0} max={6} className="w-100"/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('token_logo')}>
                    {getFieldDecorator('logo_url', {
                      rules: [{ required: true, message: tu('logo_v_required'), whitespace: true},
                              {pattern: /\.jpg|\.png$/, message: tu('logo_v_format')}],
                    })(
                      <AutoComplete
                        dataSource={logoOptions}
                        onChange={this.handleLogoChange}
                        placeholder={intl.formatMessage({id: 'image_restraint_desc'})}
                      >
                      </AutoComplete>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('issuer')}>
                    <Input defaultValue="rabbit" disabled/>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* contract info */}
            <div className={ isTrc20? 'd-block': 'd-none'}>
             <h4 className="mb-3">{tu('contract_info')}</h4>
             <hr/>
             <Row gutter={24} type="flex" justify="space-between" className="px-2">
               <Col span={24} md={11}>
                 <Form.Item label={tu('contract_address')}>
                   {getFieldDecorator('contract_address', {
                     rules: [{ required: isTrc20, message: tu('contract_address_required'), whitespace: true},
                             {pattern: /^T[a-zA-Z0-9]{33}$/, message: tu('contract_address_format')}],
                   })(
                     <Input placeholder={intl.formatMessage({id: 'contract_address_placeholder'})}/>
                   )}
                 </Form.Item>
               </Col>
               <Col  span={24} md={11}>
                <Form.Item label={tu('contract_created_date')}>
                  {getFieldDecorator('contract_date')(
                    <DatePicker className="w-100" placeholder={intl.formatMessage({id: 'contract_created_date'})}/>
                  )}
                 </Form.Item>
               </Col>
               <Col  span={24}>
                 <Form.Item label={tu('contract_code')}>
                  {getFieldDecorator('contract_code', {
                    rules: [{ required: isTrc20, message: tu('contract_address_required'), whitespace: true}],
                  })(
                    <TextArea rows={6}  placeholder={intl.formatMessage({id: 'contract_code_placeholder'})} />
                  )}
                 </Form.Item>
               </Col>

              </Row>
            </div>
            
            {/* price info */}
            {/**<div className={ isTrc10? 'd-block': 'd-none'}>
             <h4 className="mb-3">{tu('price_info')}</h4>
             <hr/>
             <Row gutter={24} type="flex" justify="space-between" className="px-2">
               <Col  span={24} md={11}>
                 <Form.Item label={tu('contract_address')}>
                   {getFieldDecorator('contract_address', {
                     rules: [{ required: isTrc10, message: tu('contract_address_required'), whitespace: true},
                             {pattern: /^T[a-zA-Z0-9]{33}$/, message: tu('contract_address_format')}],
                   })(
                     <Input placeholder={intl.formatMessage({id: 'contract_address_placeholder'})}/>
                   )}
                 </Form.Item>
               </Col>
               <Col  span={24} md={11}>
                 <Form.Item label={tu('contract_created_date')}>
                  <DatePicker />
                 </Form.Item>
               </Col>
               <Col  span={24}>
                 <Form.Item label={tu('contract_code')}>
                  {getFieldDecorator('contract_address', {
                    rules: [{ required: isTrc10, message: tu('contract_address_required'), whitespace: true}],
                  })(
                    <TextArea rows={6}  placeholder={intl.formatMessage({id: 'contract_code_placeholder'})} />
                  )}
                 </Form.Item>
               </Col>
              </Row>
            </div> */}


            {/* social info */}
           <div>
              <h4 className="mb-3">{tu('social_info')}</h4>
              <hr/>
              <Row gutter={24} type="flex" justify="space-between" className="px-2">
                <Col  span={24} md={11}>
                  <Form.Item label={tu('trc20_token_info_Website')}>
                    {getFieldDecorator('trc20_token_info_Website', {
                      rules: [{ required: true, message: tu('no_url_error'), whitespace: true}],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('email')}>
                    {getFieldDecorator('email', {
                      rules: [{ required: true, message: tu('email_v_required'), whitespace: true},
                              {type: 'email', message: tu('email_v_format')}],
                    })(
                      <Input/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label={tu('whitepaper_address')}>
                    {getFieldDecorator('whitepaper_address', {})(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
               
              </Row>
            </div>
            
            <div className="px-2">
              <div className="d-flex mb-3">
                <h5>{tu('select_socoal_link')}</h5>
                <div className="d-flex icon-list ml-3">
                  {
                    iconList.map( (item, index) => {
                      return <div key={index} 
                                  className={`${item.active? item.name+'-active': item.name} icon-list-item mr-2`}
                                  onClick={() => this.addSocal(index)}
                            ></div>
                    })
                  }
                </div>
              </div>

              <Row gutter={24} type="flex" justify="space-between">
                {
                  iconList.map( (item, index) => {
                    if(item.active){
                      return <Col  span={24} md={11}>
                      <div className="d-flex justify-content-between mb-2 pr-4">
                        <div className="d-flex align-items-center">
                          <i className={`${item.name}-active`}></i>
                          <span className="text-capitalize ml-2">{item.name}</span>
                        </div>
                        <a href="javascript:;" className="text-lighter" onClick={() => this.addSocalItem(index)}>{tu('so_add')} +</a>
                      </div>
                      {
                        item.links.map( link => {
                          return <div className="d-flex align-items-center mb-4">
                            <Input/>
                            <i className="delete-active ml-2"></i>
                          </div>
                        })
                        
                      }
                    </Col>
                    }
                  })
                }
              </Row>
            </div>
            

            <div className="text-right px-2">
              <button className="btn btn-default btn-lg">{tu('prev_step')}</button>
              <button className="ml-4 btn btn-danger btn-lg" htmltype="submit">{tu('submit')}</button>
            </div>
           

          </Form>
        </main>
    )
  }
}

export default Form.create({ name: 'input_info' })(injectIntl(TokenCreate));
