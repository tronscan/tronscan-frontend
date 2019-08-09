import React from 'react';
import { tu } from '../../../utils/i18n';
import xhr from 'axios/index';
import { API_URL } from '../../../constants';
import { TronLoader } from '../../common/loaders';
import { Radio } from 'antd';
import ContractInfo from './ContractInfo';
import EntryContract from './EntryContract';
import tronWeb from 'tronweb';
import { connect } from 'react-redux';

class Code extends React.Component {

    constructor(props) {
        super(props);
        // https://api.shasta.trongrid.io
        this.tronWeb = new tronWeb({
            fullNode: 'https://api.trongrid.io',
            solidityNode: 'https://api.trongrid.io',
            eventServer: 'https://api.trongrid.io',
        });
        this.state = {
            loading: true,
            choiceContractItem: 'code',
            contractInfoList: '',
            viewContractList: [],
            payableContractList: [],
            nonePayableContractList: [],
            eventContractList: [],
            currentTokens: [],
            contractVerifyState: true
        };
    }

    async componentDidMount() {
        await this.getContractVerifyStatus();
    }

    async getContractVerifyStatus() {
        const { filter: { address } } = this.props;
        const params = {
            contractAddress: address
        };
        let { data } = await xhr.post(`${API_URL}/api/solidity/contract/info`, params)
            .catch(function(e) {
                const errorData = [{
                    type: 'error',
                    content: `Compiled error: ${e.toString()}`
                }];
            });
        const dataInfo = data.data;
        // eslint-disable-next-line
        const { status, contract_name, byte_code, contract_code, constructor_params, optimizer, compiler } = dataInfo;
        if (status === 3 || status === 1) {
            this.setState({
                contractVerifyState: false,
                loading: false
            }, async() => {
                await this.getContractInfos();
            });
        } else {
            let infoObj;
            const abi = dataInfo.abi && JSON.parse(dataInfo.abi);
            /* eslint-disable */
            infoObj = {
                interfaceAbi: abi || '',
                name: contract_name || '',
                bytecode: byte_code || '',
                contractCode: contract_code || [],
                constructorParams: constructor_params || '',
                optimizer,
                compiler
            };
            /* eslint-disable */
            this.setState({
                contractVerifyState: true,
                contractInfoList: infoObj,
                loading: false
            }, async() => {
                this.getContractTokenList();
                await this.getContractInfos();
                this.viewFuntions();
                this.payableFuntions();
                this.nonePayableFuntions();
            });
        }
    }

    async getContractInfos() {
        const { filter: { address } } = this.props;
        const { contractVerifyState, contractInfoList } = this.state;
        let smartcontract = await this.tronWeb.trx.getContract(address);
        if (contractVerifyState) {
            this.setState({
                contractInfoList: { abi: smartcontract.abi, ...contractInfoList }
            });
        } else {
            this.setState({
                contractInfoList: smartcontract
            });
        }
    }

    /**
     * 代码、阅读合约、编写合约切换
     * @param e: 当前元素
     */
    onChange = e => {
        this.setState({
            choiceContractItem: e.target.value,
        });
    }

    viewFuntions() {
        const { contractInfoList: { abi: { entrys } } } = this.state;
        if (entrys) {
            const list = entrys.filter(
                entry => entry.type === 'Function' &&
                (entry.stateMutability === 'View' || entry.stateMutability === 'Pure')
            );
            this.setState({
                viewContractList: list
            });
        }
    }

    payableFuntions() {
        const { contractInfoList: { abi } } = this.state;
        if (abi) {
            const { entrys } = abi;
            const list = entrys.filter(
                entry => entry.type === 'Function' && entry.stateMutability === 'Payable'
            );
            this.setState({
                payableContractList: list
            });
        }
    }

    nonePayableFuntions() {
        const { contractInfoList: { abi } } = this.state;
        if (abi) {
            const { entrys } = abi;
            const list = entrys.filter(
                entry => entry.type === 'Function' && entry.stateMutability === 'Nonpayable'
            );
            this.setState({
                nonePayableContractList: list
            });
        }
    }

    events() {
        const { contractInfoList: { abi: { entrys } } } = this.state;

        return entrys.filter(entry => entry.type === 'Event');
    }

