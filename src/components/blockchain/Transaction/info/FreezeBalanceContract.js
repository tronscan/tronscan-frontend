import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";

class FreezeBalanceContract extends React.Component {
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
            <small>{tu("transation_freeze_balance")}</small>
          </h5>
        </div>
        <div className="table-responsive">
        <table className="table">
            <tbody>
            <Field label="transation_owner_address"><AddressLink address={contract['owner_address']}/></Field>
            <Field label="transation_receiver_address"><AddressLink address={contract['receiver_address'] ? contract['receiver_address'] : contract['owner_address']}/></Field>
            <Field label="transation_get_resourse">{tu('tron_power')} & {contract['resource'] ? contract['resource'] : 'Bandwidth'}</Field>
            <Field label="transation_freeze_num">{contract['frozen_balance'] / ONE_TRX}TRX</Field>
            <Field label="frozen_days">{contract['frozen_duration']}</Field>
            </tbody>
        </table>
        </div>
      </Fragment>
    );
  }
}

export default FreezeBalanceContract;
