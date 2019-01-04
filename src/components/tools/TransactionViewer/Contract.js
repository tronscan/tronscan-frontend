import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import Field from "./Field";
import {TRXPrice} from "../../common/Price";
import {tu} from "../../../utils/i18n";
import {FormattedNumber, FormattedDate, injectIntl} from "react-intl";
import rebuildList from "../../../utils/rebuildList";

export default function Contract({contract}) {
    console.log('contract',contract)
    let parametersArr = [
        'MAINTENANCE_TIME_INTERVAL',
        'ACCOUNT_UPGRADE_COST',
        'CREATE_ACCOUNT_FEE',
        'TRANSACTION_FEE',
        'ASSET_ISSUE_FEE',
        'WITNESS_PAY_PER_BLOCK',
        'WITNESS_STANDBY_ALLOWANCE',
        'CREATE_NEW_ACCOUNT_FEE_IN_SYSTEM_CONTRACT',
        'CREATE_NEW_ACCOUNT_BANDWIDTH_RATE',
        'ALLOW_CREATION_OF_CONTRACTS',
        'REMOVE_THE_POWER_OF_THE_GR',
        'ENERGY_FEE',
        'EXCHANGE_CREATE_FEE',
        'MAX_CPU_TIME_OF_ONE_TX',
        'ALLOW_UPDATE_ACCOUNT_NAME',
        'ALLOW_SAME_TOKEN_NAME'
    ];
    let proposal,proposalVal;
    if(contract.parameters){
        for(let item in contract.parameters){
            for(let i in parametersArr){
                if(item === i){
                     proposal = parametersArr[item];
                     proposalVal = contract.parameters[item]
                }
            }
        }

    }
    let TokenIDList = [];
    TokenIDList.push(contract)
    console.log('TokenIDList',TokenIDList)
    let tokenIdDate  = rebuildList(TokenIDList,'asset_name',)[0]
    console.log('tokenIdDate',tokenIdDate)
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
                <Field label="account_name">{contract['account_name']}</Field>
              </tbody>
            </table>
          </Fragment>
      );
      case "ACCOUNTCREATECONTRACT":
          return (
              <Fragment>
                  <div className="card-body table-title">
                      <h5>
                          <i className="fa fa-exchange-alt"></i>
                          {tu("account_create_contract")}
                          <small>{tu("account_create")}</small>
                      </h5>
                  </div>
                  <table className="table">
                      <tbody>
                      <Field label="create_from_address"><AddressLink address={contract['owner_address']}/></Field>
                      <Field label="create_to_address"><AddressLink address={contract['account_address']}/></Field>
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
                        contract.votes.map((vote,index) => (
                            <li key={index}>
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
                <tbody>
                    <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                    <Field label="token_name">{contract.name}</Field>
                    <Field label="total_supply">{contract.total_supply}</Field>
                    <Field label="TRX_exchange_rate">{contract.trx_num / ONE_TRX} : {contract.num}</Field>
                    <Field label="start_time">
                        {contract.end_time - contract.start_time > 1000 ?  <FormattedDate value={contract.start_time}/> : "-"}
                    </Field>
                    <Field label="end_time">
                        {contract.end_time - contract.start_time > 1000 ?  <FormattedDate value={contract.end_time}/> : "-"}
                    </Field>
                    <Field label="description">{contract.description}</Field>
                    <Field label="URL"><ExternalLink url={contract.url}/></Field>
                </tbody>
            </table>
          </Fragment>
      );
      case "PROPOSALCREATECONTRACT":
          return (
              <Fragment>
                  <div className="card-body table-title">
                      <h5>
                          <i className="fa fa-exchange-alt"></i>
                          {tu("proposal_create_contract")}
                          <small>{tu("proposal_create")}</small>
                      </h5>
                  </div>
                  <table className="table">
                      <tbody>
                      <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                      <tr>
                          <th>{proposal}</th>
                          <td>{proposalVal}</td>
                      </tr>
                      </tbody>
                  </table>
              </Fragment>
          );
      case "TRIGGERSMARTCONTRACT":
          return (
              <Fragment>
                  <div className="card-body table-title">
                      <h5>
                          <i className="fa fa-exchange-alt"></i>
                          {tu("trigger_smart_contract")}
                          <small>{tu('normal_address_trigger_smart_contract')}</small>
                      </h5>
                  </div>
                  <table className="table">
                      <tbody>
                      <Field label="contract_triggers_owner_address"><AddressLink address={contract['owner_address']}/></Field>
                      <Field label="contract_address"><AddressLink address={contract['contract_address']} isContract={true}/></Field>
                      {
                          contract['call_value']?
                          <Field label="value"><TRXPrice amount={contract['call_value'] / ONE_TRX}/></Field>
                          :<Field label="value"><TRXPrice amount={0}/></Field>
                      }


                      </tbody>
                  </table>
              </Fragment>
          );
    default:
      return (
          <Fragment>
              <div className="card-body table-title">
                  <h5>
                      <i className="fa fa-exchange-alt"></i>
                      &nbsp;&nbsp;
                      {contract.contractType}
                  </h5>
              </div>
              <table className="table">
                  <tbody>
                  {
                      contract['owner_address']?
                          <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
                          :''
                  }
                  </tbody>
              </table>
          </Fragment>
      );
  }

  return (
      <div className="card-body">
        {JSON.stringify(contract)}
      </div>
  );
}
