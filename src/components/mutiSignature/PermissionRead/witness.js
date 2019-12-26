import React, { Component } from "react";
import { tu } from "../../../utils/i18n";

export default class WitnessRead extends Component {
  // eslint-disable-next-line
  constructor(props) {
    super(props);
  }
  render() {
    const { witnessNodeAddress } = this.props;
    return (
      <div className="permission">
        <div className="permission-title">
          <span>{tu("signature_Superdelegate_authority")}</span>
        </div>
        <div className="permission-desc">
          {tu("signature_Superdelegate_authority_desc")}
        </div>
        <div className="permission-content">
          <div className="permission-item">
            <span class="permission-label">{tu("signature_piece_node")}:</span>
            <span class="permission-address">{witnessNodeAddress}</span>
          </div>
        </div>
      </div>
    );
  }
}
