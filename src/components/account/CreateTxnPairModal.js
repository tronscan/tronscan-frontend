import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {Client} from "../../services/api";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
import {NumberField} from "../common/Fields";
import _ from "lodash";

class CreateTxnPairModal extends React.PureComponent {

    constructor() {
        super();

        this.state = {
            name: "",
            disabled: false,
            allowExchange:[],
            secTokenIdArr:[],
            firstTokenId:"",
            secondTokenId:"",
            firstTokenBalance:0,
            secondTokenBalance:0,
            formTxnPair: {
                txnpair_name_1: {
                    valid: false,
                    value: "",
                    balance:'',
                    error: ''
                },
                txnpair_name_2: {
                    valid: false,
                    value: '',
                    balance:'',
                    error: ''
                },
                txnpair_amount_1: {
                    valid: false,
                    value:'',
                    balance:'',
                    error: ''
                },
                txnpair_amount_2: {
                    valid: false,
                    value: '',
                    balance:'',
                    error: ''
                }
            }
        };
    }

    handleVerifyCodeChange(field, value) {
        const {formTxnPair: {txnpair_name_1,txnpair_name_2,txnpair_amount_1,txnpair_amount_2}} = this.state;
        let {tokenBalances} = this.props;
        const newFieldObj = {value, valid: true, balance:'', error: ''};
        const contractList = {
            txnpair_name_1() {
                 if (value) {
                     newFieldObj.error = '**Required';
                     newFieldObj.valid = false;
                 }else{
                     tokenBalances = _(tokenBalances)
                         .filter(tb => tb.name.toUpperCase() === value.name)
                         .value();
                     newFieldObj.balance = tokenBalances[0].balance;
                 }
            },
            txnpair_name_2() {
                if (value) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
            },
            txnpair_amount_1() {
                if (value) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }else{

                }
            },
            txnpair_amount_2() {
                if (value.length) {
                    newFieldObj.error = '**Required';
                    newFieldObj.valid = false;
                }
            },
        }
        if(field == 'contract_address' || field == 'contract_code'){
            contractList[field]()
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

    isValid = (type) => {

        let {name} = this.state;

        if (name.length < 8) {
            return [false, tu("name_to_short")]
        }

        if (name.length > 32) {
            return [false, tu("name_to_long")];
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            return [false, tu("permitted_characters_message")];
        }

        return [true];
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    create = async () => {
        let {onCreate,currentWallet} = this.props;
        let {firstTokenId, secondTokenId, firstTokenBalance, secondTokenBalance} = this.state;
        onCreate && onCreate(firstTokenId,secondTokenId,firstTokenBalance,secondTokenBalance);
       this.setState({disabled: true});
    };

    cancel = () => {
        let {onCancel} = this.props;
        onCancel && onCancel();
    };

    firstTokenIdChange = (value) => {
        let {account,currentWallet} = this.props;
        let {allowExchange} = this.state;
        console.log('account====',account)
        console.log('currentWallet====',currentWallet)
        let secTokenIdArr =  _.filter(allowExchange,{"first_token_id":value});
        let firstTokenBalances =  _.find(currentWallet.tokenBalances,{"name":value});
        let secTokenBalances =  _.find(currentWallet.tokenBalances,{"name":secTokenIdArr[0].second_token_id});
        console.log("secTokenIdArr========",secTokenIdArr)
        this.setState({
            firstTokenId: value,
            secondTokenId:secTokenIdArr[0].second_token_id,
            secTokenIdArr:secTokenIdArr,
            firstTokenBalances:firstTokenBalances.balance,
            secTokenBalances:secTokenBalances.balance
        },() =>{

        });
    }

    secondTokenIdChange = (value) => {
        let {currentWallet} = this.props;
        let secTokenBalances =  _.find(currentWallet.tokenBalances,{"name":value});
        console.log("secTokenBalances2=======",secTokenBalances)
        this.setState({
            secondTokenId: value,
            secTokenBalances:secTokenBalances.balance
        },() =>{

        });
    }

    exchangeToken(){
        let {currentWallet} = this.props;
        let allowExchange =   _.filter(currentWallet.allowExchange, function(o){
            let block = true
            currentWallet.exchanges.forEach(item => {
                if((o.first_token_id == (item.first_token_id == "_"?"TRX":item.first_token_id)) && o.second_token_id == (item.second_token_id == "_"?"TRX":item.second_token_id)){
                    block = false
                }
            })
            return block
        })
        this.setState({
            allowExchange: allowExchange
        },() =>{

        });


    }
    componentDidMount() {
        this.exchangeToken()
    }




    render() {
        let {currentWallet} = this.props;
         console.log('currentWallet',currentWallet)
        let {modal, firstTokenId, secTokenIdArr,secondTokenId,firstTokenBalances,secTokenBalances,firstTokenBalance,secondTokenBalance,allowExchange, disabled} = this.state;
        let [isValid, errorMessage] = this.isValid();

        if (modal) {
            return modal;
        }

        return (
            <Modal isOpen={true} toggle={this.cancel} fade={false} size="md" className="modal-dialog-centered">
                <ModalHeader className="text-center" toggle={this.cancel}>
                    <i className="fa fa-plus-square"></i>
                    &nbsp;
                    {tu("创建交易对")}
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-6">
                            <label>{tu("通证名称")}</label>
                            <select className="custom-select"
                                value={firstTokenId}
                                onChange={(e) => {this.firstTokenIdChange(e.target.value)}}
                            >
                                {
                                    firstTokenId?"":<option value=''>{t("请选择通证名称")}</option>
                                }
                                {
                                    allowExchange.map((token, index) => {
                                        return (
                                            <option key={index} value={token.first_token_id}>{token.first_token_id}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label>{tu("余额")}
                                {
                                    firstTokenBalances?<span>
                                     ({firstTokenBalances})
                                </span>:""
                                }
                            </label>
                            <input className={"form-control" + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="number"
                                   placeholder="数量"
                                   max={firstTokenBalances}
                                   value={firstTokenBalance}
                                   onInput={(ev) => this.setState({firstTokenBalance: ev.target.value})}
                            />
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <label>{tu("通证名称")}</label>
                            <select className="custom-select"
                                value={secondTokenId}
                                onChange={(e) => {this.secondTokenIdChange(e.target.value)}}
                            >
                                {
                                    !secTokenIdArr.length
                                        ?
                                        <option value=''>{t("请选择通证名称")}</option>
                                        :
                                        secTokenIdArr.map((token, index) => {
                                        return (
                                            <option key={index} value={token.second_token_id}>{token.second_token_id}</option>
                                        )
                                    })
                                }
                            </select>
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label>
                                {tu("余额")}
                                {
                                    secTokenBalances?<span>
                                    ({secTokenBalances})
                                </span>:""
                                }

                            </label>
                            <input className={"form-control" + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="number"
                                   placeholder="数量"
                                   max={secTokenBalances}
                                   value={secondTokenBalance}
                                   onInput={(ev) => this.setState({secondTokenBalance: ev.target.value})}/>
                            <div className="invalid-feedback text-center text-danger">
                                {errorMessage}
                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <p className="text-center">
                            <button
                                // disabled={disabled || !isValid}
                                className="btn btn-danger"
                                style={{width:'100%'}}
                                onClick={this.create}>{tu("创建")}</button>
                        </p>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
        wallet: state.wallet,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {
    reloadWallet
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateTxnPairModal))

