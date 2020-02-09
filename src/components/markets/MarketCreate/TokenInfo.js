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
        form: ownProp.form,
        params: ownProp.params,
    })
)

export class TokenInfo extends Component {
    static propTypes = {
        form: PropTypes.object.isRequired,
        params: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { params } = this.props;
        const { tokenProceedsUsage, tokenReleaseSchedule, currentTokenUtility,
            futureTokenUtility, seedSaleTokenPrice, amountRaisedInSeedSale, seedSaleStartAndEndDate, seedSaleDisPlan,
            privateSaleTokenPrice, amountRaisedInPrivateSale, privateSaleStartAndCompletionDate, privateSaleDisPlan,
            publicSaleTokenPrice, publicSaleTargetAmount, publicSaleStartAndEndDate, publicSaleDisPlan,
            totalAmountOfFundsRaised, initialCirculatingSupply } = params;
        const { form: { getFieldDecorator } } = this.props;
        
        // Token Proceeds Uage item
        const tokenProceedsItem = (
            <Col span={24} md={24}>
                <Form.Item label="Token Proceeds Uage">
                    {getFieldDecorator('tokenProceedsUsage', {
                        initialValue: tokenProceedsUsage,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Token Release Schedule item
        const tokenReleaseItem = (
            <Col span={24} md={24}>
                <Form.Item label="Token Release Schedule">
                    {getFieldDecorator('tokenReleaseSchedule', {
                        initialValue: tokenReleaseSchedule,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Current Token Utility item
        const currentTokenItem = (
            <Col span={24} md={24}>
                <Form.Item label="Current Token Utility">
                    {getFieldDecorator('currentTokenUtility', {
                        initialValue: currentTokenUtility,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Future Token Utility item
        const futureTokenItem = (
            <Col span={24} md={24}>
                <Form.Item label="Future Token Utility">
                    {getFieldDecorator('futureTokenUtility', {
                        initialValue: futureTokenUtility,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Seed Sale Token Price item
        const saleTokenItem = (
            <Col span={24} md={11}>
                <Form.Item label="Seed Sale Token Price">
                    {getFieldDecorator('seedSaleTokenPrice', {
                        initialValue: seedSaleTokenPrice,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Amount Raised in Seed Sale item
        const amountRaisedItem = (
            <Col span={24} md={11}>
                <Form.Item label="Amount Raised in Seed Sale">
                    {getFieldDecorator('amountRaisedInSeedSale', {
                        initialValue: amountRaisedInSeedSale,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Seed Sale Start Date and End Date item
        const seedSaleDateItem = (
            <Col span={24} md={24}>
                <Form.Item label="Seed Sale Start Date and End Date">
                    {getFieldDecorator('seedSaleStartAndEndDate', {
                        initialValue: seedSaleStartAndEndDate,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Seed Sale Distribution Plan item
        const seedDistItem = (
            <Col span={24} md={24}>
                <Form.Item label="Seed Sale Distribution Plan">
                    {getFieldDecorator('seedSaleDisPlan', {
                        initialValue: seedSaleDisPlan,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Private Sale Token Price item
        const privateSaleTokenItem = (
            <Col span={24} md={11}>
                <Form.Item label="Private Sale Token Price">
                    {getFieldDecorator('privateSaleTokenPrice', {
                        initialValue: privateSaleTokenPrice,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Amount Raised in Private Sale item
        const amountPrivateItem = (
            <Col span={24} md={11}>
                <Form.Item label="Amount Raised in Private Sale">
                    {getFieldDecorator('amountRaisedInPrivateSale', {
                        initialValue: amountRaisedInPrivateSale,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Private Sale Start Date and Completion Date item
        const privateDateItem = (
            <Col span={24} md={24}>
                <Form.Item label="Private Sale Start Date and Completion Date">
                    {getFieldDecorator('privateSaleStartAndCompletionDate', {
                        initialValue: privateSaleStartAndCompletionDate,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Private Sale Distribution Plan item
        const privateDistItem = (
            <Col span={24} md={24}>
                <Form.Item label="Private Sale Distribution Plan">
                    {getFieldDecorator('privateSaleDisPlan', {
                        initialValue: privateSaleDisPlan,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Public Sale Token Price item
        const publicSaleTokenItem = (
            <Col span={24} md={11}>
                <Form.Item label="Public Sale Token Price">
                    {getFieldDecorator('publicSaleTokenPrice', {
                        initialValue: publicSaleTokenPrice,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Amount Raised in Public Sale item
        const amountPublicItem = (
            <Col span={24} md={11}>
                <Form.Item label="Amount Raised in Public Sale">
                    {getFieldDecorator('publicSaleTargetAmount', {
                        initialValue: publicSaleTargetAmount,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Public Sale Start Date and Completion Date item
        const publicDateItem = (
            <Col span={24} md={24}>
                <Form.Item label="Public Sale Start Date and Completion Date">
                    {getFieldDecorator('publicSaleStartAndEndDate', {
                        initialValue: publicSaleStartAndEndDate,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Public Sale Distribution Plan item
        const publicDistItem = (
            <Col span={24} md={24}>
                <Form.Item label="Public Sale Distribution Plan">
                    {getFieldDecorator('publicSaleDisPlan', {
                        initialValue: publicSaleDisPlan,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Total Amount of Funds Raised item
        const totalAmountItem = (
            <Col span={24} md={11}>
                <Form.Item label="Total Amount of Funds Raised">
                    {getFieldDecorator('totalAmountOfFundsRaised', {
                        initialValue: totalAmountOfFundsRaised,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );

        // Initial Circulating Supply item
        const initialCirItem = (
            <Col span={24} md={11}>
                <Form.Item label="Initial Circulating Supply">
                    {getFieldDecorator('initialCirculatingSupply', {
                        initialValue: initialCirculatingSupply,
                    })(
                        <Input />
                    )}
                </Form.Item>
            </Col>
        );
        return (
            <main>
                <h4 className="mb-3 mt-3">Token Information</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {tokenProceedsItem}
                    {tokenReleaseItem}
                    {currentTokenItem}
                    {futureTokenItem}
                </Row>
                <h4 className="mb-3">Sale Information</h4>
                <hr/>
                <Row gutter={24} type="flex" justify="space-between" className="px-2">
                    {saleTokenItem}
                    {amountRaisedItem}
                    {seedSaleDateItem}
                    {seedDistItem}
                    {privateSaleTokenItem}
                    {amountPrivateItem}
                    {privateDateItem}
                    {privateDistItem}
                    {publicSaleTokenItem}
                    {amountPublicItem}
                    {publicDateItem}
                    {publicDistItem}
                    {totalAmountItem}
                    {initialCirItem}
                </Row>
            </main>
        );
    }
}

export default Form.create({ name: 'market_info2' })(injectIntl(TokenInfo));
// export default TokenInfo;