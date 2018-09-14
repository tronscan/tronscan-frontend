/* eslint-disable no-undef */
import React from "react";
import TimeAgo from "react-timeago";
import {FormattedNumber} from "react-intl";
import {BlockNumberLink} from "../../common/Links";
import {tu} from "../../../utils/i18n";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";

export default function Blocks({blocks = []}) {

  if (blocks.length === 0) {
    return (
        <div className="text-center p-3">
          {tu("no_blocks_found")}
        </div>
    );
  }
  let column = [
    {
      title: upperFirst(intl.formatMessage({id: 'height'})),
      dataIndex: 'number',
      key: 'number',
      align: 'left',
      className: 'ant_table',
      render: (text, record, index) => {
        return <BlockNumberLink number={text}/>
      }
    },
    {
      title: upperFirst(intl.formatMessage({id: 'age'})),
      dataIndex: 'timestamp',
      key: 'timestamp',
      align: 'right',
      className: 'ant_table',
      render: (text, record, index) => {
        return <TimeAgo date={text}/>
      }
    },
    {
      title: <i className="fas fa-exchange-alt"/>,
      dataIndex: 'nrOfTrx',
      key: 'nrOfTrx',
      align: 'right',
      className: 'ant_table',
      render: (text, record, index) => {
        return <FormattedNumber value={text}/>
      }
    },
    {
      title: upperFirst(intl.formatMessage({id: 'bytes'})),
      dataIndex: 'size',
      key: 'size',
      align: 'right',
      className: 'ant_table',
      render: (text, record, index) => {
        return <FormattedNumber value={text}/>
      }
    },


  ];
  return (

      <div className="token_black">
        <SmartTable bordered={true} column={column} data={blocks} total={blocks.length}/>
      </div>

  )
}
