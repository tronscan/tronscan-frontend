import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {TransationTitle} from './common/Title'
import SignList from './common/SignList'
import { tu } from "../../../../utils/i18n";
import BandwidthUsage from './common/BandwidthUsage'
export default function UpdateEnergyLimitContract(props) {
    const contract = props.contract;
    const {signList,contractType,cost} = contract;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                 <Field label="contract_address"><ContractLink address={'TK3VSP3kwp7XssTGpisRSKGHE69nhk1hen'} /></Field>
                 <Field label="transaction_energy_cap" text={tu('transaction_enrgy_cap_tip')}>50000</Field>
                 <Field label="address_net_fee"><BandwidthUsage cost = {cost}/></Field>
                 <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}