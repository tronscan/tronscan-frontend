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
            modal: null,
            ownerPermission: cloneDeep(ownerPermission) || null,
            activePermissions: cloneDeep(activePermissions) || [],
            witnessPermission: cloneDeep(witnessPermission)
        }
    }
    async initState(nextProps) {

        const { wallet } = nextProps
        const { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        //console.log('activePermissions222', activePermissions);
        this.setState({
            curControlAddress: wallet.current.address,
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
        const { wallet } = this.props;
        if (curControlAddress === wallet.current.address) {
            isValid = true;
            this.setState({
                isEditOperateUser: false
            })
        } else {
            try {
                tronWeb.address.toHex(curControlAddress);
                //校验是否合约地址
                try {
                    const contractInstance = await tronWeb.contract().at(curControlAddress)
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={() => this.hideModal()} title='warn'>
                                {'此地址为合约地址,不能设置'}
                            </SweetAlert>
                        )
                    })
                } catch (e) {
                    isValid = true;

                }
                finally {
                    this.setState({
                        isEditOperateUser: false
                    })
                }


            } catch (e) {
                isValid = false;
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={() => this.hideModal()} title='warn' style={{ marginLeft: '-240px', marginTop: '-195px' }}>
                            {e.toString()}
                        </SweetAlert>
                    )
                })
            }
            if (!isValid) return;
            // todo tronWeb获取新地址权限并校验
            const res = await tronWeb.trx.getAccount(curControlAddress);

            if (res) {
                const { active_permission, owner_permission, witness_permission } = res;
                // 校验新地址下有没有该地址的权限
                const { keys } = owner_permission;
                const isInKeys = keys.some(item => {
                    return tronWeb.address.fromHex(item.address) == wallet.current.address
                })
                if (!isInKeys) {
                    isValid = false;
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={() => this.hideModal()} title='warn'>
                                {'your address is not in control address keys'}
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
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={() => this.hideModal()} title='warn'>
                            {'Invalid address'}
                        </SweetAlert>
                    )
                })
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
            ownerPermission: changedOwnerPermission
        })
    }
    changeActivePermission(changedActivePermission) {
        this.setState({
            activePermissions: changedActivePermission
        })
    }
    comparePermissionIsChanged() {
        const { wallet } = this.props;
        const { ownerPermission, activePermissions, witnessPermission, curControlAddress } = this.state;
        const oldOwnerPermission = wallet.current.ownerPermission;
        const oldActivePermission = wallet.current.activePermissions;
        const oldWitnessPersmission = wallet.current.witnessPermission;
        let isEqualOwner = isEqual(oldOwnerPermission, ownerPermission);
        let isEqualActive = isEqual(oldActivePermission, activePermissions);
        let isEqualWitness = isEqual(oldWitnessPersmission, witnessPermission);
        return isEqualOwner && isEqualActive && isEqualWitness;
    }
    validKeys(keysItem) {
        const { tronWeb } = this.props;
        const item = keysItem;
        //('item',item);
        if (tronWeb.isAddress(item.address) && item.weight) {
            item.address = tronWeb.address.toHex(item.address);
            return true;
        } 
        return false;     
    }

    //点击保存
    async savePermission() {
        const { tronWeb } = this.props;
        const { ownerPermission, activePermissions, witnessPermission, curControlAddress } = this.state;

        if (this.comparePermissionIsChanged()) {
            this.setState({
                isEditContent: false
            })
            return false;
        }

        ownerPermission.type = 0;
        const threshold = ownerPermission.threshold;
        let sumOwnerKeysWeight = 0;
        const validAllOwnerKeys =  ownerPermission.keys.every(item => {
            if(!this.validKeys(item)){
               // item.address = tronWeb.address.toHex(item.address);
                return false
            }
            sumOwnerKeysWeight+=item.weight;
            return true
        })
    
        if(!validAllOwnerKeys){
            this.setState({
                modal: (
                    <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                        {'key\'s count should be greater than 0 or Incorrect address format'}
                    </SweetAlert>
                )
            });
            return;
        }
        //权重之和大于阈值
    
        if(sumOwnerKeysWeight<threshold){
            this.setState({
                modal: (
                    <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                        {'sum of all key\'s weight should not be less than threshold in permission Owner'}
                    </SweetAlert>
                )
            });
            return;
        }
        // active数据校验######################################################
        console.log('activePermissions',activePermissions);
        let isValidActivePermission = true;
        for(let i=0;i<activePermissions.length;i++){
            const acItem = activePermissions[i];
            acItem.type = 2;
            let sumKeysWeight = 0;
            const acItemThreshold = acItem.threshold;
            const validActivePermissionKeys = acItem.keys.every(item => {
                if(!this.validKeys(item)){
                    isValidActivePermission = false;
                     return false
                 }
                 sumKeysWeight+=item.weight;
                 return true
            })
            if(!validActivePermissionKeys){
                this.setState({
                    modal: (
                        <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                            {'Invalid activesPermissions provided'}
                        </SweetAlert>
                    )
                });
                break;
            }
            if(sumKeysWeight<acItemThreshold){
                isValidActivePermission=false;
                this.setState({
                    modal: (
                        <SweetAlert warning title="Update Permission" onConfirm={this.hideModal}>
                            {'sum of all key\'s weight should not be less than threshold in permission Active'}
                        </SweetAlert>
                    )
                });
                return;
            }
        }
        if(!isValidActivePermission){console.log('active vliad failed');return}

        const updateTransaction = await tronWeb.transactionBuilder.updateAccountPermissions(tronWeb.address.toHex(curControlAddress), ownerPermission, witnessPermission, activePermissions);
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
            this.setState({
                modal: (
                    <SweetAlert success title="Update Permission" onConfirm={this.hideModal}>
                        {'update permission success'}
                    </SweetAlert>
                ),
                isEditContent: false
            }, async () => {
                setTimeout(()=>{
                     this.props.reloadWallet();
                },500)
                
            });

        }
    }
    render() {
        const { isEditOperateUser, isEditContent, curControlAddress, modal, } = this.state;
        const { wallet, tronWeb } = this.props;
        const { ownerPermission, activePermissions, witnessPermission } = wallet.current;
        const witnessAddressIfIs = wallet.current.address;
        return (
            <main className='permission-main'>
                <div className='control-address'>
                    <span> Control Address:</span>
                    <Input size="small" value={curControlAddress} className={!isEditOperateUser ? 'read' : ''} readOnly={!isEditOperateUser} onChange={(e) => {
                        this.changeControlAddress(e)
                    }} />
                    <Button className="btn btn-danger" style={{ display: isEditOperateUser ? 'block' : 'none' }}
                        onClick={() => this.saveControlAddress()}>Save</Button>
                    <Button className="btn btn-default" style={{ display: !isEditOperateUser ? 'block' : 'none' }} onClick={() => {
                        this.setState({ isEditOperateUser: true })
                    }}>Alter</Button>
                </div>
                <div className="global-operate">
                    <h3>Authority structure</h3>
                    <div className="operate-btn">
                        <a href="javascript:;" className='edit-permission' style={{ display: !isEditContent ? 'inline-block' : 'none' }} onClick={() => { this.setState({ isEditContent: true }) }}><span className='edit'></span><span>Edit Permissions</span> </a>
                        <div className="buttonWarp" style={{ display: isEditContent ? 'inline-block' : 'none' }}>
                            <Button className="btn btn-default" onClick={() => { this.setState({ isEditContent: false }) }}>Cancel</Button>
                            <Button className="btn btn-danger" onClick={() => { this.savePermission() }}>Save</Button>
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