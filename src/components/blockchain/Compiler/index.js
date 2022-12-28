/* eslint-disable no-undef */
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Upload, Row, Col, Message } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { tu } from '../../../utils/i18n';
import CompilerConsole from './CompilerConsole';
import VerifyContractCode from './VerifyContractCode';
import CompilerModal from './CompilerCompileModal';
import DeployModal from './CompilerDeployModal';
import xhr from 'axios/index';
import SweetAlert from 'react-bootstrap-sweetalert';
import _ from 'lodash';
import { toThousands } from '../../../utils/number';
import Lockr from 'lockr';
import { API_URL, CONTRACT_NODE_API, FILE_MAX_SIZE, FILE_MAX_NUM,IS_MAINNET } from '../../../constants';
import cx from 'classnames';
import {Link} from "react-router-dom"
import WARNIMG from './../../../images/compiler/warning.png';
import UPLOADICON from './../../../images/compiler/upload_icon.png';

let list = [];
class ContractCompiler extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            compileLoading: false,
            deployLoading: false,
            compilerVersion: '',
            optimizer: '',
            code: '// type your code...',
            filter: {
                direction: 'compile'
            },
            CompileStatus: [],
            modal: null,
            showModal: false,
            contractNameList: [],
            compileInfo: [],
            runs: '0',
            compileFiles: [],
            curFile: ''
        };
    }

    /**
     * 初始化页面数据
     */
    initCompile = () => {
        // code
        const compileCode = Lockr.get('CompileCode');
        // 编译状态
        const compileStatus = Lockr.get('CompileStatus');
        // contractNameList
        const contractNameList = Lockr.get('contractNameList');
        // compileInfo
        const compileInfo = Lockr.get('compileInfo');
        // 编译文件列表
        const compileFiles = Lockr.get('compileFiles');
        const files = compileFiles && this.dataUrlToFile(compileFiles);

        this.setState({
            code: compileCode && compileCode,
            CompileStatus: compileStatus || [],
            contractNameList: contractNameList || [],
            compileInfo: compileInfo || [],
            compileFiles: files || [],
            curFile: files && files[0] && files[0].name
        });
    }

    /**
     * 加载editor时触发事件
     * @param editor
     */
    editorDidMount(editor) {
        editor.focus();
    }

    /**
     * 代码编辑onChange
     */
    onChange = () => {
        const { code } = this.state;
        this.setState({
            code,
        });
    }

    componentDidMount() {

        let { match } = this.props;
        if (match.params && match.params.type === 'verify'){
            this.setState({
                filter: { direction: 'verify' }
            });
        } else {
            // 初始化数据
            if (!this.isLoggedIn(1)){
                //  compileCode
                Lockr.rm('CompileCode');
                // compile status
                Lockr.rm('CompileStatus');
                // contractNameList
                Lockr.rm('contractNameList');
                // compileInfo
                Lockr.rm('compileInfo');
                // compile files
                Lockr.rm('compileFiles');
                return;
            }


            this.initCompile();
        }
    }

    componentWillUnmount() {
        let { code, CompileStatus, compileInfo, contractNameList, compileFiles } = this.state;
        if (CompileStatus && code !== '// type your code...'){
            Lockr.set('CompileCode', code);
            Lockr.set('CompileStatus', CompileStatus);
            Lockr.set('compileInfo', compileInfo);
            Lockr.set('contractNameList', contractNameList);

            // file转base64保存
            let list = [];
            compileFiles.map(v => {
                let reader = new FileReader();
                const isFile = v instanceof File;
                reader.readAsDataURL(isFile ? v : v.originFileObj, 'UTF-8');
                reader.onloadend = (evt) => {
                    const dataUrl = evt.target.result;
                    list.push({ dataUrl, name: v.name });
                    Lockr.set('compileFiles', list);
                };
            });
        }
    }

    /**
    * 合约验证、合约部署切换
    * @param val 按钮类型
    */
    onRadioChange = (val) => {
        // 合约验证
        if (val === 'verify'){
            location.href = '/#/contracts/contract-Compiler/verify';
        } else {
            // 合约部署
            location.href = '/#/contracts/contract-Compiler';
        }
        this.setState({
            filters: {
                'direction': val,
            }
        });
    };

    // enterIconLoading = () => {
    //     this.setState({ deployLoading: true });
    // };

    /**
     * 是否登陆
     */
    isLoggedIn = (type) => {
        let { account, intl } = this.props;
        if (!account.isLoggedIn){
            if(type != 1){
                this.setState({
                    modal: <SweetAlert
                        warning
                        title={tu('not_signed_in')}
                        confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                        confirmBtnBsStyle="danger"
                        onConfirm={() => this.setState({ modal: null })}
                        style={{ marginLeft: '-240px', marginTop: '-195px' }}
                    >
                    </SweetAlert>
                });
            }
            
        }
        return account.isLoggedIn;
    };

    /**
     * 是否编译
     */
    isCompile = () => {
        let { contractNameList } = this.state;
        let { intl } = this.props;
        if (contractNameList.length === 0){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu('请先编译')}
                    confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({ modal: null })}
                    style={{ marginLeft: '-240px', marginTop: '-195px' }}
                >
                </SweetAlert>
            });
            return false;
        }
        return true;
    };

    /**
    * 隐藏modal
    */
    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    /**
     * 点击编译
     */
    compileModal = () => {
        if (!this.isLoggedIn()) return;
        this.setState({
            modal: <CompilerModal
                onHide={this.hideModal}
                onConfirm={(version, optimizer, runs) => this.compile(version,optimizer,runs)}
            />
        });
    };

    /**
     * 点击部署
     */
    deployModal = () => {
        if (!this.isLoggedIn()) return;
        if (!this.isCompile()) return;
        this.setState({
            modal: <DeployModal
                onHide={this.hideModal}
                onConfirm={(options) => this.deploy(options)}
                contractNameList={this.state.contractNameList}
                compileInfo={this.state.compileInfo}
            />
        });
    }

    /**
     * 点击日志输出
     */
    getTransactionInfo = async() => {
        let { CompileStatus } = this.state;
        this.setState({
            deployLoading: true,
        });
        try {
            // 部署并更新合约
            await this.deployContract();
        } catch (e) {
            let errorData = [{
                type: 'error',
                content: `Deploy fail! Error: ${e.toString()}`
            }];
            CompileStatus.push.apply(CompileStatus,errorData);
            this.setState({
                CompileStatus,
                deployLoading: false,
            });
        }
        this.setState({
            deployLoading: false,
        });

    }

    /**
     * 编译
     */
    compile = async(compilerVersion, optimizer, runs) => {
        // 代码统计
        this.gTagHandler('compile');

        this.setState({
            compileLoading: true,
            modal: null,
            CompileStatus:[],
            optimizer,
            compilerVersion,
            runs
        });

        const { CompileStatus, compileFiles } = this.state;
        let error;

        // 编译参数
        const params = {
            compiler: compilerVersion,
            optimizer: optimizer,
            runs: runs,
            files: compileFiles,
        };

        let formData = new FormData();

        for (let key in params) {
            if (params[key] === undefined) {
                continue;
            }
            if (key === 'files') {
                params[key].map(v =>
                    (v instanceof File) ? formData.append('files', v) : formData.append('files', v.originFileObj));
            } else {
                formData.append(key, params[key]);
            }
        }

        // 编译
        //  const { data } = await xhr.post(`${API_URL}/api/solidity/contract/compile`, formData)
         const { data } = await xhr.post(`${CONTRACT_NODE_API}/api/solidity/contract/compile`, formData)
            .catch(e => {
                const errorData = [{
                    type: 'error',
                    content: `Compiled error: ${e.toString()}`
                }];
                error = errorData.concat(CompileStatus);
            });

        // 错误
        if (!data){
            this.setState({
                CompileStatus: error,
                compileLoading: false
            });
            return;
        }

        const { code, errmsg } = data;

        if (code === 200){
            this.setState({
                compileLoading: false
            });
            // 编译成功
            if (errmsg === null && data.data !== {}){
                this.compileSuccess(data.data);
            }``
        } else {
            // 失败
            if (errmsg) {
                if (typeof errmsg === 'string') {

                    const errorData = [{
                        type: 'error',
                        content: `Compiled error: ${errmsg}`
                    }];

                    //const error = errorData.concat(CompileStatus);
                    const  error = errorData;
                    this.setState({
                        CompileStatus: error,
                        compileLoading: false
                    });
                }
            }
        }
    };

    /**
     * 编译成功
     * @param data:编译结果
     */
    compileSuccess = data => {
        const { byteCodeArr, abiArr } = data;

        let successData = [];
        let contractNameList = [];

        const mapArr = _.keyBy(byteCodeArr, 'contractName');
        const compileInfo = _(abiArr).map(m => _.merge({}, m, mapArr[m.contractName]))
            .concat(_.differenceBy(abiArr, byteCodeArr, 'contractName'))
            .value();

        for (const i in compileInfo) {
            const contract = compileInfo[i];
            const contractName = contract.contractName;
            contractNameList.push(contractName);

            successData.push({
                type: 'success',
                class: 'compile',
                content: `Compiled success: Contract '${
                    contractName}' <span>Show ABI</span> <span>Show Bytecode</span>`,
                contract,
            });
        }

        this.setState({
            compileInfo,
            contractNameList,
            CompileStatus:successData,
        });
    }

    /**
     * 点击部署确认
     */
    deploy = async(options) => {
        const { account: { tronWeb,sunWeb } } = this.props;
       
        const { name } = options;
        const tron = IS_MAINNET ? tronWeb : sunWeb.sidechain
        // 统计代码
        this.gTagHandler('deploy');

        const { CompileStatus } = this.state;

        this.setState({
            currentContractName: name,
            options,
            modal: null,
            deployLoading: true,
        });

        try {
            let infoData = [{
                type: 'info',
                content: 'Deploy ' + name + '\n'
            }];

            CompileStatus.push.apply(CompileStatus, infoData);

            this.setState({
                CompileStatus,
                compileLoading: false
            });
            
            const unsigned = await tron.transactionBuilder.createSmartContract(options);
            // const unsigned = await tronWeb.transactionBuilder.createSmartContract(options);
            

            infoData = [{
                type: 'info',
                class: 'unsigned',
                content: 'Transaction unsigned.',
                contract: unsigned,
            }];

            CompileStatus.push.apply(CompileStatus, infoData);

            this.setState({
                CompileStatus,
            });

            const signed = await tron.trx.sign(unsigned)
            // const signed = await tronWeb.sidechain.trx.sign(unsigned);
            infoData = [{
                type: 'info',
                class: 'signed',
                content: 'Transaction signed!',
                contract: signed
            }];

            CompileStatus.push.apply(CompileStatus, infoData);

            this.setState({
                CompileStatus,
            });

            const broadcastResult = await tron.trx.sendRawTransaction(signed);
            // const broadcastResult = await tronWeb.sidechain.trx.sendRawTransaction(signed);

            this.setState({
                txID: signed.txID,
                signed
            });

            if (broadcastResult.result) {
                infoData = [{
                    type: 'info',
                    class: 'broadcast',
                    content: 'Broadcast transaction success!',
                    contract: broadcastResult
                }];

                CompileStatus.push.apply(CompileStatus, infoData);

                this.setState({
                    CompileStatus,
                });

                // 部署并更新合约
                await this.deployContract(options);

            } else {
                infoData = [{
                    type: 'error',
                    content: `FAILED to broadcast ${name} deploy transaction \n${
                        broadcastResult.code}\n${tronWeb.toUtf8(broadcastResult.message)}./>`
                }];
                CompileStatus.push.apply(CompileStatus,infoData);
                this.setState({
                    CompileStatus,
                    deployLoading: false,
                });
            }
        } catch (e) {
            let errorData = [{
                type: 'error',
                content: `Deploy fail! Error: ${e.toString()}`
            }];
            CompileStatus.push.apply(CompileStatus,errorData);
            // _this.setState({
            // CompileStatus,
            // deployLoading: false,
            // });
        }
        this.setState({
            deployLoading: false,
        });
    }

     timeout  = (ms) =>  {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 部署并更新合约
     */
    deployContract = async(optionsParam) => {
        const { account: { tronWeb,sunWeb } } = this.props;
        let { txID, currentContractName, optimizer, runs, compilerVersion, options,
            CompileStatus, signed } = this.state;
        const { bytecode, abi, name } = optionsParam || options;
        const contractName = name || currentContractName;

        let infoData = [];

        let transactionInfo = {};
        const tron = IS_MAINNET ? tronWeb : sunWeb.sidechain

        do {

            // 部署合约
            await this.timeout(20000);
           
            transactionInfo = await tron.trx.getTransactionInfo(txID)
                .catch (e => {
                    infoData = [{
                        type: 'error',
                        class: 'info-error',
                        content: `FAILED deploying ${contractName}. Transaction here <a href="/#/transaction/${
                            txID}" class="info_link" target='_blank'>${txID}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus, infoData);
                    this.setState({
                        CompileStatus,
                        deployLoading: false,
                    });
                });
            if (!transactionInfo){
                throw new Error('Not getting transaction info!');
            }

        
            const { id, receipt, resMessage } = transactionInfo;

            if (id) {
                if (receipt.result === 'SUCCESS') {
                    infoData = [{
                        type: 'success',
                        class: 'deploy',
                        content: `Successful deployed contract '${contractName}'. Cost: ${
                            receipt.energy_fee
                                ? toThousands(receipt.energy_fee / 1000000)
                                : 0
                        } TRX, ${
                            receipt.energy_usage
                                ? toThousands(receipt.energy_usage)
                                : 0
                        } energy. Transaction confirm here <a href="/#/transaction/${
                            id}" target='_blank' class="info_link">${id}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus, infoData);
                    const base58Adress = tronWeb.address.fromHex(signed.contract_address);
                    infoData = [{
                        type: 'success',
                        class: 'deploy',
                        content: `Contract address: <a href="/#/contract/${
                            base58Adress}/code" target='_blank' class="info_link"> ${
                            base58Adress}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus,infoData);

                    const params = {
                        contractAddress: base58Adress,
                        contractName,
                        optimizer,
                        runs,
                        compiler: compilerVersion,
                        byteCode: bytecode,
                        abi: JSON.stringify(abi)
                    };

                    // 部署后更新合约
                    // const { data } = await xhr.post(`${API_URL}/api/solidity/contract/deploy`, params);
                    const { data } = await xhr.post(`${CONTRACT_NODE_API}/api/solidity/contract/deploy`, params);
                    const { code } = data;
                    if (code == 200){
                        this.setState({
                            CompileStatus,
                            deployLoading: false,
                        });
                    }
                } else if (receipt.result == 'OUT_OF_ENERGY') {
                    infoData = [{
                        type: 'error',
                        class:'deploy',
                        content: `FAILED deploying ${name}. You lost: ${
                            receipt.energy_fee
                                ? toThousands(receipt.energy_fee / 1000000)
                                : 0
                        } TRX\nReason: ${
                            tronWeb.toUtf8(resMessage)}. Transaction here <a href="/#/transaction/${
                            id}" class="info_link" target='_blank'>${id}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus, infoData);
                    this.setState({
                        CompileStatus,
                        deployLoading: false,
                    });
                } else {
                    infoData = [{
                        type: 'error',
                        content: `FAILED deploying ${contractName}.\nView transaction here <a href="/#/transaction/${
                            id}" class="info_link" target='_blank'>${id}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus, infoData);
                    this.setState({
                        CompileStatus,
                        deployLoading: false,
                    });
                }
            }

        } while (!transactionInfo.id);

        
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
                code: fileString,
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
     * 代码统计
     */
    gTagHandler = eventName => {
        const { account } = this.props;

        gtag('event', eventName, {
            'event_category': 'contract',
            'event_label': account.address,
            'referrer': window.location.origin,
            'value': account.address
        });
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

    render() {
        let { modal, code, filter, compileLoading, deployLoading, CompileStatus, compileFiles, curFile } = this.state;
        const options = {
            selectOnLineNumbers: true
        };

        // 是否上传文件
        const isSelectContract = compileFiles && compileFiles.length > 0;

        // 合约部署、合约验证button
        const buttonItem = (
            <div className="compile-button-box">
                <div className={filter.direction === 'compile' ? 'compile-button p-3 active' : 'compile-button p-3'}
                    onClick={() => this.onRadioChange('compile')}>{tu('contract_deployment')}</div>
                <div onClick={() => this.onRadioChange('verify')}
                    className={filter.direction === 'verify'
                        ? 'compile-button p-3 active ml-3' : 'compile-button p-3 ml-3'}>
                    {tu('contract_verification')}</div>
            </div>
        );

        // uploadItem
        const uploadItem = (
            <div className={cx('row p-3 mb-2', !isSelectContract && 'no-select-contract')}
                style={{ marginTop: '-.5em' }}>
                <Upload
                    multiple
                    accept=".sol"
                    customRequest={() => {}}
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

        // 编译、部署按钮
        const compilerButtonItem = (
            <div className="contract-compiler-button">
                <Button
                    loading={compileLoading}
                    onClick={this.compileModal}
                    className="compile-button compile">
                    {tu('contract_deployment_btn_compile')}
                </Button>
                <Button
                    loading={deployLoading}
                    onClick={this.deployModal}
                    className="compile-button active ml-5">
                    {tu('contract_deployment_btn_deploy')}
                </Button>
            </div>
        );

        // 已上传合约Item
        const selectedContractItem = (
            <div className="card-body">
                {uploadItem}
                <div className="contract-compiler">
                    <div>
                        <Row className="flex">
                            <Col span={4} className="contract-compiler-tab">
                                {isSelectContract && compileFiles.map(v => (
                                    <p onClick={() => this.changeEditor(v)} key={v.uid + v.name} className={curFile===v.name ? 'active' : ''}>{v.name}</p>
                                ))}
                            </Col>
                            <Col span={20}>
                                <MonacoEditor
                                    height="600"
                                    language="sol"
                                    theme="vs-dark"
                                    value={code}
                                    options={options}
                                    onChange={this.onChange}
                                    editorDidMount={this.editorDidMount}
                                />
                            </Col>
                        </Row>
                        <div>
                            <CompilerConsole CompileStatus={CompileStatus} deploy={this.getTransactionInfo}/>
                        </div>
                        {compilerButtonItem}
                    </div>
                </div>
            </div>

        );

        // 未上传合约Item
        const noSelectContractItem = (
            <div className="card-body no-select-contract">
                <div className="row">
                    <img src={UPLOADICON} />
                </div>
                {uploadItem}
            </div>
        );

        // 合约部署文案Item
        const contractTextItem = (
            <div className="compile-text-container">
                <div className="compile-icon">
                    <img src={WARNIMG} />
                </div>
                <div className="compile-text">
                    {filter.direction === 'compile' ? tu('contract_deploy_info1') : (<div>1.{tu('verify_code1')}</div>)}
                    {filter.direction === 'compile' ? tu('contract_deploy_info2') : tu('verify_code2')}
                    {
                        filter.direction === 'verify' ? (
                            <div>
                                <div style={{marginTop:'8px'}}>
                                    2.{tu('verify_code3')}
                                </div>
                                <div style={{marginTop:'8px'}}>3.{tu('verify_code6')}<Link to="/contracts/source-code-usage-terms">{tu('verify_code7')}</Link>{tu('verify_code8')}</div>
                            </div>
                        ) : ''
                    }
                </div>
            </div>
        );

        // 合约部署内容Item
        const contractDeployItem = (
            <div className="card">
                {isSelectContract ? selectedContractItem : noSelectContractItem}
            </div>
        );

        return (
            <main className="container header-overlap token_black tokencreated">
                {modal}
                <div className="row">
                    <div className="col-sm-12">
                        {buttonItem}
                        {contractTextItem}
                        {filter.direction === 'compile'
                            ? contractDeployItem
                            : <VerifyContractCode/>}
                    </div>
                </div>
            </main>
        );
    }
}
function mapStateToProps(state) {
    return {
        account: state.app.account,
    };
}
export default connect(mapStateToProps, null)(injectIntl(ContractCompiler));
