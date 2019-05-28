import React, {Component} from 'react';
import {t, tu} from "../../../../utils/i18n";
import SweetAlert from "react-bootstrap-sweetalert";
import { Form, Row, Col, Input} from 'antd';

export class SocialInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      social_total: 20,
      social_current: 4,
      modal: null,
      ...this.props.state
    };
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
    const { getFieldDecorator } = this.props.form
    const { intl } = this.props
    const {isTrc20, iconList, } =  this.props.state
    const {modal} = this.state

    return (
      <div>
        <div>
          <h4 className="mb-3">{tu('social_info')}</h4>
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
            <Col  span={24} md={11}>
              <Form.Item label={tu('GitHub')}>
                  {getFieldDecorator('github_url', {
                      rules: [{ required: false, message: tu('no_url_error'), whitespace: true}],
                  })(
                      <Input placeholder={intl.formatMessage({id: 'github_url_message'})}/>
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
        </div>
        {modal}
      </div>
    )
  }
}
