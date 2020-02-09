import React, { Component } from "react";
import { Table } from "antd";
import { AddressLink, TransactionHashLink } from "../../../../common/Links";
import { FormattedDate, FormattedTime, injectIntl } from "react-intl";
import { TRXPrice } from "../../../../common/Price";
import { ONE_TRX } from "../../../../../constants";
import { Truncate } from "../../../../common/text";
import { tu, tv } from "../../../../../utils/i18n";
import { Client } from "../../../../../services/api";
import { Client20 } from "../../../../../services/api";
import { connect } from "react-redux";
import { upperFirst } from "lodash";
import { dateFormat } from "../../../../../utils/DateTime";
import { setUpdateTran, setRedirctPair } from "../../../../../actions/exchange";
import { TronLoader } from "../../../../common/loaders";
import { Popover, Icon } from "antd";
import { precisions } from "../../TokenPre";
import { withRouter } from "react-router-dom";

class Mytran extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      total: 0,
      isLoading: true,
      statusOp: {
        0: { text: "等待成交", class: "processOn" },
        1: { text: "部分成交", class: "processOn" },
        2: { text: "已完成", class: "processOn" },
        3: { text: "", class: "processOn" },
        4: { text: "", class: "processOn" },
        5: { text: "已完成", class: "processOn" },
        6: { text: "取消确认中", class: "processOn" },
        7: { text: "已取消", class: "processOn" },
        8: { text: "委托失败", class: "failed" },
        100: { text: "部分取消", class: "processOn" }
      },
      showCurrent: props.showCurrent
    };
    this.changeParis = this.changeParis.bind(this);
  }

  componentDidMount() {
    this.getColumns();
    this.getData({ current: 1, pageSize: 12 });
  }

  componentDidUpdate(prevProps) {
    let { is_update_tran, isLoad, showCurrent, account } = this.props;

    if (
      prevProps.is_update_tran != is_update_tran ||
      prevProps.account.address != account.address ||
      (isLoad && prevProps.isLoad != isLoad)
    ) {
      this.setState({
        isLoading: true
      });
      this.getData({ current: 1, pageSize: 12 });
      setUpdateTran(false);
    }

    if (prevProps.showCurrent != showCurrent) {
      this.setState(
        {
          start: 0
        },
        () => {
          this.getData({ current: 1, pageSize: 12 });
        }
      );
    }
  }

  getData = async palyload => {
    const { selectData, account, showCurrent } = this.props;

    if (selectData.exchange_id) {
      let params = {
        uAddr: account.address,
        start: (palyload.current - 1) * palyload.pageSize,
        limit: palyload.pageSize,
        status: "2,5,6,7,8",
        channelId: 10000
      };

      if (showCurrent) {
        params = Object.assign(params, {
          fTokenAddr: selectData.fTokenAddr,
          sTokenAddr: selectData.sTokenAddr
        });
      }
      const { data, code } = await Client20.getCurrentList(params);
      this.setState({
        isLoading: false
      });
      let rows = data.rows || [];
      rows = rows.filter(item => {
        let key =
          item.fShortName.toLowerCase() + "_" + item.sShortName.toLowerCase();
        let precisions_key = precisions[key] || 6;
        item.precisionPrice = precisions_key;
        item.precisionAmount = 6 - precisions_key < 0 ? 0 : 6 - precisions_key;

        if (
          Number(item.schedule) > 0 &&
          Number(item.schedule) < 1 &&
          item.orderStatus == 7
        ) {
          item.orderStatus = 100;
        }
        return item;
      });
      if (code === 0) {
        this.setState({ dataSource: rows, total: data.total });
      }
    }
  };

  getColumns() {
    let { intl, activeLanguage } = this.props;
    let { dataSource, total, statusOp } = this.state;

    const columns = [
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_time" })
        ),
        dataIndex: "orderTime",
        key: "orderTime",
        width: "160px",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedDate value={Number(record.orderTime)} /> &nbsp;
              <FormattedTime
                value={Number(record.orderTime)}
                hour="numeric"
                minute="numeric"
                second="numeric"
                hour12={false}
              />
              &nbsp;
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_pair" })
        ),
        dataIndex: "fShortName",
        key: "fShortName",
        width: "100px",
        render: (text, record, index) => {
          return (
            <span
              className="pairs-style"
              onClick={() => this.changeParis(record)}
            >
              {record.fShortName + "/" + record.sShortName}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_type" })
        ),
        dataIndex: "orderType",
        key: "orderType",
        width: "60px",
        render: (text, record, index) => {
          return record.orderType === 0 ? (
            <span className="col-green">{tu("trc20_BUY")}</span>
          ) : (
            <span className="col-red">{tu("trc20_SELL")}</span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_price" })
        ),
        dataIndex: "price",
        key: "price",
        width: "100px",
        render: (text, record, index) => {
          return (
            <span>{Number(record.price).toFixed(record.precisionPrice)}</span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_amount" })
        ),
        dataIndex: "volume",
        key: "volume",
        width: "160px",
        render: (text, record, index) => {
          return (
            <span>
              {Number(record.volume).toFixed(record.precisionAmount)}{" "}
              {record.fShortName}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_volume" })
        ),
        dataIndex: "curTurnover",
        key: "curTurnover",
        width: "180px",
        render: (text, record, index) => {
          return (
            <span>
              {this.numFormat(record.curTurnover.toFixed(4))}&nbsp;
              {record.sShortName}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_progress" })
        ),
        dataIndex: "schedule",
        key: "schedule",
        width: "80px",
        render: (text, record, index) => {
          return record.orderType === 0 ? (
            <span className="col-green">
              {(+record.schedule * 100).toFixed(2)}%
            </span>
          ) : (
            <span className="col-red">
              {(+record.schedule * 100).toFixed(2)}%
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_my_trans_header_status" })
        ),
        dataIndex: "orderStatus",
        key: "orderStatus",
        align: "right",
        width: "100px",
        render: (text, record, index) => {
          let content = (
            <div style={{ width: "180px" }}>
              <p>{tu("trc20_failed_order")}</p>
              <a
                href={
                  activeLanguage === "zh"
                    ? "https://support.poloniex.org/hc/zh-cn/signin?return_to=https%3A%2F%2Fsupport.poloniex.org%2Fhc%2Fzh-cn%2Farticles%2F360033085292-%25E4%25B8%25BA%25E4%25BB%2580%25E4%25B9%2588%25E4%25BC%259A-%25E5%25A7%2594%25E6%2589%2598%25E5%25A4%25B1%25E8%25B4%25A5-"
                    : "https://support.poloniex.org/hc/en-us/articles/360033085292-Why-is-there-Submit-Failed-"
                }
                className="learn-more"
                target="_blank"
              >
                {tu("learn_more")} >
              </a>
            </div>
          );
          return (
            <span
              className={
                statusOp[record.orderStatus]
                  ? statusOp[record.orderStatus].class
                  : ""
              }
            >
              {tu(`trc20_status_${record.orderStatus}`)}
              {record.orderStatus === 8 && (
                <Popover content={content} title="">
                  <Icon
                    type="question-circle"
                    style={{
                      fontSize: "15px",
                      marginLeft: "5px",
                      verticalAlign: "text-bottom"
                    }}
                  />
                </Popover>
              )}
            </span>
          );
        }
      }
    ];
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        // pagination={false}
        onChange={pagination => this.getData(pagination)}
        pagination={{
          defaultPageSize: 12,
          total
        }}
        rowKey={(record, index) => {
          return index;
        }}
        className="my-tran"
      />
    );
  }

  render() {
    let { dataSource, columns, total, isLoading } = this.state;
    if (!dataSource || dataSource.length === 0) {
      return (
        <div className="p-3 text-center no-data">{tu("trc20_no_data")}</div>
      );
    }

    return (
      <div className="exchange__tranlist">
        {isLoading ? <TronLoader /> : this.getColumns()}
      </div>
    );
  }

  numFormat(v) {
    return v
      .toString()
      .replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
  }
  changeParis(v) {
    const { setRedirctPair } = this.props;
    let obj = {
      exchange_id: v.pairId || v.exchangeId,
      exchange_name: v.fShortName + "/" + v.sShortName
    };
    this.props.history.push(
      "/exchange/trc20?token=" + obj.exchange_name + "&id=" + obj.exchange_id
    );
    window.location.reload();
    setRedirctPair(v);
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    currentWallet: state.wallet.current,
    activeLanguage: state.app.activeLanguage,
    account: state.app.account,
    is_update_tran: state.exchange.is_update_tran
      ? state.exchange.is_update_tran
      : false
  };
}

const mapDispatchToProps = {
  setUpdateTran,
  setRedirctPair
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Mytran)));
