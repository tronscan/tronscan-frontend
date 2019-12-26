import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
export default function UpdateEnergyLimitContract(props) {
    const contract = props.contract;
    return <Fragment>
        <div className="card-body table-title">
            <h5>
                <i className="fa fa-exchange-alt"></i>
                &nbsp;&nbsp;
            {contract.contractType}
            </h5>
        </div>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="owner_address"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                 <Field label="合约地址"><ContractLink address={'TK3VSP3kwp7XssTGpisRSKGHE69nhk1hen'} /></Field>
                 <Field label="能量上线">50000</Field>
            </tbody>
        </table>
    </Fragment>
}