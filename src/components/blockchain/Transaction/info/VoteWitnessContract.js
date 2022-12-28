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
import {toThousands} from '../../../../utils/number'


function setUnit(count){
  return count > 1 ? t('trans_tickets') : t('trans_ticket')
}

function VoteWitnessContract({contract,intl}){
  
  let count = 0
  if(contract.votes){
    contract.votes.map(v => {
      count+=v.vote_count
    })
  }

  return(
    <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="table-responsive">
        <table className="table">
            <tbody>
            <Field label="initiate_address">
              <span className="d-flex">
                {/*  Distinguish between contract and ordinary address */}
                {contract.contract_map[contract["owner_address"]]? (
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
                    <AddressLink address={contract["owner_address"]} isContract={true}>
                      {contract["owner_address"]}
                    </AddressLink>
                  </span>
                ) :
                <AddressLink address={contract["owner_address"]}>
                  {contract["owner_address"]}
                </AddressLink>
                }
              </span>
            </Field>
            <Field label="votes_count">
              <div className="flex1">
                <div className="d-flex band-item">{toThousands(count)}&nbsp;{setUnit(count)}</div>
                {
                  contract.votes.map((vote,index) => (
                    <div className="d-flex band-item item-belong" key={index}>
                      <span style={{marginRight: '10px'}}>{tu('candidate_address')}:</span>
                      <div style={{minWidth: '340px'}} className="d-flex">
                        {/*  Distinguish between contract and ordinary address */}
                        {contract.contract_map[contract["owner_address"]]? (
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
                          <AddressLink address={vote['vote_address']} truncate={false}/> &nbsp;{vote.tag && `(${vote.tag})`}
                      </div>
                      <span style={{margin: '0 10px'}}>{tu("counts") }:</span> { toThousands(vote['vote_count'])} &nbsp;{setUnit(vote['vote_count'])}
                    </div>
                  ))
                }
              </div>
            </Field>
            {JSON.stringify(contract.cost) != "{}" && (
              <Field label="consume_bandwidth">
                <BandwidthUsage cost={contract.cost} />
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
  )
}

export default injectIntl(VoteWitnessContract)
