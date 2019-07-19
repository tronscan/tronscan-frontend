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
            'getMaintenanceTimeInterval',
            'getAccountUpgradeCost',
            'getCreateAccountFee',
            'getTransactionFee',
            'getAssetIssueFee',
            'getWitnessPayPerBlock',
            'getWitnessStandbyAllowance',
            'getCreateNewAccountFeeInSystemContract',
            'getCreateNewAccountBandwidthRate',
            'getAllowCreationOfContracts',
            'getRemoveThePowerOfTheGr',
            'getEnergyFee',
            'getExchangeCreateFee',
            'getMaxCpuTimeOfOneTx',
            'getAllowUpdateAccountName',
            'getAllowSameTokenName',
            'getAllowDelegateResource',
            'getTotalEnergyLimit',
            'getAllowTvmTransferTrc10',
            'getTotalEnergyLimitNew',
            'getAllowMultiSign',
           // 'getTotalEnergyCurrentLimit',
            'getAllowAdaptiveEnergy',
            //'getTotalEnergyTargetLimit',
            //'getTotalEnergyAverageUsage',
            'getUpdateAccountPermissionFee',
            'getMultiSignFee',
            '',
            '',
            'getAllowTvmConstantinople'
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
                        record.key == 'getMaintenanceTimeInterval' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / (1000 * 60 * 60)}</span> &nbsp;
                            <span>{intl.formatMessage({id: "propose_hour"})}
                            </span>
                        </div>
                    }
                    {
                        record.key == 'getAccountUpgradeCost' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getCreateAccountFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getTransactionFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span> &nbsp;
                            <span>Sun/byte</span>
                        </div>
                    }
                    {
                        record.key == 'getAssetIssueFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getWitnessPayPerBlock' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getWitnessStandbyAllowance' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span></div>
                    }
                    {
                        record.key == 'getCreateNewAccountFeeInSystemContract' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span></div>
                    }
                    {
                        record.key == 'getCreateNewAccountBandwidthRate' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span> &nbsp;
                            <span>bandwith/byte</span>
                        </div>
                    }
                    {
                        record.key == 'getAllowCreationOfContracts' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                            <span>{tu('propose_activate')}</span>
                        </div>
                    }
                    {
                        record.key == 'getRemoveThePowerOfTheGr' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                        </div>
                    }
                    {
                        record.key == 'getEnergyFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX} TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getExchangeCreateFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX} TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getMaxCpuTimeOfOneTx' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text} ms</span>
                        </div>
                    }
                    {
                        record.key == 'getAllowUpdateAccountName' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_15'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getAllowSameTokenName' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_16'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getAllowDelegateResource' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_17'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getTotalEnergyLimit' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_18'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span>
                        </div>
                    }
                    {
                        record.key == 'getAllowTvmTransferTrc10' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_19'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getTotalEnergyLimitNew' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_18_1'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span>
                        </div>
                    }
                    {
                        record.key == 'getTotalEnergyCurrentLimit' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_20'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span>
                        </div>
                    }
                    {
                        record.key == 'getAllowMultiSign' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_21'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getAllowAdaptiveEnergy' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_22'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getTotalEnergyTargetLimit' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_23'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text}</span>/
                            <span>{tu('propose_minute')}</span>
                        </div>
                    }
                    {
                        record.key == 'getTotalEnergyAverageUsage' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_24'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text?<span><span>{text}</span>/<span>{tu('propose_minute')}</span></span>:
                                    <span>{tu('propose_unactivate')}</span>
                            }
                        </div>
                    }
                    {
                        record.key == 'getUpdateAccountPermissionFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_25'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getMultiSignFee' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_26'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            <span>{text / ONE_TRX}</span> &nbsp;
                            <span>TRX</span>
                        </div>
                    }
                    {
                        record.key == 'getAllowTvmConstantinople' &&
                        <div>
                            <span>{ intl.formatMessage({id: 'propose_27'})}</span>
                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                            {
                                text? <span>{tu('propose_allowed')}</span>:
                                    <span>{tu('propose_not_allowed')}</span>
                            }
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
                        <FormattedTime value={Number(text)}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>&nbsp;
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
                            <span className="badge badge-secondary text-uppercase badge-success-radius">{tu("proposal_cancelled")}</span>
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
                    {!loading&&<SmartTable bordered={true} column={column} data={dataSource} total={dataSource.length} locale={locale} />}
                </div>
            </main>
        )
    }
}


export default injectIntl(Proposal);
