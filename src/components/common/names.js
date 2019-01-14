import React from "react";
import {TRXPrice} from "./Price";
import { FormattedNumber } from "react-intl";

export const NameWithId = ({value,type, notamount=false}) => {
  console.log(notamount)
  return (
    value.map_token_name === "TRX" ?
    <TRXPrice amount={value.map_amount}/> :
    <span>
      {
        !notamount && 
        <FormattedNumber 
          value={value.map_amount}
          minimumFractionDigits={0}
          maximumFractionDigits={Number(value.map_token_precision)}
          className="mr-1"/>
      }
      {
          type == 'abbr'?<span className="mr-1">{value.map_token_name_abbr}</span>:<span className="mr-1">{value.map_token_name}</span>
      }
      {value.map_token_id != 0 && <span style={{color: '#808080'}}>[ID:{value.map_token_id}]</span>}
    </span>
  );
}
