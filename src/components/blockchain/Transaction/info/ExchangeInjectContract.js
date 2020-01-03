import React, { Fragment } from "react";
import { AddressLink, TokenLink } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { toThousands } from '../../../../utils/number'
import SignList from './common/SignList'
import { TransationTitle } from './common/Title'
import { tu } from "../../../../utils/i18n";
import BandwidthUsage from './common/BandwidthUsage'
export default function ExchangeInjectContract(props) {
    const contract = props.contract;
    const { quant, signature_addresses, contractType, cost, exchangeInfo } = contract;
    const { first_token_name, first_token_id, second_token_name } = exchangeInfo;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="pairs">{first_token_name} / {second_token_name}</Field>
                <Field label="token_tracker"><TokenLink id={first_token_id} name={first_token_name}/></Field>
                <Field label="amount">{toThousands(quant)}</Field>
                {JSON.stringify(contract.cost) !=
                    "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost} /></Field>}
                {signList && <Field label="signature_list"><SignList signList={signList} /></Field>}
            </tbody>
        </table>
    </Fragment>
}