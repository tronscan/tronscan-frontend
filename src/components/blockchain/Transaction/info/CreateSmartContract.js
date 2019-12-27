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

function CreateSmartContract({contract,intl}){
    const defaultImg = require("../../../../images/logo_default.png");

    return (
      <Fragment>
        <div className="card-body table-title">
          <h5>
            <i className="fa fa-exchange-alt"></i>
            {tu("trigger_smart_contract")}
            <small>{tu('normal_address_trigger_smart_contract')}</small>
          </h5>
          {/* {getTitle(contract)} */}
        </div>
        <div className="content">
          <div className="content_pos">
            <div className="d-flex border-bottom pt-2">
              <div className="content_box_name">
                {tu("contract_triggers_owner_address")}
              </div>
              <div className="flex1">
                <div className="d-flex border-bottom content_item">
                  <AddressLink
                    address={contract["owner_address"]}
                  >
                    {contract["owner_address"]}
                  </AddressLink>
                </div>
              </div>
            </div>
            <div className="d-flex border-bottom pt-2">
              <div className="content_box_name">
                {tu("contract_address")}
              </div>
              <div className="flex1">
                <div className="d-flex border-bottom content_item">
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
                          verticalAlign: 2,
                          color: "#77838f"
                        }}
                      />
                    </Tooltip>
                    {contract["contract_address"]}
                  </AddressLink>
                </div>
                <div className="d-flex border-bottom content_item">
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
                              let tokenInfo = tokenList[0]
                              let vnode = []
                              tokenList.map(v=>{
                                vnode.push(
                                  <div
                                  key={item.transaction_id}
                                  className={
                                    "d-flex align-items-center content_item"
                                  }
                                >
                                  <div className="d-flex">
                                    {/* <div className="mr-1">
                                      {tu("transfers")}
                                    </div> */}
                                    <div className="mr-1">
                                      {v.map_amount +
                                        " " +
                                        v.map_token_name_abbr}
                                    </div>
                                    <div className="mr-1">
                                      {tu("from")}
                                    </div>
                                    <div
                                      className="mr-1"
                                      style={{ width: "150px" }}
                                    >
                                      <ContractLink
                                        address={
                                          item["caller_address"]
                                        }
                                      >
                                        {item["caller_address"]}
                                      </ContractLink>
                                    </div>
                                    <div className="mr-1">
                                      {tu("to")}
                                    </div>
                                    <div
                                      className="mr-1"
                                      style={{ width: "150px" }}
                                    >
                                      <ContractLink
                                        address={
                                          item["transfer_to_address"]
                                        }
                                      >
                                        {item["transfer_to_address"]}
                                      </ContractLink>
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
            <div className="d-flex border-bottom pt-2">
              <div className="content_box_name">
                {tu("value")}
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
            {contract.tokenTransferInfo &&
              contract.tokenTransferInfo.decimals !==
                undefined &&
              contract.tokenTransferInfo.symbol !==
                undefined && (
                <div className="d-flex border-bottom pt-2">
                  <div className="content_box_name">
                    {tu("TRC20_transfers")}
                  </div>
                  <div className="flex1">
                    <div className="d-flex border-bottom content_item">
                      <div className="content_name">
                        {tu("from")}:
                      </div>
                      <div className="flex1">
                        <AddressLink
                          address={
                            contract.tokenTransferInfo[
                              "from_address"
                            ]
                          }
                        >
                          {
                            contract.tokenTransferInfo[
                              "from_address"
                            ]
                          }
                        </AddressLink>
                      </div>
                    </div>
                    <div className="d-flex border-bottom content_item">
                      <div className="content_name">
                        {tu("to")}:
                      </div>
                      <div className="flex1">
                        <AddressLink
                          address={
                            contract.tokenTransferInfo[
                              "to_address"
                            ]
                          }
                        >
                          {
                            contract.tokenTransferInfo[
                              "to_address"
                            ]
                          }
                        </AddressLink>
                      </div>
                    </div>
                    <div className="d-flex border-bottom content_item">
                      <div className="content_name">
                        {tu("amount")}:
                      </div>
                      <div className="flex1">
                        {Number(
                          contract.tokenTransferInfo[
                            "amount_str"
                          ]
                        ) /
                          Math.pow(
                            10,
                            contract.tokenTransferInfo[
                              "decimals"
                            ]
                          )}
                      </div>
                    </div>
                    <div className="d-flex border-bottom content_item">
                      <div className="content_name">
                        {tu("token_txs_info")}:
                      </div>
                      <div className="flex1">
                        {contract.tokenTransferInfo[
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
                        )}
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
                            contract.tokenTransferInfo["name"] +
                            " (" +
                            contract.tokenTransferInfo[
                              "symbol"
                            ] +
                            ")"
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            {
              contract.cost && <BandwidthUsage cost={contract.cost}></BandwidthUsage>
            }
            {contract.method && (
              <div className="d-flex border-bottom pt-2">
                <div className="content_box_name">
                  {tu("Method_calling")}
                </div>
                <div className="flex1">
                  <div className="d-flex border-bottom content_item">
                    {/* <div className="content_name">
                      {tu("contract_method")}:
                    </div> */}
                    <div className="flex1">
                      {contract.method}
                    </div>
                  </div>
                  {contract.parameter &&
                    Object.keys(contract.parameter).map(p => {
                      return (
                        <div
                          className="d-flex border-bottom content_item"
                          key={p}
                        >
                          <div className="content_name">
                            {p}:
                          </div>
                          <div className="flex1">
                            {contract.parameter[p]}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Fragment>
    );
}

export default injectIntl(CreateSmartContract)