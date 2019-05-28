import React, { Component } from "react";
import { Table } from "antd";
import { AddressLink, TransactionHashLink } from "../../../../common/Links";
import { FormattedDate, FormattedTime, injectIntl } from "react-intl";
import { TRXPrice } from "../../../../common/Price";
import { ONE_TRX } from "../../../../../constants";
import { Truncate } from "../../../../common/text";
import { tu, tv } from "../../../../../utils/i18n";
import { Client } from "../../../../../services/api";
import { Client20 } from "../../../../../services/api";
import { connect } from "react-redux";
import { upperFirst } from "lodash";
import { dateFormat } from "../../../../../utils/DateTime";
import { setLastprice } from "../../../../../actions/exchange";
import { TronLoader } from "../../../../common/loaders";
import moment from "moment";
class TranList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      timer: null,
      isLoading: true
      //time: null
    };
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    let { selectData } = this.props;
    let { timer } = this.state;
    this.getData();
    this.getColumns();
    clearInterval(timer);
    this.setState({
      timer: setInterval(() => {
        this.getData();
      }, 10000)
    });
  }

  componentDidUpdate(prevProps) {
    const { selectData } = this.props;
    const { timer } = this.state;
    if (prevProps.selectData.exchange_id != selectData.exchange_id) {
      this.setState({
        isLoading: true
      });
      this.getData();
      clearInterval(timer);
      this.setState({
        timer: setInterval(() => {
          this.getData();
        }, 10000)
      });
    }
  }

  componentWillUnmount() {
    const { timer } = this.state;
    clearInterval(timer);
  }

  getData = async () => {
    const { selectData, setLastprice } = this.props;
    if (selectData.exchange_id) {
      const { code, data } = await Client20.getTransactionList({
        limit: 40,
        start: 0,
        pairID: selectData.exchange_id
      });
      this.setState({
        isLoading: false
      });
      if (code === 0 && data) {
        this.setState({ dataSource: data.rows });
        let row0 = data.rows ? data.rows[0] : { price: 0, type: 0 };
        if (row0) {
          let obj = {
            value: row0.price,
            type: row0.order_type
          };
          setLastprice(obj);
        }
      }
    }
  };

  getColumns() {
    let { dataSource, isLoading } = this.state;
    let { intl, selectData } = this.props;
    let first_token = selectData.fShortName
      ? "(" + selectData.fShortName + ")"
      : "";
    let second_token = selectData.sShortName
      ? "(" + selectData.sShortName + ")"
      : "";
    const columns = [
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_trans_record_header_time" })
        ),
        dataIndex: "orderTime",
        key: "orderTime",
        render: (text, record, index) => {
          return (
            <span>
              {/* <FormattedDate value={Number(record.orderTime)}/> &nbsp; */}
              {/* <FormattedTime 
            value={Number(record.orderTime)} 
            hour='numeric'
            minute="numeric"
            second='numeric'
            hour12={false}/>&nbsp; */}

              {moment(Number(text)).format("HH:mm:ss")}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_trans_record_header_price" }) +
            second_token
        ),
        dataIndex: "price",
        key: "price",
        align: "right",
        render: (text, record, index) => {
          return (
            <span
              className={[record.order_type === 1 ? "col-red" : "col-green"]}
            >
              {record.price.toFixed(selectData.sPrecision)}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({ id: "trc20_trans_record_header_amount" }) +
            first_token
        ),
        dataIndex: "volume",
        key: "volume",
        align: "right",
        render: (text, record, index) => {
          return (
            record.volume.toFixed(selectData.fPrecision) + " " + record.unit
          );
        }
      }
    ];

    return (
      <div>
        {isLoading ? (
          <TronLoader />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey={(record, index) => {
              return index;
            }}
            locale={{ emptyText: tu("no_transactions") }}
            scroll={{ y: 741 }}
          />
        )}
      </div>
    );
  }

  render() {
    let { dataSource, columns } = this.state;
    // if (!dataSource || dataSource.length === 0) {
    //   return (
    //     <div className="exchange-tranlist">
    //       <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
    //     </div>
    //   );
    // }
    return <div className="exchange-tranlist">{this.getColumns()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  setLastprice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TranList));
