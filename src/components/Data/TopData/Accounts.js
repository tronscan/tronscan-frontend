import React, { Fragment } from "react";
import ApiClientData from "../../../services/dataApi";
import { tu } from "../../../utils/i18n";
import { Row, Col, Table } from "antd";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { AddressLink } from "../../common/Links";
import { loadUsdPrice } from "../../../actions/blockchain";
import { FormattedNumber } from "react-intl";

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
        <div className="d-flex">
          {this.renderSendTrxNumberData()}
          {this.renderSendTrxNumberData()}
        </div>
        <Row gutter={{ xs: 8, sm: 20, md: 20 }}>
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

              {/* <div className="data-list">
                <div className="data-header d-flex">
                  <span>{tu("data_range")}</span>
                  <span>{tu("data_account")}</span>
                  <span>{tu("data_number")}</span>
                  <span>{tu("data_per")}</span>
                </div>
                <div className="data-content">
                  {sendTrxNumbers.map((item, index) => (
                    <div className="data-content-li d-flex">
                      <span>{index + 1}</span>
                      <div>{item.address}</div>
                      <div>{item.amount}</div>
                      <div>{item.percentage}</div>
                    </div>
                  ))}
                </div>
              </div> */}
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
    const columns = [
      {
        title: intl.formatMessage({ id: titles[0] }),
        dataIndex: "range",
        render: (text, record, index) => {
          return index;
        },
        className: "ant_table"
      },
      {
        title: intl.formatMessage({ id: titles[1] }),
        dataIndex: "address",
        render: (text, record, index) => {
          return (
            <AddressLink address={text} truncate={false}>
              {text}
            </AddressLink>
          );
        },
        className: "ant_table width30"
      },
      {
        title: intl.formatMessage({ id: titles[2] }),
        dataIndex: "amount",
        render: (text, record, index) => {
          return (
            <span>
              <FormattedNumber value={parseInt(text || 0)}></FormattedNumber>{" "}
              {trxUnit}
              <br />≈
              <FormattedNumber
                value={parseInt(text * priceUSD || 0)}
              ></FormattedNumber>{" "}
              {usdUnit}
            </span>
          );
        },
        className: "ant_table"
      },
      {
        title: intl.formatMessage({ id: titles[3] }),
        dataIndex: "percentage",
        render: (text, record, index) => {
          return (text * 100).toFixed(2) + " %";
        },
        className: "ant_table"
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={sendTrxNumbers}
        // footer={() => <div>111111</div>}
        pagination={false}
      />
    );
  }
}

export default Accounts;
