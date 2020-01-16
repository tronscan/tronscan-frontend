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
class Accounts extends React.Component {
  constructor() {
    super();
    this.state = {
      trxUnit: "TRX",
      usdUnit: "USD",
      sendTrxNumbers: [],
      sendTrxItems: [],
      receiveTrxNumbers: [],
      receiveTrxItems: [],
      freezeTrxNumbers: [],
      voteTrxNumbers: []
    };
  }
  async componentDidMount() {
    this.getData();
    let { priceUSD } = this.props;
    !priceUSD && (await this.props.loadUsdPrice());
  }

  async getData() {
    let sendTrxNumbers = await ApiClientData.getTop10Data({ type: 1, time: 1 });
    let sendTrxItems = await ApiClientData.getTop10Data({ type: 2, time: 1 });
    let receiveTrxNumbers = await ApiClientData.getTop10Data({
      type: 3,
      time: 1
    });
    let voteTrxNumbers = await ApiClientData.getTop10Data({ type: 4, time: 1 });
    this.setState({
      sendTrxNumbers,
      sendTrxItems,
      receiveTrxNumbers,
      voteTrxNumbers
    });
  }

  render() {
    let {
      sendTrxNumbers,
      sendTrxItems,
      receiveTrxNumbers,
      voteTrxNumbers
    } = this.state;
    return (
      <div className="top-data">
        <Row gutter={{ xs: 8, sm: 20, md: 20 }} className="mt-2">
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
                {tu("data_account_top")}-{tu("data_account_send_Trx")}
              </h2>
              {this.renderSendTrxNumberData()}
            </div>
          </Col>
          <Col
            className="gutter-row"
            xs={24}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            xxl={12}
          >
            <div className="gutter-box">col-6</div>
          </Col>
        </Row>
      </div>
    );
  }

  renderSendTrxNumberData() {
    const { sendTrxNumbers, trxUnit, usdUnit } = this.state;
    const { intl, priceUSD } = this.props;
    const titles = ["data_range", "data_account", "data_number", "data_per"];
    let lastData = this.setTotal(sendTrxNumbers);
    let arr = cloneDeep(sendTrxNumbers);
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
        dataIndex: "address",
        render: (text, record, index) => {
          return text ? (
            <span className="addressWidth">
              <span className="">
                <AddressLink address={text}>{text}</AddressLink>
              </span>
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
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              {trxUnit}
              <br />
              <span className="usd-amount">
                ≈
                <FormattedNumber
                  value={parseInt(text * priceUSD || 0)}
                ></FormattedNumber>{" "}
                {usdUnit}
              </span>
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

  setTotal(data) {
    let totalNumber = 0;
    let totalPercent = 0;
    let arr = cloneDeep(data);
    arr.map(item => {
      totalNumber += Number(item.amount);
      totalPercent += Number(item.percentage);
    });

    return { amount: totalNumber, percentage: totalPercent, address: "" };
  }
}

export default Accounts;
