import React, {Fragment} from "react";
import { injectIntl} from "react-intl";
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
import TotalInfo from "./TableTotal";
import DateRange from "./DateRange";
import moment from 'moment';
import { toThousands } from '../../utils/number'
import _ from "lodash";
import { Radio } from 'antd';
import {isAddressValid} from "@tronscan/client/src/utils/crypto";
import { CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC } from "../../constants";
import qs from 'qs'
import DateSelect from './dateSelect'
import {API_URL} from "../../constants";
import BlockTime from '../common/blockTime';
import { Tooltip,Icon } from 'antd';



class TransfersAll extends React.Component {
    constructor(props) {
        super(props);

        this.start = moment([2018,5,25]).startOf('day').valueOf();
        this.end = moment().valueOf();
        this.state = {
            filter: {
                direction:'all'
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
        };
    }

    componentDidMount() {
        let {page, pageSize} = this.state;
        // this.load(page,pageSize);

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
        let {showTotal,hideSmallCurrency,tokenNam,filter} = this.state;
        const params = {
            sort: '-timestamp',
            count: showTotal ? true : null,
            total: this.state.total,
            start_timestamp:this.start,
            end_timestamp:this.end,
            ...filter,
            ...id,
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

        const [{ transfers, total:totaldata, rangeTotal,contractMap }, { count } ] = allData;

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
        rebuildRransfers.forEach(item=>{
            if(contractMap){
                if(item.type == 'trc10'){
                    contractMap[item.owner_address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
                }else{
                    contractMap[item.from_address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
                }
                contractMap[item.to_address]? (item.toIsContract = true) :  (item.toIsContract = false)
            }
        })
        // console.log(rebuildRransfers)
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

    customizedColumn = (activeLanguage) => {
        let { intl } = this.props;
            const defaultImg = require("../../images/logo_default.png");

        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'hash'})),
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                width: '9%',
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
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'result' })),
                dataIndex: 'contractRet',
                key: 'contractRet',
                align: 'left',
                className: 'ant_table',
                width: '11%',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'block' })),
                dataIndex: 'block',
                key: 'block',
                align: 'left',
                className: 'ant_table',
                width: '9%',
                render: (text, record, index) => {
                    return <BlockNumberLink number={record.block}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'age'})),
                dataIndex: 'date_created',
                key: 'date_created',
                align: 'left',
                className: 'ant_table',
                width: '14%',
                render: (text, record, index) => {
                    return <BlockTime time={text}></BlockTime>
                    // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
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
                    return  <span>
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
                                {record.fromtip ?
                                    <AddressLink address={record.type == 'trc10'?text:record.from_address} isContract={true}>{record.type == 'trc10'?text:record.from_address}</AddressLink>
                                    :
                                    <TruncateAddress address={record.type == 'trc10'?text:record.from_address}>{record.type == 'trc10'?text:record.from_address}</TruncateAddress>}
                            </span>
                            ) : (
                                record.fromtip ?
                                    <AddressLink address={record.type == 'trc10'?text:record.from_address}>{record.type == 'trc10'?text:record.from_address}</AddressLink>:
                                    <TruncateAddress address={record.type == 'trc10'?text:record.from_address}>{record.type == 'trc10'?text:record.from_address}</TruncateAddress>
                            )
                        }
                    </span>
                }
            },
            {
                title: '',
                className: 'ant_table',
                width: '5%',
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
                    return <span>
                        {/*  Distinguish between contract and ordinary address */}
                        {record.toIsContract? (
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
                                {record.totip ?
                                    <AddressLink address={text} isContract={true}>{text}</AddressLink>
                                    :
                                    <TruncateAddress address={text}>{text}</TruncateAddress>}
                            </span>
                            ) : (
                                record.totip ?
                                    <AddressLink address={text}>{text}</AddressLink>:
                                    <TruncateAddress address={text}>{text}</TruncateAddress>
                            )
                        }
                    </span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'amount'})),
                dataIndex: 'amount',
                key: 'amount',
                align: 'center',
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
                render: (text, record, index) => {
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

    onRadioChange = (e) => {
        this.setState({
            filter: {
                direction: e.target.value,
            }
        }, () =>  this.load())
    };

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
            <div className="token_black table_pos transfers-Container">
                {loading && <div className="loading-style"><TronLoader/></div>}
                <div className="d-flex justify-content-between" style={{right: 'auto'}}>
                    {!loading && <TotalInfo total={total} rangeTotal={rangeTotal} typeText="transactions_unit" divClass="table_pos_info_addr" selected/> }
                    {
                        address ?  <div>
                            <DateSelect onDateOk={(start,end) => this.onDateOk(start,end)}  />
                        </div> : ''
                    }
                </div>
                {
                    transfers.length > 0 &&  <div className="d-flex align-items-center">
                        <div className="address-transfers-radio">
                            <Radio.Group size="Small" value={filter.direction}  onChange={this.onRadioChange}>
                                <Radio.Button value="all">{tu('address_transfer_all')}</Radio.Button>
                                <Radio.Button value="in">{tu('address_transfer_in')}</Radio.Button>
                                <Radio.Button value="out">{tu('address_transfer_out')}</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                }
                {
                    (!loading && transfers.length === 0)?
                        <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
                        :
                        <SmartTable bordered={true} loading={loading} column={column} data={transfers} total={rangeTotal > 2000 ? 2000 : rangeTotal} locale={locale} addr="address" transfers="address"
                                    current={this.state.page}
                                    onPageChange={(page, pageSize) => {
                                        this.onChange(page, pageSize)
                                    }}/>
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