import React from 'react';
import {t, tu} from "../../../../utils/i18n";
import {Form, Row, Col, Input, DatePicker} from 'antd';
const { TextArea } = Input;


export function ContractInfo({form, intl, state, loadContractCode}) {
    const { getFieldDecorator } = form;
    const {isTrc20, isUpdate } =  state;

    return (
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
                <Input
                    placeholder={intl.formatMessage({id: 'contract_address_placeholder'})}
                    disabled={isUpdate}
                    onChange={(ev)=> loadContractCode(ev.target.value)}
                />
              )}
            </Form.Item>
          </Col>
          <Col  span={24} md={11}>
          <Form.Item label={tu('contract_created_date')}>
            {getFieldDecorator('contract_created_date')(
              <DatePicker className="w-100" placeholder={intl.formatMessage({id: 'contract_created_date'})} disabled={true}/>
            )}
            </Form.Item>
          </Col>
            <Col  span={24} md={11}>
                <Form.Item label={tu('contract_created_address')}>
                    {getFieldDecorator('contract_created_address')(
                        <Input placeholder={intl.formatMessage({id: 'contract_created_address'})} disabled={true}/>
                    )}
                </Form.Item>
            </Col>
          {/*<Col  span={24}>*/}
            {/*<Form.Item label={tu('contract_code')}>*/}
            {/*{getFieldDecorator('contract_code', {*/}
              {/*rules: [{ required: isTrc20, message: tu('contract_address_required'), whitespace: true}],*/}
            {/*})(*/}
              {/*<TextArea rows={6}  placeholder={intl.formatMessage({id: 'contract_code_placeholder'})} />*/}
            {/*)}*/}
            {/*</Form.Item>*/}
          {/*</Col>*/}

        </Row>
      </div>
    )
}
