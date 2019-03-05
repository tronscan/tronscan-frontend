import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import {QuestionMark} from "./QuestionMark";

class TotalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let {total, rangeTotal, typeText,common = false, intl, markName='table-question-mark'} = this.props;
        let tableInfoSmall = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: typeText});
        let tableInfoBig = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: typeText}) + '<br/>' +  '(' + intl.formatMessage({id: 'table_info_big'}) + ')';
        let tableInfo =  rangeTotal > 10000? tableInfoBig: tableInfoSmall;
        let tableInfoTipSmall = intl.formatMessage({id: 'table_info_big_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_big_tip2'}) + intl.formatMessage({id: 'table_info_big_tip4'});
        let tableInfoTipBig = intl.formatMessage({id: 'table_info_big_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_big_tip2'}) + intl.formatMessage({id: 'table_info_big_tip3'}) + intl.formatMessage({id: 'table_info_big_tip4'});
        let tableInfoTip = rangeTotal > 10000? tableInfoTipBig: tableInfoTipSmall;
        return (
            <Fragment>
                {
                    common? <div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>{tableInfo}
                    <span>
                            <QuestionMark placement="top" text="to_provide_a_better_experience"></QuestionMark>
                    </span>
                    </div>:<div className="table_pos_info d-none d-md-block" style={{left: 'auto'}}>
                        <span dangerouslySetInnerHTML={{__html:tableInfo}}></span>
                        <span className={rangeTotal > 10000? markName:"table-question-mark-small"}><QuestionMark placement="top" info={tableInfoTip} ></QuestionMark></span>
                    </div>
                }
            </Fragment>
        )
    }
}

export default injectIntl(TotalInfo);
