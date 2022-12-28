import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Input, Button } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import OwnerRead from '../PermissionRead/owner'
import WitnessRead from '../PermissionRead/witness'
import ActiveRead from '../PermissionRead/active'
import OwnerEdit from '../PermissionEdit/owner'
import ActiveEdit from '../PermissionEdit/active'
import { isEqual, cloneDeep } from 'lodash'
import { reloadWallet } from "../../../actions/wallet";
import { deepCopy } from "ethers/utils";
import { transactionMultiResultManager } from '../../../utils/tron'
import { buildAccountPermissionUpdateContract } from '@tronscan/client/src/utils/transactionBuilder'
import { postMutiSignTransaction } from '../../../services/apiMutiSign'
import { injectIntl } from "react-intl";
import { tu } from '../../../utils/i18n'
import {QuestionMark} from "../../common/QuestionMark";

@injectIntl
@connect(
    state => (
        {
            wallet: state.wallet,
            account: state.app.account,
            walletType: state.app.wallet,
        }
    ),
    {
      reloadWallet
    }
)
export default class MyPermission extends React.Component {
    constructor(props) {
        super(props);
        const { wallet, tronWeb, account} = this.props;
        const { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        if(ownerPermission){
            ownerPermission.type = 0;
            ownerPermission.keys.forEach(item=>{
                item.address = tronWeb.address.toHex(item.address);
            })
        }
        if(witnessPermission){
            witnessPermission.type = 1;
            witnessPermission.keys.forEach(item=>{
                item.address = tronWeb.address.toHex(item.address);
            })
        }
        if(activePermissions){
            activePermissions.forEach(item=>{
                item.type = 2;
                item.keys.forEach(itemKey=>{
                    itemKey.address = tronWeb.address.toHex(itemKey.address);
                })
            })
        }
        this.state = {
            isEditOperateUser: false,
            isEditContent: false,
            curControlAddress: wallet.current.address == '3QJmnh'? account.address:wallet.current.address,
            curLoginAddress: wallet.current.address,
            modal: null,
            modalAlert: null,
            ownerPermission: cloneDeep(ownerPermission) || null,
            activePermissions: cloneDeep(activePermissions) || [],
            witnessPermission: cloneDeep(witnessPermission),
            changedOwnerPermission: cloneDeep(ownerPermission),
            changedActivePermission: cloneDeep(activePermissions),
            changedWihnessPermission: cloneDeep(witnessPermission)
        }
    }
    async initState(wallet) {
        const {tronWeb} = this.props;
        let { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        if(wallet.current.representative.enabled===false){
            witnessPermission = null;
        }
        if(ownerPermission){
            ownerPermission.type = 0;
            ownerPermission.keys.forEach(item=>{
                item.address = tronWeb.address.toHex(item.address);
            })
        }
        if(witnessPermission){
            witnessPermission.type = 1;
            witnessPermission.keys.forEach(item=>{
                item.address = tronWeb.address.toHex(item.address);
            })
        }
        if(activePermissions){
            activePermissions.forEach(item=>{
                item.type = 2;
                item.keys.forEach(itemKey=>{
                    itemKey.address = tronWeb.address.toHex(itemKey.address);
                })
            })
        }
        this.setState({
            curControlAddress: wallet.current.address,
            curLoginAddress: wallet.current.address,
            ownerPermission: cloneDeep(ownerPermission) || null,
            activePermissions: cloneDeep(activePermissions) || [],
            witnessPermission: cloneDeep(witnessPermission),
            changedOwnerPermission: cloneDeep(ownerPermission),
            changedActivePermission: cloneDeep(activePermissions),
            changedWihnessPermission: cloneDeep(witnessPermission)
        }, () => {
           
        })
    }
    componentDidUpdate(prevProps){
        const { wallet } = prevProps;
        if(wallet.current.address!=this.props.wallet.current.address){
            this.initState(this.props.wallet);
        }
    }
    // async componentWillReceiveProps(nextProps) {
    //     if (nextProps.account.address != this.props.account.address) {
    //         this.initState(nextProps);
    //     }
    // }
    // static async getDerivedStateFromProps(nextProps, prevState) {
    //     await this.initState(nextProps);
    // }
    hideModal = () => {
        this.setState({
            modal: null,
        });
    };
    hideAlertModal = () => {
        this.setState({
            modalAlert: null
        })
    }
    //todo 
    async saveControlAddress() {
        //
        let isValid = false;
        const { tronWeb } = this.props;
        const curControlAddress = this.state.curControlAddress
        const { wallet, intl } = this.props;
        if (curControlAddress === wallet.current.address) {
            isValid = true;
            this.setState({
                isEditOperateUser: false
            })
        } else {

            isValid = tronWeb.isAddress(curControlAddress);
            if (!isValid) {
                this.warningAlert(intl.formatMessage({
                    id: "signature_invalid_Address"
                }))
                return;
            }
            //
            try {
                const contractInstance = await tronWeb.contract().at(curControlAddress)
                this.warningAlert(intl.formatMessage({
                    id: "signature_no_set"
                }))
                return;
            } catch (e) {
                isValid = true;
            }
            finally {
                this.setState({
                    isEditOperateUser: false
                })
            }
            if (!isValid) {
                this.warningAlert(intl.formatMessage({
                    id: "signature_Unverified_address"
                }))
                return;
            }
            //
            const res = await tronWeb.trx.getAccount(curControlAddress);
            const notInContralAddress = intl.formatMessage({
                id: "signature_notInContralAddress"
            })

            if (res) {
                const { active_permission, owner_permission, witness_permission } = res;
                // 
                const { keys } = owner_permission;
                const isInKeys = keys.some(item => {
                    return tronWeb.address.fromHex(item.address) == wallet.current.address
                })
                // 
                if (!isInKeys) {
                    isValid = false;
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={() => this.hideModal()} title=''>
                                {notInContralAddress}
                            </SweetAlert>
                        ),
                        isEditOperateUser: true
                    })
                }
                else {
                    //changedPermission
                    if(active_permission&&active_permission.length>0){
                        active_permission.forEach(item => {
                            item.type = 2;
                            item.keys.forEach(keyItem => {
                                keyItem.address = tronWeb.address.toHex(keyItem.address);
                            })
                        })
                    }
                    if(witness_permission){
                        witness_permission.type = 1;
                        witness_permission.keys.forEach(keyItem => {
                            keyItem.address = tronWeb.address.toHex(keyItem.address);
                        })
                    }
                    this.setState({
                        ownerPermission: owner_permission || null,
                        activePermissions: active_permission || [],
                        witnessPermission: witness_permission || null,
                        changedOwnerPermission: deepCopy(owner_permission),
                        changedActivePermission: deepCopy(active_permission),
                        changedWihnessPermission: deepCopy(witness_permission)
                    })
                }
            } else {
                isValid = false;
                this.warningAlert(intl.formatMessage({
                    id: "signature_invalid_Address"
                }))
            }

        }
    }
    changeControlAddress(event) {
        this.setState({
            curControlAddress: event.target.value
        })
    }
    changeOwnerPermission(changedOwnerPermission) {
        const {tronWeb} = this.props;
        if(changedOwnerPermission){
            changedOwnerPermission.type = 0;
            changedOwnerPermission.keys.forEach(item=>{
                item.address = tronWeb.address.toHex(item.address);
            })
        }
        this.setState({
            changedOwnerPermission: changedOwnerPermission
        })
    }
    changeActivePermission(changedActivePermission) {
        this.setState({
            changedActivePermission: changedActivePermission
        })
    }
    comparePermissionIsChanged() {
        const { wallet } = this.props;
        const { changedOwnerPermission, changedActivePermission, changedWihnessPermission } = this.state;
        const oldOwnerPermission = wallet.current.ownerPermission;
        const oldActivePermission = wallet.current.activePermissions;
        const oldWitnessPersmission = wallet.current.witnessPermission;
        let isEqualOwner = isEqual(oldOwnerPermission, changedOwnerPermission);
        let isEqualActive = isEqual(oldActivePermission, changedActivePermission);
        let isEqualWitness = isEqual(oldWitnessPersmission, changedWihnessPermission);
        return isEqualOwner && isEqualActive && isEqualWitness;
    }
    async ifContractAddress(address) {
        const { tronWeb } = this.props;
        let isValid = false;
        try {
            const contractInstance = await tronWeb.contract().at(tronWeb.address.fromHex(address)).catch()
        } catch (e) {
            isValid = true;
        }
        return isValid;
    }
    async validKeys(keysItem, keysArr) {
        const { tronWeb, intl } = this.props;
        const item = keysItem;
        if (!item.address.trim()) {
            this.warningAlert(intl.formatMessage({
                id: "signature_invalid_Address"
            }))
            return false;
        }
        if (!tronWeb.isAddress(item.address)) {
            this.warningAlert(intl.formatMessage({
                id: "signature_invalid_Address"
            }))
            return false;
        }
        if (!await this.ifContractAddress(tronWeb.address.fromHex(item.address))) {
            this.warningAlert(intl.formatMessage({
                id: "signature_no_set"
            }))
            return false;
        }
        if (!item.weight) {
            this.warningAlert(intl.formatMessage({
                id: "signature_weight_required"
            }));
            return false;
        }

        if (this.findIsSameKey(item, keysArr)) {
            this.warningAlert(intl.formatMessage({
                id: "signature_address_not_similar"
            }));
            return false;
        }
        if (item.address.length !== 42) {
            item.address = tronWeb.address.toHex(item.address);
        }
        return true;
    }
    findIsSameKey(itemKey, arr) {
        let count = 0;
        const { tronWeb } = this.props;
        arr.forEach(item => {
            if (tronWeb.address.fromHex(item.address) === tronWeb.address.fromHex(itemKey.address)) {
                count++;
            }
        })
        if (count > 1) {
            return true;
        }
        return false
    }
    successAlert(msg) {
        this.setState({
            modal: (
                <SweetAlert success title='' onConfirm={this.hideModal}>
                    {msg}
                </SweetAlert>
            ),
            isEditContent: false
        });
    }
    warningAlert(msg) {

        this.setState({
            modalAlert: (
                <SweetAlert warning title="" onConfirm={this.hideAlertModal}>
                    {msg}
                </SweetAlert>
            )
        });
    }
    confirmAlert(cbOK, cbCancel, msg) {
        this.setState({
            modal: (
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText={tu('ok_confirm')}
                    confirmBtnBsStyle="danger"
                    cancelBtnText={tu('signature_cancel')}
                    cancelBtnBsStyle="cancel"
                    onConfirm={() => cbOK()}
                    onCancel={() => this.hideModal()}
                    focusCancelBtn
                >
                    {msg}
                </SweetAlert>
            )
        })
    }
    onCancelClick() {
        this.confirmAlert(() => {
            this.hideModal();
            this.setState({ isEditContent: false })
        }, null, <div className='confirm-content-text'>{tu('signature_giveup_change')}</div>)
    }
    onSubmitClick() {
        this.confirmAlert(() => {
            this.hideModal();
            this.savePermission()

        }, null, <div className='confirm-content-text'>{tu('signature_set_spend_trx')}<span className='trx'>100TRX</span>{tu('signature_submit_change')}</div>)
    }

    //点击保存
    async savePermission() {
        const { reloadWallet, intl, tronWeb } = this.props;
        // let tronWeb;
        // if(walletType.type === "ACCOUNT_LEDGER"){
        //     tronWeb = this.props.tronWeb();
        // }else{
        //     tronWeb = this.props.account.tronWeb;
        // }
        const { changedOwnerPermission, changedActivePermission, changedWihnessPermission, curLoginAddress, curControlAddress } = this.state;
        if(!changedOwnerPermission){
            return;
        }

        //
        // if (this.comparePermissionIsChanged()) {
        //     this.setState({
        //         isEditContent: false
        //     })
        //     return false;
        // }

        changedOwnerPermission.type = 0;
        const threshold = changedOwnerPermission.threshold;
        if (!changedOwnerPermission.permission_name) {
            this.warningAlert(intl.formatMessage({
                id: "signature_owner_permission_name_required"
            }))
            return;
        }
        if (!threshold) {
            this.warningAlert(intl.formatMessage({
                id: "signature_owner_threshold_required"
            }))
            return;
        }
        let sumOwnerKeysWeight = 0;
        let validAllOwnerKeys = false;
        for (let item of changedOwnerPermission.keys) {
            if (!await this.validKeys(item, changedOwnerPermission.keys)) {
                // item.address = tronWeb.address.toHex(item.address);
                validAllOwnerKeys = false
                break;
            }
            sumOwnerKeysWeight += item.weight;
            validAllOwnerKeys = true;
        }

        if (!validAllOwnerKeys) {

            return;
        }

        if (sumOwnerKeysWeight < threshold) {
        
            this.warningAlert(intl.formatMessage({
                id: "signature__less_threshold_owner"
            }))
            return;
        }
        // active######################################################

        let isValidActivePermission = true;
        for (let i = 0; i < changedActivePermission.length; i++) {
            let acItem = changedActivePermission[i];
            let sumKeysWeight = 0;
            const acItemThreshold = acItem.threshold;
            if (!acItem.permission_name) {
                this.warningAlert(intl.formatMessage({
                    id: "signature_active_permission_name_required"
                }))
                isValidActivePermission = false;
                break;
            }
            if (!acItem.threshold) {
                this.warningAlert(intl.formatMessage({
                    id: "signature_active_threshold_required"
                }))
                isValidActivePermission = false;
                break;
            }
            let validActivePermissionKeys = false;

            for (let item of acItem.keys) {
                if (!await this.validKeys(item, acItem.keys)) {
                    isValidActivePermission = false;
                    break;
                }
                sumKeysWeight += item.weight;
                validActivePermissionKeys = true;
            }

            if (!validActivePermissionKeys) {
                break;
            }
            if (sumKeysWeight < acItemThreshold) {
                isValidActivePermission = false;
                // 
                this.warningAlert(intl.formatMessage({
                    id: "signature__less_threshold_active"
                }));
                return;
            }
        }
        if (!isValidActivePermission) { console.log('active vliad failed'); return }

        let { ownerPermission } = this.state;

        const UnmodifiedOwnerPermission = ownerPermission;
        const UnmodifiedOwnerPermissionKeys = UnmodifiedOwnerPermission.keys;
        
        if (curControlAddress === curLoginAddress && UnmodifiedOwnerPermissionKeys.length < 2&&UnmodifiedOwnerPermissionKeys[0].address === tronWeb.address.toHex(curLoginAddress)) {
            //Sign
            
            const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(tronWeb.address.toHex(curLoginAddress), changedOwnerPermission, changedWihnessPermission, changedActivePermission);
            const signedTransaction = await tronWeb.trx.sign(updateTransaction);
            const res = await tronWeb.trx.broadcast(signedTransaction).catch(e => {
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={this.hideModal}>
                          {(signedTransaction === 0 && this.props.walletType.type==="ACCOUNT_LEDGER")? tu("too_many_bytes_to_encode"):tu('signature_update_failed')} 
                        </SweetAlert>
                    )
                });
            });
            if(!signedTransaction){
                return;
            }
            if (res && res.result) {
                //  transaction_signature_muti_successful
                this.setState({
                    ownerPermission: deepCopy(changedOwnerPermission),
                    activePermissions: deepCopy(changedActivePermission),
                    witnessPermission: deepCopy(changedWihnessPermission)
                })
                this.successAlert(intl.formatMessage({
                    id: "transaction_signature_muti_successful"
                }))
                // setTimeout(()=>{
                //     reloadWallet();
                // },5000)


            } else {
                // 
                this.warningAlert(intl.formatMessage({
                    id: "transaction_signature_muti_failed"
                }))
            }
        } else {
            //multi Sign
            const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(tronWeb.address.toHex(curControlAddress), changedOwnerPermission, changedWihnessPermission, changedActivePermission);

            //const signedTransaction = await tronWeb.trx.multiSign(updateTransaction,tronWeb.defaultPrivateKey,0);
            const value = updateTransaction.raw_data.contract[0].parameter.value;
            const hexStr = buildAccountPermissionUpdateContract(value);
            const signedTransaction = await transactionMultiResultManager(updateTransaction, tronWeb, 0, 24, hexStr)
;
            if(!signedTransaction){
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={this.hideModal}>
                             {(signedTransaction === 0 && this.props.walletType.type==="ACCOUNT_LEDGER")? tu("too_many_bytes_to_encode"):tu('signature_update_failed')} 
                        </SweetAlert>
                    )
                });
                return;
            }
            let data = await postMutiSignTransaction(curLoginAddress, signedTransaction);
            const result = data.code;

            if (result === 0) {
                // 
                this.setState({
                    ownerPermission: deepCopy(changedOwnerPermission),
                    activePermissions: deepCopy(changedActivePermission),
                    witnessPermission: deepCopy(changedWihnessPermission)
                })
                this.successAlert(intl.formatMessage({
                    id: "transaction_signature_muti_successful"
                }))
            } else {
                // 
                this.warningAlert(intl.formatMessage({
                    id: "transaction_signature_muti_failed"
                }))
            }
        }


    }
    render() {
        const { isEditOperateUser, isEditContent, curControlAddress, modal, modalAlert, curLoginAddress, ownerPermission, activePermissions, witnessPermission } = this.state;
        const { wallet, tronWeb,walletType } = this.props;
        let permissionOrigin = null;
        if (curControlAddress === curLoginAddress) {
            permissionOrigin = wallet.current;
        } else {
            permissionOrigin = this.state;
        }
        const witnessAddressIfIs = wallet.current.address;
        return (
            <main className='permission-main'>
                <div className='control-address'>

                    <span> {tu('signature_control_address')}:<QuestionMark placement="top" text="signaure_control_address_tip"/></span>
                    <Input size="small" value={curControlAddress} className={!isEditOperateUser ? 'read' : ''} readOnly={!isEditOperateUser} onChange={(e) => {
                        this.changeControlAddress(e)
                    }} />
                    <Button className="btn btn-danger" style={{ display: isEditOperateUser ? 'block' : 'none' }}
                        onClick={() => this.saveControlAddress()}>{tu('signature_save')}</Button>
                    <Button className="btn btn-cancel" style={{ display: !isEditOperateUser ? 'block' : 'none' }} onClick={() => {
                        this.setState({ isEditOperateUser: true })
                    }}>{tu('signature_alter')}</Button>
                </div>
                <div className="global-operate">
                    <h5>{tu('signature_authority_structure')}</h5>
                    <div className="operate-btn">
                        <a href="javascript:;" className='edit-permission' style={{ display: !isEditContent ? 'inline-block' : 'none' }} onClick={() => { this.setState({ isEditContent: true }) }}><span className='edit'></span><span>{tu('signature_edit_permissions')}</span> </a>
                        <div className="buttonWarp" style={{ display: isEditContent ? 'inline-block' : 'none' }}>
                            <Button className="btn btn-cancel" onClick={() => { this.onCancelClick() }}>{tu('signature_cancel')}</Button>
                            <Button className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => { this.onSubmitClick() }}>{tu('signature_save')}</Button>
                        </div>
                    </div>
                    {modal}
                </div>
                {modalAlert}
                {/* view status */}
                {ownerPermission && !isEditContent && <OwnerRead ownerPermission={ownerPermission} tronWeb={tronWeb} />}
                {/* {witnessPermission && !isEditContent && <WitnessRead witnessPermission={witnessPermission} witnessNodeAddress={witnessAddressIfIs} tronWeb={tronWeb} />} */}
                {activePermissions && !isEditContent && <ActiveRead activePermissions={activePermissions} tronWeb={tronWeb}/>}
                {/* edit status */}
                {ownerPermission && isEditContent && <OwnerEdit ownerPermission={ownerPermission} tronWeb={tronWeb} changeOwnerPermission={this.changeOwnerPermission.bind(this)} />}
                {activePermissions && isEditContent && <ActiveEdit activePermissions={activePermissions} tronWeb={tronWeb} walletType={walletType} changeActivePermission={this.changeActivePermission.bind(this)} />}

            </main>)
    }
}