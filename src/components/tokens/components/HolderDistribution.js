import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import xhr from "axios/index";
import { Tooltip } from "antd";
import { API_URL ,uuidv4} from "../../../constants";
import { tv, tu } from "../../../utils/i18n";
import { updateTokenInfo } from "../../../actions/tokenInfo";
import { loadUsdPrice } from "../../../actions/blockchain";
import { Decimal } from "decimal.js";

@connect(state => state, {
  updateTokenInfo
})
class HolderDistribution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartAry: [
        {
          id: 1,
          background: "#0477FF",
          percent: "100 1 0%",
          first: "1",
          end: "10",
          portion: "100"
        },
        {
          id: 2,
          background: "#EDB92B",
          percent: "0  1 0%",
          first: "11",
          end: "50",
          portion: "0"
        },
        {
          id: 3,
          background: "#32C956",
          percent: "0  1 0%",
          first: "51",
          end: "100",
          portion: "0"
        },
        {
          id: 4,
          background: "#FF9065",
          first: "101",
          end: "500",
          percent: "0 1 0%",
          portion: "0"
        },
        {
          id: 5,
          background: "#05D2AD",
          percent: "0  1 0%",
          first: "501",
          end: "∞",
          portion: "0"
        }
      ]
    };
  }

  componentDidMount() {
    this.getDistributionFun();
  }
  // shouldComponentUpdate(nextProps)  {
  //   if(nextProps.intl.locale !== this.props.activeLanguage){
  //       return true
  //   }
  //   return  false
  // }
  async getDistributionFun() {
    const { trcType, tokenId, tokensInfo } = this.props;
    const totalSupply =
      trcType === "trc10"
        ? tokensInfo.tokenDetail.totalSupply
        : tokensInfo.tokenDetail.total_supply_with_decimals;

    await xhr
      .get(`${API_URL}/api/tokens/position-distribution?uuid=${uuidv4}&tokenId=${tokenId}`)
      .then(res => {
        if (res.data) {
          return res.data;
        }
      })
      .then(res => {
        let other = new Decimal(totalSupply)
          .sub(new Decimal(res["rank1-10"]))
          .sub(new Decimal(res["rank11-50"]))
          .sub(new Decimal(res["rank51-100"]))
          .sub(new Decimal(res["rank101-500"]));

        const first = (
          new Decimal(res["rank1-10"]).div(new Decimal(totalSupply)) * 100
        ).toFixed(2);

        const second = (
          new Decimal(res["rank11-50"]).div(new Decimal(totalSupply)) * 100
        ).toFixed(2);

        const third = (
          new Decimal(res["rank51-100"]).div(new Decimal(totalSupply)) * 100
        ).toFixed(2);

        const four = (
          new Decimal(res["rank101-500"]).div(new Decimal(totalSupply)) * 100
        ).toFixed(2);

        const oherPercent = (other.div(new Decimal(totalSupply)) * 100).toFixed(
          2
        );
        let { priceUSD } = this.props;
        let currentDecimals = Math.pow(10, 6);

        const chartAry = [
          {
            id: 1,
            background: "#0477FF",
            percent: `${first} 1 0%`,
            first: "1",
            end: "10",
            portion: `${first}`,
            usdt: new Decimal(res["rank1-10"]).div(currentDecimals).toFixed(6),
            unit: tokensInfo.tokenDetail.abbr || tokensInfo.tokenDetail.symbol
          },
          {
            id: 2,
            background: "#EDB92B",
            percent: `${second} 1 0%`,
            first: "11",
            end: "50",
            portion: `${second}`,
            usdt: new Decimal(res["rank11-50"]).div(currentDecimals).toFixed(6),
            unit: tokensInfo.tokenDetail.abbr || tokensInfo.tokenDetail.symbol
          },
          {
            id: 3,
            background: "#32C956",
            percent: `${third} 1 0%`,
            first: "51",
            end: "100",
            portion: `${third}`,
            usdt: new Decimal(res["rank51-100"])
              .div(currentDecimals)
              .toFixed(6),
            unit: tokensInfo.tokenDetail.abbr || tokensInfo.tokenDetail.symbol
          },
          {
            id: 4,
            background: "#FF9065",
            first: "101",
            end: "500",
            percent: `${four} 1 0%`,
            portion: `${four}`,
            usdt: new Decimal(res["rank101-500"])
              .div(currentDecimals)
              .toFixed(6),
            unit: tokensInfo.tokenDetail.abbr || tokensInfo.tokenDetail.symbol
          },
          {
            id: 5,
            background: "#05D2AD",
            first: "501",
            end: "∞",
            percent: `${oherPercent} 1 0%`,
            portion: `${oherPercent}`,
            usdt: new Decimal(other.toFixed(6)).div(currentDecimals).toFixed(6),
            unit: tokensInfo.tokenDetail.abbr || tokensInfo.tokenDetail.symbol
          }
        ];
        this.setState({
          chartAry
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { chartAry } = this.state;
    let { intl } = this.props;
    return (
      <div
        className="holder-distribution"
        style={{
          background: "#fff",
          paddingTop: "20px",
          paddingBottom: "20px",
          borderLeft: "1px solid #d8d8d8",
          borderRight: "1px solid #d8d8d8"
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
          className="mobile-distribution-title"
          style={{
            margin: "10px 20px 0",
            display: "flex"
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
                  {tv("assetsPercent", {
                    first: item.first,
                    end: item.end,
                    portion: item.portion
                  })}
                  {/* <span>{intl.formatMessage({id: 'assetsPercent'},{
                    first: item.first,
                    end: item.end
                  })}</span> */}
                  {/* : <span>{ + "%"}</span> */}
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
              <Tooltip
                key={ind}
                placement="top"
                title={tv("assetsPercentshow", {
                  first: item.first,
                  end: item.end,
                  usdt: item.usdt,
                  unit: item.unit
                })}
              >
                <div
                  className="distribution-item"
                  style={{
                    height: "30px",
                    background: item.background,
                    flex: item.percent
                  }}
                ></div>
              </Tooltip>
            );
          })}
        </section>
        {/* <section
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
        </section> */}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tokensInfo: state.tokensInfo,
    priceUSD: state.blockchain.usdPrice,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  loadUsdPrice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(HolderDistribution));
