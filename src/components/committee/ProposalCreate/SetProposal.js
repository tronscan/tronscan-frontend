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
    this.getSelectedPropsal();
  }
  onChange(e,record) {
    console.log(`checked = ${e.target.checked}`);
    console.log(`record =` ,record);
  }
  
  getSelectedPropsal = () => {
    let {proposalsCreateList,dataSource} = this.state;
    console.log('proposalsCreateList',proposalsCreateList);
    console.log('dataSource',dataSource)
    let dataSourceSelected =  _(dataSource).filter(source => source.checked).value()
    dataSourceSelected.map((item,index)=>{
        console.log('item=====================1000000009123123',item)
        switch (item['key']){
            case "getMaintenanceTimeInterval":
                this.props.form.setFieldsValue({
                    "getMaintenanceTimeInterval": item.newValue?item.newValue/1000:''
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
    // console.log('prevState.step',prevState.step)
    // console.log('this.state.step',this.state.step)
    // if(prevProps.step !== this.props.step){

    // }
    
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
    // dataSourceSelected.map((item,index)=>{
    //     switch (item['key']){
    //         case "getMaintenanceTimeInterval":
    //             this.props.form.setFieldsValue({
    //                 [item.key]: item.newValue?item.newValue:0
    //             });
    //             break;
    //     }
        
    // })
    console.log('dataSource=======',dataSource)
    console.log('dataSourceSelected=======',dataSourceSelected)
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
        title:upperFirst(intl.formatMessage({id: 'proposal_new_value'})),
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
            
                <Form.Item>
                    {getFieldDecorator('getMaintenanceTimeInterval', {
                        rules: [{ required: true, message: tu("proposal_validate_text_0")},
                      //  { min: 81000, max: 86400000, message: tu("proposal_validate_text_0") }
                    ],
                    })(
                        <InputNumber
                            placeholder={intl.formatMessage({id: 'proposal_validate_text_0'})}
                            min={81000}
                            max={86400000}
                            className="proposal_w-230"
                            onChange={(e)=>{this.onInputChange(e,record)}}
                        />,
                        <InputNumber
                />
                    )}
                </Form.Item>
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
    console.log('e=========================10000000000',e) 
    console.log('record=========================10000000000',record) 
    let {proposalsCreateList,dataSource} = this.state;
    let inputValue;
    if(record.key == 'getMaintenanceTimeInterval'){
        inputValue = e*1000
    }
    proposalsCreateList.map((item,index)=>{
        console.log('item',item)
        if(item.key == record.id){
            item.newValue = inputValue
        }
    })
    dataSource.map((item,index)=>{
        console.log('item',item)
        if(item.id == record.id){
            item.newValue = inputValue
        }
    })
    this.setState({
        proposalsCreateList,
        dataSource,
    },()=>{
        console.log('proposalsCreateList999====99999',proposalsCreateList)
        console.log('dataSource999=======999',dataSource)
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
    let {type} = this.props.state;
    let {nextStep} = this.props;
    const { locale } = this.props.intl;

    
    return (
        <main>
          {this.state.modalSelect}
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <div className="mt-4">
                    {this.getColumns()}
            </div>
            <div className="text-right mt-4">
                <button className="btn btn-default btn-lg"onClick={() => nextStep(0)}>
                    {tu("prev_step")}
                </button>
                <button className="ml-4 btn btn-danger btn-lg" htmlType="submit" >{tu('next')}</button>
            </div>
        </Form>
        </main>
    )
  }
}

export default Form.create({ name: 'set_proposal' })(injectIntl(SetProposal));

