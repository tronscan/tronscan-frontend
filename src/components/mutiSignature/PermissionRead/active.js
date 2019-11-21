import React, {Component,PureComponent} from "react";
import { getContractTypesByHex } from '../../../utils/mutiSignHelper';
export default class ActiveRead extends PureComponent{
    constructor(props){
        super(props)
    }
    getOperationsByHex(hex){
      const operations =  getContractTypesByHex(hex);
      return operations.map(item=>{
      return <li key={item.id}>{item.value.replace('Contract','')}</li>
      })
    }
    render(){
        const {activePermissions} = this.props;  
        return(
    
        <div className='permission'>
            <div className='permission-title'>
                <span>Active permissions</span>  
            </div>
            <div className='permission-desc'>
                Active permissions are used to provide a combination of permissions. For example, provide a permission that can only be performed to create accounts and transfer money Add up to eight active permissions
            </div>
            {
               activePermissions.map(item=>{
                   return  <div className="permission-content" key={item.id}>
                   <div className="permission-item"> 
                       <span className="permission-label">Permission to name:</span> 
                       <span>{item.permission_name}</span>
                   </div>
                   <div className="permission-item" style={{paddingBottom:0}}>
                       <span className="permission-label">Operations:</span>
                       <ul className='permission-operation-list'>
                           {
                                this.getOperationsByHex(item.operations)
                           }
                       </ul>
                   </div>
                   <div className="permission-item" style={{paddingTop:0}}> 
                       <span className="permission-label">Threshold value:</span> 
                        <span>{item.threshold}</span>
                   </div>
                   <div className="permission-item permission-keys">
                       <span className="permission-label">keys:</span> 
                       <table>
                           <thead>
                               <tr><td>key</td><td>weight</td></tr>
                           </thead>
                           <tbody>
                               {
                                   item.keys.map(itemKey=>{
                                   return <tr key={itemKey.address}><td>{itemKey.address}</td><td>{itemKey.weight}</td></tr>
                                   })
                               }
                           </tbody>
                       </table>
                       <div className='right-space'></div>
                   </div>
               </div>
               })
               
            }
        </div>)
    }
}