

import React, {Fragment} from "react";
import {t,tv, tu} from "../../../../../utils/i18n";
import {ONE_TRX,IS_MAINNET} from "../../../../../constants";
import {injectIntl} from "react-intl";

function setValue(item,intl){

  switch (item.key) {
    case 0:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value / (1000 * 60 * 60)}</span> &nbsp;
          <span>{intl.formatMessage({id: "propose_hour"})}</span>
        </span>
      )
      break;
    case 1:
    case 2:
    case 4:
    case 5:
    case 6:
    case 7:
    case 11:
    case 12:
    case 22:
    case 23:
    case 28:
    case 31:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{item.value / ONE_TRX}</span> &nbsp;
          <span>TRX</span>
        </span>
      )
      break;
    case 3:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value }</span> &nbsp;
          <span>Sun/byte</span>
        </span>
      )
      break;
    case 8:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value }</span> &nbsp;
          <span>bandwith/byte</span>
        </span>
      )
      break;
    case 9:
      return 
      <span>
        <span>{tu('propose_activate')}</span>
      </span>;
      break;
    case 13:
      return <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value } ms</span>
      </span>;
      break;
    case 14:
    case 15:
    case 16:
    case 18:
    case 20:
    case 21:
    case 26:
    case 27:
    case 32:
      return <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        {
          item.value? <span>{tu('propose_allowed')}</span>:
              <span>{tu('propose_not_allowed')}</span>
        }
      </span>                       
    // case 17:
    //   return 
    //   <span>
    //     <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
    //     <span>{ item.value }</span>
    //   </span>;
    //   break; 
    case 17:
    case 19:
    case 29:
    case 33:
      return <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value }</span>
      </span>;
      break; 
    // case 22:
    //     return (
    //       <span>
    //         <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
    //         <span>{item.value}</span>/
    //         <span>{tu('propose_minute')}</span>
    //       </span>
    //     )
    //     break;
    // case 24:
    //   return (
    //     <span>
    //       <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
    //       {
    //           item.value?<span><span>{item.value}</span>/<span>{tu('propose_minute')}</span></span>:
    //               <span>{tu('propose_unactivate')}</span>
    //       }
    //     </span>
    //   )
    //   break; 
    case 24:
    case 30:
        return (
          <span>
            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
            {
                item.value? <span>{tu('propose_activate')}</span>:
                    <span>{tu('propose_unactivate')}</span>
            }
          </span>
        )
        break; 
    default:
      return ''
      break;
  }
}
function setProposalId(id){
  switch (id) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5: 
    case 6:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13: 
    case 14:
    case 15:
    case 16:
    case 18:
    case 19:
    case 20: 
    case 21:
      return id + 1    
      break;
    case 22:
      return '25'
    case 23:
      return '26'
    case 24:
      return '27' 
    case 26:
      return '28'
    case 27:
      return '29'
    case 28:
      return '28_1' 
    case 29:
      return '29_1'
    default:
      return id
      break;
  }
}
function setSunProposalId(id){
  switch (id) {
    default:
      return id - 999999
      break
  }
}
function setSunValue(item,intl){

  switch (item.key) {
    case 1000000:
    case 1000003:
    case 1000005:
        return (
          <span>
            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
            {
                item.value? <span>{tu('propose_activate')}</span>:
                    <span>{tu('propose_unactivate')}</span>
            }
          </span>
        )
        break; 
    case 1000001:
    case 1000002:
    case 1000004:
    case 1000006:
      return 
      <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value }</span>
      </span>;
      break; 
    case 1000007:
        return 
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          {
              <span>{item.value} %</span>
          }
        </span>;
        break;
    default:
      return ''
      break;
  }
}

function ProposalValue({item,intl}) {
  return (
    <span>
      {/* {item.value} */}
      {IS_MAINNET ? 
        <div>
          {tu(`propose_${setProposalId(item.key)}`)}
          {setValue(item,intl)}
        </div>
        : 
        <div>
          {tu(`propose_${setSunProposalId(item.key)}`)}
          {setSunValue(item,intl)}
        </div>
      }
    </span>
  )
}

export default injectIntl(ProposalValue)