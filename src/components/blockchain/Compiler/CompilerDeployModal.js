/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";

import TokenBalanceSelect from "../../common/TokenBalanceSelect";

@injectIntl
export default class FreezeBalanceModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            optimizer:1,
            resources: [
                {
                    label:"solidity-0.4.25_Odyssey_v3.2.3",
                    value:"solidity-0.4.25_Odyssey_v3.2.3"
                }
            ],
            hideSmallCurrency: true,
            feeLimit:1000000000,
            modal:null,
        };
    }

    componentDidMount() {

    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    confirmModal = () => {
        let {onConfirm} = this.props;
        onConfirm && onConfirm();
    };

    resourceSelectChange = (value) => {
        this.setState({
            selectedResource: value
        });
    };

    handleToggle = (prop) => {
        return (enable) => {
            this.setState({ [prop]: enable });
            //this.props.handleSwitch(enable);
        };
    };

    tokenBalanceSelectChange(name, decimals, balance){
        console.log('name',name)
        console.log('decimals',decimals)
        console.log('balance',balance)
        this.setState({
            sendTokenId:name,
            sendTokenDecimals:decimals,
            sendTokenBalance:balance
        });
    }




    render() {
        let {resources, selectedResource,hideSmallCurrency, feeLimit,modal} = this.state;
        let {contractNameList, frozenTrx, intl} = this.props;
        console.log('contractNameList',contractNameList);
        return (
            <Modal isOpen={true}  fade={false} className="modal-dialog-centered _freezeContent">
               <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                   {tu("Deploy Params")}
               </ModalHeader>
               <ModalBody className="_freezeBody">
                   <div className="form-group">
                       <p>Contract deployment will cost a certain amount of trx or energy</p>
                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("合约名称")}</label>
                       <select className="custom-select deploy-select"
                               value={selectedResource}
                               onChange={(e) => {this.resourceSelectChange(e.target.value)}}>
                           {
                               contractNameList.map((resource, index) => {
                                   return (
                                       <option key={index} value={resource}>{intl.formatMessage({id: resource})}</option>
                                   )
                               })
                           }
                       </select>
                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("Fee Limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.setAddress(ev.target.value)}
                              className="form-control deploy-input"
                              value={feeLimit}
                       />
                   </div>

                   <div className="form-group contract-deploy">
                       <label>{tu("User Fee Percentage")}</label>
                       <input type="text"
                              onChange={(ev) => this.setAddress(ev.target.value)}
                              className="form-control deploy-input"
                              value={feeLimit}
                       />

                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("Origin Energy Limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.setAddress(ev.target.value)}
                              className="form-control deploy-input"
                              value={feeLimit}
                       />

                   </div>
                   <div className="form-group">
                       <label>{tu("Select TRX or token to send")}</label>
                       <div className="deploy-input-box">
                           <TokenBalanceSelect
                               value={selectedResource}
                               tokenBalanceSelectChange={(name, decimals,balance) => {this.tokenBalanceSelectChange(name, decimals,balance)}}>
                           </TokenBalanceSelect>
                           <input type="text"
                                  onChange={(ev) => this.setAddress(ev.target.value)}
                                  className="form-control deploy-input ml-4 input-box-sec"
                                  value={feeLimit}
                           />
                       </div>
                   </div>
                   <div className="form-group">
                       <label>{tu("Params for constructor")}</label>
                       <div className="deploy-input-box">
                           <input type="text"
                                  onChange={(ev) => this.setAddress(ev.target.value)}
                                  className="form-control deploy-input"
                                  value={feeLimit}
                           />
                           <input type="text"
                                  onChange={(ev) => this.setAddress(ev.target.value)}
                                  className="form-control deploy-input ml-4 input-box-sec"
                                  value={feeLimit}
                           />
                       </div>
                   </div>
                   <div className="contract-compiler-button">
                       <button
                           onClick={this.hideModal}
                           className="compile-button-small cancel"
                       >
                           {tu('取消')}
                       </button>
                       <button
                           onClick={this.confirmModal}
                           className="compile-button-small ml-5"
                       >
                           {tu('确认')}
                       </button>
                   </div>
               </ModalBody>
           </Modal>

        )
    }
}

const styles = {
    maxButton: {
        position:'absolute',
        right:0,
        top:0,
        background:'none',
        height:'35px',
        border:'none',
        cursor:'pointer',
    }
};
