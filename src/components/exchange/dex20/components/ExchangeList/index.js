import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../../../../services/api";
// import {Client20} from "../../../api";
import { Link } from "react-router-dom";
import { tu } from "../../../../../utils/i18n";
import xhr from "axios/index";
import { map, concat } from "lodash";
import ExchangeTable from "./Table";
import SearchTable from "./SearchTable";
import { Explain } from "./Explain";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { filter, cloneDeep } from "lodash";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import {
  getSelectData,
  getExchanges20,
  getExchanges,
  getExchangesAllList,
  setPriceConvert,
  getExchanges20Volume,
  getExchanges20UpDown
} from "../../../../../actions/exchange";
import { connect } from "react-redux";
import Lockr from "lockr";
import { QuestionMark } from "../../../../common/QuestionMark";
import { Input, Radio, Icon, Tabs } from "antd";
import queryString from "query-string";
import { Tooltip } from "reactstrap";
import { alpha } from "../../../../../utils/str";
import { Client20 } from "../../../../../services/api";
import { TronLoader } from "../../../../common/loaders";

const Search = Input.Search;
const TabPane = Tabs.TabPane;

class ExchangeList extends React.Component {
  constructor() {
    super();
    this.date = "2019-04-18T15:00:00.000Z";
    this.state = {
      dataSource: [],
      time: null,
      tokenAudited: true,
      exchangesList: [],
      optional: Lockr.get("optional") ? Lockr.get("optional") : [],
      optionalBok: true,
      search: "",
      searchExchangesList: [],
      showSearch: false,
      activeIndex: "",
      optionalDisable: false,
      searchAddId: false,
      listGrount: {
        dex: [],
        dex20: [],
        favorites: []
      },
      tagLock: true,
      open: false,
      id: alpha(24),
      day: "",
      hr: "",
      min: "",
      sec: "",
      AdClose: true,
      adURL: "https://trx.market/launchBase?utm_source=TS2",
      adchURL: "https://trx.market/zh/launchBase?utm_source=TS2",
      activedId: 0,
      activedTab: "hot",
      priceObj: {},
      loading: true,
      timeVolume: null,
      timeupDown: null,
      inputValue: ""
    };
    this.tabChange = this.tabChange.bind(this);
  }

  async componentDidMount() {
    const {
      getExchanges20,
      getExchanges20Volume,
      getExchanges20UpDown
    } = this.props;
    //获取各个币的兑换价格
    await this.getCovert("trx");
    await this.getCovert("usdt");

    getExchanges20();
    getExchanges20Volume();
    getExchanges20UpDown();

    this.setState({
      loading: false
    });

    const getDataTime = setInterval(() => {
      getExchanges20();
    }, 10000);
    this.setState({ time: getDataTime });
    const dex = Lockr.get("DEX");
    if (!dex) {
      Lockr.set("DEX", "Main");
    }
    if (dex == "GEM") {
      this.setState({ tokenAudited: false });
    }

    //this.countdown();
  }

  componentWillUnmount() {
    const { time } = this.state;
    clearInterval(time);
  }

  componentDidUpdate(prevProps) {
    let {
      exchange20List,
      exchange20VolumeList,
      exchange20UpDownList
    } = this.props;
    let { tokenAudited, activedTab } = this.state;

    if (activedTab === "hot" && exchange20List !== prevProps.exchange20List) {
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "volume" &&
      exchange20VolumeList !== prevProps.exchange20VolumeList
    ) {
      console.log(123);
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "up_and_down" &&
      exchange20UpDownList !== prevProps.exchange20UpDownList
    ) {
      this.setData(tokenAudited, activedTab);
    }
  }

  //活动倒计时
  countdown() {
    // 目标日期时间戳
    const end = Date.parse(new Date(this.date));
    // 当前时间戳
    const now = Date.parse(new Date());
    // 相差的毫秒数
    const msec = end - now;

    // 计算时分秒数
    let day = parseInt(msec / 1000 / 60 / 60 / 24);
    let hr = parseInt((msec / 1000 / 60 / 60) % 24);
    let min = parseInt((msec / 1000 / 60) % 60);
    let sec = parseInt((msec / 1000) % 60);

    // 个位数前补零
    if (day < 10 && day > 0) {
      day = "0" + day;
    } else if (day <= 0) {
      day = "00";
    }
    if (hr < 10 && hr > 0) {
      hr = "0" + hr;
    } else if (hr <= 0) {
      hr = "00";
    }
    if (min < 10 && min > 0) {
      min = "0" + min;
    } else if (min <= 0) {
      min = "00";
    }
    if (sec < 10 && sec > 0) {
      sec = "0" + sec;
    } else if (sec <= 0) {
      sec = "00";
    }
    this.setState({
      day: day,
      hr: hr,
      min: min,
      sec: sec
    });

    // 一秒后递归
    setTimeout(() => {
      this.countdown();
    }, 1000);
  }

