import React from "react";
import {injectIntl} from "react-intl";

function SendOption({name, balance, intl}) {

  balance = intl.formatNumber(balance, {
    maximumFractionDigits: 7,
    minimunFractionDigits: 7,
  });

  return (
      <option value={name}>
        {name} ({balance} {intl.formatMessage({id: "available"})})
      </option>
  );
}

export default injectIntl(SendOption);
