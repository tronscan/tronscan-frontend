import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../../../../services/api";
import { Link } from "react-router-dom";
import { tu } from "../../../../../utils/i18n";
import xhr from "axios/index";
import { map } from "lodash";
import ExchangeTable from "./Table";
import SearchTable from "./SearchTable";
import Explain from "./Explain";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { filter } from "lodash";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import { getSelectData, getExchanges20 } from "../../../../../actions/exchange";
import { connect } from "react-redux";
import Lockr from "lockr";
import { QuestionMark } from "../../../../common/QuestionMark";
import { Input } from "antd";
import rebuildList from "../../../../../utils/rebuildList";
import { Tooltip } from "reactstrap";
import { alpha } from "../../../../../utils/str";

const Search = Input.Search;

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
      optionalBok: false,
      search: "",
      searchExchangesList: [],
      showSearch: false,
      activeIndex: "",
      optionalDisable: false,
      searchAddId: false,
      tagLock: true,
      open: false,
      id: alpha(24),
      day: "",
      hr: "",
      min: "",
      sec: "",
      AdClose: true,
      adURL: "https://trx.market/launchBase?utm_source=TS2",
      adchURL: "https://trx.market/zh/launchBase?utm_source=TS2"
    };
  }

  componentDidMount() {
    const { getExchanges20 } = this.props;
    getExchanges20();
    this.getExchangesAllList();
    const getDataTime = setInterval(() => {
      this.getExchangesAllList();
    }, 10000);

    this.setState({ time: getDataTime });
    //this.countdown();
  }

  componentWillUnmount() {
    const { time } = this.state;
    time && clearInterval(time);
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

    // day = day > 9 ? day :"0" + day ;
    // hr = hr > 9 ? hr : "0" + hr;
    // min = min > 9 ? min : "0" + min;
    // sec = sec > 9 ? sec : "0" + sec;
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
  getExchangesAllList = async () => {
    let { exchangesAllList } = await Client.getexchangesAllList();

    map(exchangesAllList, item => {
      if (item.up_down_percent.indexOf("-") != -1) {
        item.up_down_percent =
          "-" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      } else {
        item.up_down_percent =
          "+" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      }
      item.price = Number(item.price.toFixed(6));
    });
    const data = rebuildList(
      exchangesAllList,
      ["first_token_id", "second_token_id"],
      ["first_token_balance", "second_token_balance"]
    );

    const newData = data.map(item => {
      item.first_token_id = item.map_token_name;
      item.second_token_id = item.map_token_name1;
      item.exchange_name = item.map_token_name + "/" + item.map_token_name1;
      return item;
    });

    this.setState(
      {
        exchangesAllList: newData
      },
      () => {
        this.getExchanges();
      }
    );
  };
  getExchanges = async () => {
    let { exchangesAllList } = this.state;
    let { exchange20List = [] } = this.props;
    let { data } = await Client.getExchangesList();
    data = _.sortBy(data, function(item) {
      return -item.svolume;
    });

    let tab, exchangesList;
    if (Lockr.get("DEX")) {
      tab = Lockr.get("DEX");
    } else {
      Lockr.set("DEX", "Main");
      tab = "Main";
    }
    map(data, item => {
      if (item.up_down_percent.indexOf("-") != -1) {
        item.up_down_percent =
          "-" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      } else {
        item.up_down_percent =
          "+" + Math.abs(Number(item.up_down_percent).toFixed(2)) + "%";
      }
      item.price = Number(item.price).toFixed(6);
    });

    const exchange10 = rebuildList(
      data,
      ["first_token_id", "second_token_id"],
      ["first_token_balance", "second_token_balance"]
    );

    const newData = exchange10.map(item => {
      item.first_token_id = item.map_token_name;
      item.second_token_id = item.map_token_name1;
      item.exchange_name = item.map_token_name + "/" + item.map_token_name1;
      return item;
    });

    exchangesList = newData.map(item => {
      item.optionalBok = false;
      return item;
    });
    if (Lockr.get("optional")) {
      let optional = Lockr.get("optional");
      for (let i in exchangesAllList) {
        for (let j in optional) {
          if (exchangesAllList[i].exchange_id == optional[j]) {
            exchangesAllList[i].optionalBok = true;
          }
        }
      }
    }
    if (Lockr.get("optional")) {
      let optional = Lockr.get("optional");
      for (let i in exchangesList) {
        for (let j in optional) {
          if (exchangesList[i].exchange_id == optional[j]) {
            exchangesList[i].optionalBok = true;
          }
        }
      }
    }
    if (Lockr.get("dex20")) {
      let dex20list = Lockr.get("dex20");
      for (let i in exchange20List) {
        for (let j in dex20list) {
          if (exchange20List[i].exchange_id == dex20list[j]) {
            exchange20List[i].optionalBok = true;
          }
        }
      }
    }

    let newlist = _.concat(exchange20List, exchangesAllList);
    let unreviewedTokenList = _(newlist)
      .filter(o => o["optionalBok"] == true)
      .value();

    this.setState(
      {
        auditedTokenList: exchangesList,
        unreviewedTokenList: unreviewedTokenList,
        dataSource: tab == "Main" ? exchangesList : unreviewedTokenList,
        tokenAudited: tab == "Main" ? true : false,
        optionalDisable: true,
        exchangesAllList: exchangesAllList
      },
      () => {}
    );
  };

  handleAuditedToken = () => {
    const { getSelectData, klineLock } = this.props;
    const { auditedTokenList, optionalDisable, tagLock } = this.state;
    // klineLock && tagLock
    if (klineLock && tagLock) {
      // if(!optionalDisable) return;
      Lockr.set("DEX", "Main");
      this.setState({
        tokenAudited: true,
        dataSource: auditedTokenList,
        showSearch: false,
        tagLock: false
      });

      if (auditedTokenList && auditedTokenList.length > 0) {
        this.props.history.push(
          "/exchange/trc10?token=" +
            auditedTokenList[0].exchange_name +
            "&id=" +
            auditedTokenList[0].exchange_id
        );

        getSelectData(auditedTokenList[0], true);
        this.setState({
          activeIndex: auditedTokenList[0].exchange_id
        });
      }
      setTimeout(() => {
        this.setState({ tagLock: true });
      }, 500);
    }
  };

  handleUnreviewedToken = () => {
    try {
      const { getSelectData } = this.props;
      const { unreviewedTokenList, optionalDisable } = this.state;
      if (!optionalDisable) return;
      Lockr.set("DEX", "GEM");
      this.setState({
        tokenAudited: false,
        dataSource: unreviewedTokenList,
        showSearch: false
      });
      if (unreviewedTokenList.length > 0) {
        let favFirst = unreviewedTokenList[0];
        let url = "";
        favFirst.token_type == "dex20"
          ? (url =
              "/exchange/trc20?token=" +
              unreviewedTokenList[0].exchange_name +
              "&id=" +
              unreviewedTokenList[0].exchange_id)
          : (url =
              "/exchange/trc10?token=" +
              unreviewedTokenList[0].exchange_name +
              "&id=" +
              unreviewedTokenList[0].exchange_id);
        this.props.history.push(url);

        getSelectData(unreviewedTokenList[0], true);
        this.setState({
          activeIndex: unreviewedTokenList[0].exchange_id
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  setCollection = (ev, id, index, record) => {
    ev.stopPropagation();
    let { dataSource } = this.state;
    this.addOptional(id, record.token_type == "dex20");
    dataSource[index].optionalBok = !dataSource[index].optionalBok;
    this.setState(
      {
        dataSource
      },
      () => {
        this.getExchanges();
      }
    );
  };

  addOptional = (id, type) => {
    if (!type) {
      let { optional } = this.state;

      if (optional.indexOf(id) == -1) {
        optional.push(id);
        this.setState({
          optional
        });
      } else {
        optional = _.remove(optional, n => {
          return n !== id;
        });
        this.setState({
          optional
        });
      }
      Lockr.set("optional", optional);
    } else {
      let optional = Lockr.get("dex20") || [];

      if (optional.indexOf(id) == -1) {
        optional.push(id);
      } else {
        optional = _.remove(optional, n => {
          return n !== id;
        });
      }
      Lockr.set("dex20", optional);
    }
  };

  handleSearch = async e => {
    let { search } = this.state;
    let { exchangesAllList } = await Client.getexchangesAllList({
      name: search
    });
    this.setState({
      searchExchangesList: exchangesAllList,
      showSearch: true
    });
  };
  setExchangeId = id => {
    const { unreviewedTokenList, optional } = this.state;
    if (optional.indexOf(id) == -1) {
      optional.push(id);
      this.setState({
        optional
      });
    }
    Lockr.set("DEX", "GEM");
    Lockr.set("optional", optional);
    this.setState(
      {
        tokenAudited: false,
        dataSource: unreviewedTokenList,
        showSearch: false,
        search: "",
        activeIndex: id,
        searchAddId: true
      },
      () => {
        this.getExchanges();
      }
    );
  };
  setSearchAddId() {
    this.setState({
      searchAddId: false
    });
  }

  gotoTrc20 = () => {
    const { klineLock } = this.props;
    const { tagLock } = this.state;

    if (klineLock && tagLock) {
      Lockr.set("DEX", "Main");
      this.props.history.push("trc20");
    }
  };

  render() {
    const {
      dataSource = [],
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
      adchURL
    } = this.state;
    let { intl } = this.props;
    let tab = Lockr.get("DEX") ? Lockr.get("DEX") : "Main";
    return (
      <div className="exchange-list mr-2">
        {/* 市场 */}

        <div className="exchange-list-mark p-3">
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
          {/* 标题 */}
          <div className="market-title">
            <div className="d-flex  justify-content-between align-items-center w-100 mb-3">
              <h6 className="m-0">
                <a href="https://trx.market" target="_blank" className="">
                  TRXMarket
                </a>
              </h6>

              <div className="d-flex f-12">
                <a
                  href={
                    intl.locale == "zh"
                      ? "https://support.trx.market/hc/zh-cn/requests/new"
                      : "https://support.trx.market/hc/en-us/requests/new"
                  }
                  target="_blank"
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
              </div>
            </div>
          </div>

          {/* filter 筛选 */}

          <div className="dex-tab">
            {/*<div*/}
            {/*className={"btn-sm dex-tab-TRC20"}*/}
            {/*id={this.state.id}*/}
            {/*onMouseOver={() => this.setState({open: true})}*/}
            {/*onMouseOut={() => this.setState({open: false})}*/}
            {/*// onClick={() => this.gotoTrc20()}*/}
            {/*>*/}
            {/*<i></i>*/}

            <div className="btn btn-sm" onClick={() => this.gotoTrc20()}>
              {/*<i class="fa fa-ban"></i>*/}
              Market
            </div>
            {/*<Tooltip placement="top" isOpen={open} target={id}>*/}
            {/*<span className="text-capitalize">{tu("TRC20_under_maintenance")}</span>*/}
            {/*</Tooltip>*/}
            <div
              className={"btn btn-sm" + (tokenAudited ? " active" : "")}
              onClick={this.handleAuditedToken}
            >
              Bancor
            </div>
            <div
              className={"btn btn-sm" + (tokenAudited ? "" : " active")}
              onClick={this.handleUnreviewedToken}
            >
              <i>
                <i className="fas fa-star" /> {tu("Favorites")}
              </i>
            </div>
          </div>
          <div className="dex-search">
            <Search
              placeholder={intl.formatMessage({ id: "dex_search_dec" })}
              value={search}
              onSearch={this.handleSearch}
              onChange={ev => this.setState({ search: ev.target.value })}
            />
          </div>
          {showSearch ? (
            <PerfectScrollbar>
              <div
                className="exchange-list__table"
                style={AdClose ? styles.list : styles.adlist}
              >
                <SearchTable
                  dataSource={searchExchangesList}
                  props={this.props}
                  tab={tab}
                  setExchangeId={id => this.setExchangeId(id)}
                  activeIndex={activeIndex}
                />
              </div>
            </PerfectScrollbar>
          ) : (
            <PerfectScrollbar>
              <div
                className="exchange-list__table"
                style={AdClose ? styles.list : styles.adlist}
              >
                <ExchangeTable
                  dataSource={dataSource}
                  props={this.props}
                  tab={tab}
                  setCollection={(ev, id, index, record) =>
                    this.setCollection(ev, id, index, record)
                  }
                  activeIndex={activeIndex}
                  searchAddId={searchAddId}
                  setSearchAddId={() => this.setSearchAddId()}
                />
              </div>
            </PerfectScrollbar>
          )}
        </div>

        {/* 说明 */}
        <Explain />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    exchange20List: state.exchange.list_20,
    klineLock: state.exchange.klineLock
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchanges20
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeList)));

const styles = {
  list: {
    height: 370
  },
  adlist: {
    height: 226
  }
};
