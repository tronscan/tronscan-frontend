/*
* Auther:xueyuanying
* Date:2019-12-25
*/
import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";

class UnFreezeBalanceContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract } = this.props;
    return (
      <Fragment>
        <div className="card-body table-title">
          <h5>
            <i className="fa fa-exchange-alt"></i>
            {tu("transation_type")}-
            <small>{tu("unfreeze_assets")}</small>
          </h5>
        </div>
        <div className="table-responsive">
        <table className="table">
            <tbody>
            <Field label="transation_owner_address"><AddressLink address={contract['owner_address']}/></Field>
            <Field label="transation_recycling_address"><AddressLink address={contract['receiver_address'] ? contract['receiver_address'] : contract['owner_address']}/></Field>
            <Field label="transation_unfreeze_num"></Field>
            </tbody>
        </table>
        </div>
      </Fragment>
    );
  }
}

export default UnFreezeBalanceContract;
