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
        console.log('this.props.state',this.props.state)
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
                str = '通证名称或者简称涉及敏感词'
            break;
            case "2":
                str = '通证名称或者简称与合约里定义的不符'
            break;
            case "3":
                str = '发行总量与合约里的totalsupply不符'
            break;
            case "4":
                str = '合约代码含有assert，不通过'
            break;
            case "5":
                str = '通证精度与合约里定义的不符'
            break;
            case "6":
                str = '签名验证失败'
            break;
            case "7":
                str = '数据过期'
            break;
            case "8":
                str = '合约已经录入'
                break;
            case "9":
                str = '参数校验未通过'
            break;
            default:
                str = error;
            break;
        }
        return str

    }

    render() {
        let { intl } = this.props;
        let { type, res, errorInfo } = this.state;
        console.log('errorInfo2222',errorInfo)
        console.log('type',type)
        return (
            <main className="token-result">
                {
                    !res? <div className="result-failure">
                        <img src={require("../../../images/token/result_failure.png")} alt=""/>
                        <h5>{tu('token_input_failure')}</h5>
                        <div className="mt-3 d-flex failure-reason">
                            <span>{tu('token_input_failure_reason')}</span>
                            <div>
                                <p>1.{this.setErrorMsg(errorInfo)}</p>
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <button className="btn btn-default btn-lg" onClick={this.goToTokensList}>{tu('token_input_failure_no_submit')}</button>
                            <button className="ml-4 btn btn-danger btn-lg" onClick={this.againInput}>{tu('token_input_failure_submit')}</button>
                        </div>
                    </div>
                        :
                    <div className="result-success">
                        <img src={require("../../../images/token/result_success.png")} alt=""/>
                        <h5>{tu('token_input_success')}</h5>
                        <p className="mytoken result-success-info">
                            {tu('token_input_success_you_can')}
                            <span className="mytoken-wallet">{tu('token_input_success_wallet')}</span>
                            ->
                            <span className="mytoken-wallet">{tu('token_input_success_find_it')}</span>
                        </p>
                        <p className="result-success-info">
                            {tu('token_input_success_tip')}
                        </p>
                        <p className="mt-4 submit-market">
                            {tu('token_input_success_trx_market')}
                            {tu('token_input_success_trx_market_input')}
                        </p>
                    </div>
                }


            </main>
        )
    }
}


export default injectIntl(resultInfo);
