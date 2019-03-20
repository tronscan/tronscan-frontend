import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../../../../services/api";
import { Link } from "react-router-dom";
import { tu } from "../../../../../utils/i18n";
import xhr from "axios/index";

import Kline from "./Kline";
import Depth from "./Depth";
import Transaction from "./Transaction";
import Tokeninfo from "./TokenInfo";

import { Input, Select } from "antd";
const Search = Input.Search;
const Option = Select.Option;

class ExchangeContent extends React.Component {
  constructor() {
    super();

    this.state = {
      select:'kchart'
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {}

  render() {
    const { select } = this.state;

    return (
      <div className="exchange-content">
        {/* k 线 */}
        {/* <Kline/> */}
        <div className="exchange__kline p-3 mb-2">
          <Tokeninfo />
          <div className="mb-2">
            <Select
              defaultValue="kchart"
              style={{ width: 120 }}
              onChange={this.handleChange}
            >
              <Option value="kchart">{tu('trc20_kchart')}</Option>
              <Option value="depth">{tu('trc20_depth')}</Option>
            </Select>
          </div>
          {
            select === 'kchart' ? <Kline /> :  <Depth />
          }
        
        </div>

        {/* transaction */}
        <Transaction />
      </div>
    );
  }

  handleChange(value){
    this.setState({
      select:value
    })
  }
}

export default injectIntl(ExchangeContent);
