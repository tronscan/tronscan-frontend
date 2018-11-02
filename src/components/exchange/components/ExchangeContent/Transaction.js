import React, {Component} from "react";
import { Form, Input, Button, Radio } from 'antd';
import {QuestionMark} from "../../../common/QuestionMark";
import { withRouter } from 'react-router'
import queryString from 'query-string';
import {Client} from "../../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import {tu} from "../../../../utils/i18n";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {ONE_TRX} from "../../../../constants";
const FormItem = Form.Item;
class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modal: null,
    }
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    const { selectStatus } = this.props
    if(selectStatus){
      this.props.form.resetFields();
    }
  }
 

  handleSubmitBuy = (e) => {
      let {account,currentWallet,exchangeData} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      console.log('exchangeData',exchangeData)
      e.preventDefault();

    this.props.form.validateFields(['first_quant_buy','second_quant_buy'],(err, values) => {
      if (!err) {
          let token_id = exchangeData.second_token_id == "TRX"?"_":exchangeData.second_token_id;
          let quant = exchangeData.first_token_id == "TRX"? values.second_quant_buy * ONE_TRX:values.second_quant_buy;
          let expected = exchangeData.second_token_id == "TRX"? values.first_quant_buy * ONE_TRX:values.first_quant_buy;

          this.exchangeTransaction(exchangeData.exchange_id, token_id, quant, expected)
        console.log('Received values of form: ', values);
      }
    });
  }

    // "creatorAddress":"TFA1qpUkQ1yBDw4pgZKx25wEZAqkjGoZo1",//创建者
    // "exchangeID":1,
    // "tokenID":"IGG",//撤资token
    // "quant":10000.2,//撤资数量
    // "expected":

  handleSubmitSell = (e) => {
      let {account,currentWallet,exchangeData} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      console.log('exchangeData',exchangeData)
      e.preventDefault();
      this.props.form.validateFields(['first_quant_sell','second_quant_sell'],(err, values) => {
          if (!err) {
              let token_id = exchangeData.first_token_id == "TRX"?"_":exchangeData.first_token_id;
              let quant = exchangeData.first_token_id == "TRX"? values.first_quant_sell * ONE_TRX:values.first_quant_sell;
              let expected = exchangeData.second_token_id == "TRX"? values.second_quant_sell * ONE_TRX:values.second_quant_sell;

              this.exchangeTransaction(exchangeData.exchange_id, token_id, quant, expected)
              console.log('Received values of form: ', values);
          }
      });
  }

  exchangeTransaction = async (exchangeId, tokenId, quant, expected) => {
      let {account,currentWallet} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      let {success, code} = await Client.transactionExchange(currentWallet.address,exchangeId, tokenId, quant, expected)(account.key);
      if (success) {
          this.setState({
              modal: (
                  <SweetAlert success title={tu("transaction_success")} onConfirm={this.hideModal}>
                      {tu("transaction_success_message")}
                  </SweetAlert>
              )
          });
      } else {
          this.setState({
              modal: (
                  <SweetAlert danger title={tu("transaction_error")} onConfirm={this.hideModal}>
                      {tu("transaction_error_message")}<br/>
                    Code: {code}
                  </SweetAlert>
              ),
          });
      }
  };

  hideModal = () => {
        this.setState({modal: null});
  };
  handleSecondValueBuy = (e) => {
      let { exchangeData } = this.props
      this.props.form.setFieldsValue({
          second_quant_buy: e.target.value * exchangeData.price,
      });
  }

  handleSecondValueSell = (e) => {
      let { exchangeData } = this.props
      this.props.form.setFieldsValue({
          second_quant_sell: e.target.value * exchangeData.price,
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let {exchangeData} = this.props
    return (
      <div className="exchange__transaction d-flex">

        {/* 买入模块 */}
        <div className="exchange__transaction__item mr-2 p-3">
          <h5 className="mr-3">{exchangeData.exchange_name} ≈ <span>{exchangeData.price}</span></h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmitBuy}>
            <FormItem
                label={<span>Expected to buy <QuestionMark text="这是提示"/></span>}
            >
                {getFieldDecorator('first_quant_buy', {
                    rules: [{ required: true, message: '请输入交易数量' }],
                })(
                    <Input addonAfter={exchangeData.first_token_id}
                           placeholder="input placeholder"
                           size="large"
                           type="number"
                           onChange={this.handleSecondValueBuy}
                    />
                )}
            </FormItem>
            <FormItem
              label={<span>Amout want to sell <QuestionMark text="这是提示"/></span>}
            >
            {getFieldDecorator('second_quant_buy', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={exchangeData.second_token_id}
                     placeholder="input placeholder"
                     size="large"
                     type="number"
              />
            )}
            </FormItem>

            <FormItem>
              <Button type="primary" className="success" size="large" htmlType="submit">BUY IGG</Button>
            </FormItem>
          </Form>
        </div>

        {/* 卖出模块 */}
        <div className="exchange__transaction__item  p-3">
          <h5 className="mr-3">{exchangeData.exchange_name} ≈ <span>{exchangeData.price}</span></h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmitSell} >
            <FormItem
              label={<span>Amout want to sell <QuestionMark text="这是提示"/></span>}
            >
              {getFieldDecorator('first_quant_sell', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input
                  addonAfter={exchangeData.first_token_id}
                  placeholder="input placeholder"
                  size="large"
                  onChange={this.handleSecondValueSell}
              />
            )}
            </FormItem>
            <FormItem
              label={<span>Expected to buy <QuestionMark text="这是提示"/></span>}
            >
              {getFieldDecorator('second_quant_sell', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={exchangeData.second_token_id} placeholder="input placeholder" size="large"/>
            )}
            </FormItem>
            <FormItem>
              <Button type="primary" className="warning" size="large" htmlType="submit">SELL IGG</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
    return {
        exchangeData: state.exchange.data,
        selectStatus: state.exchange.status,
        account: state.app.account,
        tokenBalances: state.account.tokens,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create()(withRouter(Transaction))));