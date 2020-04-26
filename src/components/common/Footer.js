import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { withTimers } from "../../utils/timing";
import { tu, pure_t } from "../../utils/i18n";
import { HrefLink } from "../common/Links";
import isMobile from "../../utils/isMobile";
import HelpLinkCont from "./HelpLink";
import { setActiveCurrency } from "../../actions/app";
import { Menu, Dropdown, Icon, Button } from "antd";
import SendModal from "../transfer/Send/SendModal";
import { QuestionMark } from "./QuestionMark";
import {
  setLanguage,
} from "../../actions/app";

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      links: [
        {
          icon: "fab fa-telegram",
          url: "https://t.me/tronscan_org",
          name: "Telegram"
        },
        {
          icon: "fab fa-twitter",
          url: "https://twitter.com/TRONSCAN_ORG",
          name: "Twitter"
        },
        {
          icon: "fab fa-medium-m",
          url: "https://medium.com/@TRONSCAN_ORG",
          name: "Medium"
        },
        {
          icon: "fab fa-discord",
          url: "https://discord.gg/hqKvyAM",
          name: "Discord"
        },
        {
          icon: "fab fa-weixin",
          url: "",
          name: "WeChat"
        },
        {
          icon: "fab fa-weibo",
          url: "https://www.weibo.com/tronscan?refer_flag=1005055013_&is_hot=1",
          name: "Weibo"
        },
       
      ],
      modal: null,
      donateAddress: "TTzPiwbBedv7E8p4FkyPyeqq4RVoqRL3TW"
    };
  }


  setLanguage = (language) => {
    this.props.setLanguage(language);
  };

  render() {
    const donate_address = this.state.donateAddress;
    let modal = this.state.modal;
    let {
      intl,
      activeLanguage,
      activeCurrency,
      currencyConversions,
      languages,
    } = this.props;
   
    const { links } = this.state;
    return (
      <div className="footer-compontent pb-0 footer-new">
        <div className="pt-5 home-footer">
          {isMobile ? (
            <div className="container mobile-footer">
              <div className="row text-center text-xs-center text-sm-left text-md-left list">
                <div className="col-6 col-md-3">
                  <h5>{tu("footer_fellow_us")}</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex">
                      <HrefLink href="https://t.me/tronscan_org">
                        <i className="fab fa-telegram mr-1"></i>Telegram
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://twitter.com/TRONSCAN_ORG">
                        <i className="fab fa-twitter mr-1"></i>Twitter
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://medium.com/@TRONSCAN_ORG">
                        <i className="fab fa-medium-m mr-1"></i>Medium
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://discord.gg/hqKvyAM">
                        <i className="fab fa-discord mr-1"></i>Discord
                      </HrefLink>
                    </li>

                    <li>
                      <HrefLink href="https://www.weibo.com/tronscan?refer_flag=1005055013_&is_hot=1">
                        <i className="fab fa-weibo mr-1" />
                        Weibo
                      </HrefLink>
                    </li>
                    <li>
                      <a target="_blank" className="footer-icon mobile-footer-icon">
                        <i className="fab fa-weixin mr-1"></i>WeChat
                        <div className="code_wrap">
                          <img
                            src={require("../../images/footer/tronscan_wechat.png")}
                          />
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h5>{tu("footer_developer_resources")}</h5>
                  <ul className="list-unstyled">
                    <li>
                      <HrefLink href="https://github.com/tronprotocol">
                        Github
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://github.com/tronprotocol/java-tron">
                        java-tron
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink
                        href={
                          activeLanguage == "zh"
                            ? "https://github.com/tronprotocol/documentation-zh"
                            : "https://github.com/tronprotocol/documentation-en"
                        }
                      >
                        Documentation
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://developers.tron.network/">
                        Developer Hub
                      </HrefLink>
                    </li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h5>{tu("TRON_ecosystem")}</h5>
                  <ul className="list-unstyled">
                    <li>
                      <HrefLink href="https://tron.network">
                        {" "}
                        {tu("footer_tron_network")}
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://www.tronlink.org">
                        {" "}
                        {tu("wallet")}
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://poloniex.org">
                        {tu("exchange")}
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://tronlending.org/?utm_source=TS">
                        TRONLENDING
                      </HrefLink>
                    </li>
                    <li>
                      <HrefLink href="https://tron.app">DApp House</HrefLink>
                    </li>
                  </ul>
                </div>
                <div className="col-6 col-md-3">
                  <h5 className="text-uppercase">{tu("about_us")}</h5>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/help/about">
                        {tu("index_page_footer_team_info")}
                      </Link>
                    </li>
                    {/* <li>
                    <HrefLink href={activeLanguage == 'zh'?"https://support.tronscan.org/hc/zh-cn/requests/new":"https://support.tronscan.org/hc/en-us/requests/new"}>
                      {tu('contact_us')}
                    </HrefLink>
                  </li> */}
                    <li>
                      <HrefLink
                        href={
                          activeLanguage == "zh"
                            ? "https://tronscanorg.zendesk.com/hc/zh-cn"
                            : "https://tronscanorg.zendesk.com/hc/en-us"
                        }
                      >
                        {tu("footer_support_center")}
                      </HrefLink>
                    </li>
                    {/* <li>
                    <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn/categories/360001616871-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98":"https://tronscanorg.zendesk.com/hc/en-us/categories/360001621712-FAQ"}>
                        {tu('frequently_asked_questions')}
                    </HrefLink>
                  </li> */}
                  </ul>
                </div>
              </div>
              {/*<div className="row mt-3">*/}
              {/*<div className="col-xs-12 col-sm-12 col-md-12">*/}
              {/*<ul*/}
              {/*className="list-unstyled list-inline social text-center"*/}
              {/*style={{ marginBottom: 4 }}*/}
              {/*>*/}
              {/*<li className="list-inline-item">*/}
              {/*<HrefLink href="https://www.facebook.com/tronfoundation/">*/}
              {/*<i className="fab fa-facebook" />*/}
              {/*</HrefLink>*/}
              {/*</li>*/}
              {/*<li className="list-inline-item">*/}
              {/*<HrefLink href="https://github.com/tronscan/tronscan-frontend">*/}
              {/*<i className="fab fa-github" />*/}
              {/*</HrefLink>*/}
              {/*</li>*/}
              {/*<li className="list-inline-item">*/}
              {/*<HrefLink href="mailto:feedback@tronscan.org" target="_blank">*/}
              {/*<i className="fa fa-envelope" />*/}
              {/*</HrefLink>*/}
              {/*</li>*/}
              {/*<li className="list-inline-item">*/}
              {/*<HrefLink*/}
              {/*href="https://www.reddit.com/r/Tronix"*/}
              {/*target="_blank"*/}
              {/*>*/}
              {/*<i className="fab fa-reddit-alien" />*/}
              {/*</HrefLink>*/}
              {/*</li>*/}
              {/*</ul>*/}
              {/*</div>*/}
              {/*<hr />*/}
              {/*</div>*/}
              <div className="copyright pt-5">
                {modal}
                <div className="row container" style={{paddingRight:0}}>
                  <div className="col-xs-12 col-sm-6 col-md-6 text-center mb-3 hidden-mobile">
                    <div>
                      <div className="switch d-flex between hidden-mobile">
                        <span>{tu("index_page_switch_tokens")}</span>
                        {this.dropCurrency()}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-center mb-3"
                    style={{ margin: "0 auto" }}
                  >
                    <div className="fr d-flex">
                      <div className="donate nowidth">
                        <Link
                          to={`/address/${donate_address}`}
                          className="after"
                        >
                          {donate_address}
                        </Link>
                        <Button
                          type="danger"
                          size={"small"}
                          onClick={this.renderSend}
                        >
                          {tu("donateAddress")}
                        </Button>
                      </div>
                      <div className="ml-1 mt-1">
                        <QuestionMark
                          text={intl.formatMessage({
                            id: "index_page_footer_donate_address"
                          })}
                        ></QuestionMark>
                      </div>
                    </div>

                    <div className="text mr-3 text-cnter mobileCopyright">
                      Copyright© 2017-2020 tronscan.org
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="footerContainer">
                <div className="text-center text-xs-center text-sm-left text-md-left d-flex footerTronSection">
                  <div className="d-flex">
                    <div className="">
                      <h5>{tu("TRON_ecosystem")}</h5>

                      <ul className="list-unstyled quick-links">
                        <li className="p-2">
                          <HrefLink href="https://tron.network">
                            {tu("footer_tron_network")}
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://www.tronlink.org">
                            {" "}
                            {tu("wallet")}
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://poloniex.org">
                            {tu("exchange")}
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://tronlending.org/?utm_source=TS">TRONLENDING</HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://tron.app">DApp House</HrefLink>
                        </li>
                      </ul>
                    </div>
                    <div className="developCenter">
                      <h5>{tu("footer_developer_resources")}</h5>

                      <ul className="list-unstyled quick-links">
                        <li className="p-2">
                          <HrefLink href="https://github.com/tronprotocol">
                            Github
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://github.com/tronprotocol/java-tron">
                            java-tron
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink
                            href={
                              activeLanguage == "zh"
                                ? "https://github.com/tronprotocol/documentation-zh"
                                : "https://github.com/tronprotocol/documentation-en"
                            }
                          >
                            Documentation
                          </HrefLink>
                        </li>
                        <li className="p-2">
                          <HrefLink href="https://developers.tron.network/">
                            Developer Hub
                          </HrefLink>
                        </li>
                      </ul>
                    </div>
                    <div className="">
                      <h5 className="text-uppercase">{tu("about_us")}</h5>

                      <ul className="list-unstyled quick-links">
                        <li className="p-2">
                          <Link to="/help/about">
                            {tu("index_page_footer_team_info")}
                          </Link>
                        </li>
                        {/* <li className="p-2">
                      <HrefLink href={activeLanguage == 'zh'?"https://support.tronscan.org/hc/zh-cn/requests/new":"https://support.tronscan.org/hc/en-us/requests/new"}>
                          {tu('contact_us')}
                      </HrefLink>
                    </li> */}
                         <li className="p-2">
                          <HrefLink
                            href={
                              activeLanguage == "zh"
                                ? "https://tronscanorg.zendesk.com/hc/zh-cn"
                                : "https://tronscanorg.zendesk.com/hc/en-us"
                            }
                          >
                            {tu("footer_support_center")}
                          </HrefLink>
                        </li>
                        {/* <li className="p-2">
                      <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn/categories/360001616871-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98":"https://tronscanorg.zendesk.com/hc/en-us/categories/360001621712-FAQ"}>
                          {tu('frequently_asked_questions')}
                      </HrefLink>
                    </li> */}
                      </ul>
                    </div>
                    <div className="hidden-mobile" style={{margin:'0 90px 0 90px'}}>
                      <h5 className="text-uppercase hidden-mobile d-flex">
                        <span style={{padding:"5px 7px",background:"rgba(0, 0, 0, 0.14)",fontFamily: "HelveticaNeue",fontSize: "11px", color: "#C2C2C2"}}>{tu("index_page_switch_tokens")}</span>
                        <span className="currencySwitch">{this.dropCurrency()}</span>
                      </h5>
                    </div>
                    <div className="hidden-mobile footerLanguagesWrapper dropup">
                      <img src={require(`../../images/home/${activeLanguage}.svg`)} alt="" style={{marginRight:'6px'}}/>
                      <a className="dropdown-toggle pr-0 footerLanguages text-uppercase"
                            data-toggle="dropdown"
                            href="javascript:">{languages[activeLanguage]}</a>
                      <div className="dropdown-menu languages-menu footer-languages" aria-labelledby="navbarDropdown">
                        {
                          Object.keys(languages).map(language => (
                              <a key={language}
                                className="dropdown-item"
                                href="javascript:"
                                onClick={() => {
                                  this.setLanguage(language);
                                  document.documentElement.scrollTop = 0;
                                }}>
                                  <img src={require(`../../images/home/${language}.svg`)} alt="" style={{marginRight:'6px'}}/>
                                  {languages[language]}
                                </a>
                          ))
                        }
                      </div>
                    </div>
                   
                  </div>
                  <div>
                    <div className="fr footer-slogan">
                      <img src={require("../../images/footer/TRON.png")} />
                      <p className="pt-2">{tu("index_page_tronscan_info")}</p>
                      <ul className="d-flex fr pt-4 mt-4">
                        {links.map((item, ind) => {
                          if (item.name != "WeChat") {
                            return (
                              <li key={ind}>
                                <HrefLink href={item.url}>
                                  <i className={`${item.icon} mr-3`} />
                                </HrefLink>
                              </li>
                            );
                          } else {
                            return (
                              <li className="footer-icon" key={ind}>
                                <a target="_blank">
                                  <i className={`${item.icon} mr-3`}></i>
                                  <div className="code_wrap">
                                    <img
                                      src={require("../../images/footer/tronscan_wechat.png")}
                                    />
                                  </div>
                                </a>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </div>
                  </div>
                  
                </div>
                <div className="helpLinkPos">
                  <HelpLinkCont></HelpLinkCont>
                </div>
              </div>
              <div className="copyright footerCopyrightWrapper">
                {modal}
                <div className="row footerContainer copyrightFooterContainer">
                  <div className="col-xs-6 col-sm-6 col-md-6 text-center">
                    <div className="d-flex">
                      <span className="text mr-3">
                        Copyright© 2017-2020 tronscan.org
                      </span>
                    </div>
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 text-center">
                    <div className="fr d-flex">
                      <div className="donate">
                        <Link
                          to={`/address/${donate_address}`}
                          className="after"
                        >
                          {donate_address}
                        </Link>
                        <Button
                          type="danger"
                          size={"small"}
                          onClick={this.renderSend}
                        >
                          {tu("donateAddress")}
                        </Button>
                      </div>
                      <div className="ml-1">
                        <QuestionMark
                          text={intl.formatMessage({
                            id: "index_page_footer_donate_address"
                          })}
                        ></QuestionMark>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  dropCurrency() {
    const { currencyConversions, activeCurrency } = this.props;


    return (
      <div className="footerCurrencyBtn dropup">
        <a className="dropdown-toggle pr-0 footerCurrencyTitle text-uppercase"
          data-toggle="dropdown"
          href="javascript:">{activeCurrency.toUpperCase()}</a>
        <div className="dropdown-menu languages-menu footer-languages" aria-labelledby="navbarDropdown">
          {currencyConversions.map(currency => (
            <a 
              key={currency.id}
              className="dropdown-item"
              href="javascript:"
              onClick={() => this.setCurrency(currency.id)}>
                {currency.name}
            </a>
          ))}
        </div>
      </div>
    );
  }

  setCurrency = currency => {
    this.props.setActiveCurrency(currency);
  };

  renderSend = () => {
    let { donateAddress } = this.state;

    this.setState({
      modal: (
        <SendModal to={donateAddress} isOpen={true} onClose={this.hideModal} />
      )
    });
  };

  hideModal = () => {
    this.setState({ modal: null });
  };
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    activeCurrency: state.app.activeCurrency,
    languages: state.app.availableLanguages,
    currencyConversions: state.app.currencyConversions
  };
}

const mapDispatchToProps = {
  setActiveCurrency,
  setLanguage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimers(injectIntl(Footer)));
