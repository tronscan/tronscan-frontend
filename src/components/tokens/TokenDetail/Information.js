import React, { Fragment } from "react";
import { tu, t } from "../../../utils/i18n";
import { FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import { AddressLink, ExternalLink, HrefLink } from "../../common/Links";
import { SocialMedia } from "../../common/SocialMedia";
import { TRXPrice } from "../../common/Price";
import { Link } from "react-router-dom";
import { toLower } from "lodash";
import { cloneDeep } from "lodash";
import { IS_MAINNET, TOKEN_ID_BTT } from "../../../constants";
import { Level } from "chalk";

export function Information({
         token: tokens,
         currentTotalSupply,
         priceUSD,
         BttSupplyClient
       }) {
         let token = cloneDeep(tokens);
         let lowerText = token.reputation
           ? toLower(token.reputation) + "_active.png"
           : "";
         let issuer_address =
           token.id == 1002000 ? (
             <span>{token.ownerAddress}</span>
           ) : (
             <AddressLink address={token.ownerAddress} includeCopy={true} />
           );
         if (token && token["new_social_media"]) {
           const str = token["new_social_media"]
             .replace(/method/g, "name")
             .replace(/link/g, "url");
           let mediaArr = JSON.parse(str);
           let arr = [];
           mediaArr &&
             mediaArr.map(item => {
               if (!(item.url.length == 1 && item.url[0] == "")) {
                 arr.push(item);
               }
             });
           token.github !== "no_message" &&
             arr.unshift({ url: [token.github], name: "GitHub" });
           token.new_media = arr;
         }
         if (token && !token["new_social_media"]) {
           let arr = [];
           token["social_media"].map(item => {
             if (item.url != "") {
               item.url = [item.url];
               arr.push(item);
             }
           });
           token.new_media = arr;
         }

         let issued = token.precision
           ? token.issued / Math.pow(10, token.precision)
           : token.issued;
         let currentTotal = token.id == 1002000 ? currentTotalSupply : issued;

         let totalSupply = token.precision
           ? token.totalSupply / Math.pow(10, token.precision)
           : token.totalSupply;
         let totalSupplyUsd = token["market_info"]
           ? (token["market_info"].priceInTrx * totalSupply * priceUSD).toFixed(
               0
             )
           : 0;
         let currentTotalSupplyUsd = token["market_info"]
           ? (
               token["market_info"].priceInTrx *
               currentTotal *
               priceUSD
             ).toFixed(0)
           : 0;
         if (token.id == 1002000) {
           currentTotalSupplyUsd =
            parseInt(BttSupplyClient.marketValue) || currentTotalSupplyUsd;
         }
         const defaultContent = "-";

         const LeftTokenInfo = [
           { name: "token_basic_view", content: "" },
           {
             name: "total_supply",
             content: totalSupply ? (
               <span><FormattedNumber value={totalSupply} /> {token.abbr}</span>
             ) : (
               defaultContent
             )
           },
           {
             name: "circulating_supply",
             content: currentTotal ? (
               <span><FormattedNumber value={currentTotal} /> {token.abbr}</span>
             ) : (
               defaultContent
             )
           },
           {
             name: "token_hold_user",
             content: 
             <div>
               {token.nrOfTokenHolders ? (
               <span>
                 <FormattedNumber value={token.nrOfTokenHolders} />
                {" "}{tu('address')}
                 </span>
              ) : (
                defaultContent
              )}
             </div>
           },
           {
             name: "address_info_transfers",
             content: token.totalTransactions ? (
               <span>
                 <FormattedNumber value={token.totalTransactions} /> Txns
               </span>
             ) : (
               defaultContent
             )
           },
           {
             name: "token_price_new",
             content: (
               <div className="d-flex">
                 {token["market_info"] ? (
                   <div>
                     {token["market_info"].sShortName == "TRX" ? (
                       <div className="d-flex price-info">
                         {token.priceToUsd.toFixed(6)} USD&nbsp;
                         <span className="token-price-trx ">
                           {" "}
                           ≈ {token["market_info"].priceInTrx}{" "}
                           {token["market_info"].sShortName}
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
                                 parseInt(token["market_info"].gain * 10000) /
                                   100 +
                                 "%"}
                             </span>
                           ) : (
                             <span>
                               {parseInt(token["market_info"].gain * 10000) /
                                 100 +
                                 "%"}
                             </span>
                           )}
                         </span>
                         <Link
                           to={`/exchange/trc20?id=${token["market_info"].pairId}`}
                           target="_blank"
                           className="btn btn-danger btn-sm ml-3"
                           style={{ height: "1.2rem", lineHeight: "0.6rem",textTransform:"capitalize" }}
                         >
                           {" "}
                           {tu("token_trade")}
                         </Link>
                       </div>
                     ) : (
                       defaultContent
                     )}
                   </div>
                 ) : (
                   defaultContent
                 )}
               </div>
             )
           },
           {
             name: "token_capitalization",
             content: (
               <div>
                 {currentTotalSupplyUsd != 0 ? (
                   <span>
                     <FormattedNumber
                       value={currentTotalSupplyUsd}
                     ></FormattedNumber>{" "} USD
                     
                   </span>
                 ) : (
                   defaultContent
                 )}{" "}
                 /{" "}
                 {totalSupplyUsd != 0 ? (
                   <span>
                     <FormattedNumber value={totalSupplyUsd}></FormattedNumber>{" "} USD
                     
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
               <div
                 className="d-flex"
                 style={{ justifyContent: "space-between" }}
               >
                 {tu(`token_rules_${Number(token.level > 100 ? 2 : token.level) || 0}`)}
                 <Link to="/tokens/rating-rule">
                   {tu("token_credit_rating_rule")}
                 </Link>
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
             name: "trc20_token_id",
             content: <span>{token.id}</span>
           },
           {
             name: "TRC20_decimals",
             content: (
               <span>
                 {token.precision == 0 || token.precision
                   ? token.precision
                   : "_"}
               </span>
             )
           },
           {
             name: "issue_time",
             content: (
               <div>
                 {token.dateCreated && (
                   <FormattedDate value={token.dateCreated} />
                 )}{" "}
                 {token.dateCreated && (
                   <span>
                      <FormattedTime
                        value={token.dateCreated}
                        hour="numeric"
                        minute="numeric"
                        second="numeric"
                        hour12={false}
                    /> UTC
                   </span>
                   
                 )}
                 {!token.dateCreated && defaultContent}
               </div>
             )
           },
           {
             name: "issuer",
             content: issuer_address ? issuer_address : defaultContent
           },
           {
             name: "token_website",
             content: (
               <div>
                 {token.website && token.website != 'no_message' ? <ExternalLink url={token.website} /> : token.url ? (
                   token.id == TOKEN_ID_BTT ? (
                     <HrefLink href={token.url}>{token.url}</HrefLink>
                   ) : (
                     <ExternalLink url={token.url} />
                   )
                 ) : (
                   defaultContent
                 ) } 
               </div>
             )
           },
           {
             name: "white_paper",
             content: (
               <div>
                 {token.white_paper !== "no_message" ? (
                   token.id == TOKEN_ID_BTT ? (
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
                 {token.new_media.length > 0 ? (
                   <SocialMedia mediaList={token.new_media} />
                 ) : (
                   defaultContent
                 )}
               </div>
             )
           }
         ];

         const sideTokenList = [
           {
             name: "total_supply",
             content: (
               <FormattedNumber
                 value={
                   token.precision
                     ? token.totalSupply / Math.pow(10, token.precision)
                     : token.totalSupply
                 }
               />
             )
           },
           {
             name: "ID",
             content: <span>{token.id}</span>
           },
           {
             name: "TRC20_decimals",
             content: (
               <span>
                 {token.precision == 0 || token.precision
                   ? token.precision
                   : "_"}
               </span>
             )
           },
           {
             name: "reputation",
             content: (
               <div>
                 {token.canShow == 1 && (
                   <img
                     src={require("../../../images/svg/ok.svg")}
                     title="OK"
                   />
                 )}
                 {token.canShow == 2 && (
                   <img
                     src={require("../../../images/svg/neutral.svg")}
                     title="Neutral"
                   />
                 )}
                 {token.canShow == 3 && (
                   <img
                     src={require("../../../images/svg/high_risk.svg")}
                     title="High Risk"
                   />
                 )}
               </div>
             )
           },
           {
             name: "circulating_supply",
             content: currentTotal ? (
               <FormattedNumber value={currentTotal} />
             ) : (
               defaultContent
             )
           },
           {
             name: "website",
             content: (
               <div>
                 {token.url ? (
                   token.id == TOKEN_ID_BTT ? (
                     <HrefLink href={token.url}>{token.url}</HrefLink>
                   ) : (
                     <ExternalLink url={token.url} />
                   )
                 ) : (
                   defaultContent
                 )}
               </div>
             )
           },
           {
             name: "DAppChain_holders",
             content: token.nrOfTokenHolders ? (
               <FormattedNumber value={token.nrOfTokenHolders} />
             ) : (
               defaultContent
             )
           },
           {
             name: "issuer",
             content: issuer_address ? issuer_address : defaultContent
           },
           {
             name: "nr_of_Transfers",
             content: <FormattedNumber value={token.totalTransactions} />
           },
           {
             name: "white_paper",
             content: (
               <div>
                 {token.white_paper !== "no_message" ? (
                   token.id == TOKEN_ID_BTT ? (
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
             name: "GitHub",
             content:
               token.github !== "no_message" ? (
                 <HrefLink
                   style={{
                     whiteSpace: "nowrap",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     display: "block"
                   }}
                   href={token.github}
                 >
                   {token.github}
                 </HrefLink>
               ) : (
                 defaultContent
               )
           },
           {
             name: "social_link",
             content: <SocialMedia mediaList={token.new_media} />
           }
         ];

         const LeftMap = (
           <div className="flex-1" style={{width:"50%"}}>
             {LeftTokenInfo.map((item, index) => {
               return (
                 <div className={"information-bg-item"} key={index}>
                   <span>{tu(item.name)}</span>
                   <div style={{width: "calc(100% - 150px)" }}>{item.content}</div>
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
           // <div className="information-bg d-flex">
           //   {IS_MAINNET ? (
           //     <Fragment>
           //       {LeftMap}
           //       {RightMap}
           //     </Fragment>
           //   ) : (
           //     sideTokenList.map((item, index) => {
           //       return (
           //         <div
           //           key={index}
           //           className={
           //             index % 2 == 0
           //               ? "information-bg-item"
           //               : "information-bg-item ml"
           //           }
           //         >
           //           <span>{tu(item.name)}</span>
           //           <div style={{ width: "75%" }}>{item.content}</div>
           //         </div>
           //       );
           //     })
           //   )}
           // </div>
           <div className="information-bg d-flex token-mobile">
             <Fragment>
               {LeftMap}
               {RightMap}
             </Fragment>
           </div>
         );
       }
