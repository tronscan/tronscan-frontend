import React from "react";
import {tu,tv} from "../../utils/i18n";
import {injectIntl} from "react-intl";
import { Table } from 'antd';
import _,{upperFirst} from 'lodash'
import {Client} from "../../services/api";
import {Link} from "react-router-dom";
import {ONE_TRX,IS_MAINNET} from "../../constants";

class Committee extends React.Component {

    constructor() {
        super();
        this.state = {
            committee: [
                {
                    "icon": "",
                    "dec": "committee_dec_1",
                },
                {
                    "icon":"../../images/proposals/proposal_2.png",
                    "dec":"committee_dec_2",
                },
                {
                    "icon":"../../images/proposals/proposal_3.png",
                    "dec":"committee_dec_3",
                },
                {
                    "icon":"../../images/proposals/proposal_4.png",
                    "dec":"committee_dec_4",
                },
            ],
            dataSource:[]
        };
    }

    componentDidMount() {
        this.getChainparameters();
    }

    async getChainparameters() {
        if(IS_MAINNET){
            let { tronParameters } = await Client.getChainparameters();
            if(!tronParameters){
                return
            }
            // let EnergyLimitNew   = {key: "getShieldedTransactionCreateAccountFee", value: 1000000};
            // tronParameters.splice(19, 0, EnergyLimitNew);
            tronParameters.map(item => {
                switch (item['key']){
                    case "getMaintenanceTimeInterval":
                        item.name = 'propose_1';
                        item.id = '0';
                        break;
                    case "getAccountUpgradeCost":
                        item.name = 'propose_2';
                        item.id = '1';
                        break;
                    case "getCreateAccountFee":
                        item.name = 'propose_3';
                        item.id = '2';
                        break;
                    case "getTransactionFee":
                        item.name = 'propose_4';
                        item.id = '3';
                        break;
                    case "getAssetIssueFee":
                        item.name = 'propose_5';
                        item.id = '4';
                        break;
                    case "getWitnessPayPerBlock":
                        item.name = 'propose_6';
                        item.id = '5';
                        break;
                    case "getWitnessStandbyAllowance":
                        item.name = 'propose_7';
                        item.id = '6';
                        break;
                    // case "getCreateNewAccountFeeInSystemContract":
                    //     item.name = 'propose_8';
                    //     item.id = '7';
                    //     break;
                    // case "getCreateNewAccountBandwidthRate":
                    //     item.name = 'propose_9';
                    //     item.id = '8';
                    //     break;
                    case "getAllowCreationOfContracts":
                        item.name = 'propose_10';
                        item.id = '9';
                        break;
                    case "getRemoveThePowerOfTheGr":
                        item.name = 'propose_11';
                        item.id = '10';
                        break;
                    case "getEnergyFee":
                        item.name = 'propose_12';
                        item.id = '11';
                        break;
                    case "getExchangeCreateFee":
                        item.name = 'propose_13';
                        item.id = '12';
                        break;
                    case "getMaxCpuTimeOfOneTx":
                        item.name = 'propose_14';
                        item.id = '13';
                        break;
                    case "getAllowUpdateAccountName":
                        item.name = 'propose_15';
                        item.id = '14';
                        break;
                    case "getAllowSameTokenName":
                        item.name = 'propose_16';
                        item.id = '15';
                        break;
                    case "getAllowDelegateResource":
                        item.name = 'propose_17';
                        item.id = '16';
                        break;
                    // case "getTotalEnergyLimit":
                    //     item.name = 'propose_18';
                    //     item.id = '17';
                    //     break;
                    case "getAllowTvmTransferTrc10":
                        item.name = 'propose_19';
                        item.id = '18';
                        break;
                    // case "getTotalEnergyLimitNew":
                    //     item.name = 'propose_18_1';
                    //     item.id = '19';
                    //     break;
                    case "getTotalEnergyCurrentLimit":
                        item.name = 'propose_20';
                        item.id = '19';
                    break;
                    case "getAllowMultiSign":
                        item.name = 'propose_21';
                        item.id = '20';
                        break;
                    case "getAllowAdaptiveEnergy":
                        item.name = 'propose_22';
                        item.id = '21';
                        break;
                    // case "getTotalEnergyTargetLimit":
                    //     item.name = 'propose_23';
                    // break;
                    // case "getTotalEnergyAverageUsage":
                    //     item.name = 'propose_24';
                    // break;
                    case "getUpdateAccountPermissionFee":
                        item.name = 'propose_25';
                        item.id = '22';
                        break;
                    case "getMultiSignFee":
                        item.name = 'propose_26';
                        item.id = '23';
                        break;
                    case "getAllowProtoFilterNum":
                        item.name = 'propose_27';
                        item.id = '24';
                        break;
                    case "getAllowTvmConstantinople":
                        item.name = 'propose_28';
                        item.id = '26';
                        break;
                    case "getAllowShieldedTransaction":
                        item.name = 'propose_29';
                        item.id = '27';
                        break; 
                    case "getShieldedTransactionFee":
                        item.name = 'propose_28_1';
                        item.id = '28';
                        break;
                    case "getAdaptiveResourceLimitMultiplier":
                        item.name = 'propose_29_1';
                        item.id = '29';
                        break;    
                    case "getChangeDelegation":
                        item.name = 'propose_30';
                        item.id = '30';
                        break;
                    case "getWitness127PayPerBlock":
                        item.name = 'propose_31';
                        item.id = '31';
                        break;
                    case "getAllowTvmSolidity059":
                        item.name = 'propose_32';
                        item.id = '32';
                        break;
                    case "getAdaptiveResourceLimitTargetRatio":
                        item.name = 'propose_33';
                        item.id = '33';
                        break;     
                    case "getShieldedTransactionCreateAccountFee":
                        item.name = 'propose_34';
                        item.id = '34';
                        break;
                    case "getForbidTransferToContract":
                        item.name = 'propose_35';
                        item.id = '35';
                        break;           
                }
            });
            let tronParametersNew = [];
            tronParameters.map(item => {
                if(item.name){
                    tronParametersNew.push(item)
                }
            })
            this.setState({
                dataSource: _(tronParametersNew).sortBy(tb => Number(tb.id)).value()
            })
        }else{
            let { tronParameters } = await Client.getChainparameters();
            if(!tronParameters){
                return
            }

            let sunside = [
                'getChargingSwitch',
                'getSideChainGateWayList',
                'getProposalExpireTime',
                'getVoteWitnessSwitch',
                'getFundInjectAddress',
                'getFundDistributeEnableSwitch',
                'getDayToSustainByFund',
                'getPercentToPayWitness',
            ]

            let sunsideparameters = tronParameters.filter(function(v){
                return sunside.indexOf(v.key)!==-1
            })
            sunsideparameters.map(item => {
                switch (item['key']){
                    case "getChargingSwitch":
                        item.name = 'sun_propose_1';
                        item.id= '1000000';
                        break;
                    case "getSideChainGateWayList":
                        item.name = 'sun_propose_2';
                        item.id = '1000001';
                        break;
                    case "getProposalExpireTime":
                        item.name = 'sun_propose_3';
                        item.id = '1000003';
                        break;
                    case "getVoteWitnessSwitch":
                        item.name = 'sun_propose_4';
                        item.id =  '1000004';
                        break;
                    case "getFundInjectAddress":
                        item.name = 'sun_propose_5';
                        item.id = '1000007';
                        break;
                    case "getFundDistributeEnableSwitch":
                        item.name = 'sun_propose_6';
                        item.id = '1000008';
                        break;
                    case "getDayToSustainByFund":
                        item.name = 'sun_propose_7';
                        item.id = '1000009';
                        break;
                    case "getPercentToPayWitness":
                        item.name = 'sun_propose_8';
                        item.id = '1000010';
                        break;
                }
            });
            let tronParametersNew = [];
            sunsideparameters.map(item => {
                if(item.name){
                    tronParametersNew.push(item)
                }
            })

            this.setState({
                dataSource: tronParametersNew.slice(0,2)
            })

        }

    }

