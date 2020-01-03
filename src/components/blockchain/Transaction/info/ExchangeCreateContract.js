import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenLink } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { toThousands } from '../../../../utils/number'
import SignList from './common/SignList'
import { TransationTitle } from './common/Title'

import BandwidthUsage from './common/BandwidthUsage'
import { tu } from "../../../../utils/i18n";
export default function ExchangeCreateContract(props) {
    const contract = props.contract;
    const { signature, first_token_balance, second_token_balance, contractType, cost, first_token_name, first_token_id,second_token_name } = contract;
    let signList = signature;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }

                <Field label="pairs"><TokenLink id={first_token_id} name={first_token_name}/> / {second_token_name}</Field>
                <Field label="amount">{toThousands(first_token_balance)}/{toThousands(second_token_balance)}</Field>
                <Field label="transaction_fee">1,024 TRX</Field>
                {JSON.stringify(contract.cost) !=
                    "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost} /></Field>}
                {signList && signList.length > 1 && <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList} /></Field>}
            </tbody>
        </table>
    </Fragment>
}