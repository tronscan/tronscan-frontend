import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps, Table, Checkbox, Tag } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";
import _,{upperFirst} from 'lodash'
import {API_URL, ONE_TRX,IS_MAINNET,uuidv4} from "../../../constants";
import xhr from "axios";
const Step = Steps.Step;

@connect(
  state => ({
    wallet: state.wallet.current,
  })
)

export class SelectProposal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
      modalSelect: null,
      issuedAsset: null,
      ...this.props.state
    };
  }
  componentDidMount() {
    this.props.nextState({leave_lock: true})
    this.getChainparameters();
    
  }
  hasSelectProposal = () => {

  }
  onChange(e,record,index) {
     let { proposalsCreateList, dataSource } = this.state;
    if(e){
        let proposalsSelectedListNew = proposalsCreateList;
        proposalsSelectedListNew.push({'key': record.id, 'value':record.value, 'name':record.name})
        this.setState({
            proposalsCreateList:  proposalsSelectedListNew
        },()=>{
            let dataSourceArr = dataSource.slice(0);
            for(let i = 0; i<dataSourceArr.length;i++){
                if(record.id == dataSourceArr[i]['id']){
                    dataSourceArr[i].checked = true;
                }
            }
            this.setState({
                dataSource: dataSourceArr
            })
        })
    }else{
        let proposalsSelectedListNew
        if(index == 10000){
            proposalsCreateList =  _(proposalsCreateList).filter(proposal => proposal.key !== record.key).value()
        }else{
            proposalsCreateList =  _(proposalsCreateList).filter(proposal => proposal.key !== record.id).value()
        }
        this.setState({
            proposalsCreateList: [...proposalsCreateList]
        },()=>{

            let dataSourceArr = dataSource.slice(0);
            for(let i = 0; i<dataSourceArr.length;i++){
                    if(index == 10000){
                        if(record.key == dataSourceArr[i]['id']){
                            dataSourceArr[i].checked = false;
                           
                        }
                    }else{
                        if(record.id == dataSourceArr[i]['id']){
                            dataSourceArr[i].checked = false;
                           
                        }
                    }
                    
                    // else{
                    //     dataSource[i].checked = false;
                    // }
                //}
            }
            this.setState({
                dataSource: dataSourceArr
            })
           
            
            
        })
    }  
   

  }
    async getChainparameters() {
        let {proposalsCreateList} = this.state;
        if(IS_MAINNET){
            let data  = await xhr.get(`${API_URL}/api/chainparameters?uuid=${uuidv4}&type=1`);
            let tronParameters = data.data.tronParameters;
           
            if(!tronParameters){
                return
            }
            // let EnergyLimitNew   = {key: "getTotalEnergyLimitNew", value: 100000000000};
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
                    // case "getAllowTvmSolidity059":
                    //     item.name = 'propose_32';
                    //     item.id = '32';
                    //     break;
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
  
  componentDidUpdate(prevProps, prevState) {
    let {wallet} = this.props;
    if (wallet !== null) {
      if (prevProps.wallet === null || wallet.address !== prevProps.wallet.address) {
        this.checkExistingToken()
      }
    }
  }


  goToNextStep =() => {
    const {nextStep, isLoggedInFn, isApplySuperModalFn, wallet, isAuthorFn} = this.props
    const {issuedAsset, isUpdate,paramData:{author}} = this.state;
    const {type} = this.props.state;
    if(!isLoggedInFn()) return;
    // if(!isApplySuperModalFn()) return;
    // if(!issuedAsset && (type == 'trc10')){
    //   this.setModal('trx_token_account_limit')
    //   return
    // }
    // if(wallet.balance < 1024*Math.pow(10,6)){
    //   this.setModal('trx_token_fee_message')
    //   return
    // }
    this.props.nextState(this.state)
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
    let { dataSource, proposalsCreateList } = this.state;
   
    let dataSourceArr = dataSource.slice(0);
    for(let i = 0; i < proposalsCreateList.length;i++){
        for(let j = 0; j < dataSourceArr.length;j++){
            if(proposalsCreateList[i]['key'] == dataSourceArr[j]['id']){
                dataSourceArr[j].checked = true;
                dataSourceArr[j].newValue = proposalsCreateList[i].newValue;
            }
        }
        
    }
    
    // this.setState({
    //     dataSource: dataSourceArr
    // })
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
      title: upperFirst(intl.formatMessage({id: 'proposal_select_table'})),
      dataIndex: 'select',
      key: 'select',
      align:'right',
      width:'15%',
      render: (text, record, index) => {
          return <span>
               <Checkbox checked={record.checked} onChange={(e)=>this.onChange(e.target.checked,record,index)}></Checkbox>
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

  tagClose = (tag) => {
    let { proposalsCreateList, dataSource} = this.state;
   
    let index = 10000
    this.onChange(false,tag,10000)
    
  };
  

  render() {
    let {proposalsCreateList,dataSource} = this.state;
    const { locale } = this.props.intl
    return (
        <main>
          {this.state.modalSelect}
          { proposalsCreateList.length > 0 &&  <div>
                <h5>{tu('proposal_selected_network_parameters')}:</h5>  
                <div>
                    {proposalsCreateList.map((tag, index) => {
                       return <span className="proposals-tag"><Tag key={tag.key} closable onClose={() => this.tagClose(tag)}>
                                    {tu(tag.name)}
                              </Tag></span>
                    })}
                </div> 
            </div>  
          }
          <div className="mt-4">
            {this.getColumns()}
          </div>
          <div className="text-right mt-4">
            <button disabled={proposalsCreateList.length === 0} className="ml-4 btn btn-danger btn-lg" onClick={this.goToNextStep}>{tu('next')}</button>
          </div>
        </main>
    )
  }
}

export default injectIntl(SelectProposal);
