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

async function getContractValue(id) {
  let res = await Client.getContractOverview(id);
  let contractValue = "";
  let contract = res && res.data && res.data[0]

  if (contract.call_token_value) {
    let tokenList = [{ token_id: contract.call_token_id }];
    let tokenInfo = rebuildList(tokenList, "token_id", "amount")[0];
    let value =
      contract.call_token_value /
      Math.pow(10, tokenInfo.map_token_precision || 6);
    if (contract.call_value) {
      let trxValue = contract.call_value / 1000000
      contractValue = `${trxValue} TRX ${value} ${tokenInfo.map_token_name}`;
    } else {
      contractValue = `${value} ${tokenInfo.map_token_name}`;
    }
  } else {
    if (contract.call_value) {
      let trxValue = contract.call_value / 1000000
      contractValue = `${trxValue} TRX`;
    } else {
      contractValue = '0 TRX';
    }
  }

  return contractValue;
}
const useFetch = (id) => {
  const [data, updateData] = useState('0 TRX')

  async function getData(){
    const value = await getContractValue(id).catch(e=>{
      updateData('0 TRX') 
    })
    updateData(value)
  }
  useEffect(() => {
    getData()
  })

  return data
}
function CreateSmartContract({contract,intl}){
  const value = useFetch(contract.info && contract.info.contract_address)
  return (
    <Fragment>
      <TransationTitle contractType={contract.contractType}></TransationTitle>
      <div className="table-responsive">
      <table className="table">
        <tbody>
          <Field label="contract_creator">
            <span className="d-flex">
              {/*  Distinguish between contract and ordinary address */}
              {contract.contract_map[contract['owner_address']]? (
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
                        verticalAlign: 0,
                        color: "#77838f",
                        lineHeight: 1.4
                      }}
                  />
                  </Tooltip>
              ) :null}
              <AddressLink address={contract['owner_address']}/>
            </span>
          </Field>
          <Field label="contract_address">
            <span className="d-flex">
              {/*  Distinguish between contract and ordinary address */}
              <span className="d-flex">
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
                      verticalAlign: 0,
                      color: "#77838f",
                      lineHeight: 1.4
                    }}
                />
                </Tooltip>
                <AddressLink
                  address={contract.info && contract.info.contract_address}
                  isContract={true}
                >
                  {contract.info && contract.info.contract_address}
                </AddressLink>
              </span>
            </span>
          </Field>
          <Field label="contract_name">{contract.new_contract.name}</Field>
          <Field label="contract_enery" tip text={t('contract_enery_tip')}>
            {tu("contract_percent")}&nbsp;
            {100 - (contract.new_contract.consume_user_resource_percent || 0)}%,
            {"  "}
            {tu("contract_percent_user")}&nbsp;
            {(contract.new_contract.consume_user_resource_percent || 0)}%
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
          {contract.signature_addresses && contract.signature_addresses.length > 1 && (
            <Field label="signature_list" tip={true} text={tu('only_show_sinatures')}>
              <SignList signList={contract.signature_addresses} />
            </Field>
          )}
        </tbody>
      </table>
      </div>
    </Fragment>
  );
}

export default injectIntl(CreateSmartContract)