import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import Field from "./Field";
import {TRXPrice} from "../../common/Price";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import AccountName from "../../common/AccountName";

export default function Contract({contract}) {

  switch (contract.contractType.toUpperCase()) {
    case "TRANSFERCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Send TRX</h5>
          </div>
          <table className="table">
            <tbody>
              <Field label="From">
                {contract.from}
              </Field>
              <Field label="To">
                {contract.to}
              </Field>
              <Field label="To Name">
                <AccountName
                  address={contract.to}
                  loading={() => <span>Loading...</span>} />
              </Field>
              <Field label="Amount">{contract.amount / ONE_TRX} TRX</Field>
            </tbody>
          </table>
        </Fragment>
      );

    case "TRANSFERASSETCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">TransferAssetContract</h5>
            <p>
              Token transfer between addresses
            </p>
          </div>
          <table className="table">
            <Field label="From"><AddressLink address={contract.from} /></Field>
            <Field label="To"><AddressLink address={contract.to} /></Field>
            <Field label="Amount">{contract.amount}</Field>
            <Field label="Token">{contract.token}</Field>
          </table>
        </Fragment>
      );

    case "WITNESSUPDATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">WitnessUpdateContract</h5>
            <p>
              Updates a witness
            </p>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <Field label="URL">{contract.url}</Field>
          </table>
        </Fragment>
      );

    case "ACCOUNTUPDATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">AccountUpdateContract</h5>
            <p>
              Update account name
            </p>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <Field label="Account Name">{contract.name}</Field>
          </table>
        </Fragment>
      );

    case "FREEZEBALANCECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Freeze Coins</h5>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <Field label="Frozen Amount">{contract.frozenBalance / ONE_TRX}</Field>
            <Field label="Number of days frozen">{contract.frozenDuration}</Field>
          </table>
        </Fragment>
      );

    case "VOTEWITNESSCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Vote</h5>
          </div>
          <table className="table">
            {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
            <Field label="Votes">
                <ul>
                  {
                    contract.votes.map(vote => (
                      <div className="text-right">
                        {vote.voteAddress}: {vote.voteCount} Votes
                      </div>
                    ))
                  }
                </ul>
            </Field>
          </table>
        </Fragment>
      );

    case "ASSETISSUECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">AssetIssueContract</h5>
            <p>
              Issue a new asset
            </p>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <Field label="Token Name">{contract.name}</Field>
            <Field label="Total Supply">{contract.totalSupply}</Field>
            <Field label="TRX Num">{contract.trxNum}</Field>
            <Field label="Num">{contract.num}</Field>
            <Field label="Start Time">{contract.startTime}</Field>
            <Field label="End Time">{contract.endTime}</Field>
            <Field label="Description">{contract.description}</Field>
            <Field label="URL"><ExternalLink url={contract.url}/></Field>
          </table>
        </Fragment>
      );

    case "WITNESSCREATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">WITNESSCREATECONTRACT</h5>
          </div>
          <table className="table">
            <Field label="Owner Address">{contract.ownerAddress}</Field>
            <Field label="URL">{contract.url}</Field>
          </table>
        </Fragment>
      );

    default:
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">#</h5>
            <p>
              #
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
