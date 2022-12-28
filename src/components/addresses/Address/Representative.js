import React, { Fragment } from "react";
import { tu } from "../../../utils/i18n";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { QuestionMark } from "../../common/QuestionMark";
import { TRXPrice } from "../../common/Price";
import { HrefLink } from "../../common/Links";
import { FormattedNumber } from "react-intl";
import { ONE_TRX,IS_MAINNET } from "../../../constants";
import { Tooltip, Icon } from "antd";
import { ExternalLink } from "../../common/Links";
import { NavLink, Route, Switch } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import ApiClientAccount from "../../../services/accountApi";
import {
  transactionResultManager,
  transactionResultManagerSun
} from "../../../utils/tron";
import { connect } from "react-redux";
import { Piechart } from "../components/Piechart";
import AddTag from "../../account/components/AddTag";

let superTagInter = null
@connect(state => {
  return {
    account: state.app.account,
    walletType: state.app.wallet,
    popup: null
  };
}, {})
class Representative extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votingEnabled: false,
      popup:null
    };
  }

  componentDidMount() {
  }

  addTagsModal = () => {
    let { match } = this.props;
    this.setState({
      popup: <AddTag onClose={this.hideModal} defaultAddress={match.params.id} onloadTableP={this.onloadAddTable} />
    });
  };

  editTagModal = (record) => {
    this.setState({
      popup: <AddTag onClose={this.hideModal} targetAddress={record.targetAddress} onloadTableP={this.onloadAddTable} />
    });
  };


  hideModal = () => {
    this.setState({ popup: null });
  };

  onloadAddTable = () =>{
    // let { match} = this.props;
    // setTimeout(() => {
      this.props.onloadTable();
    // }, 2000);
  }

  

  render() {
    let {
      address,
      TRXBalanceTotal,
      balance,
      totalPower,
      walletReward,
      stats,
      blocksProduced,
      hasPage,
      brokerage,
      producedEfficiency,
      blockReward,
      version,
      witnessType
    } = this.props.data;
    let { intl, url, account, walletType,tagData } = this.props;
    console.log(tagData)
    let { votingEnabled, popup, } = this.state;
    let type = "-";
    switch (witnessType) {
      case 1:
        type = tu("Super Representatives");
        break;
      case 2:
        type = tu("Super Representative Partners");
        break;
      case 3:
        type = tu("Super Representative Candidates");
        break;
    }

    return (
      <div>
        {popup}
        <table className="table m-0 table-style">
          <tbody>
            <tr>
              <th>{tu("account_tags_my_tag")}:</th>
              {
                IS_MAINNET?
                <td>
                  <span>
                      {
                        account.isLoggedIn && walletType.isOpen?
                        <span>
                          {tagData&&tagData.length>0?
                            <span>
                              {tagData[0].tag}
                              <span style={{color: "#C23631",marginLeft:'8px',cursor:'pointer'}} onClick={()=>this.editTagModal(tagData[0])}>
                                {tu("account_tags_my_tag_update")}
                              </span>
                            </span> 
                            :
                            <span>
                              {tu("account_tags_my_tag_not_available")}
                              <span style={{color: "#C23631",marginLeft:'8px',cursor:'pointer'}}  onClick={this.addTagsModal}>
                                {tu("account_tags_add")}
                              </span>
                            </span>
                          }
                        </span>:
                        <span >
                          <span>{tu("account_tags_my_tag_login_show")}</span>
                        </span> 
                      }
                  </span>
                </td>
                :null
              }
            </tr>
            <tr>
              <th>{tu("name")}:</th>
              <td>{address.name || "-"}</td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("total_balance")}</span>
                <QuestionMark
                  placement="top"
                  text="account_address_total_balance_tip"
                  className="ml-1"
                />
                <span className="ml-1">:</span>
              </th>
              <td>
                <ul className="list-unstyled m-0 ">
                  <li className="d-flex just-con mobile-no-flex flex-wrap">
                    <div>
                      <NavLink exact to={url}>
                        <span
                          className="colorYellow"
                          onClick={this.scrollToAnchor.bind(this)}
                        >
                          <TRXPrice amount={TRXBalanceTotal} />{" "}
                        </span>
                      </NavLink>

                      <span className="small">
                        (
                        <TRXPrice
                          amount={TRXBalanceTotal}
                          currency="USD"
                          showPopup={false}
                        />
                        )
                      </span>
                      {TRXBalanceTotal > 0 && (
                        <img
                          src={require("../../../images/address/chart.png")}
                          onClick={this.pieChart.bind(this)}
                          style={{ width: "17px", cursor: "pointer" }}
                          className="ml-2"
                        />
                      )}
                    </div>

                    <div>
                      <span className="small">
                        {tu("address_total_balance_info_sources")}：
                      </span>
                      <span className="small href-link">
                        <HrefLink
                          href={
                            intl.locale == "zh"
                              ? "https://poloniex.org/zh/"
                              : "https://poloniex.org/"
                          }
                        >
                          POLONIDEX
                        </HrefLink>
                      </span>
                    </div>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("address_balance")}:</span>
              </th>
              <td>
                <ul className="list-unstyled m-0">
                  <li className="d-flex flex-wrap">
                    <span>
                      <FormattedNumber
                        value={(balance + totalPower) / ONE_TRX}
                      />{" "}
                      TRX
                    </span>
                    <div>{this.renderFrozenTokens()}</div>
                  </li>
                </ul>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("address_vote_reward_pending")}:
                </span>
              </th>
              <td>
                <ul className="list-unstyled m-0">
                  <li className="d-flex flex-wrap">
                    <TRXPrice
                      amount={walletReward / ONE_TRX}
                      showPopup={false}
                    />
                    {account.isLoggedIn &&
                      walletReward > 0 &&
                      address.address === account.address && (
                        <a
                          href="javascript:;"
                          className="text-primary btn btn-default btn-sm"
                          style={{ padding: "0 13px", margin: "-2px 0 0 20px" }}
                          onClick={this.accountClaimRewards}
                        >
                          {tu("account_get_reward")}
                        </a>
                      )}
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
                <NavLink exact to={url + "/transactions"}>
                  <span
                    className="colorYellow"
                    onClick={this.scrollToAnchor.bind(this)}
                  >
                    <FormattedNumber value={address.totalTransactionCount} />{" "}
                    Txns
                  </span>
                </NavLink>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("address_info_transfers")}</span>
                <QuestionMark
                  placement="top"
                  text="account_representative_transfer_tip"
                />
                <span className="ml-1">:</span>
              </th>
              <td>
                <div className="d-flex">
                  <NavLink exact to={url + "/transfers"}>
                    <div
                      className="colorYellow"
                      onClick={this.scrollToAnchor.bind(this)}
                    >
                      <FormattedNumber
                        value={stats.transactions_in + stats.transactions_out}
                      />{" "}
                      Txns
                    </div>
                  </NavLink>
                  <div>
                    <span className="ml-1">(</span>
                    <i className="fa fa-arrow-down text-success" />
                    &nbsp;
                    <span>
                      <FormattedNumber value={stats.transactions_in} /> Txns
                    </span>
                    &nbsp;
                    <i className="fa fa-arrow-up  text-danger" />
                    &nbsp;
                    <span>
                      <FormattedNumber value={stats.transactions_out} /> Txns
                    </span>
                    &nbsp;
                    <span>)</span>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("current_version")}:</span>
              </th>
              <td>
                <span>{version}</span>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_split_ratio")}
                </span>
                <QuestionMark
                  placement="top"
                  text="account_representative_split_ratio_tip"
                />
                <span className="ml-1">:</span>
              </th>
              <td>
                <span>
                  {tu("account_representative_voter")}:{100 - brokerage}%{" "}
                  {tu("account_representative_owner")}:{brokerage}%
                </span>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">{tu("blocks_produced")}:</span>
              </th>
              <td>
                <NavLink exact to={url + "/blocks"}>
                  <span
                    className="colorYellow"
                    onClick={this.scrollToAnchor.bind(this)}
                  >
                    <FormattedNumber value={blocksProduced} />
                  </span>
                </NavLink>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_block_ratio")}
                </span>
                <QuestionMark
                  placement="top"
                  text="account_representative_block_ratio_tip"
                />
                <span className="ml-1">:</span>
              </th>
              <td>
                <span>{producedEfficiency} %</span>
              </td>
            </tr>
            <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_block_prize")}:
                </span>
              </th>
              <td>
                <span className="d-flex flex-wrap">
                  <span>
                    <FormattedNumber value={blockReward} /> TRX
                  </span>
                  <span>
                    ({tu("account_representative_voter")}:{" "}
                    <FormattedNumber
                      value={((100 - brokerage) * blockReward) / 100}
                    />{" "}
                    TRX {tu("account_representative_owner")}:
                    <FormattedNumber
                      value={(brokerage * blockReward) / 100}
                    />{" "}
                    TRX)
                  </span>
                </span>
              </td>
            </tr>
            {/* <tr>
              <th>
                <span className="mr-1">
                  {tu("account_representative_vote_prize")}
                </span>
                <span className="ml-1">:</span>
              </th>
              <td>
                <span>{blockReward} TRX ({tu('account_representative_voter')}: {(100-brokerage)*blockReward} % {tu('account_representative_owner')}: {brokerage*blockReward} %)</span>
              </td>
            </tr> */}
            <tr>
              <th className="line36">{tu("website")}:</th>
              <td>
                <div className="d-flex flex-wrap">
                  <span className="line36">
                    {address.representative.url ? (
                      <ExternalLink url={address.representative.url} />
                    ) : (
                      "-"
                    )}
                  </span>

                  {!votingEnabled && hasPage && (
                    <div className="_team ml-3">
                      <Link
                        className="btn btn-sm btn-block btn-default mt-1"
                        to={`/representative/${address.address}`}
                      >
                        {tu("sr_vote_team_information")}
                      </Link>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    let { url } = this.props;
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
          <NavLink exact to={url + "/freeze"}>
            <span
              style={{ color: "rgb(255, 163, 11)" }}
              onClick={this.scrollToAnchor.bind(this)}
            >
              <FormattedNumber value={totalPower / ONE_TRX} />
              &nbsp;TRX&nbsp;
            </span>
          </NavLink>
        </Tooltip>
        <span>)</span>
      </div>
    );
  }

  scrollToAnchor = () => {
    window.scrollTo(0, 800);
  };

  // account claim rewards
  accountClaimRewards = async () => {
    let res, hashid;
    let { account, walletType } = this.props;

    let tronWeb;
    if (walletType.type === "ACCOUNT_LEDGER") {
      tronWeb = this.props.tronWeb();
    } else {
      tronWeb = account.tronWeb;
    }
    const unSignTransaction = await tronWeb.transactionBuilder
      .withdrawBlockRewards(walletType.address)
      .catch(e => false);
    const { result } = await transactionResultManager(
      unSignTransaction,
      tronWeb
    );
    res = result;

    if (res) {
      this.setState({
        popup: (
          <SweetAlert
            success
            title={tu("rewards_claimed_submitted")}
            onConfirm={this.hideModal}
          >
            {tu("rewards_claimed_hash_await")}
          </SweetAlert>
        )
      });
    } else {
      this.setState({
        popup: (
          <SweetAlert
            danger
            title={tu("could_not_claim_rewards")}
            onConfirm={this.hideModal}
          >
            {tu("claim_rewards_error_message")}
          </SweetAlert>
        )
      });
    }
  };

  pieChart() {
    let { intl, priceToUSd } = this.props;
    let chartHeight = "350px";
    let { sortTokenBalances } = this.props.data;
    let data = [];
    sortTokenBalances.map(item => {
      let balance = Number(item.TRXBalance);

      if (balance > 0) {
        let name = item.symbol ? item.symbol : item.map_token_name_abbr;
        data.push({
          name: name,
          value: balance,
          usdBalance: balance * priceToUSd
        });
      }
    });

    this.setState({
      popup: (
        <SweetAlert
          showConfirm={false}
          showClose={true}
          onConfirm={this.hideModal}
          title=""
        >
          <Icon
            type="close"
            onClick={this.hideModal.bind(this)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              fontSize: "14px",
              color: "#666666"
            }}
          />
          <Piechart
            style={{ height: chartHeight }}
            data={data}
            message={{ id: "account_piechart_title" }}
            intl={intl}
          />
        </SweetAlert>
      )
    });
  }

  hideModal = () => {
    this.setState({ popup: null });
  };
}

export default injectIntl(Representative);
