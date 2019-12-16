import React, { Fragment } from "react";
import { Client } from "../../../services/api";
import {
  AddressLink,
  TransactionHashLink,
  TokenTRC20Link
} from "../../common/Links";
import { TRXPrice } from "../../common/Price";
import { API_URL, ONE_TRX } from "../../../constants";
import { tu, t } from "../../../utils/i18n";
// import TimeAgo from "react-timeago";
import moment from "moment";
import { Truncate } from "../../common/text";
import { withTimers } from "../../../utils/timing";
import { FormattedNumber, injectIntl } from "react-intl";
import SmartTable from "../../common/SmartTable";
import { upperFirst } from "lodash";
import { TronLoader } from "../../common/loaders";
import TotalInfo from "../components/TableTotal";
import DateSelect from "../components/dateSelect";
import xhr from "axios/index";
import { FormatNumberByDecimals } from "../../../utils/number";
import qs from "qs";
import BlockTime from "../../common/blockTime";

class Transfers extends React.Component {
  constructor(props) {
    super(props);

    this.start = moment([2018, 5, 25])
      .startOf("day")
      .valueOf();
    this.end = moment().valueOf();
    this.state = {
      filter: {},
      transfers: [],
      page: 1,
      total: 0,
      pageSize: 20,
      showTotal: props.showTotal !== false,
      emptyState: props.emptyState,
      autoRefresh: props.autoRefresh || false
    };
  }

  componentDidMount() {
    // this.loadPage();

    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };

  loadPage = async (page = 1, pageSize = 20) => {
    let { filter, getCsvUrl } = this.props;
    let { showTotal } = this.state;
    const params = {
      contract_address: filter.token,
      start_timestamp: this.start,
      end_timestamp: this.end
    };
    this.setState({
      loading: true,
      page: page,
      pageSize: pageSize
    });
    const query = qs.stringify({
      format: "csv",
      ...params
    });
    getCsvUrl(`${API_URL}/api/token_trc20/transfers?${query}`);

    const allData = await Promise.all([
      Client.getTokenTRC20Transfers({
        limit: pageSize,
        start: (page - 1) * pageSize,
        ...params
      }),
      Client.getCountByType({
        type: "trc20",
        contract: filter.token
      })
    ]).catch(e => {
      console.log("error:" + e);
    });

    const [{ list, rangeTotal }, { count }] = allData;
    let transfers = list || [];
    // let {transfers, total} = await Client.getTransfers({
    //   sort: '-timestamp',
    //   limit: pageSize,
    //   start: (page - 1) * pageSize,
    //   count: showTotal ? true : null,
    //   ...filter,
    // });

    for (let index in transfers) {
      transfers[index].index = parseInt(index) + 1;
    }

    this.setState({
      page,
      transfers,
      total: count,
      rangeTotal,
      loading: false
    });
  };

