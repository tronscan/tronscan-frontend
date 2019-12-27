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
import { NameWithId } from '../../../common/names';


class UnfreezeAssetContract extends React.Component {
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
              <Field label="transaction_owner_address">
                <AddressLink address={contract["owner_address"]}>
                  {contract["owner_address"]}
                </AddressLink>
              </Field>
              <Field label="amount">
                {(contract.amount / ONE_TRX) || 0}
              </Field>
              <Field label="trc20_token_id">
                {contract.asset_name || '-'}
              </Field>
              <Field label="token">
                <NameWithId value={contract} type="abbr" notamount totoken tokenid={false} />              </Field>
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default UnfreezeAssetContract;
