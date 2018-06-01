import React from "react";
import {injectIntl} from "react-intl";

const SendOption = ({ name, balance, intl }) => (
  <option value={name}>
    {name} ({intl.formatNumber(balance)} {intl.formatMessage({ id: "available" })})
  </option>
);

export default injectIntl(SendOption);
