import React, { Component, PureComponent } from "react";
import { getContractTypesByHex } from "../../../utils/mutiSignHelper";
import { tu } from "../../../utils/i18n";
import { injectIntl } from "react-intl";

@injectIntl
export default class ActiveRead extends PureComponent {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  getOperationsByHex(hex) {
    const operations = getContractTypesByHex(hex);
    return operations.map(item => {
      return <li key={item.id}> {tu(item.value)} </li>;
    });
  }
  render() {
    const { activePermissions, tronWeb } = this.props;
    return (
      <div className="permission">
        <div className="permission-title">
          <span className="permission-title-active">
            {tu("signature_active_permissions")}
          </span>
          <i>({activePermissions.length + "/" + 8})</i>
        </div>
        <div className="permission-desc">
          {tu("signature_active_permissions_desc")}
        </div>
        {activePermissions.map(item => {
          return (
            <div className="permission-content" key={item.id}>
              <div className="permission-item">
                <span className="permission-label">
                  {tu("signature_permission")}:
                </span>
                <span>{item.permission_name}</span>
              </div>
              <div className="permission-item" style={{ paddingBottom: 0 }}>
                <span className="permission-label">
                  {tu("signature_Operations")}:
                </span>
                <ul className="permission-operation-list">
                  {this.getOperationsByHex(item.operations)}
                </ul>
              </div>
              <div className="permission-item" style={{ paddingTop: 0 }}>
                <span className="permission-label">
                  {tu("signature_threshold")}:
                </span>
                <span>{item.threshold}</span>
              </div>
              <div className="permission-item permission-keys">
                <span className="permission-label">
                  {tu("signature_keys")}:
                </span>
                <table>
                  <thead>
                    <tr>
                      <td>{tu("signature_key")}</td>
                      <td>{tu("signature_weight")}</td>
                    </tr>
                  </thead>
                  <tbody>
                    {item.keys.map(itemKey => {
                      return (
                        <tr key={itemKey.address}>
                          <td>{tronWeb.address.fromHex(itemKey.address)}</td>
                          <td>{itemKey.weight}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="right-space"></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
