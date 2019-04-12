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

export class SubmitInfo extends Component {

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
                    div
                </div>
                <div className="result-success">

                </div>
            </main>
        )
    }
}


export default injectIntl(SubmitInfo);
