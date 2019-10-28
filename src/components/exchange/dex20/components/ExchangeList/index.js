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
  getExchanges20Search,
  getExchangesByIds,
  setExchanges20Search
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
        "https://support.trx.market/hc/en-us/articles/360030644412-TRC20-USDT-Reloaded-with-Powerful-Aid-from-TRXMarket-15-000-USD-Awaits-",
      adchURL:
        "https://support.trx.market/hc/zh-cn/articles/360030644412-TRXMarket%E5%8A%A9%E5%8A%9BTRC20-USDT%E9%87%8D%E8%A3%85%E4%B8%8A%E9%98%B5-%E6%83%8A%E5%96%9C%E6%94%BE%E9%80%8110%E4%B8%87%E4%BA%BA%E6%B0%91%E5%B8%81",
      activedId: 0,
      activedTab: "1",
      priceObj: {},
      loading: true,
      timeVolume: null,
      timeupDown: null,
      timeSearch: null,
      inputValue: "",
      unRecomendList: []
    };
    this.tabChange = this.tabChange.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  async componentDidMount() {
    // sortType=0 24小时交易额 sortType=1 热门 sortType=2 涨跌幅
    const { getExchanges20, getExchangesByIds } = this.props;
    //获取各个币的兑换价格
    await this.getCovert("trx");
    await this.getCovert("usdt");

    getExchanges20(1);
    getExchanges20(0);
    getExchanges20(2);
    let ids = Lockr.get("dex20") || [];
    getExchangesByIds(ids.join(","));

    this.setState({
      loading: false
    });

    const getDataTime = setInterval(() => {
      getExchanges20(1);
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
      exchanges20SearchList,
      exchanges20SearchListByIds
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
    if (activedTab === "1" && exchange20List !== prevProps.exchange20List) {
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "0" &&
      exchange20VolumeList !== prevProps.exchange20VolumeList
    ) {
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "2" &&
      exchange20UpDownList !== prevProps.exchange20UpDownList
    ) {
      this.setData(tokenAudited, activedTab);
    }

    if (
      activedTab === "fav" &&
      exchanges20SearchListByIds !== prevProps.exchanges20SearchListByIds
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
      exchange20UpDownList,
      exchanges20SearchListByIds
    } = this.props;

    let list = [];

    switch (Number(activeKey)) {
      case 1:
        list = exchange20List;
        break;
      case 0:
        list = exchange20VolumeList;
        break;
      case 2:
        list = exchange20UpDownList;
        break;
      default:
        list = exchanges20SearchListByIds;
        break;
    }
    return list;
  }
  setData(type, activeKey) {
    let list = this.keyObj(activeKey);

    this.setState({
      dataSource: list
    });
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
      activedTab,
      unRecomendList
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
              <TabPane tab={intl.formatMessage({ id: "trc20_hot" })} key="1" />
              <TabPane
                tab={intl.formatMessage({ id: "trc20_top_Volume" })}
                key="0"
              />
              <TabPane
                tab={intl.formatMessage({ id: "trc20_top_Rising" })}
                key="2"
              />
            </Tabs>
          </div>
          <div className="dex-tab tab-pr-100 font12">
            <div
              className={"btn btn-sm" + (activedId === 0 ? " active" : "")}
              onClick={() => this.selcetSort(0)}
            >
              {tu("all")}
            </div>
            <div
              className={"btn btn-sm" + (activedId === "TRX" ? " active" : "")}
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
                  <ExchangeTable
                    dataSource={dataSource}
                    isAdClose={AdClose}
                    unRecomendList={unRecomendList}
                  />
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
  // 自选，热门，成交额榜，涨幅榜的切换
  tabChange(activeKey) {
    const {
      unRecomendList,
      time,
      timeVolume,
      timeupDown,
      inputValue,
      timeSearch
    } = this.state;

    clearInterval(time);
    clearInterval(timeSearch);
    if (inputValue) {
      this.setState(
        {
          activedTab: activeKey
        },
        () => {
          this.getSearchList(inputValue);
        }
      );
      return;
    }
    this.setState(
      {
        activedTab: activeKey
      },
      () => {
        switch (activeKey) {
          case "fav":
            this.changeFavData();
            break;
          default:
            this.changeData();
            break;
        }
      }
    );
  }

  // 改变数据
  changeData() {
    const { activedTab, activedId } = this.state;
    const { getExchanges20 } = this.props;
    getExchanges20(activedTab, activedId || "");
    this.handleSelectData(true, activedTab);
    this.setState({
      time: setInterval(() => {
        getExchanges20(activedTab, activedId || "");
        this.handleSelectData(true, activedTab);
      }, 10000)
    });
  }

  // 自选数据
  changeFavData() {
    const { activedTab } = this.state;
    const { getExchangesByIds } = this.props;
    let ids = Lockr.get("dex20") || [];
    getExchangesByIds(ids.join(","));
    this.handleSelectData(false, activedTab);
    this.setState({
      time: setInterval(() => {
        getExchangesByIds(ids.join(","));
        this.handleSelectData(false, activedTab);
      }, 10000)
    });
  }
  //全部，trx,usdt切换
  selcetSort(type) {
    let { activedTab, inputValue, time, timeSearch } = this.state;
    let { exchanges20SearchListByIds } = this.props;
    if (inputValue) {
      this.setState(
        {
          activedId: type
        },
        () => {
          this.getSearchList(inputValue);
        }
      );
      return;
    }
    clearInterval(time);
    clearInterval(timeSearch);
    if (activedTab == "fav") {
      let list = cloneDeep(exchanges20SearchListByIds);
      let fiterData = list;
      if (type != 0) {
        fiterData = list.filter((item, index) => {
          return item.second_token_id.toLowerCase() === type.toLowerCase();
        });
      }

      this.setState({
        dataSource: fiterData,
        activedId: type
      });

      return;
    }
    this.setState(
      {
        activedId: type
      },
      () => {
        if (activedTab != "fav") {
          this.changeData();
        }
      }
    );
  }
  // 各单位换算
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
  // 输入框发生改变的时候
  onInputChange(e) {
    let { activedId, activedTab, timeSearch, time, dataSource } = this.state;
    const { setExchanges20Search, exchanges20SearchList } = this.props;
    let listAll = { ...exchanges20SearchList };
    let { unRecomendList } = listAll;
    this.setState({
      inputValue: e.target.value
    });
    if (!e.target.value) {
      clearInterval(time);
      clearInterval(timeSearch);
      let dataSourceNew = this.keyObj(activedTab);
      console.log(1, dataSourceNew);
      if (activedTab == "fav") {
        dataSourceNew = dataSourceNew.filter(item => {
          if (activedId == 0) {
            return item;
          } else {
            return (
              activedId.toLowerCase() == item.second_token_abbr.toLowerCase()
            );
          }
        });
      }
      this.setState(
        {
          // activedTab: "hot",
          activedId: activedId,
          dataSource: dataSourceNew,
          unRecomendList: []
        },
        () => {
          setExchanges20Search();
        }
      );
    } else {
      if (activedTab == "fav") {
        let filterRecomment = dataSource.filter(item => {
          if (activedId == 0) {
            return item.fShortName.includes(e.target.value);
          } else {
            return (
              item.fShortName.includes(e.target.value) &&
              activedId.toLowerCase() == item.second_token_abbr.toLowerCase()
            );
          }
        });

        this.setState({
          dataSource: filterRecomment || [],
          unRecomendList: []
        });
        return;
      }
      this.getSearchList(e.target.value);
    }
  }
  // 输入框点击enter
  onPressEnter() {
    const { inputValue, activedTab } = this.state;
    const { setExchanges20Search, exchanges20SearchList } = this.props;
    let listAll = { ...exchanges20SearchList };
    let { unRecomendList } = listAll;
    if (inputValue === "") {
      this.setState({
        dataSource: this.keyObj(activedTab),
        unRecomendList: unRecomendList
      });
      setExchanges20Search();
    } else {
      // this.setState({
      //   activedTab: "hot",
      //   activedId: 0
      // });
      this.getSearchList(inputValue);
    }
  }

  searchEvent() {}

  //搜索函数
  getSearchList(val) {
    const {
      time,
      timeVolume,
      timeupDown,
      timeSearch,
      activedTab,
      activedId
    } = this.state;
    const { getExchanges20Search } = this.props;

    clearInterval(time);

    clearInterval(timeSearch);
    let obj = {
      key: val,
      sortType: activedTab != "fav" ? activedTab : "",
      pairType: activedId != 0 ? activedId : ""
    };
    getExchanges20Search(obj);
    this.setState({
      timeSearch: setInterval(() => {
        getExchanges20Search(obj);
      }, 10000)
    });
  }
  //设置搜索出来的数据
  setSearchList(tab, id) {
    let { exchanges20SearchList } = this.props;
    let listAll = { ...exchanges20SearchList };
    let { recomendList, unRecomendList } = listAll;
    let { activedId } = this.state;

    if (tab == "fav") {
      unRecomendList = [];
      recomendList = recomendList.filter(item => {
        if (activedId != 0) {
          return (
            item.isChecked &&
            item.second_token_abbr.toLowerCase() == activedId.toLowerCase()
          );
        } else {
          return item.isChecked;
        }
      });
    }

    this.setState(() => {
      return {
        dataSource: recomendList,
        unRecomendList: unRecomendList
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
    exchanges20SearchList: state.exchange.searchList,
    exchanges20SearchListByIds: state.exchange.searchListByIds
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchanges20,
  getExchangesAllList,
  getExchanges,
  setPriceConvert,
  getExchanges20Search,
  getExchangesByIds,
  setExchanges20Search
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeList)));