  marketAdClose = e => {
    window.event.returnValue = false;
    this.setState({
      AdClose: true
    });
  };
  keyObj(activeKey) {
    let {
      exchange20List,
      exchange20VolumeList,
      exchange20UpDownList
    } = this.props;

    let list = [];
    switch (activeKey) {
      case "hot":
        list = exchange20List;
        break;
      case "volume":
        list = exchange20VolumeList;
        break;
      case "up_and_down":
        list = exchange20UpDownList;
        break;
      default:
        break;
    }
    return list;
  }
  setData(type, activeKey) {
    let { exchange20List } = this.props;

    let list = this.keyObj(activeKey);

    if (type) {
      this.fiterData(list);
    } else {
      let list = Lockr.get("dex20") || [];
      let new20List = exchange20List.filter(item => list.includes(item.id));
      // let unreviewedTokenList = _(new20List).value();
      let unreviewedTokenList = new20List;
      this.setState({ dataSource: unreviewedTokenList });
    }
  }
  handleSelectData = (type, activeKey) => {
    const { tagLock } = this.state;
    try {
      const { klineLock } = this.props;
      if (klineLock && tagLock) {
        this.setState({ tokenAudited: type, tagLock: false });
        if (!type) {
          Lockr.set("DEX", "GEM");
        } else {
          Lockr.set("DEX", "Main");
        }
        this.setData(type, activeKey);

        setTimeout(() => {
          this.setState({ tagLock: true });
        }, 500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  gotoTrc10 = () => {
    const { tagLock } = this.state;
    const { klineLock } = this.props;
    if (klineLock && tagLock) {
      Lockr.set("DEX", "Main");
      this.props.history.push("trc10");
    }
  };

  // https://debug.tronscan.org/#/exchange/trc20?token=TRONdice/TRX&id=30

  render() {
    const {
      dataSource,
      tokenAudited,
      search,
      showSearch,
      searchExchangesList,
      activeIndex,
      searchAddId,
      id,
      open,
      day,
      hr,
      min,
      sec,
      AdClose,
      adURL,
      adchURL,
      activedId,
      loading,
      inputValue
    } = this.state;

    let { intl } = this.props;
    return (
      <div className="exchange-list mr-2">
        {/* 市场 */}

        <div className="exchange-list-mark p-3 mb-2">
          {/* 标题 */}
          {!AdClose && (
            <a
              href={intl.locale == "zh" ? adchURL : adURL}
              target="_blank"
              className="market-ad"
            >
              <img
                src={
                  intl.locale == "zh"
                    ? require("../../../../../images/market/ieo_zh.png")
                    : require("../../../../../images/market/ieo_en.png")
                }
                alt="ieo"
              />
              <ul>
                <li>{day}</li>
                <li>{hr}</li>
                <li>{min}</li>
                <li>{sec}</li>
              </ul>
              <i
                className="market-ad-close"
                onClick={e => {
                  this.marketAdClose(e);
                }}
              >
                ×
              </i>
            </a>
          )}
          <div className="d-flex  justify-content-between align-items-center w-100 mb-3">
            {/* <h6 className="m-0">
              
              <a href="https://trx.market" target="_blank" className="">
                TRXMarket
              </a>
            </h6> */}

            {/* <div className="d-flex f-12">
              <a
                href={
                  intl.locale == "zh"
                    ? "	https://support.trx.market/hc/zh-cn/requests/new"
                    : "	https://support.trx.market/hc/en-us/requests/new"
                }
                target="_bank"
                className="pr-1 border-right border-light"
              >
                {tu("Submit_a_bug")}
              </a>
              <a
                href={
                  intl.locale == "zh"
                    ? "https://support.trx.market/hc/zh-cn/categories/360001517211-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98"
                    : "https://support.trx.market/hc/en-us/categories/360001517211-FAQ"
                }
                target="_blank"
                className="px-1 border-right  border-light"
              >
                {tu("beginners_guide")}
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeoD6LrVpSdtcb0fJEnkck90IpJ1LTyWKkVd3kQGOKw8rtYhA/viewform"
                target="_blank"
                className="pl-1"
              >
                {tu("token_application_instructions_title")}
              </a>
            </div>*/}
            <Input
              placeholder={intl.formatMessage({ id: "dex_search_dec" })}
              prefix={<Icon type="search" style={{ color: "#333" }} />}
              value={inputValue}
              onChange={e => {
                this.setState({
                  inputValue: e.target.value
                });
              }}
              onPressEnter={() => this.onPressEnter()}
            />
            {/* <div className="collapse-icon">
              <Icon type="arrow-left" />
            </div> */}
          </div>

          {/* filter 筛选 */}
          <div className="dex-tab">
            <Tabs defaultActiveKey="hot" onChange={this.tabChange}>
              <TabPane
                tab={
                  <span>
                    <Icon type="star" />
                    {tu("Favorites")}
                  </span>
                }
                key="fav"
              />
              <TabPane
                tab={intl.formatMessage({ id: "trc20_hot" })}
                key="hot"
              />
              <TabPane
                tab={intl.formatMessage({ id: "trc20_top_Volume" })}
                key="volume"
              />
              <TabPane
                tab={intl.formatMessage({ id: "trc20_top_Rising" })}
                key="up_and_down"
              />
            </Tabs>
          </div>
          <div className="dex-tab">
            <div
              className={"btn btn-sm" + (activedId === 0 ? " active" : "")}
              // onClick={() => this.handleSelectData(true)}
              onClick={() => this.selcetSort(0)}
            >
              {tu("all")}
            </div>
            <div
              className={"btn btn-sm" + (activedId === "TRX" ? " active" : "")}
              // onClick={() => this.gotoTrc10()}
              onClick={() => this.selcetSort("TRX")}
            >
              TRX
            </div>
            <div
              className={"btn btn-sm" + (activedId === "USDT" ? " active" : "")}
              onClick={() => this.selcetSort("USDT")}
            >
              USDT
            </div>
          </div>
          <div className="dex-search" />
          {
            <PerfectScrollbar>
              <div
                className="exchange-list__table"
                style={AdClose ? styles.list : styles.adlist}
              >
                {loading ? (
                  <TronLoader />
                ) : (
                  <ExchangeTable dataSource={dataSource} />
                )}
              </div>
            </PerfectScrollbar>
          }
        </div>

        {/* 说明 */}
        {/* <Explain /> */}
      </div>
    );
  }
  fiterData(list) {
    let { activedId } = this.state;
    let fiterData = list;

    if (activedId !== 0) {
      fiterData = list.filter((item, index) => {
        return item.second_token_id === activedId;
      });
    }
    this.setState({
      dataSource: fiterData
    });
  }
  tabChange(activeKey) {
    const { time, timeVolume, timeupDown } = this.state;
    const {
      getExchanges20,
      getExchanges20Volume,
      getExchanges20UpDown
    } = this.props;
    clearInterval(time);
    clearInterval(timeVolume);
    clearInterval(timeupDown);
    switch (activeKey) {
      case "fav":
        this.handleSelectData(false);
        break;
      case "hot":
        getExchanges20();
        this.setState({
          time: setInterval(() => {
            getExchanges20();
          }, 10000)
        });
        this.handleSelectData(true, activeKey);

        break;
      case "volume":
        getExchanges20Volume();
        this.setState({
          timeVolume: setInterval(() => {
            getExchanges20Volume();
          }, 10000)
        });

        this.handleSelectData(true, activeKey);
        break;
      case "up_and_down":
        getExchanges20UpDown();
        this.setState({
          timeupDown: setInterval(() => {
            getExchanges20UpDown();
          }, 10000)
        });
        this.handleSelectData(true, activeKey);
        break;
      default:
        this.handleSelectData(true, activeKey);
        break;
    }
  }
  selcetSort(type) {
    let { activedTab } = this.props;
    this.setState(
      {
        activedId: type
      },
      () => {
        this.fiterData(this.keyObj(activedTab));
      }
    );
  }
  async getCovert(type) {
    const { setPriceConvert } = this.props;
    let { priceObj } = this.state;
    let data = await Client20.coinMarketCap(type, "eth");
    let data1 = await Client20.coinMarketCap(type, "eur");
    if (type === "trx") {
      let trxToOther = {};

      trxToOther = {
        usd: data[0].price_usd,
        btc: data[0].price_btc,
        eth: data[0].price_eth,
        eur: data1[0].price_eur,
        trx: 1
      };
      priceObj.trxToOther = trxToOther;
    } else if (type === "usdt") {
      let usdtToOther = {};

      let data2 = await Client20.coinMarketCap(type, "trx");
      usdtToOther = {
        trx: data2[0].price_trx,
        btc: data[0].price_btc,
        eth: data[0].price_eth,
        eur: data1[0].price_eur,
        usd: 1
      };
      priceObj.usdtToOther = usdtToOther;
    }
    setPriceConvert(priceObj);
  }

  onInputChange() {}

  onPressEnter() {
    const { inputValue, activedTab } = this.state;

    if (inputValue === "") {
      this.setState({
        dataSource: this.keyObj(activedTab)
      });
    } else {
      // this.setState({
      //   dataSource: []
      // });
    }
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    exchange20List: state.exchange.list_20,
    exchange20VolumeList: state.exchange.volumeList,
    exchange20UpDownList: state.exchange.upDownList,
    exchange10List: state.exchange.list_10,
    exchangeallList: state.exchange.list_all,
    klineLock: state.exchange.klineLock,
    price: state.exchange.price
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchanges20,
  getExchangesAllList,
  getExchanges,
  setPriceConvert,
  getExchanges20Volume,
  getExchanges20UpDown
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeList)));

const styles = {
  list: {
    // height: 350
  },
  adlist: {
    height: 106
  }
};
