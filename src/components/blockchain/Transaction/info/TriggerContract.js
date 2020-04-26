import React, {Fragment, useState, useEffect} from "react";
import {tu} from "../../../../utils/i18n";
import { Icon, Tooltip } from "antd";
import { upperFirst } from "lodash";
import {AddressLink, ExternalLink, ContractLink, TokenTRC20Link, TokenLink} from "../../../common/Links";
import {TRXPrice} from "../../../common/Price";
import {ONE_TRX, CONTRACT_ADDRESS_USDT, CONTRACT_ADDRESS_WIN, CONTRACT_ADDRESS_GGC, TRADINGMAP, SUNWEBCONFIG, IS_SUNNET} from "../../../../constants";
import rebuildList from "../../../../utils/rebuildList";
import BandwidthUsage from './common/BandwidthUsage'
import SignList from "./common/SignList";
import {TransationTitle} from './common/Title'
import {injectIntl} from "react-intl";
import {toThousands} from '../../../../utils/number'
import { QuestionMark } from "../../../common/QuestionMark.js";
import BigNumber from "bignumber.js";
BigNumber.config({ EXPONENTIAL_AT: [-1e9, 1e9] });

function TriggerContract({contract,intl}){
    const defaultImg = require("../../../../images/logo_default.png");
    return (
      <Fragment>
        <TransationTitle contractType={contract.contractType}></TransationTitle>
        <div className="content">
          <div className="content_pos">
            <div className="d-flex border-bottom pt-2">
              <div className="content_box_name">
                {tu("transaction_owner_address")}:
              </div>
              <div className="flex1">
                <div className="d-flex border-bottom content_item">
                  {/*  Distinguish between contract and ordinary address */}
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
                </div>
              </div>
            </div>
            <div className="d-flex border-bottom">
              <div className="content_box_name">
                {tu("contract_address")}:
              </div>
              <div className="flex1">
                <div className="d-flex content_item">
                   {/*  Distinguish between contract and ordinary address */}
                   <span className="d-flex">
                    {/*  Distinguish between contract and ordinary address */}
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
                      <AddressLink address={contract["contract_address"]} isContract={true}>
                        {contract["contract_address"]}
                      </AddressLink>
                  </span>
                </div>
                <div className="d-flex">
                {JSON.stringify(contract.internal_transactions) !=
                    "{}" && (
                      <div className="flex1">
                        {Object.keys(
                          contract.internal_transactions
                        ).map((o, index) => {
                          let vdom = [];
                          contract.internal_transactions[o].map(
                            (item, cindex) => {
                              // let tokenInfo = rebuildList(
                              //   JSON.parse(item.value_info_list),
                              //   "token_id",
                              //   "call_value"
                              // )[0];
                              let tokenList = rebuildList(
                                JSON.parse(item.value_info_list),
                                "token_id",
                                "call_value"
                              )
                              let vnode = []
                              tokenList.map(v=>{
                                vnode.push(
                                  <div
                                  key={v.map_token_id}
                                  className={
                                    "d-flex align-items-center content_item trans-item-padding"
                                  }
                                >
                                  <div className="d-flex item-belong">
                                    {/* <div className="mr-1">
                                      {tu("transfers")}
                                    </div> */}
                                    
                                    <div className="mr-2">
                                      {tu("from")}
                                    </div>
                                    {/*  Distinguish between contract and ordinary address */}
                                    {contract.contract_map[item["caller_address"]]? (
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
                                    <div
                                      className="mr-2"
                                      style={{ width: "169px" }}
                                    >
                                      <ContractLink
                                        address={
                                          item["caller_address"]
                                        }
                                      >
                                        {item["caller_address"]}
                                      </ContractLink>
                                    </div>
                                    <img className="mr-2" src={require('../../../../images/transaction/arrow.png')} style={{height: '11px',width: '16px',margin: '6px 5px 0'}}></img>
                                    <div className="mr-2">
                                      {tu("to")}
                                    </div>
                                    {/*  Distinguish between contract and ordinary address */}
                                    {contract.contract_map[item["transfer_to_address"]]? (
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
                                    <div
                                      className="mr-2"
                                      style={{ width: "169px" }}
                                    >
                                      <ContractLink
                                        address={
                                          item["transfer_to_address"]
                                        }
                                      >
                                        {item["transfer_to_address"]}
                                      </ContractLink>
                                    </div>
                                    <div className="mx-2">
                                      {v.map_amount + " "}
                                      {/* {v.map_token_id} */}
                                      {v.map_token_id ? <TokenLink
                                        id={v.map_token_id}
                                        name={v.map_token_name_abbr || v.map_token_name}
                                        ></TokenLink> : v.map_token_name_abbr}
                                    </div>
                                  </div>
                                </div>
                                )
                              })
                              vdom.push(vnode);
                            }
                          );
                          return vdom;
                        })}
                      </div>
                  )}
                </div>
              </div>
            </div>
            <div className="d-flex border-bottom">
              <div className="content_box_name">
                {tu("value")}:
              </div>
              <div className="flex1">
                <div className="d-flex content_item">
                  {contract["call_value"] ? (
                    <TRXPrice
                      amount={contract["call_value"] / ONE_TRX}
                    />
                  ) : (
                    <TRXPrice amount={0} />
                  )}
                </div>
              </div>
            </div>
            {
              (!contract.tokenTransferInfo && contract.contract_note) && <div className="d-flex border-bottom">
                <div className="content_box_name">
                  {tu("note")}:
                </div>
                <div className="flex1">
                  <div className="d-flex content_item">
                    {contract.contract_note || ""}
                  </div>
                </div>
            </div>
            }
            
            {contract.tokenTransferInfo &&
              contract.tokenTransferInfo.decimals !==
                undefined &&
              contract.tokenTransferInfo.symbol !==
                undefined && (
                <div className="d-flex border-bottom">
                  <div className="content_box_name">
                    {tu("TRC20_transfers")}:
                  </div>
                  <div className="flex1">
                    <div className="d-flex content_item">
                      <div className="content_name">
                        {tu("from")}
                      </div>
                      <div className="flex1 d-flex">
                        {contract.contract_map[contract.tokenTransferInfo["from_address"]]? (
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
                        <AddressLink
                          address={
                            contract.tokenTransferInfo[
                              "from_address"
                            ]
                          }
                          isContract={contract.contract_map[contract.tokenTransferInfo["from_address"]]}
                        >
                          {
                            contract.tokenTransferInfo[
                              "from_address"
                            ]
                          }
                        </AddressLink>
                      </div>
                    </div>
                    <div className="d-flex content_item trans-item-padding">
                      <div className="content_name">
                        {tu("to")}
                      </div>
                      <div className="flex1 d-flex">
                        {contract.contract_map[contract.tokenTransferInfo["to_address"]]? (
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
                        <AddressLink
                          address={
                            contract.tokenTransferInfo[
                              "to_address"
                            ]
                          }
                          isContract={contract.contract_map[contract.tokenTransferInfo["to_address"]]}
                        >
                          {
                            contract.tokenTransferInfo[
                              "to_address"
                            ]
                          }
                        </AddressLink>
                      </div>
                    </div>
                    
                    <div className="d-flex content_item trans-item-padding">
                      <div className="content_name">
                        {tu("amount")}
                      </div>
                      <div className="flex1">
                        {
                          toThousands(
                            new BigNumber(Number(contract.tokenTransferInfo["amount_str"])).dividedBy(
                            Math.pow(10, contract.tokenTransferInfo["decimals"])
                            )
                          )  
                        }
                      </div>
                    </div>

                    
                    <div className="d-flex content_item trans-item-padding">
                      <div className="content_name">
                        {tu("token_txs_info")}
                      </div>
                      <div className="flex1">
                        {/* {contract.tokenTransferInfo[
                          "contract_address"
                        ] == CONTRACT_ADDRESS_USDT ||
                        contract.tokenTransferInfo[
                          "contract_address"
                        ] == CONTRACT_ADDRESS_WIN ||
                        contract.tokenTransferInfo[
                          "contract_address"
                        ] == CONTRACT_ADDRESS_GGC ? (
                          <b
                            className="token-img-top"
                            style={{ marginRight: 5 }}
                          >
                            <img
                              width={20}
                              height={20}
                              src={
                                contract.tokenTransferInfo[
                                  "icon_url"
                                ]
                              }
                              alt={
                                contract.tokenTransferInfo[
                                  "name"
                                ]
                              }
                              onError={e => {
                                e.target.onerror = null;
                                e.target.src = defaultImg;
                              }}
                            />
                            <i
                              style={{
                                width: 10,
                                height: 10,
                                bottom: -5
                              }}
                            ></i>
                          </b>
                        ) : (
                          <img
                            width={20}
                            height={20}
                            src={
                              contract.tokenTransferInfo[
                                "icon_url"
                              ]
                            }
                            alt={
                              contract.tokenTransferInfo["name"]
                            }
                            style={{ marginRight: 5 }}
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = defaultImg;
                            }}
                          />
                        )} */}
                        <TokenTRC20Link
                          name={
                            contract.tokenTransferInfo["name"]
                          }
                          address={
                            contract.tokenTransferInfo[
                              "contract_address"
                            ]
                          }
                          namePlus={
                            // contract.tokenTransferInfo["name"] +
                            // " (" +
                            contract.tokenTransferInfo[
                              "symbol"
                            ] 
                            // + ")"
                          }
                        />
                      </div>
                    </div>
                    {contract.contract_note && <div className="d-flex content_item trans-item-padding">
                      <div className="content_name">
                        {tu("note")}
                      </div>
                      <div className="flex1">
                        {contract.contract_note || ""}
                      </div>
                    </div>}      
                  </div>
                </div>
              )}
            {
              JSON.stringify(contract.cost) != "{}" && 
                <div className="d-flex border-bottom">
                  <div className="content_box_name">
                    {tu("consume_bandwidth")}:
                  </div>
                  <div style={{paddingTop: '10px'}}>
                    <BandwidthUsage cost={contract.cost}></BandwidthUsage>
                  </div>
                </div>
            }
            {
              JSON.stringify(contract.cost) != "{}" && 
                <div className="d-flex border-bottom">
                  <div className="content_box_name">
                    {tu("consume_energy")}:
                  </div>
                  <div style={{paddingTop: '10px'}}>
                    <BandwidthUsage cost={contract.cost} type="1"></BandwidthUsage>
                  </div>
                </div>
            }
            {contract.method && (
              <div className="d-flex border-bottom">
                <div className="content_box_name">
                  {tu("Method_calling")}:
                </div>
                <div className="flex1">
                  <div className="d-flex content_item">
                    {/* <div className="content_name">
                      {tu("contract_method")}:
                    </div> */}
                    <div className="flex1" style={{wordBreak: 'break-all'}}>
                      {contract.method}
                    </div>
                  </div>
                  {contract.parameter &&
                    Object.keys(contract.parameter).map(p => {
                      return (
                        <div
                          className="d-flex content_item trans-item-padding"
                          key={p}
                        >
                          <div className="content_name">
                            {p}:
                          </div>
                          <div className="flex1" style={{wordBreak: 'break-all'}}>
                            {contract.parameter[p]}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            {contract.signature_addresses && contract.signature_addresses.length > 1 && (
              <div className="d-flex border-bottom">
                <div className="content_box_name">
                  {tu("signature_list")}
                  <span className="ml-1">
                    <QuestionMark
                      placement="top"
                      text="only_show_sinatures"
                    />
                  </span>:
                </div>
                <div className="flex1" style={{padding: '10px 0'}}>
                  <SignList signList={contract.signature_addresses} />
                </div>
              </div>
              )}
          </div>
        </div>
      </Fragment>
    );
}

export default injectIntl(TriggerContract)