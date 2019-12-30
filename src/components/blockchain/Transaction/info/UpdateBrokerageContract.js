import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import SignList from './common/SignList'
import {TransationTitle} from './common/Title'
import BandwidthUsage from './common/BandwidthUsage'
export default function UpdateBrokerageContract(props) {
    const contract = props.contract;
    const {brokerage,signList,contractType,cost} =contract;
    return <Fragment>
         <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="transaction_rewards_distribution_ratio">{brokerage}%</Field>
                <Field label="address_net_fee"><BandwidthUsage cost = {cost}/></Field>
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}