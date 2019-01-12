import {tu} from "../../../utils/i18n";
import React from "react";

export default function Field({ label, children }) {
  return (
    <tr>
      <th className="text-nowrap">{tu(label)}</th>
      <td className="text-right">{children}</td>
    </tr>
  )
}
