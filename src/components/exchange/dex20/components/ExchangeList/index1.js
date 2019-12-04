/* eslint-disable default-case */
import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../../../../services/api";
// import {Client20} from "../../../api";
import { Link } from "react-router-dom";
import { tu } from "../../../../../utils/i18n";
import xhr from "axios/index";
import { map, concat } from "lodash";
import ExchangeTable from "./Table";
// import SearchTable from "./SearchTable";
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
  getExchanges20UpDown,
  getExchanges20Search
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
      adURL:
        "https://support.poloniex.org/hc/en-us/articles/360030644412-TRC20-USDT-Reloaded-with-Powerful-Aid-from-TRXMarket-15-000-USD-Awaits-",
      adchURL:
        "https://support.poloniex.org/hc/zh-cn/articles/360030644412-TRXMarket%E5%8A%A9%E5%8A%9BTRC20-USDT%E9%87%8D%E8%A3%85%E4%B8%8A%E9%98%B5-%E6%83%8A%E5%96%9C%E6%94%BE%E9%80%8110%E4%B8%87%E4%BA%BA%E6%B0%91%E5%B8%81",
      activedId: 0,
      activedTab: "hot",
      priceObj: {},
      loading: true,
      timeVolume: null,
      timeupDown: null,
      timeSearch: null,
      inputValue: ""
    };
    this.tabChange = this.tabChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
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
    // if (dex == "GEM") {
    //   this.setState({ tokenAudited: false });
    // }

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
      exchange20UpDownList,
      exchanges20SearchList
    } = this.props;
    let { tokenAudited, activedTab, inputValue, activedId } = this.state;
    if (inputValue) {
      if (exchanges20SearchList !== prevProps.exchanges20SearchList) {
        this.setSearchList(activedTab, activedId);
        // this.setState({
        //   dataSource: exchanges20SearchList
        // });
      }
      return;
    }
    if (activedTab === "hot" && exchange20List !== prevProps.exchange20List) {
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "volume" &&
      exchange20VolumeList !== prevProps.exchange20VolumeList
    ) {
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
        let listIds = Lockr.get("dex20") || [];
        list = exchange20List.filter(item => listIds.includes(item.id));
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
      // this.setState({ dataSource: unreviewedTokenList });

      this.fiterData(unreviewedTokenList);
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
      inputValue,
      activedTab
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
                    ? require("../../../../../images/market/ad_1_zh.png")
                    : require("../../../../../images/market/ad_1_en.png")
                }
                alt="ad"
              />
              {/* <ul>
                <li>{day}</li>
                <li>{hr}</li>
                <li>{min}</li>
                <li>{sec}</li>
              </ul> */}
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
          <div className="d-flex  justify-content-between align-items-center w-100 tab-pr-100">
            {/* <h6 className="m-0">
              
              <a href="https://poloniex.org" target="_blank" className="">
                Poloni DEX
              </a>
            </h6> */}

            {/* <div className="d-flex f-12">
              <a
                href={
                  intl.locale == "zh"
                    ? "	https://support.poloniex.org/hc/zh-cn/requests/new"
                    : "	https://support.poloniex.org/hc/en-us/requests/new"
                }
                target="_bank"
                className="pr-1 border-right border-light"
              >
                {tu("Submit_a_bug")}
              </a>
              <a
                href={
                  intl.locale == "zh"
                    ? "https://support.poloniex.org/hc/zh-cn/categories/360001517211-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98"
                    : "https://support.poloniex.org/hc/en-us/categories/360001517211-FAQ"
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
              allowClear
              onChange={e => {
                this.onInputChange(e);
                // this.setState({
                //   inputValue: e.target.value
                // });
              }}
              onPressEnter={() => this.onPressEnter()}
            />
            {/* <div className="collapse-icon">
              <Icon type="arrow-left" />
            </div> */}
          </div>

          {/* filter 筛选 */}
          <div
            className={
              intl.locale !== "en"
                ? "dex-tab tab-lar tab-pr-100"
                : "dex-tab tab-lar tab-pr-100 tab-en"
            }
          >
            <Tabs onChange={this.tabChange} activeKey={activedTab}>
              <TabPane
                tab={
                  <span>
                    {/* <Icon type="star" /> */}
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
          <div className="dex-tab tab-pr-100 font12">
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
            <div>
              <div className="exchange-list__table">
                {loading ? (
                  <TronLoader />
                ) : (
                  <ExchangeTable dataSource={dataSource} isAdClose={AdClose} />
                )}
              </div>
            </div>
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
    const { time, timeVolume, timeupDown, inputValue, timeSearch } = this.state;
    const {
      getExchanges20,
      getExchanges20Volume,
      getExchanges20UpDown
    } = this.props;
    clearInterval(time);
    clearInterval(timeVolume);
    clearInterval(timeupDown);
    clearInterval(timeSearch);
    if (inputValue) {
      this.setState({
        activedTab: activeKey
        // activedId: 0
      });
      this.setSearchList(activeKey, 0);
      return;
    }
    this.setState(
      {
        activedTab: activeKey,
        activedId: 0
      },
      () => {
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
    );
  }
  selcetSort(type) {
    let { activedTab, inputValue } = this.state;
    if (inputValue) {
      this.setState({
        activedId: type
      });
      this.setSearchList(activedTab, type);
      return;
    }
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
    let data = await Client20.coinMarketCap(type, "ETH");
    let data1 = await Client20.coinMarketCap(type, "EUR");
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

      let data2 = await Client20.coinMarketCap(type, "TRX");
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

  onInputChange(e) {
    const { activedId, activedTab, timeSearch } = this.state;
    this.setState({
      inputValue: e.target.value
    });
    if (!e.target.value) {
      clearInterval(timeSearch);
      this.setState({
        // activedTab: "hot",
        activedId: activedId,
        dataSource: this.keyObj(activedTab)
      });
    } else {
      this.getSearchList(e.target.value);
    }
  }

  onPressEnter() {
    const { inputValue, activedTab } = this.state;
    if (inputValue === "") {
      this.setState({
        dataSource: this.keyObj(activedTab)
      });
    } else {
      // this.setState({
      //   activedTab: "hot",
      //   activedId: 0
      // });
      this.getSearchList(inputValue);
    }
  }

  getSearchList(val) {
    const { time, timeVolume, timeupDown, timeSearch } = this.state;
    const { getExchanges20Search } = this.props;

    clearInterval(time);
    clearInterval(timeVolume);
    clearInterval(timeupDown);
    clearInterval(timeSearch);
    getExchanges20Search({ key: val });
    this.setState({
      timeSearch: setInterval(() => {
        getExchanges20Search({ key: val });
      }, 10000)
    });
  }
  setSearchList(tab, id) {
    let { exchanges20SearchList } = this.props;
    let list = [...exchanges20SearchList];
    switch (tab) {
      case "fav":
        let _list = Lockr.get("dex20") || [];
        list = list.filter(item => _list.includes(item.id));
        break;
      case "hot":
        list = list;
        break;
      case "volume":
        list = list.sort((a, b) => {
          return b.trxVolume24h - a.trxVolume24h;
        });
        break;
      case "up_and_down":
        list = list.sort((a, b) => {
          return b.gain - a.gain;
        });
        break;
    }
    if (id !== 0) {
      list = list.filter(v => {
        return v.second_token_abbr == id;
      });
    }
    this.setState(() => {
      return {
        dataSource: list
      };
    });
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
    price: state.exchange.price,
    exchanges20SearchList: state.exchange.searchList
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchanges20,
  getExchangesAllList,
  getExchanges,
  setPriceConvert,
  getExchanges20Volume,
  getExchanges20UpDown,
  getExchanges20Search
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeList)));
