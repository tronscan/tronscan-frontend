import React, {Component} from 'react';
import {t, tu} from "../../../../utils/i18n";
import SweetAlert from "react-bootstrap-sweetalert";
import { Form, Row, Col, Input} from 'antd';

export class SocialInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      ...this.props.state
    };
  }

  addSocal = (index) => {
    let {iconList, social_current} = this.state
   
      if(!iconList[index].active){
        this.checkAmount().then(() => {
          iconList[index].active = true
          social_current++
          this.setState({ iconList, social_current })
          this.props.changeCount(social_current)
        })
      }else{
        iconList[index].active = false
        iconList[index].link = ['']
        social_current--
        this.setState({ iconList, social_current })
        this.props.changeCount(social_current)
      }
  }
  addSocalItem = (index) => {
    let {iconList, social_current} = this.state;
    this.checkAmount().then(() => {
      iconList[index].link.push('')
      this.setState({ iconList: iconList, social_current:  social_current+ 1 })
      this.props.changeCount(social_current + 1)
    })
   
  }

  subSocalItem = (index, link_index) => {
    let {iconList, social_current} = this.state
    iconList[index].link.splice(link_index, 1)
    this.setState({ iconList: iconList, social_current:  social_current - 1})
    this.props.changeCount(social_current - 1)
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

    iconList[index].link.splice(link_index, 1, e.target.value)
    this.setState({ iconList: iconList })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { intl } = this.props
    let  {isTrc20, iconList, isUpdate } =  this.props.state
    const {modal} = this.state;
    return (
      <div>
        <div>
          <h4 className="mb-3">{tu('social_info')}</h4>
          <hr/>
          <Row gutter={24} type="flex" justify="space-between" className="px-2">
            <Col  span={24} md={11}>
              <Form.Item label={tu('project_website')}>
                {getFieldDecorator('website', {
                  rules: [{ required: true, message: tu('no_url_error'), whitespace: true}],
                })(
                  <Input placeholder={intl.formatMessage({id: 'project_website'})}/>
                )}
              </Form.Item>
            </Col>
            <Col  span={24} md={11} className={ isTrc20 || isUpdate? 'd-block': 'd-none'}>
              <Form.Item label={tu('email')}>
                {getFieldDecorator('email', {
                  rules: [{ required: isTrc20, message: tu('email_v_required'), whitespace: true},
                          {type: 'email', message: tu('email_v_format')}],
                })(
                  <Input placeholder={intl.formatMessage({id: 'email_placeholder'})}/>
                )}
              </Form.Item>
            </Col>
            <Col  span={24} md={11} className={ isTrc20 || isUpdate? 'd-block': 'd-none'}>
              <Form.Item label={tu('GitHub')}>
                  {getFieldDecorator('github_url', {
                      rules: [{ required: false, message: tu('no_url_error'), whitespace: true}],
                  })(
                      <Input placeholder={intl.formatMessage({id: 'GitHub'})}/>
                  )}
              </Form.Item>
            </Col>
            <Col span={24}  md={11} className={ isTrc20 || isUpdate? 'd-block': 'd-none'}>
              <Form.Item label={tu('whitepaper_address')}>
                {getFieldDecorator('white_paper', {})(
                  <Input placeholder={intl.formatMessage({id: 'whitepaper_address'})}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <div className={`${!isTrc20 && !isUpdate? 'd-block': 'd-none'} pl-2`}>
            <i className="fas fa-exclamation-circle mr-2" style={{color:"#FF8C00"}}></i>
              {tu("token_input_trc10_tip")}
          </div>

        </div>
        
        <div className={ isTrc20 || isUpdate? 'd-block px-2 mb-3': 'd-none'}>
          <div className="d-flex mb-3">
            <h5>{tu('select_socoal_link')}</h5>
            <div className="d-flex icon-list ml-3">
              {
                  iconList.map((item, index) => {
                  return <div key={index} 
                              className={`${item.active? item.method+'-active': item.method} icon-list-item mr-2`}
                              onClick={() => this.addSocal(index)}
                        ></div>
                })
              }
            </div>
          </div>

          <Row gutter={24} type="flex" justify="space-between">
            {
               iconList.map((item, index) => {
                if(item.active){
                  return <Col  span={24} md={11} key={index}>
                  <div className="d-flex justify-content-between mb-2 pr-4">
                    <div className="d-flex align-items-center">
                      <i className={`${item.method}-active`}></i>
                      <span className="text-capitalize ml-2">{item.method}</span>
                    </div>
                    <a href="javascript:;" className="text-lighter" onClick={() => this.addSocalItem(index)}>{tu('so_add')} +</a>
                  </div>
                  {
                    item.link.map( (link, link_index) => {
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
          <div className={`${isTrc20 && !isUpdate? 'd-block': 'd-none'} pl-2`}>
            <i className="fas fa-exclamation-circle mr-2" style={{color:"#FF8C00"}}></i>
              {tu("token_input_trc20_tip")}
          </div>
        </div>
        {modal}
      </div>
    )
  }
}
