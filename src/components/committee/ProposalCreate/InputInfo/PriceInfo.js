import React, {Component} from 'react';
import {t, tu} from "../../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import 'moment/min/locales';
import NumericInput from '../../../common/NumericInput';
import {TRXPrice} from "../../../common/Price";
import {
  Form, Row, Col, DatePicker, Icon, Switch
} from 'antd';

export class PriceInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token_trx_order: true,
      ...this.props.state
    };
  }

  render() {
    const { getFieldDecorator, getFieldsValue } = this.props.form;
    const { token_trx_order } = this.state;
    const { isTrc10, isUpdate } =  this.props.state;

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
        abbr: 'TRX',
        name: 'trx_amount'
      }
      abbrAmount = parseInt((trx_amount / token_amount)*100) / 100
    }else{
      first = {
        abbr: 'TRX',
        name: 'trx_amount'
      }
      last = {
        abbr: token_abbr,
        name: 'token_amount'
      }
      abbrAmount = parseInt((token_amount / trx_amount)*100) / 100
    }
    return (
      <div className={ isTrc10? 'd-block': 'd-none'}>
              <h4 className="mb-3">{tu('price_info')}</h4>
              <hr/>
              <Row gutter={24} type="flex" justify="space-between" className="px-2">
                <Col span={24}>
                  <Form.Item label={tu('token_price')}  required className="m-0">
                    <div className="d-flex">

                      <Form.Item  className="d-flex align-items-center">
                        {getFieldDecorator(first.name, {
                          rules: [{ required: isTrc10, message: tu('enter_the_amount'), whitespace: true}]
                        })(
                          <NumericInput style={{width: '200px'}} className="mr-2" disabled={isUpdate}/>
                        )}
                        {first.abbr}
                        </Form.Item>
                        
                      <Icon type="swap" className="mx-2 fix_form ordericon" onClick={() => this.setState({token_trx_order: !token_trx_order})}/>

                      <Form.Item  className="d-flex align-items-center mr-4">
                        {getFieldDecorator(last.name, { 
                          rules: [{ required: isTrc10, message: tu('enter_the_amount'), whitespace: true}]
                        })(
                          <NumericInput style={{width: '200px'}} className="mr-2" disabled={isUpdate}/>
                        )}
                        {last.abbr}
                        </Form.Item>
                        <span className={isNaN(abbrAmount)? 'd-none': ''} style={{color: '#9e9e9e'}}>(1 {first.abbr} = {`${abbrAmount} ${last.abbr}`})</span>
                        <span className="mr-3">TRX{tu('trc20_last_price')}: <TRXPrice amount={1} currency="USD"/></span>
                    </div>
                 </Form.Item>
                </Col>
                <Col  span={24} md={11}>
                <div className="part p-3 mb-4">
                  <div className="part_title mb-3">
                    <span className="part_title_name">{tu('participation')}</span>
                    {getFieldDecorator('participation_type', {valuePropName: 'checked'})(
                      <Switch checkedChildren={tu('freeze_on')} unCheckedChildren={tu('freeze_off')} disabled={isUpdate}/>
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
                    <Col  span={11}>
                      <Form.Item label={tu('start_time')}>
                        {getFieldDecorator('participation_start_date', {})(
                          <DatePicker style={{ width: '100%' }} disabled={isUpdate}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col  span={11}>
                      <Form.Item label={tu('end_time')}>
                        {getFieldDecorator('participation_end_date', {})(
                          <DatePicker style={{ width: '100%' }} disabled={isUpdate}/>
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
                      <Switch checkedChildren={tu('freeze_on')} unCheckedChildren={tu('freeze_off')} disabled={isUpdate}/>
                    )}
                  </div>
                  <div className="mb-3">{tu('frozen_supply_message_0')}</div>
                  <Row gutter={10} type="flex" justify="space-between" className={`${freeze_type? 'd-flex': 'd-none'} px-2`}>
                    <Col  span={8}>
                      <Form.Item label={tu('amount')}>
                        {getFieldDecorator('freeze_amount', {})(
                          <NumericInput className="w-100"  disabled={isUpdate}/>
                        )}
                      </Form.Item>
                    </Col>
                    <Col  span={6}>
                      <Form.Item label={tu('days_to_freeze')}>
                        {getFieldDecorator('freeze_date', {})(
                          <NumericInput className="w-100"  disabled={isUpdate}/>
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
    )
  }
}
