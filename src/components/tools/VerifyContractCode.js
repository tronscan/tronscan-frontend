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

class VerifyContractCode extends Component {

  constructor(props) {
    super(props);
    this.state = {
      abi:"",
      contractCode: "",
      selectedCompiler: "",
      Optimization: true,
      compilers: ['Please Select', 'v0.0.1', 'v0.0.2', 'v0.0.3', 'v0.0.4', 'v0.0.5'],
      tabs:["contract_source_code","bytecode_and_ABI"],
      currIndex:0,
      contractAddress:'',
      contractName:'',
      id24: alpha(24),
      id20: alpha(20),
      open24:false,
      open20:false,
      formVerify: {
          contract_address: {
              valid: false,
              value: '',
              error: ''
          },
          last_name: {
              valid: false,
              value: '',
              error: ''
          },
          email: {
              valid: false,
              value: '',
              error: ''
          },
          password: {
              valid: false,
              value: '',
              error: ''
          },
          comfirmPassword: {
              valid: false,
              value: '',
              error: ''
          },
          gender: {
              valid: false,
              value: '',
              error: ''
          },
          title: {
              valid: true,
              value: '',
              error: ''
          },
      },
    };
  }

  componentDidMount() {

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


  render() {
    let {contractCode, selectedCompiler, compilers, abi,tabs,currIndex,contractAddress,contractName,id20,id24,open24,open20,formVerify: {contract_address, last_name, password, gender, email, title, comfirmPassword}} = this.state;
    let {intl} = this.props;
    return (
        <main className="contract container header-overlap">
          <div className="card contract-code_body" style={styles.card}>
            <div className="card-header list-style-body__header">
              <ul className="nav nav-tabs card-header-tabs">
                {
                  tabs.map((val,index) =>{
                      return (
                          <li className="nav-item" onClick={(e) => this.handleClick(index)} key={index}>
                              <a href="javascript:;"  className={ index == currIndex ? 'nav-link text-dark active' : 'nav-link text-dark'}>
                                <span>
                                    <span>{tu(val)}</span>
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
                </div>
              </div>
              <hr style={styles.hr}/>
              <div className="card-body contract-body-input">
                <div className="row">
                  <div className="col-md-4 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}}>{tu("contract_address")}
                        {/*<span>*</span>*/}
                      </label>
                      <div className="d-flex contract-div-bg">
                        <input type="text" className="form-control"
                               placeholder={intl.formatMessage({id: 'contract_address'})}
                               value={contractAddress}
                               name={contract_address}
                               onInput={(e) => this.handleSignUpChange('first_name', e.target.value)}
                        />
                        <CopyText text={contractAddress} className="ml-auto contract-copy mr-2"/>
                      </div>
                    </section>
                  </div>
                  <div className="col-md-4 mt-3 mt-md-0">
                    <section>
                      <label style={{whiteSpace: 'nowrap'}} className="d-flex">{tu("contract_name")}
                        {/*<span>*</span>*/}
                        <div className="mt-1 ml-2">
                          <QuestionMark placement="top" text="contract_name_tip"/>
                        </div>
                      </label>
                      <div className="d-flex contract-div-bg">
                        <input type="text" className="form-control"
                               placeholder={intl.formatMessage({id: 'contract_name'})}
                               value={contractName}/>
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
                        <select className="custom-select" onChange={this.compilerSelectChange}>
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
                        <select className="custom-select" onChange={this.optSelectChange}>
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
                    </div>
                    <textarea className="w-100 form-control"
                              rows="11"
                              value={contractCode}
                              onChange={ev => this.setState({contractCode: ev.target.value})}/>
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
                              value={abi}
                              onChange={ev => this.setState({abi: ev.target.value})}/>

                  </div>
                  <div className="col-md-12">
                    <p className="mt-5">{tu("contract_library_address")}</p>
                    <div className="row ml-0" style={styles.rowRight}>
                      <div className="col-md-5 contract-input">
                        <span id={id20}
                              onMouseOver={() => this.setState({open20: true})}
                              onMouseOut={() => this.setState({open20: false})}>
                        {tu("library_1_name")}:</span>
                        <Tooltip placement="top" isOpen={open20} target={id20}>
                          <span className="text-lowercase text-left">{t("library_1_name_tip")}</span>
                        </Tooltip>
                        <input type="text" className="form-control contract-input-s"/>
                      </div>
                      <div className="col-md-7 contract-input">
                        <span
                            id={id24}
                            onMouseOver={() => this.setState({open24: true})}
                            onMouseOut={() => this.setState({open24: false})}>
                          {tu("library_contract_address")}:</span>
                        <Tooltip placement="top" isOpen={open24} target={id24}>
                          <span className="text-lowercase">{t("library_contract_address_tip")}</span>
                        </Tooltip>
                        <input type="text" className="form-control contract-input-l"/>
                      </div>
                    </div>

                    <div className="row ml-0" style={styles.rowRight}>
                      <div className="col-md-5 contract-input">
                        <span>{tu("library_2_name")}:</span>
                        <input type="text" className="form-control contract-input-s"/>
                      </div>
                      <div className="col-md-7 contract-input">
                        <span>{tu("library_contract_address")}:</span>
                        <input type="text" className="form-control contract-input-l"/>
                      </div>
                    </div>

                    <div className="row ml-0" style={styles.rowRight}>
                      <div className="col-md-5 contract-input">
                        <span>{tu("library_3_name")}:</span>
                        <input type="text" className="form-control contract-input-s"/>
                      </div>
                      <div className="col-md-7 contract-input">
                        <span>{tu("library_contract_address")}:</span>
                        <input type="text" className="form-control contract-input-l"/>
                      </div>
                    </div>

                    <div className="row ml-0" style={styles.rowRight}>
                      <div className="col-md-5 contract-input">
                        <span>{tu("library_4_name")}:</span>
                        <input type="text" className="form-control contract-input-s"/>
                      </div>
                      <div className="col-md-7 contract-input">
                        <span>{tu("library_contract_address")}:</span>
                        <input type="text" className="form-control contract-input-l"/>
                      </div>
                    </div>

                    <div className="row ml-0" style={styles.rowRight}>
                      <div className="col-md-5 contract-input">
                        <span>{tu("library_5_name")}:</span>
                        <input type="text" className="form-control contract-input-s"/>
                      </div>
                      <div className="col-md-7 contract-input">
                        <span>{tu("library_contract_address")}:</span>
                        <input type="text" className="form-control contract-input-l"/>
                      </div>
                    </div>
                  </div>
                </div>
                <hr/>

                <div className="float-left" >
                  <ContractCodeRequest/>
                  {/*<button type="button" className="btn btn-lg btn-verify text-capitalize">{tu('verify_and_publish')}</button>*/}
                  {/*<button type="button" className="btn btn-lg ml-3 btn-reset text-capitalize">{tu('reset')}</button>*/}
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