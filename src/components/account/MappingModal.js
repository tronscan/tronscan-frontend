import React, { Component } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Select, message } from 'antd';
import { API_URL, MAPPINGFEE, FEELIMIT } from './../../constants';
import xhr from 'axios';
import { injectIntl } from 'react-intl';
import SweetAlert from "react-bootstrap-sweetalert";

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
            isDisabled: false,
            isShowModal: true,
        };
    }

    async componentWillMount() {
        await this.getTrxHash();
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
                    title={isSuccess ? tu("mapping_success") : tu("mapping_error")}
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
        const { form: { validateFields }, account: { sunWeb } } = this.props;
        const { txHash } = this.state;

        this.setState({ isDisabled: true });

        validateFields(async(err, values) => {
            if (!err) {
                try {
                    const sideChain = values.sidechain;
                    const list = sideChain && sideChain.split('-');
                    sunWeb.setChainId(list[0]);
                    sunWeb.setSideGatewayAddress(list[1]);
                    const mappingData = await sunWeb.mappingTrc20(txHash, MAPPINGFEE, FEELIMIT);
                    this.openModal(mappingData);
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
        const { isDisabled, modal, isShowModal } = this.state;
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
                    initialValue: isHasSideChainsData && `${sideChains[0].chainid}-${sideChains[0].sidechain_gateway}`,
                })(<Select>
                    {sideChains.map(v => (<Option key={v.chainid} value={`${v.chainid}-${v.sidechain_gateway}`}>{v.name}</Option>))}
                </Select>)}
            </Form.Item>
        );

        // btnItem
        const btnItem = (
            <button className="btn btn-danger mt-4 mb-3" style={{ width: '100%' }} disabled={isDisabled}
                onClick={this.confirm}>{tu('main_account_mapping_btn')}</button>
        );

        return (
            <div>
                <Modal
                    title={tu('main_account_mapping_btn')}
                    visible={isShowModal}
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
                {modal}
            </div>
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