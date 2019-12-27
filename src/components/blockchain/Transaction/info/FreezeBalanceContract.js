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


class FreezeBalanceContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract } = this.props;
    console.log(contract)
    return (
      <Fragment>
       <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
        <table className="table">
            <tbody>
            <Field label="transaction_owner_address"><AddressLink address={contract['owner_address']}/></Field>
            <Field label="transaction_receiver_address"><AddressLink address={contract['receiver_address'] ? contract['receiver_address'] : contract['owner_address']}/></Field>
            <Field label="transaction_get_resourse">{tu('tron_power')} & {contract['resource'] ? contract['resource'] : 'Bandwidth'}</Field>
            <Field label="transaction_freeze_num">{contract['frozen_balance'] / ONE_TRX}TRX</Field>
            <Field label="frozen_days">{contract['frozen_duration']}</Field>
            {JSON.stringify(contract.cost) !=
                              "{}" && <Field label="consume_bandwidth"><BandwidthUsage cost={contract.cost}/></Field>}
            </tbody>
        </table>
        </div>
      </Fragment>
    );
  }
}

export default FreezeBalanceContract;
