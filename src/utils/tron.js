import {FormattedNumber} from "react-intl";
import React from "react";


export const tronAddresses = [
  '27d3byPxZXKQWfXX7sJvemJJuv5M65F3vjS',
  '27fXgQ46DcjEsZ444tjZPKULcxiUfDrDjqj',
  '27SWXcHuQgFf9uv49FknBBBYBaH3DUk4JPx',
  '27WtBq2KoSy5v8VnVZBZHHJcDuWNiSgjbE3',
];


export function FormattedTRX(props) {

  return (
    <FormattedNumber
      maximumFractionDigits={7}
      minimunFractionDigits={7}
      {...props} />
  );
}
