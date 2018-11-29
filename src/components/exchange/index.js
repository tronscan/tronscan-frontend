import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import ExchangeList from "./components/ExchangeList/index";
import ExchangeContent from "./components/ExchangeContent/index";
import ExchangeRecord from "./components/ExchangeRecord/index";
import {tu} from "../../utils/i18n"
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
    let {intl} = this.props;
    return (
        <div className="container header-overlap">
          <div className="exchange-title">
            <div className="tron-announcement">
              <img src={require('../../images/announcement-logo.png')} alt=""/>
              <div>{tu('dex_announcement')}</div>
              <a href={intl.locale == 'zh'?"https://coin.top/production/js/2018-11-29-11-51-06.pdf":"https://coin.top/production/js/2018-11-29-11-52-31Regulations_on_Trading_Pairs.pdf"} target="_blank" >{tu('regulations_on_trading_pairs')}</a>
            </div>
            <div className="tron-ad">
              <img src={require('../../images/dice-logo.png')} alt=""/>
              <div>{tu('TRONdice')}</div>
              <a href="https://trondice.org"  target="_blank" >{tu('Join_TRONdice')}</a>
            </div>

          </div>

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
        </div>

    );
  }
}


export default injectIntl(Exchange);
