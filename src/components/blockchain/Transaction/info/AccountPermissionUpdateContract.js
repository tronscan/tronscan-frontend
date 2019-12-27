import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenTRC20Link } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { TransationTitle } from './common/Title'
import PermissionItem from './common/PermissionItem'
import SignList from './common/SignList'
export default function AccountPermissionUpdateContract(props) {
    const contract = props.contract;
    let { signList, contractType, owner, actives, withness } = contract;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] &&
                        <Field label="transation_owner_address"><AddressLink address={contract['owner_address']} /></Field>
                }
                <Field label="transation_fee">100 TRX</Field>
                {
                    owner && <PermissionItem permissionItem={owner} label='signature_privilege'/>
                }
                {
                    withness && <PermissionItem permissionItem={withness} label='signature_Superdelegate_authority'/>
                }
                {
                   actives && <PermissionItem permissionArray={actives} label='signature_active_permissions'/>
                }
                 <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment >
}