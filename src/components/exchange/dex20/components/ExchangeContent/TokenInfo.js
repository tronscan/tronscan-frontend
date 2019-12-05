import React from "react";
import {
  injectIntl,
  FormattedNumber,
  FormattedDate,
  FormattedTime
} from "react-intl";
import { withRouter } from "react-router";
import { widget } from "../../../../../lib/charting_library.min";
import Datafeed from "./udf/index.js";
import { connect } from "react-redux";
import { tu, tv } from "../../../../../utils/i18n";
import { TRXPrice } from "../../../../common/Price";
import { Client20 } from "../../../../../services/api";
import { change10lock, setWidget } from "../../../../../actions/exchange";
import { TokenTRC20Link } from "../../../../common/Links";
import { Icon, Modal } from "antd";
import { toThousands } from "../../../../../utils/number";
import { Popover } from "antd";

class Tokeninfo extends React.Component {
  constructor() {
    super();

    this.state = {
      tokeninfo: [],
      tokeninfoItem: {},
      detailShow: false,
      tvStatus: true,
      // 交易赛对象
      transcationObj: {
        id: [],
        linkUrl: {
          en:
            "https://support.poloniex.org/hc/en-us/articles/360030644412-TRC20-USDT-Reloaded-with-Powerful-Aid-from-TRXMarket-15-000-USD-Awaits-",
          zh:
            "https://support.poloniex.org/hc/zh-cn/articles/360030644412-TRXMarket%E5%8A%A9%E5%8A%9BTRC20-USDT%E9%87%8D%E8%A3%85%E4%B8%8A%E9%98%B5-%E6%83%8A%E5%96%9C%E6%94%BE%E9%80%8110%E4%B8%87%E4%BA%BA%E6%B0%91%E5%B8%81"
        },
        text: {
          en:
            "TRC20-USDT Returns with Generous Rewards from Poloni DEX - 15,000 USDT Awaits!",
          zh: "Poloni DEX助力TRC20-USDT重装上阵，惊喜放送10万人民币"
        }
      }
    };
  }

  componentDidMount() {
    const { tokeninfo } = this.state;
    const { selectData } = this.props;
    // const newObj = tokeninfo.filter(o => o.symbol == selectData.fShortName)[0];
    selectData && this.getTokenInfo();
    this.setState({ detailShow: false });
  }

  componentDidUpdate(prevProps) {
    const { tokeninfo } = this.state;
    const { selectData, activeLanguage } = this.props;

    if (
      selectData.exchange_id &&
      prevProps.selectData.id != selectData.exchange_id
    ) {
      this.getTokenInfo();
    }
    if (
      selectData.exchange_id != prevProps.selectData.exchange_id ||
      prevProps.activeLanguage != activeLanguage
    ) {
      // const newObj = tokeninfo.filter(
      //   o => o.symbol == selectData.fShortName
      // )[0];
      this.setState({ detailShow: false });
    }
  }

  getTokenInfo() {
    const { selectData } = this.props;
    // Client20.gettokenInfo20().then(({ trc20_tokens }) => {
    //   if (trc20_tokens) {
    //     const newObj = trc20_tokens.filter(
    //       o => o.name == selectData.first_token_id
    //     )[0];
    //     this.setState({ tokeninfoItem: newObj });
    //     this.setState({ tokeninfo: trc20_tokens });
    //   }
    // });
    // const { selectData } = this.props;
    // let newObj = {};

    if (selectData.fShortName == "TRX") {
      const newObj = {
        icon_url: "http://coin.top/production/js/20190506075825.png"
      };
      newObj["description"] =
        "TRON is dedicated to building the infrastructure for a truly decentralized Internet. The TRON Protocol, one of the largest blockchain-based operating systems in the world which offers scalability, high-availability, and high-throughput computing (HTC) support that serves as the foundation for all decentralized applications in the TRON ecosystem. It also provides better compatibility for Ethereum smart contracts through an innovative, pluggable smart contract platform. Since July 24th, 2018, TRON acquired BitTorrent Inc. which is an Internet technology company based in San Francisco. It designs distributed technologies that scale efficiently, keep intelligence at the edge, and keep creators and consumers in control of their content and data. Every month more than 170 million people use BitTorrent Inc. developed products. Its protocols move as much as 40% of the world's Internet traffic on a daily basis.";
      newObj["totalSupply"] = "100000000000000000";
      newObj["issued"] = "66766249779296000";
      newObj["nrOfTokenHolders"] = "";
      newObj["startTime"] = 1498838400000;
      newObj["url"] = "http://tron.network";
      newObj["white_paper"] =
        "https://tron.network/static/doc/white_paper_v_2_0.pdf";
      newObj["precision"] = 6;
      this.setState({ tokeninfoItem: newObj });
      return;
    }

    const fTokenAddr = selectData.fTokenAddr;
   
    if (!fTokenAddr) {
      return;
    }
    Client20.getTokenInfoItem(fTokenAddr, selectData.pairType).then(res => {
      const { trc20_tokens } = res;
      if (trc20_tokens && trc20_tokens[0]) {
        const newObj = trc20_tokens[0];
        newObj["description"] = trc20_tokens[0].token_desc;
        newObj["totalSupply"] = trc20_tokens[0].total_supply_with_decimals;
        newObj["issued"] = trc20_tokens[0].total_supply_with_decimals;
        newObj["nrOfTokenHolders"] = "";
        newObj["startTime"] = trc20_tokens[0].issue_time;
        newObj["url"] = trc20_tokens[0].home_page;
        newObj["white_paper"] = trc20_tokens[0].white_paper;
        newObj["precision"] = trc20_tokens[0].decimals;
        this.setState({ tokeninfoItem: newObj });
        return;
      }
      
      const { data } = res;
      if (data && data[0]) {
        const newObj = data[0];
        newObj["icon_url"] = data[0].imgUrl;
        this.setState({ tokeninfoItem: newObj });
        return ;
      }

      this.setState({ tokeninfoItem: {} });
      
    });
  }

