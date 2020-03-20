import React from "react";
import { injectIntl,FormattedDate,FormattedTime,FormattedNumber} from "react-intl";
import { Client } from "../../services/api";
import { TransactionHashLink, AddressLink, BlockNumberLink,TokenLink, TokenTRC20Link } from "./Links";
import { Icon,Checkbox } from 'antd';
import {connect} from "react-redux";
import { tu } from "../../utils/i18n";
// import TimeAgo from "react-timeago";
import { TronLoader } from "./loaders";
import { Truncate,TruncateAddress } from "./text";
import { ContractTypes } from "../../utils/protocol";
import SmartTable from "./SmartTable.js";
import { upperFirst } from "lodash";
import TotalInfo from "./../../components/addresses/components/TableTotal";
import DateSelect from "./../../components/addresses/components/dateSelect";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../constants";
import moment from "moment";
// import { NameWithId } from "./names";
import {TRXPrice} from "./Price";
import rebuildList from "../../utils/rebuildList";
import { API_URL } from "../../constants";
import qs from "qs";
import {Tooltip} from 'antd';
import isMobile from "../../utils/isMobile";
import BlockTime from "../common/blockTime";

const CheckboxGroup = Checkbox.Group;

class Transactions extends React.Component {
  constructor(props) {
    super(props);
    let intl = props.intl;
    this.start = moment([2018, 5, 25])
      .startOf("day")
      .valueOf();
    this.end = moment().valueOf();
    this.state = {
      filter: {},
      transactions: [],
      total: 0,
      emptyState: props.EmptyState || (
        <TronLoader>Loading Transactions</TronLoader>
      ),
      timeType:true,
      tokenFilter:{
        checkedList:[],
        indeterminate:'',
        checkAll:false,
      },
      statusFilter:{
          checkedList:[],
          indeterminate:'',
          checkAll:false,
      },
      resultFilter:{
          checkedList:[],
          indeterminate:'',
          checkAll:false,
      },
      statusOptionsAry: [
          { label:  upperFirst(intl.formatMessage({id: 'full_node_version_unconfirmed'})), value: 1 },
          { label:  upperFirst(intl.formatMessage({id: 'full_node_version_confirmed'})), value: 0 },
          { label:  upperFirst(intl.formatMessage({id: 'block_detail_rolled_back'})), value: 2 },
      ],
      resultOptionsAry: [
          { label:  'SUCCESS', value: 'SUCCESS' },
          { label:  'FAIL', value: 'FAIL' },
      ],
      tokenOptionsAry: this.props.tokenList
    };
  }

  componentDidMount() {
    let { isBlock } = this.props;
    this.props.routerResetSearchFun()
    if (isBlock) {
      this.loadTransactions();
    }
  }

  componentDidUpdate(prevProps) {
    let { filter, page } = this.props;
    if (
      prevProps.filter.address !== filter.address &&
      page.router == "account"
    ) {
      this.loadTransactions();
    }
    if (this.props.blockchain.accountSearchAddress !== prevProps.blockchain.accountSearchAddress) {
      this.loadTransactions();
    }
  }

  onChange = (page, pageSize) => {
    this.loadTransactions(page, pageSize);
  };

