import React ,{Component} from 'react'
import {injectIntl} from "react-intl";
import {Client20} from "../../../../../services/api";
import {tu} from "../../../../../utils/i18n";
import { Table } from 'antd';
import {connect} from "react-redux";
import {withRouter} from 'react-router-dom';

class Register extends Component{
    constructor(){
        super()
        this.state = {
            sellList: [],
            buyList: [],
            timer: null,
            activeIndex:0,
            lastPrice:{
                value: '0.04998',
                type: 0
            }
        }
    }

    componentDidMount(){
        let { timer } = this.state;
        this.getData()
        clearInterval(timer)
        this.setState({
            timer:setInterval(() => {
                this.getData()
            }, 3000)
        })
       
    }

    componentDidUpdate(prevProps,nextProps){
        let { timer } = this.state;
        let {pairs} = this.props;
        if(prevProps.pairs.id != pairs.id){
            this.getData()
            clearInterval(timer)
            this.setState({
                timer:setInterval(() => {
                    this.getData()
                }, 3000)
            })
        }

    }

    render(){
       
        let {sellList,buyList,lastPrice} = this.state;
        let {intl,pairs} = this.props;
        
        let first_token =  pairs.fShortName ? '(' + pairs.fShortName + ')' : '';
        let second_token = pairs.sShortName ? '(' + pairs.sShortName + ')' : ''

        let trc20_price = intl.formatMessage({id: 'trc20_price'})+second_token
        let trc20_amount = intl.formatMessage({id: 'trc20_amount'})+first_token
        let trc20_accumulative = intl.formatMessage({id: 'trc20_accumulative'})+second_token

        const sell_columns = [{
            title: '',
            key: 'sell',
            render: (text, record, index) => {
              return <div>
                {intl.formatMessage({id: 'trc20_sell'})}{(index+1)}
              </div>
            }
          },
          {
            title: trc20_price,
            dataIndex: 'price',
            key: 'price',
          }, 
          {
            title:trc20_amount,
            dataIndex: 'amount',
            key: 'amount'
          },
          {
            title:trc20_accumulative,
            dataIndex: 'cje',
            key: 'cje'
          }
        ];

        const buy_columns = [{
            title: '',
            key: 'buy',
            render: (text, record, index) => {
              return <div>
                {intl.formatMessage({id: 'trc20_buy'})}{(index+1)}
              </div>
            }
          },
          {
            title: trc20_price,
            dataIndex: 'price',
            key: 'price',
          }, 
          {
            title:trc20_amount,
            dataIndex: 'amount',
            key: 'amount'
          },
          {
            title:trc20_accumulative,
            dataIndex: 'cje',
            key: 'cje'
          }
        ];


        return (
            <div className="ant-table-content">

                <Table
                    dataSource={sellList}
                    columns={sell_columns}
                    pagination={false}
                    rowKey={(record, index) => {
                        
                        return `sell_${index}`
                    }}
                    rowClassName={this.setActiveClass}
                />

                <div>
                    当前价格：{lastPrice.value}{pairs.id}
                </div>

                
                <Table
                    dataSource={buyList}
                    columns={buy_columns}
                    pagination={false}
                    rowKey={(record, index) => {
                        return `buy_${index}`
                    }}
                    rowClassName={this.setActiveClass}
                /> 

            
            </div>
        )
    }


    async getData(){
        let {pairs} = this.props;
        let exchangeId = pairs.id || '';

        if(!exchangeId){
          return ;
        }
        let { data,code } = await Client20.getRegisterList(exchangeId);
        
        if (code === 0) {
            if (data) {
                this.setState ({
                    buyList:await this.getList(data.buy, 1),
                    sellList:await this.getList(data.sell)
                })
                
            }
        }
    }

    async getList(data,type){
        let {pairs} =  this.props;
        let sPrecision = pairs.sPrecision ? pairs.sPrecision : 6;

        let obj1 = {}
      let obj2 = {}
      let listN = []
      if (data) {
        data = data.reduce((cur, next) => {
          obj2[next.OrderID]
            ? ''
            : (obj2[next.OrderID] = true && cur.push(next))
          return cur
        }, [])
        data.map(v => {
          if (obj1[v.Price]) {
            obj1[v.Price]['amount'] += v.amount
            obj1[v.Price]['curTurnover'] += v.curTurnover
          } else {
            obj1[v.Price] = {
              amount: v.amount,
              curTurnover: v.curTurnover
            }
          }
        })
        let list = Object.keys(obj1)
          .map(v => +v)
          .sort((a, b) => {
            return type ? b - a : a - b
          })
        let amount_list = []
        list.map((v,index) => {
          let amount = obj1[v].amount
          let curTurnover = obj1[v].curTurnover
          let cje = amount * v;
          let key = index;
          listN.push({
            key:key+1,
            price: (+v).toFixed(sPrecision),
            amount: amount.toFixed(2),
            curTurnover: curTurnover,
            cje: cje.toFixed(sPrecision)
          })
          amount_list.push(amount)
        })
        // const _max = Math.max.apply(null, amount_list)
        // if (type === 2) {
        //   this.buyMax = _max
        // } else {
        //   this.sellMax = _max
        // }
        listN.length > 5 && (listN.length = 5)
      }
      
      return listN
    }

    setActiveClass = (record, index) => {
        return record.exchange_id === this.state.activeIndex ? "exchange-table-row-active": "";
    }

}

function mapStateToProps(state) {
    return {
        pairs: state.exchange.data,
        lastPrice:{
            value: '0.04998',
            type: 0
        }
    };
  }
  
  const mapDispatchToProps = {
    
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(Register)));

