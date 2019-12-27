/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */

import React, { Fragment } from "react";
import { tu } from "../../../../../utils/i18n";

export class TransationTitle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { contractType } = this.props;
    return (
      <div className="card-body table-title">
        <h5>
          <i className="fa fa-exchange-alt"></i>
          {tu(`transaction_${contractType && contractType.toUpperCase()}`)}
          <small></small>
        </h5>
      </div>
    );
  }
}
