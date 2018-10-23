import React, {Component} from "react";
import { Form, Input, Button, Radio } from 'antd';
const FormItem = Form.Item;

class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    }
  }

  componentDidMount() {
    // this.fetch();
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
    return (
      <div className="exchange__transaction mb-2 d-flex">

        {/* 买入模块 */}
        <div className="exchange__transaction__item mr-2 p-3">
          <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
          <hr/>
          <Form layout="vertical">
            <FormItem
              label="Amout want to sell"
            >
            {getFieldDecorator('note', {
                rules: [{ required: true, message: 'Please input your note!' }],
              })(
              <Input placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem
              label="Expected to buy"
            >
              <Input placeholder="input placeholder" size="large"/>
            </FormItem>
            <FormItem>
              <Button type="primary" className="success" size="large">BUY IGG</Button>
            </FormItem>
          </Form>
        </div>

        {/* 卖出模块 */}
        <div className="exchange__transaction__item  p-3">
          <h5 className="mr-3">IGG/MEETONE ≈ <span>0.00245</span></h5>
          <hr/>
          <Form layout="vertical">
            <FormItem
              label="Field A"
            >
              <Input placeholder="input placeholder"  size="large"/>
            </FormItem>
            <FormItem
              label="Field B"
            >
              <Input placeholder="input placeholder"  size="large"/>
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

export default Form.create()(Transaction);
