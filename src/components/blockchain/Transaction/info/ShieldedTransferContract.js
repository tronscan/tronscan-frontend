import React, { Fragment } from "react";
import {
  ONE_TRX,
} from "../../../../constants";
import { injectIntl } from "react-intl";
import Field from "../../../tools/TransactionViewer/Field";

function ShieldedTransferContract({ contract, intl }) {
    
  let contract_arr = Object.keys(contract);
  let noSet = [
    "cost",
    "internal_transactions",
    "map_token_name_abbr",
    "map_token_id",
    "map_token_precision",
    "map_amount",
    "map_amount_logo",
    "map_token_name",
    "contract_note",
    "tokenTransferInfo",
    "contract_map",
    "exchangeInfo",
    "hash",
    "info",
    "ownerAddress",
    "parameterValue",
    "signature_addresses",
    "timestamp",
    "transparent_from_address"

  ];
  return (
    <Fragment>
      <div className="card-body table-title">
        <h5>
          <i className="fa fa-exchange-alt"></i>
          <small>{"SHIELDEDTRANSFERCONTRACT"}</small>
        </h5>
      </div>
      <table className="table">
        <tbody>
          {contract_arr.map((item) => {
            if (noSet.includes(item) || !item) {
              return "";
            } else if (item == "receive_description") {
              let receive_description_arr = contract[item];
              return (
                <Field label={item}>
                  {receive_description_arr.map((subItem) => {
                    return (
                      <ul className="mb-2">
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            value_commitment:
                          </span>
                          {subItem && subItem.value_commitment}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            note_commitment:
                          </span>
                          {subItem && subItem.note_commitment}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            epk:
                          </span>
                          {subItem && subItem.epk}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            c_enc:
                          </span>
                          {subItem && subItem.c_enc}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            c_out:
                          </span>
                          {subItem && subItem.c_out}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            zkproof:
                          </span>
                          {subItem && subItem.zkproof}
                        </li>
                      </ul>
                    );
                  })}
                </Field>
              );
            } else if (item == "spend_description") {
              let spend_description_arr = contract[item];
              return (
                <Field label={item}>
                  {spend_description_arr.map((subItem) => {
                    return (
                      <ul className="mb-2">
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            value_commitment:
                          </span>
                          {subItem && subItem.value_commitment}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            anchor:
                          </span>
                          {subItem && subItem.anchor}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            nullifier:
                          </span>
                          {subItem && subItem.nullifier}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            rk:
                          </span>
                          {subItem && subItem.rk}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            zkproof:
                          </span>
                          {subItem && subItem.zkproof}
                        </li>
                        <li>
                          <span className="receive-item mr-2 text-muted">
                            spend_authority_signature:
                          </span>
                          {subItem && subItem.spend_authority_signature}
                        </li>
                      </ul>
                    );
                  })}
                </Field>
              );
            } else {
              if (item == "to_amount" || item == "from_amount") {
                return <Field label={item}>{contract[item] / ONE_TRX}</Field>;
              } else {
                return <Field label={item}>{contract[item]}</Field>;
              }
            }
          })}
        </tbody>
      </table>
    </Fragment>
  );
}

export default injectIntl(ShieldedTransferContract);
