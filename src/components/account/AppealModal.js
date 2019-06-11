import React, {Component} from 'react';
import {tu, t} from "../../utils/i18n";
import { Modal, Form, Checkbox, Input } from 'antd';
import xhr from "axios/index";
import {injectIntl} from "react-intl";
import {API_URL} from "../../constants";
const { TextArea } = Input;

class ChangeNameModal extends Component {
  constructor() {
    super();

    this.state = {
      disabled: true
    };
  }

  handleCancel = e => {
   this.props.hiddenModal()
   this.props.form.resetFields();
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.submitAppeal(values.reason)
      }
    });
  };

  async submitAppeal(contenttext){
    const { appealInfo,toAppealing, account: {address,tronWeb} } = this.props
    let content = {
      issuer_addr: address,
      content: contenttext,
      timestamp: new Date().getTime()
    }
    const content_str = JSON.stringify(content)
    let hash = tronWeb.toHex(content_str);
    let sig =  await tronWeb.trx.sign(hash)

    const { data } = await xhr.post(`http://52.15.68.74:10086/external/trc_appeals/${appealInfo.id}/update`, {
      content: content_str,
      sig
    })
    
    if(data.retCode == 0){
      this.handleCancel()
        toAppealing()
    }
  }
  componentDidUpdate(prevProps) {
    const {getFieldsValue} = this.props.form;
    if(prevProps.form !== this.props.form){
      const data = getFieldsValue(['reason', 'remember'])
      let lock = true
      Object.values(data).map(value => {
        lock = lock && value
      })
      this.setState({disabled: !lock})
    }
    
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const {disabled} = this.state
    const { appealInfo } = this.props

    return (
      <Modal
      title={tu('Appeal')}
      width="100%"
      wrapClassName="appeal-modal"
      visible={this.props.modalStatus}
      centered
      onCancel={this.handleCancel}
      footer={null}
      maskClosable={false}
    >
      <h3 className="col_red">{t('black_reason')}</h3>
      <p>{appealInfo.errorInfo && appealInfo.errorInfo.join(',')}</p>
      <h3>{t('appeal_reason')} <span className="text-small">（{t('handle_time')}）</span></h3>
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('reason', {})(
            <TextArea autosize={{ minRows: 4, maxRows: 6 }}/>,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked'
          })(<Checkbox>{t('i_know_black')}</Checkbox>)}
        </Form.Item>
        <div className="text-center pt-4">
          <a className="btn btn-default btn-lg" onClick={this.handleCancel}>{tu('cancel')}</a>
          <button className="ml-4 btn btn-danger btn-lg" htmltype="submit" disabled={disabled}>{tu('submit')}</button>
          </div>
      </Form>
    </Modal>
    )
  }
}

export default Form.create({ name: 'appeal_modal'})(injectIntl(ChangeNameModal)); 
