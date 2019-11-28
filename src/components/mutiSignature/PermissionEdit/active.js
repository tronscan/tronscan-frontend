import React, { Component, PureComponent, Children } from "react";
import { getContractTypesByHex, getContractTypesByGroup,getOperationsHexStrByContractIdArr } from '../../../utils/mutiSignHelper';
import { Input, Checkbox, Row, Col,Modal } from 'antd';
import SweetAlert from "react-bootstrap-sweetalert";
import { toNumber } from '../../../utils/number'
import { cloneDeep } from 'lodash'
import {tu} from "../../../utils/i18n"

export default class ActiveEdit extends Component {
    constructor(props) {
        super(props)
        const { activePermissions, tronWeb } = this.props;
        // activePermissions.forEach(item => {
        //     item.type=2;
        // })
        this.state = {
            activePermissions:cloneDeep(activePermissions),//所有active权限
            allPermissions:[],//所有的权限
            hasContractIds:[],//当前选中的权限
            modal: false,
            modifyIndex:null
        }
    }
    getOperationsByHex(hex) {
        if(!hex){return ''}
        const operations = getContractTypesByHex(hex);
        return operations.map(item => {
            return <li key={item.id}>{item.value.replace('Contract', '')}</li>
        })
    }
    addKeysItem(acIndex) {
        const activeArr = this.state.activePermissions;
        const activeItem = activeArr[acIndex];
        activeItem.keys.push({ address: '', weight: '' });
        this.setState({
            activePermissions: activeArr
        }, () => {
            this.changeParentActivePermission()
        })
    }
    removeKeysItem(acIndex, index, e) {
        const activeArr = this.state.activePermissions;
        const activeItem = activeArr[acIndex];
        let keys = activeItem.keys;
        if (keys.length <= 1) {
            return false;
        }
        keys.splice(index, 1);
        this.setState({
            keys
        }, () => {
            this.changeParentActivePermission();
        })
    }
    changeValue(acIndex, index, type, e) {
        const activeArr = this.state.activePermissions;
        const activeItem = activeArr[acIndex];
        if (type === 1) {
            activeItem.keys[index].address = e.target.value;
        } else {
            let value =  e.target.value;
            activeItem.keys[index].weight = toNumber(value);
        }
        this.setState({
            activePermissions: activeArr
        }, () => {
            this.changeParentActivePermission();
        })
    }
    changeValueByEvent(acIndex, e) {
        const activeArr = this.state.activePermissions;
        const activeItem = activeArr[acIndex];
        const target = e.target;
        const name = target.name;
        const value = name==='threshold'?toNumber(target.value):target.value;
        activeItem[name] = value;
        this.setState({
            activePermissions: activeArr
        }, () => {
            this.changeParentActivePermission();
        });
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
    onChangeCheck(checkedValues) {
        console.log('checked = ', checkedValues);
        this.setState({
            hasContractIds:checkedValues
        })
    }
    modifyPermission(acIndex) {
        const allPermissions = getContractTypesByGroup();
        const { activePermissions } = this.state;
        const hasContractOperations = activePermissions[acIndex].operations;
        let hasContractIds;
        if(!hasContractOperations){
            hasContractIds=[];
        }else{
            hasContractIds = getContractTypesByHex(hasContractOperations);
            hasContractIds = hasContractIds.map(item => {
                return item.id;
            })
        }
       
        this.setState({
            allPermissions,
            modal: true,
            modifyIndex:acIndex
        },()=>{
            this.setState({
                hasContractIds: hasContractIds,
            })
        })
    }
    deleteAcItem(acIndex){
        const { activePermissions } = this.state;
        activePermissions.splice(acIndex,1);
        this.setState({
            activePermissions:activePermissions
        },()=>{
            this.changeParentActivePermission();
        })
    }
    addActivePermission(){
        const { activePermissions } = this.state;
        activePermissions.push({
            operations:'',
            keys:[{key:'',weight:1}],
            threshold:1,
            permission_name:'',
            type:2
        })
        this.setState({
            activePermissions:activePermissions
        })
    }
    getCheckBox(item) {
        const { hasContractIds }= this.state;
        return item.map(childItem => {
            return <Col key={childItem.value} span={8}>
                <Checkbox
                    value={childItem.value}
                    style={{ fontSize: '12px', float: 'left' }} >{childItem.name.replace('Contract', '')}
                </Checkbox>
            </Col>
        })
    }
    Ok(){
        const {modifyIndex,activePermissions,hasContractIds} = this.state;
        if(hasContractIds.length===0){
            return false;
        }
        activePermissions[modifyIndex].operations = getOperationsHexStrByContractIdArr(hasContractIds).toLowerCase();
        //console.log(modifyIndex,activePermissions,hasContractIds);
        this.setState({
            activePermissions: activePermissions,
        }, () => {
            this.changeParentActivePermission();
            this.hideModal();
        });
    }
    render() {
        const { activePermissions, modal,allPermissions,hasContractIds } = this.state;
        const { tronWeb } = this.props;
        // todo 以下表单中的
        return (
            <div>
                <div className='permission'>
                    <div className='permission-title'>
                        <span className='permission-title-active'>{tu('signature_active_permissions')}</span><i>({activePermissions.length + '/' + 8})</i>
                        <a className='btn btn-danger ac-permission-add-btn' size='small' onClick={()=>{this.addActivePermission()}}><span>+</span><span>Add permission</span></a>
                    </div>
                    <div className='permission-desc'>
                        {tu('signature_active_permissions_desc')}
                </div>
                    {
                        activePermissions.map((item, acIndex) => {
                            return <div className="permission-content" key={acIndex}>
                                <a href="javascript:;" className='permission-delete' onClick={(e)=>{this.deleteAcItem(acIndex,e)}}></a>
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
                                        <li className='permission-modify' onClick={(e) => { this.modifyPermission(acIndex, e) }}><span>+</span><span>add</span></li>
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
                                            <tr><td>{'signature_key'}</td><td>{tu('signature_weight')}</td></tr>
                                        </thead>
                                        <tbody>
                                            {
                                                item.keys.map((itemKey, index) => {
                                                    return <tr key={index} className='edit-tr'>
                                                        <td style={{ paddingLeft: 0 }}><Input value={tronWeb.address.fromHex(itemKey.address)} onChange={(e) => { this.changeValue(acIndex, index, 1, e) }} /></td>
                                                        <td><Input value={itemKey.weight} onChange={(e) => { this.changeValue(acIndex, index, 2, e) }} />
                                                            <a href="javascript:;" className='cac-btn minus' onClick={(e) => { this.removeKeysItem(acIndex, index) }}>-</a>
                                                            <a href="javascript:;" className='cac-btn plus' style={{ visibility: index === (item.keys.length - 1)&&item.keys.length<5 ? 'visible' : 'hidden' }} onClick={() => { this.addKeysItem(acIndex) }}  >+</a>
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
                        visible={modal}
                        onCancel={this.hideModal}
                        onOk={this.Ok.bind(this)}
                        wrapClassName='permission-modal'
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
                </div>

            </div>)
    }
}