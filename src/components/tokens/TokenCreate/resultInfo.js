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
                        <h5>{tu('token录入失败')}</h5>
                        <div className="mt-3 d-flex failure-reason">
                            <span>失败原因：</span>
                            <div>
                                <p>1.token名称涉及敏感信息</p>
                                <p>2.token名称涉及敏感信息</p>
                                <p>3.token名称涉及敏感信息</p>
                            </div>
                        </div>
                        <div className="d-flex mt-3">
                            <button className="btn btn-default btn-lg">{tu('暂不提交')}</button>
                            <button className="ml-4 btn btn-danger btn-lg">{tu('再次提交')}</button>
                        </div>
                    </div>
                        :
                    <div className="result-success">
                        <img src={require("../../../images/token/result_success.png")} alt=""/>
                        <h5>{tu('token录入成功')}</h5>
                        <p className="mytoken result-success-info">
                            {tu('你可以在')}
                            <span className="mytoken-wallet">{tu('钱包')}</span>
                            ->
                            <span className="mytoken-wallet">{tu('我发行的通证里找到它')}</span>
                        </p>
                        <p className="result-success-info">
                            {tu('录入成功的token可以在列表中找到wallet和tronlink会自动收录可以被搜索到')}
                        </p>
                        <p className="mt-4 submit-market">
                            {tu('再提交10项信息就可以录入trx.market')}
                            {tu('录入trx.market')}
                        </p>
                    </div>
                }


            </main>
        )
    }
}


export default injectIntl(resultInfo);
