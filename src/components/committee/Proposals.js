import React from "react";
import {tu} from "../../utils/i18n";
import {upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import SmartTable from "../common/SmartTable.js"
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../common/loaders";
import {AddressLink} from "../common/Links";
import {ONE_TRX,IS_MAINNET} from "../../constants";

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
            'getAllowProtoFilterNum',
            '',
            'getAllowTvmConstantinople',
            '',
            '',
            '',
            'getChangeDelegation',
        ];

        let sunsideArr = [
            {
                id:'1000000',
                key:'getChargingSwitch',
            },
            {
                id:'1000001',
                key:'getSideChainGateWayList',
            },
            {
                id:'1000003',
                key:'getProposalExpireTime',
            },
            {
                id:'1000004',
                key:'getVoteWitnessSwitch',
            },
            {
                id:'1000007',
                key:'getFundInjectAddress',
            },
            {
                id:'1000008',
                key:'getFundDistributeEnableSwitch',
            },
            {
                id:'1000009',
                key:'getDayToSustainByFund',
            },
            {
                id:'1000010',
                key:'getPercentToPayWitness',
            },

        ]
        if(IS_MAINNET){
            for(let item in proposal){
                for(let j in proposal[item]['paramters']){
                    console.log(parametersArr[j])
                    proposal[item]['key'] = parametersArr[j];
                    proposal[item]['proposalVal'] = proposal[item]['paramters'][j];
                }
            }
        }else{
            for(let item in proposal){
                for(let j in proposal[item]['paramters']){
                    for(let i in sunsideArr){
                        if(sunsideArr[i]['id']== j){
                             proposal[item]['key'] = sunsideArr[i]['key'];
                             proposal[item]['proposalVal'] = proposal[item]['paramters'][j];
                        }
                    }
                }
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
                return  '#' +record.proposalId
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
                        IS_MAINNET?<div>
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
                                record.key == 'getAllowProtoFilterNum' &&
                                <div>
                                    <span>{ intl.formatMessage({id: 'propose_27'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        text? <span>{tu('propose_activate')}</span>:
                                            <span>{tu('propose_unactivate')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getAllowTvmConstantinople' &&
                                <div>
                                    <span>{ intl.formatMessage({id: 'propose_28'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        text? <span>{tu('propose_allowed')}</span>:
                                            <span>{tu('propose_not_allowed')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getChangeDelegation' &&
                                <div>
                                    <span>{ intl.formatMessage({id: 'propose_30'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        text? <span>{tu('propose_activate')}</span>:
                                            <span>{tu('propose_unactivate')}</span>
                                    }
                                </div>
                            }
                        </div>:<div>
                            {
                                record.key == 'getChargingSwitch' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_1'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        record.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                            <span>{tu('propose_unactivate')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getSideChainGateWayList' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_2'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        <span>{record.proposalVal}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getProposalExpireTime' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_3'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        <span>{record.proposalVal}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getVoteWitnessSwitch' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_4'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        record.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                            <span>{tu('propose_unactivate')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getFundInjectAddress' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_5'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        <span>{record.proposalVal}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getFundDistributeEnableSwitch' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_6'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        record.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                            <span>{tu('propose_unactivate')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getDayToSustainByFund' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_7'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        <span>{record.proposalVal} {tu('day')}</span>
                                    }
                                </div>
                            }
                            {
                                record.key == 'getPercentToPayWitness' && <div>
                                    <span>{ intl.formatMessage({id: 'sun_propose_8'})}</span>
                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                    {
                                        <span>{record.proposalVal} %</span>
                                    }
                                </div>
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