  loadTransactions = async (page = 1, pageSize = 20) => {
    let { filter, isinternal = false, address = false, getCsvUrl } = this.props;

    this.setState({
      loading: true,
      page: page,
      pageSize: pageSize
    });

    let transactions,
      total,
      rangeTotal = 0;
    
    let { statusFilter,resultFilter,tokenFilter } = this.state;

    let statusFilterObj = {};
    if(statusFilter.checkedList.join(',')!==''){
        statusFilterObj = {
            confirm:statusFilter.checkedList.join(','),
        }
    }
    let resultFilterObj = {};
    if(resultFilter.checkedList.join(',')!==''){
        if(resultFilter.checkedList.length == 2){
            resultFilterObj = {
                ret:'all',
            }
        }else{
            resultFilterObj = {
                ret:resultFilter.checkedList.join(','),
            }
        }
    }
    let tokenFilterObj = {};
    if(tokenFilter.checkedList.join(',')!==''){
        tokenFilterObj = {
            tokens:tokenFilter.checkedList.join(','),
        }
    }



    if (!isinternal) {
      if (address) {
        const allData = await Promise.all([
          Client.getTransactions({
            sort: "-timestamp",
            limit: pageSize,
            start: (page - 1) * pageSize,
            // total: this.state.total,
            start_timestamp: this.start,
            end_timestamp: this.end,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj
          }),
          Client.getTransactions({
            limit: 0,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj
          }),
          Client.getTransactions({
            limit: 0,
            start_timestamp: this.start,
            end_timestamp: this.end,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj
          })
        ]).catch(e => {
          console.log("error:" + e);
        });
        [{ transactions }, { total }, { rangeTotal }] = allData;
      } else {
        const allData = await Promise.all([
          Client.getTransactions({
            limit: pageSize,
            start: (page - 1) * pageSize,
            sort: "-timestamp",
            total: this.state.total,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj
          }),
          Client.getTransactions({
            limit: 0,
            ...filter
          })
        ]).catch(e => {
          console.log("error:" + e);
        });
        [{ transactions }, { total, rangeTotal }] = allData;
      }
    } else {
      const { accountSearchAddress } = this.props.blockchain;
      let params
      if (accountSearchAddress === "") {
          params = {
            start_timestamp: this.start,
            end_timestamp: this.end,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj
          };
          } else {
          params = {
            start_timestamp: this.start,
            end_timestamp: this.end,
            ...filter,
            ...statusFilterObj,
            ...resultFilterObj,
            ...tokenFilterObj,
            keyword: accountSearchAddress
          };
      }
      
      const query = qs.stringify({ format: "csv", ...params });
      getCsvUrl(`${API_URL}/api/internal-transaction?${query}`);

      const allData = await Promise.all([
        Client.getInternalTransaction({
          limit: pageSize,
          start: (page - 1) * pageSize,
          ...params,
          ...statusFilterObj,
          ...resultFilterObj
        }),
        Client.getCountByType({
          type: "internal",
          ...filter
        })
      ]).catch(e => {
        console.log("error:" + e);
      });

      const [data, { count }] = allData;


      let newdata = rebuildList(
        data.list,
        "tokenId",
        "callValue",
        "valueInfoList"
      );
      transactions = newdata;
      total = count || data.total;
      rangeTotal = data.rangeTotal;
    }

    this.setState({
      transactions,
      total,
      rangeTotal,
      loading: false
    });
  };

