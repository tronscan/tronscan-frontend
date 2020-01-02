import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { withTimers } from "../../utils/timing";
import { tu,pure_t } from "../../utils/i18n";
import { HrefLink } from "../common/Links";
import isMobile from "../../utils/isMobile";
import {
  setActiveCurrency,
} from "../../actions/app"
import { Menu, Dropdown, Icon,Button } from 'antd';


class Footer extends Component {
  constructor(){
    super()
    this.state = {
      links:[
        {
          icon:"fab fa-telegram",
          url:"https://t.me/tronscan_org",
          name:"Telegram"
        },
        {
          icon:"fab fa-twitter",
          url:"https://twitter.com/TRONSCAN_ORG",
          name:"Twitter"
        },
        {
          icon:"fab fa-medium-m",
          url:"https://medium.com/@TRONSCAN_ORG",
          name:"Medium"
        },{
          icon:"fab fa-discord",
          url:"https://discord.gg/hqKvyAM",
          name:"Discord"
        },
        {
          icon:"fab fa-weibo",
          url:"https://www.weibo.com/tronscan?refer_flag=1005055013_&is_hot=1",
          name:"Weibo"
        },
        {
          icon:"fab fa-weixin",
          url:"",
          name:"WeChat"
        }
      ]
    }
  }

