import React, {Component} from 'react';
import {trim, forIn} from "lodash";
import {tu,t} from "../../../utils/i18n";
import {connect} from "react-redux";
import {CopyText} from "../../common/Copy";
import {QuestionMark} from "../../common/QuestionMark";
import {NavLink} from "react-router-dom";
import {FormattedNumber, injectIntl} from "react-intl";
import {alpha} from "../../../utils/str";
import {Tooltip} from "reactstrap";
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import getCompiler from "../../../utils/compiler";
import {Client} from "../../../services/api";
import {AddressLink} from "../../common/Links";
import {Link} from "react-router-dom";
import MonacoEditor from 'react-monaco-editor';
import xhr from "axios/index";
import { Base64 } from 'js-base64';
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Form, Row, Col, Input, Select
} from 'antd'
const { Option } = Select;

var compile;
class VerifyContractCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            compilers: ['solidity-0.4.25_Odyssey_v3.2.3'],
            deaultCompiler: 'solidity-0.4.25_Odyssey_v3.2.3',
            contract_code: '',
            captcha_code: true
        };
    }

    handleCaptchaCode = (val) => {
      this.setState({captcha_code: val});
    };

    showModal(content){
      this.setState({modal: 
        <SweetAlert
          danger  
          onConfirm={() => this.setState({modal: null})}>
          {content} 
        </SweetAlert>
      })
    }

    handleVerifyCode = async (e) =>{
      const { getFieldsValue } = this.props.form
      const { contract_code } = this.state
      const fieldata = getFieldsValue()
      console.log(fieldata);
      if(!fieldata.contractAddress){
        this.showModal(tu('please_enter_address'))
      }else if(!fieldata.contractName){
        this.showModal(tu('please_enter_name'))
      }else if(!contract_code){
        this.showModal(tu('please_enter_code'))
      }else{
        const solidity = Base64.encode(contract_code);
        const { data } = await xhr.post('http://172.16.21.246:9016/v1/api/contract/verify',{solidity,runs: '0', ...fieldata})
        if(data.code === 200){
          // Verification success
          console.log(data.data);
        }else{

        }
        console.log(data);
      }
      
    }

    
  render() {
    let {compilers, deaultCompiler, contract_code, modal, captcha_code} = this.state;
    let {intl} = this.props;
    console.log(contract_code);
    const options = {
      selectOnLineNumbers: true
    };
    const { getFieldDecorator } = this.props.form

    return (
        <main className="pt-4">
          {modal}
          <Form>
          <div className="card" style={styles.card}>
            <div>
              <div className="card-body contract-body">
                <div>
                  <p>Source code verification provides transparency for users interacting with smart contracts. </p>
                  <p>By uploading the source code, Transcan will match the compiled code with that on the blockchain. </p>
                  <p>Just like contracts, a "smart contract" should provide end users with more information on 
                  what they are "digitally signing" for and give users an opportunity to audit the code to independently 
                  verify that it actually does what it is supposed to do.</p>
                </div>
              </div>
              <hr style={styles.hr}/>
              <div className={"card-body contract-body-input contract-hide"}>
                 
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                  <Form.Item label={tu('contract_address')}>
                    {getFieldDecorator('contractAddress', {
                      rules: [{ required: true, message: tu('name_v_required'), whitespace: true}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'contract_address'})}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tu('contract_name')}>
                    {getFieldDecorator('contractName', {
                      rules: [{ required: true, message: tu('name_v_required'), whitespace: true}],
                    })(
                      <Input placeholder={intl.formatMessage({id: 'contract_name'})}/>
                    )}
                  </Form.Item>
                  <Form.Item label={tu('compiler')}>
                    {getFieldDecorator('compiler', {
                      initialValue: deaultCompiler,
                      rules: [{ required: true, message: tu('name_v_required'), whitespace: true}],
                    })(
                      <Select style={{ width: 120 }} >
                        {compilers.map((compiler, index) => {
                          return  <Option value={compiler} key={index}>{compiler}</Option>
                        })}
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label={tu('contract_optimization')}>
                    {getFieldDecorator('optimizer', {
                      initialValue: 1,
                      rules: [{ required: true, message: tu('name_v_required'), whitespace: true}],
                    })(
                      <Select style={{ width: 120 }}>
                        <Option value={1}>Yes</Option>
                        <Option value={0}>No</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Row>

                <div className="row mt-3 contract-code">
                  <div className="col-md-12 ">
                    <div className="d-flex mb-1">
                      <span className="mb-3">{tu("enter_contract_code")}</span>
                    </div>
                    <MonacoEditor
                      width="800"
                      height="600"
                      language="sol"
                      theme="vs-dark"
                      options={options}
                      value={contract_code}
                      onChange={(value) => this.setState({contract_code: value})}/>
                    
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
                    <Form.Item >
                      {getFieldDecorator('constructorParams', {initialValue: ''})(
                        <textarea rows="3" className="w-100"/>
                      )}
                    </Form.Item>
                  </div>
                </div>
                <hr/>

                <div className="text-center" >
                  <ContractCodeRequest  handleCaptchaCode={this.handleCaptchaCode} />
                  <button type="button" className="btn btn-lg btn-success text-capitalize mt-lg-3 mb-lg-4" onClick={this.handleVerifyCode} disabled={!captcha_code}>{tu('verify_and_publish')}</button>
                </div>
              </div>
            </div>
          </div>
          </Form>
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

export default Form.create({name: 'contract_verify'})(connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifyContractCode)))

