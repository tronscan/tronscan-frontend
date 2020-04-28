import React,{Fragment} from "react";
import {FormattedNumber} from "react-intl";
import {tu} from "../../../utils/i18n";
import {API_URL} from "../../../constants";
import { Select,Tabs } from 'antd';
import SmartTable from "../../common/SmartTable.js"
import { upperFirst } from 'lodash'
import { CsvExport } from "../../common/CsvExport";
import {QuestionMark} from "../../common/QuestionMark";
import '../../../styles/chart.scss'



class ActiveAccount extends React.Component {
    constructor(props){
        super(props)

    }

    column = ()=>{
        let {intl,activeAccountParams} = this.props;
        let {type} = activeAccountParams;
        
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'chart_active_table_1'})),
                dataIndex: 'day_string_type',
                key: 'day_string_type',
                align: 'center',
                render: (text, record, index) => {
                  return <span>{text}</span>
                }
            },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_2'})),
            dataIndex: 'active_count',
            key: 'active_count',
            render: (text, record, index) => {
              return <FormattedNumber value={text}/>
            }
          },
          {
            // title: upperFirst(intl.formatMessage({id: 'chart_active_table_3'})),
            title: (
                <div>
                  {upperFirst(intl.formatMessage({ id: "chart_active_table_3" }))}
                  <span className="ml-2">
                    <QuestionMark placement="top" text={`chart_active_per_tip_${type}`} />
                  </span>
                </div>
              ),
            dataIndex: 'proportion',
            key: 'proportion',
            render: (text, record, index) => {
              return <span>
                     {text} %
                </span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_4'})),
            dataIndex: 'mom',
            key: 'mom',
            render: (text, record, index) => {
                return (<span className={text > 0 ? 'text-success': text == 0 ? '' :'text-danger'}>
                    {text > 0 ? '+'+text : text} %
                </span>)
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_5'})),
            dataIndex: 'transactions',
            key: 'transactions',
            render: (text, record, index) => {
                return <span>
                    <FormattedNumber value={text}/> Txns
                </span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_6'})),
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record, index) => {
                return (
                <span>
                    {text} TRX <br/>
                    ≈ {record.usdAmount} USD
                </span>
                )
            }
          }
        ];
        return column;
    }

    render(){
        let {data,chartHeight,intl,activeAccountParams} = this.props;
        let activeAccountCsvurl = activeAccountParams && API_URL + "/api/account/active_statistic?start_day=" + activeAccountParams.start_day +"&end_day="+activeAccountParams.end_day + "&type="+activeAccountParams.type+'&format=scv';
        
        return (
            <Fragment>
                
                <div>
                    <div className="token_black">
                        <div className="col-md-12 table_pos" style={{padding:0}}>
                            <div className="pt-4 pb-2 d-flex justify-content-between">
                                <div>
                                    {
                                    intl.formatMessage({id:'chart_active_total_'+activeAccountParams.type},{total:data&&data.length})
                                    }
                                </div>
                                <div style={{marginTop:-20}}>
                                {activeAccountCsvurl && <CsvExport downloadURL={activeAccountCsvurl} />}
                                </div>
                            </div>
                            {
                                data && (( data.length === 0)?
                                <div className="p-3 text-center no-data">{tu("no_data")}</div>
                                :
                                <SmartTable 
                                    bordered={true} 
                                    column={this.column()} 
                                    data={data}
                                    position="bottom"
                                />)
                            }
                        </div>
                    </div>
                </div>
            </Fragment>
            
        )        
    }
}

export default ActiveAccount