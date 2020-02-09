import React, { Fragment, Component } from "react";
import { tu, tv } from "../../../utils/i18n";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";

class UseServiceTerms extends Component {
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
        <div className="mt-3">
            <p>{tu('contract_terms_title_1')}</p> 
            <p>{tu('contract_terms_title_2')}</p> 
            <p>{tu('contract_terms_title_3')}</p> 
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p1_title')}</h5>
            <p>{tu('contract_terms_p1_1')}</p>
        </div> 
        <div className="page-item">
            <h5>{tu('contract_terms_p2_title')}</h5>
            <p>{tu('contract_terms_p2_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p3_title')}</h5>
            <p>{tu('contract_terms_p3_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p4_title')}</h5>
            <p>{tu('contract_terms_p4_1')}</p>
            <p>{tu('contract_terms_p4_2')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p5_title')}</h5>
            <p>{tu('contract_terms_p5_1')}</p>
            <p>{tu('contract_terms_p5_2')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p6_title')}</h5>
            <p>{tu('contract_terms_p6_1')}</p>
            <ul>
                <li>{tu('contract_terms_p6_1_1')}</li>
                <li>{tu('contract_terms_p6_1_2')}</li>
                <li>{tu('contract_terms_p6_1_3')}</li>
                <li>{tu('contract_terms_p6_1_4')}</li>
                <li>{tu('contract_terms_p6_1_5')}</li>
                <li>{tu('contract_terms_p6_1_6')}</li>
                <li>{tu('contract_terms_p6_1_7')}</li>
                <li>{tu('contract_terms_p6_1_8')}</li>
                <li>{tu('contract_terms_p6_1_9')}</li>
                <li>{tu('contract_terms_p6_1_10')}</li>
            </ul>
            <p>{tu('contract_terms_p6_2')}</p>
            <p>{tu('contract_terms_p6_3')}</p>
            <p>{tu('contract_terms_p6_4')}</p>

        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p7_title')}</h5>
            <p>{tu('contract_terms_p7_1')}</p>
            <p>{tu('contract_terms_p7_2')}</p>
            <p>{tu('contract_terms_p7_3')}</p>
            <p>{tu('contract_terms_p7_4')}</p>
            <p>{tu('contract_terms_p7_5')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p8_title')}</h5>
            <p>{tu('contract_terms_p8_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p9_title')}</h5>
            <p>{tu('contract_terms_p9_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p10_title')}</h5>
            <p>{tu('contract_terms_p10_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p11_title')}</h5>
            <p>{tu('contract_terms_p11_1')}</p>
            <p>{tu('contract_terms_p11_2')}</p>
            <p>{tu('contract_terms_p11_3')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p12_title')}</h5>
            <p>{tu('contract_terms_p12_1')}</p>
            <p>{tu('contract_terms_p12_2')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p13_title')}</h5>
            <p>{tu('contract_terms_p13_1')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p14_title')}</h5>
            <p>{tu('contract_terms_p14_1')}</p>
            <p>{tu('contract_terms_p14_2')}</p>
            <p>{tu('contract_terms_p14_3')}</p>
            <p>{tu('contract_terms_p14_4')}</p>
            <p>{tu('contract_terms_p14_5')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p15_title')}</h5>
            <h6>{tu('contract_terms_p15_1_title')}</h6>
            <p>{tu('contract_terms_p15_1')}</p>
            <h6>{tu('contract_terms_p15_2_title')}</h6>
            <p>{tu('contract_terms_p15_2')}</p>
            <h6>{tu('contract_terms_p15_3_title')}</h6>
            <p>{tu('contract_terms_p15_3')}</p>
            <h6>{tu('contract_terms_p15_4_title')}</h6>
            <p>{tu('contract_terms_p15_4')}</p>
            <h6>{tu('contract_terms_p15_5_title')}</h6>
            <p>{tu('contract_terms_p15_5')}</p>
            <h6>{tu('contract_terms_p15_6_title')}</h6>
            <p>{tu('contract_terms_p15_6')}</p>
        </div>
        <div className="page-item">
            <h5>{tu('contract_terms_p16_title')}</h5>
            <p>{tu('contract_terms_p16_1')}</p>
            <p>{tu('contract_terms_p16_2')}</p>
            <p>{tu('contract_terms_p16_3')}</p>
        </div>
        <div className="page-item">
            <p>{tu('contract_terms_end')}</p>
        </div>
      </main>
    );
  }
}

export default injectIntl(UseServiceTerms);