    async getContractTokenList() {
        const { tronWeb } = this.props.account;
        if (tronWeb) {
            const myAccount = await tronWeb.trx.getAccount(
                tronWeb.defaultAddress.hex
            );
            const listTokens = await tronWeb.trx.listTokens();
            const balance = await tronWeb.trx.getBalance(
                tronWeb.defaultAddress.hex
            );
            let currentTokens = [];
            if (myAccount.assetV2 !== undefined) {
                myAccount.assetV2.forEach(item => {
                    let token = {};
                    token.id = item.key;
                    token.name = listTokens.find(i => i.id === token.id).abbr;
                    token.balance = item.value;
                    currentTokens.push(token);
                });
            }
            currentTokens.push({
                id : '0',
                name: 'TRX',
                balance: balance / 100000
            });
            this.setState({
                currentTokens: currentTokens
            });
        }
    }

    render() {
        const { choiceContractItem,
            contractInfoList,
            viewContractList,
            payableContractList,
            nonePayableContractList,
            currentTokens,
            contractVerifyState,
            loading } = this.state;
        const { filter } = this.props;
        const { abi, name, compiler, optimizer } = contractInfoList;
        let tabContent;

        if (choiceContractItem === 'code' && contractInfoList) {
            tabContent = (
                <ContractInfo filter={{ address: filter.address, contractInfoList: contractInfoList }}/>
            );
        } else if (choiceContractItem === 'read' && viewContractList) {
            tabContent = (
                viewContractList.map((val, key) => {
                    return (
                        <div key={key}>
                            <EntryContract contractItem={val} index={key} address={filter.address} abi={abi}/>
                        </div>
                    );
                })
            );
        } else if (choiceContractItem === 'write') {
            tabContent = (
                <div>
                    {
                        payableContractList.length !== 0
                            ? <div>
                                <div className="write-title">{tu('write_payable')}</div>
                                {
                                    payableContractList.map((val, key) => {
                                        return (
                                            <div key={key}>
                                                <EntryContract contractItem={val} index={key} address={filter.address}
                                                    currentTokens={currentTokens} />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            : null
                    }
                    {
                        nonePayableContractList.length != 0 ?
                            <div>
                                <div className="write-title">{tu('write_nonePayable')}</div>
                                {
                                    nonePayableContractList.map((val, key) => {
                                        return (
                                            <div key={key}>
                                                <EntryContract contractItem={val} index={key} address={filter.address}
                                                    abi={contractInfoList.abi} />
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            : null
                    }
                </div>
            );
        }

        // 按钮Item
        const radioBtnItem = (
            <Radio.Group className="choice-btn" size="Small" onChange={this.onChange}
                value={this.state.choiceContractItem}>
                <Radio.Button value="code">{tu('contract_code_choice')}</Radio.Button>
                <Radio.Button value="read">{tu('contract_read')}</Radio.Button>
                <Radio.Button value="write">{tu('contract_write')}</Radio.Button>
            </Radio.Group>
        );

        // 已验证合约信息Item
        const contractMessItem = (
            <div className="tab-choice">
                {radioBtnItem}
                <p>{tu('contract_name')}: <span>{name || ''}</span></p>
                <p>{tu('contract_version')}: <span>{compiler || ''}</span></p>
                <p>{tu('contract_optimize')}: <span>
                    {optimizer === 1
                        ? <span>{tu('contract_optimizered')}</span>
                        : <span>{tu('contract_optimizer')}</span>}
                </span></p>
            </div>
        );

        // 去验证合约Item
        const contractVerifyBtnItem = (
            <div className="contrat-verify">
                {tu('contract_verify_status')}
                <a href="/#/contracts/contract-Compiler/verify">{tu('contract_verify_btn')}</a>
            </div>
        );

        return (
            <main className="contract-container">
                {loading
                    ? <div className="loading-style" style={{ marginTop: '-20px' }}><TronLoader /></div>
                    : <div>{contractVerifyState ? contractMessItem : contractVerifyBtnItem}</div>}
                <div className="tab-container">
                    {tabContent}
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

export default connect(mapStateToProps, null)(Code);