import React, { Fragment, Component } from "react";
import { t, tu, tv } from "../../utils/i18n";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";

class RatingRule extends Component {
  constructor({ match }) {
    super();

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  componentWillUnmount() {}

  render() {
    return (
      <main className="container header-overlap token_black sorce-code-use token-rating-rule">
        <div>
          <div className="mt-2">
            <p>
              {tu("token_rating_rule_title")}{" "} 
            </p>
          </div>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>1.{tu("token_rating_rule_title_p1_title")}</h5>
          <p>{tu("token_rating_rule_title_p1")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>2.{tu("token_rating_rule_title_p2_title")}</h5>
          <p>{tu("token_rating_rule_title_p2")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>3.{tu("token_rating_rule_title_p3_title")}</h5>
          <p>{tu("token_rating_rule_title_p3")}</p>
          <ul>
            <li>{tu('token_rating_rule_title_p3_1')}</li>
            <li>{tu('token_rating_rule_title_p3_2')}</li>
            <li>{tu('token_rating_rule_title_p3_3')}</li>
            <li>{tu('token_rating_rule_title_p3_4')}</li>
          </ul>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>4.{tu("token_rating_rule_title_p4_title")}</h5>
          <p>{tu("token_rating_rule_title_p4")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>5.{tu("token_rating_rule_title_p5_title")}</h5>
          <p>{tu("token_rating_rule_title_p5")}</p>
        </div>
        <div className="p3 mt-3 mb-3">
          <h5>{tu("token_rating_rule_title_end_title")}</h5>
          <p>{tu("token_rating_rule_title_end_1")}</p>
          <p>{tu("token_rating_rule_title_end_2")}</p>
          <p>{tu("token_rating_rule_title_end_3")}</p>
          <p>{tu("token_rating_rule_title_end_4")}</p>
        </div>
      </main>
    );
  }
}

export default injectIntl(RatingRule);
