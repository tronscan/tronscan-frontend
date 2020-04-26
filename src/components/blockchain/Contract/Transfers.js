import React, {Fragment} from "react";
import {Client} from "../../../services/api";
import {AddressLink, TransactionHashLink, TokenTRC20Link} from "../../common/Links";
import {tu, t} from "../../../utils/i18n";
// import TimeAgo from "react-timeago";
import moment from 'moment';
import {Truncate} from "../../common/text";
import {withTimers} from "../../../utils/timing";
import {FormattedNumber, injectIntl} from "react-intl";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import {TronLoader} from "../../common/loaders";
import TotalInfo from "../../common/TableTotal";
// import DateRange from "../../common/DateRange";
import DateSelect from "../../common/newDateSelect";
//import xhr from "axios/index";
//import {API_URL} from '../../../constants.js'
import { FormatNumberByDecimals } from '../../../utils/number'
import BlockTime from '../../common/blockTime'
import { Tooltip,Icon } from 'antd';



class Transfers extends React.Component {

    constructor(props) {
        super(props);
        this.start = moment(Date.now() - 7 * 24 * 3600 * 1000).valueOf();
        this.end = moment().valueOf();
        this.state = {
            filter: {},
            transfers: [],
            page: 0,
            total: 0,
            pageSize: 25,
            showTotal: props.showTotal !== false,
            emptyState: props.emptyState,
            autoRefresh: props.autoRefresh || false
        };
    }

    componentDidMount() {
        this.loadPage();

        if (this.state.autoRefresh !== false) {
            this.props.setInterval(() => this.load(), this.state.autoRefresh);
        }
    }

    onChange = (page, pageSize) => {
        this.loadPage(page, pageSize);
    };

    loadPage = async (page = 1, pageSize = 20) => {

        let {filter} = this.props;

        let {showTotal} = this.state;
        this.setState(
            {
                loading: true,
                page: page,
                pageSize: pageSize,
            }
        );

        let {list, total, rangeTotal} = await Client.getTokenTRC20Transfers({
            limit: pageSize,
            start: (page - 1) * pageSize,
            contract_address: filter.token,
            start_timestamp:this.start,
            end_timestamp:this.end,
        });
        let transfers = list;
        for (let index in transfers) {
            transfers[index].index = parseInt(index) + 1;
        }

        this.setState({
            page,
            transfers,
            total,
            rangeTotal,
            loading: false,
        });
    };

    customizedColumn = () => {
        let {intl,token} = this.props;
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'hash'})),
                dataIndex: 'transactionHash',
                key: 'transactionHash',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <Truncate>
                        <TransactionHashLink hash={record.transaction_id}>
                            {record.transaction_id}
                        </TransactionHashLink>
                    </Truncate>

                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'age'})),
                dataIndex: 'timestamp',
                key: 'timestamp',
                width: '150px',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <BlockTime time={Number(record.block_ts)}></BlockTime>

                    // <TimeAgo date={Number(record.block_ts)} title={moment(record.block_ts).format("MMM-DD-YYYY HH:mm:ss A")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'from'})),
                dataIndex: 'transferFromAddress',
                key: 'transferFromAddress',
                className: 'ant_table',
                render: (text, record, index) => {
                    return  <span>
                    {/*  Distinguish between contract and ordinary address */}
                    {record.fromAddressIsContract? (
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
                        <AddressLink address={record.from_address} isContract={true}>{record.from_address}</AddressLink>
                      </span>
                      ) : <AddressLink address={record.from_address}>{record.from_address}</AddressLink>
                    }
                  </span>
                   
                }
            },
            {
                title: '',
                className: 'ant_table',
                width: '30px',
                render: (text, record, index) => {
                    return <img src={require("../../../images/arrow.png")}/>
                },
            },
            {
                title: upperFirst(intl.formatMessage({id: 'to'})),
                dataIndex: 'transferToAddress',
                key: 'transferToAddress',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>
                    {/*  Distinguish between contract and ordinary address */}
                    {record.toAddressIsContract? (
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
                        <AddressLink address={record.to_address} isContract={true}>{record.to_address}</AddressLink>
                      </span>
                      ) : <AddressLink address={record.to_address}>{record.to_address}</AddressLink>
                    }
                  </span>
                },
            },
            {
                title: upperFirst(intl.formatMessage({id: 'status'})),
                dataIndex: 'status',
                key: 'status',
                align: 'left',
                className: 'ant_table',
                width:'15%',
                render: (text, record, index) => {
                    return (
                        <div>
                            {/* {
                                record.confirmed ?
                                    <span className="badge badge-success text-uppercase">{tu("Confirmed")}</span> :
                                    <span className="badge badge-danger text-uppercase">{tu("Unconfirmed")}</span>
                            } */}
                            {
                                record.confirmed ? 
                                    <span><img style={{ width: "20px", height: "20px" }} src={require("../../../images/contract/Verified.png")}/> {tu('full_node_version_confirmed')}</span>
                                     : 
                                    <span><img style={{ width: "20px", height: "20px" }} src={require("../../../images/contract/Unverified.png")}/> {tu('full_node_version_unconfirmed')}</span>
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
                width: '10%',
                render: (text, record, index) => {
                    return <span>{text}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'amount'})),
                dataIndex: 'amount',
                key: 'amount',
                width: '200px',
                align: 'right',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>
                    {/*<FormattedNumber value={parseFloat(record.quant) / (Math.pow(10,token.decimals))}/>*/}
                        <span>{ FormatNumberByDecimals(record.quant , token.decimals) }</span>
                    &nbsp;&nbsp;
                    <TokenTRC20Link name={token.symbol} address={token.contract_address} />
                </span>

                },
            },

        ];

        return column;
    }
    onDateOk (start,end) {
        this.start = start.valueOf();
        this.end = end.valueOf();
        let {page, pageSize} = this.state;
        this.loadPage(page,pageSize);
    }

    render() {

        let {transfers, page, total, rangeTotal, pageSize, loading, emptyState: EmptyState = null} = this.state;
        if(total == 0){
            transfers =[];
        }
        let {theadClass = "thead-dark", intl} = this.props;
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'a_totle'})+' ' + total +' '+ intl.formatMessage({id: 'transaction_info'});
        // if (!loading && transfers.length === 0) {
        //     if (!EmptyState) {
        //         return (
        //             <div className="p-3 text-center no-data">{tu("no_transfers")}</div>
        //         );
        //     }
        //
        //     return <EmptyState/>;
        // }

        return (
            <Fragment>
                {loading && <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>}
                <div className="row transfers">
                    <div className="col-md-12 table_pos">
                        <div className="d-flex justify-content-between pl-3 pr-3 pt-3 pb-3">
                            <DateSelect  onDateOk={(start, end) => this.onDateOk(start, end)}></DateSelect> 
                        </div>
                        <div className="d-flex justify-content-between pl-3 pr-3" style={{left: 'auto'}}>
                            {<TotalInfo top={60} total={total} rangeTotal={rangeTotal} typeText="transaction_info" divClass="table_pos_info_addr"/> }
                    
                        </div>
                        <div className="contractTableWrapper">
                            {
                                (!loading && transfers.length === 0)?
                                    <div className="pt-5 pb-5 text-center no-data transfers-bg-white">{tu("no_transfers")}</div>
                                : <SmartTable  position="bottom" border={false} loading={loading} column={column} data={transfers} total={total} addr="address" transfers="token"
                                            onPageChange={(page, pageSize) => {
                                                this.loadPage(page, pageSize)
                                            }}/>
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withTimers(injectIntl(Transfers));
