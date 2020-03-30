import React, { Component,Fragment } from 'react';
import { connect } from 'react-redux';
import { tu } from '../../utils/i18n';
import { Modal, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { CURRENCYTYPE, FEELIMIT, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, ONE_TRX } from './../../constants';
import SweetAlert from 'react-bootstrap-sweetalert';
import { mul, division } from './../../utils/calculation';
import rebuildList from "./../../utils/rebuildList";
import rebuildToken20List from "./../../utils/rebuildToken20List";
import { NameWithId } from '../common/names';
import { AddressLink, TokenTRC20Link } from "../common/Links";
import {TRXPrice} from "../common/Price";
import {FormattedDate, FormattedNumber, FormattedRelative, FormattedTime, injectIntl} from "react-intl";
import {Client, tronWeb} from "../../services/api";
import Utils from '../../utils/contractUtils';

const { Option } = Select;

class SignDetailsModal extends Component {

    static propTypes = {
        option: PropTypes.object,
        sideChains: PropTypes.array,
        account: PropTypes.object,
        type: PropTypes.string,
        fees: PropTypes.object,
    };

    constructor() {
        super();
        this.state = {
            isDisabled: false,
            isShowModal: true,
        };
    }
    componentDidMount() {
        const { details } = this.props;
        if(details.contractType == 'TriggerSmartContract' && details.functionSelector) {
            this.getParameterValue()
        }
    }


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
            option: { id, address, precision, type }, fees: { depositFee } } = this.props;
        const { numValue, errorMess } = this.state;
        this.setState({ isDisabled: true });
        validateFields(async(err, values) => {
            if (!err && !errorMess) {
                try {
                    const fee = mul(depositFee, ONE_TRX);
                    const num = mul(numValue, Math.pow(10, Number(precision)));
                    const sideChain = values.sidechain;
                    const list = sideChain && sideChain.split('-');
                    sunWeb.setChainId(list[0]);
                    sunWeb.setSideGatewayAddress(list[1]);
                    // trc10
                    if (CURRENCYTYPE.TRX10 === type) {
                        // todo wangyan
                        const txid = await sunWeb.depositTrc10(id, num, fee, FEELIMIT);
                        this.openModal(txid);
                    } else if (CURRENCYTYPE.TRX20 === type) {
                        const approveData = await sunWeb.approveTrc20(num, FEELIMIT, address);
                        if (approveData) {
                            // todo wangyan
                            // trc20
                            const data = await sunWeb.depositTrc20(num, fee, FEELIMIT, address);
                            this.openModal(data);
                        } else {
                            this.openModal();
                        }
                    } else if (CURRENCYTYPE.TRX === type) {
                        const data = await sunWeb.depositTrx(num, fee, FEELIMIT);
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
     * Form cancel
     */
    sign = () => {
        const { onSign, details } = this.props;
        onSign && onSign(details);
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

    getParameterValue = async () =>{
        const { details, account } = this.props;
        let hexstr = details.currentTransaction.raw_data.contract[0].parameter.value;
        let parameterValue = Client.getParameterValue(hexstr,'TriggerSmartContract');
        //details.contractData.data = parameterValue;
        let parameter = details.contractData;
        let function_selector = details.functionSelector;
        let contract_address = details.contractData.contract_address;
        let smartcontract = await account.tronWeb.trx.getContract(contract_address);
        let abi = smartcontract.abi.entrys;
        const args = Utils.decodeParams(parameterValue.data.substring(8),abi,function_selector);
        this.setState({
            args
        });
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { details } = this.props;
        const {  isShowModal, modal, args } = this.state;
        const defaultImg = require("../../images/logo_default.png");
        let TokenIDList = [];
        let TokencontractList = [];
        let tokenIdData,trc20tokenBalances;
        TokenIDList.push(details.contractData)
        if(TokenIDList){
            tokenIdData  = rebuildList(TokenIDList,'asset_name','amount')[0]
        }


        if(details.functionSelector == 'transfer(address,uint256)' && args){
            TokencontractList.push(
                {
                    "contract_address":details.contractData.contract_address,
                    "balance":args[1].value
                }
            )
           trc20tokenBalances  = rebuildToken20List(TokencontractList, 'contract_address', 'balance')[0];
        }



        const TransferDetailsItem = (
            <Fragment>
                <div className="form-group">
                    <label>{tu("from")}</label>
                    <span><AddressLink address={details.contractData.owner_address}>{details.contractData.owner_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("to")}</label>
                    <span><AddressLink address={details.contractData.to_address}>{details.contractData.to_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("amount")}</label>
                    <span><TRXPrice amount={details.contractData.amount/ ONE_TRX}/></span>
                </div>
            </Fragment>
        );
        const TransferAssetDetailsItem = (
            <Fragment>
                <div className="form-group">
                    <label>{tu("from")}</label>
                    <span><AddressLink address={details.contractData.owner_address}>{details.contractData.owner_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("to")}</label>
                    <span><AddressLink address={details.contractData.to_address}>{details.contractData.to_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("amount")}</label>
                    <span>{tokenIdData.map_amount}</span>
                </div>
                <div className="form-group">
                    <label>{tu("token")}</label>
                    <span><NameWithId value={details.contractData} notamount totoken/></span>
                </div>
            </Fragment>
        );

        const TriggerSmartTransferDetailsItem = (
            <Fragment>
                <div className="form-group">
                    <label>{tu("contract_triggers_owner_address")}</label>
                    <span><AddressLink address={details.contractData.owner_address}>{details.contractData.owner_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("contract_address")}</label>
                    <span><AddressLink address={details.contractData.contract_address} isContract={true}>{details.contractData.contract_address}</AddressLink></span>
                </div>
                {
                    (details.functionSelector == 'transfer(address,uint256)' && args) &&  <div>
                        <div className="form-group">
                            <label>{tu("from")}</label>
                            <span><AddressLink address={details.contractData.owner_address}>{details.contractData.owner_address}</AddressLink></span>
                        </div>

                        <div className="form-group">
                            <label>{tu("to")}</label>
                            <span><AddressLink address={args[0].value}>{args[0].value}</AddressLink></span>
                        </div>
                        <div className="form-group">
                            <label>{tu("amount")}</label>
                            <span>{trc20tokenBalances.map_amount}</span>
                        </div>
                        <div className="form-group">
                            <label>{tu("token")}</label>
                            <span>
                                <div className="flex1">
                                        {trc20tokenBalances["contract_address"] == CONTRACT_ADDRESS_USDT || trc20tokenBalances["contract_address"] == CONTRACT_ADDRESS_WIN || trc20tokenBalances["contract_address"] == CONTRACT_ADDRESS_GGC ? (
                                            <b
                                                className="token-img-top"
                                                style={{ marginRight: 5 }}
                                            >
                                                <img
                                                    width={20}
                                                    height={20}
                                                    src={
                                                        trc20tokenBalances[
                                                            "map_amount_logo"
                                                            ]
                                                    }
                                                    alt={
                                                        trc20tokenBalances[
                                                            "map_token_name"
                                                            ]
                                                    }
                                                    onError={e => {
                                                        e.target.onerror = null;
                                                        e.target.src = defaultImg;
                                                    }}
                                                />
                                                <i
                                                    style={{
                                                        width: 10,
                                                        height: 10,
                                                        bottom: -5
                                                    }}
                                                ></i>
                                            </b>
                                        ) : (
                                            <img
                                                width={20}
                                                height={20}
                                                src={
                                                    trc20tokenBalances[
                                                        "map_amount_logo"
                                                        ]
                                                }
                                                alt={
                                                    trc20tokenBalances["map_token_name"]
                                                }
                                                style={{ marginRight: 5 }}
                                                onError={e => {
                                                    e.target.onerror = null;
                                                    e.target.src = defaultImg;
                                                }}
                                            />
                                        )}
                                    <TokenTRC20Link
                                        name={
                                            trc20tokenBalances["map_token_name"]
                                        }
                                        address={
                                            trc20tokenBalances[
                                                "contract_address"
                                                ]
                                        }
                                        namePlus={
                                            trc20tokenBalances["map_token_name"] +
                                            " (" +
                                            trc20tokenBalances[
                                                "map_token_name_abbr"
                                                ] +
                                            ")"
                                        }
                                    />
                                      </div>
                            </span>
                        </div>
                    </div>

                }
            </Fragment>
        );

        const TriggerSmartDetailsItem = (
            <Fragment>
                <div className="form-group">
                    <label>{tu("contract_triggers_owner_address")}</label>
                    <span><AddressLink address={details.contractData.owner_address}>{details.contractData.owner_address}</AddressLink></span>
                </div>
                <div className="form-group">
                    <label>{tu("contract_address")}</label>
                    <span><AddressLink address={details.contractData.contract_address} isContract={true}>{details.contractData.contract_address}</AddressLink></span>
                </div>
                <div className="form-group sign-details-method">
                    <label>{tu("Method_calling")}</label>
                    <div className="flex1">
                        <div className="d-flex border-bottom content_item pt-0">
                            <div className="content_name">
                                {tu("contract_method")}:
                            </div>
                            <div className="flex1">
                                {details.functionSelector}
                            </div>
                        </div>
                        {args &&
                        Object.keys(args).map(item => {
                            return (
                                <div
                                    className="d-flex content_item"
                                    key={args[item].name}
                                >
                                    <div className="content_name">
                                        {args[item].name}:
                                    </div>
                                    <div className="flex1 details-break-word">
                                        {args[item].value}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </Fragment>
        );

        // sign btnItem
        const signBtnItem = (
            <button className="btn btn-danger mt-4" style={{ width: '100%' }}
                    onClick={this.sign}>{tu('signature')}</button>
        );
        // close btnItem
        const closeBtnItem = (
            <button className="btn btn-danger mt-4" style={{ width: '100%' }}
                    onClick={this.cancel}>{tu('compile_close')}</button>
        );
        return (
            <div>
                <Modal
                    title={tu('signature_details')}
                    visible={isShowModal}
                    onCancel={this.cancel}
                    footer={null}
                >
                   <div className="signature_details">
                       <div className="form-group">
                           <label>{tu("signature_status")}:</label>
                           <span>
                                {
                                    details.state == 0 && <span style={{color:'#69C265'}}>{tu("signature_details_processing")}</span>
                                }
                                {
                                    details.state == 1 && <span style={{color:'#69C265'}}>{tu("signature_successful")}</span>
                                }
                                {
                                    details.state == 2 && <span style={{color:'#69C265'}}>{tu("signature_failed")}</span>
                                }
                            </span>
                       </div>
                       <div className="form-group">
                           <label>{tu("type")}:</label>
                           <span>
                               {details.contractType}
                            </span>
                       </div>
                       <Fragment>
                           {details.contractType == 'TransferContract' ?TransferDetailsItem:''}
                           {details.contractType == 'TransferAssetContract' ?TransferAssetDetailsItem:''}
                           {details.contractType == 'TriggerSmartContract' && details.functionSelector != 'transfer(address,uint256)' ? TriggerSmartDetailsItem :''}
                           {details.contractType == 'TriggerSmartContract' && details.functionSelector == 'transfer(address,uint256)' ? TriggerSmartTransferDetailsItem  :''}
                       </Fragment>

                       <div className="form-group border-0">
                           <label>{tu("signature_list")}:</label>
                           <div className="text-left">{details.currentWeight + '/' + details.threshold}</div>
                       </div>
                       <div className="form-group d-block border-0">
                           {
                               details.signatureProgress.map((item,index)=>{
                                   return    <div key={index} className="d-flex mt-1">
                                       <div style={{width:250}}>
                                           <AddressLink address={item.address}>{item.address}</AddressLink>
                                       </div>
                                       <div className="ml-2 p-1 d-block signature-weight">{item.weight}</div>
                                       {item.isSign == 1 ? <i className="ml-2 signature-siged"></i>:<div className="ml-2" style={{width:12}}></div>}
                                       {item.signTime && <div className="ml-2">
                                           <FormattedDate value={item.signTime*1000}/>&nbsp;
                                           <FormattedTime value={item.signTime*1000}
                                                          hour='numeric'
                                                          minute="numeric"
                                                          second='numeric'
                                                          hour12={false}
                                           />
                                       </div>}
                                   </div>
                               })
                           }
                       </div>
                   </div>
                    {details.state == 0 &&  details.multiState == 10 ? signBtnItem :closeBtnItem}
                </Modal>
                {modal}
            </div>
        );
    }
}

function mapStateToProps(state, ownProp) {
    return {
        sideChains: state.app.sideChains,
        account: state.app.account,
        fees: state.app.fees,
    };
}

const mapDispatchToProps = {
};

export default Form.create({ name: 'pledge' })(connect(mapStateToProps, mapDispatchToProps)(injectIntl(SignDetailsModal)));