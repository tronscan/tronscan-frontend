import React, { Component } from "react";
import { Icon } from "antd";
import { tu, t } from "../../utils/i18n";
import { injectIntl } from "react-intl";

class HelpLinkCont extends Component {
  constructor() {
    super();
    this.state = {
      unfold: true
    };
  }

  componentDidMount() {}

  render() {
    const myPng = src => {
      return require(`../../images/home/${src}.png`);
    };
    const { unfold } = this.state;
    return (
      <div className="helpLinkWrapper hidden-mobile">
        <ul className="helpLinkContent">
          {unfold ? (
            <span>
              <li
                className="unfold"
                onClick={() => {
                  this.setState({
                    unfold: !unfold
                  });
                }}
              >
                <Icon type="up" />
                <p>{tu("index_page_idebar_expand")}</p>
              </li>
              <li className="help commonLi">
                <a
                  href="https://support.tronscan.org/hc/zh-cn/requests/new"
                  target="_blank"
                >
                  <span className="img"></span>
                </a>
              </li>
            </span>
          ) : (
            <span>
              <li
                className="packup"
                onClick={() => {
                  this.setState({
                    unfold: !unfold
                  });
                }}
              >
                <Icon type="down" />
                <p>{tu("collapse")}</p>
              </li>
              <li className="twitter commonLi">
                <a href="https://twitter.com/TRONSCAN_ORG" target="_blank">
                  <span className="img"></span>
                </a>
              </li>
              <li className="telegram commonLi">
                <a href="https://t.me/tronscan_org" target="_blank">
                  <span className="img"></span>
                </a>
              </li>
              <li className="help commonLi">
                <a
                  href="https://support.tronscan.org/hc/zh-cn/requests/new"
                  target="_blank"
                >
                  <span className="img"></span>
                </a>
              </li>
            </span>
          )}
        </ul>
      </div>
    );
  }
}

export default injectIntl(HelpLinkCont);
