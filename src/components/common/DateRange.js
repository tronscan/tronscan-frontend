import React from "react";
import { injectIntl } from "react-intl";
import { DatePicker } from 'antd';
import moment from 'moment';
import {toastr} from 'react-redux-toastr'

class DateRange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            startValue: moment([2018,5,25]).startOf('day'),
            endValue: moment(),
            endOpen: false,
        };
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

        const { startValue, endValue, endOpen } = this.state;
        const { dateClass="date-range-box" } = this.props;

        return (
            <div className={dateClass}>
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
        );
    }
}

export default injectIntl(DateRange);
