import React, { Component } from 'react';
import { tu } from '../../../utils/i18n';
import { connect } from 'react-redux';
import { QuestionMark } from '../../common/QuestionMark';
import { injectIntl } from 'react-intl';
import ContractCodeRequest from '../../tools/ContractCodeRequest';
import MonacoEditor from 'react-monaco-editor';
import xhr from 'axios/index';
import SweetAlert from 'react-bootstrap-sweetalert';
import CompilerConsole from './CompilerConsole';
import {Link} from "react-router-dom"
import { API_URL, CONTRACT_NODE_API, FILE_MAX_SIZE, FILE_MAX_NUM } from '../../../constants';

import cx from 'classnames';

import UPLOADICON from './../../../images/compiler/upload_icon.png';

import {
    Form, Row, Col, Input, Select, Button, Upload, Icon
} from 'antd';
const { Option } = Select;

let list = [];
class VerifyContractCode extends Component {

    constructor(props) {
        super(props);
        this.state = {
            compilers: [
                {
                    label:"0.4.25_Odyssey_v3.2.3",
                    value:"tron-0.4.25_Odyssey_v3.2.3"
                },
                {
                    label:"0.5.8_Odyssey_v3.6.0",
                    value:"tron-0.5.8_Odyssey_v3.6.0"
                },
                {
                    label:"0.5.4_Odyssey_v3.6.0",
                    value:"tron-0.5.4_Odyssey_v3.6.0"
                },
                {
                    label:"tron-0.4.24",
                    value:"tron-0.4.24"
                },
                {
                    label:"tronbox_soljson_v1",
                    value:"tronbox_soljson_v1"
                },
                {
                    label:"tronbox_soljson_v2",
                    value:"tronbox_soljson_v2"
                },
                {
                    label:"tronbox_soljson_v3",
                    value:"tronbox_soljson_v3"
                },
                {
                    label:"0.5.9_Odyssey_v3.6.5",
                    value:"tron-0.5.9_Odyssey_v3.6.5"
                },
                {
                    label:"0.5.10_Odyssey_v3.6.6",
                    value:"tron-0.5.10_Odyssey_v3.6.6"
                },
            ],
            licenses:[
                {
                    label: 'No License(None)',
                    value: 1
                },
                {
                    label: 'The Unlicense(Unlicense)',
                    value: 2
                },
                {
                    label: 'MIT License(MIT)',
                    value: 3
                },
                {
                    label: 'GNU General Public License v2.0(GNU GPLv2)',
                    value: 4
                },
                {
                    label: 'GNU General Public License v3.0(GNU GPLv3)',
                    value: 5
                },
                {
                    label: 'GNU Lesser General Public License v2.1(GNU LGPLv2.1)',
                    value: 6
                },
                {
                    label: 'GNU Lesser General Public License v3.0(GNU LGPLv3)',
                    value: 7
                },
                {
                    label: 'BSD 2-clause “Simplified” license(BSD-2-Clause)',
                    value: 8
                },
                {
                    label: 'BSD 3-clause “New” Or “Revised” license(BSD-3-Clause)',
                    value: 9
                },
                {
                    label: 'Mozilla Public License 2.0(MPL-2.0)',
                    value: 10
                },
                {
                    label: 'Open Software License 3.0(OSL-3.0)',
                    value: 11
                },
                {
                    label: 'Apache 2.0(Apache-2.0)',
                    value: 12
                }
            ],
            deaultCompiler: 'tron-0.4.25_Odyssey_v3.2.3',
            contractCode: '',
            captchaCode: null,
            CompileStatus: [],
            loading: false,
            compileFiles: [],
            optimizer: '1',
            curFile: ''
        };
    }

    handleCaptchaCode = (val) => {
        this.setState({ captchaCode: val });
    };

    /**
     * 加载editor时触发事件
     * @param editor
     */
    editorDidMount(editor) {
        editor.focus();
    }

    /**
     * 展示modal
     */
    showModal(content){
        this.setState({
            modal: <SweetAlert
                danger
                title=""
                onConfirm={() => this.setState({ modal: null })}>
                {content}
            </SweetAlert>
        });
    }

    componentDidMount() {
        this.isLoggedIn(1)
    }

    /**
     * 是否登陆
     */
    isLoggedIn = (type) => {
        let { account, intl } = this.props;
        if (!account.isLoggedIn) {
            if (type != 1) {
                 this.setState({
                   modal: (
                     <SweetAlert
                       warning
                       title={tu("not_signed_in")}
                       confirmBtnText={intl.formatMessage({ id: "confirm" })}
                       confirmBtnBsStyle="danger"
                       onConfirm={() => this.setState({ modal: null })}
                       style={{ marginLeft: "-240px", marginTop: "-195px" }}
                     ></SweetAlert>
                   )
                 });
            }
           
        }
        return account.isLoggedIn;
    };

