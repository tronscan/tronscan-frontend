import React from "react";
import {tu, t} from "../../../utils/i18n";
import {FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import {AddressLink, ExternalLink} from "../../common/Links";
import {SocialMedia} from "../../common/SocialMedia";
import {TRXPrice} from "../../common/Price";
import {Link} from "react-router-dom";
import {toLower} from "lodash";
import {cloneDeep} from 'lodash'


export function Information({token: tokens,currentTotalSupply}) {
  let token = cloneDeep(tokens)
  let lowerText = token.reputation? toLower(token.reputation) + '_active.png': '';
  let issuer_address = token.id == 1002000?<span>{token.ownerAddress}</span>:<AddressLink address={token.ownerAddress} includeCopy={true}/>
  if(token && token['new_social_media']){
    const str = token['new_social_media'].replace(/method/g, 'name').replace(/link/g, 'url')
    let mediaArr = JSON.parse(str)
    let arr = [] 
    mediaArr && mediaArr.map(item =>{
      if(!(item.url.length == 1 && item.url[0] == '')){
        arr.push(item)
      }
    })
    token.new_media = arr
  }
  if(token && !token['new_social_media']){
    let arr = [] 
    token['social_media'].map(item => {
      if(item.url != ''){
        item.url = [item.url]
        arr.push(item)
      }
    })
    token.new_media = arr
  }
  
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
                <ExternalLink url={token.white_paper && t(token.white_paper)} _url={token.white_paper}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },{ 
      name: 'created', 
      content:  <div>
                  <FormattedDate value={token.dateCreated}/>
                  {' '}
                  <FormattedTime value={token.dateCreated}  hour='numeric' minute="numeric" second='numeric' hour12={false}/>
                </div>
    },
    {
      name: 'GitHub', 
      content:  token.github !== 'no_message' ?
                <ExternalLink url={token.github && t(token.github)} _url={token.github}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },
    // {
    //   name: 'contract_address',
    //   content:  <span style={{color: '#d8d8d8'}}>-</span>
    // },
    {
      name: 'social_link', 
      content: <SocialMedia mediaList={token.new_media}/>
       
    },
    {
        name: 'pice_per_1trx',
        content:  <div className="d-flex ">
            {
                token['market_info'] && <div>
                    {
                        token['market_info'].sShortName == 'TRX'? <div className="d-flex">
                            {token['market_info'].priceInTrx}  {token['market_info'].sShortName}
                            <span className={token['market_info'].gain<0? 'col-red ml-3':'col-green ml-3'}>{token['market_info'].gain >0 ?  <span>{'+' + parseInt(token['market_info'].gain * 10000) / 100 + '%'}</span>:<span>{ parseInt(token['market_info'].gain * 10000) / 100 + '%'}</span>}</span>
                            <Link to={`/exchange/trc20?id=${token['market_info'].pairId}`} className="btn btn-danger btn-sm ml-3" style={{height: '1.2rem', lineHeight: '0.6rem'}}> {tu('token_trade')}</Link>
                        </div>:'-'
                    }

                </div>
            }
        </div>
    },
  ]

    return (
      <div className="information-bg">{
        tokenList.map((item,index) => {
          return(
            <div key={index} className={index%2 == 0? 'information-bg-item': 'information-bg-item ml'}>
              <span>{tu(item.name)}</span>
              <div style={{width:'75%'}}>{item.content}</div>
            </div>)
        })
      }</div>
    );
}