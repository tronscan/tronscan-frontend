import React from "react";
import { injectIntl } from "react-intl";
// import { tv, tu } from "../../../../utils/i18n";

class HolderDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="holder-distribution">
        <section className="distribution-header"></section>
        <section className="distribution-content"></section>
        <section className="distribution-note"></section>
      </div>
    );
  }
}

export default injectIntl(HolderDistribution);
