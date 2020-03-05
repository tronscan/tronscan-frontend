import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps, Table, Checkbox, Input, InputNumber, Form, Select } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";
import _,{upperFirst} from 'lodash'
import {ONE_TRX,IS_MAINNET} from "../../../constants";
const Step = Steps.Step;
const { Option } = Select;
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
    this.props.nextState({leave_lock: true})
    this.getSelectedPropsal();
  }
  onChange(e,record) {
    console.log(`checked = ${e.target.checked}`);
    console.log(`record =` ,record);
  }
  
  getSelectedPropsal = () => {
    let {proposalsCreateList,dataSource} = this.state;
    let dataSourceSelected =  _(dataSource).filter(source => source.checked).value()
    dataSourceSelected.map((item,index)=>{
        switch (item['key']){
            case "getMaintenanceTimeInterval":
                this.props.form.setFieldsValue({
                    "getMaintenanceTimeInterval": item.newValue !== undefined?item.newValue/1000:''
                });
            break;
            case "getAccountUpgradeCost":
                this.props.form.setFieldsValue({
                    "getAccountUpgradeCost": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getCreateAccountFee":
                this.props.form.setFieldsValue({
                    "getCreateAccountFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getTransactionFee":
                this.props.form.setFieldsValue({
                    "getTransactionFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getAssetIssueFee":
                this.props.form.setFieldsValue({
                    "getAssetIssueFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getWitnessPayPerBlock":
                this.props.form.setFieldsValue({
                    "getWitnessPayPerBlock": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getWitnessStandbyAllowance":
                this.props.form.setFieldsValue({
                    "getWitnessStandbyAllowance": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getEnergyFee":
                this.props.form.setFieldsValue({
                    "getEnergyFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getExchangeCreateFee":
                this.props.form.setFieldsValue({
                    "getExchangeCreateFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;
            case "getMaxCpuTimeOfOneTx":
                this.props.form.setFieldsValue({
                    "getMaxCpuTimeOfOneTx": item.newValue !== undefined?item.newValue:''
                });
            break;    
            case "getAllowUpdateAccountName":
                this.props.form.setFieldsValue({
                    "getAllowUpdateAccountName": item.newValue?item.newValue:undefined
                });
            break;  
            case "getAllowTvmTransferTrc10":
                this.props.form.setFieldsValue({
                    "getAllowTvmTransferTrc10": item.newValue?item.newValue:undefined
                });
            break; 
            case "getTotalEnergyCurrentLimit":
                this.props.form.setFieldsValue({
                    "getTotalEnergyCurrentLimit": item.newValue !== undefined? item.newValue:''
                });
            break; 
            case "getAllowMultiSign":
                this.props.form.setFieldsValue({
                    "getAllowMultiSign": item.newValue?item.newValue:undefined
                });
            break; 
            case "getAllowAdaptiveEnergy":
                this.props.form.setFieldsValue({
                    "getAllowAdaptiveEnergy": item.newValue?item.newValue:undefined
                });
            break; 
            case "getUpdateAccountPermissionFee":
                this.props.form.setFieldsValue({
                    "getUpdateAccountPermissionFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break; 
            case "getMultiSignFee":
                this.props.form.setFieldsValue({
                    "getMultiSignFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break; 
            case "getAllowProtoFilterNum":
                this.props.form.setFieldsValue({
                    "getAllowProtoFilterNum": item.newValue?item.newValue:undefined
                });
            break;
            case "getShieldedTransactionFee":
                this.props.form.setFieldsValue({
                    "getShieldedTransactionFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;  
            case "getAdaptiveResourceLimitMultiplier":
                this.props.form.setFieldsValue({
                    "getAdaptiveResourceLimitMultiplier": item.newValue !== undefined?item.newValue:''
                });
            break;  
            case "getChangeDelegation":
                this.props.form.setFieldsValue({
                    "getChangeDelegation": item.newValue?item.newValue:undefined
                });
            break; 
            case "getWitness127PayPerBlock":
                this.props.form.setFieldsValue({
                    "getWitness127PayPerBlock": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;  
            case "getAllowTvmSolidity059":
                    this.props.form.setFieldsValue({
                    "getAllowTvmSolidity059": item.newValue?item.newValue:undefined
                });
            break;  
            case "getAdaptiveResourceLimitTargetRatio":
                this.props.form.setFieldsValue({
                    "getAdaptiveResourceLimitTargetRatio": item.newValue !== undefined?item.newValue:''
                });
            break;  
            case "getShieldedTransactionCreateAccountFee":
                this.props.form.setFieldsValue({
                    "getShieldedTransactionCreateAccountFee": item.newValue !== undefined?item.newValue/ONE_TRX:''
                });
            break;  
            case "getForbidTransferToContract":
                    this.props.form.setFieldsValue({
                    "getForbidTransferToContract": item.newValue?item.newValue:undefined
                });
            break;   
        }
        
    })
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
    // if( isUpdate  && !isAuthorFn(author)) return;
    // if(!issuedAsset && (type == 'trc10')){
    //   this.setModal('trx_token_account_limit')
    //   return
    // }
    // if(wallet.balance < 1024*Math.pow(10,6)){
    //   this.setModal('trx_token_fee_message')
    //   return
    // }
    this.props.nextState(this.state)
    nextStep(2)
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
    const { getFieldDecorator, setFieldsValue } = this.props.form;
   
    let { dataSource, proposalsCreateList } = this.state;
    let dataSourceSelected =  _(dataSource).filter(source => source.checked).value()
    const columns = [
    {
        title: upperFirst(intl.formatMessage({id: 'proposal_content'})),
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
    },
    {
      title: upperFirst(intl.formatMessage({id: 'proposal_new_value'})),
      dataIndex: 'select',
      key: 'select',
      align:'right',
    //   width:'15%',
      render: (text, record, index) => {
          return <span>
              {
                  record.key == "getMaintenanceTimeInterval" &&  <Form.Item>
                    {getFieldDecorator('getMaintenanceTimeInterval', {
                        rules: [{ required: true, message: tu("proposal_validate_text_0")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_0'})}
                            min={81}
                            max={86400}
                            precision={0}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              }
              {
                record.key == "getAccountUpgradeCost" &&  <Form.Item>
                    {getFieldDecorator('getAccountUpgradeCost', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getCreateAccountFee" &&  <Form.Item>
                    {getFieldDecorator('getCreateAccountFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getTransactionFee" &&  <Form.Item>
                    {getFieldDecorator('getTransactionFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAssetIssueFee" &&  <Form.Item>
                    {getFieldDecorator('getAssetIssueFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getWitnessPayPerBlock" &&  <Form.Item>
                    {getFieldDecorator('getWitnessPayPerBlock', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getWitnessStandbyAllowance" &&  <Form.Item>
                    {getFieldDecorator('getWitnessStandbyAllowance', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getEnergyFee" &&  <Form.Item>
                    {getFieldDecorator('getEnergyFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getExchangeCreateFee" &&  <Form.Item>
                    {getFieldDecorator('getExchangeCreateFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getMaxCpuTimeOfOneTx" &&  <Form.Item>
                    {getFieldDecorator('getMaxCpuTimeOfOneTx', {
                        rules: [{ required: true, message: tu("proposal_validate_text_2")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_2'})}
                            min={0}
                            max={1000}
                            precision={0}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAllowUpdateAccountName" &&  <Form.Item>
                    {getFieldDecorator('getAllowUpdateAccountName', {
                        rules: [{ required: true, message: tu("proposal_validate_text_3") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_3'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_allowed")}</Option>
                            <Option value="0">{tu("propose_not_allowed")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAllowTvmTransferTrc10" &&  <Form.Item>
                    {getFieldDecorator('getAllowTvmTransferTrc10', {
                        rules: [{ required: true, message: tu("proposal_validate_text_3") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_3'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_allowed")}</Option>
                            <Option value="0">{tu("propose_not_allowed")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              }
              {
                record.key == "getTotalEnergyCurrentLimit" &&  <Form.Item>
                    {getFieldDecorator('getTotalEnergyCurrentLimit', {
                        rules: [{ required: true, message: tu("proposal_validate_text_9")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_9'})}
                            min={0}
                            max={100000000000000000}
                            precision={0}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAllowMultiSign" &&  <Form.Item>
                    {getFieldDecorator('getAllowMultiSign', {
                        rules: [{ required: true, message: tu("proposal_validate_text_3") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_3'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_allowed")}</Option>
                            <Option value="0">{tu("propose_not_allowed")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAllowAdaptiveEnergy" &&  <Form.Item>
                    {getFieldDecorator('getAllowAdaptiveEnergy', {
                        rules: [{ required: true, message: tu("proposal_validate_text_3") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_3'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_allowed")}</Option>
                            <Option value="0">{tu("propose_not_allowed")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              } 
              {
                record.key == "getUpdateAccountPermissionFee" &&  <Form.Item>
                    {getFieldDecorator('getUpdateAccountPermissionFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_5")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_5'})}
                            min={0}
                            max={100000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getMultiSignFee" &&  <Form.Item>
                    {getFieldDecorator('getMultiSignFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_5")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_5'})}
                            min={0}
                            max={100000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              }
              {
                record.key == "getAllowProtoFilterNum" &&  <Form.Item>
                    {getFieldDecorator('getAllowProtoFilterNum', {
                        rules: [{ required: true, message: tu("proposal_validate_text_6") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_6'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_activate")}</Option>
                            <Option value="0">{tu("propose_not_activate")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              }
              {
                record.key == "getShieldedTransactionFee" &&  <Form.Item>
                    {getFieldDecorator('getShieldedTransactionFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_5")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_5'})}
                            min={0}
                            max={100000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              }   
              {
                record.key == "getAdaptiveResourceLimitMultiplier" &&  <Form.Item>
                    {getFieldDecorator('getAdaptiveResourceLimitMultiplier', {
                        rules: [{ required: true, message: tu("proposal_validate_text_7")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_7'})}
                            min={1}
                            max={10000}
                            precision={0}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              }
              {
                record.key == "getChangeDelegation" &&  <Form.Item>
                    {getFieldDecorator('getChangeDelegation', {
                        rules: [{ required: true, message: tu("proposal_validate_text_6") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_6'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_activate")}</Option>
                            <Option value="0">{tu("propose_not_activate")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              }  
              {
                record.key == "getWitness127PayPerBlock" &&  <Form.Item>
                    {getFieldDecorator('getWitness127PayPerBlock', {
                        rules: [{ required: true, message: tu("proposal_validate_text_1")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_1'})}
                            min={0}
                            max={100000000000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAllowTvmSolidity059" &&  <Form.Item>
                    {getFieldDecorator('getAllowTvmSolidity059', {
                        rules: [{ required: true, message: tu("proposal_validate_text_3") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_3'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_allowed")}</Option>
                            <Option value="0">{tu("propose_not_allowed")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              } 
              {
                record.key == "getAdaptiveResourceLimitTargetRatio" &&  <Form.Item>
                    {getFieldDecorator('getAdaptiveResourceLimitTargetRatio', {
                        rules: [{ required: true, message: tu("proposal_validate_text_8")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_8'})}
                            min={1}
                            max={1000}
                            precision={0}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              }
              {
                record.key == "getShieldedTransactionCreateAccountFee" &&  <Form.Item>
                    {getFieldDecorator('getShieldedTransactionCreateAccountFee', {
                        rules: [{ required: true, message: tu("proposal_validate_text_5")},
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_5'})}
                            min={0}
                            max={10000}
                            precision={6}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber/>
                    )}
                </Form.Item>
              } 
              {
                record.key == "getForbidTransferToContract" &&  <Form.Item>
                    {getFieldDecorator('getForbidTransferToContract', {
                        rules: [{ required: true, message: tu("proposal_validate_text_10") }],
                    })(
                        <Select
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_10'})}
                            onChange={(e)=>{this.onInputChange(e,record)}}
                            className="proposal_w-230"
                        >
                            <Option value="1">{tu("propose_prohibit")}</Option>
                            <Option value="0">{tu("propose_not_prohibit")}</Option>
                        </Select>,
                    )}
                </Form.Item>
              } 

          </span>
      }
    },
  ];

    return (
        <Table
            dataSource={dataSourceSelected}
            columns={columns}
            pagination={false}
            bordered={true}
            rowKey={(record, index) => {
                return index
            }}
        />
    )
  }

  onInputChange = (e, record) =>{
    let {proposalsCreateList,dataSource} = this.state;
    let inputValue;
    switch (record.key){
        case "getMaintenanceTimeInterval":
            inputValue = e * 1000
            break;
        case "getAccountUpgradeCost":
            inputValue = e * ONE_TRX
            break;
        case "getCreateAccountFee":
            inputValue = e * ONE_TRX
            break;  
        case "getTransactionFee":
            inputValue = e * ONE_TRX
            break;     
        case "getAssetIssueFee":
            inputValue = e * ONE_TRX
            break;    
        case "getWitnessPayPerBlock":
            inputValue = e * ONE_TRX
            break;  
        case "getWitnessStandbyAllowance":
            inputValue = e * ONE_TRX
            break;   
        case "getEnergyFee":
            inputValue = e * ONE_TRX
            break;          
        case "getExchangeCreateFee":
            inputValue = e * ONE_TRX
            break;     
        case "getMaxCpuTimeOfOneTx":
            inputValue = e
            break;    
        case "getAllowUpdateAccountName":
            inputValue = e
            break;  
        case "getAllowTvmTransferTrc10":
            inputValue = e
            break; 
        case "getTotalEnergyCurrentLimit":
            inputValue = e
            break; 
        case "getAllowMultiSign":
            inputValue = e
            break;   
        case "getAllowAdaptiveEnergy":
            inputValue = e
            break;  
        case "getUpdateAccountPermissionFee":
            inputValue = e * ONE_TRX
            break;
        case "getMultiSignFee":
            inputValue = e * ONE_TRX
            break;  
        case "getAllowProtoFilterNum":
            inputValue = e
            break;   
        case "getShieldedTransactionFee":
            inputValue = e * ONE_TRX
            break;  
        case "getAdaptiveResourceLimitMultiplier":
            inputValue = e 
            break; 
        case "getChangeDelegation":
            inputValue = e 
            break;   
        case "getWitness127PayPerBlock":
            inputValue = e * ONE_TRX
            break; 
        case "getAllowTvmSolidity059":
            inputValue = e 
            break;   
        case "getAdaptiveResourceLimitTargetRatio":
            inputValue = e 
            break;  
        case "getShieldedTransactionCreateAccountFee":
            inputValue = e * ONE_TRX
            break; 
        case "getForbidTransferToContract":
            inputValue = e 
            break;      
    }
    proposalsCreateList.map((item,index)=>{
        if(item.key == record.id){
            item.newValue = inputValue
        }
    })
    dataSource.map((item,index)=>{
        if(item.id == record.id){
            item.newValue = inputValue
        }
    })
    this.setState({
        proposalsCreateList,
        dataSource,
    },()=>{
        
    })

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.goToNextStep()
      }
    });
  };


  render() {
    let { dataSource } = this.state;
    let { nextStep } = this.props;
    const { locale } = this.props.intl;
    let disabledArr =  _(dataSource).filter(source => (source.checked && source.newValue >=0)).value()
    return (
        <main>
          {this.state.modalSelect}
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <div className="mt-4 set-proposal-form">
                    {this.getColumns()}
            </div>
            <div className="text-right mt-4">
                <button className="btn btn-default btn-lg" onClick={() => nextStep(0)}>
                    {tu("prev_step")}
                </button>
                <button className="ml-4 btn btn-danger btn-lg" htmlType="submit" disabled={disabledArr.length == 0}>{tu('next')}</button>
            </div>
        </Form>
        </main>
    )
  }
}

export default Form.create({ name: 'set_proposal' })(injectIntl(SetProposal));

