import React, { Fragment } from "react";
import { Progress, Tooltip } from "antd";
import { tu } from "../../../utils/i18n";
import { FormattedNumber } from "react-intl";
import BigNumber from "bignumber.js";
import { injectIntl } from "react-intl";
import { Client } from "../../../services/api";
import { QuestionMark } from "../../common/QuestionMark";
class Resource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      realTimeRanking: "",
      realTimeVotes: "",
      lastRanking: "",
      lastCycleVotes: "",
      changeVotes: "",
      changeRank: ""
    };
  }

  componentDidMount() {
    
  }

  render() {
    let {
      availableBandWidthPercentage,
      netRemaining,
      availableEnergyPercentage,
      energyRemaining,
      netLimit,
      energyLimit,
      totalPower,
      powerPercentage,
      powerRemaining,
      isRepresentative
    } = this.props;
    let {
      realTimeRanking,
      realTimeVotes,
      lastRanking,
      lastCycleVotes,
      changeVotes,
      changeRank
    } = this.props;
    return (
      <Fragment>
        <div className="">
        <div className="address-circle-bandwidth address-res">
            <div className="d-flex just-con">
              <span className="title">{tu("tron_power")}</span>
              <span>
                {tu("account_resource_remain")}:{" "}
                <span className="remain">
                  <FormattedNumber value={powerRemaining || 0} />
                </span>
                /<FormattedNumber value={totalPower || 0} />
              </span>
            </div>
            <Tooltip
              title={this.powerCircle}
              overlayStyle={{ maxWidth: "500px" }}
            >
              {this.newProgress(powerPercentage)}
            </Tooltip>
          </div>
       
          <div className="address-circle-energy address-res">
            <div className="d-flex just-con">
              <span className="title">{tu("energy")}</span>
              <span>
                {tu("account_resource_remain")}:{" "}
                <span className="remain">
                  <FormattedNumber value={energyRemaining || 0} />
                </span>
                /<FormattedNumber value={energyLimit || 0} />
              </span>
            </div>
            <Tooltip
              title={this.energyCircle}
              overlayStyle={{ maxWidth: "500px" }}
            >
              {this.newProgress(availableEnergyPercentage)}
            </Tooltip>
          </div>
          <div className="address-circle-bandwidth address-res">
            <div className="d-flex just-con">
              <span className="title">{tu("bandwidth")}</span>
              <span>
                {tu("account_resource_remain")}:{" "}
                <span className="remain">
                  <FormattedNumber value={netRemaining || 0} />
                </span>
                /<FormattedNumber value={netLimit || 0} />
              </span>
            </div>

            <Tooltip
              title={this.bandWidthCircle}
              overlayStyle={{ maxWidth: "500px" }}
            >
              {this.newProgress(availableBandWidthPercentage)}
            </Tooltip>
          </div>
        </div>
        {isRepresentative && <div className="d-flex representive flex-wrap">
          <section className="">
            <h6>
              {tu("account_resource_last")}{" "}
              <QuestionMark placement="top" text="account_resource_last_tip" />
            </h6>
            <p>
              {tu("token_rank")}:{" "}
              <span className="color333">
                <FormattedNumber value={lastRanking || 0} />
              </span>
            </p>
            <p>
              {tu("SR_votes")} :
              <span className="color333">
                <FormattedNumber value={lastCycleVotes || 0} />
              </span>
            </p>
          </section>
          <section className="">
            <h6>
              {tu("account_resource_realTime")}{" "}
              <QuestionMark
                placement="top"
                text="account_resource_realTime_tip"
              />
            </h6>
            <p className="d-flex">
              <span>
                {tu("token_rank")}:{" "}
                <span className="color333">
                  <FormattedNumber value={realTimeRanking || 0} />
                </span>
              </span>
              {changeRank != 0 &&
                (changeRank < 0 ? (
                  <span className="text-success">
                    <i className="fa fa-arrow-up"></i>
                    <FormattedNumber value={Math.abs(changeRank)} />
                  </span>
                ) : (
                  <span className="text-danger">
                    <i className="fa fa-arrow-down"></i>
                    <FormattedNumber value={Math.abs(changeRank)} />
                  </span>
                ))}
            </p>
            <p className="d-flex">
              <span>
                {tu("SR_votes")}:
                <span className="color333">
                  <FormattedNumber value={realTimeVotes || 0} />
                </span>
              </span>
              {changeVotes != 0 &&
                (changeVotes < 0 ? (
                  <span className="text-danger">
                    <i className="fa fa-arrow-down"></i>
                    <FormattedNumber value={Math.abs(changeVotes)} />
                  </span>
                ) : (
                  <span className="text-success">
                    <i className="fa fa-arrow-up"></i>
                    <FormattedNumber value={Math.abs(changeVotes)} />
                  </span>
                ))}
            </p>
          </section>
        </div>}
      </Fragment>
    );
  }
  newProgress(percent) {
    let num = 34;
    let items = [];
    for (let i = 0; i < num; i++) {
      items.push(i);
    }
    let activeNum = percent * num/100;
  
    return (
      <div className="d-flex resource-item">
        {items.map(i => (
          <span
           key={i}
            className={
              i < activeNum
                ? "resource-item-i resource-item-i-active"
                : "resource-item-i"
            }
          ></span>
        ))}
      </div>
    );
  }
  energyCircle = () => {
    let {
      availableEnergyPercentage,
      energyRemaining,
      energyLimit,
      intl
    } = this.props;
    availableEnergyPercentage = availableEnergyPercentage.toFixed(2);
    let usedEnergy = energyLimit - energyRemaining;
    let usedEnergyPercentage =
      usedEnergy > 0 ? 100 - availableEnergyPercentage : "0.00";
    return (
      <div>
        <div>
          {intl.formatMessage({ id: "address_energyLimit" }) +
            " : " +
            energyLimit}
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_energyRemaining" }) +
              " : " +
              energyRemaining}
          </span>
          &nbsp;
          <span>({availableEnergyPercentage + " %"})</span>
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_energyUsed" }) +
              " : " +
              usedEnergy}
          </span>
          &nbsp;
          <span>({usedEnergyPercentage + " %"})</span>
        </div>
      </div>
    );
  };

  bandWidthCircle = () => {
    let {
      availableBandWidthPercentage,
      netRemaining,
      netLimit,
      intl
    } = this.props;
    availableBandWidthPercentage = availableBandWidthPercentage.toFixed(2);

    let usedBandwidth = netLimit - netRemaining;
    let usedBandwidthPercentage =
      usedBandwidth > 0
        ? (100 - availableBandWidthPercentage).toFixed(2)
        : "0.00";
    return (
      <div>
        <div>
          {intl.formatMessage({ id: "address_netLimit" }) + " : " + netLimit}
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_netRemaining" }) +
              " : " +
              netRemaining}
          </span>
          &nbsp; ({availableBandWidthPercentage + " %"})
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_netUsed" }) +
              " : " +
              usedBandwidth}
          </span>
          &nbsp; ({usedBandwidthPercentage + " %"})
        </div>
      </div>
    );
  };

  powerCircle = () => {
    let { totalPower, powerPercentage, powerRemaining, intl } = this.props;
    powerPercentage = powerPercentage.toFixed(2);
    let usedPower = totalPower - powerRemaining;
    let usedPowerPercentage =
      usedPower > 0 ? (100 - powerPercentage).toFixed(2) : "0.00";
    return (
      <div>
        <div>
          {intl.formatMessage({ id: "address_total_tron_power" }) + " : " + totalPower}
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_total_tron_power_remain" }) +
              " : " +
              powerRemaining}
          </span>
          &nbsp; ({powerPercentage + " %"})
        </div>
        <div>
          <span>
            {intl.formatMessage({ id: "address_total_tron_power_used" }) + " : " + usedPower}
          </span>
          &nbsp; ({usedPowerPercentage + " %"})
        </div>
      </div>
    );
  };
}

export default injectIntl(Resource);
