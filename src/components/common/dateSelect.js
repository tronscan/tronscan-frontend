import React from "react";
import { injectIntl } from "react-intl";
import moment from 'moment';
import { Button, Radio, Icon } from 'antd';

class DateRange extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
    }

   

    render() {
        return (
            <div>
            <Radio.Group value="small" onChange={this.handleSizeChange}>
              <Radio.Button>7</Radio.Button>
              <Radio.Button>14</Radio.Button>
              <Radio.Button>30</Radio.Button>
              <Radio.Button>更多</Radio.Button>
            </Radio.Group>
            </div>
        );
    }
}

export default injectIntl(DateRange);
