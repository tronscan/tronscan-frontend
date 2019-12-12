import React from "react";
import { injectIntl } from "react-intl";
import { tv, tu } from "../../../../utils/i18n";

class HolderDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartAry: [
        {
          id: 1,
          background: "rgb(9, 109, 217)",
          percent: "38.4443 1 0%",
          first: "1",
          end: "10",
          portion: "38.4443"
        },
        {
          id: 2,
          background: "rgb(82, 196, 26)",
          percent: "12.0836  1 0%",
          first: "11",
          end: "50",
          portion: "12.0836"
        },
        {
          id: 3,
          background: "rgb(75, 223, 224)",
          percent: "17.4921  1 0%",
          first: "51",
          end: "100",
          portion: "17.4921"
        },
        {
          id: 4,
          background: "rgb(255, 137, 157)",
          first: "101",
          end: "500",
          percent: "19.7246 1 0%",
          portion: "19.7246"
        },
        {
          id: 5,
          background: "rgb(251, 211, 72)",
          percent: "12.2553  1 0%",
          first: "501",
          end: "+∞",
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
        style={{ background: "#fff", paddingTop: "10px" }}
      >
        <section
          className="distribution-header"
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "rgba(0,0,0,0.85)",
            textIndent: "30px"
          }}
        >
          {tu("distributionTitle")}
        </section>
        <section
          className="distribution-content"
          style={{
            display: "flex",
            margin: "32px 28px 0",
            borderRadius: "8px",
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
            paddingTop: "24px",
            paddingBottom: "32px"
          }}
        >
          {chartAry.map((item, ind) => {
            return (
              <div
                className="distribution-list"
                key={ind}
                style={{
                  flex: 1
                }}
              >
                <section>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      display: "inline-block",
                      marginRight: "16px",
                      background: item.background
                    }}
                  ></span>
                  {tv("assetsPercent", { first: item.first, end: item.end })}
                </section>
                <section>{item.portion}%</section>
              </div>
            );
          })}
        </section>
      </div>
    );
  }
}

export default injectIntl(HolderDistribution);
