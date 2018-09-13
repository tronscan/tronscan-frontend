import React, {Component} from 'react';
import {tu} from "../../utils/i18n";

export default class TRONRating extends Component {

  render() {

    return (
        <main className="container header-overlap news token_black">
          <div className="row">
            <div className="col-md-12">
              <div className="card bg-gray">
                <div className="card-body">
                  <h2>{tu('rating_title')}</h2>
                  <p>{tu('modify_on')}:2018/09/05</p>
                  <hr/>
                  <p>
                    {tu('rating_description')}
                  </p>
                  <p>
                    1) {tu('rating_status_1')}
                  </p>
                  <p>
                    a. {tu('rating_status_1_desc_a')}
                  </p>
                  <p>
                    2) {tu('rating_status_2')}
                  </p>
                  <p>
                    {tu('rating_status_2_desc')}
                  </p>
                  <p>
                    a. {tu('rating_status_2_desc_a')}
                  </p>
                  <p>
                    b. {tu('rating_status_2_desc_b')}
                  </p>
                  <p>
                    c. {tu('rating_status_2_desc_c')}
                  </p>
                  <p>
                    d. {tu('rating_status_2_desc_d')}
                  </p>
                  <p>
                    e. {tu('rating_status_2_desc_e')}
                  </p>
                  <p>
                    f. {tu('rating_status_2_desc_f')}
                  </p>
                  <p>
                    3) {tu('rating_status_3')}
                  </p>
                  <p>
                    {tu('rating_status_3_desc')}
                  </p>
                  <p>
                    a. {tu('rating_status_3_desc_a')}
                  </p>
                  <p>
                    b. {tu('rating_status_3_desc_b')}
                  </p>
                  <p>
                    c. {tu('rating_status_3_desc_c')}
                  </p>
                  <p>
                    4) {tu('rating_status_4')}
                  </p>
                  <p>
                    a. {tu('rating_status_4_desc_a')}
                  </p>
                  <p>
                    b. {tu('rating_status_4_desc_b')}
                  </p>
                  <p>
                    5) {tu('rating_status_5')}
                  </p>
                  <p>
                    a. {tu('rating_status_5_desc_a')}
                  </p>
                  <p>
                    b. {tu('rating_status_5_desc_b')}
                  </p>

                  <hr/>
                  <h5> {tu('rating_disclaimer')}</h5>
                  <p>
                    {tu('disclaimer_desc_1')}
                  </p>
                  <p>
                    {tu('disclaimer_desc_2')}
                  </p>
                  <p>
                    {tu('disclaimer_desc_3')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
    )
  }
}
