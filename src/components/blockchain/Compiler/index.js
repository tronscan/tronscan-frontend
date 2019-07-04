/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {FormattedNumber} from "react-intl";
import {TronLoader} from "../../common/loaders";
import { Radio, Button } from 'antd'
import MonacoEditor from 'react-monaco-editor';
import {tu} from "../../../utils/i18n";
import CompilerConsole from "./CompilerConsole";
import { Base64 } from 'js-base64';
import xhr from "axios/index";
import SweetAlert from "react-bootstrap-sweetalert";

@connect(
    state => ({
        account: state.app.account,
        wallet: state.wallet.current,
    })
)
class ContractCompiler extends React.Component {
    constructor({match}) {
        super();

        this.state = {
            loading: false,
            compileLoading:false,
            deployLoading:false,
            code: '// type your code...',
            filter: {
                direction:'compiler'
            },
            CompileStatus:[],
            modal: null,
        }
        this.onChange = this.onChange.bind(this)
    }

    editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }

    onChange(newValue, e) {
        console.log('onChange', e);
        console.log("111",typeof newValue)
        let solidity = Base64.encode(newValue);
        this.setState({
            solidity,
            code:newValue
        })


    }

    componentDidMount() {
        let {match} = this.props;
       // this.loadContract(match.params.id);

    }

    componentWillUnmount() { }


    async loadContract(id) {
        //this.setState({loading: true, address: {address: id} });

    }

    onRadioChange = (e) => {
        this.setState({
            filter: {
                direction: e.target.value,
            }
        })
    };

    enterIconLoading = () => {
        this.setState({ deployLoading: true });
    };

    isLoggedIn = () => {
        let {account, intl} = this.props;
        if(!account.isLoggedIn){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu("not_signed_in")}
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({modal: null})}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                </SweetAlert>
            })
        }
        return account.isLoggedIn;
    };

    compile = async () => {
        if(!this.isLoggedIn()) return;
        let { CompileStatus } = this.state;
        this.setState({ compileLoading: true });
        let {data} = await xhr.post(`http://172.16.21.246:9016/api/contract/compile`, {
            "compiler": "solidity-0.4.25_Odyssey_v3.2.3",
            "optimizer": "1",
            "solidity":this.state.solidity,
            "runs":200
        }).catch(function (e) {
            console.log(e)
            let errorData = [{
                type: "error",
                content: `Compiled error: ${e.toString()}`
            }]
            let error = errorData.concat(CompileStatus)
            this.setState({
                CompileStatus:error,
                compileLoading: false
            });
        });
        console.log('data',data)
        if(data.code == 200){
            this.setState({
                compileLoading: false
            });
            if(data.errmsg){
                if(typeof data.errmsg == 'string'){
                    console.log('data.errmsg',data.errmsg)
                    let errorData = [{
                        type: "error",
                        content: `Compiled error: ${data.errmsg}`
                    }]
                    let error = errorData.concat(CompileStatus)
                    this.setState({
                        CompileStatus:error,
                        compileLoading: false
                    });
                }
            }
        }else{
            this.setState({
                compileLoading: false
            });
            alert(data.errmsg)
            console.log(data)
        }

    };








    render() {
        let {modal, loading, code, filter, compileLoading, deployLoading, CompileStatus } = this.state;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <main className="container header-overlap token_black">
                {modal}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex contract-compiler">
                                    <div>
                                        <Radio.Group size="large" value={filter.direction}  onChange={this.onRadioChange}>
                                            <Radio.Button value="compiler">{tu('合约部署')}</Radio.Button>
                                            <Radio.Button value="verify">{tu('合约验证')}</Radio.Button>
                                        </Radio.Group>
                                    </div>
                                    {
                                        filter.direction == 'compiler' ?
                                            <div className="pt-4">
                                                <MonacoEditor
                                                    width="800"
                                                    height="600"
                                                    language="sol"
                                                    theme="vs-dark"
                                                    value={code}
                                                    options={options}
                                                    onChange={this.onChange}
                                                    editorDidMount={this.editorDidMount}
                                                />
                                                <div className="contract-compiler-console">
                                                    <CompilerConsole  CompileStatus={CompileStatus}/>
                                                </div>
                                                <div className="contract-compiler-button">
                                                    <Button
                                                        type="primary"
                                                        loading={compileLoading}
                                                        onClick={this.compile}
                                                    >
                                                        {tu('编译')}
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        loading={deployLoading}
                                                        onClick={this.deployLoading}
                                                        className="ml-5"
                                                    >
                                                        {tu('部署')}
                                                    </Button>
                                                </div>
                                            </div>
                                            :
                                            <div>
                                                合约验证
                                            </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {


    return {
    };
}

const mapDispatchToProps = {
};

export default injectIntl(ContractCompiler);
