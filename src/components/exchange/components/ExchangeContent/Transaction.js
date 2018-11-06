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
import {find} from 'lodash'
const FormItem = Form.Item;
class Transaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modal: null,
        first_quant_buy:'',
        second_quant_buy:'',
        first_quant_sell:'',
        second_quant_sell:'',
        firstBalance: {},
        secondBalance: {}
    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const { selectStatus,currentWallet,exchangeData } = this.props
    const { firstBalance, secondBalance } = this.state
    if(selectStatus){
      //this.props.form.resetFields();
    }

    if(currentWallet && !firstBalance.name && !secondBalance.name ){
        if(currentWallet.tokenBalances.lenght>0){
            const first = find(currentWallet.tokenBalances, function(o) { return exchangeData.first_token_id === o.name });
            const second = find(currentWallet.tokenBalances, function(o) { return exchangeData.second_token_id === o.name });
    
            this.setState({firstBalance: first, secondBalance: second})
        }
       
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
              let quant =  exchangeData.first_token_id == "TRX"? parseFloat(values.first_quant_sell) * ONE_TRX:parseFloat(values.first_quant_sell);
              let expected = exchangeData.second_token_id == "TRX"? values.second_quant_sell * ONE_TRX:values.second_quant_sell;

              this.exchangeTransaction(exchangeData.exchange_id, token_id, quant, expected, values)
              console.log('Received values of form: ', values);
          }
      });
  }

  exchangeTransaction = async (exchangeId, tokenId, quant, expected,values) => {
      let {account,currentWallet,exchangeData} = this.props;
      console.log('account',account)
      console.log("currentWallet",currentWallet)
      let {success, code,transaction,message} = await Client.transactionExchange(currentWallet.address,exchangeId, tokenId, quant, expected)(account.key);
      console.log("success",success)
      console.log("code",code)
      console.log("transaction",transaction)
      if (success) {
          await Client.exchange({
              creatorAddress:currentWallet.address,
              trx_hash:transaction.hash,
              exchangeID:exchangeData.exchange_id,
              first_token_id:exchangeData.first_token_id,
              first_token_quant:values.first_quant_buy?parseFloat(values.first_quant_buy):parseFloat(values.first_quant_sell),
              second_token_id:exchangeData.second_token_id,
              second_token_quant:values.second_quant_buy?parseFloat(values.second_quant_buy):parseFloat(values.second_quant_sell),
              price:exchangeData.price
          });
          this.props.form.resetFields();
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

  getCalcCount = async(count, name, id) => {
    if(!count) return 0
    const data = await Client.getExchangeCalc({
        sell: count,
        sellID: name,
        exchangeID: id
    })
    return data.buyTokenQuant
  }

  hideModal = () => {
        this.setState({modal: null});
  };
  handleSecondValueBuy = async (e) => {
      let { exchangeData } = this.props
      // this.setState({
      //     second_quant_buy: e.target.value * exchangeData.price,
      // });
      const data = await this.getCalcCount(e.target.value, exchangeData.second_token_id, exchangeData.exchange_id)
      console.log(data)
      this.props.form.setFieldsValue({
        //   second_quant_buy: exchangeData.second_token_id == "TRX" ? parseFloat(e.target.value * exchangeData.price).toFixed(6):e.target.value * exchangeData.price,
        first_quant_buy: data
      });
  }

  handleSecondValueSell = async (e) => {
      let { exchangeData } = this.props
      // this.setState({
      //     second_quant_buy: e.target.value * exchangeData.price,
      // });
      const data = await this.getCalcCount(e.target.value, exchangeData.first_token_id, exchangeData.exchange_id)
      this.props.form.setFieldsValue({
        //   second_quant_sell: exchangeData.second_token_id == "TRX" ? parseFloat(e.target.value * exchangeData.price).toFixed(6):e.target.value * exchangeData.price,
        second_quant_sell: data
      });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let {exchangeData, first_quant_buy, second_quant_buy,first_quant_sell,second_quant_sell,account,currentWallet} = this.props;
    let {modal,firstBalance,secondBalance} = this.state;
    return (
      <div className="exchange__transaction d-flex">
          {modal}
        {/* 买入模块 */}
        <div className="exchange__transaction__item mr-2 p-3">
          <h5 className="mr-3">
          {exchangeData.exchange_name} ≈ {exchangeData.price && <span>{Number(exchangeData.price).toFixed(6)}</span>}
          { secondBalance.name&&<span className=" text-sm d-block">可用 {secondBalance.balance+' '+secondBalance.name}</span>}
          </h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmitBuy}>
           
            <FormItem
              label={<span>Amout want to sell</span>}
            >
            {getFieldDecorator('second_quant_buy', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={exchangeData.second_token_id}
                     placeholder="input placeholder"
                     size="large"
                     type="text"
                     //value={second_quant_buy}
                     onChange={this.handleSecondValueBuy}
              />
            )}
            </FormItem>

             <FormItem
                label={<span>Expected to buy</span>}
            >
                {getFieldDecorator('first_quant_buy', {
                    rules: [{ required: true, message: '请输入交易数量' }],
                })(
                    <Input addonAfter={exchangeData.first_token_id}
                           placeholder="input placeholder"
                           size="large"
                           type="text"
                           //value={first_quant_buy}
                           
                    />
                )}
            </FormItem>

            <FormItem>
              <Button type="primary" className="success" size="large" htmlType="submit" disabled={!account.address}>BUY {exchangeData.first_token_id}</Button>
            </FormItem>
          </Form>
        </div>

        {/* 卖出模块 */}
        <div className="exchange__transaction__item  p-3">
          <h5 className="mr-3">
            {exchangeData.exchange_name} ≈ {exchangeData.price && <span>{Number(exchangeData.price).toFixed(6)}</span>}
            { firstBalance.name&&<span className="text-sm d-block">可卖 {firstBalance.balance+' '+firstBalance.name}</span>}
        </h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmitSell} >
            <FormItem
              label={<span>Amout want to sell</span>}
            >
              {getFieldDecorator('first_quant_sell', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input
                  addonAfter={exchangeData.first_token_id}
                  placeholder="input placeholder"
                  size="large"
                  type="text"
                  //value={first_quant_sell}
                  onChange={this.handleSecondValueSell}
              />
            )}
            </FormItem>
            <FormItem
              label={<span>Expected to buy</span>}
            >
              {getFieldDecorator('second_quant_sell', {
                rules: [{ required: true, message: '请输入交易数量' }],
              })(
              <Input addonAfter={exchangeData.second_token_id}
                     placeholder="input placeholder"
                     size="large"
                     type="text"
                    // value={second_quant_sell}
              />
            )}
            </FormItem>
            <FormItem>
              <Button type="primary" className="warning" size="large" htmlType="submit" disabled={!account.address}>SELL {exchangeData.first_token_id}</Button>
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