  render() {
    const { tokeninfoItem, detailShow, tvStatus, transcationObj } = this.state;
    const {
      selectData,
      widget,
      price,
      activeCurrency,
      activeLanguage
    } = this.props;
    let imgDefault = require("../../../../../images/logo_default.png");
    let price_convert = 0;
    if (
      price &&
      price[selectData.sShortName == "TRX" ? "trxToOther" : "usdtToOther"]
    ) {
      // price_convert = (
      //   price[selectData.sShortName == "TRX" ? "trxToOther" : "usdtToOther"][
      //     activeCurrency && activeCurrency.toLocaleLowerCase()
      //   ] * selectData.price
      // ).toFixed(activeCurrency == "trx" ? 6 : 8);
      price_convert = (
        price[selectData.sShortName == "TRX" ? "trxToOther" : "usdtToOther"][
          "usd"
        ] * selectData.price
      ).toFixed(8);
    }
    let content = (
      <div>
        {activeLanguage === "zh" ? (
          <div style={{ width: "180px" }}>
            <p>{transcationObj.text["zh"]}</p>
            <p style={{ textAlign: "right", color: "#C53028" }}>
              <a href={transcationObj.linkUrl["zh"]} target="_blank">
                {tu("learn_more")}
              </a>
            </p>
          </div>
        ) : (
          <div style={{ width: "180px" }}>
            <p>{transcationObj.text["en"]}</p>
            <p style={{ textAlign: "right", color: "#C53028" }}>
              <a href={transcationObj.linkUrl["en"]} target="_blank">
                {tu("learn_more")}
              </a>
            </p>
          </div>
        )}
      </div>
    );
    return (
      <div>
        {/* title 信息 */}
        <div className="d-flex exchange__kline__title position-relative">
          
          {tokeninfoItem && tokeninfoItem.icon_url ? (
            <img src={tokeninfoItem.icon_url} />
          ) : (
            <img src={imgDefault} />
          )}
          <div className="info-wrap">
            <div className="item">
              <p>
                {transcationObj.id.includes(selectData.id) && (
                  <Popover content={content} title="">
                    <img
                      src={require("../../../../../images/fire.svg")}
                      style={{
                        width: "15px",
                        marginRight: "3px",
                        marginTop: "-5px",
                        height: "15px"
                      }}
                      alt="fire"
                    />
                  </Popover>
                )}
                <span>{selectData.fShortName}</span> / {selectData.sShortName}
              </p>
              <p>
                <a
                  href="javascript:;"
                  onClick={() => this.setState({ detailShow: !detailShow })}
                >
                  <img src={require("../../../../../images/market/info.svg")} />
                  {selectData.fTokenName}
                </a>
              </p>
            </div>
            <div className="item">
              <p className={selectData.isUp ? "col-green" : "col-red"}>
                {selectData.price &&
                  selectData.price.toFixed(selectData.sPrecision)}
              </p>
              {price_convert && (
                <p>
                  ≈
                  <span>
                    &nbsp;{price_convert} USD
                    {/* {activeCurrency.toLocaleUpperCase()} */}
                  </span>
                </p>
              )}
            </div>
            <div className="item">
              <p>{tu("pairs_change")}</p>
              <p className={selectData.isUp ? "col-green" : "col-red"}>
                {selectData.up_down_percent}
              </p>
            </div>
            <div className="item">
              <p>{tu("trc20_24h_h")}</p>
              <p>{selectData.high}</p>
            </div>
            <div className="item">
              <p>{tu("trc20_24h_l")}</p>
              <p>{selectData.low}</p>
            </div>
            <div className="item">
              <p>{tu("trc20_24H_Total")}</p>
              <p>
                {toThousands(selectData.volume)} {selectData.fShortName}
              </p>
            </div>
            {/* <div className="item">
              <p>{tu("24H_VOL")}</p>
              <p>{selectData.volume} {selectData.sShortName}</p>
            </div> */}
          </div>
        </div>

        {/* <div className="exchange__kline__pic" id='tv_chart_container'></div> */}
        <Modal
          visible={detailShow}
          onCancel={() => this.setState({ detailShow: !detailShow })}
          width={530}
          footer={null}
        >
          <div className="token-info-wrap">
            <h2>
              {tokeninfoItem && tokeninfoItem.icon_url ? (
                <img src={tokeninfoItem.icon_url} />
              ) : (
                <img src={imgDefault} />
              )}
              {selectData.fShortName}
            </h2>
            <p>{tokeninfoItem.description}</p>
            <hr />
            <div className="info-list">
              <div>
                <span>{tu("trc20_token_info_Total_Supply")}</span>
                <span>
                  {tokeninfoItem.totalSupply ? (
                    <FormattedNumber
                      value={
                        Number(tokeninfoItem.totalSupply) /
                        Math.pow(10, tokeninfoItem.precision || 0)
                      }
                    />
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div>
                <span>{tu("trc20_token_info_Circulating_Supply")}</span>
                <span>
                  {tokeninfoItem.issued ? (
                    <FormattedNumber
                      value={
                        Number(tokeninfoItem.issued) /
                        Math.pow(10, tokeninfoItem.precision || 0)
                      }
                    />
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div>
                <span>{tu("token_holders")}</span>
                <span>
                  {tokeninfoItem.nrOfTokenHolders ? (
                    <FormattedNumber
                      value={Number(tokeninfoItem.nrOfTokenHolders)}
                    />
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div>
                <span>{tu("created")}</span>
                <span>
                  {tokeninfoItem.startTime ? (
                    <span>
                      <FormattedDate value={tokeninfoItem.startTime} />{" "}
                      <FormattedTime
                        value={tokeninfoItem.startTime}
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                        hour12={false}
                      />
                    </span>
                  ) : (
                    "--"
                  )}
                </span>
              </div>
              <div>
                <span>{tu("trc20_token_info_Website")}</span>
                <span>
                  {tokeninfoItem.url == "no_message" ||
                  tokeninfoItem.url == "" ? (
                    "--"
                  ) : (
                    <a href={tokeninfoItem.url} target="_blank">
                      {tokeninfoItem.url}
                    </a>
                  )}
                  {/* <a href={tokeninfoItem.url} target="_blank">{tokeninfoItem.url}</a> */}
                </span>
              </div>
              <div>
                <span>{tu("white_paper")}</span>
                <span>
                  {tokeninfoItem.white_paper == "no_message" ||
                  tokeninfoItem.white_paper == "" ? (
                    "--"
                  ) : (
                    <a href={tokeninfoItem.white_paper} target="_blank">
                      {tokeninfoItem.white_paper}
                    </a>
                  )}
                </span>
              </div>
            </div>
            {selectData.fShortName != "TRX" && (
              <div className="info-more">
                <a
                  href={
                    selectData.pairType == 2 || selectData.pairType == 3
                      ? `https://tronscan.org/#/token20/${
                          tokeninfoItem.contract_address
                        }`
                      : `https://tronscan.org/#/token/${tokeninfoItem.id}`
                  }
                  target="_blank"
                >
                  {tu("learn_more")}>
                </a>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    selectStatus: state.exchange.status,
    activeLanguage: state.app.activeLanguage,
    price: state.exchange.price,
    activeCurrency: state.app.activeCurrency
  };
}

const mapDispatchToProps = {
  change10lock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Tokeninfo)));
