import React, {Component} from 'react';
import {t, tu} from "../../../../utils/i18n";
import NumericInput from '../../../common/NumericInput';
import {
  Form, Row, Col, Input, InputNumber, AutoComplete
} from 'antd';
const { TextArea } = Input;
const AutoCompleteOption = AutoComplete.Option;

export class BaseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoCompleteResult: [],
      precision_20: 18,
      ...this.props.state
    };
  }

  handleLogoChange = (value) => {
    let autoCompleteResult;
    if (!value || /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/.test(value)) {
      autoCompleteResult = [];
    }else {
      autoCompleteResult = ['.jpg', '.png','.PNG','.JPG','.jpeg'].map(domain => `${value}${domain}`);
    }
    this.setState({ autoCompleteResult });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.props
    const { precision_20, autoCompleteResult } =  this.state
    const { isTrc20 } = this.props.state

    const logoOptions = autoCompleteResult.map(logo => (
      <AutoCompleteOption key={logo}>{logo}</AutoCompleteOption>
    ));

    return (
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
              <TextArea autosize={{ minRows: 4, maxRows: 6 }}  placeholder={intl.formatMessage({id: 'description_message'})} />
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
        {/*<Col  span={24} md={11} className={ isTrc20? 'd-block': 'd-none'}>*/}
        <Col  span={24} md={11}>
          <Form.Item label={tu('token_logo')}>
            {getFieldDecorator('logo_url', {
              rules: [{ required: isTrc20, message: tu('logo_v_required'), whitespace: true},
                      {pattern: /\.jpg|\.png|\.PNG|\.JPG|\.jpeg$/, message: tu('logo_v_format')}],
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
    )
  }
}
