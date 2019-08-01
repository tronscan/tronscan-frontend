/* eslint-disable no-undef */
import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Upload, Row, Col } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import { tu } from '../../../utils/i18n';
import CompilerConsole from './CompilerConsole';
import VerifyContractCode from './VerifyContractCode';
import CompilerModal from './CompilerCompileModal';
import DeployModal from './CompilerDeployModal';
import { Base64 } from 'js-base64';
import xhr from 'axios/index';
import SweetAlert from 'react-bootstrap-sweetalert';
import _ from 'lodash';
import { toThousands } from '../../../utils/number';
import Lockr from 'lockr';
import { API_URL } from '../../../constants';
import { readFile } from './../../../utils/fs';

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
                direction:'compile'
            },
            CompileStatus: [],
            modal: null,
            showModal: false,
            contractNameList: [],
            compileInfo: [],
            runs: '0',
            fileList: [],
        };
        this.onChange = this.onChange.bind(this);
    }

    initCompile = () =>{
        if (Lockr.get('CompileCode')){
            let solidity = Base64.encode(Lockr.get('CompileCode'));
            this.setState({
                solidity,
                code:Lockr.get('CompileCode')
            });
        }
        if (Lockr.get('CompileStatus')){
            this.setState({
                CompileStatus:Lockr.get('CompileStatus')
            });
        }
        if (Lockr.get('contractNameList')){
            this.setState({
                contractNameList:Lockr.get('contractNameList')
            });
        }
        if (Lockr.get('compileInfo')){
            this.setState({
                compileInfo:Lockr.get('compileInfo')
            });
        }
    }

    editorDidMount(editor) {
        editor.focus();
    }

    onChange(newValue, e) {
        let solidity = Base64.encode(newValue);
        this.setState({
            solidity,
            code:newValue
        });
    }

    componentDidMount() {
        let { match } = this.props;
        if (match.params && match.params.type === 'verify'){
            this.setState({
                filter: { direction: 'verify' }
            });
        } else {
            this.initCompile();
        }
    }

    componentWillUnmount() {
        let { code, CompileStatus, compileInfo, contractNameList } = this.state;
        if (CompileStatus && code !== '// type your code...'){
            Lockr.set('CompileCode', code);
            Lockr.set('CompileStatus', CompileStatus);
            Lockr.set('compileInfo', compileInfo);
            Lockr.set('contractNameList', contractNameList);
        }
    }

    /**
    * 合约验证、合约部署切换
    * @param val 按钮类型
    */
    onRadioChange = (val) => {
        if (val === 'verify'){
            location.href = '/#/contracts/contract-Compiler/verify';
        } else {
            location.href = '/#/contracts/contract-Compiler';
        }
        this.setState({
            filters: {
                'direction': val,
            }
        });
    };

    enterIconLoading = () => {
        this.setState({ deployLoading: true });
    };

    isLoggedIn = () => {
        let { account, intl } = this.props;
        if (!account.isLoggedIn){
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
        return account.isLoggedIn;
    };

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

    compileModal = () => {
        if (!this.isLoggedIn()) return;
        this.setState({
            modal: <CompilerModal
                onHide={this.hideModal}
                onConfirm={(version, optimizer, runs) => this.compile(version,optimizer,runs)}
            />
        });
    }

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

    getTransactionInfo = async() => {
        let { txID,currentContractName, CompileStatus, signed,options } = this.state;
        let transactionInfo = {};
        let infoData = [];
        const { tronWeb } = this.props.account;
        this.setState({
            deployLoading: true,
        });
        let _this = this;
        try {
            do {
                transactionInfo = await tronWeb.trx.getTransactionInfo(
                    txID
                ).catch ((e) => {
                    infoData = [{
                        type: 'error',
                        class:'info-error',
                        content: `FAILED deploying ${currentContractName}. Transaction here <a href="/#/transaction/${txID}" class="info_link" target='_blank'>${txID}</a>`
                    }];
                    CompileStatus.push.apply(CompileStatus,infoData);
                    _this.setState({
                        CompileStatus,
                        deployLoading: false,
                    });
                });
                if (!transactionInfo){
                    throw new Error('Not getting transaction info!');
                }
                if (transactionInfo.id) {
                    if (transactionInfo.receipt.result == 'SUCCESS') {
                        infoData = [{
                            type: 'success',
                            class:'deploy',
                            content: `Successful deployed contract '${currentContractName}'. Cost: ${
                                transactionInfo.receipt.energy_fee
                                    ? toThousands(
                                        transactionInfo.receipt.energy_fee / 1000000
                                    )
                                    : 0
                            } TRX, ${
                                transactionInfo.receipt.energy_usage
                                    ? toThousands(transactionInfo.receipt.energy_usage)
                                    : 0
                            } energy. Transaction confirm here <a href="/#/transaction/${transactionInfo.id}" target='_blank' class="info_link">${transactionInfo.id}</a>`
                        }];
                        CompileStatus.push.apply(CompileStatus,infoData);
                        let base58Adress = tronWeb.address.fromHex(
                            signed.contract_address
                        );
                        infoData = [{
                            type: 'success',
                            class:'deploy',
                            content: `Contract address: <a href="/#/contract/${base58Adress}/code" target='_blank' class="info_link"> ${base58Adress}</a>`
                        }];
                        CompileStatus.push.apply(CompileStatus,infoData);

                        let { data } = await xhr.post(`${API_URL}/api/solidity/contract/deploy`, {
                            'contractAddress':base58Adress,
                            'contractName':this.state.currentContractName,
                            'optimizer':this.state.optimizer,
                            'runs':this.state.runs,
                            'compiler':this.state.compilerVersion,
                            'encodedSolidity':this.state.solidity,
                            'byteCode':this.state.options.bytecode,
                            'abi':JSON.stringify(this.state.options.abi)
                        });
                        if (data.code == 200){
                            this.setState({
                                CompileStatus,
                                deployLoading: false,
                            });
                        }
                    } else if (transactionInfo.receipt.result == 'OUT_OF_ENERGY') {
                        infoData = [{
                            type: 'error',
                            class:'deploy',
                            content: `FAILED deploying ${currentContractName}. You lost: ${
                                transactionInfo.receipt.energy_fee
                                    ? toThousands(
                                        transactionInfo.receipt.energy_fee / 1000000
                                    )
                                    : 0
                            } TRX\nReason: ${tronWeb.toUtf8(
                                transactionInfo.resMessage
                            )}. Transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link" target='_blank'>${transactionInfo.id}</a>`
                        }];
                        CompileStatus.push.apply(CompileStatus,infoData);
                        this.setState({
                            CompileStatus,
                            deployLoading: false,
                        });
                    } else {
                        infoData = [{
                            type: 'error',
                            content: `FAILED deploying ${currentContractName}.\nView transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link" target='_blank'>${transactionInfo.id}</a>`
                        }];
                        CompileStatus.push.apply(CompileStatus,infoData);
                        this.setState({
                            CompileStatus,
                            deployLoading: false,
                        });
                    }
                }
            } while (!transactionInfo.id);
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

    compile = async(compilerVersion, optimizer, runs) => {
        let { account } = this.props;
        gtag('event', 'compile', {
            'event_category': 'contract',
            'event_label': account.address,
            'referrer':window.location.origin,
            'value': account.address
        });
        this.setState({
            compileLoading: true,
            modal: null,
            CompileStatus:[],
            optimizer,
            compilerVersion,
            runs
        });
        let { CompileStatus, solidity } = this.state;
        let error;
        let { data } = await xhr.post(`${API_URL}/api/solidity/contract/compile`, {
            'compiler': compilerVersion,
            'optimizer': optimizer,
            'solidity':solidity,
            'runs':runs
        }).catch(function(e) {
            let errorData = [{
                type: 'error',
                content: `Compiled error: ${e.toString()}`
            }];
            error = errorData.concat(CompileStatus);
        });
        if (!data){
            this.setState({
                CompileStatus:error,
                compileLoading: false
            });
            return;
        }
        if (data.code === 200){
            this.setState({
                compileLoading: false
            });
            if (data.errmsg == null && data.data !=={}){
                let successData = [];
                let contractNameList = [];
                let mapArr = _.keyBy(data.data.byteCodeArr, 'contractName');
                let compileInfo = _(data.data.abiArr).map(m => _.merge({}, m, mapArr[m.contractName]))
                    .concat(_.differenceBy(data.data.abiArr, data.data.byteCodeArr, 'contractName'))
                    .value();
                for (let i in compileInfo) {
                    let contract = compileInfo[i];
                    let contractName = contract.contractName;
                    contractNameList.push(contractName);
                    successData.push({
                        type: 'success',
                        class:'compile',
                        content: `Compiled success: Contract '${contractName}' <span>Show ABI</span> <span>Show Bytecode</span>`,
                        contract:contract
                    });
                }
                this.setState({
                    compileInfo,
                    contractNameList,
                    CompileStatus:successData,
                });
            }
        } else {
            if (data.errmsg){
                if (typeof data.errmsg === 'string'){
                    let errorData = [{
                        type: 'error',
                        content: `Compiled error: ${data.errmsg}`
                    }];
                    let error = errorData.concat(CompileStatus);
                    this.setState({
                        CompileStatus:error,
                        compileLoading: false
                    });
                }
            }
        }
    };

    deploy = async(options) => {
        let { account } = this.props;
        gtag('event', 'deploy', {
            'event_category': 'contract',
            'event_label': account.address,
            'referrer':window.location.origin,
            'value': account.address
        });
        let _this = this;
        let currentContractName = options.name;
        this.setState({
            currentContractName:currentContractName,
            options
        });
        let { CompileStatus } = this.state;
        const { tronWeb } = this.props.account;
        this.setState({
            modal:null,
            deployLoading: true,
        });
        try {
            let infoData = [{
                type: 'info',
                content: 'Deploy ' + options.name + '\n'
            }];
            CompileStatus.push.apply(CompileStatus,infoData);
            this.setState({
                CompileStatus,
                compileLoading: false
            });
            const unsigned = await tronWeb.transactionBuilder.createSmartContract(
                options
            );
            infoData = [{
                type: 'info',
                class:'unsigned',
                content:'Transaction unsigned.',
                contract:unsigned
            }];
            CompileStatus.push.apply(CompileStatus,infoData);
            this.setState({
                CompileStatus,
            });
            const signed = await tronWeb.trx.sign(unsigned);
            infoData = [{
                type: 'info',
                class:'signed',
                content:'Transaction signed!',
                contract:signed
            }];
            CompileStatus.push.apply(CompileStatus,infoData);
            this.setState({
                CompileStatus,
            });
            const broadcastResult = await tronWeb.trx.sendRawTransaction(
                signed
            );
            this.setState({
                txID:signed.txID,
                signed
            });
            if (broadcastResult.result === true) {
                infoData = [{
                    type: 'info',
                    class:'broadcast',
                    content:'Broadcast transaction success!',
                    contract:broadcastResult
                }];
                CompileStatus.push.apply(CompileStatus,infoData);
                this.setState({
                    CompileStatus,
                });

                let transactionInfo = {};
                do {
                    transactionInfo = await tronWeb.trx.getTransactionInfo(
                        signed.txID
                    ).catch (function(e) {
                        infoData = [{
                            type: 'error',
                            class:'info-error',
                            content: `FAILED deploying ${currentContractName}. Transaction here <a href="/#/transaction/${signed.txID}" class="info_link" target='_blank'>${signed.txID}</a>`
                        }];
                        CompileStatus.push.apply(CompileStatus,infoData);
                        _this.setState({
                            CompileStatus,
                            deployLoading: false,
                        });
                    });
                    if (!transactionInfo){
                        throw new Error('Not getting transaction info!');
                    }
                    if (transactionInfo.id) {
                        if (transactionInfo.receipt.result == 'SUCCESS') {
                            infoData = [{
                                type: 'success',
                                class:'deploy',
                                content: `Successful deployed contract '${currentContractName}'. Cost: ${
                                    transactionInfo.receipt.energy_fee
                                        ? toThousands(
                                            transactionInfo.receipt.energy_fee / 1000000
                                        )
                                        : 0
                                } TRX, ${
                                    transactionInfo.receipt.energy_usage
                                        ? toThousands(transactionInfo.receipt.energy_usage)
                                        : 0
                                } energy. Transaction confirm here <a href="/#/transaction/${transactionInfo.id}" target='_blank' class="info_link">${transactionInfo.id}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);
                            let base58Adress = tronWeb.address.fromHex(
                                signed.contract_address
                            );
                            infoData = [{
                                type: 'success',
                                class:'deploy',
                                content: `Contract address: <a href="/#/contract/${base58Adress}/code" target='_blank' class="info_link"> ${base58Adress}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);

                            let { data } = await xhr.post(`${API_URL}/api/solidity/contract/deploy`, {
                                'contractAddress':base58Adress,
                                'contractName':options.name,
                                'optimizer':this.state.optimizer,
                                'runs':this.state.runs,
                                'compiler':this.state.compilerVersion,
                                'encodedSolidity':this.state.solidity,
                                'byteCode':options.bytecode,
                                'abi':JSON.stringify(options.abi)
                            });
                            if (data.code == 200){
                                this.setState({
                                    CompileStatus,
                                    deployLoading: false,
                                });
                            }
                        } else if (transactionInfo.receipt.result == 'OUT_OF_ENERGY') {
                            infoData = [{
                                type: 'error',
                                class:'deploy',
                                content: `FAILED deploying ${currentContractName}. You lost: ${
                                    transactionInfo.receipt.energy_fee
                                        ? toThousands(
                                            transactionInfo.receipt.energy_fee / 1000000
                                        )
                                        : 0
                                } TRX\nReason: ${tronWeb.toUtf8(
                                    transactionInfo.resMessage
                                )}. Transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link" target='_blank'>${transactionInfo.id}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);
                            this.setState({
                                CompileStatus,
                                deployLoading: false,
                            });
                        } else {
                            infoData = [{
                                type: 'error',
                                content: `FAILED deploying ${currentContractName}.\nView transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link" target='_blank'>${transactionInfo.id}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);
                            this.setState({
                                CompileStatus,
                                deployLoading: false,
                            });
                        }
                    }
                } while (!transactionInfo.id);

            } else {
                infoData = [{
                    type: 'error',
                    content: `FAILED to broadcast ${currentContractName} deploy transaction \n${broadcastResult.code}\n${tronWeb.toUtf8(broadcastResult.message)}./>`
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

    /**
    * 点击上传
    * @param fileList：文件列表
    */
    handleChange = ({ fileList }) => this.setState({ fileList });

    /**
    * 点击左侧菜单文件
    * @param e:目标文件
    */
    changeEditor = e => {
        readFile(e)
            .then(v => {
                this.setState({
                    code: v,
                });
            })
            .catch(e => {
                console.log(e, '======');
            });
    }

    render() {
        let { modal, code, filter, compileLoading, deployLoading, CompileStatus, fileList } = this.state;
        const options = {
            selectOnLineNumbers: true
        };
        // 合约部署、合约验证button
        const buttonItem = (
            <div className="compile-button-box">
                <div className={filter.direction === 'compile' ? 'compile-button p-3 active' : 'compile-button p-3'}
                    onClick={() => this.onRadioChange('compile')}>{tu('contract_deployment')}</div>
                <div onClick={() => this.onRadioChange('verify')}
                    className={filter.direction === 'verify'
                        ? 'compile-button p-3 active ml-4' : 'compile-button p-3 ml-4'}>
                    {tu('contract_verification')}</div>
            </div>
        );
        // uploadItem
        const uploadItem = (
            <Upload
                multiple
                onChange={this.handleChange}
                fileList={fileList}
                showUploadList>
                <Button>
                    Click to Upload
                </Button>
            </Upload>);
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
                    className="compile-button active ml-4">
                    {tu('contract_deployment_btn_deploy')}
                </Button>
            </div>
        );
        // 合约部署内容Item
        const contractDeployItem = (
            <div>
                <div className="compile-text mt-4">
                    {tu('contract_deploy_info')}
                </div>
                <div className="card mt-4">
                    <div className="card-body">
                        <div className="contract-compiler">
                            <div>
                                <Row>
                                    <Col span={4}>
                                        {fileList && fileList.length > 0 && fileList.map(v => (
                                            <p onClick={() => this.changeEditor(v)} key={v.name}>{v.name}</p>
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
                </div>
            </div>
        );
        return (
            <main className="container header-overlap token_black tokencreated">
                {modal}
                <div className="row">
                    <div className="col-sm-12">
                        {buttonItem}
                        {uploadItem}
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
        wallet: state.wallet.current,
    };
}
const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ContractCompiler));
