/*
 * Auther:xueyuanying
 * Date:2019-12-25
 */
import React, { Fragment } from "react";
import { tu } from "../../../../utils/i18n";
import Field from "../../../tools/TransactionViewer/Field";
import { AddressLink, ExternalLink } from "../../../common/Links";
import { ONE_TRX } from "../../../../constants";
import {
  FormattedNumber,
  FormattedDate,
  FormattedTime,
  injectIntl
} from "react-intl";
import { toUtf8 } from "tronweb";
import { Link } from "react-router-dom";
import { TransationTitle } from "./common/Title";
import BandwidthUsage from "./common/BandwidthUsage";

class AssetIssueContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fee: "1024 TRX"
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
              <Field label="transaction_issue_address">
                <AddressLink address={contract["owner_address"]} />
              </Field>
              <Field label="transaction_fee">{this.state.fee}</Field>
              <Field label="trc20_token_id">{}</Field>
              <Field label="token_name">
                <Link to={`/token/${contract.name}`}>
                  {toUtf8(contract.abbr)}
                </Link>
              </Field>
              <Field label="total_supply">
                <FormattedNumber
                  value={
                    contract.total_supply /
                    (contract.precision ? Math.pow(10, contract.precision) : 1)
                  }
                />
              </Field>
              <Field label="token_price_new">{}</Field>
              <Field
                label="transaction_consumed_bandwidth_cap_per"
                tip={true}
                text="transaction_consumed_bandwidth_cap_per_tip"
              >
                {}
              </Field>
              <Field
                label="transaction_consumed_bandwidth_cap_all"
                tip={true}
                text="transaction_consumed_bandwidth_cap_all_tip"
              >
                {}
              </Field>
              <Field label="start_time">
                {contract.end_time - contract.start_time > 1000 ? (
                  <span>
                    <FormattedDate value={contract.start_time} />{" "}
                    <FormattedTime
                      value={contract.start_time}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    />
                  </span>
                ) : (
                  "-"
                )}
              </Field>
              <Field label="end_time">
                {contract.end_time - contract.start_time > 1000 ? (
                  <span>
                    <FormattedDate value={contract.end_time} />{" "}
                    <FormattedTime
                      value={contract.start_time}
                      hour="numeric"
                      minute="numeric"
                      second="numeric"
                      hour12={false}
                    />
                  </span>
                ) : (
                  "-"
                )}
              </Field>
              <Field label="transaction_frozen_number">
                <FormattedNumber
                  value={
                    (contract.frozen_supply[0].frozen_amount || 0) / ONE_TRX
                  }
                ></FormattedNumber>
              </Field>
              <Field label="transaction_frozen_day">
                {contract.frozen_supply[0].frozen_days || 0}
              </Field>
              <Field label="transaction_unfreeze_time">{}</Field>
              {JSON.stringify(contract.cost) != "{}" && (
                <Field label="consume_bandwidth">
                  <BandwidthUsage cost={contract.cost} />
                </Field>
              )}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default AssetIssueContract;
