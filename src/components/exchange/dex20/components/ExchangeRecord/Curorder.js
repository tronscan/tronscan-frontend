import React, {Component} from "react";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {Client20} from "../../../../../services/api";
import {tu} from "../../../../../utils/i18n";
import {Modal, Table} from "antd";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {upperFirst} from "lodash";
import SweetAlert from "react-bootstrap-sweetalert";
import {TW} from "../../TW";
import {setUpdateTran} from '../../../../../actions/exchange'
import {TronLoader} from "../../../../common/loaders";
import {withTronWeb} from "../../../../../utils/tronWeb";

const confirm = Modal.confirm;

@withTronWeb
class Curorder extends Component {
  constructor() {
    super();
    this.state = {
      start: 0,
      limit: 50,
      list: [],
      timer: null,
      modal: null,
      isLoading: true
    };

    this.cancelOrder = this.cancelOrder.bind(this);
  }

  componentDidMount() {
    let { timer } = this.state;
    this.getData();
    clearInterval(timer);
    this.setState({
      timer: setInterval(() => {
        this.getData();
      }, 3000)
    });
  }

  componentDidUpdate(prevProps) {
    let { timer } = this.state;
    let { wallet } = this.props;
    if (prevProps.wallet != wallet) {
      clearInterval(timer);

      this.setState({
        isLoading:true
      })
      this.getData();
      this.setState({
        timer: setInterval(() => {
          this.getData();
        }, 3000)
      });
    }
  }

  componentWillUnmount(){
    let { timer } = this.state;
    clearInterval(timer);
  }



  render() {
    let { list, modal,isLoading } = this.state;
    let { intl } = this.props;

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
        render: (text, record, index) => {
          return <span>
          <FormattedDate value={Number(record.orderTime)}/> &nbsp;
          <FormattedTime value={Number(record.orderTime)}/>&nbsp;
        </span>
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_order_type" })
        ),
        dataIndex: "quant",
        key: "quant",
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
        align: "center"
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_amount" })
        ),
        dataIndex: "volume",
        key: "volume",
        render: (text, record, index) => {
          return (
            <span>
              {record.volume}
              {record.fShortName}
            </span>
          );
        },
        align: "center"
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_volume" })
        ),
        dataIndex: "curTurnover",
        key: "curTurnover",
        render: (text, record, index) => {
          return (
            <span>
              {this.numFormat(record.curTurnover.toFixed(4))}
              {record.sShortName}
            </span>
          );
        },
        align: "center"
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_progress" })
        ),
        dataIndex: "schedule",
        key: "schedule",
        render: (text, record, index) => {
          return <span>{(+record.schedule * 100).toFixed(2)}%</span>;
        },
        align: "center"
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_cur_order_header_action" })
        ),
        dataIndex: "cancel",
        key: "cancel",
        render: (text, record, index) => {
          return (
            <span onClick={() => this.cancelOrder(record)} style={{color:'#409eff'}}>
              {tu("trc20_cur_order_cancel")}
            </span>
          );
        },
        align: "center"
      }
    ];
    return (
      <div className="exchange__tranlist">
        {modal}
        {isLoading ? <TronLoader/> :
          <Table
            dataSource={list}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => {
              return `${index}`;
            }}
          />
        }
      </div>
    );
  }

  async getData() {
    let { start, limit } = this.state;
    let { app } = this.props;
    let uAddr = app.account ? app.account.address : "";
    if (!uAddr) {
      return;
    }

    let obj = { start, limit, uAddr, status: "0" };
    let { data, code } = await Client20.getCurrentList(obj);
    this.setState({
      isLoading:false
    })
    if (code === 0) {
      let list = [];
      if (data && data.rows && data.rows.length > 0) {
        list = data.rows;
      }

      this.setState({ list });
    }
  }

  cancelOrder(record) {
    let { intl } = this.props;
    let _this = this;
    confirm({
      title: intl.formatMessage({ id: "trc20_prompt" }),
      content: intl.formatMessage({ id: "trc20_cancel_order_confirm" }),
      okText: intl.formatMessage({ id: "trc20_confirm" }),
      cancelText: intl.formatMessage({ id: "trc20_cancel" }),
      onOk() {
        if (record.orderID) {
          _this.cancleOrderFun(record);
        }
      },
      onCancel() {}
    });
  }

  async cancleOrderFun(item) {
    let { app, setUpdateTran, walletType, account } = this.props;
      let tronWebOBJ
      if (walletType.type === "ACCOUNT_LEDGER"){
          tronWebOBJ = this.props.tronWeb();
      }else if(walletType.type === "ACCOUNT_TRONLINK" || walletType.type === "ACCOUNT_PRIVATE_KEY"){
          tronWebOBJ = account.tronWeb;
      }

    try {
      const _id = await TW.cancelOrder(item.orderID, tronWebOBJ);
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

        setUpdateTran(true)

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
}

function mapStateToProps(state) {
  return {
    app: state.app ? state.app : {},
    wallet: state.wallet ? state.wallet.isOpen : false,
    walletType: state.app.wallet,
    account: state.app.account,
  };
}

const mapDispatchToProps = {
  setUpdateTran
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Curorder)));
