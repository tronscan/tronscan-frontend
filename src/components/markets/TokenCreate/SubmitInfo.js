import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadTokens } from '../../../actions/tokens';
import { login } from '../../../actions/app';
import { FormattedNumber, injectIntl } from 'react-intl';
import SweetAlert from 'react-bootstrap-sweetalert';
import 'moment/min/locales';
import ContractCodeRequest from '../../tools/ContractCodeRequest';
import Lockr from 'lockr';
import _ from 'lodash';
import { tu } from '../../../utils/i18n';
import { API_URL, MARKET_API_URL, FROMID } from '../../../constants';
import { TRXPrice } from './../../common/Price';
import xhr from 'axios/index';
import { jsencrypt } from './../../../utils/jsencrypt';

import { Row, Col, Input } from 'antd';

const { TextArea } = Input;

class SubmitInfo extends Component {

    constructor(props) {

        super(props);
        this.state = {
            ...this.props.state,
            captcha_code:null,
            checkbox: false,
            loading:false,
            errors: {
                confirm: null
            }
        };

    }

    componentDidMount() {
        this.props.nextState({ leave_lock: true });
    }

    handleCaptchaCode = (val) => {
        this.setState({ captcha_code: val });
    };

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    /**
     * Confirm Token Issue
     */
    confirmSubmit = () => {
        let { intl } = this.props;
        this.setState({
            modal: (<SweetAlert
                info
                showCancel
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="success"
                cancelBtnText={intl.formatMessage({ id: 'cancel' })}
                cancelBtnBsStyle="default"
                title={intl.formatMessage({ id: 'confirm_token_issue' })}
                onConfirm={this.submit}
                onCancel={this.hideModal}
            ></SweetAlert>)
        });
    };

    /**
     * form submit
     */
    submit = async() => {
        let { account } = this.props;
        let { type, isUpdate } = this.state;

        if (account.isLoggedIn){
            const { paramData, updateId  } = this.state;
            const { tokenName, tokenSymbol, totalSupply, circulation, tokenId, tokenAddress,
                ownerAddress, description, logo, fprice, sprice, home_page,
                email, isInOtherMarket, tokenIssScheme, white_paper, contractCodeUrl, reddit,
                icoAddress, teamInfo, coinMarketCapUrl } = paramData;
            const tokenOtherInfo = {
                home_page,
                email,
                isInOtherMarket,
                tokenIssScheme,
                white_paper,
                contractCodeUrl,
                reddit,
                icoAddress,
                teamInfo,
                coinMarketCapUrl
            };
            let basiInfo = {
                tokenType: type,
                tokenName,
                tokenSymbol: tokenSymbol,
                totalSupply: Number(totalSupply),
                circulation: Number(circulation),
                ownerAddress,
                description,
                logo,
                exchangePair: `${tokenSymbol.toUpperCase()}/TRX`,
                fprice: Number(fprice),
                sprice: Number(sprice),
            };

            basiInfo = type === 'trc10' ? Object.assign(basiInfo, { tokenId }) : Object.assign(basiInfo, { tokenAddress });

            const infoData = {
                id: updateId,
                tokenOtherInfo,
                fromId: FROMID
            };

            const isSubmit = await this.setBodyParameter();

            if (!isSubmit) {
                return false;
            }
            const tokenIdOrAddress = type === 'trc10' ? tokenId : tokenAddress;
            if (isUpdate) {
                this.updateToken({ data: jsencrypt(JSON.stringify(infoData)) }, tokenIdOrAddress);
            } else {
                this.createToken({ data: jsencrypt(JSON.stringify({...infoData, ...basiInfo})) }, tokenIdOrAddress);
            }
        }
    }

    /**
     * signature
     */
    setBodyParameter = async(file) => {
        const { tronWeb } = this.props.account;
        const { paramData: { ownerAddress, tokenId }, type } = this.state;
        const data  = {
            issuer_addr: ownerAddress,
            id: tokenId,
            type,
        };
        const hash = tronWeb.toHex(JSON.stringify(data), false);
        const sig = await tronWeb.trx.sign(hash);
        if (!sig) {
            return false;
        }

        return true;
    }

    /**
     * create market token
     */
    createToken = async(infoData, tokenId) => {
        const { data: { msg, data = {} } } = await xhr.post(`${MARKET_API_URL}/api/token/addBasicInfo`, infoData);
        const { id } = data;

        this.setState({
            id,
            msg,
        },() => {
            Lockr.rm('TokenLogo');
            this.props.nextState({
                msg,
                id,
                tokenId,
            });
            this.props.nextStep(2);
        });
    };

    /**
     * update market token
     */
    updateToken = async(infoData, tokenId) => {

        const { updateId  } = this.state;

        const { data: { msg, code, data } } = await xhr.post(`${MARKET_API_URL}/api/token/updateBasicInfo`, infoData);
        this.setState({
            id: code === 200 && data && updateId,
            msg,
        },() => {
            this.props.nextState({
                msg,
                id: code === 200 && data && updateId,
                tokenId,
            });
            this.props.nextStep(2);
        });
    };

