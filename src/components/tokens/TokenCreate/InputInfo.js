import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import SweetAlert from "react-bootstrap-sweetalert";
import 'moment/min/locales';
import NumericInput from '../../common/NumericInput';
import {TRXPrice} from "../../common/Price";
import moment from 'moment';
import {
  Form, Row, Col, Input, InputNumber, AutoComplete, DatePicker, Icon, Switch
} from 'antd';
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

// let leave_lock = false
 class TokenCreate extends Component {

  constructor(props) {
    super(props);

    this.state = {
      autoCompleteResult: [],
      social_total: 20,
      social_current: 4,
      modal: null,
      precision_20: 18,
      token_trx_order: true,
      ...this.props.state
    };
  }

  componentDidMount() {
    this.props.nextState({leave_lock: true})
  }

  componentDidUpdate(prevProps, prevState) {}

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
    const {iconList} = this.state
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.nextState({paramData: values, iconList})
        this.props.nextStep(2)
      }
    });
  }

  addSocal = (index) => {
    let {iconList} = this.state

    if(!iconList[index].active){
      iconList[index].active = true
    }else{
      iconList[index].active = false
      iconList[index].links = ['']
    }
    this.setState({ iconList: iconList })
  }
  addSocalItem = (index) => {
    let {iconList, social_current} = this.state
    this.checkAmount().then(() => {
      iconList[index].links.push('')
      this.setState({ iconList: iconList, social_current:  ++social_current })
    })
   
  }

  subSocalItem = (index, link_index) => {
    let {iconList, social_current} = this.state
    iconList[index].links.splice(link_index, 1)
    this.setState({ iconList: iconList, social_current:  --social_current})
  }

  checkAmount(amount){
    let {social_current, social_total} = this.state
    const {intl} = this.props

    return new Promise((resolve, reject) => {
      if(social_current < social_total){
        resolve()
      }else{
        this.setState({
          modal: <SweetAlert
                  warning
                  title={tu("socoal_v_format")}
                  confirmBtnText={intl.formatMessage({id: 'confirm'})}
                  confirmBtnBsStyle="danger"
                  onConfirm={() => this.setState({modal: null})}
                  style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                </SweetAlert>
        })
      }
    })
  }

  setLinks = (index, link_index, e) => {
    e.preventDefault();
    let {iconList} = this.state

    iconList[index].links.splice(link_index, 1, e.target.value)
    this.setState({ iconList: iconList })
  }

  render() {
    const { autoCompleteResult, type, isUpdate, iconList,modal, precision_20, token_trx_order } = this.state;
    const {intl, nextStep} = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const isTrc10 = type === 'trc10'
    const isTrc20 = type === 'trc20'

    const logoOptions = autoCompleteResult.map(logo => (
      <AutoCompleteOption key={logo}>{logo}</AutoCompleteOption>
    ));
    
    let first = {}
    let last = {}
    let abbrAmount = 0
    const {token_abbr, 
      trx_amount, 
      token_amount, 
      freeze_amount,
      participation_type,
      freeze_type} = getFieldsValue(['token_abbr', 'trx_amount', 'token_amount', 'freeze_amount', 'participation_type', 'freeze_type'])

    if(token_trx_order){
      first = {
        abbr: token_abbr,
        name: 'token_amount'
      }
      last = {
        abbr: 'trx',
        name: 'trx_amount'
      }
      abbrAmount = parseInt((trx_amount / token_amount)*100) / 100
    }else{
      first = {
        abbr: 'trx',
        name: 'trx_amount'
      }
      last = {
        abbr: token_abbr,
        name: 'token_amount'
      }
      abbrAmount = parseInt((token_amount / trx_amount)*100) / 100
    }
    return (
        <main className="">
          <Form
            className="ant-advanced-search-form"
            onSubmit={this.submit}
          >
            {/* base info */}
            <div>
              <h4 className="mb-2">{tu('basic_info')}</h4>
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
                      <TextArea autosize={{ minRows: 4, maxRows: 6 }}  placeholder={intl.formatMessage({id: 'description_message'})} disabled={isUpdate}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('total_supply')}>
                    {getFieldDecorator('token_supply', {
                      rules: [{ required: true, message: tu('supply_v_required'), whitespace: true}],
                    })(
                      <NumericInput placeholder={intl.formatMessage({id: 'supply_message'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                  <Form.Item label={tu('TRC20_decimals')}>
                    {getFieldDecorator('precision',{
                      rules: [{ required: true, message: ''}],
                    })(
                      <InputNumber min={0} max={ isTrc20? precision_20: 6} className="w-100"/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11} className={ isTrc20? 'd-block': 'd-none'}>
                  <Form.Item label={tu('token_logo')}>
                    {getFieldDecorator('logo_url', {
                      rules: [{ required: isTrc20, message: tu('logo_v_required'), whitespace: true},
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
                  <Form.Item label={tu('issuer')} required>
                    {getFieldDecorator('author',{
                      rules: [{ required: true, message: ''}],
                    })(
                      <Input disabled/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* contract info */}
            <div className={ isTrc20? 'd-block': 'd-none'}>
             <h4 className="mb-2">{tu('contract_info')}</h4>
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
                  {getFieldDecorator('contract_created_date')(
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
            <div className={ isTrc10? 'd-block': 'd-none'}>
              <h4 className="mb-2">{tu('price_info')}</h4>
              <hr/>
              <Row gutter={24} type="flex" justify="space-between" className="px-2">
                <Col span={24}>
                  <Form.Item label={tu('token_price')}  required className="m-0">
                    <div className="d-md-flex">
                      <span className="mr-3">trx{tu('trc20_last_price')}: <TRXPrice amount={1} currency="USD"/></span>
                      <div className="d-flex">
                        <Form.Item  className="d-flex align-items-center">
                          {getFieldDecorator(first.name, {
                            rules: [{ required: isTrc10, message: tu('enter_the_amount'), whitespace: true}]
                          })(
                            <NumericInput style={{width: '80px'}}/>
                          )}
                          {first.abbr}
                          </Form.Item>
                          
                        <Icon type="swap" className="mx-2 fix_form ordericon" onClick={() => this.setState({token_trx_order: !token_trx_order})}/>

                        <Form.Item  className="d-flex align-items-center mr-4">
                          {getFieldDecorator(last.name, { 
                            rules: [{ required: isTrc10, message: tu('enter_the_amount'), whitespace: true}]
                          })(
                            <NumericInput style={{width: '80px'}} className="mr-2"/>
                          )}
                          {last.abbr}
                          </Form.Item>
                        </div>
                        <span className={isNaN(abbrAmount)? 'd-none': ''} style={{color: '#9e9e9e'}}>(1 {first.abbr} = {`${abbrAmount} ${last.abbr}`})</span>
                    </div>
                 </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                <div className="part p-3 mb-4">
                  <div className="part_title mb-3">
                    <span className="part_title_name">{tu('participation')}</span>
                    {getFieldDecorator('participation_type', {valuePropName: 'checked'})(
                      <Switch checkedChildren={tu('freeze_on')} unCheckedChildren={tu('freeze_off')} />
                    )}
                  </div>
                  <div style={{marginBottom: '36px'}}>
                    {
                      participation_type?
                      <div>{tu('participation_message_0')} {token_abbr} {tu('participation_message_1')}</div>:
                      <div style={{marginBottom: '36px'}}>{tu('participation_message_2')}</div>
                    }
                  </div>
                  <Row gutter={24} type="flex" justify="space-between" className={`${participation_type? 'd-flex': 'd-none'} px-2`}>
                    <Col span={24} md={11}>
                      <Form.Item label={tu('start_time')}>
                        {getFieldDecorator('participation_start_date', {})(
                          <DatePicker style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                    <Col span={24} md={11}>
                      <Form.Item label={tu('end_time')}>
                        {getFieldDecorator('participation_end_date', {})(
                          <DatePicker style={{ width: '100%' }} />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
               </Col>
                <Col  span={24} md={11}>
                <div className="part p-3  mb-4">
                  <div className="part_title mb-3">
                    <span className="part_title_name">{tu('frozen_supply')}</span>
                    {getFieldDecorator('freeze_type', {valuePropName: 'checked'})(
                      <Switch checkedChildren={tu('freeze_on')} unCheckedChildren={tu('freeze_off')} />
                    )}
                  </div>
                  <div className="mb-3">{tu('frozen_supply_message_0')}</div>
                  <Row gutter={10} type="flex" justify="space-between" className={`${freeze_type? 'd-flex': 'd-none'} px-2`}>
                    <Col  span={8}>
                      <Form.Item label={tu('amount')}>
                        {getFieldDecorator('freeze_amount', {})(
                          <NumericInput className="w-100"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col  span={6}>
                      <Form.Item label={tu('days_to_freeze')}>
                        {getFieldDecorator('freeze_date', {})(
                          <NumericInput className="w-100"/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col  span={8}>
                      <p>{tu('total')}{tu('frozen_supply')}:</p>
                      <div className="frozen-supply-tip"><FormattedNumber value={freeze_amount}/></div>
                    </Col>
                  </Row>
                </div>
               </Col>
              </Row>
            </div>


            {/* social info */}
           <div>
              <h4 className="mb-2">{tu('social_info')}</h4>
              <hr/>
              <Row gutter={24} type="flex" justify="space-between" className="px-2">
                <Col  span={24} md={11}>
                  <Form.Item label={tu('trc20_token_info_Website')}>
                    {getFieldDecorator('website', {
                      rules: [{ required: true, message: tu('no_url_error'), whitespace: true}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'url_message'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col  span={24} md={11} className={ isTrc20? 'd-block': 'd-none'}>
                  <Form.Item label={tu('email')}>
                    {getFieldDecorator('email', {
                      rules: [{ required: isTrc20, message: tu('email_v_required'), whitespace: true},
                              {type: 'email', message: tu('email_v_format')}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'email_placeholder'})}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={24} className={ isTrc20? 'd-block': 'd-none'}>
                  <Form.Item label={tu('whitepaper_address')}>
                    {getFieldDecorator('white_paper', {})(
                      <Input placeholder={intl.formatMessage({id: 'whitepaper_address'})}/>
                    )}
                  </Form.Item>
                </Col>
               
              </Row>
            </div>
            
            <div className={ isTrc20? 'd-block px-2 mb-3': 'd-none'}>
              <div className="d-md-flex mb-4">
                <h5 className="mr-3 mb-md-0">{tu('select_socoal_link')}</h5>
                <div className="d-flex icon-list">
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
                      return <Col  span={24} md={11} key={index}>
                      <div className="d-flex justify-content-between mb-2 pr-4">
                        <div className="d-flex align-items-center">
                          <i className={`${item.name}-active`}></i>
                          <span className="text-capitalize ml-2">{item.name}</span>
                        </div>
                        <a href="javascript:;" className="text-lighter" onClick={() => this.addSocalItem(index)}>{tu('so_add')} +</a>
                      </div>
                      {
                        item.links.map( (link, link_index) => {
                          return <div className="d-flex align-items-center mb-4" key={link_index}>
                            <Input value={link} onChange={(e) => this.setLinks(index, link_index, e)}/>
                            {link_index> 0? 
                              <i className="delete-active ml-2 cursor-pointer"  onClick={() => this.subSocalItem(index, link_index)}></i>:
                              <i className="emty-icon ml-2"></i>
                            }
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
              <button className="btn btn-default btn-lg" onClick={() => nextStep(0)}>{tu('prev_step')}</button>
              <button className="ml-4 btn btn-danger btn-lg" htmltype="submit">{tu('next')}</button>
            </div>
           

          </Form>
          {modal}
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
