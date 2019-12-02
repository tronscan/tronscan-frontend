import React, { Component, PureComponent, Children } from "react";
import { getContractTypesByHex, getContractTypesByGroup, getOperationsHexStrByContractIdArr } from '../../../utils/mutiSignHelper';
import { Input, Checkbox, Row, Col, Modal, Form, InputNumber } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import { toNumber } from '../../../utils/number'
import { cloneDeep } from 'lodash'
import { tu } from "../../../utils/i18n"

export default class ActiveEdit extends Component {
    constructor(props) {
        super(props)
        const { activePermissions, tronWeb } = this.props;
        // activePermissions.forEach(item => {
        //     item.type=2;
        // })
        this.state = {
            activePermissions: cloneDeep(activePermissions),//所有active权限
            allPermissions: [],//所有的权限
            hasContractIds: [],//当前选中的权限
            modal: false,
            permissionModal:false,
            addActiveModal: false,
            modifyIndex: null,
            willAddActive: {
                operations: '',
                keys: [{ address: '', weight: 1 }],
                threshold: 1,
                permission_name: '',
                type: 2
            }
        }
    }
    getOperationsByHex(hex) {
        if (!hex) { return '' }
        const operations = getContractTypesByHex(hex);
        return operations.map(item => {
            return <li key={item.id}>{item.value.replace('Contract', '')}</li>
        })
    }
    addKeysItem(acIndex) {
        const activeArr = this.state.activePermissions;
        let activeItem;
        if (acIndex !== null) {
            activeItem = activeArr[acIndex];
        } else {
            activeItem = this.state.willAddActive;
        }
        activeItem.keys.push({ address: '', weight: '' });
        if (acIndex !== null) {
            this.setState({
                activePermissions: activeArr
            }, () => {
                this.changeParentActivePermission()
            })
        } else {
            this.setState({
                willAddActive: activeItem
            })
        }
    }
    removeKeysItem(acIndex, index, e) {
        const activeArr = this.state.activePermissions;
        let activeItem;
        if (acIndex !== null) {
            activeItem = activeArr[acIndex];
        } else {
            activeItem = this.state.willAddActive;
        }
        let keys = activeItem.keys;
        if (keys.length <= 1) {
            return false;
        }
        keys.splice(index, 1);
        if (acIndex !== null) {
            this.setState({
                activePermissions: activeArr
            }, () => {
                this.changeParentActivePermission();
            })
        }else{
            this.setState({
                willAddActive:activeItem
            })
        }

    }
    changeValue(acIndex, index, type, e) {
        const activeArr = this.state.activePermissions;
        let activeItem;
        if (acIndex !== null) {
            activeItem = activeArr[acIndex];
        } else {
            activeItem = this.state.willAddActive;
        }

        if (type === 1) {
            activeItem.keys[index].address = e.target.value;
        } else {
            let value = e.target.value;
            activeItem.keys[index].weight = toNumber(value);
        }
        if (acIndex != null) {
            this.setState({
                activePermissions: activeArr
            }, () => {
                this.changeParentActivePermission();
            })
        } else {
            this.setState({
                willAddActive: activeItem
            })
        }

    }
    changeValueByEvent(acIndex, e) {
        const activeArr = this.state.activePermissions;
        let activeItem;
        if (acIndex !== null) {
            activeItem = activeArr[acIndex];
        } else {
            activeItem = this.state.willAddActive;
        }
        const target = e.target;
        const name = target.name;
        const value = name === 'threshold' ? toNumber(target.value) : target.value;
        activeItem[name] = value;
        console.log('activeItem',activeItem,name);
        if (acIndex !== null) {
            this.setState({
                activePermissions: activeArr
            }, () => {
                this.changeParentActivePermission();
            });
        } else {
            this.setState({
                willAddActive: activeItem
            })
        }

    }
    changeParentActivePermission() {
        const { changeActivePermission } = this.props;
        let { activePermissions } = this.state;
        let cloneActivePermissions = cloneDeep(activePermissions)
        // cloneActivePermissions.forEach(item=>{
        //     item.keys = item.keys.filter(keyItem=>{
        //         return keyItem.address && keyItem.weight
        //     })
        // })
        changeActivePermission(cloneActivePermissions);
    }
    hideModal = () => {
        this.setState({
            modal: false,
        });
    };
    hidePermissionModal=()=>{
        this.setState({
            permissionModal:false
        })
    }
    hideActiveModal() {
        this.setState({
            addActiveModal: false,
        });
    }
    onChangeCheck(checkedValues) {
        console.log('checked = ', checkedValues);
        this.setState({
            hasContractIds: checkedValues
        })
    }
    modifyPermission(acIndex) {
        const allPermissions = getContractTypesByGroup();
        let hasContractIds = [];
        if (acIndex!=null) {
            const { activePermissions } = this.state;
            const hasContractOperations = activePermissions[acIndex].operations;
            if (hasContractOperations) {

                hasContractIds = getContractTypesByHex(hasContractOperations);
                hasContractIds = hasContractIds.map(item => {
                    return item.id;
                })
            }
        } else {
            const { willAddActive } = this.state;
            const hasContractOperations = willAddActive.operations;
            if (hasContractOperations) {

                hasContractIds = getContractTypesByHex(hasContractOperations);
                hasContractIds = hasContractIds.map(item => {
                    return item.id;
                })
            }
        }
        this.setState({
            allPermissions,
            permissionModal: true,
            modifyIndex: acIndex
        }, () => {
            this.setState({
                hasContractIds: hasContractIds,
            })
        })
    }
    deleteAcItem(acIndex) {
        const { activePermissions } = this.state;
        activePermissions.splice(acIndex, 1);
        this.setState({
            activePermissions: activePermissions
        }, () => {
            this.changeParentActivePermission();
        })
    }
    openAddActiveModal(){
        const { activePermissions } = this.state;
        if(activePermissions.length>=8){
            return false;
        }
        this.setState({
            willAddActive: {
                operations: '',
                keys: [{ address: '', weight: 1 }],
                threshold: 1,
                permission_name: '',
                type: 2
            },
            addActiveModal: true,
        })
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
            modal: (
                <SweetAlert warning title="" onConfirm={this.hideModal}>
                    {msg}
                </SweetAlert>
            )
        });
    }
    validKeys(keysItem,keysArr) {
        const { tronWeb } = this.props;
        const item = keysItem;
        if(keysArr.length ===0){
            this.warningAlert("keys is required.");
            return false;
        }
        if (!tronWeb.isAddress(item.address)) {
            this.warningAlert("signature_invalid_Address");
            return false;
        }
        if (!item.weight) {
            this.warningAlert(tu("signature_weight_required"));
            return false;
        }

        if (this.findIsSameKey(item, keysArr)) {
            this.warningAlert(tu("signature_address_not_similar"));
            return false;
        }
        return true;

    }
    findIsSameKey(itemKey, arr) {
        let count = 0;
        const {tronWeb}  = this.props;
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
    OkAddActive() {
        const { activePermissions,willAddActive } = this.state;
        //校验willAddActive
        console.log(willAddActive);
        const {keys,permission_name,threshold,operations} = willAddActive;
        if(!permission_name){
            this.warningAlert('permissionName is required.');
            return;
        }
        if(!operations){
            this.warningAlert('operations is required.');
            return;
        }
        if(!threshold){
            this.warningAlert('threshold is required.');
            return;
        }
        let sumOwnerKeysWeight = 0;
        const validAddActiveKeys = keys.every(item => {
            if (!this.validKeys(item, keys)) {
                return false
            }
            sumOwnerKeysWeight += item.weight;
            return true
        })
        if(!validAddActiveKeys){return false}
        if(sumOwnerKeysWeight<threshold){
            this.warningAlert(tu('signature__less_threshold_owner'))
            return;
        }
        activePermissions.push({...this.state.willAddActive});
        this.setState({
            activePermissions:activePermissions
        },()=>{
            this.hideActiveModal();
            this.changeParentActivePermission();
        })
    }
    getCheckBox(item) {
        const { hasContractIds } = this.state;
        return item.map(childItem => {
            return <Col key={childItem.value} span={8}>
                <Checkbox
                    value={childItem.value}
                    style={{ fontSize: '12px', float: 'left' }} >{childItem.name.replace('Contract', '')}
                </Checkbox>
            </Col>
        })
    }
    //修改权限弹框ok
    Ok() {
        const { modifyIndex, activePermissions, hasContractIds, willAddActive } = this.state;
        if (hasContractIds.length === 0) {
            return false;
        }
        if (modifyIndex != undefined) {
            activePermissions[modifyIndex].operations = getOperationsHexStrByContractIdArr(hasContractIds).toLowerCase();
            //console.log(modifyIndex,activePermissions,hasContractIds);
            this.setState({
                activePermissions: activePermissions,
            }, () => {
                this.changeParentActivePermission();
            });
        } else {

            willAddActive.operations = getOperationsHexStrByContractIdArr(hasContractIds).toLowerCase();
            this.setState({
                willAddActive
            })

        }
        this.hidePermissionModal();

    }
    render() {
        const { activePermissions, modal, permissionModal,allPermissions, hasContractIds, addActiveModal, willAddActive } = this.state;
        const { tronWeb } = this.props;
        //  以下表单中的
        return (
            <div>
                <div className='permission'>
                    <div className='permission-title'>
                        <span className='permission-title-active'>{tu('signature_active_permissions')}</span><i>({activePermissions.length + '/' + 8})</i>
        <a className='btn btn-danger ac-permission-add-btn' size='small' onClick={() => { this.openAddActiveModal() }}><span>+</span><span>{tu('signature_add_permissions')}</span></a>
                    </div>
                    <div className='permission-desc'>
                        {tu('signature_active_permissions_desc')}
                    </div>
                    {
                        activePermissions.map((item, acIndex) => {
                            return <div className="permission-content" key={acIndex}>
                                <a href="javascript:;" className='permission-delete' onClick={(e) => { this.deleteAcItem(acIndex, e) }}></a>
                                <div className="permission-item">
                                    <span className="permission-label">{tu('signature_permission')}:</span>
                                    <span><Input value={item.permission_name} name='permission_name' onChange={(e) => { this.changeValueByEvent(acIndex, e) }} /></span>
                                </div>
                                <div className="permission-item" style={{ paddingBottom: 0 }}>
                                    <span className="permission-label">{tu('signature_Operations')}:</span>
                                    <ul className='permission-operation-list'>
                                        {
                                            this.getOperationsByHex(item.operations)
                                        }
                                        <li className='permission-modify' onClick={(e) => { this.modifyPermission(acIndex, e) }}><span>+</span><span>{tu('signature_add')}</span></li>
                                    </ul>
                                </div>
                                <div className="permission-item" style={{ paddingTop: 0 }}>
                                    <span className="permission-label">{tu('signature_threshold')}:</span>
                                    <span><Input value={item.threshold} name='threshold' onChange={(e) => { this.changeValueByEvent(acIndex, e) }} /></span>
                                </div>
                                <div className="permission-item permission-keys">
                                    <span className="permission-label">{tu('signature_keys')}:</span>
                                    <table>
                                        <thead>
                                            <tr><td>{tu('signature_key')}</td><td>{tu('signature_weight')}</td></tr>
                                        </thead>
                                        <tbody>
                                            {
                                                
                                                item.keys.map((itemKey, index) => {
                                                    if(itemKey.address && tronWeb.isAddress(itemKey.address)){
                                                        itemKey.address = tronWeb.address.fromHex(itemKey.address);
                                                    }
                                                    return <tr key={index} className='edit-tr'>
                                                        <td style={{ paddingLeft: 0 }}><Input value={itemKey.address} onChange={(e) => { this.changeValue(acIndex, index, 1, e) }} /></td>
                                                        <td><Input value={itemKey.weight} onChange={(e) => { this.changeValue(acIndex, index, 2, e) }} />
                                                            <a href="javascript:;" className='cac-btn minus' style={{ visibility: index=== 0 && item.keys.length===1 ?'hidden':'visible'}} onClick={(e) => { this.removeKeysItem(acIndex, index) }}>-</a>
                                                            <a href="javascript:;" className='cac-btn plus' style={{ visibility: index === (item.keys.length - 1) && item.keys.length < 5 ? 'visible' : 'hidden' }} onClick={() => { this.addKeysItem(acIndex) }}  >+</a>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                    <div className='right-space'></div>
                                </div>
                            </div>
                        })

                    }
                    <Modal
                        title="Modify Permission"
                        visible={permissionModal}
                        onCancel={this.hidePermissionModal}
                        onOk={this.Ok.bind(this)}
                        wrapClassName='permission-modal'
                        zIndex={5450}
                    >

                        <div className="permission-edit-check">
                            {/* <h4>Modify Permission</h4> */}
                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeCheck.bind(this)} value={hasContractIds}>
                                {
                                    allPermissions.map(item => {
                                        return (<div className='permission-edit-item' key={item.key}>

                                            <h5 style={{ textAlign: 'left' }}>{item.key}</h5>
                                            <Row style={{ textAlign: 'left' }}>
                                                {
                                                    this.getCheckBox(item.value)
                                                }
                                            </Row>
                                            {/* item.value.map((childItem)=><Col span={5}><Checkbox value={childItem.value}>{childItem.name}</Checkbox></Col>) */}
                                        </div>)
                                    })
                                }
                            </Checkbox.Group>
                        </div>
                    </Modal>
                    <Modal
                        title="Add Active Permission"
                        visible={addActiveModal}
                        onCancel={()=>this.hideActiveModal()}
                        onOk={()=>this.OkAddActive()}
                        wrapClassName='permission permission-modal'
                        zIndex={5400}
                    >
                        <div className="permission-content">

                            <div className="permission-item">
                                <span className="permission-label">{tu('signature_permission')}:</span>
                                <span><Input name='permission_name' value={willAddActive.permission_name} onChange={(e) => { this.changeValueByEvent(null, e) }} /></span>
                            </div>
                            <div className="permission-item" style={{ paddingBottom: 0 }}>
                                <span className="permission-label">{tu('signature_Operations')}:</span>
                                <ul className='permission-operation-list'>
                                    {
                                        this.getOperationsByHex(willAddActive.operations)
                                    }
                                    <li className='permission-modify' onClick={(e) => { this.modifyPermission(undefined, e) }}><span>+</span><span>{tu('signature_add')}</span></li>
                                </ul>
                            </div>
                            <div className="permission-item" style={{ paddingTop: 0 }}>
                                <span className="permission-label">{tu('signature_threshold')}:</span>
                                <span><Input name='threshold' value={willAddActive.threshold} onChange={(e) => { this.changeValueByEvent(null, e) }} /></span>
                            </div>
                            <div className="permission-item permission-keys">
                                <span className="permission-label">{tu('signature_keys')}:</span>
                                <table>
                                    <thead>
                                        <tr><td>{tu('signature_key')}</td><td>{tu('signature_weight')}</td></tr>
                                    </thead>
                                    <tbody>
                                        {
                                            willAddActive.keys.map((itemKey, index) => {
                                                return <tr key={index} className='edit-tr'>
                                                    <td style={{ paddingLeft: 0 }}><Input value={itemKey.address} onChange={(e) => { this.changeValue(null, index, 1, e) }} /></td>
                                                    <td><Input value={itemKey.weight} onChange={(e) => { this.changeValue(null, index, 2, e) }} style={{width:'50px'}} />
                                                        <a href="javascript:;" className='cac-btn minus' style={{ visibility: index=== 0 && willAddActive.keys.length===1 ?'hidden':'visible'}} onClick={(e) => { this.removeKeysItem(null, index) }}>-</a>
                                                        <a href="javascript:;" className='cac-btn plus' style={{ visibility: index === (willAddActive.keys.length - 1) && willAddActive.keys.length < 5 ? 'visible' : 'hidden' }} onClick={() => { this.addKeysItem(null) }}  >+</a>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>

                            </div>
                        </div>

                    </Modal>
                </div>
                {modal}

            </div>)
    }
}