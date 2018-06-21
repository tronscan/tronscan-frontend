import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink, ExternalLink} from "../../common/Links";
import Field from "./Field";
import {TRXPrice} from "../../common/Price";


export default function Contract({contract}) {

  switch (contract.contractType.toUpperCase()) {
    case "TRANSFERCONTRACT":


      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">TransferContract</h5>
            <p>
              TRX transfer between addresses
            </p>
          </div>
          <table className="table">
            <Field label="From"><AddressLink address={contract.from} /></Field>
            <Field label="To"><AddressLink address={contract.to} /></Field>
            <Field label="Amount"><TRXPrice amount={contract.amount / ONE_TRX} /></Field>
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
            <h5 className="card-title text-center">FreezeBalanceContract</h5>
            <p>
              Freeze TRX
            </p>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <Field label="Frozen Balance">{contract.frozenBalance}</Field>
            <Field label="Frozen Days">{contract.frozenDuration}</Field>
          </table>
        </Fragment>
      );

    case "VOTEWITNESSCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">VoteWitnessContract</h5>
            <p>
              Vote for a Witness
            </p>
          </div>
          <table className="table">
            <Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>
            <tr>
              <th>Votes</th>
              <td>
                <ul>
                  {
                    contract.votes.map(vote => (
                      <li>
                        <AddressLink address={vote.voteAddress} truncate={false} />: {vote.voteCount}
                      </li>
                    ))
                  }
                </ul>
              </td>
            </tr>
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
