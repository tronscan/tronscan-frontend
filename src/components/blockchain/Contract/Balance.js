import React from "react";
import {Client} from "../../../services/api";
import { injectIntl } from "react-intl";
import TokenBalances from '../../addresses/Address/TokenBalances.js'
import rebuildList from "../../../utils/rebuildList";
import rebuildToken20List from "../../../utils/rebuildToken20List";
import BigNumber from "bignumber.js"
import { FormatNumberByDecimals, FormatNumberByDecimalsBalance, toThousands } from '../../../utils/number'

class Balances extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      address: null
    };
  }

  componentDidMount() {
    this.refreshAddress();
  }

  async refreshAddress() {
    let { id } = this.props
    let address = await Client.getAddress(id);

      let balances = rebuildList(address.balances, 'name', 'balance')
      let x;
      balances.map((item,index) =>{
          if(item.map_token_id === '_'){
              item.map_amount_logo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png'
              item.tokenType = '-';
              item.priceInTrx = 1
          }else{
              item.tokenType = 'TRC10'
          }

          if(item.priceInTrx){
              x= new BigNumber(item.map_amount);
              item.TRXBalance = (x.multipliedBy(item.priceInTrx)).decimalPlaces(6);
              item.TRXBalance_toThousands = toThousands((x.multipliedBy(item.priceInTrx)).decimalPlaces(6));

          }else{
              item.TRXBalance = 0
          }
      })

      let trc20token_balances_new  = rebuildToken20List(address.trc20token_balances, 'contract_address', 'balance');
      let y;
      trc20token_balances_new && trc20token_balances_new.map(item => {
          item.tokenType = 'TRC20'
          item.token20_name = item.name + '(' + item.symbol + ')';
          item.token20_balance = FormatNumberByDecimals(item.balance, item.decimals);
          item.token20_balance_decimals = FormatNumberByDecimalsBalance(item.balance, item.decimals);
          item.map_amount = FormatNumberByDecimalsBalance(item.balance, item.decimals);
          if(item.priceInTrx){
              y = new BigNumber(item.token20_balance_decimals);
              item.TRXBalance = (y.multipliedBy(item.priceInTrx)).decimalPlaces(6);
              item.TRXBalance_toThousands = toThousands((y.multipliedBy(item.priceInTrx)).decimalPlaces(6));
          }else{
              item.TRXBalance = 0
          }

          return item
      });



      let tokenBalances = balances.concat(trc20token_balances_new)

    this.setState({
      address: tokenBalances
    })
  }

  render() {
    let {address} = this.state;
    let {intl} = this.props
    return address && <TokenBalances tokenBalances={address} intl={intl}/>
  }
}

export default injectIntl(Balances)