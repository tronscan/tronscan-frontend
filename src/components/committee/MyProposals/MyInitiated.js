import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {tu,t} from "../../../utils/i18n";
import { Client, proposalApi } from "../../../services/api";
import {FormattedDate, FormattedTime, injectIntl} from "react-intl";
import {TronLoader} from "../../common/loaders";
import {AddressLink} from "../../common/Links";
import {QuestionMark} from "../../common/QuestionMark";
import {ONE_TRX,IS_MAINNET} from "../../../constants";
import {NavLink, Route, Switch} from "react-router-dom";
import {upperFirst} from 'lodash'
import {Link} from "react-router-dom";
import { Table } from "antd";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import SweetAlert from 'react-bootstrap-sweetalert';
import {transactionResultManager, transactionResultManagerSun} from "../../../utils/tron";
import {withTronWeb} from "../../../utils/tronWeb";


@withTronWeb
class MyInitiated extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource:[],
            total:0,
            loading: false,
            pagination: {
                showQuickJumper: true,
                position: "bottom",
                showSizeChanger: true,
                defaultPageSize: 20,
                total: 0
            },
            modal: null,
            isAction: false,
            timer: null
        }
    }
    // shouldComponentUpdate(nextProps,nextState) {
    //     // if (nextProps.intl.locale !== this.props.locale) {
    //     //     return true
    //     // }
    //     // if (nextState.dataSource !== this.state.dataSource) {
    //     //     return true
    //     // }
    //     return true
    // }
    componentDidMount(){
        let { account, currentWallet } = this.props;
        this.load();
        let timer = setInterval(() => {
            this.load(1,20,1);
        }, 10000);
        this.setState({
            timer
        });
    }
    componentWillUnmount(){
        clearInterval(this.state.timer)
    }
    load = async (page = 1, pageSize = 20, type) => {
        let { account, currentWallet } = this.props;
        this.setState({ loading: type ? false : true });
        let { data, total } = await proposalApi.getMyProposalList({
            limit: pageSize,
            start: (page - 1) * pageSize,
            address: account.address,
            type: 1
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
                id: '1000000',
                key: 'getChargingSwitch',
            },
            {
                id: '1000001',
                key: 'getSideChainGateWayList',
            },
            {
                id: '1000003',
                key: 'getProposalExpireTime',
            },
            {
                id: '1000004',
                key: 'getVoteWitnessSwitch',
            },
            {
                id: '1000007',
                key: 'getFundInjectAddress',
            },
            {
                id: '1000008',
                key: 'getFundDistributeEnableSwitch',
            },
            {
                id: '1000009',
                key: 'getDayToSustainByFund',
            },
            {
                id: '1000010',
                key: 'getPercentToPayWitness',
            },
        ];
        if (IS_MAINNET) {
            for (let item in data) {
                for (let j in data[item]['paramters']) {
                    data[item]['paramters'][j]['proposalKey'] = parametersArr[data[item]['paramters'][j]['key']];
                    data[item]['paramters'][j]['proposalVal'] = data[item]['paramters'][j]['value'];
                }
            }
        }
        else {
            for (let item in data) {
                for (let j in data[item]['paramters']) {
                    for (let i in sunsideArr) {
                        if (sunsideArr[i]['id'] == data[item]['paramters'][j]['key']) {
                            data[item]['paramters'][j]['proposalKey'] = sunsideArr[i]['key'];
                            data[item]['paramters'][j]['proposalVal'] = data[item]['paramters'][j]['value'];
                        }
                    }
                }
            }
        }
        this.setState({
            loading: false,
            dataSource: data,
            total,
            page,
            pagination: {
                ...this.state.pagination,
                total
            }
        });
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState(
          {
            pagination: pager
          },
          () => {
                this.load(pager.current, pager.pageSize)
                clearInterval(this.state.timer)
                let timer = setInterval(() => {
                    this.load(pager.current, pager.pageSize, 1);
                }, 10000);
                this.setState({
                    timer
                });
            }
        );
    };
    getColumns() {
        let { account, intl } = this.props;
        let { dataSource } = this.state;
        const columns = [
        {
            title: upperFirst(intl.formatMessage({id: 'proposal_content_info'})),
            dataIndex: 'proposalVal',
            key: 'proposalVal',
            width:'40%',
            render: (text, record, index) => {
                return  <div style={{fontFamily: 'HelveticaNeue-Medium'}}>
                    {
                        record.paramters.map((item,index)=>{
                            return <div key={index}>
                                {
                                    IS_MAINNET?<div>
                                        {
                                            item.proposalKey == 'getMaintenanceTimeInterval' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_1'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal / (1000 * 60 * 60)}</span> &nbsp;
                                                <span>{intl.formatMessage({id: "propose_hour"})}</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAccountUpgradeCost' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_2'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                <span>TRX</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getCreateAccountFee' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_3'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                <span>TRX</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getTransactionFee' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_4'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal }</span> &nbsp;
                                                <span>Sun/byte</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAssetIssueFee' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_5'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                <span>TRX</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getWitnessPayPerBlock' &&
                                            <div>
                                                <div>
                                                    <span>{ intl.formatMessage({id: 'propose_6'})}</span>
                                                    <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                    <span>{item.proposalVal / ONE_TRX}</span> &nbsp;
                                                    <span>TRX</span>
                                                </div>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getWitnessStandbyAllowance' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_7'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal / ONE_TRX}</span> &nbsp;
                                                <span>TRX</span></div>
                                        }
                                        {
                                            item.proposalKey == 'getCreateNewAccountFeeInSystemContract' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_8'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal / ONE_TRX}</span> &nbsp;
                                                <span>TRX</span></div>
                                        }
                                        {
                                            item.proposalKey == 'getCreateNewAccountBandwidthRate' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_9'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal }</span> &nbsp;
                                                <span>bandwith/byte</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAllowCreationOfContracts' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_10'})}</span>
                                                <span>{tu('propose_activate')}</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getRemoveThePowerOfTheGr' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_11'})}</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getEnergyFee' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_12'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal / ONE_TRX} TRX</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getExchangeCreateFee' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_13'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal / ONE_TRX} TRX</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getMaxCpuTimeOfOneTx' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_14'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal } ms</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAllowUpdateAccountName' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_15'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                {
                                                    item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                        <span>{tu('propose_not_allowed')}</span>
                                                }
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAllowSameTokenName' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_16'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                {
                                                    item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                        <span>{tu('propose_not_allowed')}</span>
                                                }
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAllowDelegateResource' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_17'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                {
                                                    item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                        <span>{tu('propose_not_allowed')}</span>
                                                }
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getTotalEnergyLimit' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_18'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal }</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getAllowTvmTransferTrc10' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_19'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                {
                                                    item.proposalVal? <span>{tu('propose_allowed')}</span>:
                                                        <span>{tu('propose_not_allowed')}</span>
                                                }
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getTotalEnergyLimitNew' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_18_1'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal }</span>
                                            </div>
                                        }
                                        {
                                            item.proposalKey == 'getTotalEnergyCurrentLimit' &&
                                            <div>
                                                <span>{ intl.formatMessage({id: 'propose_20'})}</span>
                                                <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
                                                <span>{ item.proposalVal } ENERGY</span>
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
                                            <div className="mt-1">
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
                                    </div>
                                }
                            </div>
                        })


                    }


                </div>
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'proposal_time_of_creation'})) + '/ ' + upperFirst(intl.formatMessage({id: 'proposal_endtime'})),
            dataIndex: 'createTime',
            key: 'createTime',
            width:'15%',
            align: 'center',
            render: (text, record, index) => {
                return <div>
                    <div style={{color: '#333'}}>
                        <FormattedDate value={Number(text)}/>&nbsp;
                        <FormattedTime value={Number(text)}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                    </div>
                    <div style={{color: '#C23631'}}>
                        <FormattedDate value={Number(record.expirationTime)}/>&nbsp;
                        <FormattedTime value={Number(record.expirationTime)}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                    </div>
                </div>
            }

        },

        {
            title:upperFirst(intl.formatMessage({id: 'proposal_status'})),
            dataIndex: 'state',
            key: 'state',
            align: 'center',
            width:'12%',
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
            title: () => {
                let text = upperFirst(intl.formatMessage({id: 'proposal_valid_votes'})) + ' / ' + upperFirst(intl.formatMessage({id: 'proposal_total_votes'}))
                let text1 = upperFirst(intl.formatMessage({id: 'proposal_votes_tip'}))
                return (
                    <div>
                        {text}{' '}
                        <span className="mr-2">
                            <QuestionMark placement="top" text={text1} />
                        </span>
                    </div>
                )
            },
            dataIndex: 'votes',
            key: 'votes',
            width:'12%',
            align: 'center',
            render: (text, record, index) => {
                return `${record.validVotes}/${record.totalVotes}`
            }
        },
        {
            title: upperFirst(intl.formatMessage({id: 'proposal_action'})),
            dataIndex: 'details',
            key: 'details',
            width:'12%',
            align: 'center',
            render: (text, record, index) => {
                return (
                    <div className="detail-action">
                        <div>
                            <Link
                                to={`/proposal/${record.proposalId}`}
                                className="proposal-more">
                                {tu("proposal_more")}
                            </Link>
                        </div>
                        {account.address && record.state === 'PENDING' ? 
                        (<div>
                            <div>
                                <a href="javascript:;" className="proposal-cancel" onClick={() => this.cancelModal(record.proposalId)}>{tu('proposal_cancel')}</a>
                            </div>
                        </div>) : ""}
                    </div>
                    

                )
            }
        }];

        return columns
    }
    hideModal = () => {
        this.setState({
          modal: null,
          isAction: false
        });
    };
    cancelModal(id){
        let { intl } = this.props;
        this.setState({
            modal: 
                <Modal isOpen={true} toggle={this.hideModal} className="committee-modal modal-dialog-centered" style={{width: '460px'}}>
                    <ModalHeader toggle={this.hideModal} className=""></ModalHeader>
                    <ModalBody style={{padding: '0 0 1.5rem'}}>
                        <div style={{color: '#333',padding:'0 0 30px',fontSize: '16px',textAlign: 'center'}}>{tu('proposal_cancel_tip1')}</div>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <div style={{width: '90px',height: '38px',lineHeight: '38px', textAlign: 'center', background: '#C23631', color: '#fff',cursor: 'pointer'}}
                                onClick={() => {
                                    this.cancelFun(id)
                                }}>
                                {tu('confirm')}
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
        });
    }

    async cancelFun(id){
        if(this.state.isAction){
            return
        }
        this.setState({
            isAction: true
        })
        let res = await this.getResult(id);

        if(res){
            this.setState({
                modal: (
                    <SweetAlert success timeout="3000" onConfirm={this.hideModal}>
                      {tu("proposal_success")}
                    </SweetAlert>
                )
            });
        }else{
            this.setState({
                modal: (
                  <SweetAlert warning timeout="3000" onConfirm={this.hideModal}>
                    {tu("proposal_fail")}
                  </SweetAlert>
                )
            })
        }
        this.setState({
            isAction: false
        })
    }

    async getResult(id, v){
        let res;
        let {isTronLink} = this.state;
        let {account} = this.props;
        if(IS_MAINNET){
            let tronWeb;
            if (this.props.walletType.type === "ACCOUNT_LEDGER"){
                tronWeb = this.props.tronWeb();
            }else if(this.props.walletType.type === "ACCOUNT_TRONLINK" || this.props.walletType.type === "ACCOUNT_PRIVATE_KEY"){
                tronWeb = account.tronWeb;
            }

            const unSignTransaction = await tronWeb.transactionBuilder.deleteProposal(id, account.address, 1).catch(e=> console.log(e));
            const {result} = await transactionResultManager(unSignTransaction, tronWeb);

            res = result;
        }else{
            const unSignTransaction = await account.sunWeb.sidechain.transactionBuilder.deleteProposal(id, account.address, 1).catch(e=> console.log(e));
            const {result} = await transactionResultManagerSun(unSignTransaction, account.sunWeb);
            res = result;
        }
        
        return res
    }

    render(){
        let {modal, page, total, pageSize, loading, dataSource, emptyState: EmptyState = null, pagination} = this.state;
        let column = this.getColumns();
        let {intl} = this.props;
        return (
            <div className="">
                {modal}
                {loading && <div className="loading-style"><TronLoader/></div>}
                {!loading&&
                    (total > 0  ? <Table
                        bordered={true}
                        columns={column}
                        rowKey={(record, index) => {
                        return index;
                        }}
                        dataSource={dataSource}
                        scroll={scroll}
                        pagination={pagination}
                        loading={loading}
                        onChange={this.handleTableChange}
                    /> : 
                    <div className="my-proposals-empty">
                      <img src={require('../../../images/proposals/tron-empty.svg')} alt=""/>
                      <div>
                        {t('trc20_no_data')},
                        {t('proposal_go')}
                        <Link to="/proposalscreate">{t('proposal_create')}</Link>
                        {t('proposal_or')}
                        <Link to="/proposals">{t('proposal_vote_link')}</Link>
                      </div>
                    </div>)
                }
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        account: state.app.account,
        currentWallet: state.wallet.current,
        walletType: state.app.wallet,
        locale: state.app.activeLanguage
    };
}

export default connect(mapStateToProps, null)(injectIntl(MyInitiated));

