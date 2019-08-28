import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, DEPOSITFEE } from './../../constants';
import { injectIntl } from 'react-intl';
import SweetAlert from "react-bootstrap-sweetalert";

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
     * show result
     */
    openModal = data => {
        const isSuccess = !!data;
        this.setState({
            modal: (
                <SweetAlert
                    type={isSuccess ? 'success' : 'error'}
                    confirmBtnText={tu("trc20_confirm")}
                    confirmBtnBsStyle="danger"
                    title={isSuccess ? tu("pledge_success") : tu("pledge_error")}
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
                    const sideChain = values.sidechain;
                    const list = sideChain && sideChain.split('-');
                    // todo wangyan
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

    /**
     * get trc20 sideChains
     */
    getSideChains = () => {
        const { option: { trx20MappingAddress }, sideChains } = this.props;
        trx20MappingAddress.map(v => {
            v.name = v.chainName;
            v.sidechain_gateway = v.sidechainGateway;
        })
        return trx20MappingAddress;
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { option: { currency, balance, precision, trx20MappingAddress, type }, sideChains } = this.props;
        const { isDisabled, modal } = this.state;

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
                            validator: (rule, value) => value <= Number(balance),
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
                {modal}
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