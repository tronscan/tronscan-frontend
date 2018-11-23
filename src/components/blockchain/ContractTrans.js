/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {loadTokens} from "../../actions/tokens";
import {connect} from "react-redux";
import TimeAgo from "react-timeago";
import {Client} from "../../services/api";
import {AddressLink, BlockNumberLink, TransactionHashLink} from "../common/Links";
import {getQueryParams} from "../../utils/url";
import {Truncate} from "../common/text";
import {ContractTypes} from "../../utils/protocol";
import {upperFirst} from "lodash";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {TRXPrice} from "../common/Price";
import {ONE_TRX} from "../../constants";
import {QuestionMark} from "../common/QuestionMark.js"

class ContractTrans extends React.Component {

    constructor() {
        super();
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

        this.setState({loading: true});

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
                total: this.state.total,
                ...searchParams,
            });
        }
        this.setState({
            transactions: result.triggers,
            loading: false,
            total: result.total
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
                render: (text, record, index) => {
                    return <TimeAgo date={text}/>
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
                    return <AddressLink address={text}/>
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
                    return <AddressLink address={text} isContract={true}/>
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
    }

    render() {

        let {transactions, total, loading} = this.state;
        let {match, intl} = this.props;
        let column = this.customizedColumn();
        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'contract_triggers_total'})

        return (
            <main className="container header-overlap pb-3 token_black">
                {loading && <div className="loading-style"><TronLoader/></div>}
                <div className="row">
                    <div className="col-md-12 table_pos">
                        {total ? <div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>{tableInfo}<span> <QuestionMark placement="top" text="to_provide_a_better_experience"></QuestionMark></span></div> : ''}
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
