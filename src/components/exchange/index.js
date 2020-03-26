import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { injectIntl } from "react-intl";
import { Client, Client20 } from "../../services/api";
import { tu } from "../../utils/i18n";

import { TronLoader } from "../common/loaders";
import { withRouter } from "react-router";
import { connect } from "react-redux";

// import Trc10 from "./dex10/index";
import Trc20 from "./dex20/index";

class Exchange extends React.Component {
  constructor() {
    super();
    this.state = {
      notice: []
    };
  }

  async componentDidMount() {
    let { intl, match } = this.props;
    const data = await Client20.getNotice(intl.locale, { page: 3 });
    // const { data } = await Client.getNotices({ limit: 3, sort: "-timestamp" });
    this.setState({ notice: data.articles });
  }

  async componentDidUpdate(prevProps) {
    let { intl } = this.props;
    if (prevProps.intl.locale !== intl.locale) {
      const data = await Client20.getNotice(intl.locale, { page: 3 });
      this.setState({ notice: data.articles });
    }
    
  }

  componentWillUnmount() {
    const { widget10, widget20 } = this.props;
    widget10 && widget10.remove();
    widget20 && widget20.remove();
  }

  render() {
    let { intl, match } = this.props;
    let lg = "";
    if (intl.locale === "zh") {
      lg = "CN";
    } else {
      lg = "EN";
    }
    return (
      <div className="container-all header-overlap" style={{ position: "relative", zIndex: 1}}>
        <main className="exchange">
          {/* <div className="notice">
            <img src={require("../../images/announcement-logo.png")} alt="" />
            <div className="notice-wrap">
              {this.state.notice.map((v, i) => (
                <a
                  className="item"
                  key={v.id}
                  href={v.html_url}
                  target="_blank"
                >
                  <span title={v.name} className="title">
                    {v.name}
                  </span>
                            <span className="date">
                    ({v.created_at.substring(5, 10)})
                  </span>
                </a>
              ))}
            </div>
            {this.state.notice.length > 0 ? (
              <a
                href={
                  lg == "CN"
                    ? "https://support.poloniex.org/hc/zh-cn/categories/360001523732-Announcements"
                    : "https://support.poloniex.org/hc/en-us/categories/360001523732-Announcements"
                }
                target="_blank"
              >
                {tu("learn_more")}>
              </a>
            ) : null}
          </div> */}

          {/* {match.params.type === "trc10" && <Trc10 />} */}
          {match.params.type === "trc20" && <Trc20 />}
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    widget10: state.exchange.trc10,
    widget20: state.exchange.trc20
  };
}

export default connect(
  mapStateToProps,
  {}
)(injectIntl(withRouter(Exchange)));
