import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client20 } from "../../../../../services/api";
import { tu } from "../../../../../utils/i18n";
import { Table } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Icon } from "antd";
import { setQuickSelect, setRegister } from "../../../../../actions/exchange";
import { TronLoader } from "../../../../common/loaders";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      sellList: [],
      buyList: [],
      timer: null,
      activeIndex: 0,
      lastPrice: {
        value: "0.04998",
        type: 0
      },
      isLoading: true,
      limit: 8
    };
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

  componentDidUpdate(prevProps, nextProps) {
    let { timer } = this.state;
    let { pairs } = this.props;
    if (prevProps.pairs.id != pairs.id) {
      this.setState({
        isLoading: true,
        timer: null
      });
      this.getData();
      clearInterval(timer);
      this.setState({
        timer: setInterval(() => {
          this.getData();
        }, 3000)
      });

      setRegister({ buyList: [], sellList: [] });
    }
  }

  componentWillUnmount() {
    let { timer } = this.state;
    clearInterval(timer);
  }

  render() {
    let { sellList, buyList, isLoading, limit } = this.state;
    let { intl, pairs, lastPrice, setQuickSelect } = this.props;

    let first_token = pairs.fShortName ? "(" + pairs.fShortName + ")" : "";
    let second_token = pairs.sShortName ? "(" + pairs.sShortName + ")" : "";

    let trc20_price = intl.formatMessage({ id: "trc20_price" }) + second_token;
    let trc20_amount = intl.formatMessage({ id: "trc20_amount" }) + first_token;
    let trc20_accumulative =
      intl.formatMessage({ id: "trc20_accumulative" }) + second_token;

    const sell_columns = [
      {
        title: "",
        key: "sell",
        render: (text, record, index) => {
          return (
            <div className="col-red">
              {intl.formatMessage({ id: "trc20_sell" })}
              {sellList.length < 8 ? sellList.length - index : limit - index}
            </div>
          );
        }
      },
      {
        title: trc20_price,
        dataIndex: "price",
        key: "price"
      },
      {
        title: trc20_amount,
        dataIndex: "amount",
        key: "amount",
        align: "right",
        render: text => {
          return <span>{Number(text).toFixed(2)}</span>;
        }
      },
      {
        title: trc20_accumulative,
        dataIndex: "cje",
        key: "cje",
        align: "right"
      }
    ];

    const buy_columns = [
      {
        title: "",
        key: "buy",
        render: (text, record, index) => {
          return (
            <div className="col-green">
              {intl.formatMessage({ id: "trc20_buy" })}
              {index + 1}
            </div>
          );
        }
      },
      {
        title: "",
        dataIndex: "price",
        key: "price"
      },
      {
        title: "",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        render: text => {
          return <span>{Number(text).toFixed(2)}</span>;
        }
      },
      {
        title: "",
        dataIndex: "cje",
        key: "cje",
        align: "right"
      }
    ];

    return (
      <div className="ant-table-content register">
        {isLoading ? (
          <TronLoader />
        ) : (
          <Fragment>
            <Table
              dataSource={sellList}
              columns={sell_columns}
              pagination={false}
              rowKey={(record, index) => {
                return `sell_${index}`;
              }}
              rowClassName={this.setActiveClass}
              className="table_bottom buy"
              onRow={record => {
                return {
                  // 点击行
                  onClick: () => {
                    let obj = {
                      b: {
                        price: Number(record.price),
                        amount: parseInt(record.amount)
                      },
                      type: "buy"
                    };
                    setQuickSelect(obj);
                  }
                };
              }}
            />
            <div className="new_price">
              {/* {tu('trc20_new_price')}:  */}
              {lastPrice.type === 0 ? (
                <span className="col-green up">
                  {lastPrice.value}
                  <Icon type="arrow-up" />
                </span>
              ) : (
                <span className="col-red down">
                  {lastPrice.value}
                  <Icon type="arrow-down" />
                </span>
              )}
            </div>
            <Table
              dataSource={buyList}
              columns={buy_columns}
              pagination={false}
              rowKey={(record, index) => {
                return `buy_${index}`;
              }}
              rowClassName={this.setActiveClass}
              className="sell"
              onRow={record => {
                return {
                  // 点击行
                  onClick: () => {
                    let obj = {
                      b: {
                        price: Number(record.price),
                        amount: parseInt(record.amount)
                      },
                      type: "sell"
                    };
                    setQuickSelect(obj);
                  }
                };
              }}
            />
          </Fragment>
        )}
      </div>
    );
  }

  async getData() {
    let { pairs, setRegister } = this.props;
    let { buyList, sellList } = this.state;
    let exchangeId = pairs.id || "";

    if (!exchangeId) {
      return;
    }
    let { data, code } = await Client20.getRegisterList(exchangeId);
    this.setState({
      isLoading: false
    });

    let buyObj = this.getNewList(data ? data.buy : [], 1);
    let sellObj = this.getNewList(data ? data.sell : []);
    if (code === 0) {
      if (data) {
        this.setState(
          {
            buyList: buyObj.listN,
            sellList: sellObj.listN
          }
          // () => {
          // setRegister({
          //   buyList: buyObj.arr,
          //   sellList: sellObj.arr,
          //   tokenId: buyObj.tokenId
          // });
          // }
        );
      }
    }
  }
  getNewList(data, type) {
    let list = data

    let amount_list = []
    let listN = []
    
    list.length > this.limit && (list.length = this.limit)
    if(type == 1){
    }else{
      list = list.reverse();
    }
    
    list.map(v => {
      let cje = v.Amount * v.Price
      listN.push({
        price: (+v.Price).toFixed(this.pairs.sPrecision),
        amount: v.Amount.toFixed(2),
        cje: cje.toFixed(this.pairs.sPrecision)
      })
      amount_list.push(v.Amount)
    })
    const _max = Math.max.apply(null, amount_list)
    if (type === 1) {
      this.buyMax = _max
    } else {
      this.sellMax = _max
    }

    console.log(_max)

    return listN
  }


  setActiveClass = (record, index) => {
    return record.exchange_id === this.state.activeIndex
      ? "exchange-table-row-active"
      : "";
  };
}

function mapStateToProps(state) {
  return {
    pairs: state.exchange.data,
    lastPrice: state.exchange.last_price ? state.exchange.last_price : {},
    register: state.exchange.register
  };
}

const mapDispatchToProps = {
  setQuickSelect,
  setRegister
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Register)));
