import React from "react";
import {tu} from "../../../utils/i18n";
import xhr from "axios";
import {API_URL} from "../../../constants";
import { AddressLink} from "../../common/Links";
import {FormattedNumber, injectIntl} from "react-intl";
import { TronLoader } from "../../common/loaders";
import { ContractInvocationChart } from "../../common/LineCharts";
import { upperFirst } from 'lodash'
import SmartTable from "../../common/SmartTable.js"
import { Tooltip,Icon,DatePicker } from 'antd';

import moment from 'moment';

class Energy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      ContractInvocation: null,
      ContractInvocationChartData: null,
      loading: true,
      date: new Date().getTime() - 2 * 24*60*60*1000,
      total: 0
    };
  }

  componentDidMount() {
    this.loadContractInvocation();

    this.loadContractInvocationChart();
  }

  loadContractInvocationChart() {
    let {filter: {address}} = this.props
   
    let line1 =  xhr.get(API_URL + "/api/onecontracttriggerstatistic?address="+ address);
    let line2 =  xhr.get(API_URL + "/api/onecontractcallerstatistic?address="+ address);

    Promise.all([line1,line2]).then((result) => {
      let data = {
        trigger_amount: [],
        address_amount: []
      }
      result[0].data.data.pop()
      result[1].data.data.pop()

      result[0].data.data.map(item => {
        data.trigger_amount.push([item.day, item.amount])
      })
      result[1].data.data.map(item => {
        data.address_amount.push([item.day, item.amount])
      })
      this.setState({
        ContractInvocationChartData: data,
          loading: false
      });
  });
    

   
  }

  loadContractInvocation = async (page = 1, pageSize = 20) => {
    let {filter: {address}} = this.props
    let {date} = this.state
    let {data: {data, totalCallerAmount, total,contractMap}} = await xhr.get(API_URL + "/api/onecontractcallers", {params: {
      address,
      day: date,
      limit: pageSize,
      start: (page - 1) * pageSize,
    }})
    data.pop()
   

    data.map(item => {
      item.scale = ((item.amount / totalCallerAmount)*100).toFixed(2) + '%';
    })
    data.forEach(item=>{
      if(contractMap){
        contractMap[item.caller_address]? (item.ownerIsContract = true) :  (item.ownerIsContract = false)
      }
    })
    this.setState({
        ContractInvocation: data,
        loading: false,
        total
    });
  }

  disabledEndDate = (endValue) => {
    const startValue =  new Date().getTime() - 2*24*60*60*1000
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() > startValue.valueOf();
  }

  onChangeDate = (date, dateString) => {
    this.setState({
      date: date.valueOf()
    }, () => {
      this.loadContractInvocation()
    })
   
  }

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'caller'})),
        dataIndex: 'caller_address',
        key: 'caller_address',
        render: (text, record, index) => {
          return <span>
          {/*  Distinguish between contract and ordinary address */}
          {record.ownerIsContract? (
            <span className="d-flex">
              <Tooltip
                placement="top"
                title={upperFirst(
                    intl.formatMessage({
                    id: "transfersDetailContractAddress"
                    })
                )}
              >
                <Icon
                  type="file-text"
                  style={{
                  verticalAlign: 0,
                  color: "#77838f",
                  lineHeight: 1.4
                  }}
                />
              </Tooltip>
              <AddressLink address={text} isContract={true}></AddressLink>
            </span>
            ) : <AddressLink address={text}></AddressLink>
          }
        </span>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'call_time'})),
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record, index) => {
          return  <FormattedNumber value={text}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'call_scale'})),
        dataIndex: 'scale',
        key: 'scale',
        render: (text, record, index) => {
          return <span>{text}</span>
        }
      },
    ];
    return column;
  }

  render() {
    let {ContractInvocation, ContractInvocationChartData, loading, total, date} = this.state;
    let {intl} = this.props
    let column = this.customizedColumn()

    return (
        <main className="mt-5 p-0">
            {loading? <div className="loading-style" style={{marginTop: '-20px'}}><TronLoader/></div>:
              <div>
              <div className="pb-4">
              {
                ContractInvocation === null ? <TronLoader/> :
                <ContractInvocationChart 
                  source='singleChart'
                  style={{height: 500}}
                  data={ContractInvocationChartData}
                  intl={intl}
                />
              }
              </div>


              <DatePicker 
              onChange={this.onChangeDate}
              disabledDate={this.disabledEndDate}
              defaultValue={moment(new Date(date), 'YYYY-MM-DD')}/>

              <div className="token_black">
                <div className="col-md-12 table_pos">
                    {( !ContractInvocation || ContractInvocation.length === 0)?
                    <div className="p-3 text-center no-data">{tu("no_data")}</div>
                    :
                    <SmartTable 
                        bordered={true} 
                        column={column} 
                        data={ContractInvocation} 
                        total={total}
                        onPageChange={(page, pageSize) => {
                          this.loadContractInvocation(page, pageSize)
                        }}
                    />}
                </div>
              </div>
              
              </div>
          
            }
            
        </main>

    )
  }
}

export default injectIntl(Energy)