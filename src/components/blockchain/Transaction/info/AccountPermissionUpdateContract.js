import React, { Fragment } from "react";
import { AddressLink, ExternalLink, ContractLink, TokenTRC20Link } from "../../../common/Links";
import Field from "../../../tools/TransactionViewer/Field";
import { TransationTitle } from './common/Title'
import PermissionItem from './common/PermissionItem'
import SignList from './common/SignList'
import BandwidthUsage from './common/BandwidthUsage'
import { tu } from "../../../../utils/i18n";
import {injectIntl} from "react-intl";
import { upperFirst } from "lodash";
import { Tooltip,Icon } from 'antd';


function AccountPermissionUpdateContract({contract,intl}) {
    let { signature_addresses, contractType, owner, actives, withness,cost } = contract;
    let signList = signature_addresses;
    return <Fragment>
        <TransationTitle contractType={contractType} />
        <table className="table table-responsive">
            <tbody>
                {
                    contract['owner_address'] &&
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
                                    <AddressLink address={contract["owner_address"]} isContract={true}> {contract["owner_address"]}</AddressLink>
                                    </span>
                                ) :
                                    <AddressLink address={contract["owner_address"]}>
                                        {contract["owner_address"]}
                                    </AddressLink>
                                }
                            </span>
                        </Field>
                }
                <Field label="transaction_fee">100 TRX</Field>
                {
                    owner && <PermissionItem permissionItem={owner} label='signature_privilege'/>
                }
                {
                    withness && <PermissionItem permissionItem={withness} label='signature_Superdelegate_authority'/>
                }
                {
                   actives && <PermissionItem permissionArray={actives} label='signature_active_permissions'/>
                }
                {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={cost}/></Field>}
                {signList&&signList.length>1&&<Field label="signature_list" tip={true} text={tu('only_show_sinatures')}><SignList signList={signList}/></Field>}
            </tbody>
        </table>
    </Fragment >
}

export default injectIntl(AccountPermissionUpdateContract)