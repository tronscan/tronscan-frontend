/*eslint-disable */
import React, { Component, Fragment } from "react";
import { Table, Icon } from "antd";
import { QuestionMark } from "../../../../common/QuestionMark";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import {
  getSelectData,
  getExchangesByIds,
  getExchangesByIdsContent,
  organizeData,
  setPriceConvert
} from "../../../../../actions/exchange";
import { filter, map, upperFirst, remove } from "lodash";
import { injectIntl, FormattedNumber } from "react-intl";
import Lockr from "lockr";
import _ from "lodash";
import { Client20 } from "../../../../../services/api";
import { Popover } from "antd";
import { tu } from "../../../../../utils/i18n";

class ExchangeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [],
      dataSource: props.dataSource,
      unRecomendList: props.unRecomendList,
      activeIndex: props.activeIndex,
      optional: [],
      optionalBok: false,
      offlineToken: [30],
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
      },
      AdClose: props.isAdClose,
      risk_href: {
        zh: "https://support.poloniex.org/hc/zh-cn/articles/360035045092",
        en: "https://support.poloniex.org/hc/en-us/articles/360035045092"
      },
      unRecomendId: props.unRecomendId
    };
  }

  getContent() {
    const { intl, activeLanguage } = this.props;
    const { dataSource, risk_href, unRecomendList } = this.state;

    const risk_token_desc = (
      <div style={{ width: "180px" }}>
        <p>{intl.formatMessage({ id: "trc20_risk_token_desc" })}</p>
        <p style={{ textAlign: "right", color: "#C53028" }}>
          <a
            href={activeLanguage == "zh" ? risk_href["zh"] : risk_href["en"]}
            target="_blank"
          >
            {tu("learn_more")}
          </a>
        </p>
      </div>
    );

    return (
      <div className="market-table">
        <section className="table-header">
          <span className="table-1">
            {upperFirst(intl.formatMessage({ id: "trc20_price" }))}
          </span>
          <span className="table-2">
            {upperFirst(intl.formatMessage({ id: "trc20_24H_Total" }))}
          </span>
          <span className="table-3">
            {upperFirst(intl.formatMessage({ id: "trc20_token_info_ths_3" }))}
          </span>
        </section>
        <section className="table-content">
          {dataSource.length == 0 && unRecomendList.length == 0 ? (
            this.noData()
          ) : (
            <div>
              <div className="recommendList">
                {dataSource.map((item, index) => {
                  return this.listItem(item, index);
                })}
              </div>

              {unRecomendList.length > 0 && (
                <div className="risk-token-title">
                  {intl.formatMessage({ id: "trc20_risk_token" })}
                  <Popover content={risk_token_desc} title="">
                    <Icon
                      type="question-circle"
                      style={{ verticalAlign: "text-top", marginLeft: "5px" }}
                    />
                  </Popover>
                </div>
              )}
              <div className="unRecommendList">
                {unRecomendList.map((item, index) => {
                  return this.listItem(item, index, "risk");
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    );
  }
  listItem(item, index, type) {
    const {
      dataSource,
      transcationObj,
      offlineToken,
      unRecomendList
    } = this.state;
    const { activeLanguage, price, intl } = this.props;
    if (dataSource.length == 0 && unRecomendList.length == 0) {
      return;
    }

    let favList = Lockr.get("dex20") || [];
    let fireContent = (
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
    let imgDefault = require("../../../../../images/logo_default.png");

    let tokenDetailContent = (
      <div className="token-detail">
        <section className="token-img">
          <img
            className="token-logo"
            src={item.logo ? item.logo : imgDefault}
          />
          {item.fShortName}
          {item.source == 1 && (
            <img
              className="token-safety"
              src={require("../../../../../images/market/SafetyLogo.svg")}
            />
          )}
        </section>
        <section>
          <p className="token-title">
            {intl.formatMessage({ id: "trc20_token_name" })}
          </p>
          <p className="token-name">{item.fTokenName}</p>
        </section>
        {item.id != 48 && <section>
          <p className="token-title">
            {item.pairType == 1 || item.pairType == 4
              ? intl.formatMessage({ id: "trc20_token_id" })
              : intl.formatMessage({ id: "contract_address" })}
          </p>
          <p>{item.fTokenAddr}</p>
        </section>}
        <section className="token-href">
          <a
            href={
              item.pairType == 2 || item.pairType == 3
                ? `https://tronscan.org/#/token20/${item.fTokenAddr}`
                : `https://tronscan.org/#/token/${item.fTokenAddr}`
            }
            target="_blank"
          >
            {intl.formatMessage({ id: "learn_more" })}>>
          </a>
        </section>
      </div>
    );
    // risk=0代表正常 =1是重名 =2 是高风险 source 1来源于推荐 2来源于非推荐 */}
    const riskTest = {
      0: "",
      1: "trc20_symbol_risk",
      2: "trc20_hight_risk_token"
    };
    return (
      <div
        className={"content-item " + this.setActiveClass(item, index)}
        onClick={() => {
          this.docodUrl(item);
        }}
        key={index}
      >
        <div className="line-1">
          <section className="table-1">
            <div className="position-relative" style={{ display: "flex" }}>
              <span className="optional-star">
                <span
                  onClick={ev => {
                    this.setFavorites(ev, item, index);
                  }}
                >
                  {favList.includes(item.id) ? (
                    // <i className="star_red" />
                    <Icon
                      type="star"
                      style={{ color: "#C53028" }}
                      theme="filled"
                    />
                  ) : (
                    <Icon type="star" />
                  )}
                </span>
              </span>
              <div className="tokens">
                {<Popover
                  content={tokenDetailContent}
                  title=""
                  placement="rightTop"
                  overlayClassName="token-detail-popover"
                >
                  {offlineToken.includes(item.id) ? (
                    <p
                      className="exchange-abbr-name"
                      style={{ textDecoration: `line-through` }}
                    >
                      {/* {record.exchange_abbr_name} */}
                      <span style={{ color: "#333333" }}>
                        {item.fShortName}
                      </span>
                      /
                      <span style={{ color: "#999999" }}>
                        {item.sShortName}
                      </span>
                    </p>
                  ) : (
                    <p className="exchange-abbr-name">
                      {/* {record.exchange_abbr_name} */}
                      <span style={{ color: "#333333" }}>
                        {item.fShortName}
                      </span>
                      /
                      <span style={{ color: "#999999" }}>
                        {item.sShortName}
                      </span>
                    </p>
                  )}
                </Popover>}

                <p
                  className={
                    item.up_down_percent.indexOf("-") != -1
                      ? "col-red"
                      : "col-green"
                  }
                >
                  {item.price.toFixed(item.sPrecision)}
                </p>
              </div>

              {transcationObj.id.includes(item.id) && (
                <div>
                  <Popover content={fireContent} title="">
                    <img
                      src={require("../../../../../images/fire.svg")}
                      style={{
                        width: "15px",
                        marginLeft: "5px"
                      }}
                      alt="fire"
                    />
                  </Popover>
                </div>
              )}
            </div>
          </section>
          <section className="table-2">
            <div className="textRight ">
              <FormattedNumber
                value={
                  Number(
                    item.volume24h / Math.pow(10, item.sPrecision)
                  ).toFixed(0)
                    ? Number(
                        item.volume24h / Math.pow(10, item.sPrecision)
                      ).toFixed(0)
                    : 0
                }
              />{" "}
              {item.second_token_abbr}
              <br />
              {/* <span className="font-grey">
                {activeCurrency.toUpperCase() === "TRX" ? (
                  <FormattedNumber
                    value={Number(record.trxVolume24h / Math.pow(10, record.sPrecision)).toFixed(0)}
                  />
                ) : (
                  <FormattedNumber
                    value={(
                      Number(
                        price && price.trxToOther && price.usdtToOther
                          ? record.second_token_id === "TRX"
                            ? price.trxToOther[activeCurrency]
                            : price.usdtToOther[activeCurrency]
                          : ""
                      ) * record.svolume
                    ).toFixed(0)}
                  />
                )}{" "}
                {activeCurrency.toUpperCase()}
              </span> */}
              <span className="font-grey">
                {item.second_token_id === "USDT" ? (
                  <FormattedNumber
                    value={Number(
                      item.volume24h / Math.pow(10, item.sPrecision)
                    ).toFixed(0)}
                  />
                ) : (
                  <FormattedNumber
                    value={(
                      Number(
                        price && price.trxToOther && price.usdtToOther
                          ? item.second_token_id === "TRX"
                            ? price.trxToOther["usd"]
                            : price.usdtToOther["usd"]
                          : ""
                      ) * item.svolume
                    ).toFixed(0)}
                  />
                )}{" "}
                USD
              </span>
            </div>
          </section>
          <section className="table-3">
            {item.up_down_percent.indexOf("-") != -1 ? (
              <div className="tab-pr-50">
                <span className="col-red bg-color">{item.up_down_percent}</span>
              </div>
            ) : (
              <div className="tab-pr-50">
                <span className="col-green bg-color">
                  {item.up_down_percent}
                </span>
              </div>
            )}
          </section>
        </div>
        {type == "risk" && (
          <div className="line-2">
            {/* risk=0代表正常 =1是重名 =2 是高风险 source 1来源于推荐 2来源于非推荐 */}
            {item.risk != 0 && (
              <span className="high-risk-token">
                <Icon
                  type="warning"
                  style={{ verticalAlign: "text-top", marginRight: "5px" }}
                />
                {intl.formatMessage({ id: riskTest[item.risk] })}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
  noData() {
    return (
      <div className="ant-table-placeholder">
        <div className="ant-empty ant-empty-normal">
          <p className="ant-empty-description">No Data</p>
        </div>
      </div>
    );
  }
  setFavorites(ev, record) {
    let { dataSource, unRecomendList } = this.state;
    let { getExchangesByIds } = this.props;
    if (record.token_type == "dex20") {
      let list = Lockr.get("dex20") || [];
      if (list.indexOf(record.id) != -1) {
        var a = remove(list, o => o == record.id);
      } else {
        list.push(record.id);
      }

      Lockr.set("dex20", list);
    } else {
      // let {dataSource} = this.state
      let list = Lockr.get("optional") || [];
      if (list.indexOf(record.exchange_id) != -1) {
        var a = remove(list, o => o == record.exchange_id);
      } else {
        list.push(record.exchange_id);
      }

      Lockr.set("optional", list);
    }
    let newdataSource = dataSource.map(item => {
      if (record.exchange_id == item.exchange_id) {
        item.isChecked = !item.isChecked;
      }
      return item;
    });
    let newUnRecomendList = unRecomendList.map(item => {
      if (record.exchange_id == item.exchange_id) {
        item.isChecked = !item.isChecked;
      }
      return item;
    });
    if (Lockr.get("DEX") != "GEM") {
      this.setState({
        dataSource: newdataSource,
        unRecomendList: newUnRecomendList || []
      });
    }

    // if (Lockr.get("DEX") == "GEM") {
    //   let new20List = dataSource.filter(item => item.isChecked);
    //   let newUnrecoment = unRecomendList.filter(item => item.isChecked);
    //   this.setState({
    //     dataSource: new20List,
    //     unRecomendList: newUnrecoment || []
    //   });
    // } else {
    //   this.setState({ dataSource: newdataSource });
    // }

    let ids = Lockr.get("dex20") || [];
    getExchangesByIds(ids.join(","));
    ev.stopPropagation();
  }

  setActiveClass = (record, index) => {
    // return record.exchange_id === this.state.activeIndex ? "exchange-table-row-active": "";
    return record.token_type == "dex20" &&
      record.exchange_id === this.state.activeIndex
      ? "exchange-table-row-active"
      : "";
  };

  async getData() {
    const parsed = queryString.parse(this.props.location.search).id;

    let {
      getSelectData,
      dataSource,
      unRecomendList,
      getExchangesByIds,
      getExchangesByIdsContent
    } = this.props;
    // First go to the recommended list query
    let currentData = filter(dataSource, item => {
      return item.exchange_id == parsed;
    });

    // Go to the non-recommended list
    if (currentData.length == 0) {
      currentData = filter(unRecomendList, item => {
        return item.exchange_id == parsed;
      });
    }

    if (
      (dataSource && dataSource.length) ||
      (unRecomendList && unRecomendList.length)
    ) {
      // update data
      if (currentData && currentData.length) {
        this.onSetUrl(currentData[0], true);
      } else {
        this.onSetUrl(
          dataSource[0]
            ? dataSource[0]
            : unRecomendList[0]
            ? unRecomendList[0]
            : {}
        );
      }
    }

    // get select status;
    // map(dataSource, item => {
    //   if (item.exchange_id == parsed || !parsed) {
    //     item.isCurrent = true;
    //   }
    // });

    this.setState({ dataSource, unRecomendList });
  }

  onSetUrl(record, type) {
    const { getSelectData } = this.props;
    const { trxToOther, usdtToOther } = this.state;

    // if (record.token_type != "dex20") {
    //   this.props.history.push(
    //     "/exchange/trc10?token=" +
    //       record.exchange_name +
    //       "&id=" +
    //       record.exchange_id
    //   );
    //   return;
    // }
    this.setState({
      activeIndex: record.exchange_id
    });

    getSelectData(record, true);

    if (!type) {
      this.props.history.push(
        "/exchange/trc20?token=" +
          record.exchange_name +
          "&id=" +
          record.exchange_id
      );
    }
  }

  docodUrl(record) {
    const { klineLock } = this.props;
    if (klineLock) {
      this.onSetUrl(record);
    }
    // clearTimeout(this.time)
    // this.time = setTimeout(() => {
    //   this.onSetUrl(record)
    // }, 500);
  }

  async componentDidMount() {
    // this.setData();
  }

  async componentDidUpdate(prevProps) {
    let {
      dataSource,
      redirctPair,
      unRecomendList,
      unRecomendId,
      getExchangesByIdsContent
    } = this.props;

    if (
      dataSource != prevProps.dataSource ||
      unRecomendList != prevProps.unRecomendList
    ) {
      this.getData();
    }

    if (unRecomendId != prevProps.unRecomendId) {
      this.onSetUrl(unRecomendList[0]);
    }

    // if (redirctPair != prevProps.redirctPair) {
    //   let currentPair = redirctPair;
    //   if (currentPair) {
    //     const parsed = redirctPair.pairId || redirctPair.exchangeId;
    //     if (parsed) {
    //       let idsItems = await getExchangesByIdsContent(parsed);
    //       if (idsItems[0].source == 2) {
    //         this.props.handleValue(idsItems);
    //       }
    //     }
    //     this.getData();
    //   }
    // }
  }
  componentWillReceiveProps(nextProps) {
    // const {getSelectData,setSearchAddId} = this.props;
    // this.setState({
    //     dataSource: nextProps.dataSource,
    // });
    // if(this.props.searchAddId){
    //     let record =  _.filter(nextProps.dataSource, (o) => { return o.exchange_id == nextProps.activeIndex; });
    //     this.props.history.push('/exchange/trc10?token='+ record[0].exchange_name+'&id='+record[0].exchange_id)
    //     // getSelectData(record[0],true)
    //     this.setState({
    //         activeIndex:nextProps.activeIndex,
    //     },()=>{
    //         this.props.setSearchAddId()
    //     });
    // }
    // if(this.props.tab !== nextProps.tab){
    //     this.setState({
    //         activeIndex:nextProps.activeIndex,
    //     });
    // }
  }

  render() {
    return (
      <div>
        {/* {this.getColumns()}
        {this.getColumnsHidden()} */}
        {this.getContent()}
        {/* {this.listItem()} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    klineLock: state.exchange.klineLock,
    activeCurrency: state.app.activeCurrency,
    price: state.exchange.price,
    activeLanguage: state.app.activeLanguage,
    redirctPair: state.exchange.redirctPair,
    exchanges20SearchListByIds: state.exchange.searchListByIds
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchangesByIds,
  getExchangesByIdsContent,
  organizeData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeTable)));
