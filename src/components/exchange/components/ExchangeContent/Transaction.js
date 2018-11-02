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
        first_quant_buy:'',
        second_quant_buy:'',
        first_quant_sell:'',
        second_quant_sell:''
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
          let quant = exchangeData.second_token_id == "TRX"?values.second_quant_buy * ONE_TRX:values.second_quant_buy;
          let expected =  exchangeData.first_token_id == "TRX"?values.first_quant_buy * ONE_TRX:values.first_quant_buy;

          this.exchangeTransaction(exchangeData.exchange_id, token_id, quant, expected, values)
          console.log('Received values of form: ', values);
      }
    });
  }


  handleSubmitSell = (e) => {
      let {account,currentWallet,exchangeData} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      console.log('exchangeData',exchangeData)
      e.preventDefault();
      this.props.form.validateFields(['first_quant_sell','second_quant_sell'],(err, values) => {
          if (!err) {
              let token_id = exchangeData.first_token_id == "TRX"?"_":exchangeData.first_token_id;
              let quant =  exchangeData.first_token_id == "TRX"? values.first_quant_sell * ONE_TRX:values.first_quant_sell;
              let expected = exchangeData.second_token_id == "TRX"? values.second_quant_buy * ONE_TRX:values.second_quant_buy;

              this.exchangeTransaction(exchangeData.exchange_id, token_id, quant, expected,values)
              console.log('Received values of form: ', values);
          }
      });
  }

  exchangeTransaction = async (exchangeId, tokenId, quant, expected,values) => {
      let {account,currentWallet,exchangeData} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      let {success, code,transaction} = await Client.transactionExchange(currentWallet.address,exchangeId, tokenId, quant, expected)(account.key);
      if (success) {
          let {success, code,transaction} = await Client.exchange({
              creatorAddress:currentWallet.address,
              trx_hash:transaction.hash,
              exchangeID:exchangeData.exchange_id,
              first_token_id:exchangeData.first_token_id,
              first_token_quant:values.first_quant_buy?values.first_quant_buy:values.first_quant_sell,//第一个token交易量
              second_token_id:exchangeData.second_token_id,
              second_token_quant:values.second_quant_buy?values.second_quant_buy:values.second_quant_sell,//第二个token交易量
              price:exchangeData.price
          });
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
    let {exchangeData, first_quant_buy, second_quant_buy,first_quant_sell,second_quant_sell} = this.props
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
                           type="text"
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
                     type="text"
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
                  type="text"
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
              <Input addonAfter={exchangeData.second_token_id}
                     placeholder="input placeholder"
                     size="large"
                     type="text"
              />
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
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create()(withRouter(Transaction))));