    getColumns() {
        let { intl } = this.props;
        let { dataSource } = this.state;

        const columns = [{
            title: upperFirst(intl.formatMessage({id: 'propose_number'})),
            key: 'index',
            width:'20%',
            render: (text, record, index) => {
                return <span>
                    {
                      '#'+ record.id
                    }
                </span>

            }
        }, {
            title: upperFirst(intl.formatMessage({id: 'propose_parameters'})),
            dataIndex: 'name',
            key: 'name',
            render: (text, record, index) => {
                return <span>
                     {text && intl.formatMessage({id: text})}
                </span>


            }
        },
        {
            title:upperFirst(intl.formatMessage({id: 'propose_current_value'})),
            dataIndex: 'value',
            key: 'value',
            render: (text, record, index) => {
                return  <div>
                    {
                        <div>
                            {
                                IS_MAINNET?<div>
                                    {
                                        record.key == 'getMaintenanceTimeInterval' && <div><span>{text / (1000 * 60 * 60)}</span> &nbsp;<span>{
                                            intl.formatMessage({id: "propose_hour"})
                                        }</span></div>
                                    }
                                    {
                                        record.key == 'getAccountUpgradeCost' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                                    }
                                    {
                                        record.key == 'getCreateAccountFee' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                                    }
                                    {
                                        record.key == 'getTransactionFee' && <div><span>{text}</span> &nbsp;<span>Sun/byte</span></div>
                                    }
                                    {
                                        record.key == 'getAssetIssueFee' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                                    }
                                    {
                                        record.key == 'getWitnessPayPerBlock' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                                    }
                                    {
                                        record.key == 'getWitnessStandbyAllowance' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>
                                    }
                                    {/*{*/}
                                        {/*record.key == 'getCreateNewAccountFeeInSystemContract' && <div><span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span></div>*/}
                                    {/*}*/}
                                    {/*{*/}
                                        {/*record.key == 'getCreateNewAccountBandwidthRate' && <div><span>{text}</span> &nbsp;<span>bandwith/byte</span></div>*/}
                                    {/*}*/}
                                    {
                                        record.key == 'getAllowCreationOfContracts' && <div>
                                            {
                                                <span>{tu('propose_activate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getRemoveThePowerOfTheGr' && <div>
                                            {
                                                <span>{tu('propose_finished')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getEnergyFee' && <div>
                                            {
                                                <span>{text / ONE_TRX} TRX</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getExchangeCreateFee' && <div>
                                            {
                                                <span>{text / ONE_TRX} TRX</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getMaxCpuTimeOfOneTx' && <div>
                                            {
                                                <span>{text} ms</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowUpdateAccountName' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowSameTokenName' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowDelegateResource' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }

                                    {
                                        record.key == 'getTotalEnergyLimit' && <div>
                                            {
                                                <span>{text}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowTvmTransferTrc10' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getTotalEnergyLimitNew' && <div>
                                            {
                                                <span>{text}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getTotalEnergyCurrentLimit' && <div>
                                            {
                                                <span>{text} ENERGY</span>
                                            }
                                        </div>
                                        
                                    }
                                    {
                                        record.key == 'getAllowMultiSign' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowAdaptiveEnergy' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getTotalEnergyTargetLimit' && <div>
                                            <span>{text}</span>/
                                            <span>{tu('propose_minute')}</span>
                                        </div>
                                    }
                                    {
                                        record.key == 'getTotalEnergyAverageUsage' && <div>
                                            {
                                                text?<span><span>{text}</span>/<span>{tu('propose_minute')}</span></span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getUpdateAccountPermissionFee' && <div>
                                            <span>{text / ONE_TRX}</span> &nbsp;
                                            <span>TRX</span></div>
                                    }
                                    {
                                        record.key == 'getMultiSignFee' && <div>
                                            <span>{text / ONE_TRX}</span> &nbsp;
                                            <span>TRX</span></div>
                                    }

                                    {
                                        record.key == 'getAllowProtoFilterNum' && <div>
                                            {
                                                text? <span>{tu('propose_activate')}</span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowTvmConstantinople' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getAllowShieldedTransaction' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {                       
                                        record.key == 'getShieldedTransactionFee' && <div>
                                            <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        </div>
                                    }
                                    {                       
                                        record.key == 'getAdaptiveResourceLimitMultiplier' && <div>
                                            <span>{text}</span>
                                        </div>
                                    }

                                    {
                                        record.key == 'getChangeDelegation' && <div>
                                            {
                                                text? <span>{tu('propose_activate')}</span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getWitness127PayPerBlock' &&
                                            <div>
                                                <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                            </div>
                                    }
                                    {
                                        record.key == 'getAllowTvmSolidity059' && <div>
                                            {
                                                text? <span>{tu('propose_allowed')}</span>:
                                                    <span>{tu('propose_not_allowed')}</span>
                                            }
                                        </div>
                                    }
                                    {                       
                                        record.key == 'getAdaptiveResourceLimitTargetRatio' && <div>
                                            <span>{text}</span>
                                        </div>
                                    }
                                    {
                                        record.key == 'getShieldedTransactionCreateAccountFee' &&
                                            <div>
                                                <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                            </div>
                                    }
                                    {
                                        record.key == 'getForbidTransferToContract' && <div>
                                            {
                                                text? <span>{tu('propose_prohibit')}</span>:
                                                    <span>{tu('propose_unprohibit')}</span>
                                            }
                                        </div>
                                    }
                                </div>:<div>
                                    {
                                        record.key == 'getChargingSwitch' && <div>
                                            {
                                                record.value != '0'? <span>{tu('propose_activate')}</span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getSideChainGateWayList' && <div>
                                            {
                                                <span>{record.value}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getProposalExpireTime' && <div>
                                            {
                                                <span>{record.value}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getVoteWitnessSwitch' && <div>
                                            {
                                                record.value != '0'? <span>{tu('propose_activate')}</span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getFundInjectAddress' && <div>
                                            {
                                                <span>{record.value}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getFundDistributeEnableSwitch' && <div>
                                            {
                                                record.value != '0'? <span>{tu('propose_activate')}</span>:
                                                    <span>{tu('propose_unactivate')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getDayToSustainByFund' && <div>
                                            {
                                                <span>{record.value} {tu('day')}</span>
                                            }
                                        </div>
                                    }
                                    {
                                        record.key == 'getPercentToPayWitness' && <div>
                                            {
                                                <span>{record.value} %</span>
                                            }
                                        </div>
                                    }


                                </div>
                            }
                        </div>
                    }

                </div>

            }
        }
    ];

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                bordered={false}
                rowKey={(record, index) => {
                    return index
                }}
            />
        )
    }



    render() {
        let { committee } = this.state;
        return (
            <main className="container header-overlap committee">
                <div className="row">
                    <div className="col-12 committee-title">
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_1.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_1")}</p>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_2.png")}  className="m-auto"/>
                            {
                                IS_MAINNET? <p className="mt-4 p-2">{tv('committee_dec_2', {total: 27})}</p>:
                                    <p className="mt-4 p-2">{tv('committee_dec_2', {total: 5})}</p>
                            }

                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_3.png")}  className="m-auto"/>
                            <p className="mt-4 p-2">{tu("committee_dec_3")}</p>
                        </div>
                        <div className="col-md-3 col-sm-6 col-xs-12">
                            <img src={require("../../images/proposals/proposal_4.png")}  className="m-auto"/>
                            {
                                IS_MAINNET? <p className="mt-4 p-2">{tv('committee_dec_4', {total: 19})}</p>:
                                    <p className="mt-4 p-2">{tv('committee_dec_4', {total: 4})}</p>
                            }
                        </div>
                    </div>
                    <div className="m-auto">
                        <Link to="/proposals">
                            <button className="btn btn-danger mt-4">
                                {tu("get_committee_proposal")}
                            </button>
                        </Link>
                    </div>
                </div>
                <hr style={{marginTop:40,marginBottom:40}}/>
                <div className="network-parameters pb-4">
                    <h4 className="pt-4">
                        <span className="text-uppercase">
                            <span>{tu('TRON_network_parameters')}</span>
                        </span> &nbsp;&nbsp;
                    </h4>
                    <div className="mt-4">
                        {this.getColumns()}
                    </div>
                </div>
            </main>
        );
    }
}


export default injectIntl(Committee);
