import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {toThousands} from '../../../../utils/number'
import SignList from './common/SignList'
export default function ExchangeCreateContract(props) {
    const contract = props.contract;
    const {contractData,signList} = contract;
    const {first_token_balance,second_token_balance} = contract;
    return <Fragment>
        <div className="card-body table-title">
            <h5>
                <i className="fa fa-exchange-alt"></i>
                &nbsp;&nbsp;
                交易类型-{contract.contractType}
            </h5>
        </div>
        <table className="table">
            <tbody>
                {
                    contract['owner_address'] ?
                        <Field label="owner_address"><AddressLink address={contract['owner_address']} /></Field>
                        : ''
                }
                <Field label="交易对"></Field>
                <Field label="数额">{toThousands(first_token_balance)}/{toThousands(second_token_balance)}</Field>
                <Field label="费用">1,024 TRX</Field>
                {/* 消耗带宽 */}
                {/* 签名列表 */}
                
                <SignList signList={signList}/>
            </tbody>
        </table>
    </Fragment>
}