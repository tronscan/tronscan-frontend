import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, DEPOSITFEE, TRXDEPOSITMIN, TRCDEPOSITMIN } from './../../constants';
import { injectIntl } from 'react-intl';
import SweetAlert from 'react-bootstrap-sweetalert';
import { mul, division } from './../../utils/calculation';

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
                    title={isSuccess ? tu('pledge_success') : tu('pledge_error')}
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
                    const num = mul(numValue, Math.pow(10, Number(precision)));
                    const sideChain = values.sidechain;
                    const list = sideChain && sideChain.split('-');
                    sunWeb.setChainId(list[0]);
                    sunWeb.setSideGatewayAddress(list[1]);
                    // trc10
                    if (CURRENCYTYPE.TRX10 === type) {
                        // todo wangyan
                        const txid = await sunWeb.depositTrc10(id, num, DEPOSITFEE, FEELIMIT);
                        this.openModal(txid);
                    } else if (CURRENCYTYPE.TRX20 === type) {
                        const approveData = await sunWeb.approveTrc20(num, FEELIMIT, address);
                        if (approveData) {
                            // todo wangyan
                            // trc20
                            const data = await sunWeb.depositTrc20(num, DEPOSITFEE, FEELIMIT, address);
                            this.openModal(data);
                        } else {
                            this.openModal();
                        }
                    } else if (CURRENCYTYPE.TRX === type) {
                        const data = await sunWeb.depositTrx(num, DEPOSITFEE, FEELIMIT);
                        this.openModal(data);
                    }
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
     * get trc20 sideChains
     */
    getSideChains = () => {
        const { option: { trx20MappingAddress } } = this.props;
        trx20MappingAddress.map(v => {
            v.name = v.chainName;
            v.sidechain_gateway = v.sidechainGateway;
        });
        return trx20MappingAddress;
    }

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
            const minAmount = division(type === CURRENCYTYPE.TRX ? TRXDEPOSITMIN : TRCDEPOSITMIN, Math.pow(10, Number(precision)));
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
        const { option: { currency, balance, precision, type }, sideChains } = this.props;
        const { isDisabled, modal, isShowModal, numValue, errorMess } = this.state;

        const sideChainList = type === CURRENCYTYPE.TRX20 ? this.getSideChains() : sideChains;
        const isHasSideChainsData = sideChainList && sideChainList.length > 0;

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
                    initialValue: isHasSideChainsData && `${sideChainList[0].chainid}-${sideChainList[0].sidechain_gateway}`,
                })(<Select>
                    {sideChainList.map(v => (<Option key={v.chainid} value={`${v.chainid}-${v.sidechain_gateway}`}>{v.name}</Option>))}
                </Select>)}
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
                onClick={this.confirm}>{tu('sidechain_account_pledge_btn')}</button>
        );

        // pledgeTextItem
        const pledgeTextItem = (
            <p className="mt-2">{tu('pledge_text')}</p>
        );

        return (
            <div>
                <Modal
                    title={tu('sidechain_account_pledge_btn')}
                    visible={isShowModal}
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
                {modal}
            </div>
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