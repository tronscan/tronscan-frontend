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
import isMobile from "../../../utils/isMobile";


@injectIntl
@connect(
  state => ({
    priceUSD: state.blockchain.usdPrice
  }),
  {
    loadUsdPrice
  }
)
class Contracts extends React.Component {
  constructor() {
    super();
    this.state = {
      trxUnit: "TRX",
      usdUnit: "USD",
      tpUnit: "TP",
      txnUnit: "Txns",
      types: {
        11: {
          title: "data_contract_trx_number",
          tableTitle: [
            "data_range",
            "data_contract",
            "data_contract_name",
            "data_contract_numbers",
            "data_per"
          ],
          isUSD: true,
          key: "holders",
          data: [],
          isRealTime: true
        },
        12: {
          title: "data_contract_accounts",
          tableTitle: [
            "data_range",
            "data_contract",
            "data_contract_name",
            "data_contract_account",
            "data_per"
          ],
          isUSD: false,
          key: "active_address",
          data: []
        },
        13: {
          title: "data_contract_times",
          tableTitle: [
            "data_range",
            "data_contract",
            "data_contract_name",
            "data_contract_time",
            "data_per"
          ],
          isUSD: false,
          key: "triggers",
          data: []
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
    let lgSize = 12;
    let smSize = 24;
    const livetImg = require("../../../images/data/live.svg");

    return (
      <div className="top-data">
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="data-contract">
          {Object.keys(types).map(index => (
            <Col
              className="gutter-row"
              xs={24}
              sm={index == 11 ? smSize : lgSize}
              md={index == 11 ? smSize : lgSize}
              lg={index == 11 ? smSize : lgSize}
              xl={index == 11 ? smSize : lgSize}
              xxl={index == 11 ? smSize : lgSize}
              key={`contract-${index}`}
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
                  index
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

  renderDataTable(data, title, isUsd, type, index) {
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
        width: index == 11 ? (isMobile ? '10%' : '5%') : "10%"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "contract",
        render: (text, record, index) => {
          return text ? (
            <span className="contractWidth">
              <AddressLink address={text} isContract={true}>
                {text}
              </AddressLink>
            </span>
          ) : (
            <span className="contractWidth">--</span>
          );
        },
        align: "left",
        width: index == 11 ? (isMobile ? '30%' : '35%') : "30%"
      },
      {
        title: () => {
          let title2 = intl.formatMessage({ id: titles[2] });
          return (
            <span className={index != 11 ? "data-contract-title2" : ""}>
              {title2}
            </span>
          );
        },
        dataIndex: "name",
        render: (text, record, index) => {
          return text ? (
            <span className="">
              {record.contract == "TWjkoz18Y48SgWoxEeGG11ezCCzee8wo1A"
                ? "JustGame"
                : text}
            </span>
          ) : (
            <span>
              {record.contract == "TWjkoz18Y48SgWoxEeGG11ezCCzee8wo1A"
                ? "JustGame"
                : "--"}
            </span>
          );
        },
        align: "left",
        width: index == 11 ? "20%" : ""
      },
      {
        title: () => {
          let title3 = intl.formatMessage({ id: titles[3] });
          return (
            <span className={index != 11 ? "data-contract-title2" : ""}>
              {title3}
            </span>
          );
        },
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber
                value={record[type] || 0}
                maximumFractionDigits={isUsd ? 6 : 0}
              ></FormattedNumber>{" "}
              {isUsd && trxUnit}
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
        align: "left"
        // width: index == 11 ? "250px" : ""
      },
      {
        title: intl.formatMessage({ id: titles[4] }),
        dataIndex: "percentage",
        render: (text, record, index) => {
          return (
            <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
          );
        },
        align: "left"
        // width: index == 11 ? "" : "90px"
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

export default Contracts;
