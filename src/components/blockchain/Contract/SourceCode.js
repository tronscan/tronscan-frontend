import React, { Fragment, Component } from "react";
import { t, tu, tv } from "../../../utils/i18n";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";

class SourceCode extends Component {
  constructor({ match }) {
    super();

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {}

  render() {
    return (
      <main className="container header-overlap token_black sorce-code-use">
        <div>
          <div className="mt-2">
            <p>
              {tu("contract_source_code_p1")}{" "}
              <Link to="/contracts/terms">
                {t("contract_source_code_p1_use_service")}
              </Link>
            </p>
            <p>
              {tu("contract_source_code_p2_1")}{" "}
              <Link to="/contracts/contract-Compiler/verify">
                {t("contract_source_code_p2_ver")}
              </Link>{" "}
              {tu("contract_source_code_p2_2")}
            </p>
          </div>
        </div>
        <div className="p3 mt-3 mb-3">
          <p>{tu("contract_source_code_p3_title")}</p>
          <p>{tu("contract_source_code_p3_a")}</p>
          <p>{tu("contract_source_code_p3_b")}</p>
          <p>{tu("contract_source_code_p3_c")}</p>
        </div>
        <div className="p3">
          <p>{tu("contract_source_code_p4_title")}</p>
          <p>{tu("contract_source_code_p4_a")}</p>
          <p>{tu("contract_source_code_p4_b")}</p>
          <p>{tu("contract_source_code_p4_c")}</p>
        </div>
      </main>
    );
  }
}

export default injectIntl(SourceCode);
