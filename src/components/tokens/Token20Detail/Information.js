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
import {
  API_URL,
  ONE_TRX,
  CONTRACT_ADDRESS_USDT,
  CONTRACT_ADDRESS_WIN,
  CONTRACT_ADDRESS_GGC,
  IS_MAINNET
} from "../../../constants";

export function Information({ token: tokens }) {
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

  const LeftTokenInfo = [
    { name: "token_basic_view", content: "" },
    {
      name: "total_supply",
      content: (
        <div>
          {/*<FormattedNumber value={token.total_supply_with_decimals / (Math.pow(10,token.decimals))} maximumFractionDigits={token.decimals}/>*/}
          <span>
            {toThousands(
              parseFloat(
                token.total_supply_with_decimals / Math.pow(10, token.decimals)
              ).toFixed(token.decimals)
            )}
          </span>
          <span className="ml-1">{token.symbol}</span>
        </div>
      )
    },
    {
      name: "circulating_supply",
      content: <div></div>
    },
    {
      name: "token_hold_user",
      content: <div></div>
    },
    {
      name: "address_info_transfers",
      content: <div></div>
    },
    {
      name: "token_price_new",
      content: (
        <div className="d-flex">
          {token["market_info"] ? (
            <div className="d-flex">
              {token["priceToUsd"].toFixed(6)} USD 
              ≈ {token["market_info"].priceInTrx} TRX
              <span
                className={
                  token["market_info"].gain < 0
                    ? "col-red ml-3"
                    : "col-green ml-3"
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
                className="btn btn-danger btn-sm ml-3"
                style={{ height: "1.2rem", lineHeight: "0.6rem" }}
              >
                {" "}
                {tu("token_trade")}
              </Link>
            </div>
          ) : (
            "-"
          )}
        </div>
      )
    },
    {
      name: "token_capitalization",
      content: <div></div>
    },
    {
      name: "token_credit_rating",
      content: (
        <div className="d-flex" style={{ justifyContent: "space-between" }}>
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
      content: (
        <AddressLink address={token.contract_address} isContract={true} />
      )
    },
    {
      name: "TRC20_decimals",
      content: <FormattedNumber value={token.decimals} />
    },
    {
      name: "issue_time",
      content: <div>{token && token.issue_time}</div>
    },
    {
      name: "issuer",
      content: (
        <div>
          <AddressLink address={token && token.issue_address} includeCopy={true}/>
        </div>
      )
    },
    {
      name: "token_website",
      content: (
        <div>
          {token.home_page ? (
            token.contract_address === CONTRACT_ADDRESS_USDT ||
            token.contract_address === CONTRACT_ADDRESS_WIN ? (
              <HrefLink href={token.home_page}>{token.home_page}</HrefLink>
            ) : (
              <ExternalLink url={token.home_page} />
            )
          ) : (
            <span style={{ color: "#d8d8d8" }}>-</span>
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
            token.contract_address === CONTRACT_ADDRESS_WIN ? (
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
            <span style={{ color: "#d8d8d8" }}>-</span>
          )}
        </div>
      )
    },
    {
      name: "token_social_link",
      content: <SocialMedia mediaList={token.social_media_list} />
    }
  ];

  const tokenList = [
    {
      name: "total_supply",
      content: (
        <div>
          {/*<FormattedNumber value={token.total_supply_with_decimals / (Math.pow(10,token.decimals))} maximumFractionDigits={token.decimals}/>*/}
          <span>
            {toThousands(
              parseFloat(
                token.total_supply_with_decimals / Math.pow(10, token.decimals)
              ).toFixed(token.decimals)
            )}
          </span>
          <span className="ml-1">{token.symbol}</span>
        </div>
      )
    },
    {
      name: "contract_address",
      content: (
        <AddressLink address={token.contract_address} isContract={true} />
      )
    },
    // {
    //   name: 'token_holders',
    //   content: <FormattedNumber value={token.total_supply}/>
    // },
    {
      name: "TRC20_decimals",
      content: <FormattedNumber value={token.decimals} />
    },
    {
      name: "website",
      content: (
        <div>
          {token.home_page ? (
            token.contract_address === CONTRACT_ADDRESS_USDT ||
            token.contract_address === CONTRACT_ADDRESS_WIN ? (
              <HrefLink href={token.home_page}>{token.home_page}</HrefLink>
            ) : (
              <ExternalLink url={token.home_page} />
            )
          ) : (
            <span style={{ color: "#d8d8d8" }}>-</span>
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
            token.contract_address === CONTRACT_ADDRESS_WIN ? (
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
            <span style={{ color: "#d8d8d8" }}>-</span>
          )}
        </div>
      )
    },
    {
      name: "social_link",
      content: <SocialMedia mediaList={token.social_media_list} />
    },
    {
      name: "GitHub",
      content: token.git_hub ? (
        <HrefLink
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block"
          }}
          href={token.git_hub}
        >
          {token.git_hub}
        </HrefLink>
      ) : (
        <span style={{ color: "#d8d8d8" }}>-</span>
      )
    },
    {
      name: "pice_per_1trx",
      content: (
        <div className="d-flex">
          {token["market_info"] ? (
            <div className="d-flex">
              {token["market_info"].priceInTrx} TRX
              <span
                className={
                  token["market_info"].gain < 0
                    ? "col-red ml-3"
                    : "col-green ml-3"
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
                className="btn btn-danger btn-sm ml-3"
                style={{ height: "1.2rem", lineHeight: "0.6rem" }}
              >
                {" "}
                {tu("token_trade")}
              </Link>
            </div>
          ) : (
            "-"
          )}
        </div>
      )
    }
  ];

  const LeftMap = (
    <div className="flex-1">
      {LeftTokenInfo.map((item, index) => {
        return (
          <div className={"information-bg-item"} key={index}>
            <span>{tu(item.name)}</span>
            <div style={{ width: "75%" }}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );

  const RightMap = (
    <div className="flex-1">
      {RightTokenInfo.map((item, index) => {
        return (
          <div className={"information-bg-item"} key={index}>
            <span>{tu(item.name)}</span>
            <div style={{ width: "75%" }}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="information-bg d-flex">
      {LeftMap}
      {RightMap}
    </div>
  );
}
