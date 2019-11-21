import React, {Fragment} from "react";
import {connect} from "react-redux";
import { Input,Button } from 'antd';
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";
import OwnerRead from '../PermissionRead/owner'
@connect(
    state => {
      return {
        wallet: state.wallet,
    }}
)
export default class MyPermission extends React.Component {
    constructor(props){
        super(props);
        const { wallet } = this.props;
        this.state={
            isEditOperateUser:false,
            isEditContent:false,
            curControlAddress:wallet.current.address,
            modal: null,
            ownerPermission:wallet.current.ownerPermission||[],
            activePermissions:wallet.current.activePermissions ||[],
            witnessPermission: wallet.current.witnessPermission || []
        }
    }
    hideModal = () => {
        this.setState({
          modal: null,
        });
      };
    async saveControlAddress(){
        //校验地址规则
        let isValid = false;
        const { tronWeb } = this.props;
        const curControlAddress = this.state.curControlAddress
        const { wallet } = this.props;
        if(curControlAddress === wallet.current.address ){
            isValid = true;
        }else{
            try{
                tronWeb.address.toHex(curControlAddress);
                //校验是否合约地址
                try{
                    const contractInstance = await tronWeb.contract().at(curControlAddress) 
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={()=>this.hideModal()} title='warn'>
                            {'此地址为合约地址,不能设置'}
                            </SweetAlert>
                        )
                    })
                }catch(e){
                    isValid = true;
                    this.setState({
                        isEditOperateUser:false
                    })
                }
                this.setState({
                    isEditOperateUser:false
                })
                
            }catch(e){
                this.setState({
                    modal: (
                        <SweetAlert warning onConfirm={()=>this.hideModal()} title='warn' style={{marginLeft: '-240px', marginTop: '-195px'}}>
                        {e.toString()}
                        </SweetAlert>
                    )
                })
            }
            if(isValid){
                // todo tronWeb获取新地址权限并校验新地址下有没有该地址的权限
                const res = await tronWeb.trx.getAccount(curControlAddress);
                if(res){
                    const { active_permission ,owner_permission,witness_permission} = res;
                    this.setState({
                        ownerPermission:owner_permission||[],
                        activePermissions:active_permission||[],
                        witnessPermission:witness_permission||[]
                    })
                }else{
                    this.setState({
                        modal: (
                            <SweetAlert warning onConfirm={()=>this.hideModal()} title='warn'>
                            {'Invalid address'}
                            </SweetAlert>
                        )
                    })
                }
            }
        }
        
        
    }
    changeControlAddress(event){
        this.setState({
            curControlAddress:event.target.value
        })
    }
    componentDidMount(){
    }
    render(){
        const {isEditOperateUser,isEditContent,curControlAddress,modal} = this.state;
        const {wallet} = this.props;
        return (
         <main className='permission-main'>
             <div className='control-address'>
                 <span> Control Address:</span> 
                 <Input size="small" defaultValue={curControlAddress} className={!isEditOperateUser?'read':''} readOnly={!isEditOperateUser} onChange={(e)=>{
                     this.changeControlAddress(e)
                 }} />
                 <Button className="btn btn-danger" style={{display:isEditOperateUser?'block':'none'}} 
                 onClick={()=>this.saveControlAddress()}>Save</Button>
                 <Button className="btn btn-default" style={{display:!isEditOperateUser?'block':'none'}}  onClick={()=>{
                     this.setState({isEditOperateUser:true})
                 }}>Alter</Button>
             </div>
             <div className="global-operate">
                     <h3>Authority structure</h3>
                     <div className="operate-btn">
                         <a href="javascript;" className='edit-permission'>Edit Permissions</a>
                     </div>
                      
            </div> 
            <OwnerRead/> 
             {modal}
        </main>)
    }
}