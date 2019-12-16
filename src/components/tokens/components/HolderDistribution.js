import React from "react";
import { injectIntl } from "react-intl";
import { tv, tu } from "../../../utils/i18n";

class HolderDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartAry: [
        {
          id: 1,
          background: "#0477FF",
          percent: "38.4443 1 0%",
          first: "1",
          end: "10",
          portion: "38.4443"
        },
        {
          id: 2,
          background: "#EDB92B",
          percent: "12.0836  1 0%",
          first: "11",
          end: "50",
          portion: "12.0836"
        },
        {
          id: 3,
          background: "#32C956",
          percent: "17.4921  1 0%",
          first: "51",
          end: "100",
          portion: "17.4921"
        },
        {
          id: 4,
          background: "#FF9065",
          first: "101",
          end: "500",
          percent: "19.7246 1 0%",
          portion: "19.7246"
        },
        {
          id: 5,
          background: "#05D2AD",
          percent: "12.2553  1 0%",
          first: "501",
          end: "",
          portion: "12.2553"
        }
      ]
    };
  }
  render() {
    const { chartAry } = this.state;
    return (
      <div
        className="holder-distribution"
        style={{
          background: "#fff",
          paddingTop: "20px",
          marginBottom: "20px",
          borderLeft: "1px solid #d8d8d8",
          borderRight: "1px solid #d8d8d8",
          borderBottom: "1px solid #d8d8d8"
        }}
      >
        <section
          className="distribution-header"
          style={{
            fontFamily: "PingFangSC-Medium",
            color: "#333333",
            fontSize: "16px",
            fontWeight: 500,
            textIndent: "20px"
          }}
        >
          {tu("distributionTitle")}
        </section>
        <section
          style={{
            margin: "10px 20px 0"
          }}
        >
          {chartAry.map((item, ind) => {
            return (
              <span key={ind}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    display: "inline-block",
                    background: item.background
                  }}
                ></span>
                <span
                  style={{
                    margin: "0 20px 0 10px",
                    fontFamily: "PingFangSC-Regular",
                    fontSize: "14px"
                  }}
                >
                  {tv("assetsPercent", { first: item.first, end: item.end })}
                </span>
              </span>
            );
          })}
        </section>
        <section
          className="distribution-content"
          style={{
            display: "flex",
            margin: "10px 20px",
            overflow: "hidden"
          }}
        >
          {chartAry.map((item, ind) => {
            return (
              <div
                className="distribution-item"
                key={ind}
                style={{
                  height: "30px",
                  background: item.background,
                  flex: item.percent
                }}
              ></div>
            );
          })}
        </section>
        <section
          className="distribution-note"
          style={{
            display: "flex",
            margin: "0 28px",
            paddingTop: "6px",
            paddingBottom: "19px"
          }}
        >
          {chartAry.map((item, ind) => {
            return (
              <div
                className="distribution-list"
                key={ind}
                style={{
                  flex: item.percent
                }}
              >
                <section
                  style={{
                    fontFamily: "PingFangSC-Regular",
                    fontSize: "12px",
                    color: "#333333"
                  }}
                >
                  {item.portion}%
                </section>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}

export default injectIntl(HolderDistribution);
