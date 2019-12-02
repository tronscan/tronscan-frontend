import React, {Component} from "react";
import { Input } from 'antd';
import { cloneDeep } from 'lodash'
import { toNumber } from '../../../utils/number'
import {tu} from "../../../utils/i18n"

export default class OwnerEdit extends Component{
    constructor(props){
        super(props)
        const { ownerPermission,tronWeb } = this.props;
        const {keys,threshold,permission_name} = ownerPermission;
        this.state={
            keys:cloneDeep(keys),
            threshold:threshold,
            permission_name:permission_name
        }
    }
    addKeysItem(){
        let curKeys = this.state.keys;
     
        curKeys.push({address:'',weight:''});
        this.setState({
            keys:curKeys
        },()=>{
            this.changeParentOwenrPermission();
        })
    }
    removeKeysItem(index,e){
        let { keys }= this.state;
        if(keys.length<=1){
            return false;
        }
        keys.splice(index,1);
        this.setState({
            keys
        },()=>{
            this.changeParentOwenrPermission();
        })
    }
    changeValue(index,type,e){
        let curKeys = this.state.keys;
        if(type===1){
            curKeys[index].address=e.target.value;
        }else{
            let value =  e.target.value;
            curKeys[index].weight = toNumber(value);     
        }
        this.setState({
            keys:curKeys
        },()=>{
            this.changeParentOwenrPermission();
        })
    }
    changeValueByEvent(e){
        const target = e.target;
        const name = target.name;
        const value = name==='threshold'?toNumber(target.value):target.value;
        this.setState({
        [name]: value
        },()=>{
           this.changeParentOwenrPermission();
        });
    }
    changeParentOwenrPermission(){
        const { changeOwnerPermission }=this.props;
        let {keys,threshold,permission_name} = this.state;
        //console.log('keys',keys);
        // keys = keys.filter(item=>{
        //     return item.address && item.weight
        // })
        changeOwnerPermission({keys,threshold,permission_name});
    }

    render(){
        const {tronWeb } = this.props;
        const {keys,threshold,permission_name} = this.state;
        //console.log('render',keys);
        const tableList = keys.map((item,index)=><tr className='edit-tr' key={index}>
            <td style={{paddingLeft:0}}><Input defaultValue={tronWeb.address.fromHex(item.address)} onChange={(e)=>{this.changeValue(index,1,e)}}/></td>
            <td><Input value={ item.weight } onChange={(e)=>{this.changeValue(index,2,e)}}/>
                <a href="javascript:;" className='cac-btn minus' onClick={(e)=>{this.removeKeysItem(index)}}>-</a>
                <a href="javascript:;" className='cac-btn plus' style={{visibility:index===(keys.length-1)&&keys.length<5?'visible':'hidden'}} onClick={()=>{this.addKeysItem()}}  >+</a>
            </td></tr>);                         
        return(
        <div className='permission'> 
            <div className='permission-title'>
                <span>{tu('signature_privilege')}</span>  
            </div>
            <div className='permission-desc'>
                {tu('signature_privilege_desc')}
            </div>
            <div className="permission-content">
                <div className="permission-item"> <span className="permission-label">{tu('signature_permission')}:</span> <span><Input value={permission_name} name='permission_name' onChange={(e)=>{this.changeValueByEvent(e)}}/></span></div>
                <div className="permission-item"> <span className="permission-label">{tu('signature_threshold')}:</span> <span><Input value={threshold} name='threshold' onChange={(e)=>{this.changeValueByEvent(e)}}/></span></div>
                <div className="permission-item permission-keys">
                    <span className="permission-label">{tu('signature_keys')}:</span> 
                    <table>
                        <thead>
                            <tr><td>{tu('signature_key')}</td><td>{tu('signature_weight')}</td></tr>
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