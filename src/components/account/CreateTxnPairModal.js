import React, {Component} from 'react';
import {connect} from "react-redux";
import {tu,t} from "../../utils/i18n";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import _ from "lodash";

class CreateTxnPairModal extends Component {

    constructor() {
        super();

        this.state = {
            name: "",
            disabled: false,
            secTokenIdArr:[],
            firstTokenID:"",
            secondTokenId:"",
            firstTokenValue:"",
            secondTokenValue:"",
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

    // confirm = () => {
    //     let {onConfirm} = this.props;
    //     let {name} = this.state;
    //     onConfirm && onConfirm(name);
    //     this.setState({disabled: true});
    // };
    //
    // cancel = () => {
    //     let {onCancel} = this.props;
    //     onCancel && onCancel();
    // };

    firstTokenIDChange = (value) => {
        let {currentWallet} = this.props;
        let secTokenIdArr =  _.filter(currentWallet.allowExchange,{"first_token_id":value});
        let firstTokenBalances =  _.find(currentWallet.tokenBalances,{"name":value});
        let secTokenBalances =  _.find(currentWallet.tokenBalances,{"name":secTokenIdArr[0].second_token_id});
        console.log("firstTokenBalances1========",secTokenBalances)
        console.log("secTokenBalances1======",secTokenBalances)
        this.setState({
            firstTokenID: value,
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


    render() {
        let {currentWallet} = this.props;
         console.log('currentWallet',currentWallet)
        let {modal, firstTokenID, secTokenIdArr,secondTokenId,firstTokenBalances,secTokenBalances,firstTokenValue,secondTokenValue, disabled} = this.state;
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
                                value={firstTokenID}
                                onChange={(e) => {this.firstTokenIDChange(e.target.value)}}
                            >
                                <option value=''>{t("请选择通证名称")}</option>
                                {
                                    currentWallet.allowExchange.map((token, index) => {
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
                                <span>
                                     ({firstTokenBalances})
                                </span>
                            </label>
                            <input className={"form-control" + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="number"
                                   placeholder="数量"
                                   max={firstTokenBalances}
                                   value={firstTokenValue}
                                   onInput={(ev) => this.setState({firstTokenValue: ev.target.value})}
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
                                <span>
                                    ({secTokenBalances})
                                </span>
                            </label>
                            <input className={"form-control" + ((name.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="number"
                                   placeholder="数量"
                                   max={secTokenBalances}
                                   value={secondTokenValue}
                                   onInput={(ev) => this.setState({secondTokenValue: ev.target.value})}/>
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
                                onClick={this.confirm}>{tu("创建")}</button>
                        </p>
                    </div>
                </ModalBody>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTxnPairModal)
