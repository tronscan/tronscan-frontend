import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {toThousands} from '../../../../utils/number'
import SignList from './common/SignList'
import {TransationTitle} from './common/Title'
import {tu} from "../../../../utils/i18n";
export default function ExchangeCreateContract(props) {
    const contract = props.contract;
    const {signList,first_token_balance,second_token_balance,contractType} = contract;
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
                <Field label="amount">{toThousands(first_token_balance)}/{toThousands(second_token_balance)}</Field>
                <Field label="transation_fee">1,024 TRX</Field>
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}