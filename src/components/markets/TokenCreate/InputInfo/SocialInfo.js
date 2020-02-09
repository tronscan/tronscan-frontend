import React, { Component } from 'react';
import { tu } from '../../../../utils/i18n';
import { Form, Row, Col, Input } from 'antd';
import { URLREGEXP } from './../../../../constants';

export class SocialInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: null,
            ...this.props.state
        };
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { intl } = this.props;
        const { modal } = this.state;

        // project website item
        const projectWebsiteItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('project_website')}>
                    {getFieldDecorator('home_page', {
                        rules: [
                            { required: true, message: tu('no_url_error'), whitespace: true },
                            { pattern: URLREGEXP, message: tu('url_v_format'), whitespace: true },
                        ],
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'project_website' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // contact email item
        const contactEmailItem = (
            <Col  span={24} md={11} className='d-block'>
                <Form.Item label={tu('contact_email')}>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: tu('contact_email_v_required'), whitespace: true },
                            { type: 'email', message: tu('contact_email_v_format') }],
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'contact_email' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // other exchanges item
        const otherExchangesItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('other_exchanges')}>
                    {getFieldDecorator('isInOtherMarket', {
                        rules: [{ required: true, message: tu('other_exchanges_v_required'), whitespace: true }],
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'other_exchanges' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // token scheme item
        const tokenSchemeItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('token_scheme')}>
                    {getFieldDecorator('tokenIssScheme', {
                        rules: [{ required: true, message: tu('token_scheme_v_required'), whitespace: true }],
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'token_scheme' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // whitepaper address item
        const whitepaperAddressItem = (
            <Col span={24}  md={11} className='d-block'>
                <Form.Item label={tu('white_paper')}>
                    {getFieldDecorator('white_paper', {
                        rules: [
                            { pattern: URLREGEXP, message: tu('white_paper_v_format'), whitespace: true }
                        ]
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'whitepaper_address' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // constract code link item
        const constractCodeLinkItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('constract_code_link')}>
                    {getFieldDecorator('contractCodeUrl', {
                        rules: [
                            { pattern: URLREGEXP, message: tu('constract_code_link_v_format'), whitespace: true }
                        ]
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'constract_code_link' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // reddit account item
        const redditAccountItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('reddit_account')}>
                    {getFieldDecorator('reddit', {
                        rules: [
                            { pattern: URLREGEXP, message: tu('reddit_account_v_format'), whitespace: true }
                        ]
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'reddit_account' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // ico address item
        const icoAddressItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('ico_address')}>
                    {getFieldDecorator('icoAddress', {
                        rules: [
                            { pattern: URLREGEXP, message: tu('ico_address_v_format'), whitespace: true }
                        ]
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'ico_address' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // team info item
        const teamInfoItem = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('team_info')}>
                    {getFieldDecorator('teamInfo')(
                        <Input placeholder={intl.formatMessage({ id: 'team_info' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        // coin market cap item
        const coinMarketCap = (
            <Col  span={24} md={11}>
                <Form.Item label={tu('coin_market_cap')}>
                    {getFieldDecorator('coinMarketCapUrl', {
                        rules: [
                            { pattern: URLREGEXP, message: tu('coin_market_v_format'), whitespace: true }
                        ]
                    })(
                        <Input placeholder={intl.formatMessage({ id: 'coin_market_cap' })}/>
                    )}
                </Form.Item>
            </Col>
        );

        return (
            <div>
                <div>
                    <h4 className="mb-3">{tu('other_info')}</h4>
                    <hr/>
                    <Row gutter={24} type="flex" justify="space-between" className="px-2">
                        {projectWebsiteItem}
                        {contactEmailItem}
                        {otherExchangesItem}
                        {tokenSchemeItem}
                        {whitepaperAddressItem}
                        {constractCodeLinkItem}
                        {redditAccountItem}
                        {icoAddressItem}
                        {teamInfoItem}
                        {coinMarketCap}
                    </Row>
                </div>
                {modal}
            </div>
        );
    }
}
