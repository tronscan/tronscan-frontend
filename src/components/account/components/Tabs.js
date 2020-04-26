import React, { Component,Fragment } from "react";
import { tu } from "../../../utils/i18n";
import isMobile from "../../../utils/isMobile";
import $ from "jquery";

class Tabs extends Component {
  constructor() {
    super();

    this.state = {};
  }
  componentDidUpdate() {}

  scrollToAnchorTab = anchorName => {
    let {tabs} = this.props;
    if (anchorName || anchorName === 0) {
      const anchorElement = document.getElementById(anchorName);
      let offsetTop = anchorElement.offsetTop;
      window.scrollTo(0, offsetTop);
      // this.props.changeScrollIds(anchorName);
    }
  };
  render() {
    const { tabs, scrollsId,intl } = this.props;
    return (
      <nav
        className="card-header list-style-body-scroll__header navbar navbar-expand-sm fixed-top account-owner"
        style={{
          position: "sticky",
          zIndex: 10,
          background: "#fff",
          borderBottom: "none",
          marginBottom: "10px",
          overflow:isMobile?'scroll':'hidden'
        }}
      >
        <div>
        <ul className="nav nav-tabs card-header-tabs navbar-nav">
          {Object.values(tabs).map(tab => (
            <li className="nav-item scroll-li" key={tab.id}>
              <a
                href="javascript:"
                // className={`scroll-tab nav-link ${tab.id} ${
                //   tab.id === scrollsId ? "active" : ""
                // }`}
                className={`scroll-tab nav-link ${tab.id} ${
                  tab.id ==='account_title'  ? "active" : ""
                }`}
                key={tab.id}
                onClick={() => this.scrollToAnchorTab(tab.id)}
              >
                {tab.id == 'tronPower' ? <span>TRON{tu(tab.name)}</span> : tu(tab.name)}
              </a>
            </li>
          ))}
        </ul>
      
        </div>
     </nav>
    );
  }
}

export default Tabs;
