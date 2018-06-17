import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink} from "../../common/Links";
import Field from "./Field";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import AccountName from "../../common/AccountName";
import {FormattedTRX} from "../../../utils/tron";

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
              <Field label="Amount">
                <FormattedTRX value={contract.amount / ONE_TRX}/> TRX
              </Field>
            </tbody>
          </table>
        </Fragment>
      );

    case "TRANSFERASSETCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Send {contract.token}</h5>
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
              <Field label="Amount">
                <FormattedTRX value={contract.amount}/> {contract.token}
              </Field>
            </tbody>
          </table>
        </Fragment>
      );


    case "WITNESSCREATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Apply for Super Representative</h5>
          </div>
          <table className="table">
            {/*<Field label="Owner Address">{contract.ownerAddress}</Field>*/}
            <Field label="URL">{contract.url}</Field>
          </table>
        </Fragment>
      );


    case "WITNESSUPDATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Update Super Representative</h5>
            <p>
              Updates a witness
            </p>
          </div>
          <table className="table">
            {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
            <Field label="URL">{contract.url}</Field>
          </table>
        </Fragment>
      );

    case "ASSETISSUECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Issue Token</h5>
          </div>
          <table className="table">
            {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
            <Field label="Token Name">{contract.name}</Field>
            <Field label="Total Supply">{contract.totalSupply}</Field>
            <Field label="TRX Amount">{contract.trxNum}</Field>
            <Field label="Token Amount">{contract.num}</Field>
            <Field label="Start Time">{contract.startTime}</Field>
            <Field label="End Time">{contract.endTime}</Field>
            <Field label="Description">{contract.description}</Field>
            <Field label="URL">{contract.url}</Field>
          </table>
        </Fragment>
      );

    case "PARTICIPATEASSETISSUECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Buy Tokens</h5>
          </div>
          <table className="table">
            {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
            <Field label="Token">{contract.token}</Field>
            <Field label="Amount">{contract.amount}</Field>
          </table>
        </Fragment>
      );


    case "ACCOUNTUPDATECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Update Account</h5>
          </div>
          <table className="table">
            {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
            <Field label="Name">{contract.name}</Field>
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
            <Field label="Frozen Amount">
              <FormattedTRX value={contract.frozenBalance / ONE_TRX} />
            </Field>
            <Field label="Number of days frozen">{contract.frozenDuration}</Field>
          </table>
        </Fragment>
      );

    case "UNFREEZEBALANCECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Unfreeze Coins</h5>
          </div>
        </Fragment>
      );

    case "WITHDRAWNBALANCECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Claim Rewards</h5>
          </div>
        </Fragment>
      );

    case "VOTEWITNESSCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Vote for Super Representatives</h5>
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
