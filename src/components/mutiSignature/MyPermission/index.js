import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Input, Button } from 'antd';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
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
// import xhr from "axios";
<<<<<<< HEAD
import { postMutiSignTransaction } from '../../../services/apiMutiSign'
=======
import {postMutiSignTransaction} from '../../../services/apiMutiSign'
import { injectIntl } from "react-intl";
@injectIntl
>>>>>>> 4fd505f65f689a668ec7565c62bcb6f3213a540e
@connect(
    state => {
        return {
            wallet: state.wallet,
            account: state.app.account,
        }
    },
    {
        reloadWallet
    }
)
export default class MyPermission extends React.Component {
    constructor(props) {
        super(props);
        const { wallet } = this.props;
        const { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        this.state = {
            isEditOperateUser: false,
            isEditContent: false,
            curControlAddress: wallet.current.address,
            curLoginAddress: wallet.current.address,
            modal: null,
            ownerPermission: cloneDeep(ownerPermission) || null,
            activePermissions: cloneDeep(activePermissions) || [],
            witnessPermission: cloneDeep(witnessPermission),
            changedOwnerPermission: cloneDeep(ownerPermission),
            changedActivePermission: cloneDeep(activePermissions),
            changedWihnessPermission: cloneDeep(witnessPermission)
        }
    }
    async initState(nextProps) {

        const { wallet } = nextProps
        const { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        //console.log('activePermissions222', activePermissions);
        this.setState({
            curControlAddress: wallet.current.address,
            curLoginAddress: wallet.current.address,
            ownerPermission: cloneDeep(ownerPermission) || null,
            activePermissions: cloneDeep(activePermissions) || [],
            witnessPermission: cloneDeep(witnessPermission)
        }, () => {
            console.log('initState', wallet.current.address);
        })
    }
    // componentDidUpdate(prevProps){
    //     const { wallet } = prevProps;
    //     if(wallet.current.address!=this.props.wallet.current.address){
    //         this.initState();
    //     }
    // }
    async componentWillReceiveProps(nextProps) {
        console.log('nextProps', nextProps.wallet);
        await this.initState(nextProps);
    }
    // static async getDerivedStateFromProps(nextProps, prevState) {
    //     await this.initState(nextProps);
    // }
    hideModal = () => {
        this.setState({
            modal: null,
        });
    };
    async saveControlAddress() {
        //校验地址规则
        let isValid = false;
        const { tronWeb } = this.props;
        const curControlAddress = this.state.curControlAddress
        const { wallet,intl } = this.props;
        if (curControlAddress === wallet.current.address) {
            isValid = true;
            this.setState({
                isEditOperateUser: false
            })
        } else {

            isValid = tronWeb.isAddress(curControlAddress);
            //校验是否合约地址
            try {
                const contractInstance = await tronWeb.contract().at(curControlAddress)
                this.warningAlert(intl.formatMessage({
                    id: "signature_no_set"
                  }))
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
                // 校验新地址下有没有该地址的权限
                const { keys } = owner_permission;
                const isInKeys = keys.some(item => {
                    return tronWeb.address.fromHex(item.address) == wallet.current.address
                })
                //todo 你的地址必须在控制地址keys下
                if (!isInKeys) {
                    isValid = false;
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={() => this.hideModal()} title='warn'>
                                {notInContralAddress}
                            </SweetAlert>
                        ),
                        isEditOperateUser: true
                    })
                }
                else {
                    this.setState({
                        ownerPermission: owner_permission || null,
                        activePermissions: active_permission || [],
                        witnessPermission: witness_permission || null
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
    componentDidMount(prevProps) {

    }

    changeOwnerPermission(changedOwnerPermission) {
        //console.log('changedOwnerPermission',changedOwnerPermission)
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
    validKeys(keysItem,keysArr) {
        const { tronWeb,intl } = this.props;
        const item = keysItem;
        if (!tronWeb.isAddress(item.address)) {
            //todo 
            this.warningAlert(intl.formatMessage({
                id: "signature_invalid_Address"
              }))
            return false;
        }
        if (!item.weight) {
            //todo
            this.warningAlert('weight 为必填项.');
            return false;
        }

        if (this.findIsSameKey(item, keysArr)) {
            //todo

            this.warningAlert('同一权限组下账户地址不能相同.');
            return false;
        }
        item.address = tronWeb.address.toHex(item.address);
        return true;

    }
    findIsSameKey(itemKey, arr) {
        let count = 0;
        arr.forEach(item => {
            if (item.address === itemKey.address) {
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
                <SweetAlert success onConfirm={this.hideModal}>
                    {msg}
                </SweetAlert>
            ),
            isEditContent: false
        });
    }
    warningAlert(msg) {
        this.setState({
            modal: (
                <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                    {msg}
                </SweetAlert>
            )
        });
    }
    confirmAlert(cbOK, cbCancel,msg) {
        this.setState({
            modal: (
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Ok"
                    confirmBtnBsStyle="danger"
                    cancelBtnBsStyle="cancel"
                    onConfirm={()=>cbOK()}
                    onCancel={()=>this.hideModal()}
                    focusCancelBtn
                >       
                    { msg }
                </SweetAlert>
            )
        })
    }
    onCancelClick(){
        this.confirmAlert(()=>{
            this.hideModal();
            this.setState({ isEditContent: false })
        },null,<div className='confirm-content-text'>是否放弃本次修改?</div>)
    }
    onSubmitClick(){
        this.confirmAlert(()=>{
            this.savePermission()
            this.hideModal();
        },null,<div className='confirm-content-text'>提交修改将完成多重签名权限结构的设置此操作将会花费<span className='trx'>100TRX</span>，是否提交本次修改?</div>)
    }

    //点击保存
    async savePermission() {
        const { tronWeb, reloadWallet } = this.props;
        const { changedOwnerPermission, changedActivePermission, changedWihnessPermission, curLoginAddress, curControlAddress } = this.state;
        //检查权限是否修改过
        if (this.comparePermissionIsChanged()) {
            this.setState({
                isEditContent: false
            })
            return false;
        }

        changedOwnerPermission.type = 0;
        const threshold = changedOwnerPermission.threshold;
        if (!changedOwnerPermission.permission_name) {
            this.warningAlert('owner permission_name is required.')
            return;
        }
        let sumOwnerKeysWeight = 0;
        const validAllOwnerKeys = changedOwnerPermission.keys.every(item => {
            if (!this.validKeys(item, changedOwnerPermission.keys)) {
                // item.address = tronWeb.address.toHex(item.address);
                return false
            }
            sumOwnerKeysWeight += item.weight;
            return true
        })

        if (!validAllOwnerKeys) {
            //
            //this.warningAlert('The number of keys cannot be 0 and cannot be the same or Incorrect address format.')
            return;
        }

        if (sumOwnerKeysWeight < threshold) {
            //todo owner 权限权重之和大于阈值
            this.warningAlert('sum of all key\'s weight should not be less than threshold in permission Owner')
            return;
        }
        // active数据校验######################################################

        let isValidActivePermission = true;
        for (let i = 0; i < changedActivePermission.length; i++) {
            const acItem = changedActivePermission[i];
            acItem.type = 2;
            let sumKeysWeight = 0;
            const acItemThreshold = acItem.threshold;
            const validActivePermissionKeys = acItem.keys.every(item => {
                if (!this.validKeys(item, acItem.keys)) {
                    isValidActivePermission = false;
                    return false
                }
                sumKeysWeight += item.weight;
                return true
            })
            if (!validActivePermissionKeys) {
                break;
            }
            if (sumKeysWeight < acItemThreshold) {
                isValidActivePermission = false;
                //todo active 权限权重值和必须大于阈值
                this.warningAlert('sum of all key\'s weight should not be less than threshold in permission Active');
                return;
            }
        }
        if (!isValidActivePermission) { console.log('active vliad failed'); return }

        this.setState({
            ownerPermission: deepCopy(changedOwnerPermission),
            activePermissions: deepCopy(changedActivePermission),
            witnessPermission: deepCopy(changedWihnessPermission)
        }, async () => {
            const { ownerPermission, activePermissions, witnessPermission } = this.state;
            const UnmodifiedOwnerPermission = this.props.wallet.current.ownerPermission;
            if (curControlAddress === curLoginAddress && UnmodifiedOwnerPermission.keys.length < 2) {
                const { ownerPermission, activePermissions, witnessPermission } = this.state;
                const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(tronWeb.address.toHex(curLoginAddress), ownerPermission, witnessPermission, activePermissions);
                const signedTransaction = await tronWeb.trx.sign(updateTransaction);
                //console.log(signedTransaction)
                const res = await tronWeb.trx.broadcast(signedTransaction).catch(e => {
                    this.setState({
                        modal: (
                            <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                                {'update permission failed'}
                            </SweetAlert>
                        )
                    });
                });

                if (res.result) {
                    //todo 签名成功
                    this.successAlert('签名成功.')
                    // setTimeout(()=>{
                    //     reloadWallet();
                    // },5000)


                } else {
                    //todo 签名失败
                    this.warningAlert('签名失败')
                }
            } else {
                //走多重签名
                const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(tronWeb.address.toHex(curLoginAddress), ownerPermission, witnessPermission, activePermissions);

                //const signedTransaction = await tronWeb.trx.multiSign(updateTransaction,tronWeb.defaultPrivateKey,0);
                const value = updateTransaction.raw_data.contract[0].parameter.value;
                const hexStr = buildAccountPermissionUpdateContract(value);

                const signedTransaction = await transactionMultiResultManager(updateTransaction, tronWeb, 0, 1, hexStr);
                let data = await postMutiSignTransaction(curLoginAddress, signedTransaction);
                const result = data.code;
                if (result === 0) {
                    //todo 签名成功
                    this.successAlert('签名成功.')
                } else {
                    //todo 签名失败
                    this.warningAlert('签名失败')
                }
            }
        })


    }
    render() {
        const { isEditOperateUser, isEditContent, curControlAddress, modal, curLoginAddress } = this.state;
        const { wallet, tronWeb } = this.props;
        let permissionOrigin = null;
        if (curControlAddress === curLoginAddress) {
            permissionOrigin = wallet.current;
        } else {
            permissionOrigin = this.state;
        }
        const { ownerPermission, activePermissions, witnessPermission } = permissionOrigin;
        const witnessAddressIfIs = wallet.current.address;
        return (
            <main className='permission-main'>
                <div className='control-address'>
                    {/* todo */}
                    <span> Control Address:</span>
                    <Input size="small" value={curControlAddress} className={!isEditOperateUser ? 'read' : ''} readOnly={!isEditOperateUser} onChange={(e) => {
                        this.changeControlAddress(e)
                    }} />
                    <Button className="btn btn-danger" style={{ display: isEditOperateUser ? 'block' : 'none' }}
                        onClick={() => this.saveControlAddress()}>Save</Button>
                    <Button className="btn btn-cancel" style={{ display: !isEditOperateUser ? 'block' : 'none' }} onClick={() => {
                        this.setState({ isEditOperateUser: true })
                    }}>Alter</Button>
                </div>
                {/* todo */}
                <div className="global-operate">
                    <h3>Authority structure</h3>
                    <div className="operate-btn">
                        <a href="javascript:;" className='edit-permission' style={{ display: !isEditContent ? 'inline-block' : 'none' }} onClick={() => { this.setState({ isEditContent: true }) }}><span className='edit'></span><span>Edit Permissions</span> </a>
                        <div className="buttonWarp" style={{ display: isEditContent ? 'inline-block' : 'none' }}>
                            <Button className="btn btn-cancel" onClick={() => { this.onCancelClick()}}>Cancel</Button>
                            <Button className="btn btn-danger" style={{marginLeft:'10px'}} onClick={() => { this.onSubmitClick() }}>Save</Button>
                        </div>
                    </div>
                </div>
                {/* view status */}
                {ownerPermission && !isEditContent && <OwnerRead ownerPermission={ownerPermission} tronWeb={tronWeb} />}
                {witnessPermission && !isEditContent && <WitnessRead witnessPermission={witnessPermission} witnessNodeAddress={witnessAddressIfIs} tronWeb={tronWeb} />}
                {activePermissions && !isEditContent && <ActiveRead activePermissions={activePermissions} tronWeb={tronWeb} />}
                {/* edit status */}
                {ownerPermission && isEditContent && <OwnerEdit ownerPermission={ownerPermission} tronWeb={tronWeb} changeOwnerPermission={this.changeOwnerPermission.bind(this)} />}
                {activePermissions && isEditContent && <ActiveEdit activePermissions={activePermissions} tronWeb={tronWeb} changeActivePermission={this.changeActivePermission.bind(this)} />}
                {modal}
            </main>)
    }
}