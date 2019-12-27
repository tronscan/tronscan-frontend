import React, {Fragment, useState, useEffect} from "react";
import {tu} from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
import { upperFirst } from "lodash";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, TRADINGMAP, SUNWEBCONFIG, IS_SUNNET} from "../../../../constants";
import rebuildList from "../../../../utils/rebuildList";
import BandwidthUsage from './common/BandwidthUsage'
import {injectIntl} from "react-intl";
import Field from "../../../tools/TransactionViewer/Field";

export default function WitnessCreateContract({contract}){
  return(
    <Fragment>
      <div className="card-body table-title">
          <h5>
              <i className="fa fa-exchange-alt"></i>
              {tu("witness_create_contract")}
              <small>{tu("create_a_witness")}</small>
          </h5>
      </div>
      <table className="table">
          <tbody>
          <Field label="owner_address"><AddressLink address={contract['owner_address']}/></Field>
          <Field label="URL">{contract.url}</Field>
          {
            contract.cost && <BandwidthUsage cost={contract.cost}></BandwidthUsage>
          }
          </tbody>
      </table>
    </Fragment>
  )
}
