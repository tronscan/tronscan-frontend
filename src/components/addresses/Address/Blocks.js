/* eslint-disable no-undef */
import React from "react";
import {isNaN, random, range} from "lodash";
import TimeAgo from "react-timeago";
import {FormattedNumber} from "react-intl";
import {BlockNumberLink} from "../../common/Links";
import {tu} from "../../../utils/i18n";

export default function Blocks({blocks = []}) {

  if (blocks.length === 0) {
    return (
      <div className="text-center p-3">
        {tu("no_blocks_found")}
      </div>
    );
  }

  return (
      <table className="table table-hover m-0 table-striped">
        <thead className="thead-dark">
        <tr>
          <th style={{width: 100}}>{tu("height")}</th>
          <th style={{width: 150}}>{tu("age")}</th>
          <th style={{width: 100}}><i className="fas fa-exchange-alt"/></th>
          <th style={{width: 100}}>{tu("bytes")}</th>
        </tr>
        </thead>
        <tbody>
        {
          blocks.map(block => (
            <tr key={block.number}>
              <th>
                <BlockNumberLink number={block.number}/>
              </th>
              <td className="text-nowrap"><TimeAgo date={block.timestamp} /></td>
              <td style={{width: 100}}><FormattedNumber value={block.nrOfTrx} /></td>
              <td>
                <FormattedNumber value={block.size}/>
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
  )
}
