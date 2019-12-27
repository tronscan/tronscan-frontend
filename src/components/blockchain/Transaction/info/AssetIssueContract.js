/*
* Auther:xueyuanying
* Date:2019-12-25
*/
import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink,ExternalLink } from "../../../common/Links";
import { ONE_TRX } from "../../../../constants";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import {toUtf8} from 'tronweb'
import {Link} from "react-router-dom";
import {TransationTitle} from './common/Title'


class AssetIssueContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fee:'1024 TRX'
    };
  }
  render() {
    let { contract } = this.props;
    return (
      <Fragment>
       <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
        <table className="table">
              <tbody>
              <Field label="transaction_owner_address"><AddressLink address={contract['owner_address']}/></Field>
              <Field label="transaction_fee">{this.state.fee}</Field>
              <Field label="trc20_token_id">{}</Field>
              <Field label="token_name">
                <Link to={`/token/${contract.name}`}>
                    {toUtf8(contract.name)}
              </Link></Field>
              <Field label="total_supply"><FormattedNumber value={contract.total_supply/ (contract.precision?Math.pow(10,contract.precision):1)}/></Field>
              <Field label="token_price_new">{}</Field>
              <Field label="transaction_consumed_bandwidth_cap_per"  tip={true} text="transaction_consumed_bandwidth_cap_per_tip">{contract.trx_num / ONE_TRX}</Field>
              <Field label="transaction_consumed_bandwidth_cap_all"  tip={true} text="transaction_consumed_bandwidth_cap_all_tip">{contract.trx_num / ONE_TRX}</Field>
              <Field label="start_time">
                  {contract.end_time - contract.start_time > 1000 ?  <FormattedDate value={contract.start_time}/> : "-"}
              </Field>
              <Field label="end_time">
                  {contract.end_time - contract.start_time > 1000 ?  <FormattedDate value={contract.end_time}/> : "-"}
              </Field>
              <Field label="transaction_frozen_number"><FormattedNumber value={(contract.frozen_supply[0].frozen_amount || 0) / ONE_TRX}></FormattedNumber></Field>
              <Field label="transaction_frozen_day">{contract.frozen_supply[0].frozen_days || 0}</Field>
              <Field label="transaction_unfreeze_time">{}</Field>
              </tbody>
          </table>
         
        </div>
      </Fragment>
    );
  }
}

export default AssetIssueContract;