    /**
     * 点击验证并发布
     */
    handleVerifyCode = async() => {
        if (!this.isLoggedIn()) return;
        // 统计代码
        this.gTagHandler();

        const { getFieldsValue } = this.props.form;
        const { CompileStatus, compileFiles } = this.state;
        const fieldata = getFieldsValue();
        const { contractAddress, contractName, license } = fieldata;

        if (!contractAddress){
            this.showModal(tu('please_enter_address'));
        } else if (!contractName){
            this.showModal(tu('please_enter_name'));
        } 
        else if (!license){
            this.showModal(tu('select_license'));
        } 
        else if (!compileFiles || (compileFiles && compileFiles.length === 0)){
            this.showModal(tu('please_enter_code'));
        } else {
            let formData = new FormData();

            for (let key in fieldata) {
                if (fieldata[key] === undefined) {
                    continue;
                }
                formData.append(key, fieldata[key]);
            }

            // 添加文件
            compileFiles.map(v =>
                (v instanceof File) ? formData.append('files', v) : formData.append('files', v.originFileObj));

            this.setState({ loading: true });

            // const { data } = await xhr.post(`${API_URL}/api/solidity/contract/verify`, formData);
            const { data } = await xhr.post(`${CONTRACT_NODE_API}/api/solidity/contract/verify`, formData);

            const { code, errmsg } = data;
            const { status } = data.data;
            if (code === 200){
                if (status === 2001){
                    // Verification failed
                    const mess = `The Contract Source code for <span class="">${contractAddress
                    }</span> has alreadly been verified. Click here to view the <a href="/#/contract/${
                        fieldata.contractAddress}/code" class="info_link">Verified Contract Source Code</a>`;

                    CompileStatus.push({
                        type: 'info',
                        content: mess,
                    });
                    this.setState({
                        CompileStatus,
                    });
                } else if(status === 2007){
                    // Verification failed
                    const error = `<span>${
                        contractAddress}</span> verification failed. Please confirm the correct parameters and try again`;

                    CompileStatus.push({
                        type: 'error',
                        content: errmsg || error,
                    });
                    this.setState({
                        CompileStatus,
                    });
                }else if(status === 2008){
                    // Verification failed
                    const error = `<span>${
                        contractAddress}</span> verification failed. Please confirm the correct parameters and try again`;

                    CompileStatus.push({
                        type: 'error',
                        content: errmsg || error,
                    });
                    this.setState({
                        CompileStatus,
                    });
                }
                else if(status === 2006){
                    // Verification success
                    location.href = `/#/contract/${contractAddress}/code`;
                }

            } else {
                const error = `<span>${
                    contractAddress}</span> verification failed. Please confirm the correct parameters and try again`;
                // const errorMes = errmsg &&
                //     typeof errmsg === 'string' && errmsg.indexOf('status') > -1 && JSON.parse(errmsg);
                CompileStatus.push({
                    type: 'error',
                    content: errmsg || error,
                });
                this.setState({
                    CompileStatus,
                });
            }
            this.setState({ loading: false });
        }
    }

    /**
     * 数据统计
     */
    gTagHandler = () => {
        const { account: { address } } = this.props;
        window.gtag('event', 'verify', {
            'event_category': 'contract',
            'event_label': address,
            'referrer': window.location.origin,
            'value': address
        });
    }

    /**
     * 上传之前
     */
    beforeUpload = (file, fileList) => {
        if (!this.isLoggedIn()) {
            return;
        }
        // 文件数量不超过10个
        if (fileList.length > FILE_MAX_NUM) {
            this.showModal(tu('selected_file_max_num'));
            return false;
        }
        // 文件大小不得超过5M
        if (file.size > FILE_MAX_SIZE) {
            this.showModal(tu('selected_file_max_size'));
            return false;
        }

        list.push(file);
    };

    /**
    * 点击上传
    * @param file
    */
    handleChange = ({ file }) => {
        if (!this.isLoggedIn()) {
            return;
        }
        if (list.length > 0 && file.uid === list[list.length - 1].uid) {
            this.setState({ compileFiles: [...list] });

            // 默认展示第一个文件
            this.changeEditor(list[0]);
            list = [];
        }
    };

