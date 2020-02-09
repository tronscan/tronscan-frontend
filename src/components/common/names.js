import React from "react";
import {TRXPrice} from "./Price";
import { FormattedNumber } from "react-intl";
import {Link} from "react-router-dom";

export const NameWithId = ({value,type, notamount=false, totoken=false, br=false, page='',tokenid=true }) => {
  return (
    value.map_token_name === "TRX" ?
    <TRXPrice amount={value.map_amount}/> :
    <span>
      {
        !notamount &&
        <span className="mr-1">
          <FormattedNumber 
            value={value.map_amount}
            minimumFractionDigits={0}
            maximumFractionDigits={Number(value.map_token_precision)}
          />
        </span>
      }
      {
          br?<br/>:''
      }
      {
        totoken?
        <Link to={`/token/${value.map_token_id}`}>
          {
              type == 'abbr'?<span>
                  {
                    value.map_token_name_abbr?value.map_token_name_abbr:value.map_token_name
                  }
              </span>:<span className="mr-1">{value.map_token_name}</span>
          }
        </Link>:
        
        type === 'abbr'?<span className={page == ''?'mr-1':''}>
            {
                value.map_token_name_abbr ?value.map_token_name_abbr:value.map_token_name
            }
        </span>:<span className="mr-1">{value.map_token_name}</span>
        
      }

      {(value.map_token_id != 0 && page == '' && tokenid) && <p style={{color: '#808080', fontSize: '12px', height: 'auto'}}>[ID:{value.map_token_id}]</p>}
    </span>
  );
}
