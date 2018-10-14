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
import {Truncate} from "../common/text";

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
            contractAddress:null,
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
        };
    }
    handleVerifyCodeChange(field, value) {
        const {formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code}} = this.state;

        const newFieldObj = {value, valid: true, error: ''};
        // console.log('contract_address',value)
        // console.log('contract_address',value)
        switch (field) {
            case 'contract_address': {
                if (value.length < 34 || value.length > 34) {
                    console.log("value.length",value.length)
                    newFieldObj.error = '**InvalidLength';
                    newFieldObj.valid = false;
                } else if (value.length === 0) {
                    console.log(222)
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }else if(value.length == 34){
                    this.handleVerifyContractAddress(value)
                }
                console.log('contract_address',value)
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

     handleVerifyContractAddress(id) {
        //let contractCode = await Client.getContractCode(id);

        xhr.get(`http://18.216.57.65:20110/api/contracts/code?contract=${id}`).then((result) => {
            let contractCode = result.data.data
            console.log('contractCode',contractCode)
            if(contractCode.address){
                this.setState({
                    contractAddress: contractCode.address
                }, () => {

                });
            }
        });

    }
   handleVerifyCode = async(e) => {
        e.preventDefault();
        const {formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded}} = this.state;
        // if (!contract_address.valid || !contract_name.valid || !contract_compiler.valid || !contract_code.valid ) {
        //     alert('Please fill in the correct information and try again');
        //     return;
        // }
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
            // librarys:librarys
        }

        let contractCode = await Client.contractsVerify(VerifyInfo);

        // Ajax({url: Api.signup, data: signupInfo, method: 'post'}).then((res) => {
        //     if (res.code == 0) {
        //         this.setState({
        //             success: true,
        //             AlertMsg: 'You have registered successfully.',
        //             modal: false
        //         })
        //     } else {
        //         this.setState({
        //             success: false,
        //             AlertMsg: res.msg,
        //             modal: false
        //         })
        //     }
        // });

    }
     componentDidMount() {
        this.getCompile()
     }
     async getCompile (){
         compile = await getCompiler();
     }


    render() {
        let {contractCode, selectedCompiler, compilers, abi,tabs,currIndex,contractAddress,contractName,id20,id24,open24,open20,formVerify: {contract_address,contract_name,contract_compiler,contract_optimization,contract_code,abi_Encoded}} = this.state;
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
                      <h5 className="card-title text-left contract-title">Verify and Publish your Solidity Source Code</h5>
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
                      <div className="row">
                      <div className="col-md-4 mt-3 mt-md-0">
                        <section>
                          <label style={{whiteSpace: 'nowrap'}}>{tu("contract_address")}
                              <span className="contract-error">{contract_address.error}</span>
                          </label>
                          <div className="d-flex contract-div-bg">
                            <input type="text" className="form-control"
                                   placeholder={intl.formatMessage({id: 'contract_address'})}
                                   // value={contract_address}
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
                                   //value={contractName}
                                   name="contract_name"
                                   onInput={(e) => this.handleVerifyCodeChange('contract_name', e.target.value)}
                            />
                            <CopyText text={contractAddress} className="ml-auto contract-copy mr-2"/>
                          </div>
                        </section>
                      </div>
                      <div className="col-md-2 mt-3 mt-md-0">
                        <section>
                          <label style={{whiteSpace: 'nowrap'}}>{tu("compiler")}
                            <span>*</span>
                          </label>
                          <div>
                            <select className="custom-select"
                                    name="contract_compiler"
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
                            <span>*</span>
                          </label>
                          <div>
                            <select className="custom-select"
                                    name="contract_optimization"
                                    onChange={(e) => this.handleVerifyCodeChange('contract_optimization', e.target.value)}
                            >
                              <option key={1} value={true}>true</option>
                              <option key={0} value={false}>false</option>
                            </select>
                          </div>
                        </section>
                      </div>
                    </div>

                    <div className="row mt-3 contract-code">
                      <div className="col-md-12 ">
                        <div className="d-flex mb-1">
                          <span className="mb-3">{tu("enter_contract_code")}</span>
                            {/*<CopyText text={contractCode} className="ml-auto ml-1"/>*/}
                            <span className="contract-error">{contract_code.error}</span>
                        </div>
                        <textarea className="w-100 form-control"
                                  rows="11"
                                  //value={contractCode}
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
                                  //value={abi}
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
                      <ContractCodeRequest/>
                        <button type="button" className="btn btn-lg btn-verify text-capitalize" onClick={this.handleVerifyCode}>{tu('verify_and_publish')}</button>
                        <button type="button" className="btn btn-lg ml-3 btn-reset text-capitalize">{tu('reset')}</button>
                    </div>
                  </div>
                    <div className={contractAddress?"card-body contract-body contract-show":"card-body contract-body contract-hide"}>
                      <div className="contract-address-has_verified">
                          <div>
                              {tu('contract_source_code_for') }
                               <span className="contract_source_code_address">{contractAddress}</span>
                              {t('has_already_been_verified') }
                          </div>
                          <div className="d-flex">
                              <span className="click-here-to_view"> {tu('click_here_to_view')}</span>
                              &nbsp;&nbsp;
                              <AddressLink address={contractAddress} isContract={true}>{tu('contract_source_code')}</AddressLink>
                          </div>
                      </div>
                  </div>
                </div>
                <div className={currIndex == 0? "contract-hide":"contract-show"}>
                  <div className="card-body byte-code_ABI contract-body pb-5">
                    <div className="row">
                      <div className="col-lg-12">
                        <span>{tu('note')}: </span>
                        <span>contract was creating during</span>
                        &nbsp;&nbsp;
                        <span>{tu('txn')}: </span>
                        <span>a3NmH1enpu4X5Hur8Z16eCyNymTqKXQDP</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 pt-3 byte-code_error">
                        <span>Sorry! The Compiled Contract ByteCode for 'Ballot' does NOT match the Contract Creation Code for </span>
                        <span>[T28bc895765b823f1ab7eb3c0bf5e1f71602b48dca3c3ee77329]</span>
                        <p>Unable to Verify Contract source code.</p>
                      </div>
                    </div>
                    <hr/>
                    <div className="row pt-3">
                      <div className="col-lg-2">
                        <span>Compiler Test:</span>
                      </div>
                      <div className="col-lg-10">
                        <span>V0.4.23</span>
                      </div>
                    </div>
                    <div className="row pt-3">
                      <div className="col-lg-2">
                        <span>Optimization Enabled:</span>
                      </div>
                      <div className="col-lg-10">
                        <span>0</span>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 pt-3">
                        <span>Constructor Arguements Used (ABI-encoded):</span>
                      </div>
                      <div className="col-lg-12 pt-3 contract-input">
                        <input type="text" className="form-control"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 pt-3">
                        <span>ContractName:</span>
                      </div>
                      <div className="col-lg-12 pt-3 contract-input">
                        <input type="text" className="form-control"/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 pt-3">
                        <span>ContractBytecode:</span>
                      </div>
                      <div className="col-lg-12 pt-3 contract-input">
                    <textarea className="w-100 form-control mt-3"
                              rows="11"
                              value={abi}
                              onChange={ev => this.setState({abi: ev.target.value})}/>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12 pt-3">
                        <span>ContractABI:</span>
                      </div>
                      <div className="col-lg-12 pt-3 contract-input">
                    <textarea className="w-100 form-control mt-3"
                              rows="6"
                              value={abi}
                              onChange={ev => this.setState({abi: ev.target.value})}/>
                      </div>
                    </div>
                    <div className="float-left pt-3 pb-3">
                      <button type="button" className="btn btn-lg btn-start-over text-capitalize">Start Over</button>
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