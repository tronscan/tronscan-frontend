import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { withTimers } from "../../utils/timing";
import { tu } from "../../utils/i18n";
import { toastr } from "react-redux-toastr";
import { HrefLink } from "../common/Links";

class Footer extends Component {
  constructor() {
    super();
  }
  render() {
    let { intl, activeLanguage } = this.props;
    return (
      <main className="home pb-0">
        <div className="pt-5 home-footer">
          <div className="container">
            <div className="row text-center text-xs-center text-sm-left text-md-left">
              <div className="col-xs-12 col-sm-4 col-md-4">
                <h5>TRON</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <HrefLink href="https://dapphouse.org">
                      <i className="fa fa-angle-right mr-4" /> DApps
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink
                      href={
                        activeLanguage == "zh"
                          ? "https://tron.network/exchangesList?lng=zh"
                          : "https://tron.network/exchangesList?lng=en"
                      }
                    >
                      <i className="fa fa-angle-right mr-4" /> List TRX
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://medium.com/@Tronfoundation">
                      <i className="fa fa-angle-right mr-4" /> TRON Labs
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://www.facebook.com/tronfoundation/">
                      <i className="fa fa-angle-right mr-4" /> Facebook
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://twitter.com/tronfoundation">
                      <i className="fa fa-angle-right mr-4" /> Twitter
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://tronfoundation.slack.com/">
                      <i className="fa fa-angle-right mr-4" /> Slack
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://www.reddit.com/r/tronix">
                      <i className="fa fa-angle-right mr-4" /> Reddit
                    </HrefLink>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4">
                <h5>Development</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <HrefLink href="https://github.com/tronprotocol">
                      <i className="fa fa-angle-right mr-4" /> Github
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://github.com/tronprotocol/java-tron">
                      <i className="fa fa-angle-right mr-4" /> java-tron
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://github.com/tronprotocol/Documentation">
                      <i className="fa fa-angle-right mr-4" /> Documentation
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://developers.tron.network/">
                      <i className="fa fa-angle-right mr-4" /> Developer Hub
                    </HrefLink>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-4 col-md-4">
                <h5>Quick links</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <Link to="/votes">
                      <i className="fa fa-angle-right mr-4" />{" "}
                      {tu("vote_for_super_representatives")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/representatives">
                      <i className="fa fa-angle-right mr-4" />{" "}
                      {tu("view_super_representatives")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/wallet/new">
                      <i className="fa fa-angle-right mr-4" />{" "}
                      {tu("create_new_wallet")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/tokens/view">
                      <i className="fa fa-angle-right mr-4" />{" "}
                      {tu("view_tokens")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/help/copyright">
                      <i className="fa fa-angle-right mr-4" /> {tu("copyright")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/help/about">
                      <i className="fa fa-angle-right mr-4" />
                      {tu('about_us')}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12">
                <ul
                  className="list-unstyled list-inline social text-center"
                  style={{ marginBottom: 4 }}
                >
                  <li className="list-inline-item">
                    <HrefLink href="https://www.facebook.com/tronfoundation/">
                      <i className="fab fa-facebook" />
                    </HrefLink>
                  </li>
                  <li className="list-inline-item">
                    <HrefLink href="https://www.github.com/tronprotocol">
                      <i className="fab fa-github" />
                    </HrefLink>
                  </li>
                  <li className="list-inline-item">
                    <HrefLink href="https://twitter.com/tronfoundation">
                      <i className="fab fa-twitter" />
                    </HrefLink>
                  </li>
                  <li className="list-inline-item">
                    <HrefLink href="mailto:feedback@trx.market" target="_blank">
                      <i className="fa fa-envelope" />
                    </HrefLink>
                  </li>
                  <li className="list-inline-item">
                    <HrefLink
                      href="https://www.reddit.com/r/Tronix"
                      target="_blank"
                    >
                      <i className="fab fa-reddit-alien" />
                    </HrefLink>
                  </li>
                </ul>
              </div>
              <hr />
            </div>
            <div className="row ">
              <div className="col-xs-12 col-sm-12 col-md-12 text-center mb-3">
                <Link to="/help/copyright">
                  Copyright© 2017-2018 tronscan.org
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimers(injectIntl(Footer)));
