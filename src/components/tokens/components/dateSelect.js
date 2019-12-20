import React from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import { cloneDeep } from "lodash";
import { Button, Radio, DatePicker } from "antd";
import { tu } from "../../../utils/i18n";
import { connect } from "react-redux";
import { updateTokenInfo } from "../../../actions/tokenInfo";
const { RangePicker } = DatePicker;

class DateSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataItemList: [7, 14, 30],
      dataItem: 7,
      RangePickerStatus: false
    };
  }
  changeDateByItem(item) {
    const { onDateOk } = this.props;
    const { dataItem } = this.state;
    item = item || dataItem;
    // .hour(0).minute(0).second(0)
    const end = moment();
    const start = cloneDeep(end).subtract(item, "days");
    this.props.updateTokenInfo({
      start_timestamp: start.valueOf(),
      end_timestamp: end.valueOf()
    });
    onDateOk(start, end);
  }
  handleSizeChange = e => {
    const value = e.target.value;
    console.log(value);
    if (value === "more") {
      this.setState({
        RangePickerStatus: true
      });
      this.setState({
        dataItem: "none"
      });
    } else {
      this.changeDateByItem(value);
      this.setState({
        dataItem: value
      });
    }
  };
  onOk = value => {
    const { onDateOk } = this.props;
    this.setState({
      RangePickerStatus: false
    });
    onDateOk(value[0], value[1]);
  };
  componentDidMount() {
    this.changeDateByItem();
  }
  disabledDate(current) {
    // Can not select days after today
    return current > moment().endOf("day");
  }

  render() {
    const { dataItemList, dataItem, RangePickerStatus } = this.state;
    const { dataStyle } = this.props;

    return (
      <div
        style={{
          //   background: "#fff",
          //   position: "absolute",
          //   textAlign: "right",
          width: "100%",
          zIndex: "1",
          //   right: 0,
          ...dataStyle
        }}
      >
        <div className="row">
          <div className="col-xs-8 col-sm-6">
            <Radio.Group value={dataItem} onChange={this.handleSizeChange}>
              {dataItemList.map(dateItem => (
                <Radio.Button value={dateItem} key={dateItem}>
                  {tu(`${dateItem}day`)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <div className="col-xs-4 col-sm-6 singleTimeRange">
            <RangePicker
              showTime={{
                format: "HH:mm:ss"
              }}
              format="YYYY-MM-DD HH:mm:ss"
              placeholder={["Start Time", "End Time"]}
              onOk={this.onOk}
              // open={RangePickerStatus}
              className={`position-absolute`}
              // disabledDate={this.disabledDate}
              // onBlur={() => {
              //   this.setState({
              //     RangePickerStatus: false
              //   });
              // }}
              style={{
                right: "1rem",
                width: "370px"
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    tokensInfo: state.tokensInfo
  };
}

const mapDispatchToProps = {
  updateTokenInfo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(DateSelect));
