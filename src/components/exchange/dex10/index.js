import React, {Fragment} from "react";
import {Link} from "react-router-dom"
import {injectIntl} from "react-intl";
import {Client} from '../../../services/api'
import ExchangeList from "./components/ExchangeList/index";
import ExchangeContent from "./components/ExchangeContent/index";
import ExchangeRecord from "./components/ExchangeRecord/index";
import {tu} from "../../../utils/i18n"
import {TronLoader} from "../../common/loaders";


class Exchange extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <main className="exchange">
          {/* <div style={{position: 'absolute'}}><TronLoader/></div> */}
        <div className="exchange-box mb-2">
            {/* 左侧 交易list */}
          <div className="exchange-box-left">
            <ExchangeList/>
          </div>

            {/* 右侧内容信息，包图表、交易、历史记录 */}
          <div className="exchange-box-right">
            <ExchangeContent/>
          </div>
        </div>
        <ExchangeRecord/>
      </main>
    );
  }
}


export default injectIntl(Exchange);
