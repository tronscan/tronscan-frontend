import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {AddressLink} from "../../common/Links";
import {ONE_TRX} from "../../../constants";


export function Transactions({transactions}) {

  if (transactions.length === 0) {
    return (
      <div className="text-center p-3">
        {tu("no_transactions_found")}
      </div>
    );
  }

  return (
    <table className="table table-hover m-0 border-top-0">
      <thead className="thead-dark">
        <tr>
          <th style={{width: 125 }}>{tu("from")}</th>
          <th style={{width: 125 }}>{tu("to")}</th>
          <th style={{width: 125 }}>{tu("amount")}</th>
        </tr>
      </thead>
      <tbody>
      {
        transactions.map((transaction) => (
          <tr key={transaction.hash}>
            <td>
              <AddressLink address={transaction.transferFromAddress} />
              </td>
            <td>
              <AddressLink address={transaction.transferToAddress} />
            </td>
            <td className="text-nowrap">
              <FormattedNumber value={transaction.amount / ONE_TRX} />&nbsp; TRX
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}