    /**
    * 点击左侧菜单文件
    * @param file:目标文件
    */
    changeEditor = file => {
        let reader = new FileReader();
        const fileReader = (file instanceof File) ? file : file.originFileObj;
        reader.readAsText(fileReader, 'UTF-8');
        reader.onloadend = (evt) => {
            const fileString = evt.target.result;
            this.setState({
                contractCode: fileString,
                curFile: file.name
            });
        };
    }

    /**
     * base64转file
     */
    dataUrlToFile = files => {
        let fileList = [];
        files.map(v => {
            const arr = v.dataUrl.split(',');
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            const file = new File([u8arr], v.name);
            fileList.push(file);
        });

        return fileList;
    };

    /**
     * optimizer change
     */
    optimizerChange = (value) => {
        this.setState({
            optimizer: value
        });
        this.props.form.setFieldsValue({
            runs: '0'
        });
    }

    //test
    getParam = () => {
        const { getFieldsValue } = this.props.form;
        const { CompileStatus, compileFiles } = this.state;
        const fieldata = getFieldsValue();
        console.log(fieldata)
        const { contractAddress, contractName, license } = fieldata;

        if (!contractAddress){
            this.showModal(tu('please_enter_address'));
        } else if (!contractName){
            this.showModal(tu('please_enter_name'));
        } else if (!license){
            this.showModal(tu('select_license'));
        } else if (!compileFiles || (compileFiles && compileFiles.length === 0)){
            this.showModal(tu('please_enter_code'));
        }
    }

