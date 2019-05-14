import React, {Component} from "react";
import {tu} from "../../../../../utils/i18n";
import Register from './Register'
import TranList from '../ExchangeRecord/TranList';
import createStore from "antd/lib/table/createStore";

class Explain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actived: 1
    }
    this.tabChange = this.tabChange.bind(this)
  }
  tabChange(id){
    this.setState({
      actived:id
    })
  }
  render(){
    const {actived} = this.state
    return (
      <div className="exchange-list-explain">
          <ul className="exchange-list-tab">
            <li >
              <a className={actived == 1 ? "cur" : ""} href="javascript:;" onClick={()=>this.tabChange(1)}>{tu('trc20_register')}</a>
            </li>
            <li>
              <a className={actived == 2 ? "cur" : ""} href="javascript:;" onClick={()=>this.tabChange(2)}>{tu('trc20_history')}</a>
            </li>
          </ul>
          <div >
            <div className={actived == 1 ? "cur" : ""}><Register></Register></div>
            <div className={actived == 2 ? "cur" : ""}><TranList></TranList></div>
          </div>
     </div>
    )
  }
  
}
export default Explain;
