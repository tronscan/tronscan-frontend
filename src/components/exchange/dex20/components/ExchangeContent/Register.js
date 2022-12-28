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
import Column from "antd/lib/table/Column";

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
      limit: 14,
      buyMax: 0,
      sellMax: 0
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
    let { sellList, buyList, isLoading, limit, buyMax, sellMax } = this.state;
    let {
      intl,
      pairs,
      lastPrice,
      setQuickSelect,
      price,
      activeCurrency
    } = this.props;

    /*
     * 根据当前选择货币换算单位
     */
    // let price_convert = 0
    // if(price && price[pairs.sShortName == 'TRX' ? 'trxToOther' : 'usdtToOther']){
    //   price_convert =(price[pairs.sShortName == 'TRX' ? 'trxToOther' : 'usdtToOther'][activeCurrency && activeCurrency.toLocaleLowerCase()] * pairs.price).toFixed(activeCurrency == 'trx' ? 6 : 8)
    // }

    let price_convert = 0;
    if (
      price &&
      price[pairs.sShortName == "TRX" ? "trxToOther" : "usdtToOther"]
    ) {
      price_convert = (
        price[pairs.sShortName == "TRX" ? "trxToOther" : "usdtToOther"]["usd"] *
        pairs.price
      ).toFixed(8);
    }

    let first_token = pairs.fShortName ? "(" + pairs.fShortName + ")" : "";
    let second_token = pairs.sShortName ? "(" + pairs.sShortName + ")" : "";

    let trc20_price = intl.formatMessage({ id: "trc20_price" }) + second_token;
    let trc20_amount = intl.formatMessage({ id: "trc20_amount" }) + first_token;
    let trc20_accumulative =
      intl.formatMessage({ id: "trc20_accumulative" }) + second_token;

    const sell_columns = [
      // {
      //   title: "",
      //   key: "sell",
      //   render: (text, record, index) => {
      //     return (
      //       <div className="col-red">
      //         {intl.formatMessage({ id: "trc20_sell" })}
      //         {sellList.length < 8 ? sellList.length - index : limit - index}
      //       </div>
      //     );
      //   }
      // },
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
          return <span>{text && Number(text)}</span>;
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
      // {
      //   title: "",
      //   key: "buy",
      //   render: (text, record, index) => {
      //     return (
      //       <div className="col-green">
      //         {intl.formatMessage({ id: "trc20_buy" })}
      //         {index + 1}
      //       </div>
      //     );
      //   }
      // },
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
          return <span>{text && Number(text)}</span>;
        }
      },
      {
        title: "",
        dataIndex: "cje",
        key: "cje",
        align: "right"
      }
    ];

    const maxAmount = Math.max(buyMax, sellMax);
    return (
      <div className="ant-table-content register">
        {isLoading ? (
          <TronLoader />
        ) : (
          <Fragment>
            {/* <Table
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
            /> */}
            <div className="register-list-header">
              <span>{trc20_price}</span>
              <span>{trc20_amount}</span>
              <span>{trc20_accumulative}</span>
            </div>
            <RegisterList
              data={sellList}
              type="sell"
              max={maxAmount}
              setQuickSelect={setQuickSelect}
            />
            <div className="new_price">
              {/* {tu('trc20_new_price')}:  */}
              {lastPrice.type === 0 ? (
                <span>
                  <span className="col-green up">
                    {lastPrice.value &&
                      lastPrice.value.toFixed(pairs.sPrecision)}
                    <Icon type="arrow-up" />
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#666666",
                      marginLeft: "7px"
                    }}
                  >
                    ≈ {price_convert} USD
                    {/* {activeCurrency.toLocaleUpperCase()} */}
                  </span>
                </span>
              ) : (
                <span>
                  <span className="col-red down">
                    {lastPrice.value &&
                      lastPrice.value.toFixed(pairs.sPrecision)}
                    <Icon type="arrow-down" />
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#666666",
                      marginLeft: "7px"
                    }}
                  >
                    ≈ {price_convert} USD
                    {/* {activeCurrency.toLocaleUpperCase()} */}
                  </span>
                </span>
              )}
            </div>
            <RegisterList
              data={buyList}
              type="buy"
              max={maxAmount}
              setQuickSelect={setQuickSelect}
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
    let list = data || [];
    let { limit } = this.state;

    let { pairs } = this.props;
    let sPrecision = pairs.sPrecision ? pairs.sPrecision : 6;
    let amPrecision = pairs.fix_precision
      ? pairs.fix_precision < 3
        ? 4
        : 2
      : 2;
    let amount_list = [];
    let listN = [];
    let arr = [];

    list.length > limit && (list.length = limit);

    list.map(v => {
      let cje = v.Amount * v.Price;
      listN.push({
        price: (+v.Price).toFixed(sPrecision),
        amount: Number(v.Amount).toFixed(amPrecision),
        cje: Number(cje).toFixed(sPrecision)
      });
      amount_list.push(v.Amount);
    });
    const _max = Math.max.apply(null, amount_list);
    if (type === 1) {
      // this.buyMax = _max
      this.setState({
        buyMax: _max
      });
    } else {
      this.setState({
        sellMax: _max
      });
      // this.sellMax = _max
    }

    return {
      listN
    };
  }

  async getList(data, type) {
    let { limit } = this.state;
    let { pairs } = this.props;
    let sPrecision = pairs.sPrecision ? pairs.sPrecision : 6;

    let obj1 = {};
    let obj2 = {};
    let listN = [];
    let arr = [];
    if (data) {
      data = data.reduce((cur, next) => {
        obj2[next.OrderID] ? "" : (obj2[next.OrderID] = true && cur.push(next));
        return cur;
      }, []);
      data.map(v => {
        if (obj1[v.Price]) {
          obj1[v.Price]["amount"] += v.amount;
          obj1[v.Price]["curTurnover"] += v.curTurnover;
        } else {
          obj1[v.Price] = {
            amount: v.amount,
            curTurnover: v.curTurnover
          };
        }
      });
      let list = Object.keys(obj1)
        .map(v => +v)
        .sort((a, b) => {
          return type ? b - a : a - b;
        });

      list.length > limit && (list.length = limit);
      let amount_list = [];
      let amountSum = 0;
      list.map((v, index) => {
        let amount = obj1[v].amount;
        let curTurnover = obj1[v].curTurnover;
        let cje = amount * v;
        let key = index;
        listN.push({
          key: key + 1,
          price: (+v).toFixed(sPrecision),
          amount: amount.toFixed(2),
          curTurnover: curTurnover,
          cje: cje.toFixed(sPrecision)
        });
        amount_list.push(amount);
        amountSum += amount;
        //数据拼接成深度图所需数据[[价格，数量]，[价格，数量]]
        let item = [
          parseFloat((+v).toFixed(sPrecision)),
          // parseFloat(amount.toFixed(2))
          amountSum
        ];
        arr.push(item);
      });

      const _max = Math.max.apply(null, amount_list);
      if (type === 1) {
        // this.buyMax = _max
        this.setState({
          buyMax: _max
        });
      } else {
        this.setState({
          sellMax: _max
        });
        // this.sellMax = _max
      }
    }

    return {
      listN,
      arr: type === 1 ? arr.reverse() : arr
      // tokenId: data[0].ExchangeID
    };
  }

  setActiveClass = (record, index) => {
    return record.exchange_id === this.state.activeIndex
      ? "exchange-table-row-active"
      : "";
  };
}

