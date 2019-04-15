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
            captcha_code:null,
            resultType:true
        };
    }

    componentDidMount() {}

    setSelect(type) {
        this.setState({type}, ()=> {
            this.props.nextState(this.state)
        })
    }


    render() {
        let { intl } = this.props;
        let { type, resultType } = this.state;
        console.log('type',type)
        return (
            <main className="token-result">
                {
                    !resultType? <div className="result-failure">
                        <img src={require("../../../images/token/result_failure.png")} alt=""/>
                        <h5>{tu('token_input_failure')}</h5>
                        <div className="mt-3 d-flex failure-reason">
                            <span></span>
                            <div>
                                <p>1.token名称涉及敏感信息</p>
                                <p>2.token名称涉及敏感信息</p>
                                <p>3.token名称涉及敏感信息</p>
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <button className="btn btn-default btn-lg">{tu('token_input_failure_no_submit')}</button>
                            <button className="ml-4 btn btn-danger btn-lg">{tu('token_input_failure_submit')}</button>
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
