import React, {Fragment, useState, useEffect} from "react";
import {tu} from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
import { upperFirst } from "lodash";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, TRADINGMAP, SUNWEBCONFIG, IS_SUNNET} from "../../../../constants";
import rebuildList from "../../../../utils/rebuildList";
import BandwidthUsage from './common/BandwidthUsage'
import SignList from "./common/SignList"
import {TransationTitle} from './common/Title'
import {injectIntl} from "react-intl";
import Field from "../../../tools/TransactionViewer/Field";
import xhr from "axios/index";

const useFetch = (id) => {
  const [data, updateData] = useState('')

  async function getData(){
    let res = await xhr.get('https://api.trongrid.io/wallet/gettransactionbyid', {params : {
      value: id,
      visible: true
    }}).catch(e=>{
      updateData('')
    })
    const name = res && res.data && res.data.raw_data && res.data.raw_data.contract && res.data.raw_data.contract[0] && res.data.raw_data.contract[0].parameter && res.data.raw_data.contract[0].parameter.value && res.data.raw_data.contract[0].parameter.value.account_id
    updateData(name)
  }

  useEffect(() => {
    getData()
  }, [getData])

  return data
}

export default function SetAccountIdContract({contract}){
  const name = useFetch(contract.hash)
  return(
    <Fragment>
      <TransationTitle contractType={contract.contractType}></TransationTitle>
      <div className="table-responsive">
      <table className="table">
          <tbody>
          <Field label="initiate_address"><AddressLink address={contract['owner_address']||contract['ownerAddress']}/></Field>
          <Field label="account_id">{name}</Field>
          {JSON.stringify(contract.cost) != "{}" && (
            <Field label="consume_bandwidth">
              <BandwidthUsage cost={contract.cost} />
            </Field>
          )}
          {contract.signList && (
            <Field label="signature_list">
              <SignList signList={contract.signList} />
            </Field>
          )}
          </tbody>
      </table>
      </div>
    </Fragment>
  )
}
