import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {TransationTitle} from './common/Title'
import SignList from './common/SignList'
import { tu } from "../../../../utils/i18n";
import BandwidthUsage from './common/BandwidthUsage'
export default function UpdateEnergyLimitContract(props) {
    const contract = props.contract;
    const {signature,contractType,cost,parameterValue} = contract;
    let signList = signature;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table">
            <tbody>
                {
                    contract['ownerAddress'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['ownerAddress']} /></Field>
                        : ''
                }
                 <Field label="contract_address"><ContractLink address={parameterValue.contract_address} /></Field>
            <Field label="transaction_energy_cap" text={tu('transaction_enrgy_cap_tip')}>{parameterValue.origin_energy_limit}</Field>
                 {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost}/></Field>}
                {signList&&signList.length>1&&<Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList}/></Field>}
            </tbody>
        </table>
    </Fragment>
}