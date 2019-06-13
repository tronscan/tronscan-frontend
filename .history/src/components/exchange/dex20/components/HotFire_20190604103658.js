import React, { Fragment } from "react";
import { injectIntl } from "react-intl";

class Exchange extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  componentDidMount() {}
  render() {
    return <main className="exchange exchange20 exchange-revised" />;
  }
}

export default injectIntl(Exchange);
