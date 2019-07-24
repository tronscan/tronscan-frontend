import React, {Component} from 'react';
import {tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {QuestionMark} from "../../common/QuestionMark";
import { injectIntl} from "react-intl";
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import MonacoEditor from 'react-monaco-editor';
import xhr from "axios/index";
import { Base64 } from 'js-base64';
import SweetAlert from "react-bootstrap-sweetalert";
import CompilerConsole from "./CompilerConsole";
import {API_URL} from "../../../constants";

import {
  Form, Row, Col, Input, Select, Button
} from 'antd'
const { Option } = Select;

class VerifyContractCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            compilers: ['solidity-0.4.25_Odyssey_v3.2.3'],
            deaultCompiler: 'solidity-0.4.25_Odyssey_v3.2.3',
            contract_code: '',
            captcha_code: null,
            CompileStatus: [],
            loading: false
        };
    }

    handleCaptchaCode = (val) => {
      this.setState({captcha_code: val});
    };

    editorDidMount(editor, monaco) {
      editor.focus();
    }

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
      const { contract_code, CompileStatus } = this.state
      const fieldata = getFieldsValue()
      
     
      if(!fieldata.contractAddress){
        this.showModal(tu('please_enter_address'))
      }else if(!fieldata.contractName){
        this.showModal(tu('please_enter_name'))
      }else if(!contract_code){
        this.showModal(tu('please_enter_code'))
      }else{
        this.setState({loading: true})
        const solidity = Base64.encode(contract_code);
        const { data } = await xhr.post(`${API_URL}/api/solidity/contract/verify`,{solidity,runs: '0', ...fieldata})
        if(data.code === 200){
         
          if(data.data.status === 2001){
            CompileStatus.push({
              type: "info", 
              content: `The Contract Source code for <span class="">${fieldata.contractAddress}</span> has alreadly been verified. Click here to view the <a href="/#/contract/${fieldata.contractAddress}/code" class="info_link">Verified Contract Source Code</a>`
            })
            this.setState({
              CompileStatus:CompileStatus
            });
          }else{
             // Verification success
            location.href = `/#/contract/${fieldata.contractAddress}/code`
          }
          
        }else{
          CompileStatus.push({
            type: "error", 
            content: `<span class="">${fieldata.contractAddress}</span> is not a existing contract. Please confirm and try again`
          })
          this.setState({
            CompileStatus:CompileStatus
          });
        }
        this.setState({loading: false})
      }``
    }

    
  render() {
    let {compilers, deaultCompiler, contract_code, modal, captcha_code, CompileStatus, loading} = this.state;
    let {intl} = this.props;
    const options = {
      selectOnLineNumbers: true
    };
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16}
    }

    return (
        <div className="pt-4 w-100 verify-contranct">
          {modal}
          <Form layout="horizontal">
            <div style={styles.verify_header_box}>
              <div style={styles.verify_header}>
                <div className="mb-4">
                  <p>{tu('verify_code1')}</p>
                  <p>{tu('verify_code2')}</p>
                  <p>{tu('verify_code3')}</p>
                </div>

                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                  <Col span={12}>
                    <Form.Item label={tu('contract_address')} {...formItemLayout}>
                      {getFieldDecorator('contractAddress', {})(
                        <Input placeholder={intl.formatMessage({id: 'contract_address'})}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={tu('contract_name')}  {...formItemLayout}>
                      {getFieldDecorator('contractName', {})(
                        <Input placeholder={intl.formatMessage({id: 'contract_name'})}/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={tu('compiler')} {...formItemLayout}>
                      {getFieldDecorator('compiler', {
                        initialValue: deaultCompiler
                      })(
                        <Select className='w-100' >
                          {compilers.map((compiler, index) => {
                            return  <Option value={compiler} key={index}>{compiler}</Option>
                          })}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={tu('contract_optimization')} {...formItemLayout}>
                      {getFieldDecorator('optimizer', {
                        initialValue: '1'
                      })(
                        <Select className='w-100'>
                          <Option value={'1'}>Yes</Option>
                          <Option value={'0'}>No</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={tu('runs')} {...formItemLayout}>
                        {getFieldDecorator('runs', {
                            initialValue: '0'
                        })(
                            <Select className='w-100'>
                                <Option value={'0'}>0</Option>
                                <Option value={'200'}>200</Option>
                            </Select>
                        )}
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
            <p className="text-center">{tu("enter_contract_code")}</p>
          <div className="card text-center" style={styles.card}>
            <div>
              <div className={"card-body"}>
                <div className="row">
                  <div className="col-md-12 text-left">
                    <MonacoEditor
                      height="600"
                      language="sol"
                      theme="vs-dark"
                      options={options}
                      value={contract_code}
                      onChange={(value) => this.setState({contract_code: value})}
                      editorDidMount={this.editorDidMount}
                    />
                    <div className="contract-compiler-console text-left w-100">
                      <CompilerConsole  CompileStatus={CompileStatus}/>
                  </div>
                  </div>
                </div>
                <div className="row mt-3 contract-ABI">
                  <div className="col-md-12 ">
                    {/** <p className="mb-3">
                        {tu("following_optional_parameters")}
                    </p>*/}
                    <div className="d-flex justify-content-center pt-3">
                      <p style={styles.s_title}>{tu("constructor_arguments_ABIencoded")}</p>
                      <div className="ml-1">
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

                <div className="text-center" >
                  <ContractCodeRequest  handleCaptchaCode={this.handleCaptchaCode} />
                  <div className="contract-compiler-button  mt-lg-3 mb-lg-4">
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={this.handleVerifyCode}
                        className="compile-button active ml-4"
                        disabled={!captcha_code}
                    >{tu('verify_and_publish')}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </Form>
        </div>
    );
}
}

const styles = {
    loading: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      background: 'rgba(255,255,255,0.5)'
    },
    card: {
        border: 'none',
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
      fontSize: '16px',
      color: '#353535'
    },
    rowRight:{
        marginRight:'1.25rem'
    },
    addressWidth:{
        width:"27%"
    },
    verify_header_box: {
    },
    verify_header: {
      maxWidth: '884px',
      width: '100%',
      margin: '0 auto'
    }

}
function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default Form.create({name: 'contract_verify'})(connect(mapStateToProps, mapDispatchToProps)(injectIntl(VerifyContractCode)))

