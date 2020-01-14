import React, { Fragment } from "react";
import {AddressLink} from "../../../../common/Links";
import Field from "../../../../tools/TransactionViewer/Field";
export default function SignList(props) {
    const signList = props.signList || [];
    return (
        signList.length>0&&<ul className='child-list'>
                    {
                        signList.map((address,index)=>{
                            return <li><AddressLink key={index} address={address} /></li>
                        })
                    }
                </ul>
  
    )
}