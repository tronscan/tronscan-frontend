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
import xhr from "axios/index";
import { API_URL } from "../../../constants";

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
      UsdToTrx: 0,
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
          key: "priceInTrx",
          data: [],
          isUSD: true,
          unit: trxUnit
        }
      }
    };
  }
  async componentDidMount() {
    this.getUsdtPrice();
    this.getData();
    let { priceUSD } = this.props;
    !priceUSD && (await this.props.loadUsdPrice());
  }

  getUsdtPrice() {
    xhr
      .get(
        API_URL +
          "/api/token_trc20?contract=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t&showAll=1"
      )
      .then(res => {
        let trc20_tokens = res.data.trc20_tokens || [];
        let UsdToTrx =
          trc20_tokens && trc20_tokens[0] && trc20_tokens[0].market_info
            ? trc20_tokens[0].market_info.priceInTrx
            : 0;
        this.setState({
          UsdToTrx
        });
      });
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
    let { intl } = this.props;
    let { types } = this.state;
    const livetImg = require("../../../images/data/live.svg");

    return (
      <div className="top-data">
        
        <div
          className="data-area mb-3"
          dangerouslySetInnerHTML={{
            __html: intl.formatMessage({ id: "data_area" })
          }}
        />
     
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="data-token">
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

  renderDataTable(data, title, isUsd, type, typeIndex, unit) {
    const defaultImg = require("../../../images/logo_default.png");

    const { trxUnit, usdUnit, UsdToTrx } = this.state;
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
        width: "15%"
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
        align: "left",
        width: typeIndex != 10 && "30%"
      },
      {
        title: intl.formatMessage({ id: titles[2] }),
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span className="">
              {isUsd ? (
                <span>
                  {record.token_id == "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" ? (
                    <span>
                      <FormattedNumber
                        value={record.priceInTrx / UsdToTrx}
                        maximumFractionDigits={6}
                      ></FormattedNumber>{" "}
                      USDT
                    </span>
                  ) : (
                    <span>
                      <FormattedNumber
                        value={record.priceInTrx}
                        maximumFractionDigits={6}
                      ></FormattedNumber>{" "}
                      {unit}
                    </span>
                  )}
                  <br />
                  <span className="usd-amount">
                    ≈
                    <FormattedNumber
                      value={record[type] * priceUSD || 0}
                      maximumFractionDigits={3}
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
        align: "left",
        width: typeIndex != 10 && "30%"
      },
      {
        title: () => {
          let title = intl.formatMessage({ id: titles[3] });
          return (
            <span>
              {title}{" "}
              <QuestionMark
                text={"data_token_mark_" + typeIndex}
                className="ml-2"
              ></QuestionMark>
            </span>
          );
        },
        dataIndex: "percentage",
        render: (text, record, index) => {
          return text ? (
            <span className="percentageWidth">
              <FormattedNumber
                value={text * 100}
                maximumFractionDigits={3}
              ></FormattedNumber>{" "}
              %
            </span>
          ) : (
            "0 %"
          );
        },
        align: "left"
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
