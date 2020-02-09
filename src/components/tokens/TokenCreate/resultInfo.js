import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import {
    Form, Row, Col, Input, Button, Icon,
} from 'antd';

const { TextArea } = Input;

export class resultInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.props.state,
        };
    }

    componentDidMount() {}

    setSelect(type) {
        this.setState({type}, ()=> {
            this.props.nextState(this.state)
        })
    }

    againInput = () => {
        let res = '';
        let errorInfo = ''
        this.setState({
            res,
            errorInfo
        },() => {
            this.props.nextState({res, errorInfo})
            this.props.nextStep(1)
        });
    }

    goToTokensList = () => {
        window.location.hash = "#/tokens/list";
    }

    setErrorMsg = (error) =>{
        let str = ''
        switch (error) {
            case "1":
                str = 'str_1'
            break;
            case "2":
                str = 'str_2'
            break;
            case "3":
                str = 'str_3'
            break;
            case "4":
                str = 'str_4'
            break;
            case "5":
                str = 'str_5'
            break;
            case "6":
                str = 'str_6'
            break;
            case "7":
                str = 'str_7'
            break;
            case "8":
                str = 'str_8'
                break;
            case "9":
                str = 'str_9'
            break;
            default:
                str = error;
            break;
        }
        return str

    }

    render() {
        let { intl } = this.props;
        let { type, res, errorInfo, isUpdate } = this.state;
        return (
            <main className="token-result">
                {
                    !res? <div className="result-failure">
                        <img src={require("../../../images/token/result_failure.png")} alt=""/>
                        <h5>{!isUpdate? tu('token_input_failure'):tu('token_update_failure')}</h5>
                        <div className="mt-3 d-flex failure-reason">
                            {
                                errorInfo &&  <div className="d-flex">
                                    <span>{tu('token_input_failure_reason')}</span>
                                    <div>
                                        {
                                            (type == 'trc20' && errorInfo)|| (isUpdate && errorInfo)?errorInfo.map((item,index) => {
                                                    return <p key={index}>{index +1 }. {tu(this.setErrorMsg(item))}</p>
                                                }):
                                                <p>{errorInfo ? <span>1.{errorInfo}</span>:'' }</p>
                                        }

                                    </div>
                                </div>
                            }


                        </div>
                        <div className="d-flex mt-3">
                            <button className="btn btn-default btn-lg" onClick={this.goToTokensList}>{tu('token_input_failure_no_submit')}</button>
                            <button className="ml-4 btn btn-danger btn-lg" onClick={this.againInput}>{tu('token_input_failure_submit')}</button>
                        </div>
                    </div>
                        :
                    <div className="result-success">
                        <img src={require("../../../images/token/result_success.png")} alt=""/>
                        <h5>{!isUpdate? tu('token_input_success'): tu('token_update_success')}</h5>
                        <p className="mytoken result-success-info">
                            {tu('token_input_success_you_can')}
                            <span className="mytoken-wallet">{tu('token_input_success_wallet')}</span>
                            ->
                            <span className="mytoken-wallet">{tu('token_input_success_myaccount')}</span>
                            <span>{tu('token_input_success_find_it')}</span>
                        </p>
                        {/*<p className="result-success-info">*/}
                            {/*{tu('token_input_success_tip')}*/}
                        {/*</p>*/}
                        {/*<p className="mt-4 submit-market">*/}
                            {/*{tu('token_input_success_trx_market')}*/}
                        {/*</p>*/}
                    </div>
                }


            </main>
        )
    }
}


export default injectIntl(resultInfo);
