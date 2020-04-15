import React, { Fragment } from "react";
import { AddressLink } from "../../../../common/Links";
import Field from "../../../../tools/TransactionViewer/Field";
import { tu } from "../../../../../utils/i18n";
import { getContractTypesByHex } from "../../../../../utils/mutiSignHelper";
function getOperationDom(operations) {
    operations = getContractTypesByHex(operations);
    if (operations.length) {
        return (<div className="permission-child-item">
            <div className="permission-label">{tu('trc20_cur_order_header_action')}:</div>
            <div className="permission-text">
                <ul className='permission-operations'>
                    {operations.map((item, index) => (
                        <li key={index}>{tu(item.value)}</li>
                    ))}
                </ul>
            </div>
        </div>)
    }
}
export default function PermissionItem(props) {
    let { permissionItem, label, permissionArray } = props;
    permissionArray = permissionArray || [permissionItem];
    // permissionArray.map(item => {
    //     if (item.operations) {
    //         const arr = getContractTypesByHex(item.operations);
    //         item.operations = arr;
    //     }
    // })

    return (
        <Fragment>
            <Field label={label}>
                {permissionArray.map((pItem, pIndex) => (
                    <div className="permission-body" key={pIndex}>
                        <div className="permission-child-item">
                            <div className="permission-label" style={{width:'113px'}}>
                                {tu('signature_permission')}:
                                </div>
                            <div className="permission-text">
                                {pItem.permission_name}
                            </div>
                        </div>
                        <div className="permission-child-item">
                            <div className="permission-label" style={{width:'113px'}}>
                                {tu('signature_threshold')}:
                                </div>
                            <div className="permission-text">
                                {pItem.threshold}
                            </div>
                        </div>
                        <div className="permission-child-item">
                            <div className="permission-label" style={{width:'113px'}}>
                                {tu('signature_keys')}:
                                    </div>
                            <div className="permission-text">
                                <div className="permission-text-content">
                                    <div className="key-title">
                                        <span className="key-title-address">{tu('signature_key')}</span>
                                        <span className="key-title-weight">{tu('signature_weight')}</span>
                                    </div>
                                    <ul>
                                        {
                                            pItem.keys.map((item, index) => (
                                                <li key={index}>
                                                    <div className="key-icon"></div>
                                                    <span className="key-address"><AddressLink address={item.address} /></span>
                                                    <span className="key-weight">{item.weight}</span>
                                                </li>
                                            ))}

                                    </ul>
                                </div>

                            </div>
                        </div>
                        {
                             pItem.operations && getOperationDom(pItem.operations)
                        }
                    </div>
                ))}

            </Field>
        </Fragment>
    )
}