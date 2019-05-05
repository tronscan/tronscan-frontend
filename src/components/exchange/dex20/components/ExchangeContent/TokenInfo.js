import React from "react";
import { injectIntl, FormattedNumber } from "react-intl";
import { withRouter } from "react-router";
import { widget } from "../../../../../lib/charting_library.min";
import Datafeed from "./udf/index.js";
import { connect } from "react-redux";
import { tu, tv } from "../../../../../utils/i18n";
import { TRXPrice } from "../../../../common/Price";
import { Client20 } from "../../../../../services/api";
import { change10lock, setWidget } from "../../../../../actions/exchange";
import { TokenTRC20Link } from "../../../../common/Links";
import { Icon } from "antd";

class Tokeninfo extends React.Component {
  constructor() {
    super();

    this.state = {
      tokeninfo: [],
      tokeninfoItem: {},
      detailShow: false,
      tvStatus: true
    };
  }

  componentDidMount() {
    const { tokeninfo } = this.state;
    const { selectData } = this.props;
    const newObj = tokeninfo.filter(o => o.symbol == selectData.fShortName)[0];
    this.setState({ tokeninfoItem: newObj, detailShow: false });
  }

  componentDidUpdate(prevProps) {
    const { tokeninfo } = this.state;
    const { selectData, activeLanguage } = this.props;

    if (!tokeninfo.length && selectData.exchange_id) {
      this.getTokenInfo();
    }
    if (
      selectData.exchange_id != prevProps.selectData.exchange_id ||
      prevProps.activeLanguage != activeLanguage
    ) {
      const newObj = tokeninfo.filter(
        o => o.symbol == selectData.fShortName
      )[0];
      this.setState({ tokeninfoItem: newObj, detailShow: false });
    }
  }

  getTokenInfo() {
    const { selectData } = this.props;
    Client20.gettokenInfo20().then(({ trc20_tokens }) => {
      if (trc20_tokens) {
        const newObj = trc20_tokens.filter(
          o => o.name == selectData.first_token_id
        )[0];
        this.setState({ tokeninfoItem: newObj });
        this.setState({ tokeninfo: trc20_tokens });
      }
    });
  }

  render() {
    const { tokeninfoItem, detailShow, tvStatus } = this.state;
    const { selectData, widget } = this.props;
    let imgDefault = require("../../../../../images/logo_default.png");

    return (
      <div>
        {/* title 信息 */}
        <div className="d-flex mb-3 exchange__kline__title position-relative">
          {tokeninfoItem && tokeninfoItem.icon_url ? (
            <img
              src={tokeninfoItem.icon_url}
              style={{ width: "46px", height: "46px" }}
            />
          ) : (
            <img src={imgDefault} style={{ width: "46px", height: "46px" }} />
          )}

          <div className="ml-3">
            <div className="d-flex mb-1">
              <div
                className="kline_down"
                onClick={() => this.setState({ detailShow: !detailShow })}
              >
                <Icon type="caret-down" theme="filled" />
              </div>

              <h5 className="mr-3 font-weight-bold">
                {selectData.exchange_name} ≈ <span>{selectData.price}</span>
              </h5>
            </div>
            <div className="d-flex">
              <div className="mr-3">
                {tu("pairs_change")}
                {!selectData.isUp ? (
                  <span className="col-red ml-2">
                    {selectData.up_down_percent}
                  </span>
                ) : (
                  <span className="col-green ml-2">
                    {selectData.up_down_percent}
                  </span>
                )}
              </div>
              <div className="mr-3">
                {tu("H")}
                <span className=" ml-2">{selectData.high}</span>
              </div>
              <div className="mr-3">
                {tu("L")}
                <span className=" ml-2">{selectData.low}</span>
              </div>
              <div className="mr-3">
                {tu("24H_VOL")}{" "}
                <span className="ml-1">
                  {" "}
                  {selectData.second_token_id == "TRX" ? (
                    <TRXPrice amount={selectData.svolume} />
                  ) : (
                    <span>
                      <FormattedNumber value={selectData.volume} />
                      &nbsp;
                      {selectData.first_token_abbr}
                    </span>
                  )}
                </span>
                {/*<span className=" ml-2">{selectData.volume} {selectData.first_token_id}</span>*/}
                {/*≈*/}
              </div>
              <div className="mr-3">
                {selectData.second_token_id == "TRX" ? (
                  " "
                ) : (
                  <span>
                    {tu("trc20_24H_Total")}
                    <span className="ml-1">
                      <FormattedNumber value={selectData.svolume} />
                      &nbsp;
                      {selectData.second_token_abbr}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>
          {tokeninfoItem && detailShow && (
            <div className="kline_detail p-3">
              <p className="kline_detail__inr">
                <b className="mr-2">{tu("trc20_token_info_Token_Info")}</b>
                {tokeninfoItem.token_desc}
              </p>
              <ul className="">
                <li>
                  <p className="title">{tu("trc20_token_info_Total_Name")}</p>
                  <p className="value" style={{ textDecoration: "underline" }}>
                    <TokenTRC20Link
                      name={tokeninfoItem.name}
                      address={tokeninfoItem.contract_address}
                    />
                  </p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Token_Symbol")}</p>
                  <p className="value">{tokeninfoItem.symbol}</p>
                </li>
                <li>
                  <p className="title">
                    {tu("trc20_token_info_Contract_Address")}
                  </p>
                  <p className="value">{tokeninfoItem.contract_address}</p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Total_Supply")}</p>
                  <p className="value">
                    <FormattedNumber
                      value={
                        Number(tokeninfoItem.total_supply_with_decimals) /
                        Math.pow(10, tokeninfoItem.decimals)
                      }
                    />
                  </p>
                </li>
                <li>
                  <p className="title">{tu("trc20_token_info_Website")}</p>
                  <a href={tokeninfoItem.home_page} target="_bank">
                    {tokeninfoItem.home_page}
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

        <hr />

        {/* <div className="exchange__kline__pic" id='tv_chart_container'></div> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectData: state.exchange.data,
    selectStatus: state.exchange.status,
    activeLanguage: state.app.activeLanguage
  };
}

const mapDispatchToProps = {
  change10lock
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(Tokeninfo)));
