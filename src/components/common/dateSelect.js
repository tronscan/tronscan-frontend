import React from "react";
import { injectIntl } from "react-intl";
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { Button, Radio, DatePicker } from 'antd';
import {tu} from "../../utils/i18n";

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
    changeDateByItem(item){
        const { onDateOk } = this.props
        const { dataItem } = this.state
        item = item || dataItem
        // .hour(0).minute(0).second(0)
        const end = moment();
        const start = cloneDeep(end).subtract(item,'days');
        onDateOk(start, end)
    }
    handleSizeChange = e => {
        const value = e.target.value
        if(value === 'more'){
            this.setState({RangePickerStatus: true})
            this.setState({dataItem: 'none'})
        }else{
            this.changeDateByItem(value)
            this.setState({dataItem: value})
        }
    }
    onOk = (value) => {
        const { onDateOk } = this.props
        this.setState({RangePickerStatus: false})
        onDateOk(value[0], value[1])
    }
    componentDidMount(){
        this.changeDateByItem()
    }
    disabledDate(current) {
        // Can not select days after today 
        return current > moment().endOf('day');
    }

    render() {
        const { dataItemList, dataItem, RangePickerStatus } = this.state
        const { dataStyle } = this.props

        return (
            <div className="single-transferall-container" style={{position: "absolute", top: '30px', textAlign: 'right',zIndex: '1', right: 0, ...dataStyle}}>
                <Radio.Group value={dataItem} onChange={this.handleSizeChange}>
                    {dataItemList.map(dateItem =>  (
                        <Radio.Button value={dateItem} key={dateItem}>{tu(`${dateItem}day`)}</Radio.Button>
                    ))}
                    <Radio.Button value="more">{tu('nav_more')}</Radio.Button>
                </Radio.Group>
                <br/>
                <RangePicker
                    showTime={{ format: 'HH:mm:ss' }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder={['Start Time', 'End Time']}
                    onOk={this.onOk}
                    open={RangePickerStatus}
                    className={`position-absolute`}
                    disabledDate={this.disabledDate}
                    onBlur={() => {this.setState({RangePickerStatus: false})}}
                    style={{top: 0, right: 0, zIndex: -1, opacity: 0}}
                    />
            </div>
        );
    }
}

export default injectIntl(DateSelect);
