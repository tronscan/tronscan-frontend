import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, ONE_TRX, TRXWITHDRAWMIN, TRCWITHDRAWMIN } from './../../constants';
import { injectIntl } from 'react-intl';
import SweetAlert from 'react-bootstrap-sweetalert';
import { mul, division, add } from './../../utils/calculation';

class SignModal extends Component {

    static propTypes = {
        option: PropTypes.object,
        sideChains: PropTypes.array,
        account: PropTypes.object,
        type: PropTypes.string,
        fees: PropTypes.object,
        currentWallet: PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            isDisabled: false,
            isShowModal: true,
            feeError: '',
            ENERGYMIN:10000,
            TRXBALANCEMIN:11,
        };
    }

    /**
     * show result
     */
    openModal = data => {
        const { option: { energyRemaining, trxBalanceRemaining }} = this.props;
        let { ENERGYMIN, TRXBALANCEMIN }  = this.state;
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
                            {

                                !isSuccess && energyRemaining < ENERGYMIN && trxBalanceRemaining < TRXBALANCEMIN && <span  className="text-center d-block" style={{color: 'black'}}>{tu('notrx_noenergy')}</span>
                            }
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
            option: { id, address, precision, type }, fees: { withdrawFee } } = this.props;
        const { numValue, errorMess } = this.state;
        // console.log('this.props',this.props,'withdrawFee',withdrawFee)
        this.setState({ isDisabled: true });
        const isSubmit = this.validateNum();
        validateFields(async(err, values) => {
            if (!err && !errorMess && isSubmit) {
                try {
                    const fee = mul(withdrawFee, ONE_TRX,FEELIMIT);
                    const num = mul(numValue,  Math.pow(10, Number(precision)));
                    console.log(fee,num)
                    let data;
                    // trc10
                    if (CURRENCYTYPE.TRX10 === type) {
                        data = await sunWeb.withdrawTrc10(id, num, fee, FEELIMIT);
                    } else if (CURRENCYTYPE.TRX20 === type) {
                        // trc20
                        data = await sunWeb.withdrawTrc20(num, fee, FEELIMIT, address);
                    } else if (CURRENCYTYPE.TRX === type) {
                        // trx
                        data = await sunWeb.withdrawTrx(num, fee, FEELIMIT);
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
            const minAmount = type === CURRENCYTYPE.TRX ? TRXWITHDRAWMIN : division(TRCWITHDRAWMIN, Math.pow(10, Number(precision)));
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

    /**
     * Lack of balance validate
     */
    validateNum = () => {
        const { option: { type }, fees: { withdrawFee }, currentWallet: { balance }, intl } = this.props;
        const { numValue } = this.state;
        
        const num = Number(numValue);
        // trc10
        if (CURRENCYTYPE.TRX === type) {
            if (balance < add(num, withdrawFee)) {
                this.setState({
                    feeError: `${intl.formatMessage({id: 'lack_of_balance'})}`
                });
                return false;
            }
        } else {
            if (balance < num) {
                this.setState({
                    feeError: `${intl.formatMessage({id: 'lack_of_balance'})}`
                });
                return false;
            }
        }
        this.setState({
            feeError: '',
        });
        return true;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { option: { currency, balance }, fees: { withdrawFee } } = this.props;
        const { isDisabled, modal, isShowModal, numValue, errorMess, feeError } = this.state;

        // currencyItem
        const currencyItem = (
            <Form.Item label={tu('pledge_currency')}>
                {getFieldDecorator('currency', {
                    initialValue: currency
                })(<Input disabled />)}
            </Form.Item>
        );

        // available_balance Item
        const balanceItem = (
            <div className="flex justify-content-between">
                <p className="text-left mb-2">{tu('pledge_num')}</p>
                <p className="text-right mb-2">{tu('available_balance')}:{balance + currency}</p>
            </div>
        );

        // numItem
        const numItem = (
            <div>
                {balanceItem}
                <Input value={numValue} onChange={this.onChangeNum} />
                <span className="mt-1" style={{ color: 'red', display: 'block' }}>{errorMess}</span>
            </div>
        );

        // btnItem
        const btnItem = (
            <button className="btn btn-danger" style={{ width: '100%' }} disabled={!numValue || isDisabled}
                onClick={this.confirm}>{tu('sidechain_account_sign_btn')}</button>
        );

        // pledgeTextItem
        const pledgeTextItem = (
            <p className="mt-5">
               {
                withdrawFee === 0 ?null:
                <span>{tu('sign_text')}{withdrawFee} TRX</span>
               }
            </p>
        );

        // feeError
        const feeErrorItem = (
            <span className="pt-2" style={{ color: 'red', display: 'block' }}>{feeError}</span>
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
                        {pledgeTextItem}
                        {btnItem}
                        {feeError && feeErrorItem}
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
        fees: state.app.fees,
        currentWallet: state.wallet.current,
    };
}

const mapDispatchToProps = {
};

export default Form.create({ name: 'sign' })(connect(mapStateToProps, mapDispatchToProps)(injectIntl(SignModal)));