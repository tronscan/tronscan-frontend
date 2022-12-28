import React, { Component } from "react";
import { FormattedDate, FormattedTime, injectIntl } from "react-intl";
import { Client20 } from "../../../../../services/api";
import { tu } from "../../../../../utils/i18n";
import { Modal, Table } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { upperFirst } from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";
import { TW } from "../../TW";
import {
  setUpdateTran,
  setUnConfirmOrderObj,
  setDelegateFailureObj,
  deleteUnConfirmOrderObj,
  setCancelOrderObj,
  deleteCancelOrderObj,
  setRedirctPair
} from "../../../../../actions/exchange";
import { TronLoader } from "../../../../common/loaders";
import { withTronWeb } from "../../../../../utils/tronWeb";
import { Popover, Icon } from "antd";
import { compare } from "../../../../../utils/compare";
import { precisions } from "../../TokenPre";
import Lockr from "lockr";

const confirm = Modal.confirm;

@withTronWeb
class Curorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 0,
      limit: 12,
      list: [],
      total: 0,
      timer: null,
      modal: null,
      isLoading: true,
      statusOp: {
        "-1": { text: "订单确认中", operate: false, class: "confirming" },
        0: { text: "等待成交", operate: true },
        1: { text: "部分成交", operate: true },
        2: { text: "交易确认中", operate: false },
        3: { text: "", operate: false },
        4: { text: "", operate: false },
        5: { text: "已完成", operate: false },
        6: { text: "取消确认中", operate: false },
        7: { text: "已取消", operate: false },
        8: { text: "委托失败", operate: false, ignore: true, class: "failed" },
        100: { text: "部分取消" }
      },
      //原始数据
      initData: [],
      //取消未确认的订单
      cancelOrders: [],
      //包含2，8 的列表
      contain28List: [],
      //过滤后的订单
      confirmList: [],
      showCurrent: props.showCurrent,
      n: 0
    };

    this.cancelOrder = this.cancelOrder.bind(this);
    this.changeParis = this.changeParis.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    let { timer, start } = this.state;
    const {
      setUnConfirmOrderObj,
      setCancelOrderObj,
      unConfirmOrderList,
      cancelOrderList,
      account
    } = this.props;
    setUnConfirmOrderObj({}, 1);
    setCancelOrderObj({}, 1);

    this.getData(0);
    this.get2and8Data();
    clearInterval(timer);
    this.setState({
      timer: setInterval(() => {
        this.getData();
        this.get2and8Data();
      }, 3000)
    });

    let uAddr = account ? account.address : "";

    let confirmList = unConfirmOrderList
      ? unConfirmOrderList.filter(item => {
          return uAddr && item.user == uAddr;
        })
      : [];

    this.setState(
      {
        confirmList: confirmList
      },
      () => {
        this.setNewList();
      }
    );

    if (unConfirmOrderList && unConfirmOrderList.length > 0) {
      this.watchUnCOnfirmOrderList();
    }

    // if (cancelOrderList && cancelOrderList.length > 0) {
    this.watchCancelOrderIds();
    // }
  }

  componentDidUpdate(prevProps) {
    let { timer, start } = this.state;
    let {
      wallet,
      unConfirmOrderList,
      showCurrent,
      account,
      cancelOrderList
    } = this.props;
    // change wallet and see current pairs
    if (
      prevProps.account.address != account.address ||
      prevProps.showCurrent != showCurrent
    ) {
      clearInterval(timer);

      this.setState({
        isLoading: true
      });
      this.getData(0);
      this.get2and8Data();
      this.setState({
        timer: setInterval(() => {
          this.getData();
          this.get2and8Data();
        }, 3000),
        start: 0
      });
    }

    // unConfirmOrder
    if (prevProps.unConfirmOrderList != unConfirmOrderList) {
      this.filterData();
      this.watchUnCOnfirmOrderList();
      setTimeout(() => {
        this.watchUnCOnfirmOrderList();
      }, 60 * 1000);
    }
  }

  componentWillUnmount() {
    let { timer } = this.state;
    clearInterval(timer);
  }
  async componentWillMount() {
    const { setDelegateFailureObj } = this.props;
    await setDelegateFailureObj({}, 1);
  }

  render() {
    let { list, modal, isLoading, statusOp, total, limit } = this.state;
    let { intl, activeLanguage } = this.props;

    if (!list || list.length === 0) {
      return (
        <div className="p-3 text-center no-data">{tu("trc20_no_data")}</div>
      );
    }

    const columns = [
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_order_time" })
        ),
        dataIndex: "orderTime",
        key: "orderTime",
        width: "180px",
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
          intl.formatMessage({ id: "trc20_cur_order_header_order_type" })
        ),
        dataIndex: "orderType",
        key: "orderType",
        width: "60px",
        render: (text, record, index) => {
          return record.orderType == 0 ? (
            <span className="col-green">{tu("trc20_BUY")}</span>
          ) : (
            <span className="col-red">{tu("trc20_SELL")}</span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_price" })
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
          intl.formatMessage({ id: "trc20_cur_order_header_amount" })
        ),
        dataIndex: "volume",
        key: "volume",
        width: "160px",
        render: (text, record, index) => {
          return (
            <span>
              {Number(record.volume).toFixed(record.precisionAmount)}&nbsp;
              {record.fShortName}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_volume" })
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
          return (
            <span>
              {record.schedule ? (+record.schedule * 100).toFixed(2) : "0.00"}%
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
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_action" })
        ),
        dataIndex: "cancel",
        key: "cancel",
        width: "120px",
        render: (text, record, index) => {
          return (
            <span>
              <span
                onClick={() => this.cancelOrder(record, index)}
                className="cancel"
              >
                {record.orderStatus === 1
                  ? tu(`trc20_status_100`)
                  : statusOp[record.orderStatus]["operate"]
                  ? tu("trc20_cur_order_cancel")
                  : ""}
              </span>
              <span className="failed" onClick={() => this.ignore(record.hash)}>
                {record.orderStatus === 8 ? tu(`trc20_ignore`) : ""}
              </span>
            </span>
          );
        },
        align: "right"
      }
    ];
    return (
      <div className="exchange__tranlist">
        {modal}
        {isLoading ? (
          <TronLoader />
        ) : (
          <Table
            dataSource={list}
            columns={columns}
            pagination={{
              defaultPageSize: limit,
              total,
              onChange: this.onChangePage
            }}
            rowKey={(record, index) => {
              return `${index}`;
            }}
          />
        )}
      </div>
    );
  }

  onChangePage(page) {
    let { limit, timer, start } = this.state;
    this.getData((page - 1) * limit);
    this.setState({
      start: (page - 1) * limit
    });
  }
  async getData(startPage) {
    let start = startPage || this.state.start;
    let { limit } = this.state;
    let { account, showCurrent, exchangeData } = this.props;
    let uAddr = account ? account.address : "";
    if (!uAddr) {
      this.setState({
        isLoading: false
      });
      return;
    }

    let obj = { start, limit, uAddr, status: "-1,0,1", channelId: 10000 };
    if (showCurrent) {
      obj = Object.assign(obj, {
        fTokenAddr: exchangeData.fTokenAddr,
        sTokenAddr: exchangeData.sTokenAddr
      });
    }
    let { data, code } = await Client20.getCurrentList(obj);
    this.setState({
      isLoading: false
    });
    if (code === 0) {
      let list = [];
      let total = 0;
      if (data && data.rows && data.rows.length > 0) {
        list = data.rows;
        total = data.total;
      }
      list = list.sort(compare("orderTime"));
      this.filterData();
      this.setState({ initData: list, total });
    }
  }

  async get2and8Data() {
    let { start, limit } = this.state;
    let { account } = this.props;
    let uAddr = account ? account.address : "";

    if (!uAddr) {
      return;
    }

    Client20.getCurrentList({
      start: 0,
      limit: 100,
      uAddr: uAddr,
      status: "2,7,8",
      channelId: 10000
    }).then(res => {
      if (res.code === 0) {
        let list = [],
          total = 0;
        if (res.data && res.data.rows && res.data.rows.length > 0) {
          list = res.data.rows;
        }
        let contain28List = list.sort(compare("orderTime"));
        this.setState(
          {
            contain28List: contain28List
          },
          () => {
            this.setDeleteFail();
          }
        );
      }
    });
  }

  setDeleteFail() {
    let { contain28List } = this.state;
    let { setDelegateFailureObj, account } = this.props;
    let address = account ? account.address : "";
    let curTime = new Date().getTime();
    let delegateFailureList = contain28List.map(item => {
      if (
        curTime - item.orderTime < 7 * 24 * 60 * 60 * 1000 &&
        item.orderStatus === 8
      ) {
        return item.hash;
      }
    });
    let obj = {
      address: address,
      delegateFailureList: delegateFailureList
    };

    setDelegateFailureObj(obj);
  }

  cancelOrder(record, index) {
    let { intl } = this.props;
    let _this = this;
    confirm({
      title: intl.formatMessage({ id: "trc20_prompt" }),
      content: intl.formatMessage({ id: "trc20_cancel_order_confirm" }),
      okText: intl.formatMessage({ id: "trc20_confirm" }),
      cancelText: intl.formatMessage({ id: "trc20_cancel" }),
      className: "exchange-modal-content",
      onOk() {
        if (record.orderID) {
          _this.cancleOrderFun(record, index);
        }
      },
      onCancel() {}
    });
  }

  async cancleOrderFun(item, index) {
    let {
      app,
      setUpdateTran,
      walletType,
      account,
      setCancelOrderObj
    } = this.props;
    let tronWebOBJ;
    if (walletType.type === "ACCOUNT_LEDGER") {
      tronWebOBJ = this.props.tronWeb();
    } else if (
      walletType.type === "ACCOUNT_TRONLINK" ||
      walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWebOBJ = account.tronWeb;
    }

    try {
      const _id = await TW.cancelOrder(item.orderID, tronWebOBJ, item.pairType);
      if (_id) {
        this.setState({
          modal: (
            <SweetAlert
              success
              title={tu("trc20_order_success")}
              onConfirm={this.hideModal}
            >
              {/*{tu("trc20_order_success")}*/}
            </SweetAlert>
          )
        });

        setUpdateTran(true);
        item.oldStatus = item.orderStatus;
        item.created_by = new Date().getTime();
        item.orderStatus = 6;
        item.cancel_hash = _id;
        setCancelOrderObj(item);

        setTimeout(() => {
          this.watchCancelOrderIds();
        }, 60 * 1000);
      }
    } catch (err) {
      this.setState({
        modal: (
          <SweetAlert
            success
            title={tu("transaction_error")}
            onConfirm={this.hideModal}
          >
            {tu("trc20_cancel_order_fail")}
          </SweetAlert>
        )
      });
    }
  }

  hideModal = () => {
    this.setState({ modal: null });
  };

  numFormat(v) {
    return v
      .toString()
      .replace(/(^|\s)\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
  }

  filterData() {
    let { initData, contain28List } = this.state;
    let { unConfirmOrderList, deleteUnConfirmOrderObj } = this.props;

    //local and server order
    let contactList = initData.concat(contain28List);
    unConfirmOrderList.map((item, index) => {
      let isFind = false;
      contactList.map((subItem, subIndex) => {
        if (item.hash && subItem.hash && item.hash === subItem.hash) {
          deleteUnConfirmOrderObj(index);
          isFind = true;
        }
      });
    });

    this.filterCurrentPairs();
  }

  filterCurrentPairs() {
    let { unConfirmOrderList, showCurrent, account, exchangeData } = this.props;
    let uAddr = account ? account.address : "";

    //see current pairs
    let list = [...unConfirmOrderList];
    let confirmList = [];
    if (showCurrent) {
      let arr = list.filter(item => {
        let key =
          item.fShortName.toLowerCase() + "_" + item.sShortName.toLowerCase();
        let precisions_key = precisions[key] || 6;
        item.precisionPrice = precisions_key;
        item.precisionAmount = 6 - precisions_key < 0 ? 0 : 6 - precisions_key;
        return (
          item.fShortName &&
          item.fShortName === exchangeData.fShortName &&
          item.sShortName &&
          item.sShortName === exchangeData.sShortName &&
          item.user == uAddr
        );
      });
      confirmList = arr.sort(compare("orderTime"));
    } else {
      confirmList = list.filter(item => {
        let key =
          item.fShortName.toLowerCase() + "_" + item.sShortName.toLowerCase();
        let precisions_key = precisions[key] || 6;
        item.precisionPrice = precisions_key;
        item.precisionAmount = 6 - precisions_key < 0 ? 0 : 6 - precisions_key;
        return item.user == uAddr;
      });
    }

    this.setState(
      {
        confirmList: confirmList
      },
      () => {
        this.setNewList();
      }
    );
  }

  setNewList() {
    let { initData, confirmList, start } = this.state;
    let { cancelOrderList } = this.props;
    let list = [...initData];

    let filterList = list.filter(item => {
      //  canceling order
      cancelOrderList &&
        cancelOrderList.map(subItem => {
          if (item.orderID === subItem.orderID) {
            // this.$set(item, 'orderStatus', 6)
            item.orderStatus = 6;
          }
        });
      let key =
        item.fShortName.toLowerCase() + "_" + item.sShortName.toLowerCase();
      let precisions_key = precisions[key] || 6;
      item.precisionPrice = precisions_key;
      item.precisionAmount = 6 - precisions_key < 0 ? 0 : 6 - precisions_key;
      return item;
    });

    let arr = [];
    if (start == 0) {
      arr = confirmList.concat(filterList).sort(compare("orderTime"));
    } else {
      arr = filterList.sort(compare("orderTime"));
    }

    this.setState({
      list: arr
    });
  }

  watchUnCOnfirmOrderList() {
    let { unConfirmOrderList } = this.props;
    unConfirmOrderList.map((item, index) => {
      let current_time = new Date().getTime();
      if (
        item.orderStatus === -1 &&
        current_time - item.created_by > 1 * 60 * 1000
      ) {
        this.getOrderId(item.hash);
      }
    });
  }

  async getOrderId(id) {
    let _times = 0;
    let { walletType, account } = this.props;
    let tronWeb;
    if (walletType.type === "ACCOUNT_LEDGER") {
      tronWeb = this.props.tronWeb();
    } else if (
      walletType.type === "ACCOUNT_TRONLINK" ||
      walletType.type === "ACCOUNT_PRIVATE_KEY"
    ) {
      tronWeb = account.tronWeb;
    }
    const event = await tronWeb.getEventByTransactionID(id).catch(e => {
      // 委托失败
      this.currentFaile(id);
      console.log("Delegate failure--failed event server");
    });

    if (event.length > 0) {
      for (var i = 0; i < event.length; i++) {
        const k = event[i];
        if (k.name.indexOf("Order") > -1) {
          if (k.result && k.result.orderID) {
            let action_type = "entry";
            let order_id = k.result.orderID;
            let entry_txid = id;

            let obj = { action_type, order_id, entry_txid };

            console.log(
              "Delegate failure--Query from the server",
              entry_txid,
              order_id
            );
            Client20.abnormalOrderStatus(obj).then(res => {
              if (res.order_status !== 0) {
                this.currentFaile(id);
              }
            });
          }
          break;
        }
      }
    } else {
      console.log("Delegate failure--no result from event server");
      this.currentFaile(id);
      // 委托失败
    }
  }

  currentFaile(id) {
    let { unConfirmOrderList } = this.props;
    unConfirmOrderList.map(item => {
      if (item.hash === id) {
        item.orderStatus = 8;
      }
    });
    this.filterData();
  }

  watchCancelOrderIds() {
    let { cancelOrderList, deleteCancelOrderObj } = this.props;
    let cancelOrderListLocal = Lockr.get("cancelOrderList");
    cancelOrderListLocal &&
      cancelOrderListLocal.map((item, index) => {
        let current_time = new Date().getTime();
        if (
          item.orderStatus === 6 &&
          current_time - item.created_by > 1 * 60 * 1000
        ) {
          // todo Long-term unremoved order processing
          let action_type = "cancel";
          let entry_txid = item.hash;
          let order_id = item.orderID;
          let cancel_txid = item.cancel_hash;
          let obj = { action_type, entry_txid, cancel_txid, order_id };
          Client20.abnormalOrderStatus(obj)
            .then(res => {
              deleteCancelOrderObj(index);
            })
            .catch(err => {
              // this.clear_cancelOrderIds(index)
            });
        }
      });
  }
  ignore(hash) {
    let { unConfirmOrderList, deleteUnConfirmOrderObj } = this.props;
    let newIndex;
    unConfirmOrderList.map((item, index) => {
      if (item.hash === hash) {
        deleteUnConfirmOrderObj(index);
      }
    });

    this.filterCurrentPairs();
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
    app: state.app ? state.app : {},
    wallet: state.wallet ? state.wallet.isOpen : false,
    walletType: state.app.wallet,
    account: state.app.account,
    unConfirmOrderList: state.exchange.unConfirmOrderList,
    cancelOrderList: state.exchange.cancelOrderList,
    delegateFailureList: state.exchange.delegateFailureList,
    exchangeData: state.exchange.data
  };
}

const mapDispatchToProps = {
  setUpdateTran,
  setUnConfirmOrderObj,
  setDelegateFailureObj,
  deleteUnConfirmOrderObj,
  setCancelOrderObj,
  deleteCancelOrderObj,
  setRedirctPair
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Curorder)));
