import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, WITHDRAWFEE } from './../../constants';
import { injectIntl } from 'react-intl';
import SweetAlert from "react-bootstrap-sweetalert";

class SignModal extends Component {

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
            isShowModal: true,
        };
    }

    /**
     * show result
     */
    openModal = data => {
        const isSuccess = !!data;
        this.setState({
            isShowModal: false,
            modal: (
                <SweetAlert
                    type={isSuccess ? 'success' : 'error'}
                    confirmBtnText={tu("trc20_confirm")}
                    confirmBtnBsStyle="danger"
                    title={isSuccess ? tu("sign_success") : tu("sign_error")}
                    onConfirm={this.hideModal}
                    style={{height: '300px', top: '30%', marginLeft: '-240px'}}
                >
                  <div className="form-group" style={{marginBottom: '36px'}}>
                    <div className="mt-3 mb-2 text-left" style={{color: '#666'}}>
      
                    </div>
                  </div>
      
                </SweetAlert>
            ),
        });
    };

    /**
     * clsoe result
     */
    hideModal = () => {
        this.setState({
            modal: null,
        });
        this.cancel();
    };

    /**
     * Form confirm
     */
    confirm = () => {
        const { form: { validateFields }, account: { sunWeb },
            option: { id, address, precision, type } } = this.props;

        this.setState({ isDisabled: true });
        validateFields(async(err, values) => {
            if (!err) {
                try {
                    const num = values.Num * Math.pow(10, Number(precision));
                    let data;
                    // trc10
                    if (CURRENCYTYPE.TRX10 === type) {
                        data = await sunWeb.withdrawTrc10(id, num, WITHDRAWFEE, FEELIMIT);
                    } else if (CURRENCYTYPE.TRX20 === type) {
                        // trc20
                        data = await sunWeb.withdrawTrc20(num, WITHDRAWFEE, FEELIMIT, address);
                    } else if (CURRENCYTYPE.TRX === type) {
                        // todo wangyan
                        data = await sunWeb.withdrawTrx(num, WITHDRAWFEE, FEELIMIT);
                    }
                    this.openModal(data);
                    this.setState({ isDisabled: false });
                } catch(e) {
                    this.openModal();
                    this.setState({ isDisabled: false });
                }
            }
            this.setState({ isDisabled: false });
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
        const { option: { currency, balance, precision } } = this.props;
        const { isDisabled, modal, isShowModal } = this.state;

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    initialValue: currency
                })(<Input disabled />)}
            </Form.Item>
        );

        // numItem
        let reg = Number(precision) > 0 ? `^(0|[1-9][0-9]*)(\\.\\d{1,${Number(precision)}})?$` : '^(0|[1-9][0-9]*)(\\.\\d+)?$';
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
                onClick={this.confirm}>{tu('sidechain_account_sign_btn')}</button>
        );

        // pledgeTextItem
        const pledgeTextItem = (
            <p className="mt-2">{tu('pledge_text')}</p>
        );

        return (
            <div>
                <Modal
                    title={tu('sidechain_account_sign_btn')}
                    visible={isShowModal}
                    onCancel={this.cancel}
                    footer={null}
                >
                    <Form onSubmit={this.handleSubmit}>
                        {currencyItem}
                        {numItem}
                        {balanceItem}
                        {btnItem}
                        {pledgeTextItem}
                    </Form>
                </Modal>
                {modal}
            </div>
        );
    }
}

function mapStateToProps(state, ownProp) {
    return {
        option: ownProp.option,
        account: state.app.account,
    };
}

const mapDispatchToProps = {
};

export default Form.create({ name: 'sign' })(connect(mapStateToProps, mapDispatchToProps)(injectIntl(SignModal)));