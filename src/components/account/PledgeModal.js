import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select, message } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT } from './../../constants';
import { injectIntl } from 'react-intl';

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
            isDisabled: false,
        };
    }

    /**
     * Form confirm
     */
    confirm = () => {
        const { form: { validateFields }, intl, account: { sunWeb }, onCancel,
            option: { id, address, precision, type } } = this.props;
        this.setState({ isDisabled: true });
        validateFields(async(err, values) => {
            if (!err) {
                const num = values.Num * Math.pow(10, Number(precision));
                // todo wangyan
                sunWeb.setSideGatewayAddress('TJ4apMhB5fhmAwqPcgX9i43SUJZuK6eZj4');
                sunWeb.setChainId('410A6DBD0780EA9B136E3E9F04EBE80C6C288B80EE');
                // trc10
                if (CURRENCYTYPE.TRX10 === type) {
                    // todo wangyan
                    const txid = await sunWeb.depositTrc10(id, num, FEELIMIT);
                    if (txid) {
                        message.success(intl.formatMessage({ id: 'success' }), 3, () => onCancel());
                    } else {
                        message.error(intl.formatMessage({ id: 'error' }));
                    }
                } else if (CURRENCYTYPE.TRX20 === type) {
                    const approveData = await sunWeb.approveTrc20(num, FEELIMIT, address);
                    if (approveData) {
                        // todo wangyan
                        // trc20
                        const data = await sunWeb.depositTrc20(num, FEELIMIT, address);
                        if (data) {
                            message.success(intl.formatMessage({ id: 'success' }), 3, () => onCancel());
                        } else {
                            message.error(intl.formatMessage({ id: 'error' }));
                        }
                    } else {
                        message.error(intl.formatMessage({ id: 'error' }));
                    }
                } else if (CURRENCYTYPE.TRX === type) {
                    const data = await sunWeb.depositTrx(num, FEELIMIT);
                    if (data) {
                        message.success(intl.formatMessage({ id: 'success' }), 3, () => onCancel());
                    } else {
                        message.error(intl.formatMessage({ id: 'error' }));
                    }
                }
            }
            this.setState({ isDisabled: true });
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
        const { isDisabled } = this.state;
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
        let reg = Number(precision) > 0
            ? `^(0|[1-9][0-9]*)(\.\d{1,${Number(precision)}})?$` : '^(0|[1-9][0-9]*)(\.\d+)?$';
        const numItem = (
            <Form.Item label={tu('pledge_num')}>
                {getFieldDecorator('Num', {
                    rules: [
                        {
                            pattern: new RegExp(reg),
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
            <button className="btn btn-danger" style={{ width: '100%' }} disabled={isDisabled}
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

export default Form.create({ name: 'pledge' })(connect(mapStateToProps, mapDispatchToProps)(injectIntl(PledgeModal)));