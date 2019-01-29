import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { withTimers } from "../../utils/timing";
import { tu,pure_t } from "../../utils/i18n";
import { toastr } from "react-redux-toastr";
import { HrefLink } from "../common/Links";
import isMobile from "../../utils/isMobile";
import {Truncate} from "./text";

class Footer extends Component {
  constructor() {
    super();
  }
  render() {
    const donate_address = 'TTzPiwbBedv7E8p4FkyPyeqq4RVoqRL3TW';
    let { intl, activeLanguage } = this.props;
    return (
      <main className="home pb-0">
        <div className="pt-5 home-footer">
        {
          isMobile?
          <div className="container mobile-footer">
            <div className="row text-center text-xs-center text-sm-left text-md-left list">
              <div className="col-7 col-md-3">
                <h5>Tronscan</h5>
                <ul className="list-unstyled">
                  <li>
                    <HrefLink href="https://t.me/tronscan">Telegram</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://discordapp.com/invite/GsRgsTD">Discord</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://github.com/tronscan/tronscan-frontend/issues/new">{tu('report_an_error')}</HrefLink>
                  </li>
                  <li>
                    <Link to="/help/about">{tu('about_us')}</Link>
                  </li>
                </ul>
              </div>
              <div className="col-5 col-md-3">
                <h5>TRON</h5>
                <ul className="list-unstyled">
                  <li>
                    <HrefLink href="https://dapphouse.org">DApps</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://twitter.com/tronfoundation">Twitter</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://www.facebook.com/tronfoundation/">Facebook</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://medium.com/@Tronfoundation">Medium</HrefLink>
                  </li>

                </ul>
              </div>
              <div className="col-7 col-md-3">
                <h5>Quick links</h5>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/sr/votes">{tu("vote_for_super_representatives")}</Link>
                  </li>
                  <li>
                    <Link to="/sr/representatives">{tu("view_super_representatives")}</Link>
                  </li>
                  <li>
                    <Link to="/wallet/new">{tu("create_new_wallet")}</Link>
                  </li>
                  <li>
                    <Link to="/tokens/view">{tu("view_tokens")}</Link>
                  </li>
                  <li>
                    <Link to="/help/copyright">{tu("copyright")}</Link>
                  </li>
                </ul>
              </div>
              <div className="col-5 col-md-3">
                <h5>Development</h5>
                <ul className="list-unstyled">
                  <li>
                    <HrefLink href="https://github.com/tronprotocol">Github</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://github.com/tronprotocol/java-tron">java-tron</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://github.com/tronprotocol/Documentation">Documentation</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://developers.tron.network/">Developer Hub</HrefLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className="row mt-3">
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
                    <HrefLink href="https://github.com/tronscan/tronscan-frontend">
                      <i className="fab fa-github" />
                    </HrefLink>
                  </li>
                  <li className="list-inline-item">
                    <HrefLink href="mailto:feedback@tronscan.org" target="_blank">
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
            <div className="row donate m-0">
                <div className="px-3 d-flex w-100 justify-content-center">
                    <div className="d-flex align-items-center pr-2">
                        <img src={require('../../images/footer/icon-heart.png')} width="15px" height="13px" alt="" className="mr-1"/>
                        {tu('donateAddress')}
                        <span>:</span>
                    </div>
                    <Link to={`/address/${donate_address}`} className="text-truncate">{donate_address}</Link>
                   
                </div>
            </div>
            
            <div className="row ">
              <div className="col-xs-12 col-sm-12 col-md-12 text-center mb-3">
                <Link to="/help/copyright" className="color-grey-300">
                  Copyright© 2017-2018 tronscan.org
                </Link>
              </div>
            </div>
          </div>
          :
          <div className="container">
            <div className="row text-center text-xs-center text-sm-left text-md-left">
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h5>TRON</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <HrefLink href="https://dapphouse.org">
                      <i className="fa fa-angle-right mr-4" /> DApps
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://twitter.com/tronfoundation">
                      <i className="fa fa-angle-right mr-4" /> Twitter
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://www.facebook.com/tronfoundation/">
                      <i className="fa fa-angle-right mr-4" /> Facebook
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://medium.com/@Tronfoundation">
                      <i className="fa fa-angle-right mr-4" /> Medium
                    </HrefLink>
                  </li>

                </ul>
              </div>
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h5>Tronscan</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <HrefLink href="https://t.me/tronscan">
                      <i className="fa fa-angle-right mr-4" /> Telegram
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://discordapp.com/invite/GsRgsTD">
                      <i className="fa fa-angle-right mr-4" /> Discord
                    </HrefLink>
                  </li>
                  {/*<li className="p-2">*/}
                    {/*<HrefLink href="https://twitter.com/tronscan3">*/}
                      {/*<i className="fa fa-angle-right mr-4" /> Twitter-tronscan*/}
                    {/*</HrefLink>*/}
                  {/*</li>*/}
                  {/*<li className="p-2">*/}
                    {/*<HrefLink href="https://github.com/tronscan/tronscan-frontend/issues/new">*/}
                      {/*<i className="fa fa-angle-right mr-4" /> {tu('report_an_error')}*/}
                    {/*</HrefLink>*/}
                  {/*</li>*/}
                  <li className="p-2">
                    <HrefLink href="https://github.com/tronscan/tronscan-frontend">
                      <i className="fa fa-angle-right mr-4" /> Tronscan Github
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <Link to="/help/about">
                      <i className="fa fa-angle-right mr-4" /> {tu('about_us')}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-3 col-md-3">
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
              <div className="col-xs-12 col-sm-3 col-md-3">
                <h5>Quick links</h5>
                <div className="line" />
                <ul className="list-unstyled quick-links pt-3">
                  <li className="p-2">
                    <Link to="/sr/votes">
                      <i className="fa fa-angle-right mr-4" />{" "}
                      {tu("vote_for_super_representatives")}
                    </Link>
                  </li>
                  <li className="p-2">
                    <Link to="/sr/representatives">
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
                </ul>
              </div>
            </div>
            <div className="row donate mt-4">
                <div>
                    <div className="before">
                        <img src={require('../../images/footer/icon-heart.png')} alt=""/>
                        {tu('donateAddress')}
                        <span>:</span></div>
                    <Link to={`/address/${donate_address}`} className="after">{donate_address}</Link>
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
                    <HrefLink href="https://github.com/tronscan/tronscan-frontend">
                      <i className="fab fa-github" />
                    </HrefLink>
                  </li>
                  {/*<li className="list-inline-item">*/}
                    {/*<HrefLink href="https://twitter.com/tronscan3">*/}
                      {/*<i className="fab fa-twitter" />*/}
                    {/*</HrefLink>*/}
                  {/*</li>*/}
                  <li className="list-inline-item">
                    <HrefLink href="mailto:feedback@tronscan.org" target="_blank">
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
        }
          
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
