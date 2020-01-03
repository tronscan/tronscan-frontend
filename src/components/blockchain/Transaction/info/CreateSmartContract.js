import React, {Fragment, useState, useEffect} from "react";
import {tu, t} from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
import { upperFirst } from "lodash";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, TRADINGMAP, SUNWEBCONFIG, IS_SUNNET} from "../../../../constants";
import rebuildList from "../../../../utils/rebuildList";
import BandwidthUsage from './common/BandwidthUsage'
import SignList from "./common/SignList";
import {TransationTitle} from './common/Title'
import {injectIntl} from "react-intl";
import Field from "../../../tools/TransactionViewer/Field";
import {toUtf8} from 'tronweb'
import { Client } from "../../../../services/api";

async function contractValue(id) {
  let contract = await Client.getContractOverview(id);
  let contractValue = "";

  if (contract.call_token_value) {
    let tokenList = [{ token_id: contract.call_token_id }];
    let tokenInfo = rebuildList(tokenList, "token_id", "amount")[0];
    let value =
      contract.call_token_value /
      Math.pow(10, tokenInfo.map_token_precision || 6);
    if (contract.call_value) {
      contractValue = `${contract.call_value} TRX ${value} ${tokenInfo.map_token_name}`;
    } else {
      contractValue = `${value} ${tokenInfo.map_token_name}`;
    }
  } else {
    if (contract.call_value) {
      contractValue = `${contract.call_value} TRX`;
    } else {
      contractValue = 0;
    }
  }

  return contractValue;
}
const useFetch = (id) => {
  const [data, updateData] = useState(0)

  async function getData(){
    const value = await contractValue(id).catch(e=>{
      updateData(0) 
    })
    updateData(value)
  }
  useEffect(() => {
    getData()
  }, [getData, id])

  return data
}
function CreateSmartContract({contract,intl}){
  const value = useFetch('TDdZsKY5Mfi959yEyJ1otgfKsNSbBPGPfb')
  return (
    <Fragment>
      <TransationTitle contractType={contract.contractType}></TransationTitle>
      <div className="table-responsive">
      <table className="table">
        <tbody>
          <Field label="contract_creator"><AddressLink address={contract['owner_address']}/></Field>
          <Field label="contract_address">
            <AddressLink
              address={contract["contract_address"]}
              isContract={true}
            >
              <Tooltip
                placement="top"
                title={upperFirst(
                  intl.formatMessage({
                    id: "transfersDetailContractAddress"
                  })
                )}
              >
                <Icon
                  type="file-text"
                  style={{
                    fontSize: 12,
                    verticalAlign: 2,
                    marginRight: 4,
                    color: "#333"
                  }}
                />
              </Tooltip>
              {contract["owner_address"]}
            </AddressLink>
            {/* <AddressLink address={contract['owner_address']}/> */}
          </Field>
          <Field label="contract_name">{contract.new_contract.name}</Field>
          <Field label="contract_enery" tip text={t('contract_enery_tip')}>
            {tu("contract_percent")}
            {100 - contract.new_contract.consume_user_resource_percent}%
            {"  "}
            {tu("contract_percent_user")}
            {contract.new_contract.consume_user_resource_percent}%
          </Field>
          <Field label="contract_init_assets" tip="true" text={t('contract_init_assets_tip')}>{value}</Field>
          {JSON.stringify(contract.cost) != "{}" && (
            <Field label="consume_bandwidth">
              <BandwidthUsage cost={contract.cost} />
            </Field>
          )}
          {JSON.stringify(contract.cost) != "{}" && (
            <Field label="consume_energy">
              <BandwidthUsage cost={contract.cost} type="1" />
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
  );
}

export default injectIntl(CreateSmartContract)