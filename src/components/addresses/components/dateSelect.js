import React from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import { cloneDeep } from "lodash";
import {toastr} from 'react-redux-toastr'
import { Button, Radio, DatePicker } from "antd";
import isMobile from '../../../utils/isMobile'
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
      RangePickerStatus: false,
      startValue: moment(Date.now() - 7 * 24 * 3600 * 1000),
      endValue: moment(new Date()),
      endOpen: false,
    };
  }
  changeDateByItem(item) {
    const { onDateOk } = this.props;
    const { dataItem } = this.state;
    item = item || dataItem;
    // .hour(0).minute(0).second(0)
    const end = moment();
    const start = cloneDeep(end).subtract(item, "days");
    this.setState({
      startValue: start,
      endValue: end,
    })
    this.props.updateTokenInfo({
      start_timestamp: start.valueOf(),
      end_timestamp: end.valueOf()
    });
    onDateOk(start, end);
  }
  handleSizeChange = e => {
    const value = e.target.value;
  
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

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
        return startValue.valueOf() > moment().valueOf() || startValue.valueOf() < moment([2018,5,25]).valueOf();
    }


      return  startValue.valueOf() > endValue.valueOf() || startValue.valueOf() < moment([2018,5,25]).valueOf();
  }

  disabledEndDate = (endValue) => {
      const startValue = this.state.startValue;
      if (!endValue || !startValue) {
          return endValue.valueOf() > moment().valueOf();
      }
      return endValue.valueOf() <= startValue.valueOf() || endValue.valueOf() > moment().valueOf();
  }

  onChange = (field, value) => {
      this.setState({
          [field]: value,
      });
  }

  onStartChange = (value) => {
      this.onChange('startValue', value);
  }

  onEndChange = (value) => {
      this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
      if (!open) {
          this.setState({ endOpen: true });
      }
  }

  handleEndOpenChange = (open) => {
      this.setState({ endOpen: open });
  }

  handleOk = (startValue, endValue) =>{
      let { onDateOk, intl } = this.props;
      if(!startValue){
          toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'select_start_time'}));
          return;
      }else if(!endValue){
          toastr.warning(intl.formatMessage({id: 'warning'}), intl.formatMessage({id: 'select_end_time'}));
          return;
      }
      onDateOk(startValue, endValue)
  } 

  render() {
    const { dataItemList, dataItem, RangePickerStatus } = this.state;
    const { dataStyle } = this.props;

    const { startValue, endValue, endOpen } = this.state;

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
            <div className={`position-absolute mobileTimeRangeWrapper`}  style={isMobile? { width: "auto" }:{right:"1rem",width: "auto"}}>
              <DatePicker
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={startValue}
                    placeholder="Start"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                />
                &nbsp;&nbsp;~&nbsp;&nbsp;
                <DatePicker
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={endValue}
                    placeholder="End"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    onOk={() => this.handleOk(startValue, endValue)}
                />
              </div>
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
