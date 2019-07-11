/* eslint-disable no-restricted-globals */
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import React from "react";
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {tu, t} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import { Switch } from 'antd';
import _, {find, round, filter } from "lodash";


import TokenBalanceSelect from "../../common/TokenBalanceSelect";

@injectIntl
export default class DeployModal extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            feeLimit:1000000000,
            userfeepercentage:0,
            originEnergyLimit:10000000,
            sendTokenAmount:0,
            constructorParams:[],
            params:[],
        };
    }

    componentDidMount() {
        this.init()
    }

    init = () => {
        let {contractNameList} = this.props;
        this.setState({
            currentContractName : contractNameList[0]
        },()=>{
            this.getConstructorParams(contractNameList[0]);
        });
    }

    hideModal = () => {
        let {onHide} = this.props;
        onHide && onHide();
    };

    Mul (arg1, arg2) {
        let r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }

    confirmModal = () => {
        let { currentContractName, feeLimit, userfeepercentage, originEnergyLimit, constructorParams, currentContractABI, currentContractByteCode,sendTokenId, sendTokenAmount,sendTokenDecimals,params } = this.state;
        let { onConfirm } = this.props;
        let optionsPayable = {};
         sendTokenId = 0;
        if (!sendTokenId || sendTokenId == 0 || sendTokenAmount == 0) {
            optionsPayable = { callValue: sendTokenAmount };
        } else {
            optionsPayable = {
                tokenId: sendTokenId == '_'?'TRX':sendTokenId,
                tokenValue:  this.Mul(sendTokenAmount,Math.pow(10, sendTokenDecimals))
            };
        }
        let parameters = [];
        for(let i in constructorParams) {
            parameters.push(constructorParams[i].value)
        }
       
        let form = {
            abi:currentContractABI,
            bytecode:currentContractByteCode,
            feeLimit: feeLimit,
            name: currentContractName,
            originEnergyLimit: originEnergyLimit,
            parameters: parameters,
            userFeePercentage: userfeepercentage,
            ...optionsPayable
        }
        console.log('form22222222======',form)
        onConfirm && onConfirm(form);
    };

    resourceSelectChange = (value) => {
        console.log('value',value)
        this.setState({
            currentContractName : value
        },()=>{
            this.getConstructorParams(value);
        });

    };

    handleToggle = (prop,value) => {
        this.setState({ [prop]: value });
    };

    setParams = (index,value) => {
        let { constructorParams } = this.state;
        let constructorParamsArr = constructorParams.slice(0)
        constructorParamsArr[index].value = value;
        this.setState({
            constructorParams:constructorParamsArr
        });
    };

    tokenBalanceSelectChange(name, decimals, balance){
        this.setState({
            sendTokenId:name,
            sendTokenDecimals:decimals,
            sendTokenBalance:balance
        });
    }

    getConstructorParams = (currentContractName) =>{
        let constructorParams = [];
        let { compileInfo } = this.props;
        let currentContract = _(compileInfo)
            .filter(tb => tb.contractName == currentContractName)
            .value();
        let currentContractABI = currentContract[0].abi;
        let currentContractByteCode = currentContract[0].byteCode;
        currentContractABI && currentContractABI.map((item,index) => {
            if(item.type === 'constructor'){
                if(item.inputs){
                    constructorParams.push.apply(constructorParams,item.inputs)
                }
                console.log('constructorParams============',constructorParams)
            }
        });
        constructorParams && constructorParams.map((item,i) => {
            item.value = ''
        });
        console.log('constructorParams',constructorParams)
        this.setState({
            constructorParams,
            currentContractABI,
            currentContractByteCode
        });

    };






    render() {
        let { currentContractName, feeLimit, userfeepercentage, originEnergyLimit, sendTokenAmount,constructorParams,params} = this.state;
        console.log('constructorParams666========',constructorParams)
        let { contractNameList, intl } = this.props;
        return (
            <Modal isOpen={true}  fade={false} className="modal-dialog-centered _freezeContent">
               <ModalHeader className="text-center _freezeHeader" toggle={this.hideModal}>
                   {tu("contract_deploy_params")}
               </ModalHeader>
               <ModalBody className="_freezeBody">
                   <div className="form-group">
                       <p>{tu('contract_deploy_modal_info')}</p>
                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("contract_name")}</label>
                       <select className="custom-select deploy-select"
                               value={currentContractName}
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
                       <label>{tu("deploy_params_fee_limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('feeLimit', ev.target.value)}
                              className="form-control deploy-input"
                              value={ feeLimit }
                       />
                   </div>

                   <div className="form-group contract-deploy">
                       <label>{tu("deploy_params_user_fee_percentage")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('userfeepercentage', ev.target.value)}
                              className="form-control deploy-input"
                              value={ userfeepercentage }
                       />

                   </div>
                   <div className="form-group contract-deploy">
                       <label>{tu("deploy_params_energy_limit")}</label>
                       <input type="text"
                              onChange={(ev) => this.handleToggle('originEnergyLimit', ev.target.value)}
                              className="form-control deploy-input"
                              value={originEnergyLimit}
                       />

                   </div>
                   <div className="form-group">
                       <label>{tu("deploy_params_send_token")}</label>
                       <div className="deploy-input-box">
                           <TokenBalanceSelect
                               tokenBalanceSelectChange={(name, decimals,balance) => {this.tokenBalanceSelectChange(name, decimals,balance)}}>
                           </TokenBalanceSelect>
                           <input type="text"
                                  onChange={(ev) => this.handleToggle('tokenAmount', ev.target.value)}
                                  className="form-control deploy-input ml-4 input-box-sec"
                                  value={sendTokenAmount}
                           />
                       </div>
                   </div>
                   {
                       constructorParams.length > 0 && <div className="form-group">
                           <label>{tu("deploy_params_constructor")}</label>
                           {
                               constructorParams.map((item, index) => {
                                   return (
                                       <div className="deploy-input-box mb-1" key={index}>
                                           <input type="text"
                                                  onChange={(e) => this.setParams(index,e.target.value)}
                                                  className="form-control deploy-input"
                                                  value={item.value}
                                                  placeholder={item.name}
                                           />
                                           <input type="text"
                                               //onChange={(ev) => this.setAddress(ev.target.value)}
                                                  className="form-control deploy-input ml-4 input-box-sec"
                                                  value={item.type}
                                                  disabled={true}
                                           />
                                       </div>
                                   )
                               })
                           }
                       </div>
                   }
                   <div className="contract-compiler-button mt-3 mb-3">
                       <button
                           onClick={this.hideModal}
                           className="compile-button-small cancel"
                       >
                           {tu('cancel')}
                       </button>
                       <button
                           onClick={this.confirmModal}
                           className="compile-button-small ml-5"
                       >
                           {tu('confirm')}
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
