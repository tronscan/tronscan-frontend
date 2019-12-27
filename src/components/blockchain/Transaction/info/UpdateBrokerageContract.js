import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import SignList from './common/SignList'
import {TransationTitle} from './common/Title'
export default function UpdateBrokerageContract(props) {
    console.log(11111);
    const contract = props.contract;
    const {brokerage,signList,contractType} =contract;
    return <Fragment>
         <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="transation_owner_address"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="transaction_rewards_distribution_ratio">{brokerage}%</Field>
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}