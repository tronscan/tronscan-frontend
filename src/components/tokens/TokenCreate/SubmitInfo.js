import React, {Component, Fragment, PureComponent} from 'react';
import {t, tu} from "../../../utils/i18n";
import {connect} from "react-redux";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import 'moment/min/locales';
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import moment from 'moment';
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
        let {intl, nextStep} = this.props;
        let { type, paramData:{ token_name, token_abbr, token_introduction, token_supply, precision, author, token_amount, trx_amount, freeze_amount, freeze_date, freeze_type, participation_start_date, participation_end_date, participation_type, website  }} = this.state;
        const isTrc10 = type === 'trc10'
        const isTrc20 = type === 'trc20'
        let startTime =  participation_start_date.valueOf();
        let endTime = participation_end_date.valueOf();
        return (
            <main className="token-submit">
                <section>
                    <h4 className="mb-3">{tu('basic_info')}</h4>
                    <hr/>
                    <Row type="flex" gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('name_of_the_token')}</label>
                            <p className="border-dashed">
                                {token_name}
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('token_abbr')}</label>
                            <p className="border-dashed">
                                {token_abbr}
                            </p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('token_description')} {tu('description')}</label>
                            <p className="border-dashed">
                                {token_introduction}
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('total_supply')}</label>
                            <p className="border-dashed">
                                {token_supply}
                            </p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('TRC20_decimals')}</label>
                            <p className="border-dashed">
                                {precision}
                            </p>
                        </Col>
                        <Col span={24} md={12} className={ isTrc20? 'd-block': 'd-none'}>
                            <label>{tu('token_logo')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('issuer')}</label>
                            <p className="border-dashed">
                                {author}
                            </p>
                        </Col>
                    </Row>

                </section>
                <section className={ isTrc20? 'd-block mt-4': 'd-none'}>
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
                <section className={ isTrc10? 'd-block mt-4': 'd-none'}>
                    <h4 className="mb-3">{tu('price_info')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu("token_price")}</label>
                            <p className="border-dashed">
                                  {token_amount} {token_abbr}  = {trx_amount} TRX
                            </p>
                        </Col>

                        <Col span={24} md={12}>
                            <label>{tu("participation")}</label>
                            <p className="border-dashed">
                                {

                                    !participation_type?<span>{tu("start_date")}:  <span> - </span> &nbsp;&nbsp; {tu("end_date")}:  <span> - </span></span>
                                    :<span>{tu("start_date")}: <FormattedDate value={startTime}/> &nbsp;&nbsp; {tu("end_date")}:  <FormattedDate value={endTime}/> </span>
                                }
                            </p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu("frozen_supply")}</label>
                            <p className="border-dashed">
                                {
                                    freeze_type? <span> {tu("amount")}: {freeze_amount}  {tu("days_to_freeze")} {freeze_date}</span>
                                        :<span>{tu("freeze_not_valid")}</span>

                                }
                            </p>
                        </Col>
                    </Row>
                </section>
                <section className="mt-4">
                    <h4 className="mb-3">{tu('social_info')}</h4>
                    <hr/>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12}>
                            <label>{tu('trc20_token_info_Website')}</label>
                            <p className="border-dashed">
                                {website}
                            </p>
                        </Col>
                        <Col span={24} md={12} className={ isTrc20? 'd-block': 'd-none'}>
                            <label>{tu('email')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex" className={ isTrc20? 'd-block': 'd-none'}>
                        <Col span={24} md={24}>
                            <label>{tu('whitepaper_address')}</label>
                            <p className="border-dashed"></p>
                        </Col>
                    </Row>
                    <Row type="flex" className={ isTrc20? 'd-block': 'd-none'}>
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
                    <button className="btn btn-default btn-lg" onClick={() => nextStep(1)}>{tu('trc20_token_return')}</button>
                    <button className="ml-4 btn btn-danger btn-lg" htmltype="submit">{tu('submit')}</button>
                </section>
            </main>
        )
    } 
}


export default injectIntl(SubmitInfo);
