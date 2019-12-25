import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink } from "../../../common/Links";
import { TRXPrice } from "../../../common/Price";
import { ONE_TRX } from "../../../../constants";

class TransferContract extends React.Component {
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
            <small>{tu("transation_transfer_trx")}</small>
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead></thead>
            <tbody>
              <Field label="from">
                <AddressLink address={contract["owner_address"]}>
                  {contract["owner_address"]}
                </AddressLink>
              </Field>
              <Field label="to">
                <AddressLink address={contract["to_address"]}>
                  {contract["to_address"]}
                </AddressLink>
              </Field>
              <Field label="amount">
                <TRXPrice amount={contract.amount / ONE_TRX} />
              </Field>
              <Field label="note">
                {decodeURIComponent(contract.contract_note || "")}
              </Field>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default TransferContract;
