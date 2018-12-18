import React ,{Component} from 'react'
import {injectIntl} from "react-intl";

class Register extends Component{
    constructor(){
        super()
        this.state = {
            pairs: {"id":30,"volume":368993269577200,"gain":"0.086012","price":50000,"fPrecision":6,"sPrecision":6,"fTokenName":"TRONdice","sTokenName":"TRX","fShortName":"DICE","sShortName":"TRX","fTokenAddr":"THvZvKPLHKLJhEFYKiyqj6j8G8nGgfg7ur","sTokenAddr":"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb","highestPrice24h":0.057,"lowestPrice24h":0.04,"volume24h":9662143305886,"unit":"TRX"},
            sellList: [],
            buyList: [],
            timer: null
        }
    }

    componentDidMount(){

    }

    render(){
        let header = this.setHeader()
        return (
            <table border="0" cellpadding="0"
            cellspacing="0">
            <colgroup>
              <col
                name="mark_0"
                width="100"></col>
              <col
                name="mark_1"
                width="100"></col>
              <col
                name="mark_2"
                width="120"></col>
              <col
                name="mark_3"
                width="160"></col>
            </colgroup>
            <thead>
              <tr>
                  {
                    header.map((item,index) =>(
                       <td key={index}>{item}</td> 
                    ))
                  }
                <th > 
                </th>
              </tr>
            </thead>
            <tbody>
                {
                    
                }
            </tbody>   
            </table>
        )
    }

    setHeader(){
        let {pairs} = this.state;
        let {intl} = this.props;
        let trc20_price = intl.formatMessage({id: 'trc20_price'})
        let trc20_amount = intl.formatMessage({id: 'trc20_amount'})
        let trc20_accumulative = intl.formatMessage({id: 'trc20_accumulative'})

        return [
            '',
            trc20_price + ' ' + pairs.second_token,
            trc20_amount + ' ' + pairs.first_token,
            trc20_accumulative + ' ' + pairs.second_token
          ]
    }

}

export default injectIntl(Register);