import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../services/api";
import { Link } from "react-router-dom";
import { tu } from "../../utils/i18n";
// import TimeAgo from "react-timeago";
import { Utc2BeijingDateTime } from "../../utils/DateTime";
import BlockTime from '../common/blockTime'

class Notice extends React.Component {
  constructor() {
    super();
    this.state = {
      notice: []
    };
  }
  async componentDidMount() {
    const { match, intl } = this.props;
    const { id } = match.params;
    const { data } = await Client.getNotices({ sort: "-timestamp" });

    //const focus = data.filter(v=>v.id == id)[0];
    //const date = Utc2BeijingDateTime(focus.createTime.replace(/\s/,'T')+'Z');
    this.setState({ notice: data });
  }
  render() {
    let { intl, match } = this.props;
    const { id } = match.params;
    const focus =
      this.state.notice.length > 0
        ? this.state.notice.filter(v => v.id == id)[0]
        : {};
    const date = focus.createTime
      ? Utc2BeijingDateTime(focus.createTime.replace(/\s/, "T") + "Z")
      : "2018-01-01T00:00:00Z";
    const info = focus.extInfo ? JSON.parse(focus.extInfo) : [];
    let lg = "";
    if (intl.locale === "zh") {
      lg = "CN";
    } else {
      lg = "EN";
    }

    //const a = this.state.focus.updateTime.split(' ');
    //let date = a[0]+'T'+a[1]+'Z';
    //date = Utc2BeijingDateTime(date);
    return (
      <div className="container header-overlap">
        <main className="exchange">
          <div className="exchange-box notice-box mb-2">
            {/* 左侧 交易list */}
            <div className="exchange-box-left">
              <div className="exchange-list mr-2">
                <div className="exchange-list-mark p-3">
                  <div className="exchange-box-left-title">
                    {tu("OthersArticle")}
                  </div>
                  <div className="list-wrap">
                    {this.state.notice.map(v => (
                      <Link
                        to={"/notice/" + v.id}
                        repalce="true"
                        key={v.id}
                        className={"list" + (id == v.id ? " active" : "")}
                      >
                        {v["title" + lg]}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="exchange-box-right">
              <div className="exchange__kline p-3 mb-2">
                <div className="exchange-box-right-title">
                  {focus["title" + lg]}
                </div>
                <div className="exchange-box-right-vice-title">
                  <span className="author">Poloni DEX</span>
                  <div className="line" />
                  <BlockTime time={date}></BlockTime>
                  {/* <TimeAgo date={date} /> */}
                </div>
                <div className="exchange-box-right-content">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{ __html: focus["context" + lg] }}
                  />
                  <div className="social-media">
                    {info.map((v, i) => (
                      <div key={i} className="item">
                        <span>{v.method}:</span>
                        <a href={v.link} target="_blank">
                          {v.link}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
export default injectIntl(Notice);
