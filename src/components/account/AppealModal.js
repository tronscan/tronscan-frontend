import React, {Component} from 'react';
import {tu, t} from "../../utils/i18n";
import { Modal, Form, Checkbox, Input } from 'antd';
import xhr from "axios/index";
import {injectIntl} from "react-intl";
import {API_URL,CONTRACT_MAINNET_API_URL} from "../../constants";
import SweetAlert from "react-bootstrap-sweetalert";
const { TextArea } = Input;


class ChangeNameModal extends Component {
  constructor() {
    super();

    this.state = {
      disabled: true,
      modal: null,
      appealInfo: {}
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
  async getAppealRecent(){
    const { intl, address } = this.props
    const {data: {data, retCode}} = await xhr.get(CONTRACT_MAINNET_API_URL+'/external/trc_appeals/recent?address='+ address)
    if(retCode == 0){
      let appealInfo = {errorInfo: [], ...data.appeal}
      if(data.appeal){
        const appealArr = JSON.parse(data.appeal.reasons)
        appealArr.map(item => {
          let blackMap = intl.formatMessage({ id: `black_${item.id}` })
          if(item.id == 11){
            appealInfo.errorInfo.push(blackMap.replace('xxxxx', item.value.replace(/,$/, '')))
          }else{
            appealInfo.errorInfo.push(blackMap)
          }
        })
      }
      this.setState({appealInfo})
    }
  }

  async submitAppeal(contenttext){
    const { toAppealing, account: {address,tronWeb} } = this.props
    const {appealInfo} = this.state
   
    let content = {
      issuer_addr: address,
      address: appealInfo.address,
      content: contenttext,
      timestamp: new Date().getTime()
    }
    const content_str = JSON.stringify(content)
    let hash = tronWeb.toHex(content_str);
    let sig =  await tronWeb.trx.sign(hash)

    const { data } = await xhr.post(CONTRACT_MAINNET_API_URL+`/external/trc_appeals/${appealInfo.id}/update`, {
      content: content_str,
      sig
    })

    if(data.retCode == 0){
      this.handleCancel()
        toAppealing()
    }else{
      if(data.retMsg.length){
        const content = data.retMsg.map(item => <p className="mb-0">{tu("str_"+ item)}</p>)
        this.setState({modal: 
          <SweetAlert
            danger  
            onConfirm={() => this.setState({modal: null})}>
            {content} 
          </SweetAlert>
        })
      }
      
    }
  }

  componentDidUpdate(prevProps) {
    const {modalStatus, address} = this.props
    const {getFieldsValue} = this.props.form;
    if(prevProps.form !== this.props.form){
      const data = getFieldsValue(['reason', 'remember'])
      let lock = true
      Object.values(data).map(value => {
        lock = lock && value
      })
      this.setState({disabled: !lock})
    }

    if(modalStatus && modalStatus !=  prevProps.modalStatus && address){
      this.getAppealRecent()
    }
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const {disabled, appealInfo, modal} = this.state
   
    return (
      <div>
      {modal}
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
      <p>{appealInfo.errorInfo && appealInfo.errorInfo.map(item => {
        return <span className="d-block pl-3" key={item}>{item}</span>
      })}</p>
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
    </div>
    )
  }
}

export default Form.create({ name: 'appeal_modal'})(injectIntl(ChangeNameModal)); 
