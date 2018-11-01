import React, {Component} from "react";
import { Form, Input, Button, Radio } from 'antd';
import {QuestionMark} from "../../../common/QuestionMark";
import { withRouter } from 'react-router'
import queryString from 'query-string';

const FormItem = Form.Item;

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
     firstName: '',
     lastName: ''
    }
  }

  componentDidMount() {
    this.getTokenName()
  }

  // 获取 tokenname
  getTokenName() {
    const parsed = queryString.parse(this.props.location.search).token;
    const tokens = parsed.split('/');
    
    this.setState({
      firstName: tokens[0],
      lastName: tokens[1]
    })
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {firstName, lastName} = this.state
    return (
      <div className="exchange__transaction d-flex">

        {/* 买入模块 */}
        <div className="exchange__transaction__item mr-2 p-3">
          <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            <FormItem
              label={<span>Amout want to sell <QuestionMark text="这是提示"/></span>}
            >
            {getFieldDecorator('note', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={lastName} placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem
              label={<span>Expected to buy <QuestionMark text="这是提示"/></span>}
            >
             {getFieldDecorator('note', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={firstName} placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem>
              <Button type="primary" className="success" size="large" htmlType="submit">BUY IGG</Button>
            </FormItem>
          </Form>
        </div>

        {/* 卖出模块 */}
        <div className="exchange__transaction__item  p-3">
          <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
          <hr/>
          <Form layout="vertical">
            <FormItem
              label={<span>Amout want to sell <QuestionMark text="这是提示"/></span>}
            >
              {getFieldDecorator('note', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={firstName} placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem
              label={<span>Expected to buy <QuestionMark text="这是提示"/></span>}
            >
              {getFieldDecorator('note', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={lastName} placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem>
              <Button type="primary" className="warning" size="large">SELL IGG</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

export default Form.create()(withRouter(Transaction));
