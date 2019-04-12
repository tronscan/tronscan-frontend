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
                            <label>{tu('通证简称')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('通证简介')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('发行总量')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('精度')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('logo')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('发行者')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>

                </section>
                <section className="mt-4">
                    <h4 className="mb-3">{tu('合约信息')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('合约地址')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('合约创建日期')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('合约代码')}</label>
                            <TextArea rows={4}
                             disabled={true}
                             defaultValue="合约代码合约代码合约代码合约代码"
                            />
                        </Col>
                    </Row>
                </section>
                <section className="mt-4">
                    <h4 className="mb-3">{tu('社交信息')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('官网')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('邮箱')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('白皮书地址')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex">
                        <Col span={24} md={24}>
                            <label>{tu('社交媒体链接')}</label>
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
                    <button className="btn btn-default btn-lg">{tu('返回')}</button>
                    <button className="ml-4 btn btn-danger btn-lg" htmltype="submit">{tu('submit')}</button>
                </section>
            </main>
        )
    } 
}


export default injectIntl(SubmitInfo);
