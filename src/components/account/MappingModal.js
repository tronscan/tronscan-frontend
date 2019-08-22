import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, message } from 'antd';
import { API_URL, MAPPINGFEE, FEELIMIT } from './../../constants';
import xhr from 'axios';
import { injectIntl } from 'react-intl';

const { Option } = Select;

class MappingModal extends Component {

    static propTypes = {
        address: PropTypes.string.isRequired,
        currency: PropTypes.string.isRequired,
        sideChains: PropTypes.array,
        account: PropTypes.object,
    };

    constructor() {
        super();

        this.state = {
            name: '',
            isDisabled: false,
        };
    }

    async componentWillMount() {
        await this.getTrxHash();
    }

    /**
     * Form confirm
     */
    confirm = () => {
        const { form: { validateFields }, intl, account: { sunWeb }, onCancel } = this.props;
        const { txHash } = this.state;

        this.setState({ isDisabled: true });

        validateFields(async(err, values) => {
            if (!err) {
                // todo wangyan
                sunWeb.setSideGatewayAddress('TJ4apMhB5fhmAwqPcgX9i43SUJZuK6eZj4');
                sunWeb.setChainId('410A6DBD0780EA9B136E3E9F04EBE80C6C288B80EE');
                const mappingData = await sunWeb.mappingTrc20(txHash, MAPPINGFEE, FEELIMIT);
                if (mappingData) {
                    message.success(intl.formatMessage({ id: 'success' }), 3, () => onCancel());
                } else {
                    message.error(intl.formatMessage({ id: 'error' }));
                }
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

    /**
     * get trxHash
     */
    getTrxHash = async() => {
        const { address } = this.props;
        const contractData = await xhr.get(API_URL + `/api/contract?contract=${address}`);
        const { data } = contractData;
        this.setState({
            txHash: (data && data.data && data.data.length > 0 && data.data[0].creator && data.data[0].creator.txHash)
                || ''
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { currency, sideChains } = this.props;
        const { isDisabled } = this.state;
        const isHasSideChainsData = sideChains && sideChains.length > 0;

        // mappingTextItem
        const mappingTextItem = (
            <div className="mb-4">
                <span>{tu('main_account_mapping_desc1')}</span><br />
                <span>{tu('main_account_mapping_desc2')}</span>
            </div>
        );

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

        // btnItem
        const btnItem = (
            <button className="btn btn-danger mt-4 mb-3" style={{ width: '100%' }} disabled={isDisabled}
                onClick={this.confirm}>{tu('main_account_mapping_btn')}</button>
        );

        return (
            <Modal
                title={tu('main_account_mapping_btn')}
                visible={true}
                onCancel={this.cancel}
                footer={null}
            >
                <Form onSubmit={this.handleSubmit}>
                    {mappingTextItem}
                    {currencyItem}
                    {sideChainItem}
                    {btnItem}
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state, ownProp) {
    return {
        address: ownProp.address,
        currency: ownProp.currency,
        sideChains: state.app.sideChains,
        account: state.app.account,
    };
}

const mapDispatchToProps = {};

export default Form.create({ name: 'mapping' })(connect(mapStateToProps, mapDispatchToProps)(injectIntl(MappingModal)));