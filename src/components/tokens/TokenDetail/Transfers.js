import React, { Fragment } from "react";
import { Client } from "../../../services/api";
import { AddressLink, TransactionHashLink } from "../../common/Links";
import { TRXPrice } from "../../common/Price";
import { API_URL, ONE_TRX } from "../../../constants";
import { tu, t } from "../../../utils/i18n";
// import TimeAgo from "react-timeago";
import moment from "moment";
import { Icon, Tooltip } from "antd";
import { Truncate } from "../../common/text";
import { withTimers } from "../../../utils/timing";
import { FormatNumberByDecimals } from "../../../utils/number";
import { BlockNumberLink } from "../../common/Links";
import {
  FormattedNumber,
  injectIntl,
  FormattedDate,
  FormattedTime
} from "react-intl";
import { connect } from "react-redux";
import { updateTokenInfo } from "../../../actions/tokenInfo";
import SmartTable from "../../common/SmartTable";
import { upperFirst } from "lodash";
import { TronLoader } from "../../common/loaders";
import xhr from "axios/index";
import { NameWithId } from "../../common/names";
import TotalInfo from "../components/TableTotal";
import DateSelect from "../components/dateSelect";
import rebuildList from "../../../utils/rebuildList";
import qs from "qs";
import BigNumber from "bignumber.js";
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
      autoRefresh: props.autoRefresh || false,
      searchStatus: false,
      timeType: true
    };
  }

  async componentDidMount() {
    await this.props.updateTokenInfo({
      searchAddress: "",
      transferSearchStatus: false
    });
    this.loadPage();
    if (this.state.autoRefresh !== false) {
      this.props.setInterval(() => this.load(), this.state.autoRefresh);
    }
  }

  onChange = (page, pageSize) => {
    this.loadPage(page, pageSize);
  };

  loadPage = async (page = 1, pageSize = 20, isDate = 0) => {
    if (isDate == 0) {
      this.props.updateTokenInfo({
        transferSearchStatus: false
      });
    }

    let { filter, getCsvUrl } = this.props;
    let { showTotal } = this.state;
    const { searchAddress } = this.props.tokensInfo;
    let params, countParams;
    if (searchAddress === "") {
      params = {
        name: filter.token,
        issueAddress: filter.address,
        start_timestamp: this.start,
        end_timestamp: this.end
      };
      countParams = {
        type: "asset",
        issueName: filter.address
      };
    } else {
      params = {
        name: filter.token,
        issueAddress: filter.address,
        start_timestamp: this.start,
        end_timestamp: this.end,
        relatedAddress: searchAddress
      };
      countParams = {
        type: "asset",
        issueName: filter.address,
        address: searchAddress
      };
    }

    this.setState({
      loading: true,
      page: page,
      pageSize: pageSize
    });

    const query = qs.stringify({
      format: "csv",
      ...params
    });
    getCsvUrl(`${API_URL}/api/asset/transfer?${query}`);

    try {
      const allData = await Promise.all([
        Client.getAssetTransfers({
          limit: pageSize,
          start: (page - 1) * pageSize,
          ...params
        }),
        Client.getCountByType(countParams)
      ]).catch(e => {
        console.log("error:" + e);
      });
      const [{ list, total, rangeTotal }, { count }] = allData;

      let transfers = rebuildList(list, "tokenName", "amount");

      for (let index in transfers) {
        transfers[index].index = parseInt(index) + 1;
      }
      if (searchAddress !== "") {
        transfers.forEach(result => {
          if (result.transferToAddress === searchAddress) {
            result.transfersTag = "in";
          } else if (result.transferFromAddress === searchAddress) {
            result.transfersTag = "out";
          }
        });
      }

      this.setState({
        page,
        transfers,
        total: count,
        rangeTotal,
        loading: false
      });
      this.props.updateTokenInfo({
        transfersListObj: {
          page,
          transfers,
          total: count,
          rangeTotal
        }
      });
    } catch (e) {
      console.log("error:" + e);
    }
  };

  customizedColumn = () => {
    let { intl } = this.props;
    let { timeType } = this.state;
    let { searchAddress } = this.props.tokensInfo || "";

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
        align: "left",
        width: "90px",
        render: (text, record, index) => {
          return (
            <Truncate>
              <TransactionHashLink hash={record.transactionHash}>
                {record.transactionHash}
              </TransactionHashLink>
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
        dataIndex: "blockId",
        key: "blockId",
        className: "ant_table",
        align: "center",
        width: "100px",
        render: (text, record, index) => {
          return <BlockNumberLink number={text} />;
        }
      },
      {
        title: (
          <span
            className="token-change-type"
            onClick={this.changeType.bind(this)}
          >
            {upperFirst(
              intl.formatMessage({
                id: timeType ? "age" : "trc20_cur_order_header_order_time"
              })
            )}
            <Icon
              type="retweet"
              style={{
                verticalAlign: 0,
                marginLeft: 10
              }}
            />
          </span>
        ),
        dataIndex: "timestamp",
        key: "timestamp",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <div>
              {timeType ? (
                <BlockTime time={Number(record.timestamp)}> </BlockTime>
              ) : (
                <span className="">
                  <FormattedDate value={record.timestamp} /> &nbsp;
                  <FormattedTime
                    value={record.timestamp}
                    hour="numeric"
                    minute="numeric"
                    second="numeric"
                    hour12={false}
                  />
                </span>
              )}
            </div>
          );
          // <TimeAgo date={Number(record.timestamp)} title={moment(record.block_ts).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "from"
          })
        ),
        align: "left",
        dataIndex: "transferFromAddress",
        key: "transferFromAddress",
        className: "ant_table",
        width: "160px",
        render: (text, record, index) => {
          return (
            <AddressLink address={record.transferFromAddress}>
              {record.fromAddressIsContract ? (
                <Tooltip
                  placement="top"
                  title={upperFirst(
                    intl.formatMessage({
                      id: "transfersDetailContractAddress"
                    })
                  )}
                >
                  <Icon
                    type="file-text"
                    style={{
                      verticalAlign: 0,
                      color: "#77838f"
                    }}
                  />
                </Tooltip>
              ) : null}
              {record.transferFromAddress !== ""
                ? `${record.transferFromAddress.slice(
                    0,
                    5
                  )}...${record.transferFromAddress.slice(-5)}`
                : null}
            </AddressLink>
          );
        }
      },
      {
        title: "",
        className: "ant_table",
        width: "30px",
        align: "left",
        render: (text, record, index) => {
          return record.transfersTag ? (
            <img
              width={40}
              height={22}
              src={require(`../../../images/address/${record.transfersTag}.png`)}
            />
          ) : (
            <img src={require("../../../images/arrow.png")} />
          );
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
        width: "160px",
        align: "left",
        render: (text, record, index) => {
          return (
            <AddressLink address={record.transferToAddress}>
              {record.fromAddressIsContract ? (
                <Tooltip
                  placement="top"
                  title={upperFirst(
                    intl.formatMessage({
                      id: "transfersDetailContractAddress"
                    })
                  )}
                >
                  <Icon
                    type="file-text"
                    style={{
                      marginRight: 2,
                      verticalAlign: 0
                    }}
                  />
                </Tooltip>
              ) : null}
              {record.transferToAddress !== ""
                ? `${record.transferToAddress.slice(
                    0,
                    5
                  )}...${record.transferToAddress.slice(-5)}`
                : null}
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
        align: "center",
        dataIndex: "contractRet",
        key: "contractRet",
        className: "ant_table"
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "amount"
          })
        ),
        dataIndex: "amount",
        key: "amount",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return <FormattedNumber value={record.map_amount}></FormattedNumber>;
        }
      },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "tokens"
          })
        ),
        dataIndex: "tokens",
        align: "center",
        key: "tokens",
        className: "ant_table",
        render: (text, record, index) => {
          return <span> {record.map_token_name_abbr} </span>;
        }
      }
    ];

    return column;
  };

  changeType() {
    let { timeType } = this.state;

    this.setState({
      timeType: !timeType
    });
  }

  onDateOk(start, end) {
    this.start = start.valueOf();
    this.end = end.valueOf();
    let { page, pageSize } = this.state;
    this.loadPage(page, pageSize, 1);
  }

  render() {
    let {
      pageSize,
      loading,
      emptyState: EmptyState = null,
      searchStatus
    } = this.state;
    let {
      transfers,
      page,
      total,
      rangeTotal
    } = this.props.tokensInfo.transfersListObj;

    const listCommonSty = {
      textAlign: "center",
      width: "25%",
      paddingTop: "20px"
    };
    const listThirdSty = {
      textAlign: "center",
      width: "20%",
      paddingTop: "20px"
    };
    const listFourSty = {
      textAlign: "center",
      width: "30%",
      paddingTop: "20px"
    };
    const descStyle = {
      fontFamily: "HelveticaNeue",
      fontSize: "12px",
      color: "#999999"
    };
    const listTitleStyle = {
      fontFamily: "HelveticaNeue-Medium",
      fontSize: "18px",
      color: "#333333"
    };
    let { theadClass = "thead-dark", intl, tokensInfo, priceUSD } = this.props;
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
          <div className="col-md-12 table_pos">
            {tokensInfo.transferSearchStatus ? (
              <div
                style={{
                  display: "flex",
                  background: "#fff",
                  borderBottom: "1px solid #EEEEEE"
                }}
                className="pt-3 pb-3"
              >
                <div style={listCommonSty}>
                  <div
                    style={{
                      fontFamily: "HelveticaNeue-Medium",
                      fontSize: "18px",
                      color: "#C64844"
                    }}
                  >
                    {tokensInfo.transfer.holder_address !== ""
                      ? `${tokensInfo.transfer.holder_address.substring(
                          0,
                          7
                        )}...${tokensInfo.transfer.holder_address.slice(-7)}`
                      : null}
                  </div>
                  <p style={descStyle}> {tu("transfersDetailHolder")} </p>
                </div>
                <div style={listCommonSty}>
                  <div style={listTitleStyle}>
                    <FormattedNumber
                      value={
                        tokensInfo.tokenDetail.precision === 0
                          ? tokensInfo.transfer.balance
                          : tokensInfo.transfer.balance /
                            Math.pow(10, tokensInfo.tokenDetail.precision)
                      }
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                    ></FormattedNumber>
                    <span> {tokensInfo.tokenDetail.abbr}</span>
                  </div>
                  <p style={descStyle}>{tu("transfersDetailQuantity")}</p>
                </div>
                <div style={listThirdSty}>
                  <div style={listTitleStyle}>
                    <FormattedNumber
                      value={tokensInfo.transfer.accountedFor * 100}
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                    ></FormattedNumber>
                    %
                  </div>
                  <p style={descStyle}> {tu("transfersDetailPercentage")} </p>
                </div>
                <div style={listFourSty}>
                  <div style={listTitleStyle}>
                    <FormattedNumber
                      value={
                        tokensInfo.tokenDetail.precision === 0
                          ? new BigNumber(tokensInfo.transfer.balance)
                              .multipliedBy(
                                new BigNumber(tokensInfo.tokenDetail.priceToUsd)
                              )
                              .toNumber()
                          : new BigNumber(tokensInfo.transfer.balance)
                              .dividedBy(
                                Math.pow(10, tokensInfo.tokenDetail.precision)
                              )
                              .multipliedBy(tokensInfo.tokenDetail.priceToUsd)
                      }
                      minimumFractionDigits={2}
                      maximumFractionDigits={2}
                    ></FormattedNumber>
                    <span
                      style={{
                        color: "rgba(51,51,51,0.25)",
                        fontSize: "14px"
                      }}
                    >
                      {''} USD ≈ {''}
                      <FormattedNumber
                        value={
                          tokensInfo.tokenDetail.market_info?
                          tokensInfo.tokenDetail.precision === 0
                            ? new BigNumber(
                                tokensInfo.transfer.balance
                              ).multipliedBy(
                                tokensInfo.tokenDetail.market_info?tokensInfo.tokenDetail.market_info.priceInTrx:1
                              )
                            : new BigNumber(tokensInfo.transfer.balance)
                                .dividedBy(
                                  Math.pow(10, tokensInfo.tokenDetail.precision)
                                )
                                .multipliedBy(
                                  tokensInfo.tokenDetail.market_info? tokensInfo.tokenDetail.market_info.priceInTrx:1
                                 
                                )
                          :0
                        }
                        minimumFractionDigits={2}
                        maximumFractionDigits={2}
                      ></FormattedNumber>
                      {' '}
                      TRX
                    </span>
                  </div>
                  <p style={descStyle}> {tu("transfersDetailValue")} </p>
                </div>
              </div>
            ) : null}
            <div
              className="d-flex justify-content-between pl-3 pr-3 pt-3 pb-3"
              style={{
                background: "#fff"
              }}
            >
              <div style={{ paddingLeft: 7 }}>
                {!loading && (
                  <div >
                    <TotalInfo
                      total={total}
                      rangeTotal={rangeTotal}
                      typeText="transaction_info"
                      divClass="table_pos_info_addr"
                      selected
                      top={tokensInfo.searchAddress ? "184px" : "80px"}
                    />
                  </div>
                )}
              </div>
             
              <DateSelect
                onDateOk={(start, end) => this.onDateOk(start, end)}
                dataStyle={{
                  right: "35px"
                }}
              />
            </div>
            <div className="trx20tronsfers trx10tronsfers">
              {!loading && transfers.length === 0 ? (
                <div className="pt-5 pb-5 text-center no-data transfers-bg-white">
                  {tu("no_transfers")}
                </div>
              ) : (
                <SmartTable
                  bordered={false}
                  loading={loading}
                  position="bottom"
                  column={column}
                  data={transfers}
                  total={rangeTotal > 2000 ? 2000 : rangeTotal}
                  addr="address"
                  transfers="token"
                  onPageChange={(page, pageSize) => {
                    this.loadPage(page, pageSize, 1);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    tokensInfo: state.tokensInfo,
    priceUSD: state.blockchain.usdPrice
  };
}

const mapDispatchToProps = {
  updateTokenInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimers(injectIntl(Transfers)));
