import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { tu } from './../../../utils/i18n';
import { Form, Row, Col, Input } from 'antd';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';

@connect(
    (state, ownProp) => ({
        account: state.app.account,
        wallet: state.wallet.current,
    })
)

export class OtherInfo extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    showModal = (msg) => {
        let { intl } = this.props;
        this.setState({
            modal: <SweetAlert
                error
                confirmBtnText={intl.formatMessage({ id: 'confirm' })}
                confirmBtnBsStyle="success"
                onConfirm={this.hideModal}
                style={{ marginLeft: '-240px', marginTop: '-195px' }}
            >
                {tu(msg)}
            </SweetAlert>
        }
        );
    }

    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    submit = (e) => {
        const { iconList, count } = this.state;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // if (!err) {
            this.props.nextState({
                paramData: values,
                iconList,
                social_current: count
            });
            this.props.nextStep(1);
            // }
        });
    }

    render() {
        const { params } = this.props;
        const { keyBusDevAndPart, linkToAllTronWallet, relationshipWithAnyTronSR, whichExchangesTradedOn,
            yourAvg24HVolume, theTop3ReasonsYouShouldBeListed, citeYourSources, top3Things,
            youSupportYourCoinProjectTime, productDemoLink, allYourProductsLink, circulatingSupply,
            top5HoldersOfYourToken } = params;
        const { modal } = this.state;
        const { form: { getFieldDecorator } } = this.props;

        // Key Business Development and Partners item
        const bussinessItem = (
            <Col span={24} md={24}>
                <Form.Item label="Key Business Development and Partners">
                    {getFieldDecorator('keyBusDevAndPart', {
                        initialValue: keyBusDevAndPart,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Link to all Tron wallet address used for token sale (to collect money) item
        const linkItem = (
            <Col span={24} md={24}>
                <Form.Item label="Link to all Tron wallet address used for token sale (to collect money)">
                    {getFieldDecorator('linkToAllTronWallet', {
                        initialValue: linkToAllTronWallet,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Relationship with any TRON SR's item
        const relationshipItem = (
            <Col span={24} md={24}>
                <Form.Item label="Relationship with any TRON SR's">
                    {getFieldDecorator('relationshipWithAnyTronSR', {
                        initialValue: relationshipWithAnyTronSR,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Which exchanges is it traded on item
        const exchangesItem = (
            <Col span={24} md={24}>
                <Form.Item label="Which exchanges is it traded on">
                    {getFieldDecorator('whichExchangesTradedOn', {
                        initialValue: whichExchangesTradedOn,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // If you have listed on other exchanges, what is your average 24H volume item
        const averageItem = (
            <Col span={24} md={24}>
                <Form.Item
                    label="If you have listed on other exchanges, what is your average 24H volume">
                    {getFieldDecorator('yourAvg24HVolume', {
                        initialValue: yourAvg24HVolume,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // What are the top 3 reasons you should be listed item
        const reasonsItem = (
            <Col span={24} md={24}>
                <Form.Item label="What are the top3 reasons you should be listed">
                    {getFieldDecorator('theTop3ReasonsYouShouldBeListed', {
                        initialValue: theTop3ReasonsYouShouldBeListed,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // How big is the market that you are trying to target? ($M, $B)? Please cite your sources item
        const sourcesItem = (
            <Col span={24} md={24}>
                <Form.Item label="How big is the market that you are trying to target? ($M, $B)? Please cite your sources">
                    {getFieldDecorator('citeYourSources', {
                        initialValue: citeYourSources,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // How are the top 3 things that show that your metrics and company traction is growing item
        const growingItem = (
            <Col span={24} md={24}>
                <Form.Item label="How are the top 3 things that show that your metrics and company traction is growing">
                    {getFieldDecorator('top3Things', {
                        initialValue: top3Things,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // How do we know that you will support your coin project for the medium or long term item
        const mediumItem = (
            <Col span={24} md={24}>
                <Form.Item label="How do we know that you will support your coin project for the medium or long term">
                    {getFieldDecorator('youSupportYourCoinProjectTime', {
                        initialValue: youSupportYourCoinProjectTime,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Please give us a link to an intro video that explains your product or serves as product demo item
        const servesItem = (
            <Col span={24} md={24}>
                <Form.Item label="Please give us a link to an intro video that explains your product or serves as product demo">
                    {getFieldDecorator('productDemoLink', {
                        initialValue: productDemoLink,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Please link all you products that you have live on app store or
        // on your website and how many users or downloads you have for each product item
        const downloadItem = (
            <Col span={24} md={24}>
                <Form.Item label="Please link all you products that you have live on app store or on your website and how many users or downloads you have for each product">
                    {getFieldDecorator('allYourProductsLink', {
                        initialValue: allYourProductsLink,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Do you have > 10% circulating supply item
        const circulatingItem = (
            <Col span={24} md={24}>
                <Form.Item label="Do you have > 10% circulating supply">
                    {getFieldDecorator('circulatingSupply', {
                        initialValue: circulatingSupply,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Who are the top 5 holders of your token and what % do they hold tem
        const holdersItem = (
            <Col span={24} md={24}>
                <Form.Item label="Who are the top 5 holders of your token and what % do they hold">
                    {getFieldDecorator('top5HoldersOfYourToken', {
                        initialValue: top5HoldersOfYourToken,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        return (
            <main>
                <h4 className="mb-3 mt-3">Team Information</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {bussinessItem}
                    {linkItem}
                    {relationshipItem}
                    {exchangesItem}
                    {averageItem}
                    {reasonsItem}
                    {sourcesItem}
                    {growingItem}
                    {mediumItem}
                    {servesItem}
                    {downloadItem}
                    {circulatingItem}
                    {holdersItem}
                </Row>
            </main>
        );
    }
}

// export default Form.create({ name: 'market_info' })(injectIntl(OtherInfo));
export default OtherInfo;