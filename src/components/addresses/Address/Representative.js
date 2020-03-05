import React, { Fragment } from "react";
import { tu } from "../../../utils/i18n";
import { injectIntl } from "react-intl";
import { QuestionMark } from "../../common/QuestionMark";
import { TRXPrice } from "../../common/Price";
import { HrefLink } from "../../common/Links";
import { FormattedNumber } from "react-intl";
import { ONE_TRX } from "../../../constants";
import { Tooltip } from "antd";
import { ExternalLink } from "../../common/Links";

class Representative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    let {
      address,
      TRXBalanceTotal,
      balance,
      totalPower,
      walletReward,
      stats,
      blocksProduced
    } = this.props.data;
    let { intl } = this.props;
    return (
      <Fragment>
        <table className="table m-0">
          <tbody>
            <tr>
              <th>{tu("name")}:</th>
              <td>{address.name}</td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("total_balance")}</span>
                <QuestionMark
                  placement="top"
                  text="address_total_balance_tip"
                  className="ml-1"
                />
                <span className="ml-1">:</span>
              </th>
              <td>
                <ul className="list-unstyled m-0">
                  <li>
                    <div>
                      <TRXPrice amount={TRXBalanceTotal} />{" "}
                      <span className="small">
                        (
                        <TRXPrice
                          amount={TRXBalanceTotal}
                          currency="USD"
                          showPopup={false}
                        />
                        )
                      </span>
                    </div>

                    <div>
                      <span className="small">
                        {tu("address_total_balance_info_sources")}：
                      </span>
                      <span className="small">
                        <HrefLink
                          href={
                            intl.locale == "zh"
                              ? "https://poloniex.org/zh/"
                              : "https://poloniex.org/"
                          }
                        >
                          Poloni DEX
                        </HrefLink>
                      </span>
                      <img
                        width={15}
                        height={15}
                        style={{ marginLeft: 5 }}
                        src={require("../../../images/svg/market.png")}
                        alt=""
                      />
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("address_balance")}</span>
                <span className="ml-1">:</span>
              </th>
              <td>
                <ul className="list-unstyled m-0">
                  <li className="">
                    <FormattedNumber value={(balance + totalPower) / ONE_TRX} />{" "}
                    TRX
                    <div>{this.renderFrozenTokens()}</div>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("address_vote_reward_pending")}
                </span>
                <span className="ml-1">:</span>
              </th>
              <td>
                <ul className="list-unstyled m-0">
                  <li className="d-flex">
                    <TRXPrice
                      amount={walletReward / ONE_TRX}
                      showPopup={false}
                    />
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("address_info_transactions")}</span>
                <QuestionMark placement="top" text="address_transactions_tip" />
                <span className="ml-1">:</span>
              </th>
              <td>
                <span>{address.totalTransactionCount} Txns</span>
              </td>
            </tr>
            <tr>
              <th>{tu("address_info_transfers")}:</th>
              <td>
                <div className="d-flex">
                  <div>
                    {stats.transactions_in + stats.transactions_out} Txns
                  </div>
                  <div>
                    <span className="ml-1">(</span>
                    <i className="fa fa-arrow-down text-success" />
                    &nbsp;
                    <span>{stats.transactions_in} Txns</span>
                    &nbsp;
                    <i className="fa fa-arrow-up  text-danger" />
                    &nbsp;
                    <span>{stats.transactions_out} Txns</span>
                    &nbsp;
                    <span>)</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_split_ratio")}
                </span>

                <span className="ml-1">:</span>
              </th>
              <td>
                <span>xxx</span>
              </td>
            </tr>
            <tr>
              <th>{tu("blocks_produced")}:</th>
              <td>
                <FormattedNumber value={blocksProduced} />
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_block_ratio")}
                </span>

                <span className="ml-1">:</span>
              </th>
              <td>
                <span>xxx</span>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_block_prize")}
                </span>

                <span className="ml-1">:</span>
              </th>
              <td>
                <span>xxx</span>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_vote_prize")}
                </span>
                <span className="ml-1">:</span>
              </th>
              <td>
                <span>xxx</span>
              </td>
            </tr>
            <tr>
              <th>{tu("website")}:</th>
              <td>
                <ExternalLink url={address.representative.url} />
              </td>
            </tr>
          </tbody>
        </table>
      </Fragment>
    );
  }
  renderFrozenTokens() {
    let {
      totalPower,
      sentDelegateBandwidth,
      frozenBandwidth,
      sentDelegateResource,
      frozenEnergy,
      balance
    } = this.props.data;

    let GetEnergy = frozenEnergy + sentDelegateResource;
    let GetBandWidth = frozenBandwidth + sentDelegateBandwidth;
    let Owner = frozenBandwidth + frozenEnergy;
    let Other = sentDelegateResource + sentDelegateBandwidth;
    let totalType1 = GetEnergy + GetBandWidth;
    let totalType2 = Owner + Other;
    let GetEnergyPer =
      totalType1 != 0 ? ((GetEnergy / totalType1) * 100).toFixed(2) : "-";
    let GetBandWidthPer =
      totalType1 != 0 ? (100 - GetEnergyPer).toFixed(2) : "-";
    let OwnerPer =
      totalType2 != 0 ? ((Owner / totalType2) * 100).toFixed(2) : "-";
    let OtherPer = totalType2 != 0 ? (100 - OwnerPer).toFixed(2) : "-";

    const TooltipText = (
      <div style={{ lineHeight: "25px" }}>
        <div style={{ borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
          {tu("address_get_energe")}：
          <FormattedNumber value={GetEnergy / ONE_TRX} />
          &nbsp;TRX ({GetEnergyPer}%)
          <br />
          {tu("address_get_bandwith")}：
          <FormattedNumber value={GetBandWidth / ONE_TRX} />
          &nbsp;TRX ({GetBandWidthPer}%)
        </div>
        <div style={{ paddingTop: "5px" }}>
          {tu("address_freeze_owner")}：
          <FormattedNumber value={Owner / ONE_TRX} />
          &nbsp;TRX ({OwnerPer}%)
          <br />
          {tu("address_freeze_other")}：
          <FormattedNumber value={Other / ONE_TRX} />
          &nbsp;TRX ({OtherPer}%)
        </div>
      </div>
    );
    return (
      <div>
        <span className="ml-1">(</span>
        {tu("address_tron_power_remaining")}:{" "}
        <FormattedNumber value={balance / ONE_TRX} />
        &nbsp;TRX &nbsp;
        {tu("freeze")}:{" "}
        <Tooltip placement="top" innerClassName="w-100" title={TooltipText}>
          <span style={{ color: "rgb(255, 163, 11)" }}>
            <FormattedNumber value={totalPower / ONE_TRX} />
            &nbsp;TRX&nbsp;
          </span>
        </Tooltip>
        <span>)</span>
      </div>
    );
  }
}

export default injectIntl(Representative);
