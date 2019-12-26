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
import { NameWithId } from '../../../common/names';
import rebuildList from "../../../../utils/rebuildList";


class ParticipateAssetIssueContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let { contract } = this.props;
    let TokenIDList = [];
    let tokenIdData;
    TokenIDList.push(contract)
    if(TokenIDList){
        tokenIdData  = rebuildList(TokenIDList,'asset_name','amount')[0]
    }
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
              <tbody>
                <Field label="transation_owner_address"><AddressLink address={contract['owner_address']}>{contract['owner_address']}</AddressLink></Field>
                <Field label="issuer"><AddressLink address={contract['to_address']}>{contract['to_address']}</AddressLink></Field>
                <Field label="amount">{contract.amount / ONE_TRX}</Field>
                <Field label="token"><NameWithId value={contract} notamount totoken/></Field>
                </tbody>
            </table>
        </div>
      </Fragment>
    );
  }
}

export default ParticipateAssetIssueContract;
