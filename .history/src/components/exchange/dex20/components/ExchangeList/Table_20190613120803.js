import React, { Component, Fragment } from "react";
import { Table, Icon } from "antd";
import { QuestionMark } from "../../../../common/QuestionMark";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import { connect } from "react-redux";
import {
  getSelectData,
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
      activeIndex: props.activeIndex,
      optional: [],
      optionalBok: false,
      offlineToken: [30],
      transcationToken: [61] // 交易赛标识
    };
  }

  getColumns() {
    let { intl, price, activeCurrency, activeLanguage } = this.props;
    let { dataSource, offlineToken, transcationToken } = this.state;
    let isfov = Lockr.get("DEX") == "GEM";
    let favList = Lockr.get("dex20") || [];

    const columns = [
      {
        title: upperFirst(intl.formatMessage({ id: "trc20_price" })),
        key: "first_token_id",
        width: 120,
        render: (text, record, index) => {
          let content = (
            <div style={{ width: "150px" }}>
              <p>{tu("trc20_fire_token")}</p>
              <p style={{ textAlign: "right", color: "#C53028" }}>
                {activeLanguage === "zh" ? (
                  <a
                    href="https://support.trx.market/hc/zh-cn/articles/360029062571-SCC-SCT-%E8%81%94%E5%90%88%E4%BA%A4%E6%98%93%E6%8A%95%E6%B3%A8%E8%B5%9B-1-500-000-SCT-%E7%AD%89%E4%BD%A0%E6%9D%A5%E6%8B%BF-"
                    target="_blank"
                  >
                    {tu("learn_more")}
                  </a>
                ) : (
                  <a
                    href="https://support.trx.market/hc/en-us/articles/360029062571-SCC-SCT-Trading-Competition-1-500-000-SCT-to-Win-"
                    target="_blank"
                  >
                    {tu("learn_more")}
                  </a>
                )}{" "}
                >
              </p>
            </div>
          );
          return (
            <div className="position-relative" style={{ display: "flex" }}>
              {/* {isfov && (
                <div className="fov_tip">
                  {record.token_type == "dex20" ? (
                    <img src={require("../../../../../images/svg/20.svg")} />
                  ) : (
                    <img src={require("../../../../../images/svg/10.svg")} />
                  )}
                </div>
              )} */}

              <span className="optional-star">
                <span
                  onClick={ev => {
                    this.setFavorites(ev, record, index);
                  }}
                >
                  {favList.includes(record.id) ? (
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
              <div className="">
                {offlineToken.includes(record.id) ? (
                  <p
                    className="exchange-abbr-name"
                    style={{ textDecoration: "line-through" }}
                  >
                    {/* {record.exchange_abbr_name} */}
                    <span style={{ color: "#333333" }}>
                      {record.fShortName}
                    </span>
                    /
                    <span style={{ color: "#999999" }}>
                      {record.sShortName}
                    </span>
                  </p>
                ) : (
                  <p className="exchange-abbr-name">
                    {/* {record.exchange_abbr_name} */}
                    <span style={{ color: "#333333" }}>
                      {record.fShortName}
                    </span>
                    /
                    <span style={{ color: "#999999" }}>
                      {record.sShortName}
                    </span>
                  </p>
                )}

                <p
                  className={
                    record.up_down_percent.indexOf("-") != -1
                      ? "col-red"
                      : "col-green"
                  }
                >
                  {record.price.toFixed(record.sPrecision)}
                </p>
              </div>

              {transcationToken.includes(record.id) && (
                <div>
                  <Popover content={content} title="">
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
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "trc20_24H_Total" })),
        align: "right",
        dataIndex: "price",
        key: "price",
        // width: 120,
        render: (text, record) => {
          return (
            <div className="textRight ">
              <FormattedNumber
                value={
                  Number(
                    record.volume24h / Math.pow(10, record.sPrecision)
                  ).toFixed(0)
                    ? Number(
                        record.volume24h / Math.pow(10, record.sPrecision)
                      ).toFixed(0)
                    : 0
                }
              />{" "}
              {record.second_token_abbr}
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
                {record.second_token_id === "USDT" ? (
                  <FormattedNumber
                    value={Number(
                      record.volume24h / Math.pow(10, record.sPrecision)
                    ).toFixed(0)}
                  />
                ) : (
                  <FormattedNumber
                    value={(
                      Number(
                        price && price.trxToOther && price.usdtToOther
                          ? record.second_token_id === "TRX"
                            ? price.trxToOther["usd"]
                            : price.usdtToOther["usd"]
                          : ""
                      ) * record.svolume
                    ).toFixed(0)}
                  />
                )}{" "}
                USD
              </span>
            </div>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "trc20_token_info_ths_3" })),
        dataIndex: "up_down_percent",
        key: "up_down_percent",
        align: "right",
        // width: 100,
        render: (text, record, index) => {
          return text.indexOf("-") != -1 ? (
            <div className="tab-pr-50">
              <span className="col-red bg-color">{text}</span>
            </div>
          ) : (
            <div className="tab-pr-50">
              <span className="col-green bg-color">{text}</span>
            </div>
          );
        }
      }
    ];

    return (
      <Fragment>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={(record, index) => {
            return index;
          }}
          rowClassName={this.setActiveClass}
          scroll={{ y: 1250 }}
          className="tab-pdr"
          onRow={record => {
            return {
              onClick: () => {
                this.docodUrl(record);
              }
            };
          }}
        />
      </Fragment>
    );
  }
  setFavorites(ev, record) {
    let { dataSource } = this.state;
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
      if (
        record.exchange_id == item.exchange_id &&
        record.exchange_name == item.exchange_name
      ) {
        item.isChecked = !item.isChecked;
      }
      return item;
    });
    if (Lockr.get("DEX") == "GEM") {
      let new20List = dataSource.filter(item => item.isChecked);
      this.setState({ dataSource: new20List });
    } else {
      this.setState({ dataSource: newdataSource });
    }

    ev.stopPropagation();
  }

  setActiveClass = (record, index) => {
    // return record.exchange_id === this.state.activeIndex ? "exchange-table-row-active": "";
    return record.token_type == "dex20" &&
      record.exchange_id === this.state.activeIndex
      ? "exchange-table-row-active"
      : "";
  };
  getData() {
    const parsed = queryString.parse(this.props.location.search).id;
    const { getSelectData, dataSource } = this.props;

    const currentData = filter(dataSource, item => {
      return item.exchange_id == parsed;
    });

    // 更新数据
    if (dataSource && dataSource.length) {
      if (!parsed || !currentData.length) {
        this.onSetUrl(dataSource[0]);
      } else {
        this.onSetUrl(currentData[0], true);
      }
    }

    // 获取选择状态
    map(dataSource, item => {
      if (item.exchange_id == parsed || !parsed) {
        item.isCurrent = true;
      }
    });
    this.setState({ dataSource });
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
      activeIndex: record.exchange_id //获取点击行的索引
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

  async componentDidMount() {}

  componentDidUpdate(prevProps) {
    let { dataSource } = this.props;
    if (dataSource != prevProps.dataSource) {
      this.getData();
    }
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
    return <div>{this.getColumns()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    klineLock: state.exchange.klineLock,
    activeCurrency: state.app.activeCurrency,
    price: state.exchange.price,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  getSelectData
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeTable)));
