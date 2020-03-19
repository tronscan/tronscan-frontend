import React, {Fragment} from "react";
import { injectIntl,FormattedDate,FormattedTime } from "react-intl";
import {Client} from "../../services/api";
import {AddressLink, TransactionHashLink, BlockNumberLink, TokenLink, TokenTRC20Link} from "./Links";
import {tu, tv} from "../../utils/i18n";
import {connect} from "react-redux";

// import TimeAgo from "react-timeago";
import {Truncate,TruncateAddress} from "./text";
import {withTimers} from "../../utils/timing";
import SmartTable from "./SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "./loaders";
import rebuildList from "../../utils/rebuildList";
import rebuildToken20List from "../../utils/rebuildToken20List";
// import {SwitchToken} from "./Switch";
// import DateRange from "./DateRange";
import TotalInfo from "./../../components/addresses/components/TableTotal";
import DateSelect from "./../../components/addresses/components/dateSelect";
import moment from 'moment';
import { toThousands } from '../../utils/number'
import _ from "lodash";
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../constants";
import qs from 'qs'
import isMobile from "../../utils/isMobile";

import { Icon,Checkbox,Radio } from 'antd';

import {API_URL} from "../../constants";
import BlockTime from '../common/blockTime'
const CheckboxGroup = Checkbox.Group;


