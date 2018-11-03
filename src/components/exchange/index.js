import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import ExchangeList from "./components/ExchangeList/index";
import ExchangeContent from "./components/ExchangeContent/index";
import ExchangeRecord from "./components/ExchangeRecord/index";

import {TronLoader} from "../common/loaders";


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
        {/* <div style={{position: 'absolute'}}><TronLoader/></div> */}
        <div className="d-flex mb-2">
          {/* 左侧 交易list */}
          <div style={{width: '380px'}}>
            <ExchangeList/>
          </div>

          {/* 右侧内容信息，包图表、交易、历史记录 */}
          <div style={{flex: '1'}}>
            <ExchangeContent/>
          </div>
        </div>
        <ExchangeRecord/>
      </main>
    );
  }
}


export default injectIntl(Exchange);
