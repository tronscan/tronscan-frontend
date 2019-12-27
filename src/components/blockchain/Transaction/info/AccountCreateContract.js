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

class AccountCreateContract extends React.Component {
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
                <Field label="transation_owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="transtaion_activate_account"><AddressLink address={contract['account_address']}/></Field>
              </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}

export default AccountCreateContract;
