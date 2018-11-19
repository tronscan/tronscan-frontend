import React, {Fragment} from "react";
import {tu} from "../../utils/i18n";
import { Table } from 'antd';
import { filter, map ,upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import SmartTable from "../common/SmartTable.js"
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";


class Proposal extends React.Component {

    constructor() {
        super();
        this.state = {
            dataSource:[],
            total:0
        };
    }

    componentDidMount() {
        this.load();
    }

    onChange = (page, pageSize) => {
        this.load(page, pageSize);
    };

    load = async (page = 1, pageSize = 20) => {

        this.setState({ loading: true });

        let {proposal, total} = await Client.getProposalList({
            sort: '-number',
            limit: pageSize,
            start: (page-1) * pageSize,
        });
        console.log('proposal',proposal)
        this.setState({
            dataSource: proposal,
            total,
            page
        })
    };

    getColumns() {
        let { intl } = this.props;
        let { dataSource } = this.state;

        const columns = [{
            title: upperFirst(intl.formatMessage({id: '序号'})),
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return  '#' + (index+1)
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: '提议内容'})),
            dataIndex: 'content',
            key: 'content',
            render: (text, record, index) => {
                return (
                    <span className='col-green'>{text}</span>
                )
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: '提议者'})),
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return ( record.proposer.name?
                    <AddressLink address={record.proposer.address}>{record.proposer.name}</AddressLink>:
                    <AddressLink address={record.proposer.address}>{record.proposer.address}</AddressLink>

                )
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: '创建时间(UTC)'})),
            dataIndex: 'createTime',
            key: 'createTime',
            render: (text, record, index) => {
                return <span>
                        <FormattedDate value={Number(text)}/>&nbsp;
                        <FormattedTime value={Number(text)}/>&nbsp;
                </span>
            }

        },

        {
            title:upperFirst(intl.formatMessage({id: '提议状态'})),
            dataIndex: 'state',
            key: 'state',
            render: (text, record, index) => {
                return (
                    <span className='col-green'>{text}</span>
                )
            }
        },
        {
            title:"",
            dataIndex: 'details',
            key: 'details',
            render: (text, record, index) => {
                return (
                    <Link
                        to={`/proposals/${record.proposalId}`}
                        className="float-right text-primary btn btn-default btn-sm">
                        {tu("learn_more")}
                    </Link>

                )
            }
        }];

        return columns
    }

    async proposalDetails (){

    }

    render() {

        let {page, total, pageSize, loading, dataSource, emptyState: EmptyState = null} = this.state;
        let column = this.getColumns();
        let {intl} = this.props;

        let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'token_unit'})
        let locale  = {emptyText: intl.formatMessage({id: 'no_tokens_found'})}
        // if (Object.keys(balances).length === 0 || (Object.keys(balances).length === 1 && balances[0].name === "TRX")) {
        //     if (!EmptyState) {
        //         return (
        //             <div className="text-center p-3 no-data">
        //                 {tu("no_tokens_found")}
        //             </div>
        //         );
        //     }
        //     return <EmptyState />;
        // }
        return (
            <main className="container header-overlap committee">
                <div className="token_black table_pos">
                    <SmartTable bordered={true} column={column} data={dataSource} total={dataSource.length} locale={locale} addr="address"/>
                </div>
            </main>
        )
    }
}


export default injectIntl(Proposal);
