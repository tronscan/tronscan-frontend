import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {TransationTitle} from './common/Title'
import SignList from './common/SignList'
import { tu } from "../../../../utils/i18n";
import BandwidthUsage from './common/BandwidthUsage'
import { toThousands } from '../../../../utils/number'
import { Icon, Tooltip } from "antd";
export default function UpdateEnergyLimitContract(props) {
    const contract = props.contract;
    const {signature_addresses,contractType,cost,parameterValue,contract_address} = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table table-responsive">
            <tbody>
                {
                    contract['ownerAddress'] ?
                        <Field label="transaction_owner_address"><AddressLink address={contract['ownerAddress']} /></Field>
                        : ''
                }
                 <Field label="contract_address">
                    <AddressLink
                        address={contract_address}
                        isContract={true}
                    >
                        {contract_address}
                    </AddressLink>
                </Field>
<Field label="transaction_energy_cap" tip={true} text={tu('transaction_enrgy_cap_tip')}>{toThousands(parameterValue.origin_energy_limit)} {tu('energy')}</Field>
                 {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost}/></Field>}
                {signList&&signList.length>1&&<Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList}/></Field>}
            </tbody>
        </table>
    </Fragment>
}