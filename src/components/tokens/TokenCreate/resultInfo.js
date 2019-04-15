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
        };
    }

    componentDidMount() {}

    setSelect(type) {
        this.setState({type}, ()=> {
            this.props.nextState(this.state)
        })
    }


    render() {
        let {intl} = this.props
        return (
            <main className="token-result">
                <div className="result-failure">
                    <img src={require("../../../images/arrow.png")} alt=""/>
                    <h5>{tu('token录入失败')}</h5>
                    <div>
                        <span>失败原因：</span>
                        <p>1.token名称涉及敏感信息</p>
                        <p>2.token名称涉及敏感信息</p>
                        <p>3.token名称涉及敏感信息</p>
                    </div>
                    <div className="d-flex mt-3">
                        <button className="btn btn-default btn-lg">{tu('暂不提交')}</button>
                        <button className="ml-4 btn btn-danger btn-lg">{tu('再次提交')}</button>
                    </div>
                </div>
                <div className="result-success">

                </div>
            </main>
        )
    }
}


export default injectIntl(resultInfo);
