import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Input, Button } from 'antd';
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import OwnerRead from '../PermissionRead/owner'
import WitnessRead from '../PermissionRead/witness'
import ActiveRead from '../PermissionRead/active'
@connect(
    state => {
        return {
            wallet: state.wallet,
            account: state.app.account,
        }
    }
)
export default class MyPermission extends React.Component {
    constructor(props) {
        super(props);
        const { wallet } = this.props;
        console.log('wallet',wallet);
        this.state = {
            isEditOperateUser: false,
            isEditContent: false,
            curControlAddress: wallet.current.address,
            modal: null,
            ownerPermission: wallet.current.ownerPermission || null,
            activePermissions: wallet.current.activePermissions || [],
            witnessPermission: wallet.current.witnessPermission || null
        }
    }
    initState(){
      const { wallet } = this.props
       this.setState({
        curControlAddress: wallet.current.address,
        ownerPermission: wallet.current.ownerPermission || null,
        activePermissions: wallet.current.activePermissions || [],
        witnessPermission: wallet.current.witnessPermission || null
       },()=>{
           console.log('initState',wallet.current.address);
       })
    }
    componentDidUpdate(prevProps){
        const { wallet } = prevProps;
        if(wallet.current.address!=this.props.wallet.current.address){
            this.initState();
        }
    }
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
                finally{
                    this.setState({
                        isEditOperateUser: false
                    })
                }
                

            } catch (e) {
                isValid=false;
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={() => this.hideModal()} title='warn' style={{ marginLeft: '-240px', marginTop: '-195px' }}>
                            {e.toString()}
                        </SweetAlert>
                    )
                })
            }
            if(!isValid) return;
            // todo tronWeb获取新地址权限并校验
            const res = await tronWeb.trx.getAccount(curControlAddress);

            if (res) {
                const { active_permission, owner_permission, witness_permission } = res;
                // 校验新地址下有没有该地址的权限
                const {keys} = owner_permission;
                const isInKeys = keys.some(item=>{
                    console.log(tronWeb.address.fromHex(item.address),wallet.current.address)
                    return tronWeb.address.fromHex(item.address)==wallet.current.address
                })
                if(!isInKeys){
                    isValid=false;
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={() => this.hideModal()} title='warn'>
                                {'your address is not in control address keys'}
                            </SweetAlert>
                        ),
                        isEditOperateUser: true
                    })
                }
                else{
                    this.setState({
                        ownerPermission: owner_permission || null,
                        activePermissions: active_permission || [],
                        witnessPermission: witness_permission || null
                    })
                }
            } else {
                isValid=false;
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
    render() {
        const { isEditOperateUser, isEditContent, curControlAddress, modal, ownerPermission, witnessPermission, activePermissions } = this.state;
        
        const { wallet,tronWeb } = this.props;
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
                        <a href="javascript;" className='edit-permission'>Edit Permissions</a>
                    </div>

                </div>
                {ownerPermission && !isEditContent && <OwnerRead ownerPermission={ownerPermission} tronWeb={tronWeb} />}
                {witnessPermission && !isEditContent && <WitnessRead witnessPermission={witnessPermission} witnessNodeAddress={witnessAddressIfIs} tronWeb={tronWeb} />}
                {activePermissions.length > 0 && !isEditContent && <ActiveRead activePermissions={activePermissions}  tronWeb={tronWeb}/>}
                {modal}
            </main>)
    }
}