import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {toThousands} from '../../../../utils/number'
import SignList from './common/SignList'
import {TransationTitle} from './common/Title'
import BandwidthUsage from './common/BandwidthUsage'
export default function ExchangeTransactionContract(props) {
    const contract = props.contract;
    const {quant,signList,contractType,cost} = contract;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="pairs"></Field>
                <Field label="token_tracker"></Field>
                <Field label="amount">{toThousands(quant)}</Field>
                <Field label="address_net_fee"><BandwidthUsage cost = {cost}/></Field>
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}