import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {AddressLink} from "../../common/Links";

export function TokenHolders({tokenHodlers = [], token}) {

  if (!token || tokenHodlers.length === 0) {
    return (
      <div className="text-center p-3">
        {tu("no_holders_found")}
      </div>
    );
  }

  return (
    <table className="table table-hover m-0 border-top-0">
      <thead className="thead-dark">
      <tr>
          <th style={{width: 125 }}>{tu("address")}</th>
          <th style={{width: 125 }}>{tu("quantity")}</th>
          <th style={{width: 125 }}>{tu("percentage")}</th>
        </tr>
      </thead>
      <tbody>
      {
        tokenHodlers.map((tokenHodler,index) => (
          <tr key={index}>
            <td>
              <AddressLink address={tokenHodler.address} />
            </td>
            <td className="text-nowrap">
              <FormattedNumber value={tokenHodler.balance} />&nbsp;
            </td>
            <td className="text-nowrap">
              <FormattedNumber
                value={(((tokenHodler.balance) / token.totalSupply) * 100)}
                minimumFractionDigits={4}
                maximumFractionDigits={8}
              /> %
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}
