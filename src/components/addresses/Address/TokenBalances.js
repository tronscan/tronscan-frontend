import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {filter} from "lodash";
import {TokenLink} from "../../common/Links";

export function TokenBalances({tokenBalances}) {
  if (Object.keys(tokenBalances).length === 0 || (Object.keys(tokenBalances).length === 1 && tokenBalances[0].name === "TRX")) {
    return (
      <div className="text-center p-3">
        {tu("no_tokens_found")}
      </div>
    );
  }

  return (
    <table className="table table-hover m-0 border-top-0">
      <thead className="thead-dark">
        <tr>
          <th>{tu("token")}</th>
          <th style={{width: 125 }} className="text-right">{tu("balance")}</th>
        </tr>
      </thead>
      <tbody>
      {
        filter(tokenBalances, tb => tb.name !== "TRX").map(tokenBalance => (
          <tr key={tokenBalance.name}>
            <td>
              <TokenLink name={tokenBalance.name}/>
            </td>
            <td className="text-right">
              <FormattedNumber value={tokenBalance.balance}/>
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}
