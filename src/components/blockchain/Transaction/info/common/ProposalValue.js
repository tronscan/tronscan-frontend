

import React, {Fragment} from "react";
import {t,tv, tu} from "../../../../../utils/i18n";
import {ONE_TRX,IS_MAINNET} from "../../../../../constants";
import {injectIntl} from "react-intl";

function setValue(item,intl){

  switch (item.key) {
    case 1:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value / (1000 * 60 * 60)}</span> &nbsp;
          <span>{intl.formatMessage({id: "propose_hour"})}</span>
        </span>
      )
      break;
    case 2:
    case 3:
    case 5:
    case 6:
    case 7:
    case 8:
    case 12:
    case 13:
    case 31:
    case 25:
    case 26:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{item.value / ONE_TRX}</span> &nbsp;
          <span>TRX</span>
        </span>
      )
      break;
    case 4:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value }</span> &nbsp;
          <span>Sun/byte</span>
        </span>
      )
      break;
    case 9:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value }</span> &nbsp;
          <span>bandwith/byte</span>
        </span>
      )
      break;
    case 10:
      return 
      <span>
        <span>{tu('propose_activate')}</span>
      </span>;
      break;
    case 14:
      return <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value } ms</span>
      </span>;
      break;
    case 15:
    case 16:
    case 17:
    case 19:
    case 21:
    case 22:
    case 28:
      return <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        {
          item.value? <span>{tu('propose_allowed')}</span>:
              <span>{tu('propose_not_allowed')}</span>
        }
      </span>                       
    case 18:
      return 
      <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value }</span>
      </span>;
      break; 
    case 20:
        return 
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          <span>{ item.value }</span>
        </span>;
        break; 
    case 23:
        return (
          <span>
            <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
            <span>{item.value}</span>/
            <span>{tu('propose_minute')}</span>
          </span>
        )
        break;
    case 24:
      return (
        <span>
          <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
          {
              item.value?<span><span>{item.value}</span>/<span>{tu('propose_minute')}</span></span>:
                  <span>{tu('propose_unactivate')}</span>
          }
        </span>
      )
      break; 
    case 27:
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

function setSunValue(item,intl){

  switch (item.key) {
    case 1:
    case 4:
    case 6:
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
    case 2:
    case 3:
    case 5:
    case 7:
      return 
      <span>
        <span>{ intl.formatMessage({id: 'proposal_to'})}</span>
        <span>{ item.value }</span>
      </span>;
      break; 
    case 8:
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
        setValue(item,intl) : setSunValue(item,intl)
      }
    </span>
  )
}

export default injectIntl(ProposalValue)