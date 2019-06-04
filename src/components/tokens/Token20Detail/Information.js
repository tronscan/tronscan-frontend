import React from "react";
import {tu} from "../../../utils/i18n";
import {toThousands} from "../../../utils/number";
import {FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import {AddressLink, ExternalLink} from "../../common/Links";
import {Link} from "react-router-dom";
import {toLower} from "lodash";


export function Information({token}) {

  let social_display = 0;
  let lowerText = token.reputation? toLower(token.reputation) + '_active.png': '';

  // token && token['social_media'] && token['social_media'].map((media, index) => {
  //   if (media.url) {
  //     social_display++;
  //   }
  // })


  const tokenList = [
    { 
      name: 'total_supply', 
      content: <div>
        {/*<FormattedNumber value={token.total_supply_with_decimals / (Math.pow(10,token.decimals))} maximumFractionDigits={token.decimals}/>*/}
        <span>{toThousands(parseFloat(token.total_supply_with_decimals / (Math.pow(10,token.decimals))).toFixed(token.decimals))}</span>
        <span className="ml-1">{token.symbol}</span>
      </div>
    },
    {
      name: 'contract_address',
      content:  <AddressLink address={token.contract_address} isContract={true} />
    },
    // {
    //   name: 'token_holders',
    //   content: <FormattedNumber value={token.total_supply}/>
    // },
    {
      name: 'TRC20_decimals',
      content: <FormattedNumber value={token.decimals}/>
    },
    {
      name: 'website', 
      content:  token.home_page?
          <ExternalLink url={token.home_page}/> :
          <span style={{color: '#d8d8d8'}}>-</span>

    },
    {
        name: 'white_paper',
        content:  token.white_paper?
            <ExternalLink url={token.white_paper && tu(token.white_paper)} _url={token.white_paper}/> :
            <span style={{color: '#d8d8d8'}}>-</span>
    },
    {
        name: 'social_link',
        content:
             token.social_media_list.length>0? <div className="d-flex">
             {token['social_media_list'] && token['social_media_list'].map((media, index) => {
                return (media.url !== "" && <div key={index} style={{marginRight: '10px'}}>
                   <a href={media.url}>
                     <img  src={require('../../../images/' + media.name.substring(0,1).toUpperCase()+media.name.substring(1) + '.png')}
                           style={{width:20,height:20}}/>
                   </a>
                 </div>)
             })}
         </div>:<span style={{color: '#d8d8d8'}}>-</span>

    },
    {
      name: 'GitHub', 
      content:  token.git_hub ?
                <ExternalLink url={token.git_hub} _url={token.git_hub}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },
    {
      name: 'pice_per_1trx',
      content:  <div className="d-flex token-list-action">
        {
          token['market_info']?
            <div className="d-flex">
                {token['market_info'].priceInTrx}  TRX
              <span className={token['market_info'].gain<0? 'col-red ml-3':'col-green ml-3'}>{token['market_info'].gain >0 ?  <span>{'+' + parseInt(token['market_info'].gain * 10000) / 100 + '%'}</span>:<span>{ parseInt(token['market_info'].gain * 10000) / 100 + '%'}</span>}</span>
              <Link to={`/exchange/trc20?id=${token['market_info'].pairId}`} className="token-details btn ml-3"> {tu('transactions')}</Link>
            </div>
            :'-'
        }
      </div>
    },

  ]

    return (
      <div className="information-bg">{
        tokenList.map((item,index) => {
          return(
            <div className={index%2 == 0? 'information-bg-item': 'information-bg-item ml'} key={index}>
              <span>{tu(item.name)}</span>
              <p style={{width:'75%'}}>{item.content}</p>
            </div>)
        })
      }</div>
    );
}