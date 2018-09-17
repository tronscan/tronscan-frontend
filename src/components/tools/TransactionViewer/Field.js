import {tu} from "../../../utils/i18n";
import React from "react";


export default function Field({label, children}) {
  return (
    <tr>
      <th>{tu(label)}</th>
      <td>{children}</td>
    </tr>
  )
}
