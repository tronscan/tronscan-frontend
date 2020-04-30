import React, { Fragment } from "react";
import { tu, t } from "../../../utils/i18n";
import { toThousands } from "../../../utils/number";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { AddressLink, ExternalLink, HrefLink } from "../../common/Links";
import { SocialMedia } from "../../common/SocialMedia";
import { Link } from "react-router-dom";
import { toLower } from "lodash";
import { Popover } from "antd";
import { cloneDeep } from "lodash";
import { connect } from "react-redux";
import { Tooltip,Icon } from 'antd';
import {upperFirst} from "lodash";

import {
  API_URL,
  ONE_TRX,
  ONE_USDJ,
  ONE_JST,
  CONTRACT_ADDRESS_USDT,
  CONTRACT_ADDRESS_WIN,
  CONTRACT_ADDRESS_GGC,
  CONTRACT_ADDRESS_USDJ,
  CONTRACT_ADDRESS_USDJ_TESTNET,
  CONTRACT_ADDRESS_JED,
  CONTRACT_ADDRESS_JED_TESTNET,
  CONTRACT_ADDRESS_JST,
  IS_MAINNET
} from "../../../constants";

export function Information({ token: tokens, priceUSD,intl }) {
  let token = cloneDeep(tokens);
  let social_display = 0;
  let lowerText = token.reputation
    ? toLower(token.reputation) + "_active.png"
    : "";

  // token && token['social_media'] && token['social_media'].map((media, index) => {
  //   if (media.url) {
  //     social_display++;
  //   }
  // })
  // token.social_media_list = JSON.parse(token.social_media_list)

  token.social_media_list &&
    token.social_media_list.map(item => {
      try {
        item.url = JSON.parse(item.url);
      } catch (error) {
        item.url = [item.url];
      }
    });

  token.git_hub &&
    token.social_media_list.unshift({ url: [token.git_hub], name: "GitHub" });

  let totalSupply = parseFloat(
    token.total_supply_with_decimals / Math.pow(10, token.decimals)
  ).toFixed(token.decimals);

  let currentTotal = totalSupply;

  let totalSupplyUsd = token["market_info"]
    ? (token["market_info"].priceInTrx * totalSupply * priceUSD).toFixed(0)
    : 0;

  let currentTotalSupplyUsd = token["market_info"]
    ? (token["market_info"].priceInTrx * currentTotal * priceUSD).toFixed(0)
    : 0;
  // if wink
  if (token.contract_address === "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7") {
    currentTotal = token.winkTotalSupply.totalTurnOver || 0;
    currentTotalSupplyUsd = parseInt(token.winkTotalSupply.marketValue) || 0;
  }
  // if jst
  if (token.contract_address === "TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9") {
    currentTotal = Number(token.jstTotalSupply.totalTurnOver) > 0 ? Number(token.jstTotalSupply.totalTurnOver).toFixed(token.decimals) : '0';
    currentTotalSupplyUsd = parseInt(token.jstTotalSupply.marketValue) || 0;
  }

  const defaultContent = "-";

  const LeftTokenInfo = [
    { name: "token_basic_view", content: "" },
    {
      name: "total_supply",
      content: (
        <div>
          <span>{totalSupply ? toThousands(totalSupply) : defaultContent}</span>
          <span className="ml-1">{token.symbol}</span>
        </div>
      )
    },
    {
      name: "circulating_supply",
      content: (
        <div>
          {currentTotal ? toThousands(currentTotal) : defaultContent}
          <span className="ml-1">{token.symbol}</span>
        </div>
      )
    },
    {
      name: "token_hold_user",
      content: (
        <div>
          {token.holders_count
            ? <span>{toThousands(token.holders_count)} {" "}{tu('addresses')}</span>
            : defaultContent}
        </div>
      )
    },
    {
      name: "address_info_transfers",
      content: (
        <div>
          {token.transferNumber
            ?
            <span> { toThousands(token.transferNumber)} Txns</span>  
            : defaultContent} 
        </div>
      )
    },
    {
      name: "token_price_new",
      content: (
        <div className="d-flex ">
          {
            (token.contract_address == CONTRACT_ADDRESS_USDJ || token.contract_address == CONTRACT_ADDRESS_USDJ_TESTNET) &&
            <div className="d-flex price-info">
            { ONE_USDJ.toFixed(6)} USD&nbsp;
            <span className="token-price-trx">
              ≈ {(ONE_USDJ/priceUSD).toFixed(6)} TRX
            </span>
          </div> 
          }
          {
           (token.contract_address == CONTRACT_ADDRESS_JED || token.contract_address == CONTRACT_ADDRESS_JED_TESTNET )&&
            <div className="d-flex price-info">
            { ONE_JST.toFixed(6)} USD&nbsp;
            <span className="token-price-trx">
              ≈ {(ONE_JST/priceUSD).toFixed(6)} TRX
            </span>
          </div> 
          }


          { ((token.contract_address != CONTRACT_ADDRESS_USDJ || token.contract_address != CONTRACT_ADDRESS_JED || token.contract_address != CONTRACT_ADDRESS_USDJ_TESTNET || token.contract_address != CONTRACT_ADDRESS_JED_TESTNET )  && token["market_info"]) ? (
            <div className="d-flex price-info">
              {token["priceToUsd"].toFixed(6)} USD&nbsp;
              <span className="token-price-trx">
                ≈ {token["market_info"].priceInTrx} TRX
              </span>
              <span
                className={
                  token["market_info"].gain < 0
                    ? "col-red ml-1"
                    : "col-green ml-1"
                }
              >
                {token["market_info"].gain > 0 ? (
                  <span>
                    {"+" +
                      parseInt(token["market_info"].gain * 10000) / 100 +
                      "%"}
                  </span>
                ) : (
                  <span>
                    {parseInt(token["market_info"].gain * 10000) / 100 + "%"}
                  </span>
                )}
              </span>
              <Link
                to={`/exchange/trc20?id=${token["market_info"].pairId}`}
                target="_blank"
                className="btn btn-danger btn-sm ml-1"
                style={{ height: "1.2rem", lineHeight: "0.6rem",textTransform:'capitalize' }}
              >
                {" "}
                {tu("token_trade")}
              </Link>
            </div>
          
            ) : (
                <div>
                  {
                    (token.contract_address == CONTRACT_ADDRESS_USDJ || token.contract_address == CONTRACT_ADDRESS_JED ||  token.contract_address != CONTRACT_ADDRESS_USDJ_TESTNET || token.contract_address != CONTRACT_ADDRESS_JED_TESTNET) ?
                    ""
                    :defaultContent
                  }
                </div>
              )
          }
        </div>
      )
    },
    {
      name: "token_capitalization",
      content: (
        <div>
          {currentTotalSupplyUsd != 0 ? (
            <span>
              <FormattedNumber value={currentTotalSupplyUsd}></FormattedNumber>{" "} USD
              
            </span>
          ) : (
            defaultContent
          )}{" "}
          /{" "}
          {totalSupplyUsd != 0 ? (
            <span>
              <FormattedNumber value={totalSupplyUsd}></FormattedNumber> {" "} USD
            </span>
          ) : (
            defaultContent
          )}
        </div>
      )
    },
    {
      name: "token_credit_rating",
      content: (
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
          {tu(`token_rules_${Number(token.level > 100 ? 2 : token.level) || 0}`)}
          <Link to="/tokens/rating-rule">{tu("token_credit_rating_rule")}</Link>
        </div>
      )
    }
  ];
  const RightTokenInfo = [
    {
      name: "token_additional_materials",
      content: <div></div>
    },
    {
      name: "token_contract",
      content: token.contract_address ? (
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
              lineHeight: 1.2
              }}
            />
          </Tooltip>
          <AddressLink address={token.contract_address} isContract={true}></AddressLink>
        </span>
        // <AddressLink address={token.contract_address} isContract={true} />
      ) : (
        defaultContent
      )
    },
    {
      name: "TRC20_decimals",
      content: token.decimals ? (
        <FormattedNumber value={token.decimals} />
      ) : (
        defaultContent
      )
    },
    {
      name: "issue_time",
      content: <div>{token ? token.issue_time+' UTC' : defaultContent}</div>
    },
    {
      name: "issuer",
      content: (
        <div>
          {token.issue_address ? (
            <AddressLink
              address={token && token.issue_address}
              includeCopy={true}
            />
          ) : (
            defaultContent
          )}
        </div>
      )
    },
    {
      name: "token_website",
      content: (
        <div>
          {token.home_page ? (
            token.contract_address === CONTRACT_ADDRESS_USDT ||
            token.contract_address === CONTRACT_ADDRESS_WIN ||
            token.contract_address === CONTRACT_ADDRESS_USDJ ||
            token.contract_address === CONTRACT_ADDRESS_JST ? (
              <HrefLink href={token.home_page}>{token.home_page}</HrefLink>
            ) : (
              <ExternalLink url={token.home_page} />
            )
          ) : (
            defaultContent
          )}
        </div>
      )
    },
    {
      name: "white_paper",
      content: (
        <div>
          {token.white_paper ? (
            token.contract_address === CONTRACT_ADDRESS_USDT ||
            token.contract_address === CONTRACT_ADDRESS_WIN ||
            token.contract_address === CONTRACT_ADDRESS_USDJ ||
            token.contract_address === CONTRACT_ADDRESS_JST? (
              <HrefLink
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block"
                }}
                href={token.white_paper}
              >
                {token.white_paper}
              </HrefLink>
            ) : (
              <ExternalLink
                url={token.white_paper && t(token.white_paper)}
                _url={token.white_paper}
              />
            )
          ) : (
            defaultContent
          )}
        </div>
      )
    },
    {
      name: "token_social_link",
      content: (
        <div>
          {token.social_media_list.length > 0 ? (
            <SocialMedia mediaList={token.social_media_list} />
          ) : (
            defaultContent
          )}
        </div>
      )
    }
  ];

  const LeftMap = (
    <div className="flex-1" style={{width:"50%"}}>
      {LeftTokenInfo.map((item, index) => {
        return (
          <div className={"information-bg-item"} key={index}>
            <span>{tu(item.name)}</span>
            <div style={{ width: "calc(100% - 150px)" }}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );

  const RightMap = (
    <div className="flex-1" style={{width:"50%"}}>
      {RightTokenInfo.map((item, index) => {
        return (
          <div className={"information-bg-item"} key={index}>
            <span>{tu(item.name)}</span>
            <div style={{ width: "calc(100% - 150px)" }}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="information-bg d-flex token-mobile">
      {LeftMap}
      {RightMap}
    </div>
  );
}



