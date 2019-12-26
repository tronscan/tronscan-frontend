import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import SignList from './common/SignList'
export default function ClearABIContract(props) {
    const contract = props.contract;
    const {signList} = contract;
    return <Fragment>
        <div className="card-body table-title">
            <h5>
                <i className="fa fa-exchange-alt"></i>
                &nbsp;&nbsp;
                交易类型-{contract.contractType}
            </h5>
        </div>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="owner_address"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="合约地址"><ContractLink address={'TD4anu8auWfCDYqQpAEcLXVK6UgME9Jsid'}/></Field>
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}