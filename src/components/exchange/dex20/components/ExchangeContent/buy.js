import React, {Component} from "react";
import { Form, Input, Button, Radio } from 'antd';
import { QuestionMark } from "../../../../common/QuestionMark";
import { withRouter } from 'react-router'
import {Client} from "../../../../../services/api";
import SweetAlert from "react-bootstrap-sweetalert";
import {tu} from "../../../../../utils/i18n";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {ONE_TRX} from "../../../../../constants";
import {find} from 'lodash'
import {getBalance,buyByContract} from '../../TW'
import { Slider } from 'antd';

import NumericInput from './NumericInput'
import {getDecimalsNum,onlyInputNumAndPoint} from '../../../../../utils/number'
const marks = {
    0: '',
    25: '',
    50: '',
    75: '',
    100: ''
  };


function formatter(value) {
    return `${value}%`;
}

const FormItem = Form.Item;
class Buy extends Component{
    constructor(props){
        super(props)
        this.state = {
            modal: null,
            firstBalance: null,
            secondBalance: null,
            price:0,
            amount:0,
            total:0,
            transTip:false,
            firstError: false,
            secondError: false,
            limitError: '',
            trs_proportion:0
        }

        this.slideChange = this.slideChange.bind(this)
    }

    componentDidMount(){
        this.setBalance()
    }

    componentDidUpdate(prevProps){
        let {exchangeData} = this.props;
        if(prevProps.exchangeData != exchangeData){
            this.setBalance()
        }
    }



    render(){
        const { getFieldDecorator } = this.props.form;
        let {exchangeData,account,intl,onSubmit,onChange,exchangeTransaction} = this.props;
        let {modal,firstBalance,total,secondError,firstError,limitError,trs_proportion} = this.state;
        console.log('trs_proportion',trs_proportion)


        return (
            <div className="exchange__transaction__item mr-2 p-3">
          <h5 className="mr-3">
          {exchangeData.fShortName}/{exchangeData.sShortName} ≈ {exchangeData.price && <span>{Number(exchangeData.price).toFixed(6)}</span>}
          {/* { (secondBalance&& secondBalance.name)&&<span className=" text-sm d-block">{tu("TxAvailable")} {secondBalance.balance+' '+secondBalance.name}</span>} */}
          </h5>
          <hr/>
          <Form layout="vertical" onSubmit={this.handleSubmit}>
             <FormItem
                label={<span>{tu("trc20_price")}</span>}
            >
                {getFieldDecorator('first_quant_buy', {
                    rules: [{ required: true, message: intl.formatMessage({id: 'trc20_enter_the_trading_price'}) }],
                })(
                    <NumericInput addonAfter={exchangeData.sShortName}
                           placeholder={intl.formatMessage({id: 'trc20_enter_the_trading_price'})}
                           size="large"
                           type="text"
                           onKeyPress={(e)=>this.onpress(e)}
                           onChange={this.handleValueBuy0}
                           onFocus={(e) => this.onfocus(e,1)}
                           onBlur={(e) => this.onblur(e,1)}
                    />
                )}
                <div>{firstError}</div>
                <div>{limitError}</div>
            </FormItem>

            <FormItem
              label={<span>{tu("trc20_amount")} <span className="tx-question-mark"><QuestionMark text="slightly_cost"/></span></span>}
            >
            {getFieldDecorator('second_quant_buy', {
                rules: [{ required: true, message: intl.formatMessage({id: 'trc20_enter_the_trading_amount'}) }],
              })(
              <NumericInput addonAfter={exchangeData.fShortName}
                     placeholder={intl.formatMessage({id: 'trc20_enter_the_trading_amount'})}
                     size="large"
                     type="text"
                     onKeyPress={this.onpress}
                     onChange={this.handleValueBuy1}
                     onFocus={(e) => this.onfocus(e,2)}
                     onBlur={(e)=>this.onblur(e,2)}
              />
              
            )}
            <div>{secondError}</div>
            </FormItem>
                
            <FormItem
                label={<span>{ tu('trc20_available_balance') } <span className="tx-question-mark">{firstBalance}{ exchangeData.sShortName }</span></span>}
            >
            </FormItem>

            <FormItem>
                <Slider marks={marks} value={trs_proportion} defaultValue={0} step={null} tipFormatter={formatter} onChange={this.slideChange}/>
            </FormItem>

            <div className="d-flex justify-content-between">
                <p className="text">{ tu('trc20_volume') }：</p>
                <b
                className="text-lg">{total}{ exchangeData.sShortName }</b>
            </div>

            <FormItem>
              <Button type="primary" className="success" size="large" htmlType="submit" disabled={!account.address}>{tu("BUY")} {exchangeData.fShortName}</Button>
            </FormItem>
          </Form>
        </div>
        )
    }
      

    handleSubmit = (e) => {
        let {price,amount,secondError,firstError,limitError} = this.state;
        let {intl} = this.props;
        if (price * amount < 10) {
            this.setState({
                secondError:intl.formatMessage({id:'trc20_enter_10'})
            })
            return
          }
          if (
            !price ||
            !amount ||
            firstError ||
            secondError ||
            limitError
          ) {
            return
          }
          if (price * amount > this.balance) {
            this.setState({
                secondError:intl.formatMessage({id:'trc20_balance_tip'})
            })
            return
          }
          if (!amount) {
            this.setState({
                secondError:intl.formatMessage({id:'trc20_enter_the_trading_amount'})
            })
            return
          }
        //   this.isOrder = true
          this.orderSubmit()
  
      
    }

