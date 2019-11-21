import React, {Component} from "react";

export default class OwnerRead extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div className='permission'>
            <div className='permission-title'>
                <span>Owner privilege</span>  
            </div>
            <div className='permission-desc'>
            Owner privilege is the highest privilege of the account. It is used to control the ownership of the user and adjust the permission structure. Owner privilege can also execute all contracts
            </div>
            <div className="permission-content">
                <div className="permission-item"> <span class="permission-label">Permission to name:</span> <span>owner</span></div>
                <div className="permission-item"> <span class="permission-label">Threshold value:</span> <span>1</span></div>
                <div className="permission-item permission-keys">
                    <span class="permission-label">keys:</span> 
                    <table>
                        <thead>
                            <tr><td>key</td><td>weight</td></tr>
                        </thead>
                        <tbody>
                            <tr><td>Txxxxxxxx</td> <td>1</td></tr>
                            <tr><td>Txxxxxxxx</td> <td>1</td></tr>
                        </tbody>
                    </table>
                    <div className='right-space'></div>
                </div>
            </div>
        </div>)
    }
}