    render() {
        let { compilers, deaultCompiler, contractCode, modal, captchaCode, CompileStatus,
            loading, compileFiles, licenses, optimizer,curFile } = this.state;
        let { intl } = this.props;
        const options = {
            selectOnLineNumbers: true
        };
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 }
        };

        // 是否上传文件
        const isSelectContract = compileFiles && compileFiles.length > 0;

        // 合约地址
        const contractAddsItem = (
            <Col span={11}>
                <Form.Item label={tu('contract_address')} {...formItemLayout}>
                    {getFieldDecorator('contractAddress', {})(
                        <Input placeholder={intl.formatMessage({ id: 'contract_address' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // 合约名称
        const contractNameItem = (
            <Col span={11}>
                <Form.Item label={tu('contract_name')}  {...formItemLayout}>
                    {getFieldDecorator('contractName', {})(
                        <Input placeholder={intl.formatMessage({ id: 'enter_main_contract' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // 编译器版本
        const compilerVersionItem = (
            <Col span={11}>
                <Form.Item label={tu('compiler')} {...formItemLayout}>
                    {getFieldDecorator('compiler', {
                        initialValue: deaultCompiler
                    })(
                        <Select className="w-100" >
                            {compilers.map((compiler, index) => {
                                return  <Option value={compiler.value} key={index}>{compiler.label}</Option>;
                            })}
                        </Select>
                    )}
                </Form.Item>
            </Col>
        );

        // 优化Item
        const optimizerItem = (
            <Col span={11}>
                <Form.Item label={tu('contract_optimization')} {...formItemLayout}>
                    {getFieldDecorator('optimizer', {
                        initialValue: '1'
                    })(
                        <Select className="w-100" onChange={this.optimizerChange}>
                            <Option value="1">Yes</Option>
                            <Option value="0">No</Option>
                        </Select>
                    )}
                </Form.Item>
            </Col>
        );

        // runItem
        const runItem = (
            <Col span={11} style={{ marginBottom: '-1.5em' }}>
                <Form.Item label={tu('runs')} {...formItemLayout}>
                    {getFieldDecorator('runs', {
                        initialValue: '0'
                    })(
                        <Select className="w-100" disabled={optimizer != '1'}>
                            <Option value="0">0</Option>
                            <Option value="200">200</Option>
                        </Select>
                    )}
                </Form.Item>
            </Col>
        );
        //license
        const licenseTitle = (
            <div>
                <Link to="/contracts/license">
                    {tu('contract_v_license')}
                </Link>:
            </div>
        )
        const license = (
            <Col span={11} style={{ marginBottom: '-1.5em' }}>
                <Form.Item label={licenseTitle} {...formItemLayout}>
                    {getFieldDecorator('license')(
                        <Select className="w-100" dropdownMatchSelectWidth={false} placeholder={tu('select_license')}>
                            {licenses.map((license, index) => {
                                return  <Option value={license.value} key={index}>{license.label}</Option>;
                            })}
                        </Select>
                    )}
                </Form.Item>
            </Col>
        )
        // uploadItem
        const uploadItem = (
            <div className={cx('row p-3 mb-2', !isSelectContract && 'no-select-contract')}
                style={{ marginTop: '-.5em' }}>
                <Upload
                    multiple
                    accept=".sol"
                    customRequest={() => {}}
                    fileList={compileFiles}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                    showUploadList={false}>
                    <Button className="upload-button">
                        {tu('select_contract_file')}
                    </Button>
                </Upload>
                {isSelectContract && <span className="upload-file-text">
                    {tu('selected_contract_file_left')}
                    {compileFiles.length}
                    {tu('selected_contract_file_right')}
                </span>}
            </div>
        );

        // solidity合约代码
        const contractCodeItem = (
            <div>
                <Row className="flex">
                    <Col span={4} className="contract-compiler-tab">
                        {isSelectContract && compileFiles.map(v => (
                            <p onClick={() => this.changeEditor(v)} key={v.uid + v.name} className={curFile===v.name ? 'active' : ''}>{v.name}</p>
                        ))}
                    </Col>
                    <Col span={20} className="text-left">
                        <MonacoEditor
                            height="600"
                            language="sol"
                            theme="vs-dark"
                            options={options}
                            value={contractCode}
                            onChange={() => this.setState({ contractCode })}
                            editorDidMount={this.editorDidMount}
                        />
                    </Col>
                </Row>
                <Row>
                    <div className="text-left w-100">
                        <CompilerConsole  CompileStatus={CompileStatus}/>
                    </div>
                </Row>
            </div>
        );

        // 构造函数参数
        const constructorItem = (
            <div className="row mt-3 contract-ABI d-none">
                <div className="col-md-12">
                    <div className="d-flex justify-content-center pt-3">
                        <p style={styles.s_title}>{tu('constructor_arguments_ABIencoded')}</p>
                        <div className="ml-1">
                            <QuestionMark placement="top" text="constructor_arguments_ABIencoded_tip"/>
                        </div>
                    </div>
                    <Form.Item>
                        {getFieldDecorator('constructorParams', { initialValue: '' })(
                            <textarea rows="3" className="w-100"/>
                        )}
                    </Form.Item>
                </div>
            </div>
        );

        // 验证并发布button
        const verifyBtnItem = (
            <div className="contract-compiler-button mt-lg-3 mb-lg-4">
                <Button
                    type="primary"
                    loading={loading}
                    onClick={this.handleVerifyCode}
                    className="compile-button active ml-4"
                    disabled={!captchaCode}
                    // disabled={captchaCode}
                >{tu('verify_and_publish')}</Button>
            </div>
        );

        // 已上传合约Item
        const selectContractItem = (
            <div className="card text-center" style={styles.card}>
                {uploadItem}
                {contractCodeItem}
                {constructorItem}
                <div className="text-center mt-5" >
                    <ContractCodeRequest handleCaptchaCode={this.handleCaptchaCode} />
                    {verifyBtnItem}
                </div>
            </div>
        );

        // 未上传合约Item
        const noSelectContractItem = (
            <div className="card-body no-select-contract" style={{ padding: '4.5rem 0 6.8rem' }}>
                <div className="row">
                    <img src={UPLOADICON} />
                </div>
                {uploadItem}
            </div>
        );
        
        // test
        const testBtn = (
            <div>
                <Button onClick={this.getParam}>test</Button>
            </div>
        );

        return (
            <div className="w-100 verify-contranct">
                {modal}
                <div className="card">
                    <div className="card-body">
                        <Form layout="horizontal">
                            <Row gutter={24} type="flex" justify="space-between" className="p-3">
                                {contractAddsItem}
                                {contractNameItem}
                                {compilerVersionItem}
                                {license}
                                {optimizerItem}
                                {runItem}
                                {/* {testBtn} */}
                            </Row>
                            {isSelectContract ? selectContractItem : noSelectContractItem}
                        </Form>
                    </div>
                </div>
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
        margin: 0
    },
    hr_32: {
        marginTop: '2rem',
        marginBottom: '2rem'
    },
    s_title: {
        fontSize: '16px',
        color: '#353535'
    },
    rowRight: {
        marginRight: '1.25rem'
    },
    addressWidth: {
        width: '27%'
    },
    verify_header_box: {
    },
    verify_header: {
        maxWidth: '900px',
        width: '100%',
        margin: '0 auto'
    }

};

function mapStateToProps(state) {
    return {
        account: state.app.account,
    };
}

export default Form.create({ name: 'contract_verify' })(connect(mapStateToProps, null)(injectIntl(VerifyContractCode)));