  render() {
    const donate_address = 'TTzPiwbBedv7E8p4FkyPyeqq4RVoqRL3TW';
    let { intl, activeLanguage,activeCurrency,currencyConversions } = this.props;
    const {links} = this.state;
    return (
      <div className="footer-compontent pb-0 footer-new">
        <div className="pt-5 home-footer">
        {
          isMobile?
          <div className="container mobile-footer">
            <div className="row text-center text-xs-center text-sm-left text-md-left list">
              <div className="col-6 col-md-3">
                <h5>{tu('footer_fellow_us')}</h5>
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
                      <i className="fab fa-weibo mr-1" />Weibo
                    </HrefLink>
                  </li>
                  <li>
                    <a target="_blank" className="footer-icon">
                      <i className="fab fa-weixin mr-1"></i>WeChat
                      <div className="code_wrap">
                        <img src={require("../../images/footer/tronscan_wechat.png")} />
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-6 col-md-3">
                <h5>{tu('footer_developer_resources')}</h5>
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

              <div className="col-6 col-md-3">
                <h5>{tu('TRON_ecosystem')}</h5>
                <ul className="list-unstyled">
                  <li>
                    <HrefLink href="https://tron.network"> {tu('footer_tron_network')}</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://poloniex.org">{tu('exchange')}</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://www.tronlink.org"> {tu('wallet')}</HrefLink>
                  </li>
                  <li>
                    <HrefLink href="https://tron.app">Dapps</HrefLink>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-3">
                <h5 className="text-uppercase">Tronscan</h5>
                <ul className="list-unstyled">
                  <li>
                    <Link to="/help/about">
                        {tu('about_us')}
                    </Link>
                  </li>
                  <li>
                    <HrefLink href={activeLanguage == 'zh'?"https://support.tronscan.org/hc/zh-cn/requests/new":"https://support.tronscan.org/hc/en-us/requests/new"}>
                      {tu('contact_us')}
                    </HrefLink>
                  </li>
                  <li>
                    <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn":"https://tronscanorg.zendesk.com/hc/en-us"}>
                        {tu('footer_support_center')}
                    </HrefLink>
                  </li>
                  <li>
                    <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn/categories/360001616871-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98":"https://tronscanorg.zendesk.com/hc/en-us/categories/360001621712-FAQ"}>
                        {tu('frequently_asked_questions')}
                    </HrefLink>
                  </li>
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
                  Copyright© 2017-2019 tronscan.org
                </Link>
              </div>
            </div>
          </div>
          :
          <div>
            <div className="container">
            <div className="row text-center text-xs-center text-sm-left text-md-left">
             
              <div className="col-xs-12 col-sm-2 col-md-2">
                <h5>{tu('TRON_ecosystem')}</h5>
                
                <ul className="list-unstyled quick-links">
                  <li className="p-2">
                    <HrefLink href="https://tron.network">
                        {tu('footer_tron_network')}
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://poloniex.org">
                        {tu('exchange')}
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://www.tronlink.org">
                        {tu('wallet')}
                    </HrefLink>
                  </li>
                  <li className="p-2">
                    <HrefLink href="https://tron.app">
                      DApp House
                    </HrefLink>
                  </li>
                </ul>
              </div>
              <div className="col-xs-12 col-sm-2 col-md-2"> 
                <h5>{tu('footer_developer_resources')}</h5>
                
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
                    <HrefLink href="https://github.com/tronprotocol/Documentation">
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
              <div className="col-xs-12 col-sm-2 col-md-2">
                <h5 className="text-uppercase">{tu('about_us')}</h5>
                
                <ul className="list-unstyled quick-links">
                  <li className="p-2">
                    <Link to="/help/about">
                        {tu('index_page_footer_team_info')}
                    </Link>
                  </li>
                  {/* <li className="p-2">
                    <HrefLink href={activeLanguage == 'zh'?"https://support.tronscan.org/hc/zh-cn/requests/new":"https://support.tronscan.org/hc/en-us/requests/new"}>
                        {tu('contact_us')}
                    </HrefLink>
                  </li> */}
                  <li className="p-2">
                    <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn":"https://tronscanorg.zendesk.com/hc/en-us"}>
                        {tu('footer_support_center')}
                    </HrefLink>
                  </li>
                  {/* <li className="p-2">
                    <HrefLink href={activeLanguage == 'zh'?"https://tronscanorg.zendesk.com/hc/zh-cn/categories/360001616871-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98":"https://tronscanorg.zendesk.com/hc/en-us/categories/360001621712-FAQ"}>
                        {tu('frequently_asked_questions')}
                    </HrefLink>
                  </li> */}
                </ul>
              </div>
              <div className="col-xs-12 col-sm-6 col-md-6">
                  <div className="fr footer-slogan">
                    <img src={require('../../images/footer/TRON.png')}/>
                    <p className="pt-2">{tu('index_page_tronscan_info')}</p>
                    <ul className="d-flex fr pt-4 mt-4">
                      {links.map(item=>{
                        if(item.name != 'WeChat'){
                          return <li>
                          <HrefLink href={item.url}>
                            <i className={`${item.icon} mr-3`} />
                          </HrefLink>
                          </li>
                        }else{
                          return <li className="footer-icon"><a target="_blank" >
                              <i className={item.icon}></i>
                              <div className="code_wrap">
                                <img src={require("../../images/footer/tronscan_wechat.png")} />
                              </div>
                            </a></li>
                        }                       
                      })}                     
                    </ul>
                  </div>
              </div>
            </div>
          </div>
          <div className="copyright pt-5">
            <div className="row container">
              <div className="col-xs-6 col-sm-6 col-md-6 text-center mb-3">
                  <div className="d-flex">
                    <span className="text mr-3">Copyright© 2017-2019 tronscan.org</span>
                    <div className="d-flex switch">
                        <span>{tu('index_page_switch_tokens')}</span>
                        {this.dropCurrency()}
                    </div>
                  </div>
                </div>
                <div className="col-xs-6 col-sm-6 col-md-6 text-center mb-3">
                  <div className="donate fr">    
                        <Link to={`/address/${donate_address}`} className="after">{donate_address}</Link>
                        <Button type="danger" size={'small'}>
                            {tu('donateAddress')}
                        </Button>
                        
                    </div>
                </div>
              </div>
            </div>
          </div>
          
        }
          
        </div>
      </div>
    );
  }

  dropCurrency(){
    const {currencyConversions,activeCurrency} = this.props;
    const menu = (
      <Menu >
        {
            currencyConversions.map(currency => (
              <Menu.Item>
                <a href="javascript:" onClick={() => this.setCurrency(currency.id)}>
                {currency.name}
                </a>
              </Menu.Item>
            ))
          }
      </Menu>
    );

    return (
      <Dropdown overlay={menu} placement="topCenter">
        <a className="ant-dropdown-link" href="javascript:">
        {activeCurrency.toUpperCase()} <Icon type="down" />
        </a>
      </Dropdown>
    )

  }

  setCurrency = (currency) => {
    this.props.setActiveCurrency(currency);
  };
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    activeCurrency: state.app.activeCurrency,
    currencyConversions: state.app.currencyConversions,

  };
}

const mapDispatchToProps = {
  setActiveCurrency
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTimers(injectIntl(Footer)));