    async orderSubmit(){
        let {exchangeData,account} = this.props;
        let {amount,price} = this.state;
        let tokenA = exchangeData.fTokenAddr
        let tokenB = exchangeData.sTokenAddr

        const firstPrecision = Math.pow(10, exchangeData.fPrecision || 8)
        const secondPrecision = Math.pow(10, (exchangeData.sPrecision || 8)) 
  
        const data = {
          _user: account.address,
          _tokenA: tokenA,
          _amountA: amount * firstPrecision,
          _tokenB: tokenB,
          _price: price * secondPrecision,
          _amountB: amount * price * secondPrecision
        }

        console.log(data)
        // let id
        // try {
        //   id = await buyByContract(data)
        //   if (id) {
        //     this.$message({
        //       message: this.$t('exchange.order_success'),
        //       type: 'success',
        //       duration: 3000
        //     })
        //     this.setBalance()
        //   }
        // } catch (error) {
        //   console.log(error)
        //   this.$message.error(this.$t('exchange.order_fail'))
        // }
    }


    async setBalance() {
        let {account,exchangeData} = this.props;
       
        let _b = 0
        if (account.address && exchangeData.sTokenAddr) {
          if (exchangeData.sTokenAddr === 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb') {
            _b =
              (await window.tronWeb.trx.getUnconfirmedBalance(account.address)) /
              Math.pow(10, exchangeData.sPrecision)
          } else {
            _b = await getBalance({
              _tokenA: exchangeData.sTokenAddr,
              _uToken: account.address,
              _precision: exchangeData.sPrecision
            })
          }
        }
        this.setState({
            firstBalance:_b
        })
        
        // this.setTokenBalance({ b: _b })
      }

      transTotal() {
        let {price,amount} = this.state;
        let {exchangeData }  = this.props;
        let total = 0
        if (!isNaN(+price) && !isNaN(+amount)) {
          total = +price * +amount
        }
        if (getDecimalsNum(total) > exchangeData.sPrecision) {
          total = total.toFixed(exchangeData.sPrecision)
        }
        this.setState({
            total:total
        })

        return total
      }


      handleValueBuy0 =  (value) => {
          let {exchangeData} = this.props;
          let {price,firstBalance,amount} = this.state;

        let precision = exchangeData.sPrecision
        if (amount) {
            const _p = getDecimalsNum(+amount)
            precision = precision - _p
        }
        let value1 = onlyInputNumAndPoint(value, precision)

        this.setState({
            price:value1
        },()=>{
            firstBalance && this.setSlider()
            this.transTotal()
        })    
      }

      

      handleValueBuy1 = (value)=>{

        let {exchangeData} = this.props;
        let {price,firstBalance,amount} = this.state;
        let precision = exchangeData.sPrecision
        if (price) {
            const _p = getDecimalsNum(+price)

            precision = precision - _p
        }
        let value1 = onlyInputNumAndPoint(value, precision)
        // this.setMaxLen(value, precision)
            this.setState({
                amount:value1
            },()=>{
                firstBalance && this.setSlider()
                this.transTotal()
            })
      
        }

        setSlider(){
            let {price,amount,firstBalance} = this.state;
            let trs_proportion =
            (price * amount * 100) / firstBalance

            
            this.setState({
                trs_proportion:trs_proportion
            })
        }

      onblur(e, type) {
         let {intl,exchangeData} = this.props;
         let {price,amount,firstBalance,transTip} = this.state
         let firstError,secondError
        if (!e.target.value) {
          type === 1
            ? firstError = intl.formatMessage({id: 'trc20_enter_the_trading_price'}) && this.setState({firstError:firstError})    
            : secondError = intl.formatMessage({id: 'trc20_enter_the_trading_amount'})&& this.setState({firstError:secondError})
            
        } else {
          if (price * amount > firstBalance) {
            secondError = intl.formatMessage({id: 'trc20_balance_tip'})
            this.setState({secondError:secondError})
          }
          if (
            type === 1 &&
            price >
              (exchangeData.price * 1.1) / Math.pow(10, exchangeData.sPrecision)
          ) {
            clearTimeout(t)
            let transTip = true
            const t = setTimeout(() => {
              transTip = false
              this.setState({
                transTip:transTip
              })
              clearTimeout(t)
            }, 3000)
          }
        }

      }

      onfocus(e, type) {
        let firstError ,secondError;
        type === 1 ? (firstError = '' && this.setState({firstError:firstError})) : (secondError = '' && this.setState({secondError:secondError}))
        this.setState({limitError:''})

      }

      onpress(e) {
        var charCode = e.keyCode
        if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
        ) {
          e.preventDefault()
        } else {
          return true
        }
      }


      slideChange(value){
         
          let {exchangeData} = this.props;
          let {price,firstBalance} = this.state;
            if (!price) {
            return
          }
          let precision = exchangeData.sPrecision
          if (price) {
            const _s = price.toString().split('.')[1]
            const _p = (_s && _s.length) || 0
            precision = precision - _p
          }
          let _a = (firstBalance * value) / (100 * price)
          const _l = getDecimalsNum(_a)
          if (_l <= precision) {
            
          } else {
            _a = _a.toString()
            _a = Number(
              _a.substring(0, _a.lastIndexOf('.') + precision + 1)
            )
          }

          this.setState({
              amount:_a,
              secondError : false,
              trs_proportion : value
          },()=>{
            this.transTotal()
          })

          this.props.form.setFieldsValue({
            second_quant_buy: _a
        });


          
      }
}

function mapStateToProps(state) {

    return {
        exchangeData: state.exchange.data,
        selectStatus: state.exchange.status,
        account: state.app.account,
        currentWallet: state.wallet.current,
        activeLanguage:  state.app.activeLanguage,
    };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Form.create()(withRouter(Buy))));