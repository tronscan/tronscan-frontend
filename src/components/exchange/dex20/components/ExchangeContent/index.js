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
import Notice from "./Notice";
import Explain  from "./Explain";

import { Input, Select } from "antd";
const Search = Input.Search;
const Option = Select.Option;

class ExchangeContent extends React.Component {
  constructor() {
    super();

    this.state = {
      select: "kchart"
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {}

  render() {
    const { select } = this.state;

    return (
      <div className="exchange-content">
        <Notice />
        <div className="exchange-right">
          <div className="exchange__kline mb-2 mr-2">
            <div className="exchange__kline__wrap">
              <Tokeninfo />
              
              <div className="p-3 mb-2">
                <div className="chart-select">
                  <Select
                    defaultValue="kchart"
                    style={{ width: 100 }}
                    onChange={this.handleChange}
                  >
                    <Option value="kchart">{tu("trc20_kchart")}</Option>
                    <Option value="depth">{tu("trc20_depth")}</Option>
                  </Select>
                </div>
                {select === "kchart" ? <Kline /> : <Depth />}
              </div>
            </div>

            {/* transaction */}
            <Transaction />
          </div>
          <div className="exchange-register mb-2">
            <Explain />
          </div>
        </div>
      </div>
    );
  }

  handleChange(value) {
    this.setState({
      select: value
    });
  }
}

export default injectIntl(ExchangeContent);