  customizedColumn = () => {
    let { intl, token } = this.props;
    let column = [
      {
        title: upperFirst(
          intl.formatMessage({
            id: "hash"
          })
        ),
        dataIndex: "transactionHash",
        key: "transactionHash",
        className: "ant_table",
        align: "center",
        width: "200px",
        render: (text, record, index) => {
          return (
            <Truncate>
              <TransactionHashLink hash={record.transaction_id}>
                {record.transaction_id}{" "}
              </TransactionHashLink>{" "}
            </Truncate>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "blocks"
          })
        ),
        dataIndex: "block",
        key: "block",
        className: "ant_table",
        width: "100px"
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "age"
          })
        ),
        dataIndex: "timestamp",
        key: "timestamp",
        width: "150px",
        className: "ant_table",
        render: (text, record, index) => {
          return <BlockTime time={Number(record.block_ts)}> </BlockTime>;
          // <TimeAgo date={Number(record.block_ts)} title={moment(record.block_ts).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "from"
          })
        ),
        dataIndex: "transferFromAddress",
        key: "transferFromAddress",
        className: "ant_table",
        width: "160px",
        render: (text, record, index) => {
          return (
            <AddressLink address={record.from_address}>
              {" "}
              {record.from_address}{" "}
            </AddressLink>
          );
        }
      },
      {
        title: "",
        className: "ant_table",
        width: "30px",
        render: (text, record, index) => {
          return <img src={require("../../../images/arrow.png")} />;
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "to"
          })
        ),
        dataIndex: "transferToAddress",
        key: "transferToAddress",
        className: "ant_table",
        align: "center",
        width: "160px",
        render: (text, record, index) => {
          return (
            <AddressLink address={record.to_address}>
              {" "}
              {record.to_address}{" "}
            </AddressLink>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "FinalResult"
          })
        ),
        dataIndex: "contractRet",
        key: "contractRet",
        className: "ant_table",
        filterMultiple: false,
        filters: [
          {
            text: "SUCCESS",
            value: "SUCCESS"
          },
          {
            text: "FAIL",
            value: "FAIL"
          },
          {
            text: "CONFIRMING",
            value: "CONFIRMING"
          }
        ],
        onFilter: (value, record) => {
          console.log(value, record);
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "amount"
          })
        ),
        dataIndex: "amount",
        key: "amount",
        align: "center",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <span>
              <span>
                {" "}
                {FormatNumberByDecimals(record.quant, token.decimals)}{" "}
              </span>{" "}
            </span>
          );
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "tokens"
          })
        ),
        dataIndex: "tokens",
        key: "tokens",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <span>
              <TokenTRC20Link
                name={token.symbol}
                address={token.contract_address}
              />{" "}
            </span>
          );
        }
      }
    ];

    return column;
  };

  onDateOk(start, end) {
    this.start = start.valueOf();
    this.end = end.valueOf();
    let { page, pageSize } = this.state;
    this.setState(
      {
        page: 1
      },
      () => {
        this.loadPage(1, pageSize);
      }
    );
  }

  render() {
    let {
      transfers,
      page,
      total,
      rangeTotal,
      pageSize,
      loading,
      emptyState: EmptyState = null
    } = this.state;
    if (total == 0) {
      transfers = [];
    }
    let { theadClass = "thead-dark", intl } = this.props;
    let column = this.customizedColumn();
    let tableInfo =
      intl.formatMessage({
        id: "a_totle"
      }) +
      " " +
      total +
      " " +
      intl.formatMessage({
        id: "transaction_info"
      });
    // if (!loading && transfers.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
    //     );
    //   }
    //
    //   return <EmptyState/>;
    // }

    return (
      <Fragment>
        {loading && (
          <div
            className="loading-style"
            style={{
              marginTop: "-20px"
            }}
          >
            <TronLoader />
          </div>
        )}
        <div className="row transfers">
          <div className="col-md-12 ">
            <div className="distributionWrapper" style={{}}>
              <div>
                <div
                  className="d-flex justify-content-between pl-3 pr-3 pt-3 pb-3"
                  style={{
                    background: "#fff"
                  }}
                >
                  <DateSelect
                    onDateOk={(start, end) => this.onDateOk(start, end)}
                  />
                </div>
                <div className="d-flex justify-content-between pl-3 pr-3">
                  {!loading && (
                    <TotalInfo
                      total={total}
                      rangeTotal={rangeTotal}
                      typeText="transaction_info"
                      divClass="table_pos_info_addr"
                      selected
                      top="64px"
                    />
                  )}
                </div>
              </div>
              <div className="trx20tronsfers">
                {!loading && transfers.length === 0 ? (
                  <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
                    {tu("no_transfers")}
                  </div>
                ) : (
                  <SmartTable
                    bordered={false}
                    loading={loading}
                    column={column}
                    data={transfers}
                    total={rangeTotal > 2000 ? 2000 : rangeTotal}
                    addr="address"
                    transfers="token"
                    current={this.state.page}
                    onPageChange={(page, pageSize) => {
                      this.loadPage(page, pageSize);
                    }}
                    position="bottom"
                    isPaddingTop={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withTimers(injectIntl(Transfers));
