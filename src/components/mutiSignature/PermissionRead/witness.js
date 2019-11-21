import React, {Component} from "react";

export default class WitnessRead extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
        <div className='permission'>
            <div className='permission-title'>
                <span>Superdelegate authority</span>  
            </div>
            <div className='permission-desc'>
            Superdelegate privileges are used to set block nodes
            </div>
            <div className="permission-content">
                <div className="permission-item"> 
                    <span class="permission-label">A piece of the node:</span> 
                    <span class="permission-address">TV3NmH1enpu4X5Hur8Z16eCyNymTqKXQDP</span>
                </div>
            </div>
        </div>)
    }
}