import React, {Component} from 'react';
import {trim, forIn} from "lodash";
import {tu,t} from "../../utils/i18n";
import {connect} from "react-redux";
import {CopyText} from "../common/Copy";
import {QuestionMark} from "../common/QuestionMark";
import {NavLink} from "react-router-dom";
import {FormattedNumber, injectIntl} from "react-intl";
import {alpha} from "../../utils/str";
import {Tooltip} from "reactstrap";
import ContractCodeRequest from "./ContractCodeRequest";
import getCompiler from "../../utils/compiler";
import {Client} from "../../services/api";
import {AddressLink} from "../common/Links";
import {Link} from "react-router-dom";
var compile;
class VerifyContractCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            compilers: ['V0.4.24'],
            tabs:[
                {
                    "label":"contract_source_code",
                    "show":true
                },
                {
                    "label":"bytecode_and_ABI",
                    "show":false
                }
            ],
            currIndex:0,
            id24: alpha(24),
            id20: alpha(20),
            open24:false,
            open20:false,
            verified_contract_address:'',
            captcha_code:null,
            verify_status_message:"",
            verify_status_code:"",
            is_contract_address:false,
            formVerify: {
                contract_address: {
                    valid: false,
                    value: '',
                    error: ''
                },
                contract_name: {
                    valid: false,
                    value: '',
                    error: ''
                },
                contract_compiler: {
                    valid: false,
                    value: 'V0.4.24',
                    error: ''
                },
                contract_code: {
                    valid: false,
                    value: '',
                    error: ''
                },
                contract_optimization:{
                    valid: true,
                    value: true,
                    error: ''
                },
                abi_Encoded:{
                    valid: true,
                    value: '',
                    error: ''
                }
            },
            contractInfo_abi: "",
            contractInfo_abiEncoded: "",
            contractInfo_address: "",
            contractInfo_byteCode: "",
            contractInfo_compiler: "",
            contractInfo_isSetting: null,
            contractInfo_name: "",
            contractInfo_source: ""

        };
    }
    handleVerifyCodeChange(field, value) {
        const {formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code}} = this.state;
        const newFieldObj = {value, valid: true, error: ''};
        const contractList = {
            contract_address() {
                if (value.length < 34 || value.length > 34) {
                    newFieldObj.error = '**InvalidLength';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
            },
            contract_code() {
                if (value.length === 0) {
                    newFieldObj.error = '** Please enter the contract source code';
                    newFieldObj.valid = false;
                }
            }
        }
        if(field == 'contract_address' || field == 'contract_code'){
            contractList[field]()
        }
        
        if(field == 'contract_optimization'){
          newFieldObj.value = newFieldObj.value == 'true'
        }

        this.setState({
            formVerify: {
                ...this.state.formVerify,
                [field]: newFieldObj
            }
        });
    }

    handleCaptchaCode = (val) => {
        this.setState({captcha_code: val});
    }
    canRequest = () => {
        let {captcha_code} = this.state;
        return captcha_code;
    };

    handleClick(index){
        this.setState({ currIndex:index });
    }
    compilerSelectChange = (e) => {
        this.setState({
            selectedCompiler: e.target.value
        });
    }

    optSelectChange = (e) => {
        this.setState({
            optimization: e.target.value
        });
    }
    handleReset = (e) => {
        let abi_EncodedReset = '';
        let abi_EncodedData = Object.assign({}, this.state.formVerify.abi_Encoded, { value: abi_EncodedReset });
        let formVerifyReset = Object.assign({}, this.state.formVerify, { abi_Encoded: abi_EncodedData });
        let newData= {value:'', valid: true, error: ''};
        let newCompiler = {valid: false, value: 'V0.4.24', error: ''};
        let newOptimization={valid: true, value: true, error: ''};
        this.setState({
            formVerify: {
                ...this.state.formVerify,
                contract_address:newData,
                contract_name:newData,
                contract_compiler:newCompiler,
                contract_code:newData,
                contract_optimization:newOptimization,
                abi_Encoded: newData
            },
            is_contract_address:true
        },() => {

        });
    }
    handleStartOver = () =>{
        this.setState({
            currIndex:0
        })
    }
    contractsVerify = async (VerifyInfo) => {
        let contractData = await Client.contractsVerify(VerifyInfo);
        this.setState(preState=>({
            tabs:preState.tabs.filter(item=>{
                return item.show=true;

            }),
            currIndex:1
        }))
        let contractInfo = contractData.data;
        let contractStatus = contractData.status;
        this.setState({
            contractInfo_abi: contractInfo.abi,
            contractInfo_abiEncoded: contractInfo.abiEncoded,
            contractInfo_address: contractInfo.address,
            contractInfo_byteCode: contractInfo.byteCode,
            contractInfo_compiler: contractInfo.compiler,
            contractInfo_isSetting: contractInfo.isSetting,
            contractInfo_name: contractInfo.name,
            contractInfo_source: contractInfo.source,
            verify_status_message:contractStatus.message,
            verify_status_code:contractStatus.code
        },() => {

        });
    };

    handleVerifyCode = async (e) =>{
        e.preventDefault();
        const {formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded},verified_contract_address,captcha_code} = this.state;
    
        const list = ['contract_address', 'contract_code']
        list.map(item => {
            setTimeout( () => {
                this.handleVerifyCodeChange(item,  eval(item).value)
            }, 100)
        })
       if( !(contract_address.valid && contract_code.valid)){
           return;
       }

        let iSContractData = await Client.getContractOverview(contract_address.value);
        if (!iSContractData.data.length) {
            this.setState({
                is_contract_address: true
            }, () => {

            });
            return;
        }
        let iSVerifiedContractData = await Client.getContractCode(contract_address.value);
        if(iSVerifiedContractData.data.address){
            this.setState({
                verified_contract_address: iSVerifiedContractData.data.address
            }, () => {
                document.documentElement.scrollTop = 500;
            });
        }else{
            let resource = contract_code.value
            let optimize = 1;
            let result = compile(resource, optimize);
            let arrContract = [];
            let arrByteCode = [];
            let arrAbi = [];
            for (var name in result.contracts) {
                arrContract.push(name);
                if (result.contracts[name].bytecode) {
                    let bytecode = result.contracts[name].bytecode;
                    arrByteCode.push(bytecode);
                    let metadata = JSON.parse(result.contracts[name].metadata);
                    let abi = JSON.stringify(metadata.output.abi);
                    arrAbi.push(abi);
                }
            }
            let VerifyInfo = {
                address: contract_address.value,//合约地址
                name: contract_name.value,//合约名称
                compiler: contract_compiler.value, //编译器版本
                isSetting: contract_optimization.value,//是否优化
                source: contract_code.value,//合约源代码
                byteCode:arrByteCode[0],//编译生成的二进制代码
                abi:arrAbi[0],//编译生成的abi
                //abi:'[{"constant":true,"name":"ceoAddress","outputs":[{"type":"address"}],"type":2,"stateMutability":2},{"name":"payForCeoAddress","type":2,"payable":true,"stateMutability":4},{"name":"payForContract","type":2,"payable":true,"stateMutability":4},{"constant":true,"name":"getContractBalance","outputs":[{"type":"address"},{"type":"uint256"}],"type":2,"stateMutability":2},{"constant":true,"name":"getCeoBalance","outputs":[{"type":"address"},{"type":"uint256"}],"type":2,"stateMutability":2},{"name":"withDrawFromContract","type":2,"stateMutability":3},{"type":1,"stateMutability":3}]',
                //byteCode:'608060405234801561001057600080fd5b5060008054600160a060020a031990811633179091556001805490911630179055610227806100406000396000f3006080604052600436106100775763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630a0f8168811461007c5780631de0f768146100ba5780632ba28453146100c45780636f9fb98a146100cc5780639c363c2f14610111578063ccd3edc614610126575b600080fd5b34801561008857600080fd5b5061009161013b565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6100c2610157565b005b6100c26101a1565b3480156100d857600080fd5b506100e16101a3565b6040805173ffffffffffffffffffffffffffffffffffffffff909316835260208301919091528051918290030190f35b34801561011d57600080fd5b506100e16101aa565b34801561013257600080fd5b506100c26101c9565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b6000805460405173ffffffffffffffffffffffffffffffffffffffff909116913480156108fc02929091818181858888f1935050505015801561019e573d6000803e3d6000fd5b50565b565b3080319091565b60005473ffffffffffffffffffffffffffffffffffffffff1680319091565b604051339081906000906305f5e1009082818181858883f193505050501580156101f7573d6000803e3d6000fd5b50505600a165627a7a72305839',
                //abiEncoded:'96e2df2c9c5370014b73d321699a968dcd8209bb8281decfbafbfc34f41ff5b30029',
                abiEncoded:abi_Encoded.value,//编译所需参数
                captchaCode:captcha_code
                // librarys:librarys
            }
            this.contractsVerify(VerifyInfo)
        }

   }
   setVerifyStatus = (code) =>{
       let {compilers,tabs,currIndex,verified_contract_address,id20,id24,open24,open20,formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded},contractInfo_abi, contractInfo_abiEncoded, contractInfo_address, contractInfo_byteCode, contractInfo_compiler, contractInfo_isSetting, contractInfo_name, contractInfo_source,is_contract_address,verify_status_message,verify_status_code} = this.state;
       let ele = null;
       switch (code){
           case 0:
               ele = <div className="d-flex">
                   <span className="click-here-to_view">{tu('successfully_generated_byteCode')}</span>
                   &nbsp;
                   <div className="contract-address-text_underline">
                       <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                   </div>
               </div>
               break;
           case 1001:
               ele = <div className="d-flex">
                   <span>{tu('error_construct_ABI_encoded')}</span>
                   &nbsp;
                   <span>'{contractInfo_name}'</span>
               </div>
           break;
           case 1002:
               ele =<div>
                   <div className="d-flex">
                       <span className="click-here-to_view">{tu('error_construct_bytecode_for')}</span>
                       &nbsp;
                       <span className="click-here-to_view">'{contract_name.value}'</span>
                       &nbsp;
                       <span className="click-here-to_view">{tu('the_contract_creation_code_for')}</span>
                       &nbsp;
                       <div className="contract-address-text_underline">
                           <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                       </div>
                   </div>
                   <div>{tu('unableto_verify_contract_source_code')}</div>
               </div>
               break;
           case 1003:
               ele =<div>
                   <div className="d-flex">
                       <span className="click-here-to_view">{tu('error_construct_bytecode_for')}</span>
                       &nbsp;
                       <span className="click-here-to_view">'{contract_name.value}'</span>
                       &nbsp;
                       <span className="click-here-to_view">{tu('the_contract_creation_code_for')}</span>
                       &nbsp;
                       <div className="contract-address-text_underline">
                           <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                       </div>
                   </div>
                   <div>{tu('contractname_found')}: '{contractInfo_name}'</div>
                   <div>{tu('unableto_verify_contract_source_code')}</div>
               </div>
               break;
           case 1004:
               ele = <div>
                   <div className="d-flex">
                       <span className="click-here-to_view">{tu('error_contract_ABI_for')}</span>
                       &nbsp;
                       <span className="click-here-to_view">'{contract_name.value}'</span>
                       &nbsp;
                       <span className="click-here-to_view">{tu('the_contract_creation_code_for')}</span>
                       &nbsp;
                       <div className="contract-address-text_underline">
                           <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                       </div>
                   </div>
                   <div>{tu('unableto_verify_contract_source_code')}</div>
               </div>
               break;
           default:
               ele =<div>
                   <div className="d-flex">
                       <span className="click-here-to_view">{tu('error_construct_bytecode_for')}</span>
                       &nbsp;
                       <span className="click-here-to_view">'{contract_name.value}'</span>
                       &nbsp;
                       <span className="click-here-to_view">{tu('the_contract_creation_code_for')}</span>
                       &nbsp;
                       <div className="contract-address-text_underline">
                           <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                       </div>
                   </div>
                   <div>{tu('unableto_verify_contract_source_code')}</div>
               </div>
       }
       return ele

   }

  componentDidMount() {

     this.getCompile()
  }
  async getCompile (){
     compile = await getCompiler();
  }


  render() {
    let {compilers,tabs,currIndex,verified_contract_address,id20,id24,open24,open20,formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded},contractInfo_abi, contractInfo_abiEncoded, contractInfo_address, contractInfo_byteCode, contractInfo_compiler, contractInfo_isSetting, contractInfo_name, contractInfo_source,is_contract_address,verify_status_message,verify_status_code} = this.state;
    let {intl} = this.props;

    return (
        <main className="contract container header-overlap">
          <div className="card contract-code_body" style={styles.card}>
            <div className="card-header list-style-body__header">
              <ul className="nav nav-tabs card-header-tabs">
                  {
                      tabs.map((val,index) =>{
                          return (
                              <li className={val.show?"nav-item contract-show":"nav-item contract-hide"} onClick={(e) => this.handleClick(index)} key={index}>
                                <a href="javascript:;"  className={ index == currIndex ? 'nav-link text-dark active' : 'nav-link text-dark'}>
                            <span>
                                <span>{tu(val.label)}</span>
                            </span>
                                </a>
                              </li>
                          )
                      })
                  }
              </ul>
            </div>
            <div className={currIndex == 0? "contract-show":"contract-hide"}>
              <div className="card-body contract-body">
                <div>
                  <h5 className="card-title text-left contract-title">{tu("verify_and_publish_your_solidity_source_code")}</h5>
                  <p>
                      {tu("step")} 1 : {tu("step_1")}
                  </p>
                  <p>
                      {tu("step")} 2 : {tu("step_2")}
                  </p>
                  <p>
                      {tu("step")} 3 : {tu("step_3")}
                  </p>
                  <hr/>

                  <p>
                      {tu("contract_notes")}
                  </p>
                  <p>
                    1. {tu("contract_notes_1")}
                  </p>
                  <p>
                    2. {tu("contract_notes_2_1")}
                    <a href="https://github.com/tronprotocol/tron-studio">
                        {tu("contract_notes_2_2")}
                    </a>
                      {t("contract_notes_2_3")}
                  </p>
                  <p>
                    3. {t("contract_notes_3")}
                  </p>
                  <p>
                    4. {t("contract_notes_4")}
                  </p>
                  <p>
                    5. {t("contract_notes_5")}
                  </p>
                  <p>
                    6. {t("contract_notes_6")}
                  </p>
                </div>
              </div>
              <hr style={styles.hr}/>
              <div className={!verified_contract_address? "card-body contract-body-input contract-show":"card-body contract-body-input contract-hide"}>
                  <div className={is_contract_address?"contract-show":"contract-hide"}>
                      <div className="mb-4">
                          <div className="d-flex">
                              <span className="click-here-to_view contract-address-unable-error">
                                   {tu('sorry_unable_contract_address') }
                              </span>
                              &nbsp;&nbsp;
                              <div style={styles.addressWidth} className="contract-address-text_underline">
                                  <AddressLink address={contractInfo_address} isContract={true}>{contract_address.value}</AddressLink>
                              </div>
                              <span className="click-here-to_view">
                                  {tu('this_a_valid_contract_address')}
                              </span>

                          </div>
                      </div>
                  </div>
                  <div className="row">
                  <div className="col-md-4 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}}>{tu("contract_address")}
                          <span className="contract-error">{contract_address.error}</span>
                      </label>
                      <div className="d-flex contract-div-bg">
                        <input type="text" className="form-control"
                               placeholder={intl.formatMessage({id: 'contract_address'})}
                               value={contract_address.value}
                               name="contract_address"
                               onInput={(e) => this.handleVerifyCodeChange('contract_address', e.target.value)}
                        />
                        <CopyText text={contract_address.value} className="ml-auto contract-copy mr-2"/>
                      </div>
                    </section>
                  </div>
                  <div className="col-md-4 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}} className="d-flex">{tu("contract_name")}
                        <div className="mt-1 ml-2">
                          <QuestionMark placement="top" text="contract_name_tip"/>
                        </div>
                        <span className="contract-error">{contract_name.error}</span>
                      </label>
                      <div className="d-flex contract-div-bg">
                        <input type="text" className="form-control"
                               placeholder={intl.formatMessage({id: 'contract_name'})}
                               value={contract_name.value}
                               name="contract_name"
                               onInput={(e) => this.handleVerifyCodeChange('contract_name', e.target.value)}
                        />
                        <CopyText text={contract_name.value} className="ml-auto contract-copy mr-2"/>
                      </div>
                    </section>
                  </div>
                  <div className="col-md-2 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}}>{tu("compiler")}
                      </label>
                      <div>
                        <select className="custom-select"
                                name="contract_compiler"
                                value={contract_compiler.value}
                                onChange={(e) => this.handleVerifyCodeChange('contract_compiler', e.target.value)}>
                            {
                                compilers.map((compiler, index) => {
                                    return (
                                        <option key={index} value={compiler}>{compiler}</option>
                                    )
                                })
                            }
                        </select>
                      </div>
                    </section>
                  </div>
                  <div className="col-md-2 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}}>{tu("contract_optimization")}
                      </label>
                      <div>
                        <select className="custom-select"
                                name="contract_optimization"
                                value={contract_optimization.value}
                                onChange={(e) => this.handleVerifyCodeChange('contract_optimization', e.target.value)}
                        >
                          <option key={1} value={true}>Yes</option>
                          <option key={0} value={false}>No</option>
                        </select>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="row mt-3 contract-code">
                  <div className="col-md-12 ">
                    <div className="d-flex mb-1">
                      <span className="mb-3">{tu("enter_contract_code")}</span>
                        <span className="contract-error">{contract_code.error}</span>
                    </div>
                    <textarea className="w-100 form-control"
                              rows="11"
                              value={contract_code.value}
                              name="contract_code"
                              onInput={(e) => this.handleVerifyCodeChange('contract_code', e.target.value)}
                     />
                  </div>
                </div>
                <hr style={styles.hr_32}/>
                <div className="row mt-3 contract-ABI">
                  <div className="col-md-12 ">
                    <p className="mb-3">
                        {tu("following_optional_parameters")}
                    </p>
                    <div className="d-flex">
                      <p style={styles.s_title}>{tu("constructor_arguments_ABIencoded")}</p>
                      <div className="mt-1 ml-2">
                        <QuestionMark placement="top" text="constructor_arguments_ABIencoded_tip"/>
                      </div>
                    </div>
                    <textarea className="w-100 form-control mt-3"
                              rows="1"
                              value={abi_Encoded.value}
                              name="abi_Encoded"
                              onChange={(e) => this.handleVerifyCodeChange('abi_Encoded', e.target.value)}/>

                  </div>
                  {/*<div className="col-md-12">*/}
                    {/*<p className="mt-5">{tu("contract_library_address")}</p>*/}
                    {/*<div className="row ml-0" style={styles.rowRight}>*/}
                      {/*<div className="col-md-5 contract-input">*/}
                    {/*<span id={id20}*/}
                          {/*onMouseOver={() => this.setState({open20: true})}*/}
                          {/*onMouseOut={() => this.setState({open20: false})}>*/}
                    {/*{tu("library_1_name")}:</span>*/}
                        {/*<Tooltip placement="top" isOpen={open20} target={id20}>*/}
                          {/*<span className="text-lowercase text-left">{t("library_1_name_tip")}</span>*/}
                        {/*</Tooltip>*/}
                        {/*<input type="text" className="form-control contract-input-s"/>*/}
                      {/*</div>*/}
                      {/*<div className="col-md-7 contract-input">*/}
                    {/*<span*/}
                        {/*id={id24}*/}
                        {/*onMouseOver={() => this.setState({open24: true})}*/}
                        {/*onMouseOut={() => this.setState({open24: false})}>*/}
                      {/*{tu("library_contract_address")}:</span>*/}
                        {/*<Tooltip placement="top" isOpen={open24} target={id24}>*/}
                          {/*<span className="text-lowercase">{t("library_contract_address_tip")}</span>*/}
                        {/*</Tooltip>*/}
                        {/*<input type="text" className="form-control contract-input-l"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="row ml-0" style={styles.rowRight}>*/}
                      {/*<div className="col-md-5 contract-input">*/}
                        {/*<span>{tu("library_2_name")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-s"/>*/}
                      {/*</div>*/}
                      {/*<div className="col-md-7 contract-input">*/}
                        {/*<span>{tu("library_contract_address")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-l"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="row ml-0" style={styles.rowRight}>*/}
                      {/*<div className="col-md-5 contract-input">*/}
                        {/*<span>{tu("library_3_name")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-s"/>*/}
                      {/*</div>*/}
                      {/*<div className="col-md-7 contract-input">*/}
                        {/*<span>{tu("library_contract_address")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-l"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="row ml-0" style={styles.rowRight}>*/}
                      {/*<div className="col-md-5 contract-input">*/}
                        {/*<span>{tu("library_4_name")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-s"/>*/}
                      {/*</div>*/}
                      {/*<div className="col-md-7 contract-input">*/}
                        {/*<span>{tu("library_contract_address")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-l"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}

                    {/*<div className="row ml-0" style={styles.rowRight}>*/}
                      {/*<div className="col-md-5 contract-input">*/}
                        {/*<span>{tu("library_5_name")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-s"/>*/}
                      {/*</div>*/}
                      {/*<div className="col-md-7 contract-input">*/}
                        {/*<span>{tu("library_contract_address")}:</span>*/}
                        {/*<input type="text" className="form-control contract-input-l"/>*/}
                      {/*</div>*/}
                    {/*</div>*/}
                  {/*</div>*/}
                </div>
                <hr/>

                <div className="float-left" >
                  <ContractCodeRequest  handleCaptchaCode={this.handleCaptchaCode} />
                  <button type="button" className="btn btn-lg btn-verify text-capitalize mt-lg-3 mb-lg-4" onClick={this.handleVerifyCode}>{tu('verify_and_publish')}</button>
                  <button type="button" className="btn btn-lg ml-3 btn-reset text-capitalize mt-lg-3 mb-lg-4" onClick={this.handleReset}>{tu('reset')}</button>
                </div>
              </div>
                <div className={verified_contract_address?"card-body contract-body contract-show":"card-body contract-body contract-hide"}>
                  <div className="contract-address-has_verified">
                      <div>
                          {tu('contract_source_code_for') }
                          &nbsp;&nbsp;
                           <span className="contract_source_code_address">{verified_contract_address}</span>
                          &nbsp;&nbsp;
                          {t('has_already_been_verified') }
                      </div>
                      <div className="d-flex mt-2">
                          <span className="click-here-to_view"> {tu('click_here_to_view')}</span>
                          &nbsp;&nbsp;
                          <Link
                              to={`/contract/${verified_contract_address}/code`}
                              className="address-link text-nowrap "
                              >
                              {tu('contract_source_code')}
                          </Link>
                      </div>
                  </div>
              </div>
            </div>
            <div className={currIndex == 0? "contract-hide":"contract-show"}>
              <div className="card-body byte-code_ABI contract-body pb-5 ">
                <div className="row">
                  <div className="col-lg-12 d-flex">
                    <span>{tu('note')}: </span>
                    &nbsp;
                    <span className="click-here-to_view">{tu('contract_was_creating_during')}</span>
                    &nbsp;&nbsp;
                    <span>{tu('txn')}: </span>
                    &nbsp;
                    <div className="contract-address-text_underline">
                        <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 pt-3 byte-code_error">
                      {
                          this.setVerifyStatus(verify_status_code)
                      }
                  </div>
                </div>
                <hr/>
                <div className="row pt-3">
                  <div className="col-lg-2">
                    <span>{tu('Compiler_Text')}:</span>
                  </div>
                  <div className="col-lg-10">
                    <span>{contractInfo_compiler}</span>
                  </div>
                </div>
                <div className="row pt-3">
                  <div className="col-lg-2">
                    <span>{tu('Optimization_Enabled')}:</span>
                  </div>
                  <div className="col-lg-10">
                    <span>{contractInfo_isSetting?"Yes":"No"}</span>
                  </div>
                </div>
                  {
                      contractInfo_abiEncoded?<div className="row">
                          <div className="col-lg-12 pt-3">
                              <span>{tu('constructor_arguements')}:</span>
                          </div>
                          <div className="col-lg-12 pt-3 contract-input">
                              <input type="text"
                                     className="form-control"
                                     readOnly="readonly"
                                     value={contractInfo_abiEncoded}
                              />
                          </div>
                      </div>:""
                  }
                <div className="row">
                  <div className="col-lg-12 pt-3">
                    <span>{tu('ContractName')}:</span>
                  </div>
                  <div className="col-lg-12 pt-3 contract-input">
                    <input type="text" className="form-control"
                           readOnly="readonly"
                           value={contractInfo_name}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 pt-3">
                    <span>{tu('Contract_Bytecode')}:</span>
                  </div>
                  <div className="col-lg-12 pt-3 contract-input">
                <textarea className="w-100 form-control mt-3"
                          rows="11"
                          readOnly="readonly"
                          value={contractInfo_byteCode}
                          onChange={ev => this.setState({abi: ev.target.value})}/>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 pt-3">
                    <span>{tu('ContractABI')}:</span>
                  </div>
                  <div className="col-lg-12 pt-3 contract-input">
                <textarea className="w-100 form-control mt-3"
                          rows="6"
                          readOnly="readonly"
                          value={contractInfo_abi}
                          onChange={ev => this.setState({abi: ev.target.value})}/>
                  </div>
                </div>
                <div className="float-left pt-3 pb-3">
                  <button type="button" className="btn btn-lg btn-start-over text-capitalize" onClick={this.handleStartOver}>{tu('start_over')}</button>
                </div>
              </div>
            </div>
          </div>

        </main>
    );
}
}

const styles = {
    card: {
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom:'none',
        borderRadius: 0
    },
    hr:{
        borderTop: '3px solid rgba(0, 0, 0, 0.1)',
        margin:0
    },
    hr_32:{
        marginTop:'2rem',
        marginBottom:'2rem'
    },
    s_title:{
        fontSize:16
    },
    rowRight:{
        marginRight:'1.25rem'
    },
    addressWidth:{
        width:"27%"
    }

}
function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifyContractCode))

