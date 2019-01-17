import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink} from "../../../components/common/Links";
import Field from "./Field";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import AccountName from "../../../components/common/AccountName";
import {FormattedTRX} from "../../../utils/tron";
import TronWeb from "tronweb";

export default function Contract({ contract }) {

  const contractParams = contract.parameter.value;

  switch (contract.type.toUpperCase()) {
    case "TRANSFERCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Send TRX</h5>
          </div>
          <table className="table">
            <tbody>
              <Field label="From">
                {TronWeb.address.fromHex(contractParams.owner_address)}
              </Field>
              <Field label="To">
                {TronWeb.address.fromHex(contractParams.to_address)}
              </Field>
              <Field label="To Name">
                <AccountName
                  address={TronWeb.address.fromHex(contractParams.to_address)}
                  loading={() => <span>Loading...</span>} />
              </Field>
              <Field label="Amount">
                <FormattedTRX value={contractParams.amount / ONE_TRX}/> TRX
              </Field>
            </tbody>
          </table>
        </Fragment>
      );

    case "TRANSFERASSETCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Send {contractParams.token}</h5>
          </div>
          <table className="table">
            <tbody>
            <Field label="From">
              {TronWeb.address.fromHex(contractParams.owner_address)}
            </Field>
            <Field label="To">
              {TronWeb.address.fromHex(contractParams.to_address)}
            </Field>
            <Field label="To Name">
              <AccountName
                address={TronWeb.address.fromHex(contractParams.to_address)}
                loading={() => <span>Loading...</span>} />
            </Field>
            <Field label="Amount">
              <FormattedTRX value={contractParams.amount}/>&nbsp;
              {TronWeb.fromUtf8(contractParams.asset_name)}
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
            <tbody>
              <Field label="URL">{TronWeb.toUtf8(contractParams.url)}</Field>
            </tbody>
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
            <Field label="URL">{TronWeb.toUtf8(contractParams.url)}</Field>
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
            <Field label="Token Name">{contractParams.name}</Field>
            <Field label="Total Supply">{contractParams.totalSupply}</Field>
            <Field label="TRX Amount">{contractParams.trxNum}</Field>
            <Field label="Token Amount">{contractParams.num}</Field>
            <Field label="Start Time">{contractParams.startTime}</Field>
            <Field label="End Time">{contractParams.endTime}</Field>
            <Field label="Description">{contractParams.description}</Field>
            <Field label="URL">{contractParams.url}</Field>
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
            <Field label="Token">{TronWeb.toUtf8(contractParams.asset_name)}</Field>
            <Field label="Amount">{contractParams.amount}</Field>
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
            <Field label="Name">{TronWeb.toUtf8(contractParams.account_name)}</Field>
          </table>
        </Fragment>
      );

    case "EXCHANGETRANSACTIONCONTRACT":
      return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">Exchange Transaction</h5>
            </div>
            <table className="table">
              {/*<Field label="Owner Address"><AddressLink address={contract.ownerAddress} /></Field>*/}
              <Field label="id">{contractParams.token_id}</Field>
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
            <Field label="Owner Address"><AddressLink address={TronWeb.address.fromHex(contractParams.owner_address)} /></Field>
            <Field label="Frozen Amount">
              <FormattedTRX value={contractParams.frozen_balance / ONE_TRX} />
            </Field>
            <Field label="Number of days frozen">{contractParams.frozen_duration}</Field>
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
            <Field label="Votes">
              <ul>
                {
                  contractParams.votes.map(vote => (
                    <div className="text-right">
                      {TronWeb.address.fromHex(vote.vote_address)}: {vote.vote_count} Votes
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
      {JSON.stringify(contractParams)}
    </div>
  );
}
