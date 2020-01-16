import React, {Fragment} from "react";
import {alpha} from "../../utils/str";
import {Tooltip} from "reactstrap";
import {tu,t} from "../../utils/i18n";

export class QuestionMark extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            id: alpha(24),
        };
    }

    render() {
        let {open, id } = this.state;
        let {text, placement, testSecond ='', className='',info=''} = this.props;
        return (
            <div className="d-inline-block">
                <div className="question-mark" id={id}
                     onMouseOver={() => this.setState({open: true})}
                     onMouseOut={() => this.setState({open: false})}
                    >
                    <i>?</i>
                </div>
                <Tooltip placement={placement} isOpen={open} target={id} className={className} innerClassName="w-100">
                    {text?t(text):""}
                    {testSecond? <span><br/> {t(testSecond)}</span> :""}
                    {info?info:""}
                </Tooltip>
            </div>

        )
    }
}
