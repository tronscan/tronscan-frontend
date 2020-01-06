import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenTRC20Link } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { TransationTitle } from './common/Title'
import { tu } from "../../../../utils/i18n";
import SignList from './common/SignList'
import BandwidthUsage from './common/BandwidthUsage'
export default function UpdateSettingContract(props) {
    const contract = props.contract;
    const { cost, signature_addresses, contractType, parameterValue, consume_user_resource_percent } = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table">
            <tbody>
                {
                    contract['ownerAddress'] ?
                        <Field label="signature_sponsor"><AddressLink address={contract['ownerAddress']} /></Field>
                        : ''
                }
                <Field label="contract_address"><ContractLink address={parameterValue.contract_address} /></Field>
                {consume_user_resource_percent && <Field label="contract_enery" text={tu("contract_enery_tip")}>{tu('contract_percent')}{100 - consume_user_resource_percent}% <span style={{paddingLeft:'10px'}}></span> {tu('contract_percent_user')}{consume_user_resource_percent}% </Field>}
                {JSON.stringify(cost) !=
                    "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost} /></Field>}
                {signList && signList.length > 1 && <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList} /></Field>}
            </tbody>
        </table>
    </Fragment>
}