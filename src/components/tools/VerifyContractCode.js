import React, {Component} from 'react';
import {trim} from "lodash";
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
import xhr from "axios";
import {AddressLink} from "../common/Links";

var compile;
class VerifyContractCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            abi:"",
            contractCode: "",
            selectedCompiler: "",
            Optimization: true,
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
            contractAddress:'',
            captcha_code:null,
            verifyMessage:"",
            iSContractAddress:false,
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
        switch (field) {
            case 'contract_address': {
                if (value.length < 34 || value.length > 34) {
                    newFieldObj.error = '**InvalidLength';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'contract_name': {
                if (value.length === 0) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'contract_compiler': {
                if (value === 0) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
                break;
            }
            case 'contract_code': {
                if (value.length === 0) {
                    newFieldObj.error = '** Please enter the contract source code';
                    newFieldObj.valid = false;
                }
                break;
            }
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
            iSContractAddress:false
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
            verify_message:contractStatus.message
        },() => {

        });
    };

    handleVerifyCode = async (e) =>{
       e.preventDefault();
       const {formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded},contractAddress,captcha_code} = this.state;
       const newFieldObj = {value:'', valid: true, error: ''};
       if (!contract_address.valid ) {
           if (contract_address.value.length < 34 || contract_address.value.length > 34) {
               newFieldObj.error = '**InvalidLength';
               newFieldObj.valid = false;
           } else if (contract_address.value.length === 0) {
               newFieldObj.error = '**Required';
               newFieldObj.valid = false;
           }
           this.setState({
               formVerify: {
                   ...this.state.formVerify,
                   contract_address: newFieldObj
               }
           });
           return;
       }
       if (!contract_name.valid ) {
           if (contract_name.value.length === 0) {
               newFieldObj.error = '**Required';
               newFieldObj.valid = false;
           }
           return;
       }
       if (!contract_code.valid ) {
           if (contract_code.value.length === 0) {
               newFieldObj.error = '**Required';
               newFieldObj.valid = false;
           }
           return;
       }

        let iSContractData = await Client.getContractOverview(contract_address.value);
        if (!iSContractData.data.length) {
            this.setState({
                iSContractAddress: true
            }, () => {

            });
            return;
        }
        let iSVerifiedContractData = await Client.getContractCode(contract_address.value);
        if(iSVerifiedContractData.data.address){
            this.setState({
                contractAddress: iSVerifiedContractData.data.address
            }, () => {

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
                abiEncoded:abi_Encoded.value,//编译所需参数
                captchaCode:captcha_code
                // librarys:librarys
            }
            this.contractsVerify(VerifyInfo)
        }

   }

  componentDidMount() {
     this.getCompile()
  }
  async getCompile (){
     compile = await getCompiler();
  }


  render() {
    let {contractCode, selectedCompiler, compilers, abi,tabs,currIndex,contractAddress,contractName,id20,id24,open24,open20,formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded},contractInfo_abi, contractInfo_abiEncoded, contractInfo_address, contractInfo_byteCode, contractInfo_compiler, contractInfo_isSetting, contractInfo_name, contractInfo_source,iSContractAddress,verify_message} = this.state;
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
              <div className={!contractAddress? "card-body contract-body-input contract-show":"card-body contract-body-input contract-hide"}>
                  <div className={iSContractAddress?"contract-show":"contract-hide"}>
                      <div className="contract-address-unable-error mb-4">
                          <div>
                              {tu('sorry_unable_contract_address') }
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
                      <label style={{whiteSpace: 'nowrap'}}>{tu("optimization")}
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
                              onChange={(e) => this.handleVerifyCodeChange('contract_code', e.target.value)}
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

                <div className={contractAddress?"card-body contract-body contract-show":"card-body contract-body contract-hide"}>
                  <div className="contract-address-has_verified">
                      <div>
                          {tu('contract_source_code_for') }
                          &nbsp;&nbsp;
                           <span className="contract_source_code_address">{contractAddress}</span>
                          &nbsp;&nbsp;
                          {t('has_already_been_verified') }
                      </div>
                      <div className="d-flex mt-2">
                          <span className="click-here-to_view"> {tu('click_here_to_view')}</span>
                          &nbsp;&nbsp;
                          <AddressLink address={contractAddress} isContract={true}>{tu('contract_source_code')}</AddressLink>
                      </div>
                  </div>
              </div>
            </div>
            <div className={currIndex == 0? "contract-hide":"contract-show"}>
              <div className="card-body byte-code_ABI contract-body pb-5 ">
                <div className="row">
                  <div className="col-lg-12 d-flex">
                    <span>{tu('note')}: </span>
                    <span className="click-here-to_view">{tu('contract_was_creating_during')}</span>
                    &nbsp;&nbsp;
                    <span>{tu('txn')}: </span>
                    <div>
                        <AddressLink address={contractInfo_address} isContract={true}>{contractInfo_address}</AddressLink>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12 pt-3 byte-code_error">
                    {/*<span>Sorry! The Compiled Contract ByteCode for 'Ballot' does NOT match the Contract Creation Code for </span>*/}
                    {/*<span>[T28bc895765b823f1ab7eb3c0bf5e1f71602b48dca3c3ee77329]</span>*/}
                    <span>{verify_message}</span>
                    {/*<p>Unable to Verify Contract source code.</p>*/}
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
    }

}
function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifyContractCode))