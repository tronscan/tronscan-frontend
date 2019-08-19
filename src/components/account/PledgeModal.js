import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE } from './../../constants';

const { Option } = Select;

class PledgeModal extends Component {

    static propTypes = {
        option: PropTypes.object,
        sideChains: PropTypes.array,
        account: PropTypes.object,
        type: PropTypes.string,
    };

    constructor() {
        super();

        this.state = {
            disabled: false,
        };
    }

    /**
     * Form confirm
     */
    confirm = () => {
        const { form: { validateFields }, account: { sunWeb }, onCancel,
            option: { id, address, precision, type } } = this.props;

        validateFields(async(err, values) => {
            if (!err) {
                const num = values.Num * Math.pow(10, Number(precision));
                // trc10
                if (CURRENCYTYPE.TRX10) {
                    const data = await sunWeb.depositTrc10(id, num, 100000);
                } else if (CURRENCYTYPE.TRX20) {
                    // trc20
                    const data = await sunWeb.depositTrc20(num, 1000000, address);
                }
                this.setState({ disabled: true });
                onCancel();
            }
        });
    };

    /**
     * Form cancel
     */
    cancel = () => {
        const { onCancel } = this.props;
        onCancel && onCancel();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { option: { currency, balance, precision }, sideChains } = this.props;
        const isHasSideChainsData = sideChains && sideChains.length > 0;

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    initialValue: currency
                })(<Input disabled />)}
            </Form.Item>
        );

        // sidechainItem
        const sideChainItem = (
            <Form.Item label={tu('pledge_sidechain')}>
                {getFieldDecorator('sidechain', {
                    initialValue: isHasSideChainsData && sideChains[0].gatewayAddress,
                })(<Select>
                    {sideChains.map(v => (<Option key={v.gatewayAddress} value={v.gatewayAddress}>{v.name}</Option>))}
                </Select>)}
            </Form.Item>
        );

        // numItem
        const numItem = (
            <Form.Item label={tu('pledge_num')}>
                {getFieldDecorator('Num', {
                    rules: [
                        {
                            pattern: /^(0|[1-9][0-9]*)(\.\d+)?$/,
                            message: <span>{tu('pledge_num_error')}</span>,
                        },
                        {
                            validator: (rule, value) => value <= balance,
                            message: <span>{tu('pledge_num_error')}</span>,
                        }
                    ],
                })(<Input />)}
            </Form.Item>
        );

        // available_balance Item
        const balanceItem = (
            <p className="text-right">{tu('available_balance')}:{balance + currency}</p>
        );

        // btnItem
        const btnItem = (
            <button className="btn btn-danger" style={{ width: '100%' }}
                onClick={this.confirm}>{tu('sidechain_account_pledge_btn')}</button>
        );

        // pledgeTextItem
        const pledgeTextItem = (
            <p className="mt-2">{tu('pledge_text')}</p>
        );

        return (
            <Modal
                title={tu('sidechain_account_pledge_btn')}
                visible={true}
                onCancel={this.cancel}
                footer={null}
            >
                <Form onSubmit={this.handleSubmit}>
                    {currencyItem}
                    {sideChainItem}
                    {numItem}
                    {balanceItem}
                    {btnItem}
                    {pledgeTextItem}
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProp) {
    return {
        option: ownProp.option,
        sideChains: state.app.sideChains,
        account: state.app.account,
    };
}

const mapDispatchToProps = {
};

export default Form.create({ name: 'pledge' })(connect(mapStateToProps, mapDispatchToProps)(PledgeModal));