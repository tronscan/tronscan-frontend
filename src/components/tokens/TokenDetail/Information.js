import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import {AddressLink, ExternalLink} from "../../common/Links";
import {Link} from "react-router-dom";
import {toLower} from "lodash";


export function Information({token,currentTotalSupply}) {

  let social_display = 0;
  let lowerText = token.reputation? toLower(token.reputation) + '_active.png': '';
  let issuer_address = token.id == 1002000?<span>{token.ownerAddress}</span>:<AddressLink address={token.ownerAddress} includeCopy={true}/>
  token && token['social_media'] && token['social_media'].map((media, index) => {
    if (media.url) {
      social_display++;
    }
  })
  let  issued = token.precision ? token.issued / Math.pow(10,token.precision) :token.issued
  let currentTotal =  token.id == 1002000? currentTotalSupply : issued;

  const tokenList = [
    { 
      name: 'total_supply', 
      content: <FormattedNumber value={token.precision ? token.totalSupply / Math.pow(10,token.precision) :token.totalSupply}/>
    },{ 
      name: 'ID', 
      content: <span>{token.id}</span>
    },{ 
      name: 'TRC20_decimals', 
      content: <span>{token.precision == 0 || token.precision ? token.precision : '_'}</span>
    },{ 
      name: 'reputation', 
      content:  <Link to={`/rating`} style={{display: 'flex', alignItems: 'center'}}>
                  {tu(toLower(token.reputation))}
                </Link>
    },{ 
      name: 'circulating_supply', 
      content: <FormattedNumber value={currentTotal}/>
    },
    {
      name: 'website', 
      content: <ExternalLink url={token.url}/>
    },{ 
      name: 'token_holders', 
      content: <FormattedNumber value={token.nrOfTokenHolders}/>
    },{ 
      name: 'issuer', 
      content:issuer_address
    },{ 
      name: 'nr_of_Transfers', 
      content: <FormattedNumber value={token.totalTransactions}/>
    },{ 
      name: 'white_paper', 
      content:  token.white_paper !== 'no_message'?
                <ExternalLink url={token.white_paper && tu(token.white_paper)} _url={token.white_paper}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },{ 
      name: 'created', 
      content:  <div>
                  <FormattedDate value={token.dateCreated}/>
                  {' '}
                  <FormattedTime value={token.dateCreated}/>
                </div>
    },{ 
      name: 'GitHub', 
      content:  token.github !== 'no_message' ?
                <ExternalLink url={token.github && tu(token.github)} _url={token.github}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },
    // {
    //   name: 'contract_address',
    //   content:  <span style={{color: '#d8d8d8'}}>-</span>
    // },
    {
      name: 'social_link', 
      content:  <div className="d-flex">
                  {token['social_media'] && token['social_media'].map((media, index) => {
                    return (media.url !== "" && <div key={index} style={{marginRight: '10px'}}>
                      <a href={media.url}>
                        <img  src={require('../../../images/' + media.name + '.png')}/>
                      </a>
                    </div>)
                  })}
                  { !social_display && <span style={{color: '#d8d8d8'}}>-</span> }
                </div>
    }]

    return (
      <div className="information-bg">{
        tokenList.map((item,index) => {
          return(
            <div className={index%2 == 0? 'information-bg-item': 'information-bg-item ml'}>
              <span>{tu(item.name)}</span>
              <p style={{width:'75%'}}>{item.content}</p>
            </div>)
        })
      }</div>
    );
}