import React from "react";
import {tu} from "../../../utils/i18n";
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
      content: <FormattedNumber value={token.total_supply_with_decimals / (Math.pow(10,token.decimals))}/>
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