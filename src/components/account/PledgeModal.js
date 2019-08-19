import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

class PledgeModal extends Component {

    constructor() {
        super();

        this.state = {
            name: '',
            disabled: false,
        };
    }

    /**
     * Form validation
     */
    isValid = () => {
        let { name } = this.state;

        if (name.length < 8) {
            return [false, tu('name_to_short')];
        }

        if (name.length > 32) {
            return [false, tu('name_to_long')];
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            return [false, tu('permitted_characters_message')];
        }

        return [true];
    };

    /**
     * Form confirm
     */
    confirm = () => {
        const { onConfirm } = this.props;
        const { name } = this.state;
        onConfirm && onConfirm(name);
        this.setState({ disabled: true });
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

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    rules: [
                        {
                            message: 'XXX',
                        }
                    ],
                })(<Input />)}
            </Form.Item>
        );

        // sidechainItem
        const sideChainItem = (
            <Form.Item label={tu('pledge_sidechain')}>
                {getFieldDecorator('sidechain', {
                    rules: [
                        {
                            message: 'XXX',
                        }
                    ],
                })(<Select>
                    <Option value="86">+86</Option>
                </Select>)}
            </Form.Item>
        );

        // numItem
        const numItem = (
            <Form.Item label={tu('pledge_num')}>
                {getFieldDecorator('num', {
                    rules: [
                        {
                            message: 'XXX',
                        }
                    ],
                })(<Input />)}
            </Form.Item>
        );

        // available_balance Item
        const balanceItem = (
            <p className="text-right">{tu('available_balance')}:XXXABC</p>
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

function mapStateToProps(state) {
    return {};
}

const mapDispatchToProps = {};

export default Form.create({ name: 'pledge' })(connect(mapStateToProps, mapDispatchToProps)(PledgeModal));