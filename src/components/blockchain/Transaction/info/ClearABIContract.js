import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenTRC20Link } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import SignList from './common/SignList'
import { TransationTitle } from './common/Title'
import BandwidthUsage from './common/BandwidthUsage'
import { tu } from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
export default function ClearABIContract(props) {
    const contract = props.contract;
    const { signature_addresses, contractType, cost, contract_address } = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table">
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
                        <Tooltip
                            placement="top"
                            title={tu("transfersDetailContractAddress")}
                        >
                            <Icon
                                type="file-text"
                                style={{
                                    fontSize: 12,
                                    verticalAlign: 2,
                                    marginRight: 4,
                                    color: "#333"
                                }}
                            />
                        </Tooltip>
                        {contract_address}
                    </AddressLink>
                </Field>
                {JSON.stringify(contract.cost) !=
                    "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost} /></Field>}
                {signList && signList.length > 1 && <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList} /></Field>}
            </tbody>
        </table>
    </Fragment>
}