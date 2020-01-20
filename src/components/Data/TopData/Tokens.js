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
import { QuestionMark } from "../../common/QuestionMark";

@injectIntl
@connect(
  state => ({
    priceUSD: state.blockchain.usdPrice
  }),
  {
    loadUsdPrice
  }
)
class Tokens extends React.Component {
  constructor() {
    super();
    const txnUnit = "Txns";
    const trxUnit = "TRX";
    this.state = {
      trxUnit: "TRX",
      usdUnit: "USD",
      types: {
        7: {
          title: "data_token_holders",
          tableTitle: [
            "data_range",
            "data_token",
            "data_token_holder",
            "data_token_circle_per"
          ],
          key: "holders",
          data: [],
          isRealTime: true
        },
        8: {
          title: "data_token_transcation_accounts",
          tableTitle: [
            "data_range",
            "data_token",
            "data_token_transcation_account",
            "data_token_circle_per"
          ],
          key: "address_number",
          data: []
        },
        9: {
          title: "data_token_transcation_items_total",
          tableTitle: [
            "data_range",
            "data_token",
            "data_token_transcation_items",
            "data_token_circle_per"
          ],
          key: "transaction_number",
          data: [],
          unit: txnUnit
        },
        10: {
          title: "data_token_transcation_numbers",
          tableTitle: [
            "data_range",
            "data_token",
            "data_token_transcation_number",
            "data_token_circle_per"
          ],
          key: "amount",
          data: [],
          isUSD: true,
          unit: trxUnit
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
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="mt-2 data-token">
          {Object.keys(types).map(index => (
            <Col
              className="gutter-row"
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={12}
              xxl={12}
              key={`tokens-${index}`}
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

  renderDataTable(data, title, isUsd, type, index, unit) {
    const defaultImg = require("../../../images/logo_default.png");

    const { trxUnit, usdUnit } = this.state;
    const { intl, priceUSD } = this.props;
    const titles = title;
    let arr = cloneDeep(data);

    const columns = [
      {
        title: intl.formatMessage({ id: titles[0] }),
        dataIndex: "range",
        render: (text, record, index) => {
          return (
            <span className="rankWidth">
              {index < 3 ? (
                <span className={`rank-${index} rank`}></span>
              ) : (
                index + 1
              )}
            </span>
          );
        },
        align: "center",
        width: "80px"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "abbr",
        render: (text, record, index) => {
          return (
            <span className="data-token-name">
              <Link
                to={
                  record.type == 10
                    ? `/token/${record.token_id}`
                    : `/token20/${record.token_id}`
                }
              >
                <img
                  src={record.logo ? record.logo : defaultImg}
                  className="data-token-logo mr-1"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = defaultImg;
                  }}
                />
                {text}
              </Link>
            </span>
          );
        },
        align: "left"
      },
      {
        title: intl.formatMessage({ id: titles[2] }),
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span className="">
              {isUsd ? (
                <span>
                  <FormattedNumber value={record.priceInTrx}></FormattedNumber>{" "}
                  {unit}
                  <br />
                  <span className="usd-amount">
                    ≈
                    <FormattedNumber
                      value={record[type] * priceUSD || 0}
                    ></FormattedNumber>{" "}
                    {usdUnit}
                  </span>
                </span>
              ) : (
                <span>
                  <FormattedNumber value={record[type] || 0}></FormattedNumber>{" "}
                  {unit}
                </span>
              )}
            </span>
          );
        },
        align: "left"
      },
      {
        title: () => {
          let title = intl.formatMessage({ id: titles[3] });
          return (
            <span>
              {title}{" "}
              <QuestionMark
                text={"data_token_mark_" + index}
                className="ml-2"
              ></QuestionMark>
            </span>
          );
        },
        dataIndex: "percentage",
        render: (text, record, index) => {
          return text ? (
            <span className="percentageWidth">{(text * 100).toFixed(2)} %</span>
          ) : (
            "0 %"
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

export default Tokens;
