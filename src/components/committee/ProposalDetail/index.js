import React, {Fragment} from "react";
import {tu,t} from "../../../utils/i18n";
import {Client} from "../../../services/api";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {ONE_TRX,IS_MAINNET} from "../../../constants";
import { Link } from "react-router-dom";
import { isAddressValid } from "@tronscan/client/src/utils/crypto";

class ProposalDetail extends React.Component {

    constructor() {
        super();
        this.state = {
            loading:false,
        };
    }

    componentDidMount() {
        let {match} = this.props;
        this.load(match.params.id)
    }

    async load(id) {
        this.setState({loading: true});
        let {data} = await Client.getProposalById(id);
        let obj = data
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
            //'getTotalEnergyCurrentLimit',
            'getAllowAdaptiveEnergy',
           // 'getTotalEnergyTargetLimit',
            //'getTotalEnergyAverageUsage',
            'getUpdateAccountPermissionFee',
            'getMultiSignFee',
            'getAllowProtoFilterNum',
            '',
            'getAllowTvmConstantinople',
            'getAllowShieldedTransaction',
            'getShieldedTransactionFee',
            'getAdaptiveResourceLimitMultiplier',
            'getChangeDelegation',
            'getWitness127PayPerBlock',
            'getAllowTvmSolidity059',
            'getAdaptiveResourceLimitTargetRatio',
            'getShieldedTransactionCreateAccountFee',
            'getForbidTransferToContract',
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
            {
                id:'1000012',
                key:'getUpdateGateway_v1_0_2',
            }
        ]
        if(IS_MAINNET){
            for(let item in obj.paramters){
                obj.paramters[item].proposalKey = parametersArr[obj.paramters[item].key];
                obj.paramters[item].proposalVal = obj.paramters[item].value;
            }
        }else{
            for(let item in obj.paramters){
                for(let i in sunsideArr){
                    if(sunsideArr[i]['id'] == obj.paramters[item]['key']){
                        obj.paramters[item]['proposalKey'] = sunsideArr[i]['key'];
                        obj.paramters[item]['proposalVal'] =  obj.paramters[item]['value'];
                    }
                }
            }
        }
        this.setState({
            proposal: obj,
            loading: false,
        })
    }


    render() {
        let {match,intl} = this.props;
        let {proposal,loading} = this.state;
        return (
            <main className="container header-overlap proposal-detail">
                <div className="row">
                    <div className="col-md-12 ">
                        {
                            loading ? <div className="card">
                                    <TronLoader>
                                        {tu("loading_address")} #{match.params.id}
                                    </TronLoader>
                                </div> :
                                <Fragment>
                                    <div className="card list-style-header">
                                        {
                                            match.params.id &&
                                            <div className="card-body">
                                                <h5 className="card-title m-0">
                                                    # {match.params.id}&nbsp;{t('proposal')}
                                                </h5>
                                            </div>
                                        }
                                        <div className="proposal-header">
                                            {proposal && <div className="">
                                                <div className="header-item">
                                                    <div className="d-flex">
                                                        <div className="item-title">{t("proposer")} :</div>
                                                        <div className="item-info">{proposal.proposer.name ?  <AddressLink address={proposal.proposer.address}>{proposal.proposer.name}</AddressLink> : <AddressLink address={proposal.proposer.address}>{proposal.proposer.address}</AddressLink>}</div>
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="item-title">{t("proposal_time_of_creation")}:</div>
                                                        <div className="item-info">
                                                            <FormattedDate value={Number(proposal.createTime)}/>&nbsp;
                                                            <FormattedTime value={Number(proposal.createTime)} hour='numeric' minute="numeric" second='numeric' hour12={false}/>&nbsp;
                                                        </div>
                                                    </div>
                                                    
                                                    </div>
                                                <div className="header-item">
                                                    <div className="d-flex">
                                                        <div className="item-title">{t("proposal_content_info")} :</div>
                                                        <div className="item-info">
                                                            {
                                                                proposal && proposal.paramters.map((item,index) => {
                                                                    return  <div key={index}>
                                                                        {
                                                                            IS_MAINNET?<div>
                                                                                {
                                                                                    item.proposalKey == 'getMaintenanceTimeInterval' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / (1000 * 60 * 60)}</span> &nbsp;
                                                                                        <span>{intl.formatMessage({id: "propose_hour"})}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAccountUpgradeCost' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getCreateAccountFee' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTransactionFee' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal}</span> &nbsp;
                                                                                        <span>Sun/byte</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAssetIssueFee' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getWitnessPayPerBlock' &&
                                                                                    <div>
                                                                                        <div className="proposal-message">
                                                                                            <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                                                                                            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                            <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                            <span>TRX</span>
                                                                                        </div>
                                                                                    </div>

                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getWitnessStandbyAllowance' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span></div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getCreateNewAccountFeeInSystemContract' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span></div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getCreateNewAccountBandwidthRate' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal}</span> &nbsp;
                                                                                        <span>bandwith/byte</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowCreationOfContracts' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                                                                                        <span className='col-green'>{tu('propose_activate')}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getRemoveThePowerOfTheGr' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getEnergyFee' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX} TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getExchangeCreateFee' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal / ONE_TRX} TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getMaxCpuTimeOfOneTx' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal} ms</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowUpdateAccountName' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_15'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                                <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowSameTokenName' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_16'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                                <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowDelegateResource' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_17'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                                <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTotalEnergyLimit' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_18'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowTvmTransferTrc10' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_19'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span className='col-green'>{tu('propose_allowed')}</span>:
                                                                                                <span className='col-green'>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTotalEnergyLimitNew' &&
                                                                                    <div className="proposal-message">
                                                                                        <span>{ intl.formatMessage({id: 'propose_18_1'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span className='col-green'>{item.proposalVal}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTotalEnergyCurrentLimit' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_20'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{item.proposalVal} ENERGY</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowMultiSign' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_21'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowAdaptiveEnergy' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_22'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTotalEnergyTargetLimit' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_23'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{item.proposalVal}</span>/
                                                                                        <span>{tu('propose_minute')}</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getTotalEnergyAverageUsage' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_24'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal?<span><span>{item.proposalVal}</span>/<span>{tu('propose_minute')}</span></span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getUpdateAccountPermissionFee' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_25'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getMultiSignFee' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_26'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowProtoFilterNum' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_27'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_activate')}</span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }

                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowTvmConstantinople' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_28'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowShieldedTransaction' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_29'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getShieldedTransactionFee' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_28_1'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAdaptiveResourceLimitMultiplier' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_29_1'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{ item.proposalVal }</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getChangeDelegation' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_30'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_activate')}</span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {

                                                                                    item.proposalKey == 'getWitness127PayPerBlock' &&
                                                                                    <div className="">
                                                                                        <span>{ intl.formatMessage({id: 'propose_31'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{ item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>

                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAllowTvmSolidity059' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_32'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                        <br/>
                                                                                        <br/>
                                                                                        <div>
                                                                                            {tu('getAllowTvmSolidity059_tips')}
                                                                                            <a className="ml-2" href="https://github.com/tronprotocol/tips/blob/master/proposal/proposal-32.md" target="_blank">{tu("learn_more")}></a>
                                                                                        </div>
                                                                                    
                                                                                        <div>
                                                                                            tronprotocol/tips:
                                                                                            <a className="ml-2" href="https://github.com/tronprotocol/tips/blob/master/tip-43.md" target="_blank">{tu("#tip43")}</a>
                                                                                            <a className="ml-2" href="https://github.com/tronprotocol/tips/blob/master/tip-44.md" target="_blank">{tu("#tip44")}</a>
                                                                                            <a className="ml-2" href="https://github.com/tronprotocol/tips/blob/master/tip-54.md" target="_blank">{tu("#tip54")}</a>
                                                                                            <a className="ml-2" href="https://github.com/tronprotocol/tips/blob/master/tip-60.md" target="_blank">{tu("#tip60")}</a>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getAdaptiveResourceLimitTargetRatio' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_33'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{ item.proposalVal }</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getShieldedTransactionCreateAccountFee' &&
                                                                                    <div className="mt-1">
                                                                                        <span>{ intl.formatMessage({id: 'propose_34'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        <span>{ item.proposalVal / ONE_TRX}</span> &nbsp;
                                                                                        <span>TRX</span>
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getForbidTransferToContract' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'propose_35'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_prohibit')}</span>:
                                                                                                <span>{tu('propose_not_prohibit')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                            </div>:<div>
                                                                                {
                                                                                    item.proposalKey == 'getChargingSwitch' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_1'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getSideChainGateWayList' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_2'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            <span>{item.proposalVal}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getProposalExpireTime' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_3'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            <span>{item.proposalVal}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getVoteWitnessSwitch' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_4'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getFundInjectAddress' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_5'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            <span>{item.proposalVal}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getFundDistributeEnableSwitch' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_6'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal != '0'? <span>{tu('propose_activate')}</span>:
                                                                                                <span>{tu('propose_unactivate')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getDayToSustainByFund' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_7'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            <span>{item.proposalVal} {tu('day')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getPercentToPayWitness' && <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_8'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            <span>{item.proposalVal} %</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    item.proposalKey == 'getUpdateGateway_v1_0_2' &&
                                                                                    <div>
                                                                                        <span>{ intl.formatMessage({id: 'sun_propose_12'})}</span>
                                                                                        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                                                        {
                                                                                            item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                                                                <span>{tu('propose_not_allowed')}</span>
                                                                                        }
                                                                                    </div>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="item-title">{t("proposal_time_of_expire")}:</div>
                                                        <div className="item-info">
                                                            <FormattedDate value={Number(proposal.expirationTime)}/>&nbsp;
                                                            <FormattedTime value={Number(proposal.expirationTime)} hour='numeric' minute="numeric" second='numeric' hour12={false}/>&nbsp;
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="header-item">
                                                <div className="d-flex">
                                                    <div className="item-title">{t("proposal_status")} :</div>
                                                        <div className="item-info">
                                                            {
                                                                proposal.state == 'PENDING' &&
                                                                <div>
                                                                    <span className="badge badge-warning text-uppercase badge-success-radius">{tu("proposal_voting")}</span>
                                                                </div>
                                                            }
                                                            {
                                                                proposal.state == 'DISAPPROVED' &&
                                                                <div>
                                                                    <span className="badge badge-danger text-uppercase badge-success-radius">{tu("proposal_ineffective")}</span>
                                                                </div>
                                                            }
                                                            {
                                                                proposal.state == 'APPROVED' &&
                                                                <div>
                                                                    <span className="badge badge-success text-uppercase badge-success-radius">{tu("proposal_effective")}</span>
                                                                </div>
                                                            }
                                                            {
                                                                proposal.state == 'CANCELED' &&
                                                                <div>
                                                                    <span className="badge badge-secondary text-uppercase badge-success-radius">{tu("proposal_cancelled")}</span>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                
                                                </div>
                                            </div>}
                                        </div>
                                    </div>
                                    {IS_MAINNET && proposal && <div className="proposal-detail-wrap">
                                        <div className="detail-header">
                                            <h2>{t("proposal_details")}</h2>
                                            <div className="votes">
                                                <span>
                                                   {t("proposal_valid_votes")}: {proposal.validVotes};
                                                   {t("proposal_total_votes")}: {proposal.totalVotes}
                                                </span>
                                                <span className="ml-2">
                                                    <QuestionMark placement="top" text="proposal_votes_tip" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="detail-content">
                                            {proposal.typeApprovals && proposal.typeApprovals.sr.length > 0 && <div className="detail-item blue">
                                                <div className="detail-item-title ">
                                                    <i></i>
                                                    {tu("proposal_super_votes")} : {proposal.typeApprovals.sr.length}
                                                </div>
                                                <div className="detail-item-content">
                                                    {
                                                        proposal.typeApprovals.sr.map((item,index) => (
                                                            <Link to={`/address/${item.address}`} key={index}>{item.name || addressFormat(item.address)}</Link>
                                                        ))
                                                    }
                                                </div>
                                            </div>}
                                            {proposal.typeApprovals && proposal.typeApprovals.partner.length > 0 && <div className="detail-item orange">
                                                <div className="detail-item-title ">
                                                    <i></i>
                                                    {tu("proposal_super_partner_votes")} : {proposal.typeApprovals.partner.length}
                                                </div>
                                                <div className="detail-item-content">
                                                    {
                                                        proposal.typeApprovals.partner.map((item,index) => (
                                                            <Link to={`/address/${item.address}`} key={index}>{item.name || addressFormat(item.address)}</Link>
                                                        ))
                                                    }
                                                </div>
                                            </div>}
                                            {proposal.typeApprovals && proposal.typeApprovals.candidate.length > 0 && <div className="detail-item green">
                                                <div className="detail-item-title ">
                                                    <i></i>
                                                    {tu("proposal_super_candidate_votes")} : {proposal.typeApprovals.candidate.length}
                                                </div>
                                                <div className="detail-item-content">
                                                    {
                                                        proposal.typeApprovals.candidate.map((item,index) => (
                                                            <Link to={`/address/${item.address}`} key={index}>{item.name || addressFormat(item.address)}</Link>
                                                        ))
                                                    }
                                                </div>
                                            </div>}
                                        </div>
                                    </div>}
                                    {!IS_MAINNET && proposal && <div className="proposal-detail-wrap">
                                        <div className="detail-header">
                                            <h2>{t("proposal_details")}</h2>
                                            <div className="votes">
                                                <span>
                                                   {/* {t("proposal_valid_votes")}: {proposal.validVotes}; */}
                                                   {t("proposal_total_votes")}: {proposal.approvals.length}
                                                </span>
                                                {/* <span className="ml-2">
                                                    <QuestionMark placement="top" text="proposal_votes_tip" />
                                                </span> */}
                                            </div>
                                        </div>
                                        <div className="detail-content">
                                            {proposal.approvals && proposal.approvals.length > 0 && <div className="detail-item blue">
                                                <div className="detail-item-title ">
                                                    <i></i>
                                                    {tu("proposal_super_votes")} : {proposal.approvals.length}
                                                </div>
                                                <div className="detail-item-content">
                                                    {
                                                        proposal.approvals.map((item,index) => (
                                                            <Link to={`/address/${item.address}`} key={index}>{item.name || addressFormat(item.address)}</Link>
                                                        ))
                                                    }
                                                </div>
                                            </div>}
                                        </div>
                                    </div>}
                                </Fragment>
                        }
                    </div>
                </div>
            </main>

        )
    }
}

function addressFormat(addr){
    let children_start =
      addr && isAddressValid(addr)
        ? addr.substring(0, 29)
        : "";
    let children_end =
      addr && isAddressValid(addr)
        ? addr.substring(29, 34)
        : "";
    
    return(
        <div className="ellipsis_box">
            <div className="ellipsis_box_start">{children_start}</div>
            <div className="ellipsis_box_end">{children_end}</div>
        </div>  
    )
}

export default injectIntl(ProposalDetail);

