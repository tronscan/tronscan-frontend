import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t,option_t} from "../../utils/i18n";
import {ONE_TRX} from "../../constants";
import {reloadWallet} from "../../actions/wallet";
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
            firstTokenBalance:"",
            secondTokenBalance:"",
            firstTokenAmount:"",
            secTokenAmount:"",
            firstTokenPrecision:"",
        };
    }


    isValidFirstToken = () => {

        let {firstTokenBalances,firstTokenBalance} = this.state;
        if ( firstTokenBalance > firstTokenBalances) {
            return [false, tu("creat_valid")]

        }
        if(!/^([1-9][0-9]+|[1-9])$/.test(firstTokenBalance)){
            return [false, tu("operate_txn_pair_message")];
        }
        return [true];
    };
    isValidSecondToken = () => {
        let {secondTokenBalance} = this.state;
        const secTokenBalances = this.props.currentWallet.balance/1000000;
        if ( secondTokenBalance > secTokenBalances) {
            return [false, tu("creat_valid")]
        }else if(secondTokenBalance < this.props.dealPairTrxLimit){
            return [false, tu("create_deal_pair_input_tip")]
        }
        if(!/^([1-9][0-9]+|[1-9])$/.test(secondTokenBalance)){
            return [false, tu("isValidSecondToken")];
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
        let {firstTokenId, secondTokenId, firstTokenBalance, secondTokenBalance,firstTokenPrecision} = this.state;
        let firstTokenBalanceNum =  Math.ceil(parseFloat(firstTokenBalance) * Math.pow(10,firstTokenPrecision))
        let secondTokenBalanceNum = (parseFloat(secondTokenBalance)) * ONE_TRX;
        onCreate && onCreate(firstTokenId,secondTokenId,firstTokenBalanceNum,secondTokenBalanceNum);
        this.setState({disabled: true});
    };

    cancel = () => {
        let {onCancel} = this.props;
        onCancel && onCancel();
    };

    firstTokenIdChange = (value) => {
        let {account,currentWallet} = this.props;
        let {allowExchange} = this.state;
        let secTokenIdArr =  _.filter(allowExchange,{"map_token_id":value});
        let firstTokenBalances =  _.find(currentWallet.tokenBalances,{"map_token_id":value});
        let secTokenBalances =  _.find(currentWallet.tokenBalances,{"map_token_name":"TRX"});
        this.setState({
            firstTokenId: value,
            secondTokenId:"_",
            secTokenIdArr:secTokenIdArr,
            firstTokenBalances:firstTokenBalances?firstTokenBalances.balance:0,
            secTokenBalances:secTokenBalances?secTokenBalances.balance:0,
            firstTokenAmount:firstTokenBalances?firstTokenBalances.map_amount:0,
            secTokenAmount:secTokenBalances?secTokenBalances.map_amount:0,
            firstTokenPrecision:firstTokenBalances.map_token_precision,
        },() =>{

        });
    }

    secondTokenIdChange = (value) => {
        let {currentWallet} = this.props;
        let secTokenBalances =  _.find(currentWallet.tokenBalances,{"name":value});
        this.setState({
            secondTokenId: value,
            secTokenBalances:secTokenBalances.balance
        },() =>{

        });
    }

    exchangeToken(){
        let {currentWallet} = this.props;
        // let allowExchange =   _.filter(currentWallet.allowExchange, function(o){
        //     let block = true
        //     currentWallet.exchanges.forEach(item => {
        //         if((o.first_token_id == (item.first_token_id == "_"?"TRX":item.first_token_id)) && o.second_token_id == (item.second_token_id == "_"?"TRX":item.second_token_id)){
        //             block = false
        //         }
        //     })
        //     return block
        // })
        let allowExchange = currentWallet.tokenBalances.filter(v=>{
            if(v.balance > 0 && v.name !== '_'){
                return v;
            }
        });
        this.setState({
            allowExchange: allowExchange
        },() =>{

        });


    }
    componentDidMount() {
        this.exchangeToken()
    }




    render() {
        let {currentWallet,intl} = this.props;
        let {modal, firstTokenId, secTokenIdArr,secondTokenId,firstTokenBalances,secTokenBalances,firstTokenBalance,secondTokenBalance,allowExchange, disabled,firstTokenAmount,secTokenAmount} = this.state;
        let [isValid, errorMessageFirstToken] = this.isValidFirstToken();
        let [isValid2, errorMessageSecondToken] = this.isValidSecondToken();
        if (modal) {
            return modal;
        }
        return (
            <Modal isOpen={true} toggle={this.cancel} fade={false} size="md" className="modal-dialog-centered">
                <ModalHeader className="text-center" toggle={this.cancel}>
                    <div>
                    <i className="fa fa-plus-square"></i>
                    &nbsp;
                    {tu("create_trading_pairs")}
                    </div>
                    {tu("create_deal_pair_input_tip2")}
                </ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-6">
                            <label>{tu("name_of_the_token")}</label>
                            <select className="custom-select"
                                value={firstTokenId}
                                onChange={(e) => {this.firstTokenIdChange(e.target.value)}}
                            >
                                {
                                    firstTokenId?"":option_t("select_the_name_of_the_Token")
                                }
                                {
                                    allowExchange.map((token, index) => {
                                        return (
                                            <option key={index} value={token.map_token_id}>
                                                {token.map_token_name}
                                                [ID:{token.map_token_id}]
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>{tu("balance")}
                                {
                                    firstTokenAmount>=0 ?<span>
                                     ({firstTokenAmount})
                                </span>:""
                                }
                            </label>
                            <input className={"form-control" + ((firstTokenBalance.length !== 0 && !isValid) ? " is-invalid" : "")}
                                   type="text"
                                   placeholder={intl.formatMessage({id: 'enter_the_amount'})}
                                   max={firstTokenBalances}
                                   defaultValue={firstTokenBalance}
                                   onInput={(ev) => this.setState({firstTokenBalance: ev.target.value})}
                            />
                            <div className="invalid-feedback text-left text-danger">
                                {errorMessageFirstToken}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-6">
                            <label>{tu("name_of_the_token")}</label>
                            <select className="custom-select"
                                value={secondTokenId}
                                onChange={(e) => {this.secondTokenIdChange(e.target.value)}}
                            >
                                {
                                    // !secTokenIdArr.length
                                    //     ?
                                    //     option_t("select_the_name_of_the_Token")
                                    //     :
                                    //     secTokenIdArr.map((token, index) => {
                                    //     return (
                                    //         <option key={index} value={token.second_token_id}>{token.second_token_id}</option>
                                    //     )
                                    // })
                                    <option value="TRX">TRX</option>
                                }
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label>
                                {tu("balance")}
                                {
                                    secTokenAmount >=0?<span>
                                    ({secTokenAmount})
                                </span>:""
                                }

                            </label>
                            <input className={"form-control" + ((secondTokenBalance.length !== 0 && !isValid2) ? " is-invalid" : "")}
                                   type="text"
                                   placeholder={intl.formatMessage({id: 'enter_the_amount'})}
                                   max={secTokenBalances}
                                   defaultValue={secondTokenBalance}
                                   onInput={(ev) => this.setState({secondTokenBalance: ev.target.value})}/>
                            <div className="invalid-feedback text-left text-danger">
                                {errorMessageSecondToken}
                            </div>
                        </div>
                    </div>
                    {
                        this.state.firstTokenId && this.state.firstTokenBalance && this.state.secondTokenBalance >= this.props.dealPairTrxLimit?
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    {tu('publish_price')}:<span>{this.state.firstTokenId}/TRX ≈ {(this.state.secondTokenBalance/this.state.firstTokenBalance).toFixed(6)}</span>
                                </div>
                            </div>
                            :
                            null
                    }
                    <div className="pt-4">
                        <p className="text-center">
                            <button
                                disabled={disabled || !isValid || !isValid2}
                                className="btn btn-danger"
                                style={{width:'100%'}}
                                onClick={this.create}>{tu("create_trading_pairs")}</button>
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