    render() {
        let { nextStep } = this.props;
        let { modal, type, captcha_code,
            paramData:{ tokenName, tokenSymbol, tokenId, tokenAddress, totalSupply, circulation,
                ownerAddress, description, logo, fprice, sprice,
                home_page, email, isInOtherMarket, tokenIssScheme, white_paper,
                contractCodeUrl, reddit, icoAddress, teamInfo, coinMarketCapUrl } } = this.state;
        const isTrc10 = type === 'trc10';
       // logo =  Lockr.get('TokenLogo', logo);
        
        // token information
        const tokenInfoItem = (
            <section>
                <h4 className="mb-3">{tu('token_information')}</h4>
                <hr/>
                <Row type="flex" gutter={64}>
                    <Col span={24} md={12}>
                        <label>{tu('name_of_the_token')}</label>
                        <p className="border-dashed">
                            {tokenName}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('token_abbreviation')}</label>
                        <p className="border-dashed">
                            {tokenSymbol}
                        </p>
                    </Col>
                </Row>
                <Row type="flex"  gutter={64}>
                    <Col span={24} md={12}>
                        <label>{tu('total_circulation')}</label>
                        <p className="border-dashed">
                            <FormattedNumber value={totalSupply}/>
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('token_circulation')}</label>
                        <p className="border-dashed">
                            <FormattedNumber value={circulation}/>
                        </p>
                    </Col>
                </Row>
                <Row type="flex"  gutter={64}>
                    <Col span={24} md={12}>
                        <label>{tu('issuer_address')}</label>
                        <p className="border-dashed">
                            {ownerAddress}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{isTrc10?tu('Token ID'):tu('contract_address')}</label>
                        <p className="border-dashed">
                            {isTrc10 ? tokenId : tokenAddress}
                        </p>
                    </Col>
                </Row>
                <Row type="flex"  gutter={64}>
                    <Col span={24} md={12}>
                        <label>{tu('token_description')}</label>
                        <p  className="border-dashed-textarea">
                            <TextArea autosize={{ minRows: 4, maxRows: 6 }}
                                disabled={true}
                                defaultValue={description}
                            />
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('token_logo')}</label>
                        <img className="d-block mt-2" src={logo} alt="" width={100} height={100}/>
                    </Col>
                </Row>
            </section>
        );

        // trading information
        const tradingInfo = (
            <section className="d-block mt-4">
                <h4 className="mb-3">{tu('pair_message')}</h4>
                <hr/>
                <Row type="flex"  gutter={64}>
                    <Col span={24} md={24}>
                        <div className="pair-box">
                            <label>{tu('pair_trading')}</label>
                            <p className="pair">TRX</p>
                        </div>
                    </Col>
                    <Col span={24} md={24}>
                        <label>{tu('token_price')}</label>
                        <p className="border-dashed">
                            {fprice} {tokenSymbol}  = {sprice} TRX
                            <span className="ml-4">
                                TRX{tu('trc20_last_price')}: <TRXPrice amount={1} currency="USD"/>
                            </span>
                        </p>
                    </Col>
                </Row>
            </section>
        );

        // other information
        const otherInfo = (
            <section className="mt-4">
                <h4 className="mb-3">{tu('other_info')}</h4>
                <hr/>
                <Row type="flex"  gutter={64}>
                    <Col span={24} md={12}>
                        <label>{tu('project_website')}</label>
                        <p className="border-dashed">
                            {home_page}
                        </p>
                    </Col>
                    {<Col span={24} md={12}>
                        <label>{tu('contact_email')}</label>
                        <p className="border-dashed">
                            {email}
                        </p>
                    </Col>}

                </Row>
                <Row type="flex" gutter={64} className="d-flex">
                    <Col span={24} md={12}>
                        <label>{tu('other_exchanges')}</label>
                        <p className="border-dashed">
                            {isInOtherMarket}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('token_scheme')}</label>
                        <p className="border-dashed">
                            {tokenIssScheme}
                        </p>
                    </Col>
                </Row>
                <Row type="flex" gutter={64} className="d-flex">
                    <Col span={24} md={12}>
                        <label>{tu('whitepaper_address')}</label>
                        <p className="border-dashed">
                            {white_paper}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('constract_code_link')}</label>
                        <p className="border-dashed">
                            {contractCodeUrl}
                        </p>
                    </Col>
                </Row>
                <Row type="flex" gutter={64} className="d-flex">
                    <Col span={24} md={12}>
                        <label>{tu('reddit_account')}</label>
                        <p className="border-dashed">
                            {reddit}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('ico_address')}</label>
                        <p className="border-dashed">
                            {icoAddress}
                        </p>
                    </Col>
                </Row>
                <Row type="flex" gutter={64} className="d-flex">
                    <Col span={24} md={12}>
                        <label>{tu('team_info')}</label>
                        <p className="border-dashed">
                            {teamInfo}
                        </p>
                    </Col>
                    <Col span={24} md={12}>
                        <label>{tu('coin_market_cap')}</label>
                        <p className="border-dashed">
                            {coinMarketCapUrl}
                        </p>
                    </Col>
                </Row>
            </section>
        );

        return (
            <main className="token-submit">
                {modal}
                {tokenInfoItem}
                {tradingInfo}
                {otherInfo}

                <section>
                    <div className="mt-4">
                        <ContractCodeRequest handleCaptchaCode={this.handleCaptchaCode} />
                    </div>
                </section>
                <section className="text-right px-2" >
                    <button className="btn btn-default btn-lg" onClick={() => nextStep(0)}>{tu('prev_step')}</button>
                    <button className="ml-4 btn btn-danger btn-lg" htmltype="submit"
                        disabled={!captcha_code}
                        onClick={this.confirmSubmit}>{tu('submit')}</button>
                </section>
            </main>
        );
    }
}

function mapStateToProps(state) {
    return {
        account: state.app.account,
    };
}

const mapDispatchToProps = {
    login,
    loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(SubmitInfo));