  customizedColumn = () => {
    let { intl, isinternal = false } = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "hash" })),
        dataIndex: "hash",
        key: "hash",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Truncate>
              <TransactionHashLink hash={text}>{text}</TransactionHashLink>
            </Truncate>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "status" })),
        dataIndex: "confirmed",
        key: "confirmed",
        align: "left",
        className: "ant_table",
        width: "15%",
        render: (text, record, index) => {
          return text ? (
            <span>
              <img
                style={{ width: "20px", height: "20px" }}
                src={require("../../images/contract/Verified.png")}
              />{" "}
              {tu("full_node_version_confirmed")}
            </span>
          ) : (
            <span>
              <img
                style={{ width: "20px", height: "20px" }}
                src={require("../../images/contract/Unverified.png")}
              />{" "}
              {tu("full_node_version_unconfirmed")}
            </span>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "age" })),
        dataIndex: "timestamp",
        key: "timestamp",
        align: "left",
        className: "ant_table",
        width: "14%",
        render: (text, record, index) => {
          return <BlockTime time={text}></BlockTime>;
          // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "contract_type" })),
        dataIndex: "contractType",
        key: "contractType",
        align: "right",
        width: "20%",
        className: "ant_table _text_nowrap",
        render: (text, record, index) => {
          return <span>{ContractTypes[text]}</span>;
        }
      }
      // {
      //     title: upperFirst(intl.formatMessage({id: 'status'})),
      //     dataIndex: 'confirmed',
      //     key: 'confirmed',
      //     align: 'center',
      //     className: 'ant_table',
      //     render: (text, record, index) => {
      //         return record.confirmed?
      //             <span className="badge badge-success text-uppercase">{intl.formatMessage({id:'Confirmed'})}</span> :
      //             <span className="badge badge-danger text-uppercase">{intl.formatMessage({id: 'Unconfirmed'})}</span>
      //     },
      // }
    ];
    return column;
  };

  changeType() {
    let { timeType } = this.state;

    this.setState({
        timeType: !timeType
    });
}

  trc20CustomizedColumn = (activeLanguage) => {
    let { intl,filter,allSelectedTokenAry } = this.props;
    const { 
      timeType,
      statusFilter,statusOptionsAry,
      resultFilter,resultOptionsAry,
      tokenFilter,tokenOptionsAry,
    } = this.state;
    const statusFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div>
            <div style={{padding: "5px 12px"}}>
                <Checkbox
                    indeterminate={statusFilter.indeterminate}
                    onChange={
                        e => {
                            let obj = {
                              checkedList: e.target.checked ? [0,1,2] : [],
                              indeterminate: false,
                              checkAll: e.target.checked,
                            }
                          this.setState({
                              statusFilter:obj
                          })
                        }
                    }
                    checked={statusFilter.checkAll}
                >
                    {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                </Checkbox>
            </div>
            <div>
                <CheckboxGroup
                    options={statusOptionsAry}
                    value={statusFilter.checkedList}
                    onChange={(checkedList)=> {
                        let obj = {
                            checkedList,
                            indeterminate: !!checkedList.length && checkedList.length < statusOptionsAry.length,
                            checkAll: checkedList.length === statusOptionsAry.length,
                        }
                        this.setState({
                            statusFilter:obj
                        })
                    }}
                    />
            </div>
        </div>
    )
    const resultFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div>
            <div style={{padding: "5px 12px"}}>
                <Checkbox
                    indeterminate={resultFilter.indeterminate}
                    onChange={
                        e => {
                            let obj = {
                              checkedList: e.target.checked ? ['SUCCESS','FAIL'] : [],
                              indeterminate: false,
                              checkAll: e.target.checked,
                            }
                          this.setState({
                            resultFilter:obj
                          })
                        }
                    }
                    checked={resultFilter.checkAll}
                >
                    {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                </Checkbox>
            </div>
            <div>
                <CheckboxGroup
                    options={resultOptionsAry}
                    value={resultFilter.checkedList}
                    onChange={(checkedList)=> {
                        let obj = {
                            checkedList,
                            indeterminate: !!checkedList.length && checkedList.length < resultOptionsAry.length,
                            checkAll: checkedList.length === resultOptionsAry.length,
                        }
                        this.setState({
                            resultFilter:obj
                        })
                    }}
                    />
            </div>
        </div>
    )
    const tokenFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{maxHeight:'320px',overflow:'scroll'}}>
          <div style={{padding: "5px 12px"}}>
              <Checkbox
                  indeterminate={tokenFilter.indeterminate}
                  onChange={
                      e => {
                          let obj = {
                            checkedList: e.target.checked ? allSelectedTokenAry : [],
                            indeterminate: false,
                            checkAll: e.target.checked,
                          }
                        this.setState({
                          tokenFilter:obj
                        })
                      }
                  }
                  checked={tokenFilter.checkAll}
              >
                  {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
              </Checkbox>
          </div>
          <div>
              <CheckboxGroup
                  options={tokenOptionsAry}
                  value={tokenFilter.checkedList}
                  onChange={(checkedList)=> {
                      let obj = {
                          checkedList,
                          indeterminate: !!checkedList.length && checkedList.length < tokenOptionsAry.length,
                          checkAll: checkedList.length === tokenOptionsAry.length,
                      }
                      this.setState({
                          tokenFilter:obj
                      })
                  }}
                  />
          </div>
      </div>
    )
  
    let column = [
      {
        title: upperFirst(intl.formatMessage({ id: "parenthash" })),
        dataIndex: "hash",
        key: "hash",
        align: "left",
        className: "ant_table",
        render: (text, record, index) => {
          return (
            <Truncate>
              <TransactionHashLink hash={text}>{text}</TransactionHashLink>
            </Truncate>
          );
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "block" })),
        dataIndex: "block",
        key: "block",
        align: "left",
        className: "ant_table",
        width: "10%",
        render: (text, record, index) => {
          return <BlockNumberLink number={record.block} />;
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
        width: "15%",
        render: (text, record, index) => {
          return(
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
          ) 
        }
       
      },
      {
        title: upperFirst(intl.formatMessage({ id: "from" })),
        dataIndex: "from",
        key: "from",
        align: "left",
        width:"12%",
        className: 'ant_table address_max_width',
        render: (text, record, index) => {
          return (
            <span>
              {
                record.from == filter.address ?   
                <TruncateAddress>{text}</TruncateAddress>
                :<AddressLink address={text}>{text}</AddressLink>
              }
            </span>
          )
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "to" })),
        dataIndex: "to",
        key: "to",
        align: "left",
        width:"12%",
        className: 'ant_table address_max_width',
        render: (text, record, index) => {
          return (
            <span>
              {
                record.to == filter.address ?   
                <TruncateAddress>{text}</TruncateAddress>
                :<AddressLink address={text}>{text}</AddressLink>
              }
            </span>
          )
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'status'})),
        dataIndex: 'status',
        key: 'status',
        align: 'left',
        width: activeLanguage ==='ru' ? '34%' :'16%',
        className: 'ant_table',
        filterIcon: () => {
          return (
              <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
          );
        },
        filterDropdown: statusFilterDropdown,
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                console.log('visible')
            }else{
              this.loadTransactions();
            }
        },
        render: (text, record, index) => {
            return (
                <span>
                     {
                        record.confirmed ?
                            <span  className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> <span>{tu('full_node_version_confirmed')}</span></span>
                              : 
                            <span  className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> <span>{tu('full_node_version_unconfirmed')}</span></span>
                    }
                </span>
            )
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "result" })),
        dataIndex: "rejected",
        key: "rejected",
        align: "left",
        className: "ant_table _text_nowrap",
        filterIcon: () => {
          return (
              <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
          );
        },
        filterDropdown: resultFilterDropdown,
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                console.log('visible')
            }else{
              this.loadTransactions();
            }
        },
        render: (text, record, index) => {
          return (
            <span>
              {
                // && record.confirmed 
                !record.rejected ?
                <span>SUCCESS</span>:
                <div className="d-flex">
                    <img style={{ width: "20px", height: "20px" }} src={require("../../images/prompt.png")}/> 
                    <span>{' '}FAIL</span>
                </div>    
              }
            </span>
          )
        }
      },
      {
        title: upperFirst(intl.formatMessage({ id: "amount" })),
        dataIndex: "valueInfoList",
        key: "valueInfoList",
        align: "left",
        className: "ant_table _text_nowrap",
        render: (text, record, index) => {
          return record.valueInfoList.length
            ? record.valueInfoList.map((item, index) => {
                return (
                  item.map_token_name === "TRX" ?
                  <TRXPrice key="index" amount={item.map_amount}/> :
                  <span key="index" >
                    {
                      <span className="mr-1">
                        <FormattedNumber 
                          value={item.map_amount}
                          minimumFractionDigits={0}
                          maximumFractionDigits={Number(item.map_token_precision)}
                        />
                      </span>
                    }
                  </span>
                );
              })
            : "-";
        }
      },
      {
        title: 
          upperFirst(
              intl.formatMessage({
                  id: "tokens"
              })
          ),
          dataIndex: "tokens",
          align: "left",
          key: "tokens",
          filterIcon: () => {
            return (
                <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
            );
        },
        className: "ant_table",
        filterDropdown: tokenFilterDropdown,
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                console.log('visible')
            }else{
              this.loadTransactions();
            }
        },
        render: (text, record, index) => {
            const defaultImg = require("../../images/logo_default.png");
            return record.valueInfoList.length
            ? record.valueInfoList.map((item, index) => {
                return (
                  // item.tokenCanShow ?
                  // <Tooltip  key="index" placement="top" title={ intl.formatMessage({ id: "address_account_table_filter_token_tips" })}>
                  //   {item.map_token_name_abbr}
                  // </Tooltip>
                  // : 
                  // <span key="index">
                  //   {item.map_token_name_abbr}
                  // </span> 
                    item.map_token_id == 1002000 ||
                    item.map_token_id == CONTRACT_ADDRESS_USDT ||
                    item.map_token_id == CONTRACT_ADDRESS_WIN ||
                    item.map_token_id == CONTRACT_ADDRESS_GGC ? (
                    <div key="index">
                        <b
                            className="token-img-top"
                            style={{ marginRight: 5 }}
                        >
                        <img
                            width={20}
                            height={20}
                            src={record.map_amount_logo}
                            onError={e => {
                                e.target.onerror = null;
                                e.target.src = defaultImg;
                            }}
                        />
                        <i
                            style={{ width: 10, height: 10, bottom: -5 }}
                        ></i>
                        </b>
                        {item.tokenType?
                            <span>
                                {item.tokenType == "trc20" ? (
                                    <TokenTRC20Link
                                        name={item.map_token_id}
                                        address={item.contract_address}
                                        namePlus={item.map_token_name_abbr}
                                    />
                                    ) : (
                                    <TokenLink
                                        id={item.map_token_id}
                                        name={item.map_token_name_abbr}
                                    />
                                )}
                            </span>
                            :null
                        }
                        
                    </div>
                    ) : (
                    <div key="index">
                        {isAddressValid(item.map_token_name_abbr) ? (
                        <span>
                            {tu("address_transfer_unrecorded_token")}
                        </span>
                        ) : (
                           
                        <div>
                            {
                                item.map_amount_logo?
                                <img
                                    width={20}
                                    height={20}
                                    src={item.map_amount_logo}
                                    style={{ marginRight: 5 }}
                                    onError={e => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImg;
                                    }}
                                />
                                :
                                <img
                                    width={20}
                                    height={20}
                                    src={defaultImg}
                                    style={{ marginRight: 5 }}
                                    onError={e => {
                                        e.target.onerror = null;
                                        e.target.src = defaultImg;
                                    }}
                                />

                            }
                           
                            {
                                item.tokenType?
                                <span>
                                    {item.tokenType == "trc20" ? (
                                        <TokenTRC20Link
                                            name={item.map_token_id}
                                            address={item.contract_address}
                                            namePlus={item.map_token_name_abbr}
                                        />
                                    ) : (
                                        <TokenLink
                                            id={item.map_token_id}
                                            name={
                                              item.map_token_name_abbr
                                                ? item.map_token_name_abbr
                                                : item.token_name
                                            }
                                        />
                                    )} 
                                </span>:
                                <Tooltip placement="top" title={ intl.formatMessage({ id: "address_account_table_filter_token_tips" })}>
                                    空
                                </Tooltip>
                            }
                        </div>
                        )}
                    </div>
                    )
                )
              })
            : "-";
        }
      }
      // {
      //   title: upperFirst(intl.formatMessage({id: 'contract_type'})),
      //   dataIndex: 'contractType',
      //   key: 'contractType',
      //   align: 'right',
      //   width: '20%',
      //   className: 'ant_table _text_nowrap',
      //   render: (text, record, index) => {
      //     return <span>{ContractTypes[text]}</span>
      //   }
      // },
    ];
    return column;
  };

  onDateOk(start, end) {
    this.start = start.valueOf();
    this.end = end.valueOf();
    this.loadTransactions();
  }

  render() {
    let {
      transactions,
      total,
      rangeTotal,
      loading,
      EmptyState = null
    } = this.state;
    let {
      intl,
      isinternal,
      isBlock = false,
      address = false,
      activeLanguage,
      filter
    } = this.props;
    let column = !isinternal
      ? this.customizedColumn()
      : this.trc20CustomizedColumn(activeLanguage);
    let tableInfo =
      intl.formatMessage({ id: "view_total" }) +
      " " +
      total +
      " " +
      intl.formatMessage({ id: "transactions_unit" });

    // if (!loading && transactions && transactions.length === 0) {
    //   if (!EmptyState) {
    //     return (
    //         <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
    //     );
    //   }
    //   return <EmptyState/>;
    // }

    return (
      <div className={"token_black mt-5"} >
        {loading && (
          <div className="loading-style">
            <TronLoader />
          </div>
        )}

        {/* <div
          className="d-flex justify-content-between w-100"
          style={{ position: "absolute", left: 0, top: "-28px" }}
        >
          {total && filter.address && isinternal ? (
            <div className="d-flex align-items-center">
              <i
                class="fas fa-exclamation-circle mr-2"
                style={{ color: "#999999" }}
              ></i>
              <span className="flex-1" style={{ width: "700px" }}>
                {tu("interTrx_tip_contract")}
              </span>
            </div>
          ) : (
            ""
          )}
         
        </div> */}
        <div style={{marginBottom:'20px'}}>
            {!isBlock ? (
              <DateSelect
                onDateOk={(start, end) => this.onDateOk(start, end)}
                dataStyle={{ marginTop: "-1.6rem" }}
              />
            ) : (
              ""
            )}
          </div>
        <div>
          {!loading && (
            <TotalInfo
              total={total}
              isQuestionMark={false}
              rangeTotal={rangeTotal}
              typeText={
                filter.address && isinternal
                  ? "inter_contract_unit"
                  : "transactions_unit"
              }
              common={!address}
              top={!filter.address ? "-28px" : "10px"}
              isInternal={true}
              selected
            />
          )}
        </div>
       
        {!loading && transactions.length === 0 ? (
          <div className="p-3 text-center no-data">{tu("no_transactions")}</div>
        ) : (
          <div className={isMobile ? "pt-5":null}>
            <SmartTable
              bordered={true}
              position="bottom"
              loading={loading}
              column={column}
              data={transactions}
              total={rangeTotal > 2000 ? 2000 : rangeTotal}
              onPageChange={(page, pageSize) => {
                this.loadTransactions(page, pageSize);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    blockchain: state.blockchain
  };
}

export default connect(mapStateToProps)(injectIntl(Transactions));
