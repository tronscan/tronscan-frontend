import React,{Fragment} from "react";
import xhr from "axios/index";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {FormattedNumber, injectIntl} from "react-intl";
import {filter, includes} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import {TronLoader} from "../../common/loaders";
import PieReact from "../../common/PieChart";
import LineReact from "../../common/LineChart";
import {BigNumber} from 'bignumber.js'
import {cloneDeep} from "lodash";
import {tu} from "../../../utils/i18n";
import CountUp from 'react-countup';
import {Link} from "react-router-dom"
import {API_URL} from "../../../constants";
import { DatePicker, Select,Button,Tabs, Radio } from 'antd';
import SmartTable from "../../common/SmartTable.js"
import moment from 'moment';
import { upperFirst } from 'lodash'
import { CsvExport } from "../../common/CsvExport";

import isMobile from "../../../utils/isMobile";
import {
    ActiveAccountsChart
} from "../../common/LineCharts";


import {loadPriceData} from "../../../actions/markets";
import {t} from "../../../utils/i18n";
import '../../../styles/chart.scss'
const Option = Select.Option;
const { TabPane } = Tabs;



class ActiveAccount extends React.Component {
    constructor(props){
        super(props)

    }

    column = ()=>{
        let {intl} = this.props;
        let column = [
            {
                title: upperFirst(intl.formatMessage({id: 'chart_active_table_1'})),
                dataIndex: 'date',
                key: 'date',
                width: '60px',
                align: 'center',
                render: (text, record, index) => {
                  return <span>{text}</span>
                }
            },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_2'})),
            dataIndex: 'totalTransaction',
            key: 'totalTransaction',
            render: (text, record, index) => {
              return <FormattedNumber value={text}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_3'})),
            dataIndex: 'proportion',
            key: 'proportion',
            render: (text, record, index) => {
              return <FormattedNumber value={text}/>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_4'})),
            dataIndex: 'mom',
            key: 'mom',
            render: (text, record, index) => {
                return <span>
                    {text} %
                </span>


            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_5'})),
            dataIndex: 'totalTransaction',
            key: 'totalTransaction',
            render: (text, record, index) => {
                return <span>
                    {text} %

                </span>
            }
          },
          {
            title: upperFirst(intl.formatMessage({id: 'chart_active_table_6'})),
            dataIndex: 'amount',
            key: 'amount',
            render: (text, record, index) => {
                return <span>
                    
                </span>
            }
          }
        ];
        return column;
    }

    render(){
        let {data,chartHeight,intl,activeAccountParams,activeAccountCsvurl} = this.props;
        return (
            <Fragment>
                
                <div>
                    <div className="token_black">
                        <div className="col-md-12 table_pos" style={{padding:0}}>
                            <div className="pt-4 pb-2 d-flex justify-content-between">
                                <div>
                                    {
                                    intl.formatMessage({id:'chart_active_total'},{total:100})
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