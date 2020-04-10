import React, { Fragment } from "react";
import { tu } from "../../../utils/i18n";
import { AddressLink } from "../../common/Links";
import { Client } from "../../../services/api";
import { ONE_TRX, API_URL } from "../../../constants";
import SmartTable from "../../common/SmartTable.js";
import { FormattedNumber, injectIntl } from "react-intl";
import { TronLoader } from "../../common/loaders";
import { toastr } from "react-redux-toastr";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";
import { trim } from "lodash";
import { upperFirst, upperCase, lowerCase } from "lodash";
import { Tooltip } from "antd";
import { connect } from "react-redux";
import { updateTokenInfo } from "../../../actions/tokenInfo";
import { FormatNumberByDecimals } from "../../../utils/number";
import { QuestionMark } from "../../common/QuestionMark";
import HolderDistribution from "../components/HolderDistribution";
import qs from "qs";
import { Icon } from "antd";

class TokenHolders extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: {},
      addresses: [],
      page: 0,
      total: 0,
      pageSize: 25,
      search: ""
    };
  }

  componentDidMount() {
    this.loadTokenHolders();
  }

  componentDidUpdate() {}

  onChange = (page, pageSize) => {
    this.loadTokenHolders(page, pageSize);
  };

  loadTokenHolders = async (page = 1, pageSize = 20) => {
    let { filter, getCsvUrl } = this.props;
    this.setState({
      loading: true
    });
    const params = {
      sort: "-balance",
      limit: pageSize,
      start: (page - 1) * pageSize,
      count: true,
      address: filter.address
    };
    const query = qs.stringify({
      format: "csv",
      ...params
    });
    getCsvUrl(`${API_URL}/api/tokenholders?${query}`);

    let { addresses, total, rangeTotal,contractMap } = await Client.getTokenHolders(
      filter.token,
      params
    );
    
    // for (let index in addresses) {
    //   addresses[index].index = parseInt(index) + 1;
    // }
    let exchangeFlag = await Client.getTagNameList();
    addresses.forEach(item=>{
      if(contractMap){
        contractMap[item.address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
      }
    })
    this.setState({
      page,
      addresses,
      total,
      rangeTotal,
      loading: false
    });
    this.props.updateTokenInfo({
      holders10ListObj: {
        rangeTotal
      }
    });
  };
  customizedColumn = () => {
    let { intl, token, tokenPrecision } = this.props;
    let column = [
      {
        title: intl.formatMessage({
          id: "token_rank"
        }),
        dataIndex: "index",
        key: "index",
        width: "10%",
        align: "center",
        className: "ant_table"
      },
      {
        title: intl.formatMessage({
          id: "address"
        }),
        dataIndex: "address",
        key: "address",
        render: (text, record, index) => {
          return record.ico ? (
            <div
              style={{
                display: "flex"
              }}
            > 
              <span>
                {/*  Distinguish between contract and ordinary address */}
                {record.ownerIsContract? (
                  <span className="d-flex">
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
                        color: "#77838f",
                        lineHeight: 1.4
                        }}
                      />
                    </Tooltip>
                  </span>
                  ) : null
                }
              </span>
              <Tooltip
                placement="topLeft"
                title={upperCase(
                  intl.formatMessage({
                    id: record.ico
                  })
                )}
              >
                <span
                  className="d-flex align-items-center"
                  style={{
                    maxWidth: 350
                  }}
                >
                  {/*  Distinguish between contract and ordinary address */}
                  {record.ownerIsContract? (
                    <span className="d-flex">
                      <div
                        style={{
                          maxWidth: 350
                        }}
                      >
                        <AddressLink address={record.address} isContract={true}/>
                      </div>
                    </span>
                    ) : 
                    <div
                      style={{
                        maxWidth: 350
                      }}
                    >
                      <AddressLink address={record.address}></AddressLink>
                    </div>
                  }
                </span>
              </Tooltip>
              {record.addressTag ? (
                <div>
                  <img
                    style={{
                      width: 14,
                      height: 14
                    }}
                    src={`https://coin.top/production/upload/tag/${record.address}.png`}
                    alt=""
                  />
                  <span> {record.addressTag} </span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            
            <div
              style={{
                display: "flex"
              }}
            >
              <span>
                {/*  Distinguish between contract and ordinary address */}
                {record.ownerIsContract? (
                  <span className="d-flex">
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
                        color: "#77838f",
                        lineHeight: 1.4
                        }}
                      />
                    </Tooltip>
                    <div
                      style={{
                        maxWidth: 350
                      }}
                    >
                      <AddressLink address={record.address} isContract={true}/>
                    </div>
                  </span>
                  ) : 
                  <div
                    style={{
                      maxWidth: 350
                    }}
                  >
                    <AddressLink address={record.address}></AddressLink>
                  </div>
                }
              </span>
              {record.addressTag ? (
                <div>
                  <img
                    style={{
                      width: 14,
                      height: 14
                    }}
                    src={`https://coin.top/production/upload/tag/${record.address}.png`}
                    alt=""
                  />
                  <span> {record.addressTag} </span>
                </div>
              ) : (
                ""
              )}
              {record.srTag ? (
                <div>
                  <img
                    style={{
                      width: 14,
                      height: 14
                    }}
                    src="https://coin.top/production/upload/tag/sr.png"
                    alt=""
                  />
                  <span> SR </span>
                </div>
              ) : (
                ""
              )}
              {record.foundationTag ? (
                <div>
                  <img
                    style={{
                      width: 14,
                      height: 14
                    }}
                    src="https://coin.top/production/upload/tag/foundation.png"
                    alt=""
                  />
                  <span> FOUNDATION </span>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        }
      },
      // {
      //   title: "",
      //   dataIndex: "addressTag",
      //   key: "addressTag",
      //   align: "left",
      //   width: "15%",
      //   render: (text, record, index) => {
      //     return (
      //       <span style={{ whiteSpace: "nowrap" }}>
      //
      //         {record.addressTag ? record.addressTag : ""}
      //       </span>
      //     );
      //   }
      // },
      {
        title: upperFirst(
          intl.formatMessage({
            id: "quantity"
          })
        ),
        dataIndex: "transactionHash",
        key: "transactionHash",
        width: "20%",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          //return <FormattedNumber value={record.balance/ Math.pow(10,tokenPrecision.precision)}/>
          return (
            <span>
              {FormatNumberByDecimals(record.balance, tokenPrecision.precision)}
            </span>
          );
        }
      },
      {
        title: intl.formatMessage({
          id: "percentage"
        }),
        dataIndex: "percentage",
        key: "percentage",
        width: "18%",
        align: "right",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <div>
              <FormattedNumber
                value={(record.balance / token.totalSupply) * 100}
                maximumFractionDigits={6}
              />
              %
            </div>
          );
        }
      }
    ];

    return column;
  };

  doSearch = async () => {
    let { intl } = this.props;
    let { search } = this.state;

    if (isAddressValid(search)) {
      let { filter, getCsvUrl } = this.props;
      this.setState({
        loading: true
      });
      const params = {
        sort: "-balance",
        limit: 20,
        count: true,
        address: filter.address,
        holder_address: search
      };
      const query = qs.stringify({
        format: "csv",
        ...params
      });
      getCsvUrl(`${API_URL}/api/tokenholders?${query}`);

      let { addresses, total, rangeTotal,contractMap } = await Client.getTokenHolders(
        filter.token,
        params
      );
      addresses.forEach(item=>{
        if(contractMap){
          contractMap[item.address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
        }
      })

      let exchangeFlag = await Client.getTagNameList();
      if (addresses.length) {
        addresses.map(item => {
          item.tagName = "";
          exchangeFlag.map(coin => {
            const typeList = Object.keys(coin.addressList);
            typeList.map(type => {
              if (coin.addressList[type].length == 1) {
                if (coin.addressList[type][0] === item.address) {
                  item.tagName = `${upperFirst(coin.name)}${
                    type !== "default" ? `-${type}` : ""
                  }`;
                  if (lowerCase(coin.name) === "binance") {
                    item.ico = lowerCase(coin.name);
                  }
                }
              } else if (coin.addressList[type].length > 1) {
                coin.addressList[type].map((address, index) => {
                  if (address === item.address) {
                    item.tagName = `${upperFirst(coin.name)}${
                      type !== "default"
                        ? `-${type} ${index + 1}`
                        : ` ${index + 1}`
                    }`;
                    if (lowerCase(coin.name) === "binance") {
                      item.ico = lowerCase(coin.name);
                    }
                  }
                });
              }
            });
          });
        });
      }

      this.setState({
        addresses,
        total,
        rangeTotal,
        loading: false
      });
      this.props.updateTokenInfo({
        holders10ListObj: {
          rangeTotal
        }
      });
    } else {
      toastr.warning(
        intl.formatMessage({
          id: "warning"
        }),
        intl.formatMessage({
          id: "search_TRC20_error"
        })
      );
      this.setState({
        search: ""
      });
    }
  };

  resetSearch = async () => {
    const { page, pageSize } = this.state;
    this.setState(
      {
        search: "",
        page: 1
      },
      () => {
        this.loadTokenHolders(page, pageSize);
      }
    );
  };

  render() {
    let { addresses, total, rangeTotal, loading, search } = this.state;
    let { intl, filter, activeLanguage } = this.props;
    let column = this.customizedColumn();
    let tableInfo =
      intl.formatMessage({
        id: "a_totle"
      }) +
      " " +
      total +
      " " +
      intl.formatMessage({
        id: "hold_addr"
      });
    let tableInfoTip =
      intl.formatMessage({
        id: "table_info_holders_tip1"
      }) +
      " " +
      rangeTotal +
      " " +
      intl.formatMessage({
        id: "table_info_holders_tip2"
      });

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
            <HolderDistribution
              trcType={"trc10"}
              tokenId={filter.tokenId}
            ></HolderDistribution>
            <div
              className="distributionWrapper"
              style={{
                background: "#d8d8d8",
                borderTop: "1px solid #d8d8d8"
              }}
            >
              <div className="nav-searchbar" style={styles.searchBox}>
                <div
                  className="token20-input-group input-group"
                  style={{
                    height: 100
                  }}
                >
                  <div
                    style={{
                      paddingLeft: 20,
                      background: "#fff"
                    }}
                  >
                    <div className="d-none d-md-block">
                      <div
                        style={{
                          fontFamily: "PingFangSC-Medium",
                          fontSize: "16px",
                          color: "#333333",
                          marginTop: "20px"
                        }}
                      >
                        {tu("holders")}
                        {activeLanguage === "en" ? "' " : null}
                        {tu("address")}
                      </div>
                      <div
                        style={{
                          fontFamily: "PingFangSC-Regular",
                          fontSize: "14px",
                          color: "#999999"
                        }}
                      >
                        {tu("view_total")} {rangeTotal} {tu("hold_addr")}
                        {/* {rangeTotal >= 10000 ? (
                          <QuestionMark
                            placement="top"
                            info={tableInfoTip}
                          ></QuestionMark>
                        ) : (
                          ""
                        )} */}
                        {rangeTotal >= 10000 ? (
                          <span>, {tu("table_info_big")} </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="token20-search" style={{ top: 20 }}>
                    <input
                      type="text"
                      className="form-control p-2 bg-white border-0 box-shadow-none padding20"
                      value={search}
                      onChange={ev =>
                        this.setState({
                          search: trim(ev.target.value)
                        })
                      }
                      placeholder={intl.formatMessage({
                        id: "search_TRC20"
                      })}
                    />
                    {search ? (
                      <Icon
                        onClick={() => {
                          this.resetSearch();
                        }}
                        type="close-circle"
                        style={{
                          position: "absolute",
                          top: "0.6rem",
                          right: 40
                        }}
                      />
                    ) : null}
                    <div className="input-group-append">
                      <button
                        className="btn box-shadow-none"
                        onClick={this.doSearch}
                      >
                        <i className="fa fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {!loading && addresses.length === 0 ? (
                <div
                  className=" text-center no-data"
                  style={{
                    background: "#fff",
                    minHeight: "300px",
                    paddingTop: "100px"
                  }}
                >
                  <span> {tu("no_holders_found")} </span>
                </div>
              ) : (
                <SmartTable
                  bordered={true}
                  loading={loading}
                  column={column}
                  data={addresses}
                  total={total}
                  onPageChange={(page, pageSize) => {
                    this.loadTokenHolders(page, pageSize);
                  }}
                  position="bottom"
                />
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
const styles = {
  searchBox: {
    background: "#fff",
    borderRight: "1px solid #d8d8d8",
    borderLeft: "1px solid #d8d8d8"
  }
};

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    tokensInfo: state.tokensInfo
  };
}

const mapDispatchToProps = {
  updateTokenInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(TokenHolders));
