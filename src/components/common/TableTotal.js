import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import {tv, tu} from "../../utils/i18n";
import {QuestionMark} from "./QuestionMark";

class TotalInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        let {total, rangeTotal, typeText,common = false, intl, markName='table-question-mark', top="26px", isQuestionMark = true, selected} = this.props;
        let tableInfoSmall = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: typeText});
        let tableInfoBig = intl.formatMessage({id: 'view_total'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: typeText}) + '<br/>(' + intl.formatMessage({id: 'table_info_big'}) + ')';
        let tableInfo =  rangeTotal > 10000? tableInfoBig : tableInfoSmall;
        //let tableInfoTipSmall = intl.formatMessage({id: 'table_info_big_tip1'}) + ' ' + rangeTotal + ' ' + intl.formatMessage({id: 'table_info_big_tip2'}) + intl.formatMessage({id: 'table_info_big_tip4'});
        let tableInfoTip = intl.formatMessage({id: 'table_info_new_tip'})
        return (    
            <Fragment>
                {
                    !selected?
                    common? <div className="table_pos_info d-none d-md-block" style={{left: 'auto', top}}>{tableInfo}
                    <span className="ml-1">
                            <QuestionMark placement="top" text="to_provide_a_better_experience"></QuestionMark>
                    </span>
                    </div>:<div className="table_pos_info d-none d-md-block" style={{left: 'auto', top}}>
                        {
                            rangeTotal > 10000?
                               <div>{tu('view_total')} {rangeTotal} {tu(typeText)}
                               {
                                  isQuestionMark? <QuestionMark placement="top" info={tableInfoTip}></QuestionMark>:''
                               }
                               <br/> <span>({tu('table_info_big1')}</span><span>{total}</span><span>{tu('table_info_big2')})</span></div>
                             : <span>{tu('view_total')} {rangeTotal} {tu(typeText)}</span>
                        }
                        <span className={rangeTotal > 10000? markName:"table-question-mark-small"}></span>
                    </div>:
                    <div className="table_pos_info d-none d-md-block" style={{left: 'auto', top}}>
                        {
                            total !== 0?
                               <div>{tu('a_totle')} {total} {tu(typeText)} 
                               {isQuestionMark? <span className="ml-1"><QuestionMark placement="top" info={intl.formatMessage({id: 'select_tip'})}/></span>:''}
                                <br/>
                                <span>{tv('date_number_tip', {total: rangeTotal})}
                                    {rangeTotal>2000?<span>, {tu('date_list_tip')}</span>: ''}</span></div>
                             : <span>{tu('a_totle')} {total} {tu(typeText)}</span>
                        }
                       {/** <span className={rangeTotal > 10000? markName:"select_tip"}></span> */}
                    </div>
                }
            </Fragment>
        )
    }
}

export default injectIntl(TotalInfo);
