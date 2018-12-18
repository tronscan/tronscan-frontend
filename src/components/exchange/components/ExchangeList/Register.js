import React,{Component} from 'react'

import {Client} from "../../../../services/api";

class Register extends Component{
    constructor(){
        super()
        this.state = {
            buyList:[],
            sellList:[],
            header:['pairs','last_price','pairs_change','sShortName']
        }
    }

    componentDidMount() {
        this.getData(30);
        
    }

    render(){
        let {header,buyList,sellList} = this.state;
        return (
            <div>
                <table border="0" cellPadding="0" cellSpacing="0">
                <colgroup>
                    <col
                        name="mark_0"
                        width="100"></col>
                    <col
                        name="mark_1"
                        width="100"></col>
                    <col
                        name="mark_2"
                        width="100"></col>
                    <col
                        name="mark_3"
                        width="100"></col>
                </colgroup>
                    <thead>
                        <tr>
                            {
                              header.map((item,index) => (
                                    <td key={index}>{item}</td>
                              ))  
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            sellList.map((item,index) => (
                                <tr key={index}>
                                    <td>seller{  (index+1) }</td>
                                    <td className="col-red">{ item.price }</td>
                                    <td>{ item.amount }</td>
                                    <td>{ item.cje }</td>
                                </tr>
                            ))
                        }
                    </tbody>  
                </table>
           </div>

        )
    }

    header() {
        return [
        //   this.$t('exchange.pairs'),
        //   this.$t('exchange.last_price'),
        //   this.$t('exchange.pairs_change'),
        //   `${this.$t('exchange.24H_VOL')}(${this.pairs.sShortName})`
        'pairs','last_price','pairs_change','sShortName'
        ]
    }

    getData(id, type) {
        console.log(id)
        Client.getRegisterList(id).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    this.setState({
                        buyList:this.getList(res.data.buy, 1),
                        sellList:this.getList(res.data.sell)
                    })
    
                }
              }
        })
    }

    getList(data, type) {
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
          list.map(v => {
            let amount = obj1[v].amount
            let curTurnover = obj1[v].curTurnover
            let cje = amount * v
            listN.push({
              price: (+v).toFixed(6),
              amount: amount.toFixed(2),
              curTurnover: curTurnover,
              cje: cje.toFixed(6)
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

        console.log(listN);
        return listN
      }
}

export default Register