import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps, Table, Checkbox } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";
import {upperFirst} from 'lodash'
import {ONE_TRX,IS_MAINNET} from "../../../constants";
const Step = Steps.Step;

@connect(
  state => ({
    wallet: state.wallet.current,
  })
)

export class SetProposal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modalSelect: null,
      issuedAsset: null,
      ...this.props.state
    };
  }
  componentDidMount() {
    this.getChainparameters();
  }
  onChange(e,record) {
    console.log(`checked = ${e.target.checked}`);
    console.log(`record =` ,record);
  }
async getChainparameters() {
    if(IS_MAINNET){
        let { tronParameters } = await Client.getChainparameters();
        if(!tronParameters){
            return
        }
        let EnergyLimitNew   = {key: "getTotalEnergyLimitNew", value: 100000000000};
        tronParameters.splice(19, 0, EnergyLimitNew);
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
                case "getTotalEnergyLimit":
                    item.name = 'propose_18';
                    item.id = '17';
                    break;
                case "getAllowTvmTransferTrc10":
                    item.name = 'propose_19';
                    item.id = '18';
                    break;
                case "getTotalEnergyLimitNew":
                    item.name = 'propose_18_1';
                    item.id = '19';
                    break;
                // case "getTotalEnergyCurrentLimit":
                //     item.name = 'propose_20';
                // break;
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
                    item.id = '25';
                    break;
                case "getChangeDelegation":
                    item.name = 'propose_30';
                    item.id = '30';
                    break;
                case "getWitness127PayPerBlock":
                    item.name = 'propose_31';
                    item.id = '31';
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
            dataSource: tronParametersNew
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
  
  componentDidUpdate(prevProps, prevState) {
    let {wallet} = this.props;
    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken()
      }
    }
  }

  setSelect(type) {
    const {isLoggedInFn, nextState} = this.props
    nextState({type: type})
    // if(isLoggedInFn()){
    //   if(type == 'trc10'){
    //     if(this.state.issuedAsset){
    //       nextState({type: type})
    //     }else{
    //       this.setModal()
    //     }
    //   }else{
    //     nextState({type: type})
    //   }
    // }
  }

  goToNextStep =() => {
    const {nextStep, isLoggedInFn, wallet, isAuthorFn} = this.props
    const {issuedAsset, isUpdate,paramData:{author}} = this.state;
    const {type} = this.props.state;
    if(!isLoggedInFn()) return;
    if( isUpdate  && !isAuthorFn(author)) return;
    if(!issuedAsset && (type == 'trc10')){
      this.setModal('trx_token_account_limit')
      return
    }
    // if(wallet.balance < 1024*Math.pow(10,6)){
    //   this.setModal('trx_token_fee_message')
    //   return
    // }
    nextStep(1)
  }

  setModal = (msg) => {
    let {intl} = this.props;
    this.setState({
      modalSelect: <SweetAlert
        error
        title={tu(msg)}
        confirmBtnText={intl.formatMessage({id: 'confirm'})}
        confirmBtnBsStyle="danger"
        onConfirm={() => this.setState({modalSelect: null})}
        style={{marginLeft: '-240px', marginTop: '-195px'}}
      >
      </SweetAlert>
    })
  }

  checkExistingToken = () => {
    let {wallet} = this.props;
    if (wallet !== null) {
      Client.getIssuedAsset(wallet.address).then(({token}) => {
        this.setState({issuedAsset: (token == undefined)})
        // token !== undefined && this.props.nextState({type: 'trc20'})
      });
    }
  };

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
    },
    {
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
                                            <span>{text}</span>
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
    },
    {
      title: upperFirst(intl.formatMessage({id: 'propose_select_table'})),
      dataIndex: 'select',
      key: 'select',
      align:'right',
      width:'15%',
      render: (text, record, index) => {
          return <span>
               <Checkbox onChange={(e)=>this.onChange(e,record)}></Checkbox>
          </span>
      }
    },
  ];

    return (
        <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered={true}
            rowKey={(record, index) => {
                return index
            }}
        />
    )
}
  

  render() {
    let {type} = this.props.state
    const { locale } = this.props.intl
    
    return (
        <main>
          {this.state.modalSelect}
          <div className="mt-4">
            {this.getColumns()}
          </div>
          {/* <button 
            type="button" 
            className="btn btn-danger btn-lg btn-w" 
            style={{width: '252px'}}
            onClick={this.goToNextStep}
         >{tu('trc20_confirm')}</button> */}
          <div className="text-right mt-4">
            <button className="ml-4 btn btn-danger btn-lg" onClick={this.goToNextStep}>{tu('next')}</button>
          </div>
        </main>
    )
  }
}

export default injectIntl(SetProposal);
