import React from "react";
import {tu} from "../../utils/i18n";
import { Switch } from 'antd';
import {QuestionMark} from "./QuestionMark";

export class SwitchToken extends React.Component {

    constructor() {
        super();
        this.state = {
            hideSmallCurrency: false,
        };
    }
    handleToggle = (prop) => {
        return (enable) => {
            this.setState({ [prop]: enable });
            this.props.handleSwitch(enable);
        };
    }


    render() {
        let {hideSmallCurrency} = this.state;
        let {text = "",hoverText = "",isHide = true} = this.props;
        return (
            <div className="card-title m-0 d-flex">
                <Switch checked={hideSmallCurrency} size="small" onChange={this.handleToggle('hideSmallCurrency')} />
                <p className="ml-2 mr-2">{tu(text)}</p>
                {
                    isHide?<div>
                        <QuestionMark placement="top" text={hoverText}/>
                    </div>:""
                }

            </div>
        )
    }
}