class RegisterList extends Component {
  constructor() {
    super();
    this.handlePriceObj = this.handlePriceObj.bind(this);
  }
  handlePriceObj(v, type, column) {
    let amount = "";
    if (column == 2) {
      amount = v.amount;
    }
    let obj = {
      b: {
        price: Number(v.price),
        amount: amount
      },
      type: type
    };
    this.props.setQuickSelect(obj);
  }
  render() {
    let { data, type, setQuickSelect, max } = this.props;
    return (
      <div className={`register-list ${type}`}>
        {data.map(v => {
          return (
            <div className="list-item" key={v.price}>
              <div className="item-detail">
                <span
                  className={type}
                  onClick={() =>
                    this.handlePriceObj(v, type == "sell" ? "buy" : "sell", 1)
                  }
                >
                  {v.price}
                </span>
                <span
                  onClick={() =>
                    this.handlePriceObj(v, type == "sell" ? "buy" : "sell", 2)
                  }
                >
                  {v.amount}
                </span>
                <span>{v.cje}</span>
              </div>
              <div
                className={`item-pre ${type}`}
                style={{ width: (v.amount / max) * 100 + "%" }}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    pairs: state.exchange.data,
    lastPrice: state.exchange.last_price ? state.exchange.last_price : {},
    register: state.exchange.register,
    price: state.exchange.price,
    activeCurrency: state.app.activeCurrency
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
