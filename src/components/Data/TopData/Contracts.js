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
      types: {
        11: {
          title: "data_contract_trx_number",
          tableTitle: [
            "data_range",
            "data_contract",
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
    return (
      <div className="top-data">
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="mt-2 data-contract">
          {Object.keys(types).map(index => (
            <Col
              className="gutter-row"
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
              key={`contract-${index}`}
            >
              <div className="data-items">
                <h2>
                  {tu(types[index].title)}
                  {types[index].isRealTime && (
                    <span className="data-real-time">
                      {tu("data_real_time")}
                    </span>
                  )}
                </h2>
                {this.renderDataTable(
                  types[index].data,
                  types[index].tableTitle,
                  types[index].isUSD,
                  types[index].key
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

  renderDataTable(data, title, isUsd, type) {
    const { trxUnit, usdUnit } = this.state;
    const { intl, priceUSD } = this.props;
    const titles = title;
    let lastData = this.setTotal(data, type);
    let arr = cloneDeep(data);
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
        align: "center"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "contract",
        render: (text, record, index) => {
          return text ? (
            <span className="addressWidth">
              <AddressLink address={text} isContract={true}>
                {text}
              </AddressLink>
            </span>
          ) : (
            "--"
          );
        },
        align: "center"
      },
      {
        title: intl.formatMessage({ id: titles[2] }),
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span className="">
              <FormattedNumber value={record[type] || 0}></FormattedNumber>{" "}
              {isUsd && trxUnit}
              <br />
              {isUsd && (
                <span className="usd-amount">
                  ≈
                  <FormattedNumber
                    value={record[type] * priceUSD || 0}
                  ></FormattedNumber>{" "}
                  {usdUnit}
                </span>
              )}
            </span>
          );
        },
        align: "left"
      },
      {
        title: intl.formatMessage({ id: titles[3] }),
        dataIndex: "percentage",
        render: (text, record, index) => {
          return (
            <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
          );
        },
        align: "right"
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
