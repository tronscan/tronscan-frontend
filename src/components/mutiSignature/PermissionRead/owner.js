import React, {Component} from "react";

export default class OwnerRead extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const { ownerPermission,tronWeb } = this.props;
        const {keys,threshold,permission_name} = ownerPermission;
        const tableList = keys.map((item)=><tr key={item.address}><td>{tronWeb.address.fromHex(item.address)}</td><td>{item.weight}</td></tr>);                         
        return(
        <div className='permission'> 
            <div className='permission-title'>
                <span>Owner privilege</span>  
            </div>
            <div className='permission-desc'>
            Owner privilege is the highest privilege of the account. It is used to control the ownership of the user and adjust the permission structure. Owner privilege can also execute all contracts
            </div>
            <div className="permission-content">
                <div className="permission-item"> <span className="permission-label">Permission to name:</span> <span>{permission_name}</span></div>
                <div className="permission-item"> <span className="permission-label">Threshold value:</span> <span>{threshold}</span></div>
                <div className="permission-item permission-keys">
                    <span className="permission-label">keys:</span> 
                    <table>
                        <thead>
                            <tr><td>key</td><td>weight</td></tr>
                        </thead>
                        <tbody>
                           {tableList}
                        </tbody>
                    </table>
                    <div className='right-space'></div>
                </div>
            </div>
        </div>)
    }
}