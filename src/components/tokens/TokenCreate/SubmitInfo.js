import React, {Component, Fragment, PureComponent} from 'react';
import {connect} from "react-redux";
import {loadTokens} from "../../../actions/tokens";
import {login} from "../../../actions/app";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {Link} from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import 'moment/min/locales';
import ContractCodeRequest from "../../tools/ContractCodeRequest";
import moment from 'moment';
import Lockr from "lockr";
import {filter, trim} from "lodash";
import {Client} from "../../../services/api";
import {withTronWeb} from "../../../utils/tronWeb";
import {transactionResultManager} from "../../../utils/tron";
import {t, tu} from "../../../utils/i18n";
import {TronLoader} from "../../common/loaders";
import {API_URL, ASSET_ISSUE_COST, ONE_TRX} from "../../../constants";

import {
    Form, Row, Col, Input, Button, Icon,
} from 'antd';

const { TextArea } = Input;

@withTronWeb


 class SubmitInfo extends Component {

    constructor(props) {
        super(props);
        console.log('this.props.state',this.props.state)
        this.state = {
            ...this.props.state,
            captcha_code:null,
            checkbox: false,
            errors: {
                confirm: null
            }
        };

    }

    componentDidMount() {
        //
    }

    ErrorLabel = (error) => {
        if (error !== null) {
            return (
                <small className="text-danger"> {error} </small>
            )
        }
        return null;
    }

    tokenState = (value) => {
        let {  paramData:{ token_name, token_abbr, token_introduction, website, token_supply, precision, author, token_amount, trx_amount, freeze_amount, freeze_date, freeze_type, participation_start_date, participation_end_date, participation_type  }} = this.state;
        let frozenSupplyAmount = freeze_amount * Math.pow(10,Number(precision))
        let frozenSupply =  [{amount: frozenSupplyAmount, days: freeze_date }];
        if( !participation_type ){
            participation_start_date = moment(new Date().getTime() + 60*1000)
            participation_end_date = moment(new Date().getTime() + 120*1000)
        }
        let orderState = {
            'name':token_name,
            'abbreviation':token_abbr,
            'description':token_introduction,
            'url':website,
            'totalSupply': token_supply * Math.pow(10, Number(precision)),
            'tokenRatio': token_amount * Math.pow(10, Number(precision)),
            'trxRatio': trx_amount * ONE_TRX,
            'saleStart': participation_start_date.valueOf(),
            'saleEnd': participation_end_date.valueOf(),
            'startTime': participation_start_date.toDate(),
            'endTime': participation_end_date.toDate(),
            'freeBandwidth': 0,
            'freeBandwidthLimit': 0,
            'frozenAmount': frozenSupplyAmount + 1,
            'frozenDuration': freeze_date + 1 ,
            //'frozenAmount': '',
            //'frozenDuration': '',
            'frozenSupply': filter(frozenSupply, fs => fs.amount > 0),
            'precision': Number(precision)
        }
        return orderState[value]
    }

    setSelect(type) {
        this.setState({type}, ()=> {
            this.props.nextState(this.state)
        })
    }

    handleCaptchaCode = (val) => {
        this.setState({captcha_code: val});
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    redirectToTokenList = () => {
        this.setState({
            modal: null,
        }, () => {
            window.location.hash = "#/tokens/list";
        });
    };

    //Confirm Token Issue
    confirmSubmit = () => {
        let {intl} = this.props;
        this.setState({
            modal: (
                <SweetAlert
                    info
                    showCancel
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="success"
                    cancelBtnText={intl.formatMessage({id: 'cancel'})}
                    cancelBtnBsStyle="default"
                    title={intl.formatMessage({id: 'confirm_token_issue'})}
                    onConfirm={this.createToken}
                    onCancel={this.hideModal}
                    //style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                </SweetAlert>)
        });
    };

    submit = () => {
        let newErrors = {
            confirm: null,
        };
        let {checkbox} = this.state;
        let {intl} = this.props;
        if (checkbox)
            this.confirmSubmit();
        else {
            newErrors.confirm = intl.formatMessage({id: 'tick_checkbox'});
            this.setState({errors: newErrors});
        }
    }

    createToken = async () => {
        let {account, intl} = this.props;
        console.log('account',account)
        let res,createInfo,errorInfo;
        const tronWebLedger = this.props.tronWeb();
        const { tronWeb } = this.props.account;
        this.setState({
            modal:
                <SweetAlert
                    showConfirm={false}
                    showCancel={false}
                    cancelBtnBsStyle="default"
                    title={intl.formatMessage({id: 'in_progress'})}
                    //style={{marginLeft: '-240px', marginTop: '-195px', width: '450px', height: '300px'}}
                >
                    <TronLoader/>
                </SweetAlert>,
            loading: true
        });
        console.log('frozenSupply=======',this.tokenState('frozenSupply'))
        console.log('description=======',typeof this.tokenState('description'))
        console.log('startTime=======',this.tokenState('startTime'))
        console.log('endTime======',this.tokenState('endTime'))
        if (Lockr.get("islogin")||this.props.walletType.type==="ACCOUNT_LEDGER"||this.props.walletType.type==="ACCOUNT_TRONLINK") {
            if (this.props.walletType.type === "ACCOUNT_LEDGER") {
                const unSignTransaction = await tronWebLedger.transactionBuilder.createToken({
                    name: this.tokenState('name'),
                    abbreviation: this.tokenState('abbreviation'),
                    description: this.tokenState('description'),
                    url: this.tokenState('url'),
                    totalSupply: this.tokenState('totalSupply'),
                    tokenRatio: this.tokenState('tokenRatio'),
                    trxRatio: this.tokenState('trxRatio'),
                    saleStart: this.tokenState('saleStart'),
                    saleEnd: this.tokenState('saleEnd'),
                    freeBandwidth: 1,
                    freeBandwidthLimit: 1,
                    frozenAmount: this.tokenState('frozenAmount'),
                    frozenDuration: this.tokenState('frozenDuration'),
                    precision:  this.tokenState('precision'),
                }, tronWebLedger.defaultAddress.hex).catch(function (e) {
                    errorInfo = e;
                })
                if (!unSignTransaction) {
                    res = false;
                } else {
                    const {result} = await transactionResultManager(unSignTransaction, tronWebLedger);
                    res = result;
                }
            }

            if(this.props.walletType.type === "ACCOUNT_TRONLINK"){
                const unSignTransaction = await tronWeb.transactionBuilder.createToken({
                    name: this.tokenState('name'),
                    abbreviation: this.tokenState('abbreviation'),
                    description: this.tokenState('description'),
                    url: this.tokenState('url'),
                    totalSupply: this.tokenState('totalSupply'),
                    tokenRatio: this.tokenState('tokenRatio'),
                    trxRatio: this.tokenState('trxRatio'),
                    saleStart: this.tokenState('saleStart'),
                    saleEnd: this.tokenState('saleEnd'),
                    freeBandwidth: 1,
                    freeBandwidthLimit: 1,
                    frozenAmount: this.tokenState('frozenAmount'),
                    frozenDuration: this.tokenState('frozenDuration'),
                    precision:  this.tokenState('precision'),
                }, tronWeb.defaultAddress.hex).catch(function (e) {
                    errorInfo = e.indexOf(':')?e.split(':')[1]:e
                })
                if (!unSignTransaction) {
                    res = false;
                } else {
                    const {result} = await transactionResultManager(unSignTransaction, tronWeb);
                    res = result;
                }
            }

        }else {

            createInfo = await Client.createToken({
                address: account.address,
                name: this.tokenState('name'),
                shortName: this.tokenState('abbreviation'),
                description: this.tokenState('description'),
                url: this.tokenState('url'),
                totalSupply: this.tokenState('totalSupply'),
                num: this.tokenState('tokenRatio'),
                trxNum: this.tokenState('trxRatio'),
                startTime: this.tokenState('startTime'),
                endTime: this.tokenState('endTime'),
                frozenSupply: this.tokenState('frozenSupply'),
                precision:  this.tokenState('precision'),
            })(account.key);
            res = createInfo.success;
            errorInfo = createInfo.message.indexOf(':')?createInfo.message.split(':')[1]:createInfo.message;
        }
        this.setState({
            res,
            errorInfo
        },() => {
            this.props.nextState({res, errorInfo})
            this.props.nextStep(3)
        });
    };

    render() {
        let {intl, nextStep} = this.props;
        let {modal, checkbox, errors, captcha_code, type, paramData:{ token_name, token_abbr, token_introduction, token_supply, precision, author, token_amount, trx_amount, freeze_amount, freeze_date, freeze_type, participation_start_date, participation_end_date, participation_type, website  }} = this.state;
        const isTrc10 = type === 'trc10'
        const isTrc20 = type === 'trc20'
        let startTime =  participation_start_date.valueOf();
        let endTime = participation_end_date.valueOf();

        console.log('startTime6666',startTime)
        console.log('endTime6666',endTime)
        return (
            <main className="token-submit">
                {modal}
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
                            <label>{tu('token_description')}</label>
                            <p  className="border-dashed-textarea">
                                <TextArea autosize={{ minRows: 4, maxRows: 6 }}
                                          disabled={true}
                                          defaultValue={token_introduction}
                                />
                            </p>
                        </Col>
                        <Col span={24} md={12}>
                            <label>{tu('total_supply')}</label>
                            <p className="border-dashed">
                                <FormattedNumber value={token_supply}/>
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
                        <Col span={24} md={12}>
                            <label>{tu('issuer')}</label>
                            <p className="border-dashed">
                                {author}
                            </p>
                        </Col>
                    </Row>
                    <Row type="flex"  gutter={64}>
                        <Col span={24} md={12} className={ isTrc20? 'd-block': 'd-none'}>
                            <label>{tu('token_logo')}</label>
                            <p className="border-dashed"></p>
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
                <section className="mt-4">
                    <div className="form-check d-flex">
                        <input type="checkbox" className="form-check-input" value={checkbox}
                               onChange={(e) => {
                                   this.setState({checkbox: e.target.checked, errors: {confirm: null}})
                               }}/>
                        <label className="form-check-label">
                            {tu("token_spend_confirm")}
                        </label>
                    </div>
                    {this.ErrorLabel(errors.confirm)}
                </section>
                <section className="text-right px-2">
                    <button className="btn btn-default btn-lg" onClick={() => nextStep(1)}>{tu('trc20_token_return')}</button>
                    <button className="ml-4 btn btn-danger btn-lg" htmltype="submit" disabled={captcha_code} onClick={this.submit}>{tu('submit')}</button>
                </section>
            </main>
        )
    } 
}

function mapStateToProps(state) {
    return {
        activeLanguage: state.app.activeLanguage,
        tokens: state.tokens.tokens,
        account: state.app.account,
        walletType: state.app.wallet,
        wallet: state.wallet.current,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {
    login,
    loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SubmitInfo));

