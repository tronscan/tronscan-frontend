import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {toThousands} from '../../../../utils/number'
import SignList from './common/SignList'
import {TransationTitle} from './common/Title'
export default function ExchangeTransactionContract(props) {
    const contract = props.contract;
    const {quant,signList,contractType} = contract;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="transation_owner_address"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="pairs"></Field>
                <Field label="token_tracker"></Field>
                <Field label="amount">{toThousands(quant)}</Field>
                {/* 消耗带宽 */}
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}