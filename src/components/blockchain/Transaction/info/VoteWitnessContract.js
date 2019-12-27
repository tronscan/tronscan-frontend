import React, {Fragment, useState, useEffect} from "react";
import {tu} from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
import { upperFirst } from "lodash";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link} from "../../../common/Links";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, TRADINGMAP, SUNWEBCONFIG, IS_SUNNET} from "../../../../constants";
import rebuildList from "../../../../utils/rebuildList";
import BandwidthUsage from './common/BandwidthUsage'
import {TransationTitle} from './common/Title'
import {injectIntl} from "react-intl";
import Field from "../../../tools/TransactionViewer/Field";
import {toThousands} from '../../../../utils/number'


export default function VoteWitnessContract({contract}){
  
  let count = 0
  if(contract.votes){
    contract.votes.map(v => {
      count+=v.vote_count
    })
  }


  return(
    <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <table className="table">
            <tbody>
            <Field label="initiate_address"><AddressLink address={contract['owner_address']}/></Field>
            <Field label="votes_count">
              <div className="flex1">
                <div className="d-flex band-item">{toThousands(count)}</div>
                {
                  contract.votes.map((vote,index) => (
                    <div className="d-flex band-item item-belong" key={index}>
                      <span style={{marginRight: '10px'}}>{tu('candidate_address')}:</span>
                      <div style={{minWidth: '320px'}}><AddressLink address={vote['vote_address']} truncate={false}/></div>
                      <span style={{margin: '0 5px'}}>{tu("counts") }:</span> { toThousands(vote['vote_count'])}
                    </div>
                  ))
                }
              </div>
            </Field>
            <Field label="consume_bandwidth">
              <BandwidthUsage cost={contract.cost}></BandwidthUsage>
            </Field>
            </tbody>
        </table>
    </Fragment>
  )
}
