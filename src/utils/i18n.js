import React from "react";
import { FormattedMessage } from "react-intl";
import { upperFirst } from "lodash";

export function t(id) {
  return <FormattedMessage textComponent="option" id={id} />;
}

export function tu(id) {
  return (
    <FormattedMessage id={id}>
      {txt => <span>{upperFirst(txt)}</span>}
    </FormattedMessage>
  );
}

export function option_t(id) {
    return (
        <FormattedMessage id={id}>
            {txt => <option>{upperFirst(txt)}</option>}
        </FormattedMessage>
    );
}

export function tv(id, values) {
  return <FormattedMessage id={id} values={values} />;
}
