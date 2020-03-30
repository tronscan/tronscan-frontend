import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenTRC20Link } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { TransationTitle } from './common/Title'
import { tu } from "../../../../utils/i18n";
import SignList from './common/SignList'
import BandwidthUsage from './common/BandwidthUsage'
import {injectIntl} from "react-intl";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';


function UpdateSettingContract({contract,intl}) {
    const { cost, signature_addresses, contractType, contract_address, consume_user_resource_percent } = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table table-responsive">
            <tbody>
                {
                    contract['ownerAddress'] ?
                        <Field label="transaction_owner_address">
                            <span className="d-flex">
                                {/*  Distinguish between contract and ordinary address */}
                                {contract.contract_map[contract["owner_address"]]? (
                                    <span className="d-flex">
                                    <Tooltip
                                        placement="top"
                                        title={upperFirst(
                                        intl.formatMessage({
                                            id: "transfersDetailContractAddress"
                                        })
                                        )}
                                    >
                                        <Icon
                                        type="file-text"
                                        style={{
                                            verticalAlign: 0,
                                            color: "#77838f",
                                            lineHeight: 1.4
                                        }}
                                        />
                                    </Tooltip>
                                    <AddressLink address={contract["owner_address"]} isContract={true}>
                                        {contract["owner_address"]}
                                    </AddressLink>
                                    </span>
                                ) :
                                <AddressLink address={contract["owner_address"]}>
                                    {contract["owner_address"]}
                                </AddressLink>
                                }
                            </span>
                        </Field>
                        : ''
                }
               <Field label="contract_address">
                    <span className="d-flex">
                        {/*  Distinguish between contract and ordinary address */}
                        {contract.contract_map[contract["contract_address"]]? (
                            <span className="d-flex">
                            <Tooltip
                                placement="top"
                                title={upperFirst(
                                intl.formatMessage({
                                    id: "transfersDetailContractAddress"
                                })
                                )}
                            >
                                <Icon
                                type="file-text"
                                style={{
                                    verticalAlign: 0,
                                    color: "#77838f",
                                    lineHeight: 1.4
                                }}
                                />
                            </Tooltip>
                            <AddressLink address={contract["contract_address"]} isContract={true}>
                                {contract["contract_address"]}
                            </AddressLink>
                            </span>
                        ) :
                        <AddressLink address={contract["contract_address"]}>
                            {contract["contract_address"]}
                        </AddressLink>
                        }
                    </span>
                </Field>
                {consume_user_resource_percent && <Field label="contract_enery" tip={true} text={tu("contract_enery_tip")}>{tu('contract_percent')}{100 - consume_user_resource_percent}% <span style={{paddingLeft:'10px'}}></span> {tu('contract_percent_user')}{consume_user_resource_percent}% </Field>}
                {JSON.stringify(cost) !=
                    "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost} /></Field>}
                {signList && signList.length > 1 && <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList} /></Field>}
            </tbody>
        </table>
    </Fragment>
}

export default injectIntl(UpdateSettingContract)