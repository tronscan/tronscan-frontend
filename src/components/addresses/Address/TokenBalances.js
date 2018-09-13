import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedNumber} from "react-intl";
import {filter} from "lodash";
import {TokenLink} from "../../common/Links";
import SmartTable from "../../common/SmartTable.js"
import {upperFirst} from "lodash";
import {ONE_TRX} from "../../../constants";

export function TokenBalances({tokenBalances, intl}) {

  if (Object.keys(tokenBalances).length === 0 || (Object.keys(tokenBalances).length === 1 && tokenBalances[0].name === "TRX")) {
    return (
        <div className="text-center p-3">
          {tu("no_tokens_found")}
        </div>
    );
  }
  let column = [
    {
      title: upperFirst(intl.formatMessage({id: 'token'})),
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      className: 'ant_table',
      render: (text, record, index) => {
        return <TokenLink name={text}/>
      }
    },
    {
      title: upperFirst(intl.formatMessage({id: 'balance'})),
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      className: 'ant_table',
      render: (text, record, index) => {
        return <FormattedNumber value={text}/>
      }
    },

  ];
  let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + tokenBalances.length + ' ' + intl.formatMessage({id: 'token_unit'})


  return (
      <div className="token_black table_pos">
        {tokenBalances.length ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
        <SmartTable bordered={true} column={column} data={tokenBalances} total={tokenBalances.length}/>
      </div>
  )
}
