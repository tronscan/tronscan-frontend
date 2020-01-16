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
class Tokens extends React.Component {
  constructor() {
    super();
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
          data: []
        },
        10: {
          title: "data_token_transcation_numbers",
          tableTitle: [
            "data_range",
            "data_token",
            "data_token_transcation_numbers",
            "data_token_circle_per"
          ],
          key: "amount",
          data: [],
          isUSD: true
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
    let data = [];
    data = await ApiClientData.getTop10Data({
      type: "7,8,9,10",
      time: 1
    });

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
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="mt-2 data-token">
          {Object.keys(types).map(index => (
            <Col
              className="gutter-row"
              xs={24}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              xxl={12}
            >
              <div className="data-items">
                <h2>
                  {tu("data_token_top")}-{tu(types[index].title)}
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

  renderDataTable(data, title, isUsd, type) {
    const defaultImg = require("../../../images/logo_default.png");

    const { trxUnit, usdUnit } = this.state;
    const { intl, priceUSD } = this.props;
    const titles = title;
    let arr = cloneDeep(data);

    let length = arr.length - 1;

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
        align: "center"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "name",
        render: (text, record, index) => {
          return (
            <span className="data-token-name">
              <Link to={`/token/${record.token}`}>
                <img src={defaultImg} className="data-token-logo mr-1" />
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
                  <FormattedNumber
                    value={
                      record.tokenPrice * record.priceInTrx * record.amount
                    }
                  ></FormattedNumber>
                  {trxUnit}
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
                <FormattedNumber value={record[type] || 0}></FormattedNumber>
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

export default Tokens;
