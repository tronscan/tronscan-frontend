import React, {Fragment} from "react";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import {TransationTitle} from './common/Title'
import SignList from './common/SignList'
import { tu } from "../../../../utils/i18n";
import BandwidthUsage from './common/BandwidthUsage'
import { toThousands } from '../../../../utils/number'
import {injectIntl} from "react-intl";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';

function UpdateEnergyLimitContract({contract,intl}) {
    const {signature_addresses,contractType,cost,parameterValue,contract_address} = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType}/>
        <table className="table table-responsive">
            <tbody>
                {
                    contract['ownerAddress'] ?
                        <Field label="transaction_owner_address">
                            <span className="d-flex">
                                {/*  Distinguish between contract and ordinary address */}
                                {contract.contract_map[contract["ownerAddress"]]? (
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
                                    <AddressLink address={contract["ownerAddress"]} isContract={true}> {contract["ownerAddress"]}</AddressLink>
                                    </span>
                                ) :
                                    <AddressLink address={contract["ownerAddress"]}>
                                        {contract["ownerAddress"]}
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
                            <AddressLink address={contract["contract_address"]} isContract={true}> {contract["contract_address"]}</AddressLink>
                            </span>
                        ) :
                            <AddressLink address={contract["contract_address"]}>
                                {contract["contract_address"]}
                            </AddressLink>
                        }
                    </span>
                 
                </Field>
                <Field label="transaction_energy_cap" tip={true} text={tu('transaction_enrgy_cap_tip')}>{toThousands(parameterValue.origin_energy_limit)} {tu('energy')}</Field>
                 {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost}/></Field>}
                {signList&&signList.length>1&&<Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList}/></Field>}
            </tbody>
        </table>
    </Fragment>
}

export default injectIntl(UpdateEnergyLimitContract) 