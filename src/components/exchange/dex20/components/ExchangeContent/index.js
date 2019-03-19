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

    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { dataSource } = this.state;

    return (
      <div className="exchange-content">
        {/* k 线 */}
        {/* <Kline/> */}
        <div className="exchange__kline p-3 mb-2">
          <Tokeninfo />
          <div>
            <Select
              defaultValue="lucy"
              style={{ width: 120 }}
              // onChange={handleChange}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>
                Disabled
              </Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </div>
          {/* <Depth /> */}
          <Kline />
        </div>

        {/* transaction */}
        <Transaction />
      </div>
    );
  }
}

export default injectIntl(ExchangeContent);
