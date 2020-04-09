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
//import {ContractTypes} from "../../utils/protocol";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {TRXPrice} from "../common/Price";
import {ONE_TRX} from "../../constants";
import TotalInfo from "../common/TableTotal";
//import DateRange from "../common/DateRange";
import moment from 'moment';
//import {DatePicker} from "antd/lib/index";
import BlockTime from '../common/blockTime'
import { Tooltip,Icon } from 'antd';



class ContractTrans extends React.Component {

    constructor() {
        super();
        this.start = moment([2018,5,25]).startOf('day').valueOf();
        this.end = moment().valueOf();
        this.state = {
            transactions: [],
            total: 0,
        };
    }

    // componentWillReceiveProps() {
    //   setTimeout(() => {
    //     this.loadTriggers();
    //   }, 0)
    // }

    componentDidMount() {
        this.loadTriggers();
    }

    componentDidUpdate() {
        // checkPageChanged(this, this.loadTriggers);
    }

    onChange = (page, pageSize) => {
        this.loadTriggers(page, pageSize);
    };

    loadTriggers = async (page = 1, pageSize = 20) => {

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
        if (date_start) {
            result = await Client.getContractTriggers({
                sort: '-timestamp',
                date_start: date_start,
                date_to: date_to
            });
        }
        else {
            result = await Client.getContractTriggers({
                sort: '-timestamp',
                limit: pageSize,
                start: (page - 1) * pageSize,
                start_timestamp:this.start,
                end_timestamp:this.end,
                ...searchParams,
            });
        }   
        let triggerList = result.triggers;
        triggerList.forEach(item=>{
            if(result.contractMap){
                result.contractMap[item.ownerAddress]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
            }
        })
        this.setState({
            transactions: triggerList,
            loading: false,
            total: result.total,
            rangeTotal:result.rangeTotal,
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
                title: upperFirst(intl.formatMessage({id: 'age'})),
                dataIndex: 'timestamp',
                key: 'timestamp',
                align: 'left',
                width:'14%',
                render: (text, record, index) => {
                    return <BlockTime time={text}></BlockTime>
                    // <TimeAgo date={text} title={moment(text).format("MMM-DD-YYYY HH:mm:ss A")}/>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'contract_triggers_owner'})),
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
                            <AddressLink address={text} isContract={true}>{text}</AddressLink>
                        </span>
                        ) : <AddressLink address={text}>{text}</AddressLink>
                        }
                    </span>
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'contract_address'})),
                dataIndex: 'contractAddress',
                key: 'contractAddress',
                align: 'left',
                width: '30%',
                className: 'ant_table',
                render: (text, record, index) => {
                    return  <span className="d-flex">
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
                }
            },
            {
                title: upperFirst(intl.formatMessage({id: 'value'})),
                dataIndex: 'callValue',
                key: 'callValue',
                align: 'left',
                className: 'ant_table',
                render: (text, record, index) => {
                    return <TRXPrice amount={text / ONE_TRX}/>
                }
            },

        ];
        return column;
    };

    onDateOk (start,end) {
        this.start = start.valueOf();
        this.end = end.valueOf();
        let {page, pageSize} = this.state;
        this.loadTriggers(page,pageSize);
    }

    render() {
        let {transactions, total,rangeTotal, loading} = this.state;
        let {match, intl} = this.props;
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'contract_triggers_total'})

        return (
            <main className="container header-overlap pb-3 token_black">
                {loading && <div className="loading-style"><TronLoader/></div>}
                <div className="row">
                    <div className="col-md-12 table_pos">
                        {total ?<TotalInfo total={total} rangeTotal={rangeTotal} typeText="contract_triggers_total" markName="table-question-mark-triggers" isQuestionMark={false} />:""}
                        {/*{*/}
                          {/*total ? <DateRange onDateOk={(start,end) => this.onDateOk(start,end)} /> :''*/}
                        {/*}*/}
                        <SmartTable bordered={true} loading={loading}
                                    column={column} data={transactions} total={total}
                                    onPageChange={(page, pageSize) => {
                                        this.loadTriggers(page, pageSize)
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ContractTrans));
