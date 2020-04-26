import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import BigNumber from "bignumber.js";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import { Steps, Table, Checkbox,Input } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import {Client} from "../../../services/api";
import _,{upperFirst} from 'lodash'
import {ONE_TRX,IS_MAINNET} from "../../../constants";
import {transactionResultManager} from "../../../utils/tron";
import { TronLoader } from "../../common/loaders";
import {withTronWeb} from "../../../utils/tronWeb";
const Step = Steps.Step;


@connect(
  state => ({
    wallet: state.wallet.current,
    account: state.app.account,
    walletType: state.app.wallet,
  })
)

@withTronWeb
export class SubmitProposal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: null,
      loading: false,
      dataSourceSelectedArr:[],
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
    let { dataSource, proposalsCreateList, dataSourceSelectedArr } = this.state;
    let dataSourceSelected =  _(dataSource).filter(source => source.checked).value()
    dataSourceSelected.map((item,index)=>{
        if(item.value === parseFloat(item.newValue)){
            item.same = true

        }else{
            item.same = false
        }
    })
    this.setState({
        dataSourceSelectedArr:dataSourceSelected
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
    nextStep(4)
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
    let { dataSourceSelectedArr } = this.state
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
        dataIndex: 'newValue',
        key: 'newValue',
        render: (text, record, index) => {
            return  <div>
                {
                    <div>
                        {
                            IS_MAINNET?<div>
                                {
                                    record.key == 'getMaintenanceTimeInterval' && <div><span>{text / (1000 * 60 * 60)}</span> &nbsp;<span>{
                                        intl.formatMessage({id: "propose_hour"})
                                    }</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                        
                                    </div>
                                }
                                {
                                    record.key == 'getAccountUpgradeCost' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getCreateAccountFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getTransactionFee' && <div>
                                        <span>{text}</span> &nbsp;<span>Sun/byte</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAssetIssueFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getWitnessPayPerBlock' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getWitnessStandbyAllowance' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
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
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getRemoveThePowerOfTheGr' && <div>
                                        {
                                            <span>{tu('propose_finished')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getEnergyFee' && <div>
                                        {
                                            <span>{text / ONE_TRX} TRX</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getExchangeCreateFee' && <div>
                                        {
                                            <span>{text / ONE_TRX} TRX</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getMaxCpuTimeOfOneTx' && <div>
                                        {
                                            <span>{text} ms</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowUpdateAccountName' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowSameTokenName' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowDelegateResource' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }

                                {
                                    record.key == 'getTotalEnergyLimit' && <div>
                                        {
                                            <span>{text}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowTvmTransferTrc10' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getTotalEnergyLimitNew' && <div>
                                        {
                                            <span>{text}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getTotalEnergyCurrentLimit' && <div>
                                        {
                                            <span>{new BigNumber(text).toFixed()} ENERGY</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowMultiSign' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowAdaptiveEnergy' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getTotalEnergyTargetLimit' && <div>
                                        <span>{text}</span>/
                                        <span>{tu('propose_minute')}</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getTotalEnergyAverageUsage' && <div>
                                        {
                                            text?<span><span>{text}</span>/<span>{tu('propose_minute')}</span></span>:
                                                <span>{tu('propose_not_activate')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getUpdateAccountPermissionFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;
                                        <span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getMultiSignFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;
                                        <span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }

                                {
                                    record.key == 'getAllowProtoFilterNum' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_activate')}</span>:
                                                <span>{tu('propose_not_activate')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowTvmConstantinople' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowShieldedTransaction' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {                       
                                    record.key == 'getShieldedTransactionFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {                       
                                    record.key == 'getAdaptiveResourceLimitMultiplier' && <div>
                                        <span>{text}</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }

                                {
                                    record.key == 'getChangeDelegation' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_activate')}</span>:
                                                <span>{tu('propose_not_activate')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getWitness127PayPerBlock' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                        record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getAllowTvmSolidity059' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_allowed')}</span>:
                                                <span>{tu('propose_not_allowed')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {                       
                                    record.key == 'getAdaptiveResourceLimitTargetRatio' && <div>
                                        <span>{text}</span>
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getShieldedTransactionCreateAccountFee' && <div>
                                        <span>{text / ONE_TRX}</span> &nbsp;<span>TRX</span>
                                        {
                                        record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                                {
                                    record.key == 'getForbidTransferToContract' && <div>
                                        {
                                            Number(text)? <span>{tu('propose_prohibit')}</span>:
                                                <span>{tu('propose_not_prohibit')}</span>
                                        }
                                        {
                                            record.same && <span className="proposal-value-same ml-1">({tu('proposal_value_same')})</span>
                                        }
                                    </div>
                                }
                            </div>:<div>
                                {
                                    record.key == 'getChargingSwitch' && <div>
                                        {
                                            record.value != '0'? <span>{tu('propose_activate')}</span>:
                                                <span>{tu('propose_not_activate')}</span>
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
                                                <span>{tu('propose_not_activate')}</span>
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
                                                <span>{tu('propose_not_activate')}</span>
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
            dataSource={dataSourceSelectedArr}
            columns={columns}
            pagination={false}
            bordered={true}
            rowKey={(record, index) => {
                return index
            }}
        />
    )
  }

  onInputGetAdaptiveResourceLimitTargetRatio = (e, record) =>{
    let {proposalsCreateList} = this.state;
    proposalsCreateList.map((item,index)=>{
        if(item.key == record.id){
            item.newValue = e.target.value
        }
    })
    this.setState({
        proposalsCreateList
    },()=>{
       
    })

  }
  hideModal = () => {
    this.setState({
      modal: null
    });
  };
  confirmSubmit = () => {
    let { intl } = this.props;
    this.setState({
      modal: (
        <SweetAlert
          info
          showCancel
          confirmBtnText={intl.formatMessage({ id: "confirm" })}
          confirmBtnBsStyle="success"
          cancelBtnText={intl.formatMessage({ id: "cancel" })}
          cancelBtnBsStyle="default"
          title={intl.formatMessage({ id: "proposal_submit_text" })}
          onConfirm={this.createProposal}
          onCancel={this.hideModal}
          //style={{marginLeft: '-240px', marginTop: '-195px'}}
        ></SweetAlert>
      )
    });
  };

  createProposal = async () =>{
    let { dataSource, proposalsCreateList } = this.state;
    const { account ,intl } = this.props;
    this.setState({
      modal: (
        <SweetAlert
          showConfirm={false}
          showCancel={false}
          cancelBtnBsStyle="default"
          title={intl.formatMessage({ id: "in_progress" })}
          //style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
        >
          <TronLoader />
        </SweetAlert>
      ),
      loading: true
    });
    let proposalsCreateListNew  = [];
    let res, tronWeb;
    proposalsCreateList.map((item,index)=>{
      proposalsCreateListNew.push({"key": Number(item.key), "value":parseFloat(item.newValue)})
    })
    if(this.props.walletType.type === "ACCOUNT_LEDGER"){
        tronWeb = this.props.tronWeb();
    }else{
        tronWeb = account.tronWeb;
    }
    
    const unSignTransaction = await tronWeb.transactionBuilder.createProposal(proposalsCreateListNew,tronWeb.address.toHex(account.address),1).catch(res=>console.log(res))
  
  
    if (!unSignTransaction && unSignTransaction != "") {
      res = false;
    } else {
      const {result} = await transactionResultManager(unSignTransaction, tronWeb).catch(res=>console.log('res',res));
      res = result;
    }
    this.setState({
      res,
      modal:null,
      loading:false,
    },()=>{
      this.props.nextState(this.state)
      this.props.nextStep(3)
    })
  }


  render() {
    let { modal, dataSource, dataSourceSelectedArr } = this.state;
    let { nextStep } = this.props;
    const { locale } = this.props.intl;
    let disabledArr =  _(dataSourceSelectedArr).filter(source => source.same).value()
    
    return (
        <main>
          {modal}
          <div className="mt-4">
            {this.getColumns()}
          </div>
          <div className="text-right mt-4">
            <button className="btn btn-default btn-lg"onClick={() => nextStep(1)}>
                {tu("prev_step")}
            </button>
            <button className="ml-4 btn btn-danger btn-lg" onClick={this.confirmSubmit} disabled={disabledArr.length > 0}>{tu('submit')}</button>
          </div>
        </main>
    )
  }
}

export default injectIntl(SubmitProposal);
