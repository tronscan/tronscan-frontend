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
        console.log('this.props.state',this.props.state)
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

    handleCaptchaCode = (val) => {
        this.setState({captcha_code: val});
    }



    render() {
        let {intl} = this.props
        return (
            <main className="token-submit">
                <section>
                    <h4 className="mb-3">{tu('basic_info')}</h4>
                    <hr/>
                    <Row type="flex" gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('name_of_the_token')}</label>
                            <p className="border-dashed">
                                AGgdsaddD5D5D5D5D5D5D5D5D5
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('token_abbr')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('token_description')} {tu('description')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('total_supply')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('TRC20_decimals')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('token_logo')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('issuer')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>

                </section>
                <section className="mt-4">
                    <h4 className="mb-3">{tu('contract_info')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('trc20_token_info_Contract_Address')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('contract_created_date')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('contract_code')}</label>
                            <TextArea rows={4}
                             disabled={true}
                             defaultValue="合约代码合约代码合约代码合约代码"
                            />
                        </Col>
                    </Row>
                </section>
                <section className="mt-4">
                    <h4 className="mb-3">{tu('social_info')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('trc20_token_info_Website')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('email')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('whitepaper_address')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('social_link')}</label>
                        </Col>
                    </Row>
                    <hr/>
                    <div className="mt-4">
                        <ContractCodeRequest  handleCaptchaCode={this.handleCaptchaCode} />
                    </div>
                    {/*<form action="?" method="POST">*/}
                        {/*<div className="g-recaptcha" data-sitekey="6LeaxJ0UAAAAAFEa6VoFNWWD6jJSiwWOYnlbqn3G"></div>*/}
                        {/*<br/>*/}
                        {/*<input type="submit" value="Submit" />*/}
                    {/*</form>*/}
                </section>
                <section className="text-right px-2">
                    <button className="btn btn-default btn-lg">{tu('trc20_token_return')}</button>
                    <button className="ml-4 btn btn-danger btn-lg" htmltype="submit">{tu('submit')}</button>
                </section>
            </main>
        )
    } 
}


export default injectIntl(SubmitInfo);
