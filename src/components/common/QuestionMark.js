import {CopyToClipboard} from "react-copy-to-clipboard";
import React, {Fragment} from "react";
import {alpha} from "../../utils/str";
import {Tooltip} from "reactstrap";
import {tu,t} from "../../utils/i18n";

export class QuestionMark extends React.Component {

    constructor() {
        super();
        this.state = {
            open: false,
            id: alpha(24),
        };
    }

    render() {
        let {open, id } = this.state;
        let {text, placement} = this.props;

        return (
            <div>
                <div className="question-mark" id={id}
                     onMouseOver={() => this.setState({open: true})}
                     onMouseOut={() => this.setState({open: false})}>
                    <i>?</i>
                </div>
                <Tooltip placement={placement} isOpen={open} target={id}>
                    {t(text)}
                </Tooltip>
            </div>

        )
    }
}
