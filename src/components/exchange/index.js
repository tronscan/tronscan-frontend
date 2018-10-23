import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../utils/i18n";
import xhr from "axios/index";
import ExchangeList from "./components/ExchangeList/index";
import ExchangeContent from "./components/ExchangeContent/index";

class Exchange extends React.Component {

  constructor() {
    super();

    this.state = {
      priceGraph: [],
      volumeGraph: [],
      markets: [],
      priceStats: null,
      volume: null
    };
  }

  componentDidMount() {
    
  }

  

  render() {
    return (
      <main className="container header-overlap exchange">
        <div className="d-flex">
          {/* 左侧 交易list */}
          <div style={{width: '380px'}}>
            <ExchangeList/>
          </div>

          {/* 右侧内容信息，包图表、交易、历史记录 */}
          <div style={{flex: '1'}}>
            <ExchangeContent/>
          </div>
        </div>
      </main>
    );
  }
}


export default injectIntl(Exchange);
