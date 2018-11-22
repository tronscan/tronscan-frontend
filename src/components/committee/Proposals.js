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
import {ONE_TRX} from "../../constants";

class Proposal extends React.Component {

    constructor() {
        super();
        this.state = {
            dataSource:[],
            total:0,
            loading: false,
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
        let parametersArr = [
            'MAINTENANCE_TIME_INTERVAL',
            'ACCOUNT_UPGRADE_COST',
            'CREATE_ACCOUNT_FEE',
            'TRANSACTION_FEE',
            'ASSET_ISSUE_FEE',
            'WITNESS_PAY_PER_BLOCK',
            'WITNESS_STANDBY_ALLOWANCE',
            'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT',
            'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE',
            'ALLOW_CREATION_OF_CONTRACTS',
            'REMOVE_THE_POWER_OF_THE_GR',
            'ENERGY_FEE',
            'EXCHANGE_CREATE_FEE',
            'MAX_CPU_TIME_OF_ONE_TX',
        ];
        for(let item in proposal){
            for(let j in proposal[item]['paramters']){
                proposal[item]['key'] = parametersArr[j];
                proposal[item]['proposalVal'] = proposal[item]['paramters'][j];
            }
        }
        this.setState({
            loading: false,
            dataSource: proposal,
            total,
            page
        })
    };

    getColumns() {
        let { intl } = this.props;
        let { dataSource } = this.state;

        const columns = [{
            title: upperFirst(intl.formatMessage({id: 'propose_number'})),
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => {
                return  '#' + (dataSource.length - index)
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'proposal_content_info'})),
            dataIndex: 'proposalVal',
            key: 'proposalVal',
            width:'40%',
            render: (text, record, index) => {
                return  <div>
                    {
                        record.key == 'MAINTENANCE_TIME_INTERVAL' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / (1000 * 60 * 60)}</span> &nbsp;
                            <span>{intl.formatMessage({id: "propose_hour"})}
                            </span>
                        </div>
                    }
                    {
                        record.key == 'ACCOUNT_UPGRADE_COST' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'CREATE_ACCOUNT_FEE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'TRANSACTION_FEE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text}</span> &nbsp;
                            <span>Sun/byte</span>
                        </div>
                    }
                    {
                        record.key == 'ASSET_ISSUE_FEE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'WITNESS_PAY_PER_BLOCK' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'WITNESS_STANDBY_ALLOWANCE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span></div>
                    }
                    {
                        record.key == 'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span></div>
                    }
                    {
                        record.key == 'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text}</span> &nbsp;
                            <span>bandwith/byte</span>
                        </div>
                    }
                    {
                        record.key == 'ALLOW_CREATION_OF_CONTRACTS' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                            <span className='col-green'>{tu('propose_activate')}</span>
                        </div>
                    }
                    {
                        record.key == 'REMOVE_THE_POWER_OF_THE_GR' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                        </div>
                    }
                    {
                        record.key == 'ENERGY_FEE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX} TRX</span>
                        </div>
                    }
                    {
                        record.key == 'EXCHANGE_CREATE_FEE' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text / ONE_TRX} TRX</span>
                        </div>
                    }
                    {
                        record.key == 'MAX_CPU_TIME_OF_ONE_TX' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span className='col-green'>{text} ms</span>
                        </div>
                    }
                </div>

            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'proposer'})),
            dataIndex: 'name',
            key: 'name',
            width:'200px',
            render: (text, record, index) => {
                return ( record.proposer.name?
                    <AddressLink address={record.proposer.address}>{record.proposer.name}</AddressLink>:
                    <AddressLink address={record.proposer.address}>{record.proposer.address}</AddressLink>

                )
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'proposal_time_of_creation'})),
            dataIndex: 'createTime',
            key: 'createTime',
            width:'15%',
            render: (text, record, index) => {
                return <span>
                        <FormattedDate value={Number(text)}/>&nbsp;
                        <FormattedTime value={Number(text)}/>&nbsp;
                </span>
            }

        },

        {
            title:upperFirst(intl.formatMessage({id: 'proposal_status'})),
            dataIndex: 'state',
            key: 'state',
            render: (text, record, index) => {
                return <div>
                    {
                        text == 'PENDING' &&
                        <div>
                            <span className="badge badge-warning text-uppercase badge-success-radius">{tu("proposal_voting")}</span>
                        </div>
                    }
                    {
                        text == 'DISAPPROVED' &&
                        <div>
                            <span className="badge badge-danger text-uppercase badge-success-radius">{tu("proposal_ineffective")}</span>
                        </div>
                    }
                    {
                        text == 'APPROVED' &&
                        <div>
                            <span className="badge badge-success text-uppercase badge-success-radius">{tu("proposal_effective")}</span>
                        </div>
                    }
                    {
                        text == 'CANCELED' &&
                        <div>
                            <span className="badge text-uppercase badge-success-radius">{tu("proposal_cancelled")}</span>
                        </div>
                    }
                </div>
            }
        },
        {
            title:"",
            dataIndex: 'details',
            key: 'details',
            render: (text, record, index) => {
                return (
                    <Link
                        to={`/proposal/${record.proposalId}`}
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
        let locale  = {emptyText: intl.formatMessage({id: 'no_commission_proposed_found'})}



        return (
            <main className="container header-overlap committee">
                <div className="token_black table_pos">
                    {loading && <div className="loading-style"><TronLoader/></div>}
                    <SmartTable bordered={true} column={column} data={dataSource} total={dataSource.length} locale={locale} addr="address"/>
                </div>
            </main>
        )
    }
}


export default injectIntl(Proposal);
