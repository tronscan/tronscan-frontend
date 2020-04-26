/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
// import TimeAgo from "react-timeago";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {getQueryParams} from "../../utils/url";
import {Truncate} from "../common/text";
import {ContractTypes} from "../../utils/protocol";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import TotalInfo from "../common/TableTotal";
import DateRange from "../common/DateRange";
import {DatePicker} from 'antd';
import moment from 'moment';
//import xhr from "axios/index";
import queryString from 'query-string';
import BlockTime from '../common/blockTime'
import {tu} from '../../utils/i18n';
import { Tooltip,Icon } from 'antd';


const RangePicker = DatePicker.RangePicker;


class Transactions extends React.Component {
    constructor() {
        super();

        this.start = moment([2018,5,25]).startOf('day').valueOf();
        this.end = moment().valueOf();
        this.state = {
            transactions: [],
            total: 0,
            contractMap:{}
        };
        this.addressLock = false
    }

    // componentWillReceiveProps() {
    //   setTimeout(() => {
    //     this.loadTransactions();
    //   }, 0)
    // }

    componentDidMount() {
        this.loadTransactions();
    }

    componentDidUpdate(prevProps) {
        let {location, match} = this.props;


        if(location.search !== prevProps.location.search){
            this.loadTransactions();
        }
        // checkPageChanged(this, this.loadTransactions);
    }

    onChange = (page, pageSize) => {
        this.loadTransactions(page, pageSize);
    };

    loadTransactions = async (page = 1, pageSize = 20) => {

        let {location, match} = this.props;
        let date_to = match.params.date;
        let date_start = parseInt(match.params.date) - 24 * 60 * 60 * 1000;
        this.setState(
            {
                loading: true,
                page: page,
                pageSize: pageSize,
            }
        );

        let searchParams = {};
        for (let [key, value] of Object.entries(getQueryParams(location))) {
            switch (key) {
                case "address":
                case "block":
                    searchParams[key] = value;
                    break;
            }
        }
        let result = null;
        let transactions = [];
        let total = 0;
        let wholeChainTxCount,rangeTotal;
        if (date_start) {
            result = await Client.getTransactions({
                sort: '-timestamp',
                date_start: date_start,
                date_to: date_to
            });

        }
        else {

            const address = queryString.parse(location.search).address;
            if(address){
                const allData = await Promise.all([
                    Client.getTransactions({
                        sort: '-timestamp',
                        limit: pageSize,
                        start: (page - 1) * pageSize,
                        ...searchParams,
                    }),
                    Client.getTransactions({
                        limit: 0,
                        ...searchParams,
                    })
                ]).catch(e => {
                    console.log('error:' + e);
                });
                let [{ transactions,contractMap }, { rangeTotal, total }] = allData;
                transactions.forEach(item=>{
                    if(contractMap){
                        contractMap[item.ownerAddress]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
                        contractMap[item.toAddress]? (item.toIsContract = true) :  (item.toIsContract = false)
                    }
                })
                this.setState({
                    total: total,
                    transactions: transactions,
                    addressLock: true,
                    rangeTotal: rangeTotal
                })
            }else{
                const allData = await Promise.all([
                    Client.getTransactions({
                        sort: '-timestamp',
                        limit: pageSize,
                        start: (page - 1) * pageSize,
                        start_timestamp:this.start,
                        end_timestamp:this.end,
                        ...searchParams,
                    }),
                    Client.getTransactions({
                        limit: 0,
                        ...searchParams,
                    })
                ]).catch(e => {
                    console.log('error:' + e);
                });
                let [{ transactions,contractMap }, { wholeChainTxCount, total }] = allData;
                transactions.forEach(item=>{
                    if(contractMap){
                        contractMap[item.ownerAddress]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
                        contractMap[item.toAddress]? (item.toIsContract = true) :  (item.toIsContract = false)
                    }
                })
              
                this.setState({
                    total: total,
                    transactions: transactions,
                    addressLock: false,
                    rangeTotal: wholeChainTxCount
                })
            }

        }
        this.setState({
            loading: false,
        });
    };

    customizedColumn = () => {
        let {intl} = this.props;
        let column = [
            {
                title: '#',
                dataIndex: 'hash',
                key: 'hash',
                align: 'left',
                className: 'ant_table',
                width: '12%',
                render: (text, record, index) => {
                    return <Truncate>
                      <TransactionHashLink hash={text}>{text}</TransactionHashLink>
                    </Truncate>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'block'})),
                dataIndex: 'block',
                key: 'block',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <BlockNumberLink number={text}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'created'})),
                dataIndex: 'timestamp',
                key: 'timestamp',
                align: 'left',
                render: (text, record, index) => {
                    return <BlockTime time={text}></BlockTime>
                    // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'status'})),
                dataIndex: 'confirmed',
                key: 'confirmed',
                align: 'left',
                className: 'ant_table',
                width: '14%',
                render: (text, record, index) => {
                    return  text ? <span><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Verified.png")}/> {tu('full_node_version_confirmed')}</span> : <span><img style={{ width: "20px", height: "20px" }} src={require("../../images/contract/Unverified.png")}/> {tu('full_node_version_unconfirmed')}</span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'address'})),
                dataIndex: 'ownerAddress',
                key: 'ownerAddress',
                align: 'left',
                width: '30%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>
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
                                <AddressLink address={text} isContract={true}/>
                            </span>
                            ) : <AddressLink address={text}/>
                        }
                    </span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'transaction_type'})),
                dataIndex: 'contractType',
                key: 'contractType',
                align: 'right',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <span>{ContractTypes[text] && tu(`transaction_${ContractTypes[text]}`)}</span>
                },
            },
            // {
            //   title: upperFirst(intl.formatMessage({id: 'status'})),
            //   dataIndex: 'confirmed',
            //   key: 'confirmed',
            //   align: 'center',
            //   className: 'ant_table',
            //   render: (text, record, index) => {
            //       return record.confirmed?
            //           <span className="badge badge-success text-uppercase">{intl.formatMessage({id:'Confirmed'})}</span> :
            //           <span className="badge badge-danger text-uppercase">{intl.formatMessage({id: 'Unconfirmed'})}</span>
            //   },
            // }
        ];
        return column;
    }

    onDateOk (start,end) {
        this.start = start.valueOf();
        this.end = end.valueOf();
        let {page, pageSize} = this.state;
        this.loadTransactions(page,pageSize);
    }

    render() {

        let {transactions, total, rangeTotal, loading, addressLock,dateStart,dateEnd} = this.state;
        let {match, intl} = this.props;
        let column = this.customizedColumn();
        return (
            <main className="container header-overlap pb-3 token_black">
                {loading && <div className="loading-style"><TronLoader/></div>}
              <div className="row">
                <div className="col-md-12 table_pos">
                    {total ? <TotalInfo total={total} rangeTotal={rangeTotal} typeText="transactions_unit" common={addressLock} isQuestionMark={false} />:""}
                    {
                        false && !addressLock && total?  <DateRange onDateOk={(start,end) => this.onDateOk(start,end)} /> : ''
                    }
                  <SmartTable bordered={true} loading={loading}
                              column={column} data={transactions} total={total}
                              onPageChange={(page, pageSize) => {
                                  this.loadTransactions(page, pageSize)
                              }}/>
                </div>
              </div>
            </main>
        )
    }
}

function mapStateToProps(state) {

    return {};
}

const mapDispatchToProps = {
    loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Transactions));
