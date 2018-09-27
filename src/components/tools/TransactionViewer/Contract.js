import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import Field from "./Field";
import {TRXPrice} from "../../common/Price";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";

export default function Contract({contract}) {

  switch (contract.contractType.toUpperCase()) {
    case "TRANSFERCONTRACT":

      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("transfer_contract")}
                <small>{tu("TRX_transfer_between_addresses")}</small>
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                <Field label="from"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="to"><AddressLink address={contract['to_address']}/></Field>
                <Field label="amount"><TRXPrice amount={contract.amount / ONE_TRX}/></Field>
                </tbody>
              </table>
            </div>
          </Fragment>
      );

    case "TRANSFERASSETCONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("transfer_asset_contract")}
                <small>{tu("token_transfer_between_addresses")}</small>
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <Field label="from"><AddressLink address={contract['owner_address']}/></Field>
                  <Field label="to"><AddressLink address={contract['to_address']}/></Field>
                  <Field label="amount">{contract.amount}</Field>
                  <Field label="token">{contract['asset_name']}</Field>
                </tbody>
              </table>
            </div>
          </Fragment>
      );

    case "PARTICIPATEASSETISSUECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("participate_asset_issue_contract")}
                <small>{tu("participate_token_between_addresses")}</small>
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <Field label="to"><AddressLink address={contract['owner_address']}/></Field>
                  <Field label="issuer"><AddressLink address={contract['to_address']}/></Field>
                  <Field label="amount">{contract.amount / ONE_TRX}</Field>
                  <Field label="token">{contract['asset_name']}</Field>
                </tbody>
              </table>
            </div>
          </Fragment>
      );
    case "WITNESSUPDATECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("witness_update_contract")}
                <small>{tu("updates_a_witness")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="URL">{contract.url}</Field>
              </tbody>
            </table>
          </Fragment>
      );
    case "WITNESSCREATECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("witness_create_contract")}
                <small>{tu("create_a_witness")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="URL">{contract.url}</Field>
              </tbody>
            </table>
          </Fragment>
      );

    case "ACCOUNTUPDATECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("account_update_contract")}
                <small>{tu("update_account_name")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="account_name">{contract.name}</Field>
              </tbody>
            </table>
          </Fragment>
      );
    case "WITHDRAWBALANCECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("withdraw_balance_contract")}
                <small>{tu("withdraw_balance")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
              </tbody>
            </table>
          </Fragment>
      );

    case "FREEZEBALANCECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("freeze_balance_contract")}
                <small>{tu("freeze_TRX")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <Field label="frozen_balance">{contract['frozen_balance'] / ONE_TRX}</Field>
                <Field label="frozen_days">{contract['frozen_duration']}</Field>
              </tbody>
            </table>
          </Fragment>
      );

    case "UNFREEZEBALANCECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("unfreeze_balance_contract")}
                <small>{tu("unfreeze_TRX")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
              </tbody>
            </table>
          </Fragment>
      );

    case "VOTEWITNESSCONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("vote_witness_contract")}
                <small>{tu("vote_for_a_witness")}</small>
              </h5>
            </div>
            <table className="table">
              <tbody>
                <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                <tr>
                  <th>{tu("votes")}</th>
                  <td>
                    <ul>
                      {
                        contract.votes.map(vote => (
                            <li>
                              <AddressLink address={vote['vote_address']} truncate={false}/>
                              {tu("counts")} : {vote['vote_count']}
                            </li>
                        ))
                      }
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
      );

    case "ASSETISSUECONTRACT":
      return (
          <Fragment>
            <div className="card-body table-title">
              <h5>
                <i className="fa fa-exchange-alt"></i>
                {tu("asset_issue_contract")}
                <small>{tu("issue_a_new_asset")}</small>
              </h5>
            </div>
            <table className="table">
              <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
              <Field label="token_name">{contract.name}</Field>
              <Field label="total_supply">{contract.totalSupply}</Field>
              <Field label="TRX_exchange_rate">{contract.trxNum / ONE_TRX} : {contract.num}</Field>
              <Field label="start_time"><FormattedDate value={contract.startTime}/></Field>
              <Field label="end_time"><FormattedDate value={contract.endTime}/></Field>
              <Field label="description">{contract.description}</Field>
              <Field label="URL"><ExternalLink url={contract.url}/></Field>
            </table>
          </Fragment>
      );

    default:
      return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">#</h5>
              <p>
                contract not found
              </p>
            </div>
          </Fragment>
      );
  }

  return (
      <div className="card-body">
        {JSON.stringify(contract)}
      </div>
  );
}