class TransfersAll extends React.Component {
    constructor(props) {
        super(props);
        let intl = props.intl;
        this.start = moment([2018,5,25]).startOf('day').valueOf();
        this.end = moment().valueOf();
        this.state = {
            filter: {
                // direction:'all'
            },
            transfers: [],
            page: 1,
            total: 0,
            pageSize: 20,
            showTotal: props.showTotal !== false,
            emptyState: props.emptyState,
            autoRefresh: props.autoRefresh || false,
            hideSmallCurrency:false,
            tokenName:"",
            timeType:true,
            inoutFilter:{
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
            tokenFilter:{
                checkedList:[],
                indeterminate:'',
                checkAll:false,
            },
            inoutOptionsAry:[
                { label:  upperFirst(intl.formatMessage({id: 'address_transfer_in'})), value: 'in' },
                { label:  upperFirst(intl.formatMessage({id: 'address_transfer_out'})), value: 'out' },
            ],
            statusOptionsAry: [
                { label:  upperFirst(intl.formatMessage({id: 'full_node_version_unconfirmed'})), value: 1 },
                { label:  upperFirst(intl.formatMessage({id: 'full_node_version_confirmed'})), value: 2 },
                // { text:  upperFirst(intl.formatMessage({id: 'block_detail_rolled_back'})), value: '3' },
            ],
            resultOptionsAry: [
                { label:  'SUCCESS', value: 1 },
                { label:  'FAIL', value: 2 },
            ],
            tokenOptionsAry: [
                { label:  '后端获取', value: 1 },
                { label:  '后端获取', value: 2 },
            ]
        };
    }

    componentDidMount() {
        let {page, pageSize} = this.state;
        // this.load(page,pageSize);
        this.props.routerResetSearchFun()
        if (this.state.autoRefresh !== false) {
            this.props.setInterval(() => this.load(page,pageSize), this.state.autoRefresh);
        }

    }

    onChange = (page, pageSize) => {
        this.setState({
            page:page,
            pageSize:pageSize
        },() => {
            this.load(page, pageSize);
        });

    };
    load = async (page = 1, pageSize = 20) => {
        let transfersTRX;
        let {id,istrc20=false, getCsvUrl} = this.props;
        let {showTotal,hideSmallCurrency,tokenNam,filter,inoutFilter,statusFilter,resultFilter} = this.state;
        let inoutFilterObj = {};
        if(inoutFilter.checkedList.join(',')!==''){
            if(inoutFilter.checkedList.length == 2){
                inoutFilterObj = {
                    direction:'all',
                }
            }else{
                inoutFilterObj = {
                    direction:inoutFilter.checkedList.join(','),
                }
            }
          
        }
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
        const params = {
            sort: '-timestamp',
            count: showTotal ? true : null,
            total: this.state.total,
            start_timestamp:this.start,
            end_timestamp:this.end,
            ...filter,
            ...id,
            ...inoutFilterObj,
            ...statusFilterObj,
            ...resultFilterObj
        }
        this.setState({
            loading: true,
            page: page,
            pageSize: pageSize,
        });
        const query = qs.stringify({ format: 'csv',...params})
        getCsvUrl(`${API_URL}/api/trc10trc20-transfer?${query}`)
        let list,total,range = 0;

        const allData = await Promise.all([
            Client.getTransfersAll({
                limit: pageSize,
                start: (page - 1) * pageSize,
                ...params,
            }),
            Client.getCountByType({
                type: 'trc10trc20', 
                ...filter,
                ...id,})
        ]).catch(e => {
            console.log('error:' + e);
        });

        const [{ transfers, total:totaldata, rangeTotal }, { count } ] = allData;

        list = transfers;
        total = count || totaldata;
        range = rangeTotal;
        transfers.map(item => {
            if (!item.amount_str) {
                item.amount_str = item.amount;
            }
        })
        let transfersTRC10 = _(transfers).filter(tb => tb.type === "trc10" ).value();
        let transfersTRC20 = _(transfers).filter(tb => tb.type === "trc20" ).value();

        let rebuildRransfersTRC10 = rebuildList(transfersTRC10, 'token_id', 'amount_str');
        let rebuildRransfersTRC20  = rebuildToken20List(transfersTRC20, 'contract_address', 'amount_str');
        let rebuildRransfers = rebuildRransfersTRC10.concat(rebuildRransfersTRC20);
        rebuildRransfers =  _(rebuildRransfers).sortBy(tb => -tb.date_created).value();
        rebuildRransfers.map( item => {
            if(item.map_token_id === '_'){
                item.map_amount_logo = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png';
                //item.type = '-';
            }
            if(id.address){
                if(item.type == 'trc10'){
                    item.fromtip = !(item.owner_address == id.address)
                    item.totip = !(item.to_address == id.address)
                }else{
                    item.fromtip = !(item.from_address == id.address)
                    item.totip = !(item.to_address == id.address)
                }

            }else{
                item.fromtip = true
                item.totip = true
            }
        })
        this.setState({
            page,
            transfers:rebuildRransfers,
            total:total,
            rangeTotal:range,
            loading: false,
        });
    };
    handleSwitch = (val) => {
        let {page, pageSize} = this.state;
        if(val){
            this.setState({
                hideSmallCurrency: val,
                tokenName:"_",
            },() => {
                this.load(1,20);
            });
        }else {
            this.setState({
                hideSmallCurrency: val,
                tokenName:'',
            },() => {
                this.load(1,20);
            });
        }

    }

    changeType() {
        let { timeType } = this.state;

        this.setState({
            timeType: !timeType
        });
    }


      onCheckAllChange = e => {

          let obj = {
            checkedList: e.target.checked ? [1,2] : [],
            indeterminate: false,
            checkAll: e.target.checked,
          }
        this.setState({
            statusFilter:obj
        });
      };

    customizedColumn = (activeLanguage) => {
        let { intl } = this.props;
        const defaultImg = require("../../images/logo_default.png");
        const { 
            timeType,
            inoutOptionsAry,inoutFilter,
            statusFilter,statusOptionsAry,
            resultFilter,resultOptionsAry,
            tokenFilter,tokenOptionsAry,
        } = this.state;
        const inoutFilterDropdown = ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={inoutFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? ['in','out'] : [],
                                  indeterminate: false,
                                  checkAll: e.target.checked,
                                }
                              this.setState({
                                inoutFilter:obj
                              });
                            }
                        }
                        checked={inoutFilter.checkAll}
                    >
                        {upperFirst(intl.formatMessage({id: 'address_account_table_filter_all'}))}
                    </Checkbox>
                </div>
                <div>
                    <CheckboxGroup
                        options={inoutOptionsAry}
                        value={inoutFilter.checkedList}
                        onChange={(checkedList)=> {
                            let obj = {
                                checkedList,
                                indeterminate: !!checkedList.length && checkedList.length < inoutOptionsAry.length,
                                checkAll: checkedList.length === inoutOptionsAry.length,
                            }
                            this.setState({
                                inoutFilter:obj
                            })
                        }}  
                    />
                </div>
            </div>
        )
        const statusFilterDropdown =  ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={statusFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2] : [],
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
                                  checkedList: e.target.checked ? [1,2] : [],
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
            <div>
                <div style={{padding: "5px 12px"}}>
                    <Checkbox
                        indeterminate={tokenFilter.indeterminate}
                        onChange={
                            e => {
                                let obj = {
                                  checkedList: e.target.checked ? [1,2] : [],
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
                title: upperFirst(intl.formatMessage({id: 'transaction_hash'})),
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                width: '8%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <Truncate>
                        <TransactionHashLink hash={text}>
                            {text}
                        </TransactionHashLink>
                    </Truncate>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'block' })),
                dataIndex: 'block',
                key: 'block',
                align: 'left',
                className: 'ant_table',
                width: '10%',
                render: (text, record, index) => {
                    return <BlockNumberLink number={record.block}/>
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
                dataIndex: 'date_created',
                key: 'date_created',
                align: 'left',
                className: 'ant_table',
                width: '16%',
                render: (text, record, index) => {
                    return(
                        <div>
                            {timeType ? (
                            <BlockTime time={Number(record.date_created)}> </BlockTime>
                            ) : (
                            <span className="">
                                <FormattedDate value={record.date_created} /> &nbsp;
                                <FormattedTime
                                value={record.date_created}
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
                title: upperFirst(intl.formatMessage({id: 'from'})),
                dataIndex: 'owner_address',
                key: 'owner_address',
                align: 'left',
                className: 'ant_table address_max_width',
                width: '9%',
                render: (text, record, index) => {
                    return <div>
                        {
                            record.fromtip ?
                                <AddressLink address={record.type == 'trc10'?text:record.from_address}>{record.type == 'trc10'?text:record.from_address}</AddressLink>:
                                <TruncateAddress>{record.type == 'trc10'?text:record.from_address}</TruncateAddress>
                        }

                    </div>

                }
            },
            {
                title: (
                    <span>
                       {upperFirst(intl.formatMessage({id: 'address_transfer_in'}))}{' '}|{' '} 
                       {upperFirst(intl.formatMessage({id: 'address_transfer_out'}))}
                    </span>
                ),
                dataIndex: 'address_transfer_out',
                key: 'address_transfer_out',
                align: 'center',
                className: 'ant_table address_max_width',
                width: '10%',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down"  style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: inoutFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                    }else{
                        this.load(1);
                    }
                },
                render: (text, record, index) => {
                    return record.fromtip?<img width={40} height={22} src={require("../../images/address/in.png")}/>:<img  width={40} height={22} src={require("../../images/address/out.png")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'to'})),
                dataIndex: 'to_address',
                key: 'to_address',
                align: 'left',
                className: 'ant_table address_max_width',
                width: '9%',
                render: (text, record, index) => {
                    return record.totip?
                        <AddressLink address={text}>{text}</AddressLink>:
                        <TruncateAddress>{text}</TruncateAddress>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'status'})),
                dataIndex: 'status',
                key: 'status',
                width: activeLanguage === 'zh' ?'10%' :"17%",
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return (
                        <div>
                            {
                                record.confirmed ?
                                    <span className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> {tu('full_node_version_confirmed')}</span>
                                      : 
                                    <span className="d-flex"><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> {tu('full_node_version_unconfirmed')}</span>
                            }
                        </div>
                    )
                },
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: statusFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        // console.log('visible')
                    }else{
                        this.load(1);
                    }
                },
            },
            {
                title: upperFirst(intl.formatMessage({id: 'result' })),
                dataIndex: 'contractRet',
                key: 'contractRet',
                align: 'left',
                className: 'ant_table',
                width: '11%',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: resultFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        // console.log('visible')
                    }else{
                        this.load(1);
                    }
                },
                render: (text, record, index) => {
                    return (
                        <span>
                            {
                                record.confirmed && record.contractRet == 'SUCCESS' ?
                                <span>SUCCESS</span>:
                                <div className="d-flex">
                                    <img style={{ width: "20px", height: "20px" }} src={require("../../images/prompt.png")}/> 
                                    <span>{' '}FAIL</span>
                                </div>    
                            }
                        </span>
                    )
                },
                
            },
            {
                title: upperFirst(intl.formatMessage({id: 'amount'})),
                dataIndex: 'amount',
                key: 'amount',
                align: 'left',
                className: 'ant_table _text_nowrap',
                render: (text, record, index) => {
                    return <span className="d-inline-block text-truncate"  style={{maxWidth: '200px'}}>{toThousands(record.map_amount)}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'token'})),
                dataIndex: 'map_token_name',
                key: 'map_token_name',
                width: '10%',
                align: 'left',
                className: 'ant_table',
                filterIcon: () => {
                    return (
                        <Icon type="caret-down" style={{fontSize:12,color:'#999'}}  theme="outlined" />
                    );
                },
                filterDropdown: tokenFilterDropdown,
                onFilterDropdownVisibleChange: (visible) => {
                    if (visible) {
                        // console.log('visible')
                    }else{
                        this.load(1);
                    }
                },
                render: (text, record, index) => {
                    console.log(record)
                    return (
                      <div>
                        {record.map_token_id == 1002000 ||
                        record.map_token_id == CONTRACT_ADDRESS_USDT ||
                        record.map_token_id == CONTRACT_ADDRESS_WIN ||
                        record.map_token_id == CONTRACT_ADDRESS_GGC ? (
                          <div>
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
                            {record.type == "trc20" ? (
                              <TokenTRC20Link
                                name={record.map_token_id}
                                address={record.contract_address}
                                namePlus={record.map_token_name_abbr}
                              />
                            ) : (
                              <TokenLink
                                id={record.map_token_id}
                                name={record.map_token_name_abbr}
                              />
                            )}
                          </div>
                        ) : (
                          <div>
                            {isAddressValid(record.map_token_name_abbr) ? (
                              <span>
                                {tu("address_transfer_unrecorded_token")}
                              </span>
                            ) : (
                              <div>
                                <img
                                  width={20}
                                  height={20}
                                  src={record.map_amount_logo}
                                  style={{ marginRight: 5 }}
                                  onError={e => {
                                    e.target.onerror = null;
                                    e.target.src = defaultImg;
                                  }}
                                />
                                {record.type == "trc20" ? (
                                  <TokenTRC20Link
                                    name={record.map_token_id}
                                    address={record.contract_address}
                                    namePlus={record.map_token_name_abbr}
                                  />
                                ) : (
                                  <TokenLink
                                    id={record.map_token_id}
                                    name={
                                      record.map_token_name_abbr
                                        ? record.map_token_name_abbr
                                        : record.token_name
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                }
            },
            // {
            //     title: upperFirst(intl.formatMessage({id: 'address_balance_token_type'})),
            //     dataIndex: 'type',
            //     key: 'type',
            //     align: 'left',
            //     className: 'ant_table',
            //     render: (text, record, index) => {
            //         return <div className="text-uppercase">{text}</div>
            //     }
            // },
            // {
            //     title: upperFirst(intl.formatMessage({id: 'address_net_fee'})),
            //     dataIndex: 'address_net_fee',
            //     key: 'address_net_fee',
            //     align: 'left',
            //     className: 'ant_table',
            //     render: (text, record, index) => {
            //         return <span>
            //             {
            //                 record.cost?
            //                     <FormattedNumber value={record.cost.net_usage + record.cost.net_fee/10 }/>
            //                     : <span>-</span>
            //
            //
            //             }
            //         </span>
            //     }
            // },
            // {
            //     title: upperFirst(intl.formatMessage({id: 'address_energy_fee'})),
            //     dataIndex: 'address_energy_fee',
            //     key: 'address_energy_fee',
            //     align: 'left',
            //     className: 'ant_table',
            //     render: (text, record, index) => {
            //         return <span>
            //             {
            //                 record.cost?
            //                     <FormattedNumber value={record.cost.energy_usage_total}/>
            //                     : <span>-</span>
            //             }
            //         </span>
            //     }
            // },
        ];
        return column;
    }

    onDateOk (start,end) {
        this.start = start.valueOf();
        this.end = end.valueOf();
        let { page, pageSize } = this.state;
        this.setState({
            page:1
        }, () => {
            this.load(1, pageSize);    
        })
        
    }



    render() {

        let {transfers, filter, total, rangeTotal = 0, loading, emptyState: EmptyState = null} = this.state;
        let {intl, istrc20, address = false,activeLanguage} = this.props;
        let column = this.customizedColumn(activeLanguage);
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'transfers_unit'})
        let locale  = {emptyText: intl.formatMessage({id: 'no_transfers'})}
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
            <div className="token_black transfersAll-container" style={{padding:'30px 0'}}>
                {loading && <div className="loading-style"><TronLoader/></div>}
                <div className="d-flex justify-content-between" style={{right: 'auto'}}>
                    
                </div>
                <div style={{marginBottom:'20px'}}>
                    {
                        address ?  <div>
                            <DateSelect onDateOk={(start,end) => this.onDateOk(start,end)}  />
                        </div> : ''
                    }
                </div>
                <div>
                    {!loading && <TotalInfo total={total} rangeTotal={rangeTotal} typeText="transactions_unit" divClass="table_pos_info_addr" selected/> }
                </div>
                {
                    (!loading && transfers.length === 0)?
                        <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
                        :
                        <div className={isMobile ? "pt-5":null}>
                            <SmartTable  
                                position="bottom" 
                                bordered={true} 
                                loading={loading} 
                                column={column} 
                                data={transfers} 
                                total={rangeTotal > 2000 ? 2000 : rangeTotal} 
                                locale={locale} 
                                addr="address" 
                                nopadding={true}
                                current={this.state.page}
                                onPageChange={(page, pageSize) => {
                                    this.onChange(page, pageSize)
                                }}/>
                        </div>
                       
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
      activeLanguage: state.app.activeLanguage,
    };
}


export default connect(mapStateToProps)(withTimers(injectIntl(TransfersAll)));
