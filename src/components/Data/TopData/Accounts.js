import React, { Fragment } from "react";
import ApiClientData from "../../../services/dataApi";
import { tu } from "../../../utils/i18n";
import { Row, Col, Table } from "antd";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { AddressLink } from "../../common/Links";
import { loadUsdPrice } from "../../../actions/blockchain";
import { FormattedNumber } from "react-intl";
import SmartTable from "../../common/SmartTable";
import { cloneDeep } from "lodash";
import { Link } from "react-router-dom";

@injectIntl
@connect(
  state => ({
    priceUSD: state.blockchain.usdPrice
  }),
  {
    loadUsdPrice
  }
)
class Accounts extends React.Component {
  constructor() {
    super();
    const tpUnit = "TP";
    const txnUnit = "Txns";
    this.state = {
      trxUnit: "TRX",
      usdUnit: "USD",
      tpUnit: "TP",
      txnUnit: "Txns",
      types: {
        1: {
          title: "data_account_send_Trx",
          tableTitle: ["data_range", "data_account", "data_number", "data_per"],
          isUSD: true,
          key: "amount",
          data: []
        },
        2: {
          title: "data_account_send_Trx_items",
          tableTitle: ["data_range", "data_account", "data_items", "data_per"],
          isUSD: false,
          unit: txnUnit,
          key: "transaction_number",
          data: []
        },
        3: {
          title: "data_account_receive_Trx",
          tableTitle: ["data_range", "data_account", "data_number", "data_per"],
          isUSD: true,
          key: "amount",
          data: []
        },
        4: {
          title: "data_account_receive_Trx_items",
          tableTitle: ["data_range", "data_account", "data_items", "data_per"],
          isUSD: false,
          unit: txnUnit,
          key: "transaction_number",
          data: []
        },
        5: {
          title: "data_account_freeze",
          tableTitle: ["data_range", "data_account", "data_number", "data_per"],
          isUSD: true,
          key: "freeze",
          data: [],
          isRealTime: true
        },
        6: {
          title: "data_account_vote",
          tableTitle: ["data_range", "data_account", "data_piao", "data_per"],
          isUSD: false,
          unit: tpUnit,
          key: "votes",
          data: [],
          isRealTime: true
        }
      }
    };
  }
  async componentDidMount() {
    this.getData();
    let { priceUSD } = this.props;
    !priceUSD && (await this.props.loadUsdPrice());
  }

  async getData() {
    let data = this.props.topData || [];
    let types = this.state.types;
    Object.keys(types).map(index => {
      data.map(subItem => {
        if (subItem.type == index) {
          types[index].data = subItem.data || [];
        }
      });
    });

    this.setState({
      types: types
    });
  }

  render() {
    let { types } = this.state;
    const livetImg = require("../../../images/data/live.svg");

    return (
      <div className="top-data">
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="data-account">
          {Object.keys(types).map(index => (
            <Col
              className="gutter-row"
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              xxl={12}
              key={`account-${index}`}
            >
              <div className="data-items">
                <h2>
                  {tu(types[index].title)}
                  {types[index].isRealTime && (
                    <img src={livetImg} className="data-real-time" />
                  )}
                </h2>
                {this.renderDataTable(
                  types[index].data,
                  types[index].tableTitle,
                  types[index].isUSD,
                  types[index].key,
                  index,
                  types[index].unit
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  setTotal(data, type) {
    let totalNumber = 0;
    let totalPercent = 0;
    let arr = cloneDeep(data);
    type = type || "amount";
    arr.map(item => {
      totalNumber += Number(item[type]);
      totalPercent += Number(item.percentage);
    });

    return { [type]: totalNumber, percentage: totalPercent, address: "" };
  }

  renderDataTable(data, title, isUsd, type, typeIndex, unit) {
    const { trxUnit, usdUnit } = this.state;
    const { intl, priceUSD } = this.props;
    const titles = title;
    let lastData = this.setTotal(data, type);
    let arr = cloneDeep(data) || [];
    arr.push(lastData);
    let length = arr.length - 1;

    const columns = [
      {
        title: intl.formatMessage({ id: titles[0] }),
        dataIndex: "range",
        render: (text, record, index) => {
          return (
            <span className="rankWidth">
              {index == length ? (
                intl.formatMessage({ id: "data_total" })
              ) : index < 3 ? (
                <span className={`rank-${index} rank`}></span>
              ) : (
                index + 1
              )}
            </span>
          );
        },
        align: "center",
        width: "10%"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "address",
        render: (text, record, index) => {
          return text ? (
            <span>
              {/* {record.addressTag ? (
                <Link to={`/address/${text}`}>{record.addressTag}</Link>
              ) : (
                <AddressLink address={text}>{text}</AddressLink>
              )} */}
              <span>
                {record.addressTag && (
                  <Link to={`/address/${text}`}>{record.addressTag}</Link>
                )}
                <AddressLink address={text}>{text}</AddressLink>
              </span>
            </span>
          ) : (
            <span className="">--</span>
          );
        },
        align: "left",
        width: typeIndex % 2 == 1 && "35%"
      },
      {
        title: intl.formatMessage({ id: titles[2] }),
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber
                value={record[type] || 0}
                maximumFractionDigits={isUsd ? 6 : 0}
              ></FormattedNumber>{" "}
              {isUsd && trxUnit}
              {unit}
              <br />
              {isUsd && (
                <span className="usd-amount">
                  ≈
                  <FormattedNumber
                    value={record[type] * priceUSD || 0}
                    maximumFractionDigits={3}
                  ></FormattedNumber>{" "}
                  {usdUnit}
                </span>
              )}
            </span>
          );
        },
        align: "left",
        width:
          typeIndex == 6
            ? "150px"
            : (typeIndex == 2 || typeIndex == 4) && "100px"
      },
      {
        title: intl.formatMessage({ id: titles[3] }),
        dataIndex: "percentage",
        render: (text, record, index) => {
          return (
            <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
          );
        },
        align: "left",
        width: "15%"
      }
    ];

    return (
      <SmartTable
        bordered={false}
        loading={false}
        column={columns}
        data={arr}
        pagination={false}
        isPaddingTop={false}
      />
    );
  }
}

export default Accounts;
