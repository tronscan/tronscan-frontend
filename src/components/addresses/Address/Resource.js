import React, { Fragment } from "react";
import { Progress, Tooltip } from "antd";
import { tu } from "../../../utils/i18n";
import { FormattedNumber } from "react-intl";
import BigNumber from "bignumber.js";
import { injectIntl } from "react-intl";

class Resource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

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
      powerRemaining
    } = this.props;
    return (
      <Fragment>
        <div className="address-circle-energy">
          <h5>{tu("energy")}</h5>
          <Progress
            width={82}
            strokeWidth={10}
            showInfo={false}
            type="line"
            strokeColor="#4A90E2"
            strokeLinecap="square"
            percent={availableEnergyPercentage}
          />
          <p>
            剩余：{" "}
            <FormattedNumber value={energyRemaining || 0} />
            / <FormattedNumber value={energyLimit || 0} />
          </p>
        </div>
        <div className="address-circle-bandwidth">
          <h5>{tu("bandwidth")}</h5>
          <Progress
            width={82}
            strokeWidth={10}
            showInfo={false}
            type="line"
            strokeColor="#FFA30B"
            strokeLinecap="square"
            percent={availableBandWidthPercentage}
          />

          <p>
            剩余： <FormattedNumber value={netRemaining || 0} />
            / <FormattedNumber value={netLimit || 0} />
          </p>
        </div>
        <div className="address-circle-bandwidth">
          <h5>{tu("tron_power")}</h5>
          <Progress
            width={82}
            strokeWidth={10}
            showInfo={false}
            type="line"
            strokeColor="#FFA30B"
            strokeLinecap="square"
            percent={powerPercentage}
          />

          <p>
            剩余： <FormattedNumber value={powerRemaining || 0} />
            / <FormattedNumber value={totalPower || 0} />
          </p>
        </div>
      </Fragment>
    );
  }
}

export default Resource;
