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

class OperateTxnPairModal extends React.PureComponent{

    constructor() {
        super();

        this.state = {
            tokenId: "",
            tokenBalances:0,
            tokenQuant:0,
            disabled: false,
        };
    }

    isValid = () => {
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

    inject = async () => {
        let {onInject, exchange} = this.props;
        console.log("exchange222=====",exchange)
        let {tokenId,tokenQuant} = this.state;
        if(tokenId == "TRX"){
            tokenId = "_";
            tokenQuant = tokenQuant * ONE_TRX;
        }
        onInject && onInject(exchange.exchange_id, tokenId, tokenQuant);
        this.setState({disabled: true});
    };
    withdraw = async () => {
        let {onWithdraw, exchange} = this.props;
        let {tokenId,tokenQuant} = this.state;
        if(tokenId == "TRX"){
            tokenId = "_";
            tokenQuant = tokenQuant;
        }
        onWithdraw && onWithdraw(exchange.exchange_id, tokenId, tokenQuant);
        this.setState({disabled: true});
    };

    cancel = () => {
        let {onCancel} = this.props;
        onCancel && onCancel();
    };

    tokenIdChange = (value) => {
        let {currentWallet} = this.props;
        console.log('currentWallet====',currentWallet)
        // let secTokenIdArr =  _.filter(allowExchange,{"first_token_id":value});
        let tokenBalances =  _.find(currentWallet.tokenBalances,{"name":value});
        // let secTokenBalances =  _.find(currentWallet.tokenBalances,{"name":secTokenIdArr[0].second_token_id});

        this.setState({
            tokenId: value,
            tokenBalances:tokenBalances
        },() =>{

        });
    }



    render() {
        let {exchange,inject} = this.props;
        let exchangeToken = [];
        let firstTokenId = exchange.first_token_id == "_"? "TRX":exchange.first_token_id;
        let secondTokenId = exchange.second_token_id == "_"? "TRX":exchange.second_token_id
        exchangeToken.push(firstTokenId)
        exchangeToken.push(secondTokenId)
        let {modal, tokenId,tokenQuant, disabled} = this.state;
       // let [isValid, errorMessage] = this.isValid();

        if (modal) {
            return modal;
        }

        return (
            <Modal isOpen={true} toggle={this.cancel} fade={false} size="md" className="modal-dialog-centered">
                <ModalHeader className="text-center" toggle={this.cancel}>
                    {/*<i className="fa fa-plus-square"></i>*/}
                    {/*&nbsp;*/}
                    {/*{tu("创建交易对")}*/}
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-12">
                            <label>{tu("选择您想要注资的通证：")}</label>
                            <select className="custom-select"
                                    value={tokenId}
                                    onChange={(e) => {this.tokenIdChange(e.target.value)}}
                            >
                                {
                                    tokenId?"":<option value=''>{t("请选择通证名称")}</option>
                                }
                                {
                                    exchangeToken.map((token, index) => {
                                        return (
                                            <option key={index} value={token}>{token}</option>
                                        )
                                    })
                                }
                            </select>
                            {/*<div className="invalid-feedback text-center text-danger">*/}
                                {/*{errorMessage}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-12">
                            <label>{tu("注资金额")}</label>
                            <input className="form-control"
                                   type="number"
                                   placeholder="Account Name"
                                   value={tokenQuant}
                                   onInput={(ev) => this.setState({tokenQuant: ev.target.value})}/>
                            {/*<div className="invalid-feedback text-center text-danger">*/}
                                {/*{errorMessage}*/}
                            {/*</div>*/}
                        </div>
                    </div>
                    <div className="pt-4">
                        <p className="text-center">
                            {
                                inject?
                                    <button
                                        // disabled={disabled || !isValid}
                                        className="btn btn-danger"
                                        style={{width:'100%'}}
                                        onClick={this.inject}>{tu("注资")}</button>:
                                    <button
                                        // disabled={disabled || !isValid}
                                        className="btn btn-danger"
                                        style={{width:'100%'}}
                                        onClick={this.withdraw}>{tu("撤资")}</button>
                            }

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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(OperateTxnPairModal))

