import {tu} from "../../../utils/i18n";
import React from "react";
import {QuestionMark} from '../../common/QuestionMark'

export default function Field({label, children,tip=false,text}) {
  return (
    <tr>
      <th>{tu(label)}{tip && <QuestionMark text={text} className="ml-2"></QuestionMark>}</th>
      <td>{children}</td>
    </tr>
  )
}
