import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, WITHDRAWFEE, TRXWITHDRAWMIN, TRCWITHDRAWMIN } from './../../constants';
import { injectIntl } from 'react-intl';
import SweetAlert from 'react-bootstrap-sweetalert';
import { mul, division } from './../../utils/calculation';

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
                    confirmBtnText={tu('trc20_confirm')}
                    confirmBtnBsStyle="danger"
                    title={isSuccess ? tu('sign_success') : tu('sign_error')}
                    onConfirm={this.hideModal}
                    style={{ height: '300px', top: '30%', marginLeft: '-240px' }}
                >
                    <div className="form-group" style={{ marginBottom: '36px' }}>
                        <div className="mt-3 mb-2 text-left" style={{ color: '#666' }}>

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
        const { numValue, errorMess } = this.state;

        this.setState({ isDisabled: true });
        validateFields(async(err, values) => {
            if (!err && !errorMess) {
                try {
                    const num = mul(numValue,  Math.pow(10, Number(precision)));
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
                } catch (e) {
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

    /**
     * num change
     */
    onChangeNum = e => {
        const { option: { precision, balance, currency, type }, intl } = this.props;
        const numValue = e.target && e.target.value;
        let errorMess = '';
        let reg = Number(precision) > 0
            ? `^(0|[1-9][0-9]*)(\\.\\d{0,${Number(precision)}})?$` : '^(0|[1-9][0-9]*)(\\.\\d+)?$';

        if (!!numValue) {
            // format
            if (!new RegExp(reg).test(numValue)) {
                return;
            }

            // min value
            const minAmount = division(type === CURRENCYTYPE.TRX ? TRXWITHDRAWMIN : TRCWITHDRAWMIN, Math.pow(10, Number(precision)));
            if (Number(numValue) < minAmount) {
                errorMess = `${intl.formatMessage({id: 'pledge_num_min_error'})}${minAmount}${currency}`;
            }

            // max value
            if (Number(numValue) > Number(balance)) {
                errorMess = tu('pledge_num_error');
            }
        }

        this.setState({
            numValue,
            errorMess,
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { option: { currency, balance } } = this.props;
        const { isDisabled, modal, isShowModal, numValue, errorMess } = this.state;

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    initialValue: currency
                })(<Input disabled />)}
            </Form.Item>
        );

        // numItem
        const numItem = (
            <Form.Item label={tu('pledge_num')}>
                <Input value={numValue} onChange={this.onChangeNum} />
                <span style={{ color: 'red' }}>{errorMess}</span>
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
            <p className="mt-2">{tu('sign_text')}</p>
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