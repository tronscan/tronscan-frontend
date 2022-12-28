import React, {Fragment} from "react";
import {ONE_TRX} from "../../../constants";
import {AddressLink} from "../../../components/common/Links";
import Field from "./Field";
import {Transaction} from "@tronscan/client/src/protocol/core/Tron_pb";
import AccountName from "../../../components/common/AccountName";
import {FormattedTRX} from "../../../utils/tron";
import rebuildList from "../../../utils/rebuildList";
import {FormattedNumber} from 'react-intl';
import {Truncate} from "../../../components/common/text";
import TronWeb from "tronweb";

export default function Contract({ contract, extra }) {
  const contractParams = contract.parameter.value;
  let tokenInfo = '';
  let tokenList = [{"token_id":"","amount":""}];
  if(contract.type.toUpperCase() == "PARTICIPATEASSETISSUECONTRACT" || contract.type.toUpperCase() == "TRANSFERASSETCONTRACT"){
      tokenList[0].token_id = TronWeb.toUtf8(contractParams.asset_name);
      tokenList[0].amount = contractParams.amount;
      tokenInfo = rebuildList(tokenList, 'token_id', 'amount')[0];
  }

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
              {/*<Field label="To Name">*/}
                {/*<AccountName*/}
                  {/*address={TronWeb.address.fromHex(contractParams.to_address)}*/}
                  {/*loading={() => <span>Loading...</span>}*/}
                {/*/>*/}
              {/*</Field>*/}
              <Field label="Amount">
                <FormattedTRX value={contractParams.amount / ONE_TRX}/> TRX
              </Field>
              {
                (extra.note &&  <Field label="Note">
                {TronWeb.toUtf8(extra.note)}
                </Field>)
              }
              {(extra && extra.hash && 
                <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
            )}
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
            {/*<Field label="To Name">*/}
              {/*<AccountName*/}
                {/*address={TronWeb.address.fromHex(contractParams.to_address)}*/}
                {/*loading={() => <span>Loading...</span>} />*/}
            {/*</Field>*/}
            <Field label="Amount">
              <FormattedNumber maximumFractionDigits={tokenInfo.map_token_precision} minimunFractionDigits={tokenInfo.map_token_precision}
                    value={tokenInfo.map_amount}/>&nbsp;{tokenInfo.map_token_name}&nbsp;<font size="-2">[{TronWeb.toUtf8(contractParams.asset_name)}]</font>
            </Field>
            {
              (extra.note &&  <Field label="Note">
              {TronWeb.toUtf8(extra.note)}
              </Field>)
            }
            {(extra && extra.hash && 
                <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
            )}
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
              {(extra && extra.hash && 
                  <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
              )}
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
            {(extra && extra.hash && 
                 <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
              )}
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
            {(extra && extra.hash && 
                 <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
              )}
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
            <Field label="Token">{tokenInfo.map_token_name + "[ID:" +tokenInfo.map_token_id +"]"}</Field>
            <Field label="Cost">{contractParams.amount / ONE_TRX} TRX</Field>
            {(extra && extra.hash && 
                 <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
              )}
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
            {(extra && extra.hash && 
                  <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
              )}
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
            <Field label="Resource">{contractParams.resource=="ENERGY"?"Energy":"Bandwidth"}</Field>
            {(extra && extra.hash && 
                  <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
              )}
          </table>
        </Fragment>
      );

    case "UNFREEZEBALANCECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Unfreeze Coins</h5>
          </div>
          <table className="table">
            <tbody>
            <Field label="Resource">{contractParams.resource=="ENERGY"?"Energy":"Bandwidth"}</Field>
            {(extra && extra.hash && 
                 <Field label="Hash">
                    <Truncate>
                      #{extra.hash}
                    </Truncate>
                </Field>
              )}
            </tbody>
          </table>
        </Fragment>
      );

    case "WITHDRAWNBALANCECONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Claim Rewards</h5>
          </div>
          <table className="table">
            <tbody>
            {(extra && extra.hash && 
                  <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
              )}
              </tbody>
          </table>
        </Fragment>
      );

    case "VOTEWITNESSCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">Vote for Super Representatives</h5>
          </div>
          <table className="table">
          <tbody>
            <Field label="Votes">
              <ul>
                {
                  contractParams.votes.map(vote => (
                    <div className="text-right" key={vote.vote_address}>
                      {TronWeb.address.fromHex(vote.vote_address)}: {vote.vote_count} Votes
                    </div>
                  ))
                }
              </ul>
            </Field>
            {(extra && extra.hash && 
                  <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
              )}
          </tbody>
          </table>
        </Fragment>
      );
      case "WITHDRAWBALANCECONTRACT":
      return (
          <Fragment>
              <div className="card-body">
                  <h5 className="card-title text-center">Collect Reward</h5>
              </div>
              <table className="table">
                  <Field label="Owner Address"><AddressLink address={TronWeb.address.fromHex(contractParams.owner_address)} /></Field>
                  {(extra && extra.hash &&
                      <Field label="Hash">
                          <Truncate>
                              #{extra.hash}
                          </Truncate>
                      </Field>
                  )}
              </table>
          </Fragment>
      );

      case "TRIGGERSMARTCONTRACT":
      return (
        <Fragment>
          <div className="card-body">
            <h5 className="card-title text-center">{extra.to?'Send TRC20':'Trigger Smart Contract'}</h5>
          </div>
            {
                extra.to !=''? <table className="table">
                    <tbody>
                    <Field label="From">
                        {TronWeb.address.fromHex(contractParams.owner_address)}
                    </Field>
                    {
                      extra.to?<Field label="To">
                        {extra.to}
                      </Field>:''
                    }
                    {(extra && extra.to_name &&
                        <Field label="To Name">
                            {extra.to_name}
                        </Field>
                    )}
                    <Field label="Contract">
                        {TronWeb.address.fromHex(contractParams.contract_address)}
                    </Field>
                    {(extra && extra.to_name &&
                        <Field label="To Name">
                            {extra.to_name}
                        </Field>
                    )}
                    {(extra && extra.to && extra.note && 
                      <Field label="Note">
                        {extra.note}
                      </Field>
                    )}
                    {
                      extra.to?<Field label="Amount">
                      <FormattedNumber maximumFractionDigits={extra.decimals} minimunFractionDigits={extra.decimals}
                                       value={extra.amount}/>&nbsp;
                      {extra.token_name}
                      </Field>:''
                    }
                    
                    {(extra && extra.hash &&
                        <Field label="Hash">
                            <Truncate>
                                #{extra.hash}
                            </Truncate>
                        </Field>
                    )}
                    </tbody>
                </table> : <table className="table">
                    <tbody>
                        <Field label="Contract">
                            {TronWeb.address.fromHex(contractParams.contract_address)}
                        </Field>
                        {(extra && extra.hash &&
                            <Field label="Hash">
                                <Truncate>
                                    #{extra.hash}
                                </Truncate>
                            </Field>
                        )}
                    </tbody>
                </table>
            }
        </Fragment>
      );

      case "EXCHANGETRANSACTIONCONTRACT":
        return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">Exchange Transaction</h5>
            </div>
            <table className="table">
              <tbody>
              <Field label="Exchange ID">
                {contractParams.exchange_id}
              </Field>
              <Field label="Pair">
                {extra.pair}
              </Field>
              <Field label="Action">
                {extra.action}
              </Field>
              
                <Field label={extra.action==="Buy"?"Cost":"Amount"}>
                  <FormattedNumber maximumFractionDigits={extra.decimals2} minimunFractionDigits={extra.decimals2}  
                  value={extra.action==="Buy"?contractParams.quant/ Math.pow(10, extra.decimals2):contractParams.quant/ Math.pow(10, extra.decimals1)}/>{extra.action==="Buy"?" TRX":""}
                </Field>
                {/*<Field label="Expected">*/}
                  {/*<FormattedNumber maximumFractionDigits={extra.decimals1} minimunFractionDigits={extra.decimals1}*/}
                  {/*value={contractParams.expected/Math.pow(10,extra.decimals1)}/>{extra.action==="Sell"?" TRX":""}*/}
                {/*</Field>*/}
              {(extra && extra.hash && 
                    <Field label="Hash">
                        <Truncate>
                          #{extra.hash}
                        </Truncate>
                    </Field>
                )}
              </tbody>
            </table>
          </Fragment>
        );

      case "EXCHANGECREATECONTRACT":
        return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">Exchange Create</h5>
            </div>
            <table className="table">
              <tbody>
              <Field label="Pair">
                {extra.token1}[{TronWeb.toUtf8(contractParams.first_token_id)}]&lt;
                =&gt;{extra.token2}[{TronWeb.toUtf8(contractParams.second_token_id)}]
              </Field>
              
              <Field label="Ratio">
                  <FormattedNumber maximumFractionDigits={extra.decimals1} minimunFractionDigits={extra.decimals1}  
                  value={contractParams.first_token_balance/Math.pow(10,extra.decimals1) }/>:
                  <FormattedNumber maximumFractionDigits={extra.decimals2} minimunFractionDigits={extra.decimals2}  
                  value={contractParams.second_token_balance/Math.pow(10,extra.decimals2) }/>
              </Field>

              {(extra && extra.hash && 
                   <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
                )}
              </tbody>
            </table>
          </Fragment>
        );

        case "EXCHANGEWITHDRAWCONTRACT":
        return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">Exchange Withdraw</h5>
            </div>
            <table className="table">
              <tbody>
              <Field label="Pair">
                {extra.pair}
              </Field>
              <Field label="Token base">
                {extra.token}
              </Field>
              
              <Field label="Amount">
                  <FormattedNumber maximumFractionDigits={extra.decimals} minimunFractionDigits={extra.decimals}  
                  value={contractParams.quant/Math.pow(10,extra.decimals) }/>
              </Field>

              {(extra && extra.hash && 
                   <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
                )}
              </tbody>
            </table>
          </Fragment>
        );
        case "ACCOUNTPERMISSIONUPDATECONTRACT":
          return (
            <Fragment>
              <div className="card-body">
                <h5 className="card-title text-center">Update Account Permission</h5>
              </div>
              <table className="table">
                <tbody>
                {(extra && extra.hash && 
                      <Field label="Hash">
                          <Truncate>
                            #{extra.hash}
                          </Truncate>
                      </Field>
                  )}
                  </tbody>
              </table>
            </Fragment>
          );
        case "PROPOSALCREATECONTRACT":
          return (
            <Fragment>
              <div className="card-body">
                <h5 className="card-title text-center">Raise Proposal</h5>
              </div>
              <table className="table">
                <tbody>
                {(extra && extra.hash && 
                      <Field label="Hash">
                          <Truncate>
                            #{extra.hash}
                          </Truncate>
                      </Field>
                  )}
                  </tbody>
              </table>
            </Fragment>
          );  
        case "PROPOSALAPPROVECONTRACT":
          return (
            <Fragment>
              <div className="card-body">
                <h5 className="card-title text-center">Vote For Proposal</h5>
              </div>
              <table className="table">
                <tbody>
                {(extra && extra.hash && 
                      <Field label="Hash">
                          <Truncate>
                            #{extra.hash}
                          </Truncate>
                      </Field>
                  )}
                  </tbody>
              </table>
            </Fragment>
          );
        case "PROPOSALDELETECONTRACT":
          return (
            <Fragment>
              <div className="card-body">
                <h5 className="card-title text-center">Delete Proposal</h5>
              </div>
              <table className="table">
                <tbody>
                {(extra && extra.hash && 
                      <Field label="Hash">
                          <Truncate>
                            #{extra.hash}
                          </Truncate>
                      </Field>
                  )}
                  </tbody>
              </table>
            </Fragment>
          );   
        case "EXCHANGEINJECTCONTRACT":
        return (
          <Fragment>
            <div className="card-body">
              <h5 className="card-title text-center">Exchange Inject</h5>
            </div>
            <table className="table">
              <tbody>
              <Field label="Pair">
                {extra.pair}
              </Field>
              <Field label="Token base">
                {extra.token}
              </Field>
              
              <Field label="Amount">
                  <FormattedNumber maximumFractionDigits={extra.decimals} minimunFractionDigits={extra.decimals}  
                  value={contractParams.quant/Math.pow(10,extra.decimals) }/>
              </Field>

              {(extra && extra.hash && 
                   <Field label="Hash">
                      <Truncate>
                        #{extra.hash}
                      </Truncate>
                  </Field>
                )}
              </tbody>
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
