import React, { Component } from "react";
import { tu } from "../../../utils/i18n";

import { injectIntl } from "react-intl";

@injectIntl
export default class OwnerRead extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    const { ownerPermission, tronWeb } = this.props;
    const { keys, threshold, permission_name } = ownerPermission;
    const tableList = keys.map(item => (
      <tr key={item.address}>
        <td>{tronWeb.address.fromHex(item.address)}</td>
        <td>{item.weight}</td>
      </tr>
    ));
    return (
      <div className="permission">
        <div className="permission-title">
          <span className="permission-title-active">
            {tu("signature_privilege")}
          </span>
        </div>
        <div className="permission-desc">{tu("signature_privilege_desc")}</div>
        <div className="permission-content">
          <div className="permission-item">
            {" "}
            <span className="permission-label">
              {tu("signature_permission")}:
            </span>{" "}
            <span>{permission_name}</span>
          </div>
          <div className="permission-item">
            {" "}
            <span className="permission-label">
              {tu("signature_threshold")}:
            </span>{" "}
            <span>{threshold}</span>
          </div>
          <div className="permission-item permission-keys">
            <span className="permission-label">{tu("signature_keys")}:</span>
            <table>
              <thead>
                <tr>
                  <td>{tu("signature_key")}</td>
                  <td>{tu("signature_weight")}</td>
                </tr>
              </thead>
              <tbody>{tableList}</tbody>
            </table>
            <div className="right-space"></div>
          </div>
        </div>
      </div>
    );
  }
}
