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
import {TransationTitle} from './common/Title'
import BandwidthUsage from './common/BandwidthUsage'

class TransferContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract } = this.props;
    return (
      <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
          <table className="table">
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
              {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={contract.cost}/></Field>}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default TransferContract;
