import React from "react";
import { tu } from "../../../utils/i18n";
import $ from 'jquery';

class Tabs extends React.component{
    constructor(){
        super();
        this.state = {
            tabs: [
                {
                  name: 'contract_code_overview_account',
                  id: 'account_title'
                },
                {
                  name: 'my_created_token',
                  id: 'account_my_token'
                },
                {
                  name: 'tokens',
                  id: 'account_tokens'
                },
                {
                  name: 'account_tags_list',
                  id: 'account_tags_list'
                },
                {
                  name: 'my_trading_pairs',
                  id: 'account_my_trading_pairs'
                },
                {
                  name: 'transactions',
                  id: 'account_transactions'
                },
                {
                  name: 'power',
                  id: 'tronPower'
                },
                {
                  name: 'muti_sign',
                  id: 'tronMultisign'
                },
                {
                  name: 'Super Representatives',
                  id: 'account_Super_Representatives'
                },
        
              ],
              scrollsId: '',
              linkIds: [],
        }
    }
    componentDidUpdate(){
        // this.getScrollsIds()
    }

    // onScrollEvent(linkIds) {
    //     const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    //     if (linkIds.length) {
    //       linkIds.forEach((item, index) => {
    //         const el = $('#' + item.key).get(0);
    //         const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
    //         if (top <= viewPortHeight - 400) {
    //           $('.' + item.key).addClass('active');
    //           linkIds.forEach((k, v) => {
    //             if (item.key !== k.key) {
    //               $('.' + k.key).removeClass('active');
    //             }
    //           });
    //         }
    //       });
    //     }
    //   }
  
    //   getScrollsIds = () => {
    //     let { tabs } = this.state;
    //     const linkIds = [];
    //     tabs.forEach((item, index) => {
    //       // const top = document.getElementById(`${item.id}`);
    //       let top = $('#' + item.id);
          
    //       if (top) {
    //         linkIds.push({ key: item.id, offsetTop: top.offset().top });
    //       }
    //     })
    //     let _this = this;
    //      window.onscroll = function () {
    //        console.log(linkIds)
    //       _this.onScrollEvent(linkIds);
    //     }
    //     //window.addEventListener('scroll',this.onScrollEvent.bind(this,linkIds));
    
    //   };
  
    //   scrollToAnchorTab = (anchorName) => {
    //     if (anchorName || anchorName === 0) {
    //       const anchorElement = document.getElementById(anchorName);
    //       if (anchorElement) {
    //         anchorElement.scrollIntoView(true,{
    //           // block: 'nearest',
    //           behavior: 'smooth',
    //         });
    //       }
    //     }
    //   };
    render(){
        const {tabs} = this.state;
        return (
            <nav className="card-header list-style-body-scroll__header navbar navbar-expand-sm fixed-top" style={{ position: "sticky", zIndex: 10, background: '#f3f3f3', borderBottom: 'none' }}>
            <ul className="nav nav-tabs card-header-tabs navbar-nav">
                1111
              {/* {
                Object.values(tabs).map(tab => (
                  <li className="nav-item scroll-li" key={tab.id}>
                    <a href="javascript:"
                      className={`scroll-tab nav-link ${tab.id} ${tab.id==='account_title'?'active':''}`}
                      key={tab.id}
                      onClick={() => this.scrollToAnchorTab(tab.id)}
                    >
                      {tu(tab.name)}
                    </a>
                  </li>
                ))
              } */}
            </ul>
          </nav>
        )
    }
}

export default Tabs
